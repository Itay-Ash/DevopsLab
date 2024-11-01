# 🚀 DevOps Lab Setup: Connected Workflow Showcase

This document showcases my journey in creating a fully integrated DevOps lab environment, using various tools to achieve a production-like, resilient system. Each section has a checkbox to mark progress, providing a clear view of my achievements and areas still in progress.

---

## 🛠️ Step-by-Step DevOps Lab Setup: Connected Workflow

### Step 1: Set Up the Infrastructure with Terraform (Provisioning) ✅
- **Objective**: Use Terraform to provision the base infrastructure for the lab.
- **Action**:
  - Defined infrastructure in Terraform (e.g., VMs for web server, database, and CI/CD server).
  - Created a `main.tf` file specifying VMs, networking, and security groups.
  - Ran `terraform init` and `terraform apply` to deploy the environment.
- **Key Connection**: Provides the foundation for all other steps, ensuring VMs are networked properly.

---

### Step 2: Configure VMs with Ansible (Automation & Consistency) ✅
- **Objective**: Use Ansible to automate the installation and configuration of services on the VMs.
- **Action**:
  - Created an Ansible inventory listing Terraform-provisioned VMs.
  - Wrote playbooks to install services:
    - Web server: Installed NGINX, PHP, etc.
    - Database server: Installed MySQL or PostgreSQL.
    - CI/CD server: Installed Jenkins.
  - Ran Ansible playbooks to configure all VMs.
- **Key Connection**: Ensures each machine is consistently configured, reducing manual setup and maintaining uniformity.

---

### Step 3: Set Up Jenkins for CI/CD (Automation Integration) ✅
- **Objective**: Set up Jenkins to automate build, test, and deployment processes.
- **Action**:
  - Accessed the Jenkins VM (created in Step 1, configured in Step 2).
  - Installed Docker, GitHub, Ansible, and Terraform plugins.
  - Created a Jenkins pipeline to:
    - Pull code from Git.
    - Build Docker images.
    - Deploy the image to the web server.
  - Configured Jenkins for automatic triggers on Git pushes.
- **Key Connection**: Jenkins forms the core of the CI/CD process, enabling automatic build and deployment on code changes.

---

### Step 4: Containerize the Application with Docker (Isolation & Portability) ⬜
- **Objective**: Use Docker for containerization, ensuring consistency across environments.
- **Action**:
  - Created a Dockerfile in the app repository.
  - Configured Jenkins to build and push the Docker image to a private Docker registry.
  - Used Docker Compose to define services (web server, database).
  - Deployed Docker containers on the web server VM.
- **Key Connection**: Containerization ensures the app runs reliably, with Jenkins managing Docker builds.

---

### Step 5: Orchestrate with Kubernetes (Scalability & Reliability) ⬜
- **Objective**: Deploy and manage Dockerized applications with Kubernetes.
- **Action**:
  - Set up a Kubernetes cluster using kubeadm.
  - Created Kubernetes manifests (e.g., deployment, service files) to define app runtime.
  - Updated the Jenkins pipeline to deploy to Kubernetes.
  - Configured auto-scaling and load balancing with Kubernetes.
- **Key Connection**: Kubernetes enables scaling, redundancy, and resilience for the application.

---

### Step 6: Implement Monitoring with Prometheus and Grafana (Visibility & Metrics) ⬜
- **Objective**: Monitor infrastructure, services, and applications.
- **Action**:
  - Installed Prometheus (via Ansible) for metrics scraping.
  - Configured Prometheus to scrape metrics from the Kubernetes cluster.
  - Installed Grafana and created dashboards for insights.
  - Set up Grafana alerts (e.g., high CPU usage, pod failures).
- **Key Connection**: Monitoring provides system health visibility, allowing proactive troubleshooting and response.

---

### Step 7:
