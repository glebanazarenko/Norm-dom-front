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
      <li v-for="(review, index) in house.reviews" :key="index">
        {{ review.text }} - Оценка: {{ review.rating }} звезд
      </li>
    </ul>

    <!-- Добавление отзыва -->
    <h3>Добавить отзыв</h3>
    <div v-if="!isAuthenticated">
      Чтобы оставить комментарий, нужно авторизоваться.
    </div>
    <div v-else>
      <form @submit.prevent="addReview">
        <label for="rating">Оцените дом (1-5):</label>
        <select id="rating" v-model="newRating" required>
          <option value="1">1 звезда</option>
          <option value="2">2 звезды</option>
          <option value="3">3 звезды</option>
          <option value="4">4 звезды</option>
          <option value="5">5 звезд</option>
        </select>
        <br /><br />
        <textarea v-model="newReview" rows="4" required></textarea>
        <button type="submit">Отправить</button>
      </form>
    </div>
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
      newRating: 5, // Оценка по умолчанию
    };
  },
  computed: {
    ...mapGetters(["stateHouse", "isAuthenticated"]), // Добавляем геттер isAuthenticated
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
      if (this.newReview.trim() && this.isAuthenticated) {
        await this.addReviewToHouse({
          id: this.$route.params.id,
          review: this.newReview,
          rating: this.newRating, // Передаем оценку
        });
        this.newReview = ""; // Очищаем поле ввода
        this.newRating = 5; // Сбрасываем оценку
      }
    },
  },
  async created() {
    await this.getHouseById(this.$route.params.id); // Загружаем информацию о доме при создании компонента
  },
});
</script>

<style scoped>
/* Добавьте стили по желанию */
</style>