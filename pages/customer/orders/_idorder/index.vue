<template>
  <v-card>
    <v-simple-table fixed-header height="auto">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in productos" :key="item.name">
            <td>
              <v-img
                :src="item.picture"
                aspect-ratio="1"
                contain
                max-width="96"
                max-height="96"
              ></v-img>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item[price] }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item[price] * item.amount }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-card-actions class="justfy-center">
      <v-btn v-if="canSetCurrentCart" color="primary" @click="setCurrentCart">
        <span>Agregar productos a este pedido</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      productos: [],
      loading: false,
      selection: 1,
      price: 'price',
      fechaReparto: '',
    };
  },
  computed: {
    canSetCurrentCart() {
      const fecha = new Date();
      return this.fechaReparto >= fecha.toISOString().substring(0, 10);
    },
  },
  created() {
    this.loadProductos();
  },

  methods: {
    async loadProductos() {
      this.loading = true;
      const pedido = await this.$dal.getById(
        'pedidos',
        this.$route.params.idorder
      );
      this.fechaReparto = pedido.fecha;
      if (pedido.currentPrice === 'totalLista') this.price = 'price';
      else this.price = pedido.currentPrice.replace('totalP', 'p');

      this.productos = pedido.productos;
    },
    setCurrentCart() {
      this.$store.commit('cart/load', this.productos);

      this.$router.push('/cart');
    },
  },
};
</script>

<style>
</style>