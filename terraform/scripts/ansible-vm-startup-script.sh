#!/bin/bash

# Variables
SUBSCRIPTION_NAME="ansible-bucket-subscription"
BUCKET_NAME_SECRET="ansible-bucket-name-secret"
DOWNLOAD_DIR="/usr/ansible"
GENERAL_LOG_FILE="/var/log/startup_script.log"
BUCKET_LOG_FILE="/var/log/bucket_download.log"
TIMEOUT=30

# If user doesn't exist yet, add it.
if ! id -u ansible &>/dev/null; then
  groupadd ansible
  useradd -r -g ansible -s /bin/false ansible
fi

# Create a directory for ansible files
mkdir -p "$DOWNLOAD_DIR"
chown -R ansible:ansible "$DOWNLOAD_DIR"

# Create log files
touch "$GENERAL_LOG_FILE"
touch "$BUCKET_LOG_FILE"

# Install necessary tools if not already installed
if ! command -v jq &>/dev/null || ! command -v gsutil &>/dev/null || ! command -v ansible &>/dev/null; then
    #Disabling a var that would make install ansible require manual confirmation
    ORIGINAL_DEBIAN_FRONTEND=$DEBIAN_FRONTEND
    export DEBIAN_FRONTEND=noninteractive
    echo "[$(date)] Installing necessary tools..." >> "$GENERAL_LOG_FILE"
    apt-get update && apt-get install -y jq google-cloud-sdk ansible >> "$GENERAL_LOG_FILE" 2>&1
    ansible-galaxy collection install google.cloud >> "$GENERAL_LOG_FILE" 2>&1
    export DEBIAN_FRONTEND=$ORIGINAL_DEBIAN_FRONTEND
fi

#Generate SSH KEY
yes Y | gcloud compute config-ssh >> "$GENERAL_LOG_FILE"

# Gather bucket name
BUCKET_NAME=$(timeout $TIMEOUT gcloud secrets versions access latest --secret="$BUCKET_NAME_SECRET")

# Check if bucket name is retrieved
if [ -z "$BUCKET_NAME" ]; then
    echo "[$(date)] ERROR: Failed to retrieve bucket name from Secret Manager within $TIMEOUT seconds." >> "$BUCKET_LOG_FILE" 2>&1
    exit 1  # Exit the script if the bucket name is not retrieved
else
    echo "[$(date)] Secret Pulled!" >> "$BUCKET_LOG_FILE" 2>&1
fi

# Fetch all files from the bucket and replace any existing ones
fetch_and_replace_files() {
    sudo -u ansible rm -r "$DOWNLOAD_DIR"/*
    echo "[$(date)] Removed all files from "$DOWNLOAD_DIR"" >> "$BUCKET_LOG_FILE"
    echo "[$(date)] Initiating download of all files from bucket: $BUCKET_NAME" >> "$BUCKET_LOG_FILE"
    gsutil -m cp -r gs://"$BUCKET_NAME"/ansible/* "$DOWNLOAD_DIR" >> "$BUCKET_LOG_FILE" 2>&1
    chown -R ansible:ansible "$DOWNLOAD_DIR"
    chmod -Rf +x "$DOWNLOAD_DIR"
    echo "[$(date)] Replaced all files" >> "$BUCKET_LOG_FILE"
    wall -n "Replaced all ansible files"
}

# Fetch files upon VM startup
fetch_and_replace_files

check_for_message_stream(){
    echo "[$(date)] Pulling messages from $SUBSCRIPTION_NAME..." >> "$BUCKET_LOG_FILE"
    MESSAGES=$(gcloud pubsub subscriptions pull "$SUBSCRIPTION_NAME" --format="json")

    if [[ "$MESSAGES" != "[]" ]]; then
        while [[ "$MESSAGES" != "[]" ]]
        do
            ACK_ID=$(echo "$MESSAGES" | jq -r '.[].ackId')
            if [[ -n "$ACK_ID" ]]; then
                gcloud pubsub subscriptions ack "$SUBSCRIPTION_NAME" --ack-ids="$ACK_ID" >> "$BUCKET_LOG_FILE" 2>&1
                echo "[$(date)] Acknowledged message with ack ID: $ACK_ID" >> "$BUCKET_LOG_FILE"
            sleep 1
            echo "[$(date)] Pulling messages from $SUBSCRIPTION_NAME..." >> "$BUCKET_LOG_FILE"
            MESSAGES=$(gcloud pubsub subscriptions pull "$SUBSCRIPTION_NAME" --format="json")
        done
        true
    fi
    false
}

# Start pulling messages from the Pub/Sub subscription
while true; do
    if [ check_for_message_stream ]
        fetch_and_replace_files
    else
        echo "[$(date)] No messages found. Sleeping for 1 seconds..." >> "$BUCKET_LOG_FILE"
        sleep 1
    fi
done
