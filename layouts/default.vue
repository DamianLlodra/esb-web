<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app absolute temporary>
      <main-menu></main-menu>
    </v-navigation-drawer>
    <v-app-bar app color="#4CAF50">
      <v-app-bar-nav-icon
        v-if="loged"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <v-divider class="mx-2" inset vertical></v-divider>

      <v-toolbar-title>
        <div @click="goTo('/')">
          <v-img class="rounded-lg" width="36" src="/favicon-32x32.png"></v-img>
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-divider class="mx-2" inset vertical></v-divider>
      <div color="white" v-if="loged" @click="goTo('/checkout')">
        <v-progress-circular
          :rotate="-90"
          color="primary"
          :value="percentPoints"
          >{{ points }}</v-progress-circular
        >
      </div>
      <v-divider class="mx-2" inset vertical></v-divider>
      <div v-if="loged" @click="goTo('/checkout')">
        <v-icon>mdi-cart</v-icon>${{ getTotal }}
      </div>
    </v-app-bar>

    <v-main>
      <Nuxt />
    </v-main>

    <!-- <v-footer app>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import MainMenu from '../components/MainMenu.vue';
import data from '../functions/data.js';

export default {
  components: { MainMenu },

  data: () => ({
    drawer: false,
    group: null,
    right: null,
    contador: 0,
  }),
  computed: {
    ...mapState({
      loged: (state) => state.user.user.email,
    }),
    ...mapGetters({
      totalComprado: 'cart/totalComprado',
    }),
    getTotal() {
      const total = this.totalComprado;
      return total[total.current];
    },
    percentPoints() {
      return 50;
    },
    points() {
      return 25;
    },
  },
  created() {
    // const lastForceUpdate = await this.$dal.getById('config', 'lastForceUpdate');
    // if (lastForceUpdate) {
    //   this.$dal.update('config', {
    //     lastForceUpdate: new Date(),
    //   });
    // }
    data.updateLocalCatalog(this);
  },
  async mounted() {
    const lsCart = localStorage.getItem('cart');
    if (lsCart) {
      const cart = JSON.parse(lsCart);
      this.$store.commit('cart/load', cart);
    }

    const param = await this.$dal.getById('params', '1');

    if (param) {
      this.$store.commit('cart/setParam', param);
    }
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    },
    load() {
      data.updateLocalCatalog(this);
    },
  },
};
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
