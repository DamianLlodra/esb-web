<template>
  <v-conainer>
    <v-virtual-scroll bench="3" :items="items" height="400" item-height="50">
      <template v-slot:default="{ item }">
        <v-list-item @click="goTo('categories/' + item.id)">
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>

    <v-btn color="green" top fab @click="goTo('categories/new')"
      ><v-icon>mdi-plus</v-icon></v-btn
    >
  </v-conainer>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.loadCategories();
  },
  methods: {
    loadCategories() {
      this.$dal.getAll('categories').then((items) => {
        this.items = items;
      });
    },
    goTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style></style>
