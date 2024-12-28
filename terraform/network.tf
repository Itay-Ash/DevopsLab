########################################
#    Private Network Configuration     #
########################################

resource "google_compute_network" "private_vpc" {
  name                    = "private-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "private_subnet" {
  name          = "private-subnet"
  ip_cidr_range = var.ip_cidr_range
  region        = var.region
  network       = google_compute_network.private_vpc.id
}

resource "google_compute_address" "web_server_private_ip" {
  name         = "web-server-static-ip"
  address      = var.web_server_static_ip
  region       = var.region
  address_type = "INTERNAL"
  subnetwork   = google_compute_subnetwork.private_subnet.self_link
}

resource "google_compute_address" "mysql_server_private_ip" {
  name         = "mysql-server-static-ip"
  address      = var.mysql_server_static_ip
  region       = var.region
  address_type = "INTERNAL"
  subnetwork   = google_compute_subnetwork.private_subnet.self_link
}

resource "google_compute_address" "jenkins_server_private_ip" {
  name         = "jenkins-server-static-ip"
  address      = var.jenkins_server_static_ip
  region       = var.region
  address_type = "INTERNAL"
  subnetwork   = google_compute_subnetwork.private_subnet.self_link
}

########################################
#     Public Network Configuration     #
########################################

resource "google_compute_address" "web_server_public_ip" {
  name    = "web-server-public-ip"
  region  = var.region
  description = "Static public IP for the web server"
}

resource "google_compute_address" "jenkins_public_ip" {
  name    = "jenkins-public-ip"
  region  = var.region
  description = "Static public IP for Jenkins CI/CD server"
}
