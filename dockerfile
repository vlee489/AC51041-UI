FROM nginx:alpine
COPY . .
COPY ./nginx.conf /etc/nginx/nginx.conf 