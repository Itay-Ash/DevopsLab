#!/bin/bash

#If user doesn't exist yet, add it.
if ! id -u mysql &>/dev/null; then
  groupadd mysql
  useradd -r -g mysql -s /bin/false mysql
fi

#If the new partion doesnt have a file system, assign ext4
if ! blkid /dev/sdb; then
  mkfs.ext4 -F /dev/sdb
fi

#If the new partion is not mounted, mount it
if ! grep -qs '/mnt/mysql-disk' /etc/fstab; then
  mkdir /mnt/mysql-disk
  mount /dev/sdb /mnt/mysql-disk
  echo '/dev/sdb /mnt/mysql-disk ext4 defaults 0 0' | tee -a /etc/fstab
  chown -R mysql:mysql /mnt/mysql-disk
fi