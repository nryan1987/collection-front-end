FROM node:17-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install
CMD [ "npm", "run", "start" ]

#FROM nginx
#WORKDIR /usr/shar/nginx/html
#RUN rm -rf ./*
#COPY --from=builder /app/build .
#ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
