<template>
  <div class="div">
    <v-card>
      <v-card-text v-if="cart.length === 0">
        <v-alert :value="true" type="info" icon="mdi-cart" color="primary"
          >No hay productos en el carrito</v-alert
        >
      </v-card-text>
      <v-virtual-scroll bench="5" :items="cart" item-height="155" height="400">
        <template v-slot:default="{ item, index }">
          <item-catalogue
            max-height="155"
            :key="index"
            :title="item.name"
            :subtitle="'Precio: $' + item.price"
            :image="item.image"
            :price="item.price"
            :amount="item.amount"
            @changeAmount="addOrder($event, item)"
          ></item-catalogue>
        </template>
      </v-virtual-scroll>
    </v-card>
    <v-bottom-navigation v-if="cart.length > 0">
      <v-btn @click="removeAll">
        <v-icon>mdi-delete</v-icon>
        Eliminar todo
      </v-btn>
      <v-btn @click="goToCart">
        <v-icon>mdi-cart</v-icon>
        <span>Seguir Comprando</span>
      </v-btn>
      <v-btn @click="goToCheckout">
        <v-icon>mdi-check</v-icon>
        <span>Confirmar Pedido</span>
      </v-btn>
    </v-bottom-navigation>
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
    removeAll() {
      //TODO: add confirm alert
      this.$store.commit('cart/removeAll');
      //TODO: go to category
    },
    goToCart() {
      this.$router.push('/category/');
    },
    goToCheckout() {
      this.$router.push('/checkout');
    },
  },
};
</script>
