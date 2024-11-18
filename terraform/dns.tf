########################################
#      Private DNS Configuration       #
########################################

resource "google_dns_managed_zone" "private_dns_zone" {
  name     = "private-vpc-dns-zone"
  dns_name = var.private_dns_name
  visibility = "private"

  private_visibility_config {
    networks {
      network_url = google_compute_network.private_vpc.self_link
    }
  }
}

resource "google_dns_record_set" "private_web_server_record" {
  name        = "${var.private_web_server_dns_name}.${var.private_dns_name}"
  type        = "A"
  ttl         = 300
  managed_zone = google_dns_managed_zone.private_dns_zone.name
  rrdatas     = [google_compute_instance.web_vm.network_interface[0].network_ip]
}

resource "google_dns_record_set" "private_mysql_server_record" {
  name        = "${var.private_mysql_server_dns_name}.${var.private_dns_name}"
  type        = "A"
  ttl         = 300
  managed_zone = google_dns_managed_zone.private_dns_zone.name
  rrdatas     = [google_compute_instance.mysql_vm.network_interface[0].network_ip]
}

resource "google_dns_record_set" "private_jenkins_server_record" {
  name        = "${var.private_jenkins_server_dns_name}.${var.private_dns_name}"
  type        = "A"
  ttl         = 300
  managed_zone = google_dns_managed_zone.private_dns_zone.name
  rrdatas     = [google_compute_instance.jenkins_vm.network_interface[0].network_ip]
}
