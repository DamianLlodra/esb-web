<template>
  <v-card>
    <v-img height="200px" contain :src="product.picture"></v-img>
    <v-card-title class="d-flex justify-center">{{
      product.name
    }}</v-card-title>

    <v-card-title class="d-flex justify-center">
      <v-spacer></v-spacer>
      <div>$ {{ product.price }}</div>
      <v-spacer></v-spacer>
    </v-card-title>

    <v-divider class="mx-2"></v-divider>

    <v-card-text class="d-flex justify-center">
      <v-chip-group>
        <v-chip
          v-if="!product.amount"
          class="green ml-2"
          @click="changeAmount(1)"
          >Agregar al Pedido</v-chip
        >
        <v-chip v-if="product.amount" class="red ml-2" @click="changeAmount(-1)"
          ><v-icon>mdi-minus</v-icon></v-chip
        >
        <v-chip v-if="product.amount"> {{ product.amount }}</v-chip>
        <v-chip v-if="product.amount" class="green" @click="changeAmount(1)"
          ><v-icon>mdi-plus</v-icon></v-chip
        >
      </v-chip-group>
    </v-card-text>
    <v-card-title class="d-flex justify-center">
      <span v-if="product.amount" class="mx-2"
        >Importe: ${{ totalItemRounded }}</span
      >
    </v-card-title>
    <!-- <v-card-title class="d-flex justify-center">
      <span v-if="product.amount" class="mx-2"
        >Total Comprado: ${{ totalComprado }}</span
      >
    </v-card-title> -->
    <v-bottom-navigation v-if="cart.length > 0">
      <v-btn @click="goTo('/category')">
        <span>Seguir Comprando</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>

      <v-btn @click="goTo('/checkout')">
        <span>Confirmar Pedido</span>
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      productid: '',
      subcategoryid: '',
      product: {},
    };
  },
  computed: {
    ...mapState({
      cart: (state) => state.cart.cart,
    }),
    ...mapGetters({
      totalComprado: 'cart/totalComprado',
    }),
    totalItemRounded() {
      return this.roundToTwo(this.product.amount * this.product.price);
    },
  },
  created() {
    this.productid = this.$route.params.idproduct;
    this.subcategoryid = this.$route.params.idsubcategory;
    this.loadCart();
    this.load();
  },
  methods: {
    loadCart() {
      const lsCart = localStorage.getItem('cart');
      if (lsCart) {
        const cart = JSON.parse(lsCart);
        this.$store.commit('cart/load', cart);
      }
    },
    load() {
      const subcategory = JSON.parse(localStorage.getItem(this.subcategoryid));
      const res = subcategory.products
        .filter((prod) => prod.id === this.productid)
        .map((r) => {
          return {
            id: r.id,
            name: r.producto,
            price: r.lista,
            amount: 0,
            picture:
              r.picture ||
              'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2fina.png?alt=media',
          };
        });
      const productInCart = this.cart.filter(
        (prod) => prod.id === this.productid
      )[0];

      this.product = res[0];
      this.product.amount = productInCart ? productInCart.amount : 0;
    },
    changeAmount(amount) {
      this.product.amount += amount;
      this.addOrder(this.product.amount, { ...this.product });
    },
    addOrder(amount, item) {
      this.$store.commit('cart/addChangeItemCart', { amount, item });
    },
    roundToTwo(num) {
      return +(Math.round(num + 'e+2') + 'e-2');
    },
    goTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style></style>
