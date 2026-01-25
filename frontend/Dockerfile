FROM node:20-alpine

WORKDIR /app

# Install deps first (cache-friendly)
COPY package*.json ./
RUN npm ci

# Copy app
COPY . .

# React dev server
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
