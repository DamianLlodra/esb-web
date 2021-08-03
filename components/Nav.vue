<template>
  <nav class="flex items-center justify-between">
    <div class="flex flex-col text-center w-1/6">
      <p class="font-bold text-4xl">E S B</p>
      <p>distribuidora</p>
    </div>
    <div class="flex items-center w-4/12 justify-around">
      <button>Catálogo</button>
      <button>Mis pedidos</button>
      <button><img class="w-6" src="~/assets/cart.svg" alt="" /></button>
      <button>Mis datos</button>
      <button>Contactanos</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Nav',
};
</script>

<style lang="postcss" scoped>
nav {
  @apply h-16 w-full text-white;
  background: #282828;
}
button {
  @apply p-2 h-auto rounded-md;
  background: #76a1de85;
}
button:hover {
  background: #91919185;
}
</style>
