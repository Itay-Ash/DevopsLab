#!/bin/bash

#If user doesn't exist yet, add it.
if ! id -u jenkins &>/dev/null; then
  groupadd jenkins
  useradd -r -g jenkins -s /bin/false jenkins
fi

#If the new partion doesnt have a file system, assign ext4
if ! blkid /dev/sdb; then
  mkfs.ext4 -F /dev/sdb
fi

#If the new partion is not mounted, mount it
if ! grep -qs '/mnt/jenkins-disk' /etc/fstab; then
  mkdir /mnt/jenkins-disk
  mount /dev/sdb /mnt/jenkins-disk
  echo '/dev/sdb /mnt/jenkins-disk ext4 defaults 0 0' | tee -a /etc/fstab
  chown -R jenkins:jenkins /mnt/jenkins-disk
fi