<template>
  <v-container>
    <v-virtual-scroll bench="3" :items="items" height="400" item-height="50">
      <template v-slot:default="{ item }">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>

    <v-btn color="green" top fab><v-icon>mdi-plus</v-icon></v-btn>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.loadSubCategories();
  },
  methods: {
    loadSubCategories() {
      this.$dal.getAll('subcategories').then((items) => {
        this.items = items;
      });
    },
  },
};
</script>

<style></style>
