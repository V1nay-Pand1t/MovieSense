# 🎮 MovieSense

**AI-powered movie search & recommendation platform**

MovieSense is a **cloud-native movie recommendation system** built using **Django REST, React, and Azure Kubernetes Service (AKS)**. It focuses on fast search, scalable microservices, and production-grade observability.

---

## 🧠 Architecture Overview
![Architecture Diagram]<img width="1472" height="720" alt="Gemini_Generated_Image_uyswfkuyswfkuysw" src="https://github.com/user-attachments/assets/c0c6d062-f2ef-41e0-b379-15271bcdc055" />

**Core Components**

* **Backend:** Django REST API for recommendations
* **Workers:** Background IMDb ingestion jobs
* **Frontend:** React-based movie search UI
* **Platform:** Dockerized services deployed on AKS using Helm
* **Registry:** Azure Container Registry (ACR)
* **Observability:** Prometheus & Grafana

---

## 🎥 Application Demo


https://github.com/user-attachments/assets/0a8c293e-6d18-459b-8959-8b1921bd930a


---

## 📊 Observability Showcase

👉 **Grafana & Prometheus Dashboards**
![#1]<img width="1472" height="720" alt="Placeholder" src="https://github.com/user-attachments/assets/ca2dc8a1-6142-4370-8159-257682dbeb3a" />
![#2]<img width="1472" height="720" alt="pLACEHOLDER" src="https://github.com/user-attachments/assets/5ec51f8a-2683-430e-b4c9-f0738d4466c2" />
![#2]<img width="1472" height="720" alt="Gw" src="https://github.com/user-attachments/assets/bbd5646e-56fa-40b0-8fe9-e1c822d4429a" />

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
