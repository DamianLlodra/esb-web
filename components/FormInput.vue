<template>
  <div>
    <label :for="inputId">{{ label }}</label>
    <input :id="inputId" v-model="value" :type="type" />
  </div>
</template>

<script>
export default {
  propsData: {
    value: {
      type: String,
      default: () => '',
    },
  },
  props: {
    id: {
      type: String,
      default: () => '',
    },
    label: {
      type: String,
      default: () => '',
    },

    type: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    inputId: () => 'i_',
  },
};
</script>
<style></style>
