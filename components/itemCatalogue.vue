<template>
  <div class="flex p-2 bg-white bg-opacity-100 shadow-g">
    <div class="md:flex-shrink-0">
      <img
        class="w-20 h-20 scale-0 rounded-md"
        :src="errorPicture ? noPicture : image"
        @error="errorPicture = true"
      />
    </div>
    <div class="flex flex-col ml-2">
      <p class="font-semibold">{{ title }}</p>
      <p class="font-bold">{{ subtitle }}</p>
      <div class="flex flex-row">
        <span
          v-if="amountLocal === 0"
          class="mr-2 p-1 bg rounded-lg cursor-pointer"
          @click="changeAmount(1)"
          >Agregar</span
        >
        <div v-if="amountLocal" class="flex items-center">
          <!-- <span class="mr-2 p-1 bg rounded-lg">Agregado</span> -->
          <button class="subtract" @click="changeAmount(-1)">-</button>
          <span class="mx-2">{{ amountLocal }}</span>
          <button class="add" @click="changeAmount(1)">+</button>
          <span class="mx-2">Importe: ${{ round(amountLocal * price) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../functions/util.js';
export default {
  props: {
    image: { type: String, default: () => '' },
    noPicture: { type: String, default: () => '' },
    title: { type: String, default: () => '' },
    subtitle: { type: String, default: () => '' },
    price: { type: Number, default: () => 0 },
    amount: { type: Number, default: () => 0 },
  },
  data() {
    return { amountLocal: this.amount, errorPicture: false };
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
    round(value) {
      return util.roundToTwo(value);
    },
  },
};
</script>

<style lang="postcss" scoped>
.shadow-b {
  -webkit-box-shadow: 0 8px 6px -6px black;
  -moz-box-shadow: 0 8px 6px -6px black;
  box-shadow: 0 8px 6px -6px black;
}
.shadow-g {
  -webkit-box-shadow: 0 8px 6px -6px green;
  -moz-box-shadow: 0 8px 6px -6px green;
  box-shadow: 0 8px 6px -6px green;
}
.bg {
  background: #91919185;
}
.bg:hover {
  background: #76a1de85;
}
.add {
  background: #42db42;
}
.subtract {
  background: #db4739;
}
.add,
.subtract {
  @apply rounded-full w-8 h-8 font-bold flex items-center justify-center focus:outline-none;
}
</style>
