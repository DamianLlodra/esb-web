<template>
  <div class="">
    <v-virtual-scroll
      ref="vs"
      :items="paginator.data"
      item-height="50"
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
            <v-list-item-title>
              {{ item.producto }}
            </v-list-item-title>
            <v-list-item-subtitle> {{ item.lista }} </v-list-item-subtitle>
          </v-list-item>
        </nuxt-link>
      </template>
    </v-virtual-scroll>

    <v-bottom-navigation class="mt-3" fixed color="primary">
      <v-btn :enabled="currentPage > 1" @click="previusPag()">
        <v-icon>mdi-arrow-left</v-icon></v-btn
      >
      <div class="flex items-center">
        <input v-model="search" placeholder="Buscar producto" type="text" />
        <v-btn><v-icon>mdi-magnify</v-icon></v-btn>
      </div>
      <v-btn :enabled="currentPage > 1" @click="nextPage()">
        <v-icon>mdi-arrow-right</v-icon></v-btn
      >
    </v-bottom-navigation>
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
      currentPage: 1,
      itemsPerPage: 3,
      hasMore: true,
      search: '',
      paginator: { data: [] },
    };
  },
  async created() {
    const paginator = this.$dal.getPaginator(
      'products',
      'id',
      this.itemsPerPage
    );

    this.paginator = await this.$dal.getFirstPage(paginator);
  },
  methods: {
    async previusPage() {
      this.paginator = await this.$dal.getPreviusPage(this.paginator);
    },
    async nextPage() {
      this.paginator = await this.$dal.getNextPage(this.paginator);
      console.log(this.paginator);
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
