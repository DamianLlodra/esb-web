<template></template>

<script>
export default {
  asyncData() {
    return { product: {} };
  },
  mounted() {
    this.$dal.getById('products', this.$route.params.id).then((product) => {
      this.product = product;
    });
  },
};
</script>

<style>
</style>