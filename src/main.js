import 'bootstrap/dist/css/bootstrap.css';
import { createApp } from "vue";
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

// Настройка axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://localhost:5001/';

// Функция для чтения куки
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Перехватчик ошибок
axios.interceptors.response.use(
  undefined, 
  async function (error) {
    if (error.response) {
      const originalRequest = error.config;

      // Если ошибка 401 (неверные данные логина)
      if (error.response.status === 401 && error.response.data && error.response.data.detail === "Incorrect username or password") {
        throw error; // Важно, чтобы ошибка попала в submit
      }

      // Если ошибка 401 (Токен истёк или пользователь не авторизован)
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Проверяем наличие куки и выполняем logout
        if (!getCookie('Authorization')) {
          await store.dispatch('logOut');
        }

        return Promise.reject(error); // Отклоняем запрос
      }

      // Прочие ошибки прокидываем дальше
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Проверка авторизации при старте приложения
(async () => {
  try {
    // Проверяем наличие куки Authorization
    const token = getCookie('Authorization');
    if (token) {
      console.log('Token found in cookie:', token);

      // Пытаемся получить информацию о пользователе
      await store.dispatch('viewMe');
    } else {
      console.log('No token found in cookie.');
    }
  } catch (error) {
    console.error('Failed to restore session:', error);

    // Если проверка неудачна, выполняем logout
    await store.dispatch('logOut');
  }
})();

app.use(router);
app.use(store);
app.mount("#app");