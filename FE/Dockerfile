# --- Stage 1: Build React App ---
    FROM node:18 as build

    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    # Kita tidak perlu menyalin .env ke dalam build statis
    # RUN npm run build akan menggunakan variabel yang di-pass saat build
    RUN npm run build
    
    # --- Stage 2: Serve with Nginx ---
    FROM nginx:alpine
    
    # Salin hasil build dari stage sebelumnya ke direktori web Nginx.
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Hapus konfigurasi default Nginx.
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Salin file konfigurasi kustom kita ke dalam kontainer.
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Nginx akan berjalan di port 80 sesuai konfigurasi kita.
    EXPOSE 80
    
    # Perintah untuk menjalankan Nginx.
    CMD ["nginx", "-g", "daemon off;"]
    