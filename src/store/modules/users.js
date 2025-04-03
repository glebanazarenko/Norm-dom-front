import axios from 'axios';
import router from '@/router';

// Функция для чтения куки
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const state = {
  user: null,
};

const getters = {
  isAuthenticated: state => !!state.user,
  stateUser: state => state.user,
  getUserRole: state => state.data ? state.data.role_name : null,
  isAdmin: state => state.data && state.data.role_name === 'Admin',
};

const actions = {
  async register({ dispatch }, form) {
    await axios.post('register', form, { withCredentials: true });
    let UserForm = new FormData();
    UserForm.append('username', form.username);
    UserForm.append('password', form.password);
    await dispatch('logIn', UserForm);
  },

  async logIn({ dispatch }, user) { 
    try {
      await axios.post('login', user, { withCredentials: true }); 
      // Получаем токен из куки
      const cookie = getCookie('Authorization');
      if (cookie) {
        console.log('Token from cookie:', cookie.replace('Bearer ', '')); // Выводим токен в консоль
      }
      await dispatch('viewMe');
    } catch (error) {
      console.error('Login failed:', error?.response?.data || error?.message || 'Unknown error');
      throw error; // ! Важно, чтобы ошибка попала в submit
    }
  },

  async viewMe({ commit }) {
    try {
      const response = await axios.get('users/whoami', { withCredentials: true });
      const responseuser = await axios.get('users/getuser', { withCredentials: true });
      if (response && response.data) {
        await commit('setUser', { username: response.data, data: responseuser.data });
      } else {
        console.log('No data found in the response');
        await this.$store.dispatch("logOut"); // Если данные не получены, выполняем logout
      }
    } catch (error) {
      console.error('viewMe failed:', error); // Выводит детали ошибки в консоль
      await this.$store.dispatch("logOut"); // При ошибке выполняем logout
    }
  },

  // eslint-disable-next-line no-empty-pattern
  async deleteUser({}, id) {
    await axios.delete(`user/${id}`, { withCredentials: true });  // <-- Если авторизация нужна
  },

  async logOut({ commit }) {
    try {
      await commit('logout');

      // Удаляем куку на клиенте (если нужно)
      document.cookie = "Authorization=; Max-Age=-99999999;"; 

      router.push('/login'); // Переход на страницу входа
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
};

const mutations = {
  setUser(state, { username, data }) {
    state.user = username;
    state.data = data || {};
  },
  logout(state) {
    state.user = null;
    state.data = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};