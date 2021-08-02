<template>
  <div>
    <div class="flex flex-row">
      <div class="flex flex-col">
        <form-generic :view-config="viewConfig" :model="data"> </form-generic>

        <button @click="save">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData() {
    return {
      data: {
        nombre: 'Damian',
        domicilio: '465 990',
      },
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
