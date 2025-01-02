########################################
#           Persistent Disks           #
########################################

resource "google_compute_disk" "mysql_data_disk" {
  name  = "mysql-data-disk"
  type  = "pd-ssd"
  zone  = var.zone
  size  = 35
  labels = {
    usage = "mysql-data"
  }
}

resource "google_compute_disk" "jenkins_data_disk" {
  name  = "jenkins-data-disk"
  type  = "pd-ssd"
  zone  = var.zone
  size  = 35
  labels = {
    usage = "jenkins-data"
  }
}

########################################
#               Buckets                #
########################################

resource "google_storage_bucket" "ansible_bucket" {
  name     = var.ansible_bucket_name
  location = var.location
  force_destroy = true

  lifecycle {
    prevent_destroy = false
  }
}

# Create an env variable for folder locatiom
locals {
  ansibleFiles = fileset("../ansible", "**")
}

resource "google_storage_bucket_object" "ansible_folder" {
  name   = "ansible/" 
  content = " "
  bucket = google_storage_bucket.ansible_bucket.name
}

# Upload ansible folder files
resource "google_storage_bucket_object" "ansible_files" {
  for_each = local.ansibleFiles

  name   = "${google_storage_bucket_object.ansible_folder.name}${each.value}"
  bucket = google_storage_bucket.ansible_bucket.name
  source = "${path.module}/../ansible/${each.value}"
}

#Create a pub sub topic for bucket file changes.
resource "google_pubsub_topic" "ansible_bucket_topic" {
  name = "ansible-bucket-topic"
}

resource "google_storage_notification" "bucket_notification" {
  bucket                  = google_storage_bucket.ansible_bucket.name
  topic                   = google_pubsub_topic.ansible_bucket_topic.id
  event_types             = ["OBJECT_FINALIZE", "OBJECT_DELETE"]
  payload_format          = "JSON_API_V1"
}

resource "google_pubsub_subscription" "ansible_bucket_subscription" {
  name  = "ansible-bucket-subscription"
  topic = google_pubsub_topic.ansible_bucket_topic.name
}