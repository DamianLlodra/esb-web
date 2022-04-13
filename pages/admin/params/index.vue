<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab>Descuentos</v-tab>
      <v-tab>Puntos</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <form-generic :model="data" :view-config="vcDescuentos"></form-generic>
      </v-tab-item>
      <v-tab-item>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <!-- <template v-slot:activator="{ on, attrs }">
          </template> -->
          <v-card>
            <form-generic
              :model="puntos"
              :view-config="vcPuntos"
            ></form-generic>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancelEditPuntos">
                Cerrar
              </v-btn>
              <v-btn color="blue darken-1" text @click="savePuntos">
                Grabar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-simple-table>
          <thead>
            <tr>
              <th>Desde $</th>
              <th>Hasta $</th>
              <th>Puntos</th>
              <th></th>
              <th>
                <v-btn x-small color="green" @click="addPuntos">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.puntos" :key="index">
              <td>${{ item.importeDesde }}</td>
              <td>${{ item.importeHasta }}</td>
              <td>{{ item.puntos }}</td>
              <td><v-icon @click="editPuntos(item)">mdi-file-edit</v-icon></td>
              <td><v-icon @click="deletePuntos(index)">mdi-delete</v-icon></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
    <v-card-actions class="justify-center">
      <v-btn @click="cancel">Cancelar</v-btn>
      <v-btn color="primary" @click="submit">Grabar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import FormGeneric from '../../../components/FormGeneric.vue';
export default {
  components: { FormGeneric },
  asyncData() {
    return {
      tab: null,
      vcDescuentos: {
        minimoPrecio1: {
          label: 'Compra Minima Precio 1',
          type: 'number',
          required: true,
          min: 0,
          max: 100000,
          defaultValue: 0,
          inputType: 'number',
          prefix: '$',
          suffix: '',
        },
        minimoPrecio2: {
          label: 'Compra Minima Precio 2',
          type: 'number',
          required: true,
          min: 0,
          max: 100000,
          defaultValue: 0,
          inputType: 'number',
          prefix: '$',
          suffix: '',
        },
      },
      vcPuntos: {
        importeDesde: {
          label: 'Importe Desde',
          type: 'number',
          required: true,
          min: 0,
          max: 100000,
          defaultValue: 0,
          inputType: 'number',
          prefix: '$',
          suffix: '',
        },
        importeHasta: {
          label: 'Importe Hasta',
          type: 'number',
          required: true,
          min: 0,
          max: 100000,
          defaultValue: 0,
          inputType: 'number',
          prefix: '$',
          suffix: '',
        },
        puntos: {
          label: 'Puntos',
          type: 'number',
          required: true,
          min: 0,
          max: 100000,
          defaultValue: 0,
          inputType: 'number',
          prefix: '',
          suffix: '',
        },
      },
    };
  },
  data() {
    return {
      tab: null,
      dialog: false,
      headers: [
        { text: 'Importe Desde', value: 'importeDesde' },
        { text: 'Importe Hasta', value: 'importeHasta' },
        { text: 'Puntos', value: 'puntos' },
      ],
      data: {
        id: 0,
        minimoPrecio1: 0,
        minimoPrecio2: 0,
        puntos: [],
      },
      puntos: {
        id: 0,
        importeDesde: 0,
        importeHasta: 0,
        puntos: 0,
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$dal.getAll('params').then((res) => {
        this.data = res[0];
        console.log(this.data);
      });
    },
    submit() {
      this.$dal.save('params', this.data).then((res) => {
        this.$alertify.success('Los datos fueron grabados');
      });
    },
    cancel() {
      this.loadData();
    },
    cancelEditPuntos() {
      this.dialog = false;
    },
    addPuntos() {
      this.puntos = {
        id: 0,
        importeDesde: 0,
        importeHasta: 0,
        puntos: 0,
      };
      if (this.data.puntos.length > 0) {
        this.puntos.importeDesde =
          this.data.puntos[this.data.puntos.length - 1].importeHasta + 1;
      }
      this.dialog = true;
    },
    savePuntos() {
      this.dialog = false;
      if (this.puntos.importeDesde > this.puntos.importeHasta) {
        this.$alertify.error(
          'El importe desde no puede ser mayor al importe hasta'
        );
        return;
      }
      if (this.puntos.puntos <= 0) {
        this.$alertify.error('El puntos debe ser mayor a 0');
        return;
      }
      // if (this.data.puntos.length > 0) {
      //   const last = this.data.puntos[this.data.puntos.length - 1];
      //   if (this.puntos.importeDesde <= last.importeHasta) {
      //     this.$alertify.error(
      //       'El importe desde debe ser mayor al importe hasta del ultimo registro'
      //     );
      //     return;
      //   }
      // }
      if (this.puntos.id === 0) {
        this.puntos.id = this.data.puntos.length + 1;
        this.data.puntos.push(this.puntos);
      }
    },
    editPuntos(item) {
      this.dialog = true;
      this.puntos = item;
    },
    deletePuntos(index) {
      this.data.puntos.splice(index, 1);
    },
  },
};
</script>

<style></style>
