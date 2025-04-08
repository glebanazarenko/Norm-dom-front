FROM node:lts-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Установка Vue CLI глобально
RUN npm install @vue/cli@5.0.8 -g

# Копируем файлы зависимостей
COPY package.json .
COPY package-lock.json .

# Добавляем новые зависимости (leaflet и leaflet.markercluster)
RUN npm install leaflet leaflet.markercluster --save

# Устанавливаем все зависимости из package.json
RUN npm install

# Запускаем приложение
CMD ["npm", "run", "serve"] 