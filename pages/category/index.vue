<template>
  <v-responsive>
    <v-row>
      <v-col
        v-for="item in categories"
        :key="item.id"
        class="d-flex child-flex"
        :cols="12 / itemsPerRow"
      >
        <v-lazy
          v-model="isActive"
          :options="{
            threshold: 0.5,
          }"
          min-height="96"
          transition="fade-transition"
        >
          <v-sheet
            elevation="18"
            class="d-flex flex-column justify-center align-center rounded-xl"
            @click="goTo('/category/' + item.id)"
          >
            <v-img
              :src="item.picture"
              class="mx-auto rounded-circle"
              max-width="96"
              max-height="96"
            ></v-img>
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
      categories: [],
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
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      const res = await this.$dal.getAll('categories');
      const res2 = res.map((r) => {
        return {
          id: r.id,
          name: r.name,
          picture:
            r.picture ||
            'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2fina.png?alt=media',
        };
      });
      this.categories = res2;
    },
    goTo(url) {
      this.$router.push(url);
    },
  },
};
</script>

<style></style>
