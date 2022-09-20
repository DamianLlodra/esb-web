<template>
  <v-card>
    <v-card-text>
      <v-simple-table fixed-header height="auto">
        <template v-slot:default>
          <thead>
            <tr>
              <th>Fecha de Entrega</th>
              <th>Importe</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pedidos" :key="item.name" @click="goTo(item.id)">
              <td>{{ new Date(item.fecha).toLocaleDateString() }}</td>
              <td>{{ item.total }}</td>
              <td>{{ item.estado }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="goTo('/customer/orders')">
        <span>Ver todos los pedidos</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    pedidos: [],
    loading: false,
    selection: 1,
  }),
  created() {
    this.loadPedidos();
  },
  methods: {
    async loadPedidos() {
      this.loading = true;
      const pedidos = await this.$firebase
        .firestore()
        .collection('pedidos')
        .where('userId', '==', this.$store.state.user.user.email)
        .get()
        .then((snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push(doc.data());
          });
          return data;
        });
      this.pedidos = pedidos;
    },
    goTo(id) {
      this.$router.push('/customer/orders/' + id);
    },
  },
};
</script>

<style></style>
