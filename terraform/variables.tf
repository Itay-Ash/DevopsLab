variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "location" {
  type = string
}

variable "credentials_path" {
  type = string
}

variable "zone" {
  type = string
}

variable "ip_cidr_range" {
  type = string
}

variable "web_server_static_ip" {
  type = string
}

variable "mysql_server_static_ip" {
  type = string
}

variable "jenkins_server_static_ip" {
  type = string
}

variable "ansible_server_static_ip" {
  type = string
}

variable "private_dns_name" {
  type = string
}

variable "private_web_server_dns_name" {
  type = string
}

variable "private_mysql_server_dns_name" {
  type = string
}

variable "private_jenkins_server_dns_name" {
  type = string
}

variable "ansible_bucket_name" {
  type = string
}

variable "ansible_vm_iam_account_email" {
  type = string
}

variable "gcp_storage_iam_account_email" {
  type = string
}
