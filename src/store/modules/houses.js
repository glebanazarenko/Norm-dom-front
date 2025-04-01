import axios from 'axios';

const state = {
  houses: null, // Список всех домов
  house: null,  // Информация о конкретном доме
};

const getters = {
    stateHouses: (state) => state.houses, // Геттер для получения списка домов
    stateHouse: (state) => state.house,   // Геттер для получения конкретного дома
    stateQuery: (state) => state.query,   // Геттер для получения строки поиска
};

const actions = {
  async searchHouses({ commit }, query) {
    try {
        const response = await axios.get(`/houses/search?query=${encodeURIComponent(query)}`);

        if (response.status === 200) {
            // Если запрос успешен, сохраняем данные
            commit("setQuery", query);
            commit("setHouses", response.data);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Если ошибка 404, сохраняем пустой массив домов
            console.warn("No houses found.");
            commit("setQuery", query);
            commit("setHouses", []); // Устанавливаем пустой массив результатов
        } else {
            // Для других ошибок выводим сообщение в консоль
            console.error("Error fetching houses:", error);
            throw error; // Перебрасываем ошибку дальше, если это не 404
        }
    }
  },
  async getHouseById({ commit }, id) {
    try {
      const { data } = await axios.get(`/house/${id}`); // Предполагается эндпоинт для получения дома по ID
      commit('setHouse', data); // Сохраняем информацию о доме в состоянии
    } catch (error) {
      console.error("Error fetching house by ID:", error);
    }
  },
  // Дополнительные действия можно добавить здесь (например, создание, обновление или удаление дома)
};

const mutations = {
  setHouses(state, houses) {
    state.houses = houses; // Устанавливаем список домов в состояние
  },
  setHouse(state, house) {
    state.house = house; // Устанавливаем информацию о конкретном доме в состояние
  },
  setQuery(state, query) {
    state.query = query;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};