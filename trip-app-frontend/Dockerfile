# ──── Stage 1 : Build Angular ────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source code and build
COPY . .
RUN npm run build -- --configuration=production

# ──── Stage 2 : Nginx to serve static files ────
FROM nginx:1.25-alpine

# Copy built Angular app
COPY --from=builder /app/dist/trip-app-frontend/browser /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy env template for runtime environment injection
COPY env.template.js /usr/share/nginx/html/

EXPOSE 80

# Generate env.js from template then start nginx
CMD envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js && nginx -g 'daemon off;'
