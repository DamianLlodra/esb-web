<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab>Inicio</v-tab>
      <v-tab>Descuentos</v-tab>
      <v-tab>Puntos</v-tab>
      <v-tab>Premios</v-tab>

    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <form-generic :model="data.home" :view-config="vcHome"></form-generic>
      </v-tab-item>
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
      <v-tab-item>
        <v-dialog v-model="dialogCP" persistent max-width="600px">
          <!-- <template v-slot:activator="{ on, attrs }">
          </template> -->
          <v-card>
            <form-generic
              :model="canjePuntos"
              :view-config="vcCanjePuntos"
            ></form-generic>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancelEditCanjePuntos">
                Cerrar
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveCanjePuntos">
                Grabar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-simple-table>
          <thead>
            <tr>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Premio $</th>
              <th></th>
              <th>
                <v-btn x-small color="green" @click="addPuntos">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.canjePuntos" :key="index">
              <td>{{ item.puntosDesde }}</td>
              <td>{{ item.puntoseHasta }}</td>
              <td>{{ item.importe }}</td>
              <td>
                <v-icon @click="editCanjePuntos(item)">mdi-file-edit</v-icon>
              </td>
              <td>
                <v-icon @click="deleteCanjePuntos(index)">mdi-delete</v-icon>
              </td>
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
      vcHome: {
        title: {
          label: 'Titulo',
          defaultValue: '',
        },
        subtitle: {
          label: 'Subtitulo',
          defaultValue: '',
        },
        description: {
          label: 'Descripcion',
          defaultValue: '',
          inputType: 'textarea',
        },
      },
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
      vcCanjePuntos: {
        punosDesde: {
          label: 'Desde',
          type: 'number',
          required: true,
          min: 0,
          max: 100000,
          defaultValue: 0,
          inputType: 'number',
          prefix: '',
          suffix: '',
        },
        puntosHasta: {
          label: 'Hasta',
          type: 'number',
          required: true,
          min: 0,
          max: 100000,
          defaultValue: 0,
          inputType: 'number',
          prefix: '',
          suffix: '',
        },
        importe: {
          label: 'Importe',
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
      dialogCP: false,
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
        canjePuntos: [],
        home: {
          title: '',
          subtitle: '',
          description: '',
        },
      },
      puntos: {
        id: 0,
        importeDesde: 0,
        importeHasta: 0,
        puntos: 0,
      },
      canjePuntos: {
        id: 0,
        puntosDesde: 0,
        puntoseHasta: 0,
        importe: 0,
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$dal.getAll('params').then((res) => {
        const dataParams = res[0];
        if (!dataParams.home) {
          dataParams.home = {
            title: '',
            subtitle: '',
            description: '',
          };
        }
        this.data = dataParams;
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
    cancelEditCanjePuntos() {
      this.dialogCP = false;
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
    addCanjePuntos() {
      this.canjePuntos = {
        id: 0,
        puntosDesde: 0,
        puntoseHasta: 0,
        importe: 0,
      };
      if (this.data.canjePuntos.length > 0) {
        this.canjePuntos.puntosDesde =
          this.data.canjePuntos[this.data.canjePuntos.length - 1].puntosHasta + 1;
      }
      this.dialogCP = true;
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
      if (this.puntos.id === 0) {
        this.puntos.id = this.data.puntos.length + 1;
        this.data.puntos.push(this.puntos);
      }
    },
    saveCanjePuntos() {
      this.dialogCP = false;
      if (this.canjePuntos.puntosDesde > this.canjePuntos.puntoseHasta) {
        this.$alertify.error(
          'El puntos desde no puede ser mayor al puntos hasta'
        );
        return;
      }
      if (this.canjePuntos.importe <= 0) {
        this.$alertify.error('El importe debe ser mayor a 0');
        return;
      }
      if (this.canjePuntos.id === 0) {
        this.canjePuntos.id = this.data.canjePuntos.length + 1;
        this.data.canjePuntos.push(this.canjePuntos);
      }
    },
    editPuntos(item) {
      this.dialog = true;
      this.puntos = item;
    },
    editCanjePuntos(item) {
      this.dialogCP = true;
      this.canjePuntos = item;
    },
    deletePuntos(index) {
      this.data.puntos.splice(index, 1);
    },
    deleteCanjePuntos(index) {
      this.data.canjePuntos.splice(index, 1);
    },
  },
};
</script>

<style></style>
