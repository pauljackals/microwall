FROM node:14-alpine as client
ARG NODE_ENV=${NODE_ENV}
WORKDIR /opt/microwall
COPY ./client/ .
RUN yarn install
RUN yarn build

FROM node:14-alpine
ARG NODE_ENV=${NODE_ENV}
WORKDIR /opt/microwall
COPY ./server/ .
COPY --from=client /opt/microwall/dist ./dist
RUN yarn install
CMD ["yarn", "prod"]
