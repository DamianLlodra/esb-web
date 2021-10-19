<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6"> Application </v-list-item-title>
        <v-list-item-subtitle> subtext </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        @click="to(item.path)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'Catalogo', icon: 'mdi-view-dashboard', path: '/catalogue' },
        { title: 'Carrito', icon: 'mdi-cart', path: '/cart' },
        { title: 'Mis compras', icon: 'mdi-image', path: '/customer/orders' },
        { title: 'Mis datos', icon: 'mdi-account', path: '/customer/profile' },
      ],
    };
  },
  methods: {
    to(path) {
      this.$router.push(path);
    },
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style></style>
