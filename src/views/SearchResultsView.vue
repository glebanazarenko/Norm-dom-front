<template>
    <div>
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
        </li>
        </ul>
        <p v-else>No results found.</p>
    </div>
</template>
  
<script>
    import { defineComponent } from "vue";
    import { mapGetters } from "vuex"; // Используем mapGetters для получения данных из Vuex

    export default defineComponent({
    name: "SearchResultsView",
    computed: {
        ...mapGetters(["stateHouses", "stateQuery"]), // Импортируем геттеры для получения списка домов и строки поиска
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
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" };
        return new Date(dateString).toLocaleDateString("ru-RU", options);
        },
    },
    });
    </script>

    <style scoped>
    .house-item {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    }
</style>