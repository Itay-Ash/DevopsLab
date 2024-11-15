module "address" {
  source     = "terraform-google-modules/address/google"
  version    = "~> 4.0"
  project_id = var.project_id
  region     = var.region
  subnetwork = "default"
  names      = ["web-server-static-ip", "mysql-server-static-ip", "jenkins-server-static-ip"]
  addresses  = [var.web_server_static_ip, var.mysql_server_static_ip, var.jenkins_server_static_ip]
}

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

resource "google_compute_instance" "web_vm" {
  name         = "web-server"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    network_ip = var.web_server_static_ip
    access_config {

    }
  }
  tags = ["web-server", "web"]
}

resource "google_compute_instance" "mysql_vm" {
  name         = "mysql-server"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

    attached_disk {
    source      = google_compute_disk.mysql_data_disk.id
    device_name = "mysql-data"
    mode        = "READ_WRITE"
  }

  network_interface {
    network = "default"
    network_ip = var.mysql_server_static_ip
  }
  metadata_startup_script = file("scripts/sql-vm-startup-script.sh")

  tags = ["mysql-server", "db"]
}

resource "google_compute_instance" "jenkins_vm" {
  name         = "jenkins-server"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

    attached_disk {
    source      = google_compute_disk.jenkins_data_disk.id
    device_name = "jenkins-data"
    mode        = "READ_WRITE"
  }

  network_interface {
    network = "default"
    network_ip = var.jenkins_server_static_ip
    access_config {
      
    }
  }
  metadata_startup_script = file("scripts/jenkins-vm-startup-script.sh")

  tags = ["jenkins-server", "ci-cd"]
}


#Deleted use of gcp bucket, I decided to use Ansible in the future instead.
#I used gsutil (A service account was created for the vm) and the bucket to upload the website files into the vm.
#I realised it meant deleting and recreating the vm anytime the code would need to change.
/*
# A Gcs bucket to contain all code
resource "google_storage_bucket" "code_bucket" {
  name     = "code-bucket"
  location = ""
  force_destroy = true

  # Lifecycle rule to delete the bucket after 1 day
  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }

  lifecycle {
    prevent_destroy = false
  }
}

# Automaticlly gather all files
locals {
  frontend_files = fileset("../code/web/frontend", "**") # Get all files in the folder
  backend_files = fileset("../code/web/backend", "**") # Get all files in the folder
}

resource "google_storage_bucket_object" "frontend_folder" {
  name   = "frontend/" 
  content = " "
  bucket = google_storage_bucket.code_bucket.name
}


resource "google_storage_bucket_object" "backend_folder" {
  name   = "backend/" 
  content = " "
  bucket = google_storage_bucket.code_bucket.name
}

# Upload frontend folder files
resource "google_storage_bucket_object" "frontend_files" {
  for_each = local.frontend_files

  name   = "${google_storage_bucket_object.frontend_folder.name}${each.value}"
  bucket = google_storage_bucket.code_bucket.name
  source = "${path.module}/../code/web/frontend/${each.value}"
}

# Upload backend folder files
resource "google_storage_bucket_object" "backend_files" {
  for_each = local.backend_files

  name   = "${google_storage_bucket_object.backend_folder.name}${each.value}"
  bucket = google_storage_bucket.code_bucket.name
  source = "${path.module}/../code/web/backend/${each.value}"
}
*/