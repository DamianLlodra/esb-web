<template>
  <v-container>
    <v-subheader>Categorias</v-subheader>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="headline">{{ titulo }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="selectedCategory.name"
            label="Nombre"
            required
          ></v-text-field>
          <v-card-actions>
            <v-btn
              color="blue darken-1"
              text
              @click="goTo('categories/' + selectedCategory.id)"
            >
              Subcategorias
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="saveCategory()">
              Grabar
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-virtual-scroll
      bench="3"
      :items="categorias"
      height="400"
      item-height="50"
    >
      <template v-slot:default="{ item }">
        <v-list-item @click="editCategory(item)">
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>

    <v-btn color="green" top fab @click="newCategory()">
      <v-icon>mdi-plus</v-icon></v-btn
    >
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      titulo: 'Categorias',
      dialog: false,
      categorias: [],
      selectedCategory: {},
    };
  },
  created() {
    this.loadCategories();
  },
  methods: {
    loadCategories() {
      this.$dal.getAll('categories').then((items) => {
        this.categorias = items;
      });
    },
    goTo(path) {
      this.$router.push(path);
    },
    saveCategory() {
      if (!this.selectedCategory.id) {
        this.selectedCategory.id = this.selectedCategory.name
          .toLowerCase()
          .replaceAll(' ', '-');
      }
      this.$dal.save('categories', this.selectedCategory).then(() => {
        this.loadCategories();
        this.dialog = false;
      });
    },
    newCategory() {
      this.titulo = 'Nueva categoria';
      this.selectedCategory = {
        id: '',
        name: '',
      };
      this.dialog = true;
    },
    editCategory(category) {
      this.titulo = 'Editar categoria';
      this.selectedCategory = category;
      this.dialog = true;
    },
  },
};
</script>

<style></style>
