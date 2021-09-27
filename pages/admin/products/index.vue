<template>
  <div class="">
    <ul v-for="item of items" :key="item.id">
      <nuxt-link :to="'products/' + item.id">
        <list-item :title="item.nombre" :subtitle1="item.domicilio" />
      </nuxt-link>
    </ul>
    <div class="flex flex-col p-2">
      <button @click="New">Nuevo</button>
      <button>Importar</button>
      <input type="file" @change="loadFile" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { items: [], file: '' };
  },
  computed: {},
  methods: {
    loadFile(event) {
      const reader = new FileReader();
      reader.addEventListener('load', function (e) {
        this.file = e.target.result;
      });
      reader.readAsBinaryString(event.target.files[0]);
    },
    New() {
      this.$router.push('/admin/products/new');
    },
  },
};
</script>

<style></style>
