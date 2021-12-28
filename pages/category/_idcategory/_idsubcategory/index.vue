<template>
  <v-responsive>
    <v-breadcrumbs>
      <v-breadcrumbs-item>
        <v-btn @click="goTo('/category')" class="mb-2" color="primary" small>
          Categorias
        </v-btn>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        <v-btn
          @click="goTo('/category/' + category)"
          class="mb-2"
          color="primary"
          small
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
            @click="
              goTo('/category/' + category + '/' + subcategory + '/' + item.id)
            "
            class="d-flex flex-column justify-center align-center"
          >
            <v-img :src="item.picture" class="mx-auto rounded-circle"></v-img>
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
      //  const productsLocal = JSON.parse(localStorage.getItem('products'));
      const subcategories = JSON.parse(localStorage.getItem(this.subcategory));

      this.products = subcategories.products.map((r) => {
        return {
          id: r.id,
          name: r.producto,
          precio: r.lista,
          picture:
            r.picture ||
            'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2fina.png?alt=media',
        };
      });
    },
  },
};
</script>

<style>
</style>