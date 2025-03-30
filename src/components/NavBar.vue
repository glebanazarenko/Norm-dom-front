<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">FastAPI + Vue</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <!-- Поиск домов -->
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

          <!-- Навигация для авторизованных пользователей -->
          <ul v-if="isLoggedIn" class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">My Profile</router-link>
            </li>

            <!-- Пункт только для Admin -->
            <li v-if="userRole === 'Admin'" class="nav-item">
              <router-link class="nav-link" to="/admin">Заполнить БД</router-link>
            </li>

            <!-- Логаут всегда есть -->
            <li class="nav-item">
              <a class="nav-link" @click="logout">Log Out</a>
            </li>
          </ul>

          <!-- Навигация для неавторизованных пользователей -->
          <ul v-else class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Log In</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
  
<script>
import { defineComponent } from "vue";
import { mapActions } from 'vuex';

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      searchQuery: "", // Состояние для хранения запроса поиска
    };
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated;
    },
    userRole: function () {
      return this.$store.getters.getUserRole; // Убедитесь, что есть getter для роли
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logOut");
      this.$router.push("/login");
    },
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
  
<style scoped>
a {
  cursor: pointer;
}

.form-control {
  border-radius: 4px;
}

.btn-outline-success {
  border-radius: 4px;
}
</style>