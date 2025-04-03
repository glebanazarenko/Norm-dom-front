<template>
    <form class="d-flex ms-auto me-3" @submit.prevent="searchHousesWrapper">
        <input
        v-model="searchQuery"
        class="form-control me-2"
        type="search"
        placeholder="Search houses..."
        aria-label="Search"
        />
        <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { mapActions } from 'vuex';
  
  export default defineComponent({
    name: "SearchForm",
    data() {
      return {
        searchQuery: "", // Состояние для хранения строки поиска
      };
    },
    methods: {
        ...mapActions(["searchHouses"]), // Импортируем action из Vuex

        async searchHousesWrapper() {
        if (this.searchQuery.trim()) {
            try {
            // Передаем строку поиска в Vuex-действие
            await this.searchHouses(this.searchQuery);
            this.$router.push({
                name: "SearchResults",
                query: { q: this.searchQuery }, // Передаем строку поиска через query параметры
            });
            } catch (error) {
            console.error("Error searching houses:", error);
            }
        }
        this.searchQuery = ""; // Очищаем поле поиска
        },
    },
  });
  </script>