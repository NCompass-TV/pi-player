# stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npx npm-force-resolutions
RUN npm install
RUN npm run build_prod
RUN ls /app/dist/ng-player

# stage 2
FROM nginx:alpine
COPY --from=node /app/dist/ng-player/assets/env/nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/ng-player /usr/share/nginx/html
RUN ls /usr/share/nginx/html
EXPOSE 80