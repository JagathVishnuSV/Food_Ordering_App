#!/bin/sh
set -e

# substitute env vars into the nginx template and start nginx
envsubst '\$USER_SERVICE_URL \$RESTAURANT_SERVICE_URL \$ORDER_SERVICE_URL \$DELIVERY_SERVICE_URL \$NOTIFICATION_SERVICE_URL \$FRONTEND_ORIGIN' \
  < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'