#!/bin/bash

# Variables
SUBSCRIPTION_NAME="ansible-bucket-subscription"
BUCKET_NAME_SECRET="ansible-bucket-name-secret"
ANSIBLE_DIR="/usr/ansible"
GENERAL_LOG_FILE="/var/log/startup_script.log"
BUCKET_LOG_FILE="/var/log/bucket_download.log"
ANSIBLE_PLAYBOOK_LOG_FILE="/var/log/ansible_playbook.log"
ANSIBLE_COLLECTION_PATH="/usr/share/ansible/collections"
WAIT_FOR_MESSAGE_TIME=0.3
TIMEOUT=30

# If user doesn't exist yet, add it.
if ! id -u ansible &>/dev/null; then
  groupadd ansible
  useradd -r -g ansible -s /bin/false ansible
fi

# Create a directory for ansible files
mkdir -p "$ANSIBLE_DIR"
chown -R ansible:ansible "$ANSIBLE_DIR"

# Create log files
touch "$GENERAL_LOG_FILE"
touch  "$BUCKET_LOG_FILE"
echo "" > "$ANSIBLE_PLAYBOOK_LOG_FILE"

# Install necessary tools if not already installed
if ! command -v jq &>/dev/null || ! command -v gsutil &>/dev/null || ! command -v ansible &>/dev/null; then
    #Disabling a var that would make install ansible require manual confirmation
    ORIGINAL_DEBIAN_FRONTEND=$DEBIAN_FRONTEND
    export DEBIAN_FRONTEND=noninteractive
    echo "[$(date)] Installing necessary tools..." >> "$GENERAL_LOG_FILE"
    apt-get update && apt-get install -y jq google-cloud-sdk ansible >> "$GENERAL_LOG_FILE" 2>&1
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py >> "$GENERAL_LOG_FILE" 2>&1
    python3 get-pip.py >> "$GENERAL_LOG_FILE" 2>&1
    pip install google-auth >> "$GENERAL_LOG_FILE" 2>&1
    ansible-galaxy collection install google.cloud community.general:4.8.11 --force -p "$ANSIBLE_COLLECTION_PATH"
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
    sudo -u ansible rm -r "$ANSIBLE_DIR"/*
    echo "[$(date)] Removed all files from "$ANSIBLE_DIR"" >> "$BUCKET_LOG_FILE"
    echo "[$(date)] Initiating download of all files from bucket: $BUCKET_NAME" >> "$BUCKET_LOG_FILE"
    gsutil -m cp -r gs://"$BUCKET_NAME"/ansible/* "$ANSIBLE_DIR" >> "$BUCKET_LOG_FILE" 2>&1
    chown -R ansible:ansible "$ANSIBLE_DIR"
    chmod -Rf +x "$ANSIBLE_DIR"
    echo "[$(date)] Replaced all files" >> "$BUCKET_LOG_FILE"
    wall -n "Replaced all ansible files"
}

# Fetch files upon VM startup
fetch_and_replace_files

# Run ansible playbook on startup
(cd "$ANSIBLE_DIR" && ansible-playbook site.yml -v >> "$ANSIBLE_PLAYBOOK_LOG_FILE" 2>&1)


check_for_message_stream() {
    echo "[$(date)] Pulling messages from $SUBSCRIPTION_NAME..." >> "$BUCKET_LOG_FILE"
    MESSAGES=$(gcloud pubsub subscriptions pull "$SUBSCRIPTION_NAME" --format="json")

    if [[ "$MESSAGES" == "[]" ]]; then
        return 1
    fi

    while [[ "$MESSAGES" != "[]" && -n "$MESSAGES" ]]; do
        ACK_ID=$(echo "$MESSAGES" | jq -r '.[].ackId')

        if [[ -n "$ACK_ID" ]]; then
            gcloud pubsub subscriptions ack "$SUBSCRIPTION_NAME" --ack-ids="$ACK_ID" >> "$BUCKET_LOG_FILE" 2>&1
            echo "[$(date)] Acknowledged message with ack ID: $ACK_ID" >> "$BUCKET_LOG_FILE"
        fi

        sleep $WAIT_FOR_MESSAGE_TIME
        echo "[$(date)] Pulling messages from $SUBSCRIPTION_NAME..." >> "$BUCKET_LOG_FILE"
        MESSAGES=$(gcloud pubsub subscriptions pull "$SUBSCRIPTION_NAME" --format="json")
    done

    echo "[$(date)] No messages found." >> "$BUCKET_LOG_FILE"
    return 0
}

# Infinitely pull messages from the Pub/Sub subscription
while true; do
    if check_for_message_stream; then
        fetch_and_replace_files
    else
        echo "[$(date)] No messages found. Sleeping for "$WAIT_FOR_MESSAGE_TIME" seconds... " >> "$BUCKET_LOG_FILE"
        sleep $WAIT_FOR_MESSAGE_TIME
    fi
done
