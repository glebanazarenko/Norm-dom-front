<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">FastAPI + Vue</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul v-if="isLoggedIn" class="navbar-nav me-auto mb-2 mb-md-0">
            <!-- Общие пункты для всех -->
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
              <router-link class="nav-link" to="/fill-db">Заполнить БД</router-link>
            </li>

            <!-- Логаут всегда есть -->
            <li class="nav-item">
              <a class="nav-link" @click="logout">Log Out</a>
            </li>
          </ul>

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
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'NavBar',
    computed: {
      isLoggedIn: function() {
        return this.$store.getters.isAuthenticated;
      },
      userRole: function() {
        return this.$store.getters.getUserRole; // Убедитесь, что есть getter для роли
      }
    },
    methods: {
      async logout () {
        await this.$store.dispatch('logOut');
        this.$router.push('/login');
      }
    },
  });
  </script>
  
  <style scoped>
  a {
    cursor: pointer;
  }
  </style>