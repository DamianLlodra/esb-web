<template>
  <form-generic :model="data" :view-config="viewConfig"> </form-generic>
</template>

<script>
import FormGeneric from '~/components/FormGeneric.vue';
export default {
  components: { FormGeneric },
  data() {
    return { data: {} };
  },
  computed: {
    viewConfig() {
      return {
        id: {},
        nombre: {},
        domicilio: {},
        telefono: {},
        email: {},
      };
    },
  },
};
</script>

<style>
</style>