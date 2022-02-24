<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex>
          <v-card class="mx-auto">
            <v-card-title>
              <span class="headline">
                <v-icon>mdi-database</v-icon>
                <span>Importar Productos</span>
              </span>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-file-input
                  v-model="file"
                  class="mb-2"
                  label="Seleccionar archivo"
                  prepend-icon="mdi-file-upload"
                  accept=".csv"
                  color="primary"
                  hide-details
                ></v-file-input>
                <!-- <div v-for="header in headersConfig" :key="header.name">
                  <v-checkbox
                    v-model="header.import"
                    :label="header.text"
                    color="primary"
                  ></v-checkbox>
                </div> -->
                <v-checkbox
                  v-model="actualizarNombres"
                  label="Descripciones"
                  color="primary"
                ></v-checkbox>
                <v-checkbox
                  v-model="actualizarPrecios"
                  label="Precios"
                  color="primary"
                ></v-checkbox>
                <v-checkbox
                  v-model="actualizarCategorias"
                  label="Categorias y Subcategorias"
                  color="primary"
                ></v-checkbox>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                color="primary"
                @click="updateProducts"
                :disabled="!file"
              >
                <v-icon left>mdi-file-upload</v-icon>
                Importar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
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
      progressCSV: 1,
      selectedProduct: {},
      currentPage: 1,
      itemsPerPage: 3,
      hasMore: true,
      actualizarNombres: false,
      actualizarPrecios: true,
      actualizarCategorias: false,
      headersConfig: {},
    };
  },
  computed: {},
  async created() {
    const adminConf = await this.$dal.getById('config', 'admin');
    this.headersConfig = adminConf.columnsFromCSV.map((header) => {
      return {
        text: header,
        import: true,
      };
    });
  },
  methods: {
    async updateProducts() {
      const file = this.file;
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

      if (productsToUpdate.length > 0) {
        await this.$dal.saveAll('products', productsToUpdate);
      }

      if (this.actualizarCategorias) {
        const categoriesToUpdate = this.compareCategories(
          categoriesFromCsv,
          categoriesFromDB
        );

        const subcategoriesToUpdate = this.compareSubcategories(
          subcategoriesFromCsv,
          subcategoriesFromDB
        );

        if (categoriesToUpdate.length > 0) {
          await this.$dal.saveAll('categories', categoriesToUpdate);
        }
        if (subcategoriesToUpdate.length > 0) {
          await this.$dal.saveAll('subcategories', subcategoriesToUpdate);
        }
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
    loadCsvAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const resultCsv = this.loadCsv(reader);
          resolve(resultCsv);
        };
      });
    },
    getHeaderToImport() {
      const validHeaders = ['id'];
      if (this.actualizarNombres) validHeaders.push('producto');
      if (this.actualizarPrecios) validHeaders.push('lista');
      if (this.actualizarCategorias) {
        validHeaders.push('familia');
        validHeaders.push('subfamilia');
      }

      return validHeaders;
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
        const headersToImport = this.getHeaderToImport();
        for (const p in obj) {
          if (headersToImport.includes(p)) {
            if (obj[p]) {
              product[p] = obj[p];
            }
          }
        }

        if (product.lista && this.actualizarPrecios) {
          const precio = Number(
            product.lista.replace('$', '').replace(',', '.').trim()
          );
          product.lista = precio;
        }

        if (this.actualizarCategorias) {
          if (product.familia) {
            product.familia = product.familia.replaceAll('/', '-');
            cat.add(product.familia);
            product.familia = product.familia.toLowerCase();
          }
          if (product.familia && product.subfamilia) {
            product.subfamilia = product.subfamilia.replaceAll('/', '-');
            subcat.add(product.familia + '-' + product.subfamilia);
            product.subfamilia = product.subfamilia.toLowerCase();
          }
        }
        productsFromCsv.push(product);
      }

      if (this.actualizarCategorias) {
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
      }
      return { productsFromCsv, categoriesFromCsv, subcategoriesFromCsv };
    },
  },
};
</script>

<style>
</style>