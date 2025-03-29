<template>
    <div>
        <h1>Панель администратора</h1>
        <button @click="downloadData">Скачать данные</button>
        <button @click="uploadData">Загрузить данные</button>
        <button @click="updateHouses">Обновить данные о домах</button>
    </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    methods: {
      async downloadData() {
        try {
        //   const response = await axios.get('/admin/download', { responseType: 'blob' });
        //   const url = window.URL.createObjectURL(new Blob([response.data]));
        //   const link = document.createElement('a');
        //   link.href = url;
        //   link.setAttribute('download', 'data.json');
        //   document.body.appendChild(link);
        //   link.click();
          await axios.post('/admin/download');
        } catch (error) {
          console.error('Ошибка при скачивании данных:', error);
        }
      },
      async uploadData() {
        try {
        //   const formData = new FormData();
        //   formData.append('file', this.$refs.fileInput.files[0]);
        //   await axios.post('/admin/upload', formData);
          await axios.post('/admin/upload');
          alert('Данные загружены');
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
        }
      },
      async updateHouses() {
        try {
          await axios.post('/admin/update-houses');
          alert('Данные о домах обновлены');
        } catch (error) {
          console.error('Ошибка при обновлении данных о домах:', error);
        }
      }
    }
  };
  </script>
  