#!/bin/bash
if ! id -u jenkins &>/dev/null; then
  sudo groupadd jenkins
  sudo useradd -r -g jenkins -s /bin/false jenkins
fi

if ! sudo blkid /dev/sdb; then
  sudo mkfs.ext4 -F /dev/sdb
fi

if ! grep -qs '/mnt/jenkins-disk' /etc/fstab; then
  sudo mkdir /mnt/jenkins-disk
  sudo mount /dev/sdb /mnt/jenkins-disk
  echo '/dev/sdb /mnt/jenkins-disk ext4 defaults 0 0' | sudo tee -a /etc/fstab
  sudo chown -R jenkins:jenkins /mnt/jenkins-disk
fi