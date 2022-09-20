<template>
  <div>
    <div class="flex flex-col justify-center">
      <form-generic :view-config="viewConfig" :model="data"> </form-generic>

      <v-btn class="primary" @click="save">Guardar</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  asyncData() {
    return {
      data: {},
      viewConfig: {
        nombre: {},
        razonSocial: {},
        domicilioFiscal: {},
        domicilioEntrega: {},
        cuit: {},
        documento: {},
        telefono: {},
        email: {},
        horarioDeAtencion: {},
      },
    };
  },
  data() {
    return {
      data: {},
    };
  },
  async mounted() {
    const { displayName, email } = this.$store.state.user.user;

    let customer = await this.$dal.getById('customer', email);

    if (customer) {
      customer.id = email;
      customer.nombre = displayName;
      customer.email = email;
    } else {
      customer = {
        id: email,
        nombre: displayName,
        email,
        telefono: '',
        razonSocial: '',
        domicilioFiscal: '',
        domicilioEntrega: '',
        cuit: '',
        documento: '',
        horarioDeAtencion: '',
      };
    }

    this.data = customer;
  },
  methods: {
    save() {
      if (
        !this.validarCampoNotEmpty('Nombre', this.data.nombre) ||
        !this.validarCampoNotEmpty('Razon Social', this.data.razonSocial) ||
        !this.validarCampoNotEmpty(
          'Domicilio Fiscal',
          this.data.domicilioFiscal
        ) ||
        !this.validarCampoNotEmpty(
          'Domicilio de Entrega',
          this.data.domicilioEntrega
        ) ||
        !this.validarCampoNotEmpty('Cuit', this.data.cuit) ||
        !this.validarCampoNotEmpty('Documento', this.data.documento) ||
        !this.validarCampoNotEmpty('Telefono', this.data.telefono) ||
        !this.validarCampoNotEmpty('Email', this.data.email) ||
        !this.validarCampoNotEmpty(
          'Horario de Atencion',
          this.data.horarioDeAtencion
        )
      ) {
        return;
      }

      this.$dal.save('customer', this.data).then(() => {
        this.$store.commit('user/setUser', this.data);
        this.$router.push('/');
      });
    },
    validarCampoNotEmpty(label, campo) {
      if (!campo) {
        this.$alertify.error(`El campo ${label} es obligatorio`);
        return false;
      }
      return true;
    },
  },
};
</script>

<style></style>
