FROM node:latest
RUN mkdir -p usr/src/app
COPY checkbox.io/server-side/site/package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install