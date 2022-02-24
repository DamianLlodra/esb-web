<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{ displayName }}
        </v-list-item-title>
        <v-list-item-subtitle> {{ email }} </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav v-if="loged">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        link
        @click="to(item.path)"
      >
        <v-list-item-icon v-if="item.path">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content v-if="item.path">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>

        <v-subheader v-else>{{ item.title }}</v-subheader>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loged: true,
      displayName: '',
      email: '',
      items: [
        { title: 'Categorias', icon: 'mdi-folder-multiple', path: '/category' },
        { title: 'Productos', icon: 'mdi-shopping', path: '/catalogue' },
        { title: 'Carrito', icon: 'mdi-cart', path: '/cart' },
        { title: 'Mis compras', icon: 'mdi-image', path: '/customer/orders' },
        { title: 'Mis datos', icon: 'mdi-account', path: '/customer/profile' },
        { title: '' },
      ],
      adminItems: [
        { title: 'Administracion' },
        {
          title: 'Usuarios',
          icon: 'mdi-account-multiple',
          path: '/admin/users',
        },
        { title: 'Productos', icon: 'mdi-shopping', path: '/admin/products' },
        {
          title: 'Actualizacion masiva',
          icon: 'mdi-upload',
          path: '/admin/masive-update',
        },
        {
          title: 'Categorias',
          icon: 'mdi-folder-multiple',
          path: '/admin/categories',
        },
        { title: 'Pedidos', icon: 'mdi-shopping', path: '/admin/orders' },
      ],
    };
  },
  created() {
    const { displayName, email, isAdmin } = this.$store.state.user.user;
    this.displayName = displayName;
    this.email = email;
    if (isAdmin) {
      this.items = this.items.concat(this.adminItems);
    }
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
