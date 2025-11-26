# Этап 1: Сборка React приложения
FROM node:18-alpine as build

WORKDIR /app

# Копіюємо файли package.json спочатку для використання кешу Docker
COPY package.json package-lock.json ./

# Встановлюємо залежності
# 'npm ci' швидше та надійніше для складання (вимагає package-lock.json)
RUN npm install

# Копіюємо решту коду програми
COPY . .

# Збираємо додаток для продакшену
RUN npm run build

# Етап 2: Роздача програми через Nginx
FROM nginx:alpine

# Видаляємо стандартні статичні файли nginx
RUN rm -rf /usr/share/nginx/html/*

# Копіюємо результат складання з попереднього етапу
COPY --from=build /app/dist /usr/share/nginx/html

# Копіюємо нашу конфігурацію nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Відкриваємо 80 порт
EXPOSE 80

# Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]