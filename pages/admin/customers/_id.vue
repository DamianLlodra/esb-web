<template>
  <div>
    <form-generic :model="data" :view-config="viewConfig"> </form-generic>
    <v-btn @click="save">Grabar</v-btn>
  </div>
</template>

<script>
import FormGeneric from '~/components/FormGeneric.vue';
export default {
  components: { FormGeneric },
  asyncData() {
    return {
      data: {},
      viewConfig: {
        nombre: {},
        domicilio: {},
        telefono: {},
        email: {},
      },
    };
  },
  data() {
    return { data: {} };
  },
  created() {
    const id = this.$route.params.id;

    if (id && id !== 'new') {
      this.$dal.getById('customers', id).then((res) => {
        this.data = res;
      });
    }
  },
  methods: {
    save() {
      this.data.id =
        this.$route.params.id === 'new'
          ? this.data.nombre.replace(' ', '-')
          : this.$route.params.id;
      this.$dal.save('customers', this.data).then((res) => {
        this.$router.push('/admin/customers');
      });
    },
  },
};
</script>

<style></style>
