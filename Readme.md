# Kubernetes Store Provisioning Platform

**Urumi AI SDE Internship — Round 1 System Design Assignment**

---

# Overview

This project implements a Kubernetes-native store provisioning platform capable of automatically creating, managing, and deleting isolated ecommerce stores using Helm.

Each store is deployed in its own Kubernetes namespace with dedicated database, storage, networking, and ingress configuration.

The platform is designed to run locally on Minikube and deploy to production environments such as a VPS running k3s using the same Helm charts with configuration changes only.

---

# Architecture Overview

## Components

**Frontend (React Dashboard)**
Provides UI for:

* Viewing stores and status
* Creating new stores
* Opening store URLs
* Deleting stores

**Backend API (Node.js + Express + PostgreSQL)**

Responsible for:

* Store lifecycle management
* Provisioning orchestration
* Helm execution
* Status tracking
* Idempotency and failure handling

**Provisioning Worker**

Responsible for:

* Helm chart deployment
* Namespace creation
* Ingress provisioning
* Persistent storage setup
* Cleanup on deletion

**Kubernetes Cluster**

Each store gets:

* Dedicated namespace
* MySQL database (StatefulSet + PVC)
* WordPress + WooCommerce deployment
* Service
* Ingress
* Persistent storage

---

# High-Level Flow

```
User → Dashboard → Backend API → Worker → Helm → Kubernetes

Kubernetes creates:

Namespace
 ├── MySQL StatefulSet + PVC
 ├── WordPress Deployment
 ├── Services
 ├── Ingress

Backend updates store status → Dashboard reflects state
```

---

# Repository Structure

```
project-root/
│
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── models/
│   │   ├── utils/
│   │   └── index.ts
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│
├── charts/
│   └── store/
│       ├── templates/
│       ├── values-local.yaml
│       ├── values-prod.yaml
│       └── Chart.yaml
│
└── README.md
```

---

# Local Setup Instructions (Minikube)

## Prerequisites

Install:

* Docker
* Minikube
* kubectl
* Helm
* Node.js
* PostgreSQL

---

## Start Kubernetes

```
minikube start --memory=3500 --cpus=4

minikube addons enable ingress
minikube addons enable storage-provisioner
minikube addons enable default-storageclass
```

Verify:

```
kubectl get pods -A
```

---

## Start Backend

```
cd backend
npm install
npm run dev
```

Runs on:

```
http://localhost:6060
```

---

## Start Frontend

```
cd web
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# Creating a Store

Open dashboard:

```
http://localhost:5173
```

Click:

```
Create Store
```

System automatically:

* Creates namespace
* Deploys MySQL
* Deploys WordPress + WooCommerce
* Creates ingress
* Updates database

Store status changes:

```
PROVISIONING → READY
```

---

# Access Store

Click:

```
Open Store
```

Or use:

```
kubectl port-forward svc/wordpress 8080:80 -n store-<uuid>
```

Open:

```
http://localhost:8080
```

---
Without port-forward:

Browser ❌ cannot reach cluster internal network


With port-forward:

Browser → localhost:8080 → kubectl tunnel → Service → Pod

# Place an Order (Verification Requirement)

Steps:

1. Install WordPress
2. Activate WooCommerce plugin
3. Add product
4. Add product to cart
5. Checkout
6. Confirm order in WooCommerce admin panel

This satisfies Definition of Done requirements.

---

# Delete Store

Click Delete in dashboard.

System automatically:

* Uninstalls Helm release
* Deletes namespace
* Removes PVC
* Cleans database entry

---

# VPS / Production Setup (k3s)

This project is designed to run on production Kubernetes environments such as k3s using the same Helm charts.

## Install k3s on VPS

```
curl -sfL https://get.k3s.io | sh -
```

Verify:

```
kubectl get nodes
```

---

## Install Ingress Controller

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

---

## Deploy Store Using Production Values

```
helm install store-prod ./charts/store \
  -f charts/store/values-prod.yaml \
  --set namespace=store-prod
```

---

# Helm Configuration

Supports environment-specific configuration via:

```
values-local.yaml
values-prod.yaml
```

Handles differences in:

* Domain
* Storage size
* Ingress configuration
* Secrets
* Production DNS

No code changes required.

---

# Kubernetes Resources Created Per Store

```
Namespace
StatefulSet (MySQL)
PersistentVolumeClaim
Deployment (WordPress)
Service (MySQL)
Service (WordPress)
Ingress
Secrets
```

---

# Isolation Model

Each store runs in its own namespace providing:

* Resource isolation
* Network isolation
* Storage isolation
* Independent lifecycle

Prevents cross-store interference.

---

# Idempotency and Failure Handling

Provisioning logic ensures safe retries:

```
helm status <release>
```

If exists → mark READY

If not → install

Failures handled via:

* Status tracking
* Error logging
* Automatic cleanup

---

# Cleanup Guarantees

Deletion workflow:

```
helm uninstall
kubectl delete namespace
database cleanup
```

Ensures no orphan resources remain.

---

# Security Model

Secrets managed via Kubernetes Secrets.

No hardcoded credentials.

Database credentials isolated per namespace.

Ingress only exposes WordPress frontend.

Backend orchestration not publicly exposed.

---

# Scaling Model

Stateless components scale horizontally:

* Backend API
* Dashboard

Provisioning can handle concurrent store creation.

Stateful components isolated per namespace.

---

# Production Differences (Local vs VPS)

Handled via Helm values:

Local:

```
values-local.yaml
```

Production:

```
values-prod.yaml
```

Differences include:

* Domain
* Storage class
* DNS
* Secrets
* Ingress config

No application code changes required.

---

# Tradeoffs and Design Decisions

Namespace per store chosen for strongest isolation.

StatefulSet used for database to ensure persistence.

Helm used for declarative infrastructure provisioning.

PostgreSQL used for control plane metadata storage.

Minikube used for local testing.

Architecture optimized for production portability.

---

# Technologies Used

Frontend:

* React
* TailwindCSS

Backend:

* Node.js
* Express
* PostgreSQL
* Sequelize

Infrastructure:

* Kubernetes
* Helm
* Minikube
* k3s compatible

Database:

* MySQL (per store)
* PostgreSQL (control plane)

---

# System Design Goals Achieved

Kubernetes-native provisioning
Multi-store isolation
Persistent storage
Ingress routing
Idempotent provisioning
Clean teardown
Production-ready architecture

---

# Demo Summary

Demonstrated:

* Create store
* Provision infrastructure
* Access store
* Place order
* Delete store
* Cleanup resources

---

# Author

Abhinil Savarni

Urumi AI Internship Round 1 Submission
