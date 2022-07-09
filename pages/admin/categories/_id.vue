<template>
  <v-container>
    <v-subheader>Subcategorias</v-subheader>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="headline">{{ titulo }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="selectedSubCategory.name"
            label="Nombre"
            required
            >{{ selectedSubCategory.category }}</v-text-field
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="saveSubCategory()">
              Grabar
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-virtual-scroll
      bench="3"
      :items="subcategorias"
      height="400"
      item-height="50"
    >
      <template v-slot:default="{ item }">
        <v-list-item @click="editSubCategory(item)">
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>

    <v-btn color="green" top fab @click="newSubCategory()">
      <v-icon>mdi-plus</v-icon></v-btn
    >
  </v-container>
</template>

<script>
//import saveas from 'file-saver';

export default {
  data() {
    return {
      titulo: 'Categorias',
      dialog: false,
      subcategorias: [],
      selectedSubCategory: {},
    };
  },
  created() {
    this.loadSubCategories();
  },
  methods: {
    loadSubCategories() {
      const categoryid = this.$route.params.id;

      this.$dal.getSubcategoriesByCategory(categoryid).then((items) => {
        this.subcategorias = items;
      });
    },
    goTo(path) {
      this.$router.push(path);
    },
    saveSubCategory() {
      if (!this.selectedSubCategory.id) {
        this.selectedSubCategory.id =
          this.$route.params.id +
          '-' +
          this.selectedSubCategory.name.toLowerCase().replaceAll(' ', '-');
      }
      this.$dal.save('subcategories', this.selectedSubCategory).then(() => {
        this.loadSubCategories();
        this.dialog = false;
      });
    },
    newSubCategory() {
      this.titulo = 'Nueva subcategoria';
      this.selectedSubCategory = {
        id: '',
        name: '',
        category: this.$route.params.id,
      };
      this.dialog = true;
    },
    editSubCategory(subcategory) {
      this.titulo = 'Editar subcategoria';
      this.selectedSubCategory = subcategory;
      this.dialog = true;
    },
  },
};
// export default {
//   name: 'Categoria',
//   methods: {
//     async save() {
//       const buildSubca = (name) => ({
//         name: name.toUpperCase(),
//         category: 'varios',
//         id: 'varios-' + name.toLowerCase().replaceAll('/', '-'),
//         lastUpdate: new Date(),
//       });
//       await this.$dal.saveAll('subcategories', [
//         buildSubca('Plasticos'),
//         buildSubca('accesorios para el cabello'),
//       ]);
//     },
//     async deleteCatetgoryWithoutPicture() {
//       const categories = await this.$dal.getAll('categories');
//       for (const category of categories) {
//         if (!category.picture) {
//           await this.$dal.delete('categories', category.id);
//         }
//       }
//     },
//     async downloadbackupproducts() {
//       const products = await this.$dal.getAll('products');

//       saveas(products, 'products.json');
//     },
//     async fixSubcategories() {
//       const categories = await this.$dal.getAll('categories');
//       const subcategories = await this.$dal.getAll('subcategories');
//       const products = await this.$dal
//         .getAll('products')
//         .filter((p) => !p.subfamilia && p.hayStock);

//       const productsBadCategory = products.filter(
//         (product) => !categories.some((c) => c.id === product.familia)
//       );
//       for (const product of productsBadCategory) {
//         const subcategory = subcategories.find((subcategory) =>
//           subcategory.id.includes(product.subfamilia)
//         );
//         if (subcategory) {
//           product.familia = subcategory.category;
//         }
//       }

//       await this.$dal.saveAll('products', productsBadCategory);
//     },
//   },
// };
</script>

<style></style>
