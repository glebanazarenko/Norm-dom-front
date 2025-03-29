<template>
  <section>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label for="username" class="form-label">Username:</label>
        <input type="text" name="username" v-model="form.username" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input type="password" name="password" v-model="form.password" class="form-control" />
      </div>
      <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </section>
</template>

<script>
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      error: null // Добавлено для хранения сообщения об ошибке
    };
  },
  methods: {
    ...mapActions(['logIn']),
    async submit() {
      this.error = null; // Сбрасываем предыдущие ошибки
      try {
        const User = new FormData();
        User.append('username', this.form.username);
        User.append('password', this.form.password);

        await this.logIn(User); // Ожидаем успешного выполнения
        this.$router.push('/dashboard');
      } catch (error) {
        if (error.response) {
          // Ошибка от сервера
          if (error.response.status === 401) {
            this.error = error.response.data.detail || 'Login failed';
          } else {
            this.error = 'An unexpected error occurred';
          }
        } else if (error.request) {
          // Запрос был отправлен, но ответ не получен
          this.error = 'No response from server. Check your connection.';
        } else {
          // Ошибка при настройке запроса
          this.error = 'Error occurred while setting up the request.';
        }
      }
    }
  }
});
</script>