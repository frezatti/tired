FROM node:22-alpine

WORKDIR /app

COPY . /app/

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "sh", "./entrypoint.sh" ]