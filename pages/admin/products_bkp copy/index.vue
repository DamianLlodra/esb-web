<template>
  <div>
    <v-data-table
      hide-default-footer
      :headers="headers"
      :items="paginator.data"
      :options.sync="options"
      :page.sync="page"
      :server-items-length="itemsPerPage"
      :loading="loading"
      class="elevation-1"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Productos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-combobox
            v-model="searchIn"
            :items="headers.filter((header) => header.canSearch)"
            label="Buscar en"
            hide-details
            item-value="value"
            item-text="text"
          ></v-combobox>
          <v-text-field
            v-model="searchValue"
            label="Valor buscado"
            single-line
            hide-details
          ></v-text-field>
          <v-btn small @click="search"><v-icon>mdi-magnify</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container style="max-height: 400px" class="overflow-y-auto">
                  <v-row>
                    <form-generic
                      :view-config="viewConfig"
                      :model="selectedProduct"
                    ></form-generic>
                  </v-row>
                  <v-row>
                    <div class="flex flex-row m-2 justify-center">
                      <div class="flex flex-col">
                        <v-file-input
                          label="Imagen"
                          accept="image/PNG"
                          prepend-icon="mdi-camera"
                          @change="loadFile"
                        ></v-file-input>
                      </div>
                    </div>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >¿Seguro desea borrar este producto?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="red darken-1" text @click="deleteItemConfirm"
                  >Eliminar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:item.imagen="{ item }">
        <v-img
          :src="url.replace(' ', item.id)"
          aspect-ratio="1"
          contain
          class="mx-auto"
        ></v-img>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-btn @click="previousPage" :disabled="paginator.page == 1">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ paginator.page }}
      <v-btn @click="nextPage"> <v-icon>mdi-arrow-right</v-icon> </v-btn>
    </div>
  </div>
</template>

<script>
import FormGeneric from '../../../components/FormGeneric.vue';
export default {
  components: { FormGeneric },
  asyncData() {
    return {
      viewConfig: {
        id: {},
        producto: {},
        familia: {
          inputType: 'select',
          options: [],
          itemText: 'name',
          itemValue: 'id',
          label: 'Familia',
          required: true,
        },
        subfamilia: {
          inputType: 'select',
          options: [],
          itemText: 'name',
          itemValue: 'id',
          label: 'Subfamilia',
          required: true,
        },
        lista: {
          inputType: 'number',
          label: 'Precio Lista',
          required: true,
          defaultValue: 0,
        },
        precio1: {
          inputType: 'number',
          label: 'Precio 1',
          required: true,
          defaultValue: 0,
        },

        precio2: {
          inputType: 'number',
          label: 'Precio 2',
          required: true,
          defaultValue: 0,
        },
        /* imagen: {
          inputType: 'file',
          label: 'Imagen',
          required: true,
          defaultValue: '',
        }, */
      },
    };
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: 'id', value: 'id', canSearch: true },
        { text: 'Producto', value: 'producto', canSearch: true },
        { text: 'Imagen', value: 'imagen' },
        { text: 'Lista', value: 'lista' },
        { text: 'Precio 1', value: 'precio1' },
        { text: 'Precio 2', value: 'precio2' },
        { text: 'Familia', value: 'familia', canSearch: true },
        { text: 'Subfamilia', value: 'subfamilia', canSearch: true },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      url: 'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2f .PNG?alt=media',
      items: [],
      selectedProduct: {},
      currentPage: 1,
      itemsPerPage: 6,
      pageCount: 3,
      page: 1,
      searchValue: '',
      searchIn: '',
      paginator: { data: [] },
      dialogDelete: false,
      dialog: false,
      formTitle: 'ABM de Productos',
      options: {},
      categories: [],
      subcategories: [],
    };
  },
  watch: {
    options: {
      handler() {
        this.getItems();
      },
      deep: true,
    },
    'selectedProduct.familia': {
      handler() {
        if (this.selectedProduct.familia) {
          this.getSubcategories();
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.initialize();
  },
  methods: {
    getItems() {},
    async previousPage() {
      this.paginator = await this.$dal.getPreviousPage(this.paginator);
    },
    async nextPage() {
      this.paginator = await this.$dal.getNextPage(this.paginator);
    },
    async initialize() {
      this.paginator = await this.$dal.getPaginator(
        'products',
        'id',
        this.itemsPerPage
      );
      this.paginator = await this.$dal.getFirstPage(this.paginator);
      this.viewConfig.familia.options = await this.$dal.getAll('categories');
      this.subcategories = await this.$dal.getAll('subcategories');
    },
    async search() {
      this.paginator = await this.$dal.getPaginator(
        'products',
        'id',
        this.itemsPerPage,
        this.searchIn.value,
        '>=',
        this.searchValue
      );
      this.paginator = await this.$dal.getFirstPage(this.paginator);
    },
    getSubcategories() {
      this.viewConfig.subfamilia.options = this.subcategories.filter(
        (subcategory) => subcategory.category === this.selectedProduct.familia
      );
    },
    close() {
      this.dialog = false;
    },
    deleteItem(item) {
      this.selectedProduct = item;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    editItem(item) {
      this.selectedProduct = item;
      this.getSubcategories();
      this.dialog = true;
    },
    deleteItemConfirm() {
      this.loading = true;
      this.$dal.delete('products', this.selectedProduct.id).then(() => {
        this.loading = false;
        this.dialogDelete = false;
        this.paginator = this.$dal.getFirstPage(this.paginator);
      });
    },
    save() {
      this.loading = true;
      this.$dal.save('products', this.selectedProduct).then(() => {
        this.loading = false;
        this.dialog = false;
        this.paginator = this.$dal.getFirstPage(this.paginator);
      });
    },
    New() {
      this.$router.push('/admin/products/new');
    },
    loadFile(file) {
      const reader = new FileReader();
      if (file) {
        const fileName = this.selectedProduct.id + '.PNG';
        file = this.renameFile(file, fileName);
        reader.onload = () => {
          if (reader.readyState === 2) {
            this.uploadToFirebase(file);
          }
        };
        reader.readAsDataURL(file);
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
          this.$alertify.success('Imagen subida correctamente');
        });
      } else {
        this.$alertify.error('Please upload an image first.');
      }
    },
    renameFile(originalFile, newName) {
      return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
    },
  },
};
</script>

<style></style>
