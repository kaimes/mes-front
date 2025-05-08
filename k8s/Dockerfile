FROM nginx:1.18.0
LABEL description="dispatch"
COPY dist/ /usr/share/nginx/html/
COPY k8s/default_nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80