FROM node:18 as build-stage
WORKDIR /app
COPY ./package*.json ./
RUN npm --force install
COPY ./ .
RUN npm run build

FROM nginx as deploy-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY ./nginx.conf /etc/nginx/nginx.conf