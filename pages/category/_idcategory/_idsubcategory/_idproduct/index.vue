<template>
  <v-card>
    <v-img
      height="200px"
      contain
      :src="product.errorPicure ? nopicture : product.picture"
    ></v-img>
    <v-card-title
      class="text-wrap justify-center"
      style="word-break: break-word; text-align: center"
      v-text="product.name"
    >
    </v-card-title>

    <div class="d-flex justify-center mt-0">
      <p class="text-h4 mb-0 font-weight-bold">
        <span :class="textPrecio">$ {{ product.price }}</span>
      </p>
    </div>
    <!-- <div class="d-flex justify-center">
      <p class="text-caption mt-0 mb-1">Precio de lista final</p>
    </div> -->
    <v-spacer> </v-spacer>

    <v-sheet elevation="30" class="mt-1 align-center rounded-xl">
      <div
        v-if="product.price2"
        class="d-flex justify-center mt-0"
        elevation="21"
      >
        <p class="text-h4 mb-0 font-weight-bold">
          <span :class="textPrecio1">$ {{ product.price1 }}</span>
        </p>
      </div>

      <!-- <div class="d-flex justify-center mt-0">
        <p class="text-caption mt-0 mb-1">
          Precio oferta comprando mas de ${{ param.minimoPrecio1 }}
        </p>
      </div> -->
    </v-sheet>
    <v-spacer> </v-spacer>

    <div v-if="product.price2" class="d-flex justify-center mt-0">
      <p class="text-h4 mb-0 font-weight-bold">
        <span :class="textPrecio2">$ {{ product.price2 }} </span>
      </p>
    </div>
    <!-- <div class="d-flex justify-center mt-0">
      <p class="text-caption mt-0 mb-1">
        Precio oferta comprando mas de ${{ param.minimoPrecio2 }}
      </p>
    </div> -->

    <v-card-text v-if="puedeComprar" class="d-flex justify-center">
      <v-chip-group>
        <v-chip
          v-if="!product.amount && product.price"
          class="green ml-4"
          @click="changeAmount(1)"
          >Agregar al Pedido</v-chip
        >
        <v-chip v-if="product.amount" class="red ml-2" @click="changeAmount(-1)"
          ><v-icon>mdi-minus</v-icon></v-chip
        >
        <v-chip v-if="product.amount">
          <input
            :value="product.amount"
            style="text-align: center"
            @change="changeAmount($event.target.value)"
          />
        </v-chip>
        <v-chip v-if="product.amount" class="green" @click="changeAmount(1)"
          ><v-icon>mdi-plus</v-icon></v-chip
        >
      </v-chip-group>
    </v-card-text>
    <v-card-text v-else class="d-flex justify-center">
      No Puede tomar pedidos desde las {{ param.rules.horaDesde }}hs. hasta las
      {{ param.rules.horaHasta }}hs.
    </v-card-text>
    <v-card-title class="d-flex justify-center">
      <span v-if="product.amount">Importe: ${{ totalItemRounded }}</span>
    </v-card-title>

    <v-bottom-navigation fixed app v-if="cart.length > 0">
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
import util from '../../../../../functions/util';

export default {
  data() {
    return {
      productid: '',
      subcategoryid: '',
      product: {},
      nopicture:
        'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2fina.png?alt=media',
    };
  },
  computed: {
    ...mapState({
      cart: (state) => state.cart.cart,
    }),
    ...mapGetters({
      totalComprado: 'cart/totalComprado',
      param: 'cart/getParam',
    }),
    puedeComprar() {
      return util.puedeComprar(this.param.rules);
    },
    totalItemRounded() {
      const { current } = this.totalComprado;
      let price = this.product.price;
      if (current === 'totalPrecio1') price = this.product.price1;
      if (current === 'totalPrecio2') price = this.product.price2;

      return this.roundToTwo(this.product.amount * price);
    },
    textPrecio() {
      const { current } = this.totalComprado;
      if (current === 'totalLista') return '';
      else return 'text--secondary text-decoration-line-through';
    },
    textPrecio1() {
      const { current } = this.totalComprado;
      if (current === 'totalPrecio1') return '';
      else if (current === 'totalPrecio2')
        return 'text--secondary text-decoration-line-through';
      else return 'text--secondary';
    },
    textPrecio2() {
      const { current } = this.totalComprado;
      if (current === 'totalPrecio2') return '';
      else return 'text--secondary';
    },
  },
  created() {
    this.productid = this.$route.params.idproduct;
    this.subcategoryid = this.$route.params.idsubcategory;
    this.loadCart();
    this.load();
    this.loadParam();
  },
  methods: {
    loadCart() {
      const lsCart = localStorage.getItem('cart');
      if (lsCart) {
        const cart = JSON.parse(lsCart);
        this.$store.commit('cart/load', cart);
      }
    },
    loadParam() {
      const lsParam = localStorage.getItem('param');
      if (lsParam) {
        const param = JSON.parse(lsParam);
        this.$store.commit('cart/setParam', param);
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
            price1: r.precio1,
            price2: r.precio2,
            amount: 0,
            errorPicure: false,
            picture: this.getPathPicture(r.id, r.picture),
          };
        });
      const productInCart = this.cart.filter(
        (prod) => prod.id === this.productid
      )[0];

      this.product = res[0];
      this.product.amount = productInCart ? productInCart.amount : 0;
    },
    changeAmount(amount) {
      if (typeof amount === 'string') {
        this.product.amount = parseInt(amount);
      } else {
        this.product.amount += amount;
      }
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
    getPathPicture(id, picture) {
      let filePiecture = picture;
      if (!filePiecture) {
        filePiecture = id + '.PNG';
      }

      const url =
        'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2f' +
        filePiecture +
        '?alt=media';

      return url;
    },
  },
};
</script>

<style></style>
