<template>
  <v-container>
    <v-subheader>Clientes</v-subheader>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="headline">{{ titulo }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="selectedItem.name"
            label="Nombre"
            required
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="saveItem()">
              Grabar
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div class="flex bg-white items-center">
      <img src="~/assets/lupa.svg" class="w-3 h-3 ml-2" alt="" />
      <input
        v-model="search"
        placeholder="Buscar Cliente"
        class="m-2 focus:outline-none"
        type="text"
      />
    </div>
    <v-virtual-scroll bench="3" :items="items" height="400" item-height="50">
      <template v-slot:default="{ item }">
        <v-list-item @click="editItem(item)">
          <v-list-item-content>
            <v-list-item-title>{{ item.nombre }}</v-list-item-title>
            <v-list-item-subtitle>{{
              item.domicilioEntrega
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>

    <v-btn color="green" top fab @click="newItem()">
      <v-icon>mdi-plus</v-icon></v-btn
    >
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      titulo: 'Clientes',
      dialog: false,
      items: [],
      selectedItem: {},
    };
  },
  created() {
    this.loadItems();
  },
  methods: {
    loadItems() {
      this.$dal.getAll('customer').then((items) => {
        this.items = items;
      });
    },
    goTo(path) {
      this.$router.push(path);
    },
    saveItem() {
      if (!this.selectedItem.id) {
        this.selectedItem.id = this.selectedItem.name
          .toLowerCase()
          .replaceAll(' ', '-');
      }
      this.$dal.save('customer', this.selectedItem).then(() => {
        this.loadItems();
        this.dialog = false;
      });
    },
    newItem() {
      this.titulo = 'Nuevo Cliente';
      this.selectedItem = {
        id: '',
        name: '',
      };
      this.dialog = true;
    },
    editItem(itemToEdit) {
      this.titulo = 'Editar Cliente';
      this.selectedItem = itemToEdit;
      this.dialog = true;
    },
  },
};
</script>

<style></style>
