<template>
  <v-card>
    <v-card-title> Confirmar Pedido </v-card-title>
    <v-card-text class="text-h6">
      Total: $ {{ totalComprado[totalComprado.current] }}
    </v-card-text>
    <v-card-text class="text-h6"
      >Puntos por esta compra: {{ totalComprado.points }}</v-card-text
    >
    <v-card-text v-if="isAdmin" class="text-h6">
      <v-autocomplete
        v-model="customer"
        :items="customers"
        dense
        filled
        label="Cliente"
        item-text="nombre"
        return-object
        @change="changeCustomer(customer)"
      ></v-autocomplete>
    </v-card-text>

    <div v-if="showDataCustomer">
      <v-card-text class="text-h6">Puntos acumulados: {{ points }}</v-card-text>
      <v-card-text v-if="premio > 0" class="text-h6"
        >Descuento por puntos ${{ premio }}</v-card-text
      >
      <v-card-text class="text-h6"
        >Total a pagar $ {{ totalAPagar }}</v-card-text
      >
      <v-card-text class="text-h6"
        >Dirección de entrega: {{ customer.domicilioEntrega }}</v-card-text
      >
      <v-card-text class="text-h6">
        Fecha de entrega:
        <v-text-field type="date" v-model="fechaDeEntrega"></v-text-field>
      </v-card-text>
    </div>
    <v-card-actions>
      <v-btn color="primary" @click="verCompra">
        <span>Ver Compra</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>

      <v-btn :disabled="!canConfirm" color="green" @click="confirmarPedido">
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
      user: {},
      fechaDeEntrega: '',
      fechaDeEntregaProgramada: '',
      customer: {},
      customers: [],
    };
  },
  computed: {
    ...mapState({
      cart: (state) => state.cart.cart,
      //points: (state) => state.user.user.points,
      canjePuntos: (state) => state.cart.param.canjePuntos,
      currentUser: (state) => state.user.user,
      isAdmin: (state) => state.user.user.isAdmin || false,
    }),
    ...mapGetters({
      totalComprado: 'cart/totalComprado',
      param: 'cart/getParam',
    }),
    points() {
      if (this.user && this.user.points) {
        return this.user.points;
      } else return 0;
    },
    premio() {
      if (this.canjePuntos) {
        const premio = this.canjePuntos.filter(
          (cp) => this.points >= cp.puntosDesde && this.points <= cp.puntosHasta
        );

        return premio && premio.length > 0 ? premio[0].importe : 0;
      } else return 0;
    },
    totalAPagar() {
      return this.totalComprado[this.totalComprado.current] - this.premio > 0
        ? this.totalComprado[this.totalComprado.current] - this.premio
        : 0;
    },
    entregaId() {
      const fecha = new Date(this.fechaDeEntrega);
      return fecha.toISOString().substring(0, 10);
    },
    showDataCustomer() {
      return this.customer && this.customer.nombre;
    },
    canConfirm() {
      if (
        this.totalComprado[this.totalComprado.current] > 0 &&
        this.fechaDeEntrega &&
        this.customer.nombre
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    if (this.isAdmin) {
      this.loadUserFromDb();
      this.loadCustomers();
    } else {
      this.user = this.currentUser;
      this.loadCustomer();
    }

    this.loadFechaEntrega();
  },
  methods: {
    async changeCustomer(c) {
      await this.loadUserFromDb(c.email);
    },
    async loadUserFromDb(e) {
      this.user = await this.$dal.getById('users', e);
    },
    async loadFechaEntrega() {
      const params = await this.$dal.getById('params', '1');
      this.fechaDeEntrega = params.proximaFechaDeReparto;
      this.fechaDeEntregaProgramada = params.proximaFechaDeReparto;
    },
    async loadCustomer() {
      this.customer = await this.$dal.getById(
        'customer',
        this.$store.state.user.user.email
      );
    },
    async loadCustomers() {
      this.customers = await this.$dal.getAll('customer');
    },
    // TODO: IR A PEDIDO CONFIRMADO LUEGO DE CONFIRMAR
    // mostrar alert indicando que se confirmo el pedido
    async confirmarPedido() {
      if (this.fechaDeEntrega < this.fechaDeEntregaProgramada) {
        this.$alertify.error(
          'La fecha de entrega no puede ser menor a la programada'
        );
        return;
      }
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
          id: this.entregaId + '-' + this.customer.email,
          userId: this.customer.email,
          usuario: this.customer.nombre,
          razonsocial: this.customer.razonSocial,
          fecha: this.entregaId,
          direccion: this.customer.domicilioEntrega,
          total: this.totalComprado[this.totalComprado.current],
          puntos: this.totalComprado.points,
          productos: this.cart,
          currentPrice: this.totalComprado.current,
          estado: 'PENDIENTE',
        };
        await this.$dal.save('pedidos', pedidoToSave);
        //const user = { ...this.$store.state.user.user };

        // const user = await this.$dal.getById(
        //   'users',
        //   this.$store.state.user.user.email
        // );

        if (this.premio > 0) {
          this.user.points = this.user.points - this.points;
        } else this.user.points += this.totalComprado.points;
        await this.$dal.save('users', this.user);
        this.$store.commit('cart/removeAll');
        if (!this.isAdmin) this.$store.commit('user/setUser', this.user);

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
