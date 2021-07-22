<template>
  <div>
    <form-generic :view-config="viewConfig" :model="data"> </form-generic>
    <button @click="save">Guardar</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      viewConfig: {
        nombre: {
          dataType: String,
          defaultValue: '',
        },
        nacimiento: {
          dataType: Date,
          inputType: 'Date',
          label: 'Fecha de Nacimiento',
          defaultValue: '',
        },
        activo: {
          dataType: Boolean,
          inputType: 'checkbox',
          defaultValue: '',
        },
        domicilio: {
          dataType: String,
          inputType: 'text',
          defaultValue: '',
        },
      },
    };
  },
  methods: {
    save() {
      alert(this.data.nombre);
    },
  },
};
</script>

<style>
</style>