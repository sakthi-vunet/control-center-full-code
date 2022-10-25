# # pull official base image
# FROM node:13.12.0-alpine

# # set working directory
# WORKDIR /app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # install app dependencies
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install

# # add app
# COPY . ./

# # start app
# CMD ["npm", "start"]    

# stage1 as builder
FROM node:12-alpine as builder

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install --legacy-peer-deps && mkdir /react-ui && mv ./node_modules ./react-ui

WORKDIR /react-ui

COPY . .

# Build the project and copy the files
RUN npm run-script build


FROM nginx:alpine

#!/bin/sh

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /react-ui/dist/apps/control-center /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]