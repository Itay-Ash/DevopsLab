if ! id -u nginx &>/dev/null; then
  groupadd nginx
  useradd -r -g nginx -s /bin/false nginx
fi
