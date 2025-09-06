FROM nginx:1.29.1-alpine

COPY dist/ /usr/share/nginx/html
COPY nginx/ /etc/nginx/