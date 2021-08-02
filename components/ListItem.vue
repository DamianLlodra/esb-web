<template>
  <div class="flex-row">
    <div class="flex-col"></div>
    <div class="flex-col">
      <p class="text-base">{{ title }}</p>
      <p class="text-sm">{{ subtitle1 }}</p>
      <p class="text-sm">{{ subtitle2 }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '',
    },
    subtitle1: {
      type: String,
      default: () => '',
    },
    subtitle2: {
      type: String,
      default: () => '',
    },
  },
};
</script>

<style></style>
