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
    subnetwork = google_compute_subnetwork.private_subnet.self_link
    network_ip = google_compute_address.web_server_private_ip.address
    access_config {

    }

  }
  tags = ["web-server", "web"]
  allow_stopping_for_update = true
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
    subnetwork = google_compute_subnetwork.private_subnet.self_link
    network_ip = google_compute_address.mysql_server_private_ip.address
  }
  metadata_startup_script = file("scripts/sql-vm-startup-script.sh")

  tags = ["mysql-server", "db"]
  allow_stopping_for_update = true
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
    subnetwork = google_compute_subnetwork.private_subnet.self_link
    network_ip = google_compute_address.jenkins_server_private_ip.address
    access_config {
      
    }
  }
  metadata_startup_script = file("scripts/jenkins-vm-startup-script.sh")

  tags = ["jenkins-server", "ci-cd"]
  allow_stopping_for_update = true
}

resource "google_compute_instance" "ansible_vm" {
  name         = "ansible-server"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.private_subnet.self_link
    network_ip = google_compute_address.ansible_server_private_ip.address
    access_config {

    }
  }

    metadata_startup_script = file("scripts/ansible-vm-startup-script.sh")

    service_account {
    email  = var.ansible_vm_iam_account_email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  tags = ["ansible-server", "ansible"]
  allow_stopping_for_update = true
}
