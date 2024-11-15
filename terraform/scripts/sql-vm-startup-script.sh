#!/bin/bash
if ! id -u mysql &>/dev/null; then
  sudo groupadd mysql
  sudo useradd -r -g mysql -s /bin/false mysql
fi

if ! sudo blkid /dev/sdb; then
  sudo mkfs.ext4 -F /dev/sdb
fi

if ! grep -qs '/mnt/mysql-disk' /etc/fstab; then
  sudo mkdir /mnt/mysql-disk
  sudo mount /dev/sdb /mnt/mysql-disk
  echo '/dev/sdb /mnt/mysql-disk ext4 defaults 0 0' | sudo tee -a /etc/fstab
  sudo chown -R mysql:mysql /mnt/mysql-disk
fi