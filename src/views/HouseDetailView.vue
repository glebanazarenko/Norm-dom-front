<template>
    <div v-if="house">
      <h1>{{ house.simple_address }}</h1>
      <p><strong>UNOM:</strong> {{ house.unom }}</p>
      <p><strong>Полный адрес:</strong> {{ house.full_address }}</p>
      <p><strong>Административный округ:</strong> {{ house.adm_area?.name || "N/A" }}</p>
      <p><strong>Район:</strong> {{ house.district?.name || "N/A" }}</p>
      <p><strong>Дата создания:</strong> {{ formatDate(house.created_at) }}</p>
      <p><strong>Дата обновления:</strong> {{ formatDate(house.updated_at) }}</p>
      <strong>Photos:</strong> 
      <ul v-if="house.photos && house.photos.length > 0">
      <li v-for="(photo, index) in house.photos" :key="index">{{ photo }}</li>
      </ul>
      <span v-else>No photos available.</span><br />
  
      <!-- Отзывы -->
      <h2>Отзывы</h2>
      <ul>
        <li v-for="(review, index) in house.reviews" :key="index">{{ review }}</li>
      </ul>
  
      <!-- Добавление отзыва -->
      <h3>Добавить отзыв</h3>
      <form @submit.prevent="addReview">
        <textarea v-model="newReview" rows="4" required></textarea>
        <button type="submit">Отправить</button>
      </form>
    </div>
    <div v-else>Дом не найден.</div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { mapGetters, mapActions } from "vuex";
  
  export default defineComponent({
    name: "HouseDetailPage",
    data() {
      return {
        newReview: "", // Новый отзыв
      };
    },
    computed: {
      ...mapGetters(["stateHouse"]),
      house() {
        return this.stateHouse || null;
      },
    },
    methods: {
      ...mapActions(["getHouseById", "addReviewToHouse"]),
  
      // Форматирование даты
      formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("ru-RU", options);
      },
  
      // Добавление отзыва
      async addReview() {
        if (this.newReview.trim()) {
          await this.addReviewToHouse({ id: this.$route.params.id, review: this.newReview });
          this.newReview = ""; // Очищаем поле ввода
        }
      },
    },
    async created() {
      await this.getHouseById(this.$route.params.id); // Загружаем информацию о доме при создании компонента
    },
  });
  </script>