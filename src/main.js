import 'bootstrap/dist/css/bootstrap.css';
import { createApp } from "vue";
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000/';  // the FastAPI backend

// NEW
axios.interceptors.response.use(
  undefined, 
  function (error) {
    if (error.response) {
      const originalRequest = error.config;

      // Если ошибка 401 (неверные данные логина)
      if (error.response.status === 401 && error.response.data && error.response.data.detail === "Incorrect username or password") {
        // Возвращаем ошибку и сообщаем о неверном логине
        throw error; // ! Важно, чтобы ошибка попала в submit
      }

      // Если ошибка 401 (Токен истёк)
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        store.dispatch('logOut');
        return router.push('/login');
      }

      // Прочие ошибки прокидываем дальше
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

app.use(router);
app.use(store);
app.mount("#app");