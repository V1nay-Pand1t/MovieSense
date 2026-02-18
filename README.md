# 🎮 MovieSense

**AI-powered movie search & recommendation platform**

MovieSense is a **cloud-native movie recommendation system** built using **Django REST, React, and Azure Kubernetes Service (AKS)**. It focuses on fast search, scalable microservices, and production-grade observability.

---

## 🧠 Architecture Overview

**Core Components**

* **Backend:** Django REST API for recommendations
* **Workers:** Background IMDb ingestion jobs
* **Frontend:** React-based movie search UI
* **Platform:** Dockerized services deployed on AKS using Helm
* **Registry:** Azure Container Registry (ACR)
* **Observability:** Prometheus & Grafana

---

## 🎥 Application Demo

👉 **Video Demo**
[https://github.com/user-attachments/assets/495f5eb8-71c7-4b0f-b895-47957ee82b29](https://github.com/user-attachments/assets/495f5eb8-71c7-4b0f-b895-47957ee82b29)

---

## 📊 Observability Showcase

👉 **Grafana & Prometheus Dashboards**
[https://github.com/user-attachments/assets/ca2dc8a1-6142-4370-8159-257682dbeb3a](https://github.com/user-attachments/assets/ca2dc8a1-6142-4370-8159-257682dbeb3a)
[https://github.com/user-attachments/assets/5ec51f8a-2683-430e-b4c9-f0738d4466c2](https://github.com/user-attachments/assets/5ec51f8a-2683-430e-b4c9-f0738d4466c2)
[https://github.com/user-attachments/assets/bbd5646e-56fa-40b0-8fe9-e1c822d4429a](https://github.com/user-attachments/assets/bbd5646e-56fa-40b0-8fe9-e1c822d4429a)

---

## ⚙️ Prerequisites

* Azure account + `az` CLI
* `kubectl`, `Helm 3`, `Docker`
* Python 3.13

---

## 💻 Local Development

```bash
pip install -r movie_recommender/requirements.txt
cd movie_recommender
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Frontend setup instructions are available under `frontend/movie_frontend/`.

---

## 🐳 Build & Push Image

```bash
docker build -t movie-recommender:<tag> -f movie_recommender/Dockerfile .
docker tag movie-recommender:<tag> <acrName>.azurecr.io/movie-recommender:<tag>
az acr login --name <acrName>
docker push <acrName>.azurecr.io/movie-recommender:<tag>
```

---

## 🚀 Deploy on AKS (Helm)

```bash
helm upgrade --install movie-sense ./helm \
  --namespace movie-sense --create-namespace \
  --set image.repository=<acrName>.azurecr.io/movie-recommender \
  --set image.tag=<tag>
```

Verify:

```bash
kubectl get pods,svc -n movie-sense
```

---

## 🔐 Configuration

* Secrets via **Kubernetes Secrets** or **Azure Key Vault
