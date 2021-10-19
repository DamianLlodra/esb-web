<template>
  <div class="">
    <div class="flex flex-col justify-center">
      <ul v-for="item of items" :key="item.id">
        <nuxt-link :to="'/admin/customers/' + item.id">
          <list-item :title="item.nombre" :subtitle1="item.domicilio" />
        </nuxt-link>
      </ul>
      <nuxt-link class="button" :to="'new'">Nuevo</nuxt-link>
    </div>
  </div>
</template>

<script>
import ListItem from '~/components/ListItem.vue';
export default {
  components: { ListItem },
  data() {
    return {
      items: [
        { id: 1, nombre: 'damian', domicilio: '465 990' },
        { id: 2, nombre: 'Saulo', domicilio: 'no se, pero es en Olavarria' },
        { id: 3, nombre: 'otro', domicilio: 'pampa y la via' },
      ],
    };
  },
};
</script>

<style></style>
