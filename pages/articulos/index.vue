<template>
  <div>
    <div class="flex bg w-full p-1">
      <div class="flex bg-white items-center">
        <img src="~/assets/lupa.svg" class="w-3 h-3 ml-2" alt="" />
        <input
          v-model="search"
          placeholder="Buscar producto"
          class="m-2 focus:outline-none"
          type="text"
        />
      </div>
      <div v-if="totalComprado" class="flex flex-col">
        Total:${{ totalComprado }}
      </div>
    </div>
    <div class="flex flex-wrap w-full">
      <ul
        v-for="item in filteredProducts"
        :key="item.id"
        class="p-1 xl:w-1/2 lg:w-1/2 w-full"
      >
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapState } from 'vuex';
import itemCatalogue from '~/components/itemCatalogue.vue';

export default {
  components: { itemCatalogue },
  async asyncData({ $strapi }) {
    const products = await $strapi.$articulos.find();

    return {
      products: [
        {
          name: 'Aceite de Girasol "Pureza" x 950cc',
          price: 50,
          image:
            'https://www.conradomarket.com.ar/images/000000000000027514835Aceite-Pureza-Girasol-900ml.jpg',
          amount: 0,
        },
        {
          name: 'Aceite de Girasol "Cocinero" 1,5lt',
          price: 50,
          image:
            'https://www.almacenweb.com.ar/4563-large_default/aceite-girasol-cocinero-15-l.jpg',
          amount: 0,
        },
        {
          name: 'Aceite de Girasol "Pureza" x 950cc',
          price: 50,
          image:
            'https://www.conradomarket.com.ar/images/000000000000027514835Aceite-Pureza-Girasol-900ml.jpg',
          amount: 0,
        },
        {
          name: 'Aceite de Girasol "Cocinero" 1,5lt',
          price: 50,
          image:
            'https://www.almacenweb.com.ar/4563-large_default/aceite-girasol-cocinero-15-l.jpg',
          amount: 0,
        },
        {
          name: 'Aceite de Girasol "Pureza" x 950cc',
          price: 50,
          image:
            'https://www.conradomarket.com.ar/images/000000000000027514835Aceite-Pureza-Girasol-900ml.jpg',
          amount: 0,
        },
        {
          name: 'Aceite de Girasol "Cocinero" 1,5lt',
          price: 50,
          image:
            'https://www.almacenweb.com.ar/4563-large_default/aceite-girasol-cocinero-15-l.jpg',
          amount: 0,
        },
        {
          name: 'Aceite de Girasol "Pureza" x 950cc',
          price: 50,
          image:
            'https://www.conradomarket.com.ar/images/000000000000027514835Aceite-Pureza-Girasol-900ml.jpg',
          amount: 0,
        },
        {
          name: 'Aceite de Girasol "Cocinero" 1,5lt',
          price: 50,
          image:
            'https://www.almacenweb.com.ar/4563-large_default/aceite-girasol-cocinero-15-l.jpg',
          amount: 0,
        },
      ],
    };
  },
  data() {
    return { products: [], search: '' };
  },

  computed: {
    filteredProducts() {
      const productsFiltered = this.products.filter((product) =>
        product.name.includes(this.search, 0)
      );

      if (productsFiltered) {
        for (const item of this.cart) {
          const product = productsFiltered.find(
            (product) => product.name === item.name
          );
          if (product) product.amount = item.amount;
        }
      }
      return productsFiltered;
    },
    ...mapState({
      cart: (state) => state.cart.cart,
    }),
    ...mapGetters({
      totalComprado: 'totalComprado',
    }),
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

<style lang="postcss" scoped>
.bg {
  background: #72727279;
}
</style>
