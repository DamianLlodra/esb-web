<template>
  <div>
    <v-card>
      <v-toolbar flat color="yellow darken-2">
        <div class="flex bg-white items-center mr-2">
          <img src="~/assets/lupa.svg" class="w-3 h-3 ml-2" alt="" />
          <input
            v-model="search"
            placeholder="Buscar producto"
            class="m-2 focus:outline-none"
            type="text"
          />
        </div>
        <div class="justify-rigth">
          <div class="flex flex-col self-end font-semibold">
            <span class="text-xs"> Total: </span>
            ${{ totalComprado[totalComprado.current] }}
          </div>
        </div>
      </v-toolbar>

      <v-combobox
        v-model="selectedCategory"
        :items="categories"
        label="Categorias"
        class="m-2"
      />
      <v-virtual-scroll
        bench="100"
        :items="filteredProducts"
        height="400"
        item-height="155"
      >
        <template v-slot:default="{ item, index }">
          <v-lazy
            v-model="isActive"
            :options="{
              threshold: 0.5,
            }"
            min-height="200"
            transition="fade-transition"
          >
            <item-catalogue
              max-height="155"
              :key="index"
              :title="item.name"
              :subtitle="'Precio: $' + item.price"
              :image="item.image"
              :no-picture="noPicture"
              :price="item.price"
              :amount="item.amount"
              @changeAmount="addOrder($event, item)"
            ></item-catalogue>
          </v-lazy>
        </template>
      </v-virtual-scroll>
    </v-card>
    <v-bottom-navigation v-if="cart.length > 0">
      <v-btn @click="goToCheckout">
        <span>Confirmar Pedido</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapState } from 'vuex';
import itemCatalogue from '~/components/itemCatalogue.vue';

export default {
  components: { itemCatalogue },
  async asyncData() {
    return {
      products: [],
      selectedCategory: '',
      categories: [],
      search: '',
      noPicture:
        'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2fina.png?alt=media',
    };
  },
  data() {
    return {
      products: [],
      search: '',
      selectedCategory: '',
      categories: [],
      isActive: false,
    };
  },

  computed: {
    filteredProducts() {
      if (this.products.length === 0) {
        return [];
      }
      const productsFiltered = this.products.filter(
        (product) =>
          product.name &&
          product.category &&
          product.name.toUpperCase().includes(this.search.toUpperCase(), 0) &&
          product.category
            .toUpperCase()
            .includes(this.selectedCategory.toUpperCase(), 0)
      );

      if (productsFiltered.length > 0) {
        console.log(this.cart);
        for (const item of this.cart) {
          const product = productsFiltered.find(
            (product) => product.name === item.name
          );
          if (product) product.amount = item.amount;
        }
      }
      return [...productsFiltered];
    },
    ...mapState({
      cart: (state) => state.cart.cart,
    }),
    ...mapGetters({
      totalComprado: 'cart/totalComprado',
    }),
  },
  mounted() {
    this.loadCategories();
    this.updateLocalCatalog().then(() => {
      this.loadLocalCatalog();
      const lsCart = localStorage.getItem('cart');
      if (lsCart) {
        const cart = JSON.parse(lsCart);
        this.$store.commit('cart/load', cart);
      }
    });
  },
  methods: {
    // TODO: reparar esta pagina
    addOrder(amount, item) {
      this.$store.commit('cart/addChangeItemCart', { amount, item });
    },
    getProductsLocal() {
      const productsLocalJson = localStorage.getItem('products');
      let productsLocal = [];
      if (productsLocalJson) {
        productsLocal = JSON.parse(productsLocalJson);
      }
      return productsLocal;
    },
    async updateLocalCatalog() {
      const productsLocal = this.getProductsLocal();
      const lastDownload = localStorage.getItem('lastDownload');
      let productsFromDb = [];
      if (lastDownload) {
        const lastDownloadDate = new Date(lastDownload);
        productsFromDb = await this.$dal.getLastUpdateProducts(
          lastDownloadDate
        );
        if (productsLocal.lengt > 0) {
          productsFromDb.forEach((productDB) => {
            const productLocal = productsLocal.find(
              (productLocal) => productDB.id === productLocal.id
            );
            if (productLocal) {
              const { id, producto, familia, subfamilia, lista } = productLocal;
              productDB.id = id;
              productDB.producto = producto;
              productDB.familia = familia;
              productDB.subfamilia = subfamilia;
              productDB.lista = lista;
            }
          });
          localStorage.setItem('products', JSON.stringify(productsLocal));
        }
        localStorage.setItem('lastDownload', new Date().toString());
      } else {
        productsFromDb = await this.$dal.getAll('products');
        localStorage.setItem('products', JSON.stringify(productsFromDb));
        localStorage.setItem('lastDownload', new Date().toString());
      }
    },
    loadLocalCatalog() {
      const productsLocal = JSON.parse(localStorage.getItem('products'));
      const linkpicture =
        'https://firebasestorage.googleapis.com/v0/b/esb-web.appspot.com/o/fotos%2F';
      this.products = productsLocal.map((p) => {
        return {
          name: p.producto,
          price: p.lista,
          image: p.picture || linkpicture + p.id + '.PNG?alt=media',
          category: p.familia,
          subcategory: p.subfamilia,
        };
      });
    },
    loadCategories() {
      this.$dal.getAll('categories').then((categories) => {
        this.categories = categories.map((c) => c.name);
      });
    },
    goToCheckout() {
      this.$router.push({ name: 'checkout' });
    },
  },
};
</script>
