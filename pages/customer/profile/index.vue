<template>
  <div>
    <div class="flex flex-col justify-center">
      <form-generic :view-config="viewConfig" :model="data"> </form-generic>

      <button @click="save">Guardar</button>
    </div>
  </div>
</template>

<script>

export default {
  asyncData() {
    return {
      data: {},
      viewConfig: {
        nombre: {
          dataType: String,
        },
        razonSocial: {},
        domicilioFiscal: {},
        domicilioEntrega: {},
        documento: {},
        telefono: {},
        email: {},
      },
    };
  },
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    const { displayName, email, phoneNumber } = this.$store.state.user.user;
    this.data = {
      nombre: displayName,
      email,
      telefono: phoneNumber,
    };
  },
  methods: {
    save() {
      this.$dal.save('customer', this.data).then(() => {        
        this.$store.commit('user/setUser', this.data);
        this.$router.push('/');
      });
    },
  },
};
</script>

<style></style>
