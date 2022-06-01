<template>
  <v-responsive>
    <v-card>
      <v-card-title>Categorias</v-card-title>
      <v-text-field v-model="name" label="Categoria"></v-text-field>
      <v-btn @click="fixSubcategories">fixSubcategories</v-btn>
    </v-card>
  </v-responsive>
</template>

<script>
import saveas from 'file-saver';
export default {
  name: 'Categoria',
  methods: {
    async save() {
      const buildSubca = (name) => ({
        name: name.toUpperCase(),
        category: 'varios',
        id: 'varios-' + name.toLowerCase().replaceAll('/', '-'),
        lastUpdate: new Date(),
      });
      await this.$dal.saveAll('subcategories', [
        buildSubca('Plasticos'),
        buildSubca('accesorios para el cabello'),
      ]);
    },
    async deleteCatetgoryWithoutPicture() {
      const categories = await this.$dal.getAll('categories');
      for (const category of categories) {
        if (!category.picture) {
          await this.$dal.delete('categories', category.id);
        }
      }
    },
    async downloadbackupproducts() {
      const products = await this.$dal.getAll('products');

      saveas(products, 'products.json');
    },
    async fixSubcategories() {
      const categories = await this.$dal.getAll('categories');
      const subcategories = await this.$dal.getAll('subcategories');
      const products = await this.$dal.getAll('products');

      const productsBadCategory = products.filter(
        (product) => !categories.some((c) => c.id === product.familia)
      );
      for (const product of productsBadCategory) {
        const subcategory = subcategories.find((subcategory) =>
          subcategory.id.includes(product.subfamilia)
        );
        if (subcategory) {
          product.familia = subcategory.category;

          //await this.$dal.save('products', product);
        }
      }
      //console.log(productsBadCategory);
      await this.$dal.saveAll('products', productsBadCategory);
    },
  },
};
</script>

<style>
</style>