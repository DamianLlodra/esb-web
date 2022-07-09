<template>
  <div class="">
    <div class="flex flex-col justify-center">
      <ul v-for="item of items" :key="item.id">
        <nuxt-link :to="'/admin/customers/' + item.id">
          <list-item :title="item.nombre" :subtitle1="item.domicilio" />
        </nuxt-link>
      </ul>
      <nuxt-link class="button" :to="'/admin/customers/new'">Nuevo</nuxt-link>
    </div>
  </div>
</template>

<script>
import ListItem from '~/components/ListItem.vue';
export default {
  components: { ListItem },
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.getItems();
  },
  methods: {
    getItems() {
      this.$dal.getAll('customers').then((items) => {
        this.items = items;
      });
    },
  },
};
</script>

<style></style>
