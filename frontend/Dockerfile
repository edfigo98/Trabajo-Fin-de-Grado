FROM node:alpine as develop-stage

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install -all

COPY . ./

FROM develop-stage as build-stage
RUN yarn build

FROM nginx:1.12-alpine as production-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
