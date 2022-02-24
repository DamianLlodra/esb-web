<template>
  <v-card>
    <v-card-title> Confirmar Pedido </v-card-title>
    <v-card-text class="text-h6"
      >Total a pagar: $ {{ totalComprado }}</v-card-text
    >
    <v-card-text class="text-h6">Fecha de entrega: {{ entrega }}</v-card-text>
    <v-card-text class="text-h6"
      >Dirección de entrega: {{ direccion }}</v-card-text
    >
    <v-card-actions>
      <v-btn color="primary" @click="verCompra">
        <span>Ver Compra</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
      <v-btn color="green" @click="confirmarPedido">
        <span>Confirmar</span>
        <v-icon>mdi-check</v-icon></v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      entrega: new Date().toLocaleDateString(),
      entregaId: new Date().toISOString().substring(0, 10),
      direccion: '', // TODO: obtener de la sesion, o de la base de datos. Valor requerido
    };
  },
  computed: {
    ...mapState({
      cart: (state) => state.cart.cart,
    }),
    ...mapGetters({
      totalComprado: 'cart/totalComprado',
    }),
  },
  methods: {
    // TODO: validar si hay pedido
    // TODO: IR A PEDIDO CONFIRMADO LUEGO DE CONFIRMAR
    // mostrar alert indicando que se confirmo el pedido
    confirmarPedido() {
      this.$dal.save('pedidos', {
        id: this.entregaId + '-' + this.$store.state.user.user.email,
        usuario: this.$store.state.user.user.email,
        fecha: this.entrega,
        direccion: this.direccion,
        total: this.totalComprado,
        productos: this.cart,
      });
      this.$store.commit('cart/removeAll');
    },
    verCompra() {
      this.$router.push('/cart');
    },
  },
};
</script>

<style>
</style>