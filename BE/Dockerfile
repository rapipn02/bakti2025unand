FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy .env jika perlu (opsional, jika tidak sudah di-copy di workflow)
# COPY .env .env

EXPOSE 4000
CMD ["npm", "start"]