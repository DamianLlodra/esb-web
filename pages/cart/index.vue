<template>
  <div class="bg-gray-300">
    <ul v-for="item in cart" :key="item.id" class="p-2">
      <item-catalogue
        :title="item.name"
        :subtitle="'Precio: $' + item.price"
        :image="item.image"
        :price="item.price"
        :amount="item.amount"
        @changeAmount="addOrder($event, item)"
      ></item-catalogue>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
import itemCatalogue from '~/components/itemCatalogue.vue';
export default {
  components: { itemCatalogue },
  computed: {
    ...mapState({
      cart: (state) => state.cart.cart,
    }),
    ...mapGetters(['totalComprado']),
  },
  mounted() {
    const lsCart = localStorage.getItem('cart');
    if (lsCart) {
      const cart = JSON.parse(lsCart);
      this.$store.commit('cart/load', cart);
    }
  },
  methods: {
    addOrder(amount, item) {
      this.$store.commit('cart/addChangeItemCart', { amount, item });
    },
  },
};
</script>
