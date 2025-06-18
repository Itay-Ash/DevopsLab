resource "google_compute_instance_template" "docker_agent_vm_template" {
  name         = "docker-agent-server"
  machine_type = "e2-medium"

  disk {
    source_image      = "debian-cloud/debian-11"
  }

  metadata_startup_script = file("scripts/docker-agent-vm-startup-script.sh")

  network_interface {
    subnetwork = google_compute_subnetwork.private_agent_subnet.self_link
    access_config {

    }
  }

  service_account {
    email  = var.ansible_vm_iam_account_email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  tags = ["docker-agent-server", "ci-cd"]
}