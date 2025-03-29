import axios from 'axios';

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
        await commit('setUser', {username: response.data, data: responseuser.data});
      } else {
        console.log('No data found in the response');
      }
    } catch (error) {
      console.error('viewMe failed:', error); // Выводит детали ошибки в консоль
      throw error; // ! Важно, чтобы ошибка попала в submit
    }
  },

  // eslint-disable-next-line no-empty-pattern
  async deleteUser({}, id) {
    await axios.delete(`user/${id}`, { withCredentials: true });  // <-- Если авторизация нужна
  },

  async logOut({ commit }) {
    let user = null;
    let data = null;
    commit('logout', user, data);
  }
};


const mutations = {
  setUser(state, { username, data }) {
    state.user = username;
    state.data = data || {};
  },
  logout(state, user, data){
    state.user = user;
    state.data = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};