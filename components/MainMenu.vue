<template>
  <div>
    <v-list-item>
      <v-list-item-avatar>
        <v-list-item-action>
          <v-btn icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          {{ displayName }}
        </v-list-item-title>
        <v-list-item-subtitle> {{ email }} </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
          Salir
        </v-btn>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>

    <v-list dense nav v-if="loged">
      <v-list-item
        v-for="(item, index) in itemsMenu"
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
import { mapState, mapSetter } from 'vuex';
export default {
  data() {
    return {
      // loged: true,
      // displayName: '',
      // email: '',
      items: [
        { title: 'Categorias', icon: 'mdi-folder-multiple', path: '/category' },
        { title: 'Productos', icon: 'mdi-shopping', path: '/catalogue' },
        {
          title: 'Destacados',
          icon: 'mdi-star',
          path: '/category/destacados/todos',
        },
        { title: 'Carrito', icon: 'mdi-cart', path: '/cart' },
        { title: 'Mis compras', icon: 'mdi-image', path: '/customer/orders' },
        { title: 'Mis datos', icon: 'mdi-account', path: '/customer/profile' },
        { title: '' },
      ],
      adminItems: [
        { title: 'Administracion' },
        {
          title: 'Configuracion y parametros',
          icon: 'mdi-cog',
          path: '/admin/params',
        },

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
  computed: {
    ...mapState({
      loged: (state) => !!state.user.user.email,
      user: (state) => state.user.user,
      displayName: (state) => state.user.user.displayName || '',
      email: (state) => state.user.user.email || '',
      isAdmin: (state) => state.user.user.isAdmin || false,
    }),
    itemsMenu() {
      return this.isAdmin ? [...this.items, ...this.adminItems] : this.items;
    },
  },
  methods: {
    to(path) {
      this.$router.push(path);
    },
    async logout() {
      await this.$store.commit('user/logout');
    },
  },
};
</script>

<style></style>
