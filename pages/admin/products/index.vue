<template>
  <div class="">
    <v-virtual-scroll
      ref="vs"
      :items="items"
      item-height="150"
      class="pa-0"
      style="max-height: calc(100vh - 200px)"
    >
      <template v-slot:default="{ item, index }">
        <nuxt-link :to="'products/' + item.id">
          <v-list-item
            :key="item.id"
            class="d-flex align-items-center"
            :class="{ 'bg-primary': item.id === selectedProduct.id }"
          >
            <v-list-title class="text-white">
              {{ item.name }}
            </v-list-title>
          </v-list-item>
          <!--  <list-item :title="item.producto" :subtitle1="'$' + item.lista" />-->
        </nuxt-link>
      </template>
    </v-virtual-scroll>

    <div class="flex flex-col p-2">
      <button @click="New">Nuevo</button>
      <button @click="Show">Importar</button>

      <input ref="file" type="file" @change="updateProducts" />
      <!--  <v-progress-linear v-model="progressCsv" color="blue-grey" height="25">
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear> -->
      <v-img :src="imagen"></v-img>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      file: '',
      imagen: '',
      categories: [],
      progressCSV: 0,
      selectedProduct: {},
    };
  },
  computed: {},
  created() {
    //this.load();
  },
  methods: {
    load() {
      this.$dal.getAll('products').then((res) => {
        this.items = res;
      });
    },
    async updateProducts() {
      const file = this.$refs.file.files[0];
      if (!file) {
        return;
      }

      const { productsFromCsv, categoriesFromCsv, subcategoriesFromCsv } =
        await this.loadCsvAsync(file);

      if (productsFromCsv.length === 0) {
        return;
      }
      const { productsFromDB, categoriesFromDB, subcategoriesFromDB } =
        await this.loadDBAsync();

      const productsToUpdate = this.compareProducts(
        productsFromCsv,
        productsFromDB
      );

      const categoriesToUpdate = this.compareCategories(
        categoriesFromCsv,
        categoriesFromDB
      );

      const subcategoriesToUpdate = this.compareSubcategories(
        subcategoriesFromCsv,
        subcategoriesFromDB
      );
      if (productsToUpdate.length > 0) {
        await this.$dal.saveAll('products', productsToUpdate);
      }
      if (categoriesToUpdate.length > 0) {
        await this.$dal.saveAll('categories', categoriesToUpdate);
      }
      if (subcategoriesToUpdate.length > 0) {
        await this.$dal.saveAll('subcategories', subcategoriesToUpdate);
      }
    },
    compareProducts(productsFromCsv, productsFromDB) {
      const productsToUpdate = [];
      const lastUpdate = new Date();

      productsFromCsv.forEach((productCsv) => {
        const productFromDB = productsFromDB.find(
          (productFromDB) => productFromDB.id === productCsv.id
        );
        if (productFromDB) {
          if (
            productFromDB.lista !== productCsv.lista ||
            productFromDB.producto !== productCsv.producto ||
            productFromDB.familia !== productCsv.familia ||
            productFromDB.subfamilia !== productCsv.subfamilia
          ) {
            productsToUpdate.push({ ...productCsv, lastUpdate });
          }
        } else {
          productsToUpdate.push({ ...productCsv, lastUpdate });
        }
      });
      return productsToUpdate;
    },
    compareCategories(categoriesFromCsv, categoriesFromDB) {
      const categoriesToUpdate = [];
      const lastUpdate = new Date();
      categoriesFromCsv.forEach((categoryCsv) => {
        const categoryFromDB = categoriesFromDB.find(
          (categoryFromDB) => categoryFromDB.id === categoryCsv.id
        );

        if (categoryFromDB) {
          if (categoryFromDB.name !== categoryCsv.name) {
            categoriesToUpdate.push({ ...categoryCsv, lastUpdate });
          }
        } else {
          categoriesToUpdate.push({ ...categoryCsv, lastUpdate });
        }
      });
      return categoriesToUpdate;
    },
    compareSubcategories(subcategoriesFromCsv, subcategoriesFromDB) {
      const subcategoriesToUpdate = [];
      const lastUpdate = new Date();
      subcategoriesFromCsv.forEach((subcategoryCsv) => {
        const subcategoryFromDB = subcategoriesFromDB.find(
          (subcategoryFromDB) => subcategoryFromDB.id === subcategoryCsv.id
        );
        if (subcategoryFromDB) {
          if (
            subcategoryFromDB.name !== subcategoryCsv.name ||
            subcategoryFromDB.categoryId !== subcategoryCsv.categoryId
          ) {
            subcategoriesToUpdate.push({ ...subcategoryCsv, lastUpdate });
          }
        } else {
          subcategoriesToUpdate.push({ ...subcategoryCsv, lastUpdate });
        }
      });
      return subcategoriesToUpdate;
    },
    async loadDBAsync() {
      const productsFromDB = await this.$dal.getAll('products');
      const categoriesFromDB = await this.$dal.getAll('categories');
      const subcategoriesFromDB = await this.$dal.getAll('subcategories');
      return { productsFromDB, categoriesFromDB, subcategoriesFromDB };
    },
    async loadCsvAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const resultCsv = this.loadCsv(reader);
          resolve(resultCsv);
        };
      });
    },
    loadCsv(reader) {
      const productsFromCsv = [];
      const categoriesFromCsv = [];
      const subcategoriesFromCsv = [];
      const csv = reader.result;
      const lines = csv.split('\r\n');
      const headers = lines[7]
        .toLowerCase()
        .split(';')
        .filter((item) => item);

      const cat = new Set();
      const subcat = new Set();
      for (let i = 8; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(';');
        if (!currentline[0]) continue;

        for (let j = 0; j < headers.length; j++) {
          if (headers[j] && currentline[j]) {
            obj[j === 0 ? 'id' : headers[j].trim()] = currentline[j]
              ? currentline[j].trim()
              : '';
          }
        }

        const product = {};

        for (const p in obj) {
          if (obj[p]) {
            product[p] = obj[p];
          }
        }

        if (product.lista) {
          const precio = Number(
            product.lista.replace('$', '').replace(',', '.').trim()
          );
          product.lista = precio;
        }

        if (product.familia) {
          cat.add(product.familia);
          product.familia = product.familia.toLowerCase();
        }
        if (product.familia && product.subfamilia) {
          subcat.add(product.familia + '-' + product.subfamilia);
          product.subfamilia = product.subfamilia.toLowerCase();
        }

        productsFromCsv.push(product);
      }
      cat.forEach((item) => {
        categoriesFromCsv.push({
          name: item,
          id: item.toLowerCase().replaceAll(' ', '-'),
        });
      });
      subcat.forEach((item) => {
        const [familia, subfamilia] = item.split('-');
        subcategoriesFromCsv.push({
          name: subfamilia,
          id: item.toLowerCase().replaceAll('/', '-'),
          category: familia.toLowerCase().replaceAll(' ', '-'),
        });
      });

      return { productsFromCsv, categoriesFromCsv, subcategoriesFromCsv };
    },

    loadFile(e) {
      const reader = new FileReader();
      const file = e.target.files[0]; // get the supplied file
      // if there is a file, set image to that file
      if (file) {
        reader.onload = () => {
          if (reader.readyState === 2) {
            this.uploadToFirebase(file);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
        // if there is no file, set image back to null
      } else {
        this.uploadToFirebase(null);
      }
    },
    uploadToFirebase(image) {
      if (image) {
        const storage = this.$firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child('/fotos/' + image.name);

        imageRef.put(image).then(() => {
          alert('Image uploaded successfully to Firebase.');
        });
      } else {
        alert('Please upload an image first.');
      }
    },
    New() {
      this.$router.push('/admin/products/new');
    },
    Show() {
      const storage = this.$firebase.storage();
      const storageRef = storage.ref();
      const imageRef = storageRef.child('aceite-Pureza-Girasol-900ml.jpg');
      imageRef
        .getDownloadURL()
        .then(function (url) {
          this.imagen = url;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
};
</script>

<style></style>
