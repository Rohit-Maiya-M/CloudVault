#!/bin/sh

cat <<EOF > /usr/share/nginx/html/runtime-config.js
window.__ENV__ = {
    API_BASE_URL: "${API_BASE_URL}"
};
EOF

exec nginx -g "daemon off;"