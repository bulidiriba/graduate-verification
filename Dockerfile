FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Production stage
#FROM nginx:alpine
#COPY ./nginx.conf /etc/nginx/nginx.conf
#COPY --from=builder /app/.next /usr/share/nginx/html
EXPOSE 3000
CMD ["npm", "start"]
