#!/bin/bash

# Variables
BUCKET_NAME_SECRET="jenkins-bucket-name-secret"
JENKINS_MOUNT_DIR="/mnt/jenkins-bucket"
JENKINS_SYMLINK_PARENT_DIR="/usr"
GENERAL_LOG_FILE="/var/log/startup_script.log"
TIMEOUT=30

#If user doesn't exist yet, add it.
if ! id -u jenkins &>/dev/null; then
  groupadd jenkins
  useradd -r -g jenkins -s /bin/false jenkins
fi

#Created jenkins directories
sudo mkdir $JENKINS_MOUNT_DIR
sudo chown -R jenkins:jenkins $JENKINS_MOUNT_DIR
sudo mkdir $JENKINS_SYMLINK_PARENT_DIR

#Create the log file
touch "$GENERAL_LOG_FILE"

if ! command gcsfuse &>/dev/null; then
    echo "[$(date)] Installing necessary tools..." >> "$GENERAL_LOG_FILE"
    export GCSFUSE_REPO=gcsfuse-`lsb_release -c -s`
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.asc] https://packages.cloud.google.com/apt $GCSFUSE_REPO main" \
     | sudo tee /etc/apt/sources.list.d/gcsfuse.list >> "$GENERAL_LOG_FILE" 2>&1
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo tee /usr/share/keyrings/cloud.google.asc >> "$GENERAL_LOG_FILE" 2>&1
    apt-get update && apt-get -y install gcsfuse >> "$GENERAL_LOG_FILE" 2>&1
fi

#Mount GcsFuse
if ! mount | grep gcsfuse &>/dev/null; then
  #Gather required variables
  JENKINS_USER_ID=$(cat /etc/passwd | grep jenkins | cut -d':' -f3)
  JENKINS_GROUP_ID=$(cat /etc/passwd | grep jenkins | cut -d':' -f4)
  BUCKET_NAME=$(timeout $TIMEOUT gcloud secrets versions access latest --secret="$BUCKET_NAME_SECRET")
  #Mount the disk
  gcsfuse -o allow_other --file-mode=755 --dir-mode=755 --uid=$JENKINS_USER_ID --gid=$JENKINS_GROUP_ID jenkins-bucket-devopslab $JENKINS_MOUNT_DIR >> "$GENERAL_LOG_FILE" 2>&1
  #Create symlink
  ln -s $JENKINS_MOUNT_DIR/jenkins $JENKINS_SYMLINK_PARENT_DIR
fi