# 🚀 DevOps Lab Setup: Connected Workflow Showcase

This document captures my journey through creating a fully integrated DevOps lab, leveraging various tools to achieve a production-ready environment. Track progress with checkboxes to see what's completed and what’s still in progress.

---

## 🛠️ Step-by-Step DevOps Lab Setup: Connected Workflow

## Step 1: Set Up the Infrastructure with Terraform (Provisioning) 🏗️  
[View Related Issue](https://github.com/OwwFire/DevopsLab/issues/5)
- **Objective**: Use Terraform to provision the base infrastructure for the lab.
- **Action**:
  - [x] Create a `main.tf` file specifying VMs:
    - [x] **Web server VM** Add a public IP.
    - [x] **DB server VM**: Connect to a large permanent storage.
    - [x] **CI/CD VM**: Add a public IP and connect to a permanent storage.
  - [x] Create a `storage.tf` file specifying VMs:
    - [x] Add 2 presistent disks.
  - [x] Create an `infra.tf` file specifying networking:
    - [x] Create a private internal network. 
    - [x] Set a static private IP for each VM.
    - [x] Set a static public IP for each vm.
  - [x] Create a `dns.tf` file specifying networking and security groups:
    - [x] Set a static private DMS record for each VM.
- [x] Set a public DNS record for the web VM (using public provider).
- [x] Set a firewall policy.
- **Key Connection**: This forms the base infrastructure for all subsequent steps, ensuring that VMs are up and networked properly.

---

### Step 2: Configure VMs with Ansible (Automation & Consistency) 🔄
- **Objective**: Use Ansible to automate the installation and configuration of services on the VMs.
- **Action**:
- [x] Enhance Terraform infrastructure:  
  - [x] Provision an Ansible VM.  
  - [x] Create a bucket for Ansible code and dynamically update files on the Ansible VM.  
  - [x] Create a bucket to store all necessary scripts for other VMs.
- [x] Create an Ansible inventory listing Terraform-provisioned VMs (e.g., web, DB, CI/CD servers).
- Write playbooks to install necessary services:
  - [ ] **Web server VM**: Install NGINX, PHP, etc.
  - [ ] **DB server VM**: Install MySQL or PostgreSQL.
  - [ ] **CI/CD VM**: Install Jenkins.
- [ ] Run Ansible playbooks to configure all VMs.
- **Key Connection**: Ansible ensures all machines are consistently configured, minimizing manual intervention and maintaining uniformity.

---

### Step 3: Set Up Jenkins for CI/CD (Automation Integration) 🧩
- **Objective**: Install and configure Jenkins to automate the build, test, and deployment processes.
- **Action**:
  - [ ] Access the Jenkins VM (created in Step 1, configured in Step 2).
  - [ ] Install required plugins for Docker, GitHub, Ansible, and Terraform.
  - Create a Jenkins pipeline to:
    - [ ] Pull code from a Git repository.
    - [ ] Build a Docker image.
    - [ ] Deploy the image to the web server VM.
  - [ ] Configure Jenkins to trigger on every Git push (via webhooks or polling).
- **Key Connection**: Jenkins brings the entire CI/CD process together, automating code-to-deployment steps for streamlined updates.

---

### Step 4: Containerize the Application with Docker (Isolation & Portability) 🐳
- **Objective**: Use Docker to containerize the application, ensuring consistency across environments.
- **Action**:
  - [ ] Create a Dockerfile in the app’s Git repository.
  - [ ] Modify the Jenkins pipeline to build and push the Docker image to a private Docker registry (can be on Jenkins VM or cloud).
  - [ ] Use Docker Compose to define services (e.g., web server, database) if needed.
  - [ ] Run the Docker container on the web server VM.
- **Key Connection**: Containerization allows the application to run reliably in any environment, and Jenkins automates the container builds.

---

### Step 5: Orchestrate with Kubernetes (Scalability & Reliability) ☸️
- **Objective**: Deploy and manage the Dockerized application using Kubernetes for orchestration.
- **Action**:
  - [ ] Set up a Kubernetes cluster using `kubeadm` or a managed service (e.g., AWS EKS, GKE).
  - [ ] Create Kubernetes manifests (e.g., deployment and service files) to define app runtime.
  - [ ] Update the Jenkins pipeline to deploy the Docker image to the Kubernetes cluster (use `kubectl` or Helm from Jenkins).
  - [ ] Configure auto-scaling and load balancing for the app using Kubernetes.
- **Key Connection**: Kubernetes manages containerized applications across multiple nodes, allowing for scaling, redundancy, and self-healing.

---

### Step 6: Implement Monitoring with Prometheus and Grafana (Visibility & Metrics) 📊
- **Objective**: Set up monitoring for infrastructure, services, and the application.
- **Action**:
  - [ ] Install Prometheus on your infrastructure (using Ansible).
  - [ ] Configure Prometheus to scrape metrics from the Kubernetes cluster (e.g., pod usage, CPU, memory).
  - [ ] Install Grafana and configure dashboards to visualize Prometheus data.
  - [ ] Set up alerts in Grafana for key issues (e.g., high CPU usage, pod failures).
- **Key Connection**: Monitoring ensures you can observe system health and proactively respond to potential issues.

---

### Step 7: Centralize Logging with ELK Stack (Visibility & Debugging) 📜
- **Objective**: Set up centralized logging to track logs across all VMs and containers.
- **Action**:
  - [ ] Install Elasticsearch, Logstash, and Kibana (ELK) on a VM (using Docker or Ansible).
  - [ ] Configure Logstash to collect logs from all VMs and containers (use Filebeat/Logstash).
  - [ ] Set up Kibana to visualize logs for easier troubleshooting.
- **Key Connection**: Centralized logging provides a single source of truth for logs, aiding in debugging and analysis.

---

### Step 8: Secure Your Infrastructure (Security & Compliance) 🔒
- **Objective**: Implement security measures across the environment for compliance and vulnerability reduction.
- **Action**:
  - [ ] Set up a firewall using Ansible (e.g., `ufw` or `iptables`) to control traffic between VMs.
  - [ ] Install and configure SSL certificates for the web server (using Let's Encrypt or another provider).
  - [ ] Set up role-based access control (RBAC) in Kubernetes to limit access.
  - [ ] Run regular vulnerability scans (e.g., with OpenVAS) and address any issues.
- **Key Connection**: Security layers protect all services and ensure compliance with best practices.

---

### Step 9: Automate Backups and Disaster Recovery (Reliability & Resilience) 🛡️
- **Objective**: Set up automated backup solutions for resilience.
- **Action**:
  - [ ] Use Ansible to automate database and application backups (e.g., daily snapshots).
  - [ ] Store backups in a remote location (e.g., AWS S3, Google Cloud Storage).
  - [ ] Test disaster recovery by simulating VM failure and restoring from backups.
- **Key Connection**: Automated backups ensure resilience, enabling quick recovery after a failure.

---

### Step 10: Load Balancing and Auto-Scaling (High Availability) 🔄
- **Objective**: Ensure high availability and scalability of the web application.
- **Action**:
  - [ ] Set up an NGINX or HAProxy load balancer to distribute traffic across multiple web server VMs or Kubernetes pods.
  - [ ] Configure auto-scaling in Kubernetes to add/remove pods based on traffic demand.
  - [ ] Implement health checks to detect and reroute traffic from failed instances.
- **Key Connection**: Load balancing and auto-scaling ensure the system is available and adapts to changing traffic.

---

## 🌟 Final Outcome: Fully Integrated DevOps Lab
By following these steps, this lab setup demonstrates the practical application of DevOps tools, resulting in:
- Provisioned Infrastructure with Terraform.
- Automated Configuration using Ansible.
- CI/CD Pipelines managed by Jenkins.
- Containerized Applications with Docker.
- Scalable Orchestration via Kubernetes.
- Full Monitoring & Logging with Prometheus, Grafana, and ELK.
- High Availability, Security, and Resilience through load balancing, backups, and security automation.

Each step highlights and consolidates my knowledge and practical experience in DevOps, showcasing a robust, production-ready environment.
