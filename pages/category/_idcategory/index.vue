<template>
  <v-responsive>
    <v-row>
      <v-col
        v-for="item in subcategories"
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
            @click="goTo('/category/' + category + '/' + item.id)"
            class="d-flex flex-column justify-center align-center"
          >
            <v-img :src="item.picture" class="mx-auto rounded-circle"></v-img>
            <span class="text-center">{{ item.name }}</span>
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
      category: '',
      subcategories: [],
      cols: 4,
      isActive: false,
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
    this.category = this.$route.params.idcategory;
    this.loadSubCategories();
  },
  methods: {
    async loadSubCategories() {
      const res = await this.$dal.getSubcategoriesByCategory(
        this.$route.params.idcategory
      );
      
      const res2 = res.map((r) => {
        return {
          id: r.id,
          name: r.name,
          picture:
            r.picture ||
            'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2fina.png?alt=media',
        };
      });
      console.table(res2);
      this.subcategories = res2;
    },
    goTo(url) {
      this.$router.push(url);
    },
  },
};
</script>

<style>
</style>