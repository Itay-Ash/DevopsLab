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

########################################
#               Buckets                #
########################################
# Preventing destroy for testing to be easier

resource "google_storage_bucket" "ansible_bucket" {
  name     = var.ansible_bucket_name
  location = var.location
  force_destroy = true

  lifecycle {
    prevent_destroy = false
  }
}

resource "google_storage_bucket" "jenkins_bucket" {
  name     = var.jenkins_bucket_name
  location = var.location
  force_destroy = true

  lifecycle {
    prevent_destroy = false
  }
}

resource "google_storage_bucket" "code_bucket" {
  name     = var.code_bucket_name
  location = var.location
  force_destroy = true

  lifecycle {
    prevent_destroy = false
  }
}


# Create an env variable for folders locations
locals {
  ansibleFiles = fileset("../ansible", "**")
  jenkinsFiles = fileset("../jenkins", "**")
  frontendFiles = fileset("../code/web/frontend", "**") 
  backendFiles = fileset("../code/web/backend", "**")
  dbFiles =  fileset("../code/db", "**")
}

# Create folders for buckets
resource "google_storage_bucket_object" "ansible_folder" {
  name   = "ansible/" 
  content = " "
  bucket = google_storage_bucket.ansible_bucket.name
}

resource "google_storage_bucket_object" "jenkins_folder" {
  name   = "jenkins/" 
  content = " "
  bucket = google_storage_bucket.jenkins_bucket.name
}

resource "google_storage_bucket_object" "code_folder" {
  name   = "Web/" 
  content = " "
  bucket = google_storage_bucket.code_bucket.name
}

resource "google_storage_bucket_object" "frontend_folder" {
  name   = "Web/frontend/" 
  content = " "
  bucket = google_storage_bucket.code_bucket.name
}


resource "google_storage_bucket_object" "backend_folder" {
  name   = "Web/backend/" 
  content = " "
  bucket = google_storage_bucket.code_bucket.name
}

resource "google_storage_bucket_object" "db_folder" {
  name   = "DB/" 
  content = " "
  bucket = google_storage_bucket.code_bucket.name
}

# Upload ansible folder files
resource "google_storage_bucket_object" "ansible_files" {
  for_each = local.ansibleFiles

  name   = "${google_storage_bucket_object.ansible_folder.name}${each.value}"
  bucket = google_storage_bucket.ansible_bucket.name
  source = "${path.module}/../ansible/${each.value}"
}

# Upload jenkins folder files
resource "google_storage_bucket_object" "jenkins_files" {
  for_each = local.jenkinsFiles

  name   = "${google_storage_bucket_object.jenkins_folder.name}${each.value}"
  bucket = google_storage_bucket.jenkins_bucket.name
  source = "${path.module}/../jenkins/${each.value}"
}

# Upload frontend folder files
resource "google_storage_bucket_object" "frontend_files" {
  for_each = local.frontendFiles

  name   = "${google_storage_bucket_object.frontend_folder.name}${each.value}"
  bucket = google_storage_bucket.code_bucket.name
  source = "${path.module}/../code/web/frontend/${each.value}"
}

# Upload backend folder files
resource "google_storage_bucket_object" "backend_files" {
  for_each = local.backendFiles

  name   = "${google_storage_bucket_object.backend_folder.name}${each.value}"
  bucket = google_storage_bucket.code_bucket.name
  source = "${path.module}/../code/web/backend/${each.value}"
}

# Upload db folder files
resource "google_storage_bucket_object" "db_files" {
  for_each = local.dbFiles

  name   = "${google_storage_bucket_object.db_folder.name}${each.value}"
  bucket = google_storage_bucket.code_bucket.name
  source = "${path.module}/../code/db/${each.value}"
}

########################################
#               PUB/SUBs               #
########################################

# Create topic (similar to message stream) for ansible bucket changes
resource "google_pubsub_topic" "ansible_bucket_topic" {
  name = "ansible-bucket-topic"
}

# Import the data for gcp's storage account
data "google_storage_project_service_account" "gcs_account" {
}

# Give gcp's storage account premissions to publish to the topic
resource "google_pubsub_topic_iam_member" "ansible_bucket_publisher" {
  topic = google_pubsub_topic.ansible_bucket_topic.name

  role   = "roles/pubsub.publisher"
  member = "serviceAccount:${data.google_storage_project_service_account.gcs_account.email_address}"
}

# Create notifications in the topic based on ansible bucket changes
resource "google_storage_notification" "bucket_notification" {
  bucket                  = google_storage_bucket.ansible_bucket.name
  topic                   = google_pubsub_topic.ansible_bucket_topic.id
  event_types             = ["OBJECT_FINALIZE", "OBJECT_DELETE"]
  payload_format          = "JSON_API_V1"

  depends_on = [ google_pubsub_topic_iam_member.ansible_bucket_publisher ]
}

# Create subscription to follow for new messages.
resource "google_pubsub_subscription" "ansible_bucket_subscription" {
  name  = "ansible-bucket-subscription"
  topic = google_pubsub_topic.ansible_bucket_topic.name
}