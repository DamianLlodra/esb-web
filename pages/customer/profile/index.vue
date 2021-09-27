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
  middleware: 'auth',
  async asyncData() {
    return {
      data: {},
      viewConfig: {
        nombre: {
          dataType: String,
          defaultValue: '',
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
      viewConfig: {},
    };
  },
  methods: {
    save() {
      alert(this.data.nombre);
    },
  },
};
</script>

<style></style>
