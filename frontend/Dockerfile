# Bước 1: Build ứng dụng React
FROM node:16 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Build ứng dụng React

# Bước 2: Sử dụng NGINX để phục vụ ứng dụng đã build
FROM nginx:latest

# Copy các file build của frontend vào thư mục mặc định của NGINX
COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
