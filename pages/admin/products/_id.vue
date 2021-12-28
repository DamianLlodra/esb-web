<template>
  <div class="flex flex-col">
    <form-generic :view-config="viewConfig" :model="data"></form-generic>
    <button @click="save">Grabar</button>
  </div>
</template>

<script>
import FormGeneric from '~/components/FormGeneric.vue';
export default {
  components: { FormGeneric },
  asyncData() {
    return {
      data: {},
      viewConfig: { producto: {}, lista: {}, imagen: {}, stock: {} },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    save() {
      this.data.id =
        this.$route.params.id === 'new'
          ? this.data.nombre.replace(' ', '-')
          : this.$route.params.id;
      this.$dal.save('productos', this.data).then(() => {
        this.$router.push('/admin/products');
      });
    },
    loadData() {
      this.$dal.getById('products', this.$route.params.id).then((data) => {
        this.data = data;
      });
    },
  },
};
</script>

<style></style>
