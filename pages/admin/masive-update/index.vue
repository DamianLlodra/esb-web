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
              <v-file-input
                v-model="file"
                class="mb-2"
                label="Seleccionar archivo"
                prepend-icon="mdi-file-upload"
                accept=".xlsx"
                color="primary"
                hide-details
              ></v-file-input>
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
              <!-- <v-checkbox
                v-model="actualizarCategorias"
                label="Categorias y Subcategorias"
                color="primary"
              ></v-checkbox> -->
              <v-text-field
                label="Fecha de Reparto"
                type="date"
                v-model="proximaFechaDeReparto"
                @change="saveFechaReparto"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                color="primary"
                :disabled="!file || !proximaFechaDeReparto"
                @click="updateProducts"
                ><div>
                  <v-progress-circular
                    v-if="loading"
                    color="green"
                    indeterminate
                    rounded
                    height="6"
                  ></v-progress-circular>
                  <v-icon left>mdi-file-upload</v-icon>
                </div>
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
import { utils, read } from 'xlsx';

export default {
  data() {
    return {
      items: [],
      file: null,
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
      loading: false,
      proximaFechaDeReparto: '',
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
    async saveFechaReparto() {
      await this.$dal.save('params', {
        id: '1',
        proximaFechaDeReparto: this.proximaFechaDeReparto,
      });
    },
    async updateProducts() {
      const file = this.file;
      await this.uploadToFirebase(file);
      if (!file) {
        return;
      }
      this.loading = true;
      const { productsFromCsv, categoriesFromCsv, subcategoriesFromCsv } =
        await this.loadXLSXAsync(file);

      if (productsFromCsv.length === 0) return;

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

      this.loading = false;
      this.$alertify.success('Productos actualizados');
    },
    compareProducts(productsFromCsv, productsFromDB) {
      const productsToUpdate = [];
      const lastUpdate = new Date();

      productsFromCsv.forEach((productCsv) => {
        const productFromDB = productsFromDB.find(
          (productFromDB) => productFromDB.id === productCsv.id
        );
        if (productFromDB) {
          if (productFromDB.imagenFrom)
            productCsv.imageFrom = productFromDB.imagenFrom;
          else productCsv.imageFrom = '';

          if (
            productFromDB.lista !== productCsv.lista ||
            productFromDB.precio1 !== productCsv.precio1 ||
            productFromDB.precio2 !== productCsv.precio2 ||
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

      productsFromDB.forEach((productFromDB) => {
        const productCsv = productsFromCsv.find(
          (productCsv) => productCsv.id === productFromDB.id
        );
        if (!productCsv) {
          productFromDB.hayStock = false;
          productsToUpdate.push({ ...productFromDB, lastUpdate });
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
    loadXLSXAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          const ddata = new Uint8Array(e.target.result);
          const workbook = read(ddata, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const json = utils.sheet_to_json(worksheet, {
            blankrows: false,
            header: 1,
          });
          json.splice(0, 7);
          const datos = json;

          const resultCsv = this.loadCsv(datos);
          resolve(resultCsv);
        };
      });
    },

    getHeaderToImport() {
      const validHeaders = ['id'];
      if (this.actualizarNombres) validHeaders.push('producto');
      if (this.actualizarPrecios) {
        validHeaders.push('lista');
        validHeaders.push('precio1');
        validHeaders.push('precio2');
      }
      if (this.actualizarCategorias) {
        validHeaders.push('familia');
        validHeaders.push('subfamilia');
      }

      return validHeaders;
    },

    loadCsv(datos) {
      const productsFromCsv = [];
      const categoriesFromCsv = [];
      const subcategoriesFromCsv = [];
      const cat = new Set();
      const subcat = new Set();
      const lineas = datos;

      const headers = lineas[0].map((item) =>
        item.toLowerCase().replaceAll(' ', '')
      );

      const lines = lineas;
      for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i];
        if (!currentline[0]) continue;
        for (let j = 0; j < headers.length; j++) {
          if (headers[j] && currentline[j]) {
            const key = j === 0 ? 'id' : headers[j].trim();
            const value =
              key === 'id' ? currentline[j].toString() : currentline[j] || '';

            obj[key] = value;
          }
        }

        const product = { hayStock: true };
        const headersToImport = this.getHeaderToImport();
        for (const prop in obj) {
          const p = prop.toLowerCase();
          if (headersToImport.includes(p)) {
            if (obj[p]) {
              product[p] = obj[p];
            }
          }
        }
        if (product.producto) {
          product.nombreProducto = product.producto.toLowerCase().split(' ');
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
    async uploadToFirebase(file) {
      if (file) {
        const storage = this.$firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child('/xlsx/pedido.xlsx');

        try {
          await imageRef.put(file);
          this.$alertify.success('Archivo subido correctamente');
          this.$ref.inputFile.value = '';
        } catch (error) {
          console.log(error);
          this.$alertify.success('Error al subir el archivo');
        }
      } else {
        this.$alertify.error('Debe seleccionar un archivo.');
      }
    },
  },
};
</script>

<style></style>
