<template>
  <nav class="flex bg-green-400 items-center justify-between">
    <div class="flex flex-col text-center w-1/3">
      <p class="font-bold text-4xl">E S B</p>
      <p>distribuidora</p>
    </div>
    <div class="flex w-2/3 justify-around self-stretch">
      <button @click="to('/catalogue')">Catálogo</button>
      <button>Mis pedidos</button>
      <button @click="to('/cart')">
        Carrito<img class="w-6" src="~/assets/cart.svg" alt="" />
      </button>
      <button @click="to('/customer/profile')">Mis datos</button>
      <button>Contactanos</button>
      <button @click="logout">Salir</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Nav',
  methods: {
    to(path) {
      this.$router.push(path);
    },
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style lang="postcss" scoped>
nav {
  @apply h-16 w-full text-white;
}
button {
  @apply p-2 h-auto;
  background: bg-green-400;
}
button:hover {
  background: #91919185;
}
</style>
