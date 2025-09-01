FROM busybox:1.37.0-musl AS builder

WORKDIR /app

COPY dist/* ./

EXPOSE 80

CMD ["busybox", "httpd", "-f", "-v", "-p", "80"]