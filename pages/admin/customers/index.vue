<template>
  <div class="">
    <ul v-for="item of items" :key="item.id">
      <nuxt-link to="/custumers" >
        <list-item :title="item.nombre" :subtitle1="item.domicilio" />
      </nuxt-link>
    </ul>
  </div>
</template>

<script>
import ListItem from '~/components/ListItem.vue';
export default {
  components: { ListItem },
  data() {
    return {
      items: [
        { nombre: 'damian', domicilio: '465 990' },
        { nombre: 'Saulo', domicilio: 'no se, pero es en Olavarria' },
      ],
    };
  },
};
</script>

<style>
</style>