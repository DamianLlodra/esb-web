<template>
  <div
    class="
      flex flex-row
      p-1
      border border-solid border-black
      rounded-md
      bg-white bg-opacity-100
    "
  >
    <div class="md:flex-shrink-0">
      <img class="w-20 h-20 scale-0 rounded-md" :src="image" />
    </div>
    <div class="flex flex-col ml-2">
      <p>{{ title }}</p>
      <p>{{ subtitle }}</p>
      <div class="flex flex-row">
        <span v-if="amountLocal === 0" class="mr-2" @click="changeAmount(1)"
          >Pedir</span
        >
        <div v-if="amountLocal">
          <span class="mr-2">Pedir:</span>
          <button class="w-5" @click="changeAmount(-1)">-</button>
          <span class="mx-2">{{ amountLocal }}</span>
          <button class="w-5" @click="changeAmount(1)">+</button>
          <span class="mx-2">Importe: ${{ amountLocal * price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: { type: String, default: () => '' },
    title: { type: String, default: () => '' },
    subtitle: { type: String, default: () => '' },
    price: { type: Number, default: () => 0 },
    amount: { type: Number, default: () => 0 },
  },
  data() {
    return { amountLocal: this.amount };
  },
  watch: {
    amount(newVal) {
      this.amountLocal = newVal;
    },
  },
  methods: {
    changeAmount(amount) {
      this.amountLocal = this.amountLocal + amount;
      this.$emit('changeAmount', this.amountLocal);
    },
  },
};
</script>

<style></style>
