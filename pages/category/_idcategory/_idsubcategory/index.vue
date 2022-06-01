<template>
  <v-responsive>
    <v-breadcrumbs>
      <v-breadcrumbs-item>
        <v-btn class="mb-2" color="primary" small @click="goTo('/category')">
          Categorias
        </v-btn>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        <v-btn
          class="mb-2"
          color="primary"
          small
          @click="goTo('/category/' + category)"
        >
          {{ category }}
        </v-btn>
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <v-row>
      <v-col
        v-for="item in products"
        :key="item.id"
        class="d-flex child-flex"
        :cols="12 / itemsPerRow"
      >
        <v-lazy
          v-model="isActive"
          :options="{
            threshold: 0.5,
          }"
          min-height="200"
          transition="fade-transition"
        >
          <v-sheet
            elevation="18"
            @click="
              goTo('/category/' + category + '/' + subcategory + '/' + item.id)
            "
            class="d-flex flex-column justify-center align-center"
          >
            <v-img
              class="mx-auto rounded-circle"
              contain
              max-width="96"
              max-height="96"
              :src="item.errorPicure ? nopicture : item.picture"
              @error="item.errorPicure = true"
            ></v-img>
            <span class="text-center">{{ item.name }}</span>
            <span class="text-center">${{ item.precio }}</span>
          </v-sheet>
        </v-lazy>
      </v-col>
    </v-row>
  </v-responsive>
</template>

<script>
export default {
  data() {
    return {
      nopicture:
        'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2fina.png?alt=media',
      products: [],
      cols: 4,
      isActive: false,
      category: '',
      subcategory: '',
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.beers.length / this.ipp);
    },
    rowsPerPage() {
      return this.rpp;
    },
    itemsPerRow() {
      let ipr = 0;
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          ipr = 2;
          break;
        case 'sm':
          ipr = 3;
          break;
        case 'md':
          ipr = 4;
          break;
        case 'lg':
          ipr = 6;
          break;
        case 'xl':
          ipr = 8;
          break;
      }
      return ipr;
    },
    ipp() {
      return Math.ceil(this.rowsPerPage * this.itemsPerRow);
    },
  },
  created() {
    const { idcategory, idsubcategory } = this.$route.params;
    this.category = idcategory;
    this.subcategory = idsubcategory;
    this.loadProducts();
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    },
    loadProducts() {
      const linkpicture =
        'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2F';

      const subcategories = JSON.parse(localStorage.getItem(this.subcategory));
      console.log(subcategories.products);
      this.products = subcategories.products
        .filter((item) => item.lista > 0 && item.hayStock)
        .map((r) => {
          return {
            id: r.id,
            name: r.producto,
            precio: r.lista,
            errorPicure: false,
            picture: r.picture
              ? linkpicture + r.picture + '?alt=media'
              : linkpicture + r.id + '.PNG?alt=media',
            hayStock: r.hayStock,
          };
        });
    },
  },
};
</script>

<style></style>
