<template>
  <v-card class="text-center">
    <div class="text-center">
      <div class="text-center red rounded-lg">
        <h3 class="m-3 headline white--text font-weight-black">ESB</h3>
      </div>
      <span class="headline">{{ title }}</span>
    </div>
    <v-card-subtitle>
      <span class="subheading">{{ subtitle }}</span>
    </v-card-subtitle>
    <v-card-text>
      <p v-for="(p, k) in getParrafos" :key="k">{{ p }}</p>
    </v-card-text>
    <v-card-actions v-if="loged" class="justify-center">
      <v-btn class="green" @click="goto('/category')">Empezar a comprar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      logo: '',
      title: '',
      subtitle: '',
      description: '',
    };
  },
  computed: {
    getParrafos() {
      return this.description.split('\n');
    },
    ...mapState({
      loged: (state) => state.user.user.email,
    }),
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const param = await this.$dal.getAll('params');

      const { title, subtitle, description } = param[0].home;
      this.title = title;
      this.subtitle = subtitle;
      this.description = description;
    },
    goto(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style></style>
