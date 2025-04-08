<template>
  <div class="map-container">
    <!-- Контейнер для карты -->
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Импортируем стили Leaflet
import "leaflet.markercluster/dist/MarkerCluster.Default.css"; // Стили для кластеризатора
import "leaflet.markercluster"; // Кластеризатор

export default {
  name: "HousesMap",
  data() {
    return {
      housesData: [], // Здесь будут храниться данные о домах
      map: null,
      markers: null, // Для хранения кластеризатора
    };
  },
  async mounted() {
    try {
      await this.loadHousesData(); // Загрузка данных из файла
      this.initMap(); // Инициализация карты после загрузки данных
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  },
  methods: {
    // Метод для загрузки данных из файла JSON
    async loadHousesData() {
      const response = await fetch("/houses.json");
      const data = await response.json();
      this.housesData = data; // Сохраняем данные в компоненте
    },

    initMap() {
      if (!document.getElementById("map")) {
        console.error("Элемент #map не найден в DOM.");
        return;
      }

      if (!this.map) {
        this.map = L.map("map").setView([55.751244, 37.618423], 10); // Координаты центра Москвы, масштаб 10

        // Добавление тайлов OSM
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(this.map);
      }

      // Очистите предыдущие маркеры перед добавлением новых
      if (this.markers) {
        this.map.removeLayer(this.markers);
      }

      // Создаем новый кластеризатор
      this.markers = L.markerClusterGroup();

      // Добавляем маркеры на карту
      this.housesData.forEach((house) => {
        const centerCoordinates = house.geodata_center?.coordinates;

        if (
          centerCoordinates &&
          Array.isArray(centerCoordinates) &&
          centerCoordinates.length === 2 &&
          typeof centerCoordinates[0] === "number" &&
          typeof centerCoordinates[1] === "number"
        ) {
          const marker = L.marker(centerCoordinates)
            .bindPopup(house.ADDRESS || "Нет адреса") // Отображаем адрес при клике
            .bindTooltip(house.SIMPLE_ADDRESS || house.ADDRESS || "Нет адреса"); // Подсказка при наведении

          this.markers.addLayer(marker);
        } else {
          console.warn("Некорректные координаты:", house);
        }
      });

      // Добавляем кластеризатор на карту
      if (this.markers.getLayers().length > 0) {
        this.map.addLayer(this.markers);
      } else {
        console.warn("Нет маркеров для отображения.");
      }

      // Устанавливаем границы карты, чтобы показать все маркеры
      if (this.housesData.length > 0) {
        const bounds = new L.LatLngBounds(
          this.housesData
            .filter((house) => house.geodata_center?.coordinates)
            .map((house) => house.geodata_center.coordinates)
        );

        if (!bounds.isEmpty()) {
          this.map.fitBounds(bounds); // Центрируем карту относительно точек
        } else {
          console.warn("Нет корректных координат для отображения.");
        }
      }

      // Пересчитываем размер карты, если она была скрыта
      this.map.invalidateSize();
    },
  },
};
</script>

<style>
/* Стили для контейнера карты */
.map-container {
  height: 100vh; /* Занимает всю высоту экрана */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Стили для Leaflet */
.map {
  width: 90%;
  height: 80%;
}

/* Опциональные стили для кластеризатора */
.leaflet-cluster-icon {
  background-color: blue;
  color: white;
}

/* Скрыть атрибуцию через CSS */
.leaflet-attribution-flag {
  display: none !important;
}
</style>