<template>
  <v-responsive>
    <v-row>
      <v-col
        v-for="item in subcategories"
        :key="item.id"
        class="d-flex child-flex"
        :cols="12"
      >
        <v-lazy
          v-model="isActive"
          :options="{
            threshold: 0.5,
          }"
          transition="fade-transition"
        >
          <v-sheet
            min-height="40"
            elevation="6"
            class="d-flex flex-column justify-center align-center"
            @click="goTo('/category/' + category + '/' + item.id)"
          >
            <!--         <v-img
              v-if="item.picture"
              max-width="96"
              max-height="96"
              :src="item.picture"
              class="mx-auto rounded-circle"
            ></v-img> -->
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
          picture: r.picture,
        };
      });
      this.subcategories = res2;
    },
    goTo(url) {
      this.$router.push(url);
    },
  },
};
</script>

<style></style>
