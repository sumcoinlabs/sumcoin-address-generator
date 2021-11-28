FROM smebberson/alpine-nginx

LABEL mantainer="Kazzkiq (sumcoin.chat/direct/kazzkiq)"

# Adding NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY mimetypes.conf /etc/nginx/mimetypes.conf

# Adding web files
COPY public /usr/html/