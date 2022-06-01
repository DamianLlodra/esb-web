<template>
  <v-card>
    <v-card-title> Confirmar Pedido </v-card-title>
    <v-card-text class="text-h6">
      Total: $ {{ totalComprado[totalComprado.current] }}
    </v-card-text>
    <v-card-text class="text-h6"
      >Puntos por esta compra: {{ totalComprado.points }}</v-card-text
    >
    <v-card-text class="text-h6">Puntos acumulados: {{ points }}</v-card-text>
    <v-card-text v-if="premio > 0" class="text-h6"
      >Descuento por puntos ${{ premio }}</v-card-text
    >
    <v-card-text class="text-h6"
      >Total a pagar $
      {{ totalComprado[totalComprado.current] - premio }}</v-card-text
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
      points: (state) => state.user.user.points,
      canjePuntos: (state) => state.cart.param.canjePuntos,
      currentUser: (state) => state.user.user,
    }),
    ...mapGetters({
      totalComprado: 'cart/totalComprado',
    }),
    premio() {
      if (this.canjePuntos) {
        const premio = this.canjePuntos.filter(
          (cp) => this.points >= cp.puntosDesde && this.points <= cp.puntosHasta
        );

        return premio && premio.length > 0 ? premio[0].importe : 0;
      } else return 0;
    },
  },
  methods: {
    // TODO: IR A PEDIDO CONFIRMADO LUEGO DE CONFIRMAR
    // mostrar alert indicando que se confirmo el pedido

    async confirmarPedido() {
      try {
        await this.$dal.save('pedidos', {
          id: this.entregaId + '-' + this.$store.state.user.user.email,
          usuario: this.$store.state.user.user.email,
          fecha: this.entregaId,
          direccion: this.direccion,
          total: this.totalComprado[this.totalComprado.current],
          puntos: this.totalComprado.points,
          productos: this.cart,
          currentPrice: this.totalComprado.current,
        });
        const user = { ...this.$store.state.user.user };
        user.points += this.totalComprado.points;
        await this.$dal.save('users', user);
        this.$store.commit('cart/removeAll');
        this.$store.commit('user/setUser', user);
        this.$alertify.success('Pedido confirmado');
      } catch (e) {
        console.log(e);
        this.$alertify.error('Error al guardar el pedido');
      }
    },
    verCompra() {
      this.$router.push('/cart');
    },
  },
};
</script>

<style></style>
