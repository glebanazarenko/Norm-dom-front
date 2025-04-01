<template>
    <div>
      <h1>Поиск дома</h1>
      <SearchForm />
      <h1>Search Results for "{{ getQuery }}"</h1>
      <ul v-if="searchResults.length > 0">
        <li v-for="house in searchResults" :key="house.id" class="house-item">
          <strong>ID:</strong> {{ house.id }}<br />
          <strong>UNOM:</strong> {{ house.unom }}<br />
          <strong>Type:</strong> {{ house.obj_type }}<br />
          <strong>Full Address:</strong> {{ house.full_address }}<br />
          <strong>Simple Address:</strong> {{ house.simple_address }}<br />
          <strong>Administrative Area:</strong> {{ house.adm_area?.name || 'N/A' }}<br />
          <strong>District:</strong> {{ house.district?.name || 'N/A' }}<br />
          <strong>Kad N:</strong> {{ house.kad_n || 'N/A' }}<br />
          <strong>Kad ZU:</strong> {{ house.kad_zu || 'N/A' }}<br />
          <strong>Created At:</strong> {{ formatDate(house.created_at) }}<br />
          <strong>Updated At:</strong> {{ formatDate(house.updated_at) }}<br />
          <strong>Photos:</strong>
          <ul v-if="house.photos && house.photos.length > 0">
            <li v-for="(photo, index) in house.photos" :key="index">{{ photo }}</li>
          </ul>
          <span v-else>No photos available.</span><br />
          <strong>Reviews:</strong>
          <ul v-if="house.reviews && house.reviews.length > 0">
            <li v-for="(review, index) in house.reviews" :key="index">{{ review }}</li>
          </ul>
          <span v-else>No reviews available.</span>
          <button @click="viewHouse(house.id)">Посмотреть</button>
        </li>
      </ul>
      <p v-else-if="getQuery">Нет домов, соответствующих вашему запросу.</p>
      <p v-else>No results found.</p>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import SearchForm from "@/views/SearchForm.vue";
  import { mapState, mapGetters } from "vuex";
  
  export default defineComponent({
    name: "SearchHousePage",
    components: {
      SearchForm,
    },
    computed: {
      ...mapState(["houses"]), // Получаем список домов из Vuex
      ...mapGetters(["stateHouses", "stateQuery"]),
      searchResults() {
        return this.stateHouses || []; // Возвращаем результаты поиска
      },
      getQuery() {
        return this.stateQuery || ""; // Возвращаем строку поиска или пустую строку, если значение отсутствует
      },
    },
    methods: {
        // Метод для форматирования дат
        formatDate(dateString) {
            if (!dateString) return "N/A"; // Если дата отсутствует, возвращаем "N/A"
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(dateString).toLocaleDateString("ru-RU", options);
        },
  
        // Переход к странице детальной информации о доме
        viewHouse(id) {
            this.$router.push({ name: "HouseDetail", params: { id } });
        },
    },
  });
  </script>
  
  <style scoped>
  .house-item {
    margin-bottom: 10px;
  }
  </style>