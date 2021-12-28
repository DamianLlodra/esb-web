<template>
  <!--  <div class="flex flex-row p-2 border border-black items-center">
    <div class="flex-col"></div>
    <div class="flex-col ">
      <p class="text-base">{{ title }}</p>
      <p class="text-sm">{{ subtitle1 }}</p>
      <p class="text-sm">{{ subtitle2 }}</p>
    </div>
  </div> -->
  <div class="bg-gray-100 rounded px-6">
    <div class="flex justify-between my-4">
      <div class="w-16">
        <img v-if="image" class="w-12 h-12 rounded-full" :src="image" />
      </div>
      <div class="flex-1 pl-2">
        <div class="text-gray-700 font-semibold">{{ title }}</div>
        <div class="text-gray-600 font-thin">{{ subtitle1 }}</div>
      </div>
    </div>
    <hr class="boder-b-0 my-4" />
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
    image: {
      type: String,
      default: () => '',
    },
  },
};
</script>

<style></style>
