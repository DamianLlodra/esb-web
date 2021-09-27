<template>
  <div class="flex flex-col">
    <form-generic :view-config="viewConfig" :model="data"></form-generic>
    <button>Grabar</button>
  </div>
</template>

<script>
import FormGeneric from '~/components/FormGeneric.vue';
export default {
  components: { FormGeneric },
  asyncData() {
    return {
      data: {},
      viewConfig: { id: {}, descripcion: {}, precio: {}, imagen: {} },
    };
  },
};
</script>

<style></style>
