<template>
  <div>
    <v-card>
      <v-card-title>Pedidos</v-card-title>
      <v-card-text>
        <v-data-table
          hide-default-footer
          :headers="headers"
          :items="orders"
          class="elevation-1"
          dense
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field
                label="Fecha"
                type="date"
                single-line
                hide-details
                v-model="date"
              ></v-text-field>

              <v-btn small @click="load"><v-icon>mdi-magnify</v-icon></v-btn>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item.fecha="{ item }">
            {{ item.fecha.split('-').reverse().join('/') }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="download(item)"> mdi-cloud-download </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="orders.length == 0"
          color="primary"
          @click="downloadZip"
          >Descargar todo (.zip)</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { utils, writeFile, write, read } from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
export default {
  data() {
    return {
      date: '',
      orders: [],
      headers: [
        {
          text: 'Usuario',
          align: 'left',
          sortable: false,
          value: 'usuario',
        },
        {
          text: 'Direccion',
          align: 'left',
          sortable: false,
          value: 'direccion',
        },
        {
          text: 'Fecha',
          align: 'left',
          sortable: false,
          value: 'fecha',
        },
        {
          text: 'Total',
          align: 'left',
          sortable: false,
          value: 'total',
        },
        {
          text: 'Descuento',
          align: 'left',
          sortable: false,
          value: 'descuento',
        },
        {
          text: 'Puntos',
          align: 'left',
          sortable: false,
          value: 'puntos',
        },
        {
          text: 'Actions',
          align: 'left',
          sortable: false,
          value: 'actions',
        },
      ],
    };
  },
  created() {
    const today = new Date();
    this.date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      today.getDate().toString().padStart(2, '0');
    this.load();
  },
  methods: {
    async load() {
      this.orders = await this.$dal.getOrdersByDate(this.date);

      if (this.orders.length === 0)
        this.$alertify.error('No hay pedidos para la fecha seleccionada');
    },
    async generateXlsFromFile(order) {
      const fileXlsFromFirebasStore = await fetch(
        'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/xlsx%2Fpedido.xlsx?alt=media&token=3f94f2fc-df7a-4509-85ee-d7ac075b9f12'
      );

      const workbook = read(await fileXlsFromFirebasStore.arrayBuffer());

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const pedidos = order.productos.map((producto) => {
        return {
          id: producto.id,
          amount: producto.amount,
          ok: false,
        };
      });

      sheet['C4'] = { v: order.usuario + '-' + order.direccion };
      let row = 8;
      let ok = true;
      while (ok) {
        const cell = sheet['A' + row];
        if (cell) {
          const id = cell.v.toString();
          const pedido = pedidos.find((pedido) => pedido.id === id);
          if (pedido) {
            sheet['G' + row] = { v: pedido.amount };
            pedido.ok = true;
          }
        } else {
          ok = false;
        }

        if (!pedidos.some((pedido) => pedido.ok === false)) {
          ok = false;
        }

        row++;
      }

      const newWorkbook = utils.book_new();

      utils.book_append_sheet(newWorkbook, sheet, 'Pedido');

      return newWorkbook;
    },
    generateXlsx(order) {
      const rows = [];
      order.productos.forEach((product) => {
        rows.push({
          id: product.id,
          name: product.name,
          price: product[product.currentPrice],
          amuount: product.amount,
        });
      });

      const wb = utils.book_new();
      const ws = utils.json_to_sheet(rows);
      utils.book_append_sheet(wb, ws, 'Orders');
      return wb;
    },
    async download(order) {
      const wb = await this.generateXlsFromFile(order);

      writeFile(wb, order.id + '.xlsx');
    },
    async downloadZip() {
      const zip = new JSZip();
      const folder = zip.folder(this.date);
      for (const order of this.orders) {
        const filexls = await this.generateXlsFromFile(order);

        const fileWrite = write(filexls, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'binary',
        });

        folder.file(order.id + '.xlsx', fileWrite, { binary: true });
      }

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, this.date + '.zip');
      });
    },
  },
};
</script>

<style></style>
