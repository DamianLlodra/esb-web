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

    <v-card-text class="text-h6"
      >Dirección de entrega: {{ customer.domicilioEntrega }}</v-card-text
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
import util from '../../functions/util';

export default {
  data() {
    return {
      entrega: new Date().toLocaleDateString(),
      entregaId: new Date().toISOString().substring(0, 10),
      customer: {},
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
      param: 'cart/getParam',
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
  created() {
    this.customer = this.loadCustomer();
  
  },
  methods: {
    async loadCustomer() {
      this.customer = await this.$dal.getById(
        'customer',
        this.$store.state.user.user.email
      );
    },

    // TODO: IR A PEDIDO CONFIRMADO LUEGO DE CONFIRMAR
    // mostrar alert indicando que se confirmo el pedido
    async confirmarPedido() {
      if (!util.puedeComprar(this.param.rules)) {
        this.$alertify.confirm(
          'Si continua el pedido sera validado despues de las ' +
            this.param.rules.horaHasta +
            ' hrs.',

          async () => await this.grabarPedido(),
          () => this.$alertify.error('Pedido no confirmado')
        );
      } else await this.grabarPedido();
    },
    async grabarPedido() {
      try {
        const pedidoToSave = {
          id: this.entregaId + '-' + this.$store.state.user.user.email,
          usuario: this.customer.nombre,
          razonsocial: this.customer.razonSocial,
          fecha: this.entregaId,
          direccion: this.customer.domicilioEntrega,
          total: this.totalComprado[this.totalComprado.current],
          puntos: this.totalComprado.points,
          productos: this.cart,
          currentPrice: this.totalComprado.current,
        };
        console.log(pedidoToSave);
        await this.$dal.save('pedidos', pedidoToSave);
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
