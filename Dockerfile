# stage 1
FROM amd64/node:lts
WORKDIR /app
COPY . .
RUN npx npm-force-resolutions
RUN npm install
RUN npm run build_prod
RUN ls /app/dist/ng-player

# stage 2
FROM nginx:latest
COPY --from=node /app/dist/ng-player/assets/rsc/nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/ng-player /usr/share/nginx/html
RUN ls /usr/share/nginx/html
EXPOSE 80