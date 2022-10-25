# # syntax=docker/dockerfile:1
# FROM python:3.8.10
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
# WORKDIR /code
# COPY requirements.txt /code/
# COPY env/lib/python3.8/site-packages/docker /code/
# RUN pip install -r requirements.txt 
# RUN pip install docker
# COPY . /code/

FROM ubuntu:20.04
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update

RUN apt-get install -y apt-utils vim curl apache2 apache2-utils
RUN apt-get -y install python3 libapache2-mod-wsgi-py3
RUN ln /usr/bin/python3 /usr/bin/python
RUN apt-get -y install python3-pip
# RUN ln /usr/bin/pip3 /usr/bin/pip
RUN pip install --upgrade pip
RUN pip install django ptvsd

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE=1
RUN mkdir /code/

WORKDIR /code/
COPY requirements.txt /code

COPY env/lib/python3.8/site-packages/docker /code
RUN pip install -r requirements.txt
RUN pip install docker
COPY . /code/
ADD ./site.conf /etc/apache2/sites-available/demo_site.conf
ADD ./ports.conf /etc/apache2/ports.conf
RUN a2ensite demo_site.conf
RUN a2enmod proxy
RUN a2enmod proxy_http
RUN a2enmod proxy_balancer
RUN a2enmod lbmethod_byrequests
RUN service apache2 start
# RUN service apache2 reload
EXPOSE 8080 3500
CMD ["apache2ctl", "-D", "FOREGROUND"]



# FROM node:12-alpine as builder
# # copy the package.json to install dependencies
# COPY vunet/package.json vunet/package-lock.json ./
# # Install the dependencies and make the folder
# RUN npm install --legacy-peer-deps && mkdir /react-ui 
# # && mv vunet/node_modules ./react-ui
# WORKDIR /react-ui
# COPY vunet /react-ui
# # Build the project and copy the files
# RUN npm run-script build
# FROM nginx:alpine
# #!/bin/sh
# COPY nginx.conf /etc/nginx/nginx.conf
# ## Remove default nginx index page
# RUN rm -rf /usr/share/nginx/html/*
# # Copy from the stahg 1
# COPY --from=builder /react-ui/dist/apps/control-center /usr/share/nginx/html
# EXPOSE 4200 87
# ENTRYPOINT ["nginx", "-g", "daemon off;"]