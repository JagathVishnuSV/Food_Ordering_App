FROM nginx:stable-alpine

# add gettext (envsubst) and curl if needed
RUN apk add --no-cache gettext

WORKDIR /etc/nginx

# copy template and entrypoint into image
COPY nginx.template /etc/nginx/nginx.template
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]