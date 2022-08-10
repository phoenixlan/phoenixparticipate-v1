FROM node:16 as build

ARG BASE_URL
ARG HOST
ARG REACT_APP_OAUTH_CLIENT_ID

COPY . .
RUN yarn install
RUN yarn build:production

FROM nginx:stable-alpine
COPY --from=build /public /usr/share/nginx/html
COPY --from=build /docker/production/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx"]


