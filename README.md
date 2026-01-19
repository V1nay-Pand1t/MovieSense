# 🎮 MovieSense

**AI-powered, hyper-fast movie search & recommendation system**

> A microservices-driven movie recommendation platform built with Django REST, React, and Azure Kubernetes Service (AKS) — delivering lightning-fast, AI-powered search with seamless CI/CD and real-time observability.
---

## 🧠 Architecture Overview


**Components**

* **Backend:** Django REST API for recommendation endpoints
* **Workers:** Background pickers for IMDb ingestion
* **Frontend:** React-based movie search UI
* **Infra:** Containerized & deployed on AKS via Helm
* **Registry:** Images stored in Azure Container Registry (ACR)


![Architecture Diagram]<img width="1472" height="720" alt="Gemini_Generated_Image_uyswfkuyswfkuysw" src="https://github.com/user-attachments/assets/c0c6d062-f2ef-41e0-b379-15271bcdc055" />


---

## ⚙️ Prerequisites

* Azure account + CLI (`az`)
* `kubectl`, `Helm 3`, `Docker`
* Python 3.13 (for local dev)
* PowerShell (Windows instructions)

---

## 💻 Local Development

```bash
# Activate virtual environment
.\environment\Activate.ps1

# Install dependencies
pip install -r movie_recommender/requirements.txt

# Run Django app
cd movie_recommender
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Open the frontend following `frontend/movie_frontend/README.md`.

---

## 🐳 Docker Build & Push

```bash
# Build image
docker build -t movie-recommender:<tag> -f movie_recommender/Dockerfile .

# Tag & push to ACR
docker tag movie-recommender:<tag> <acrName>.azurecr.io/movie-recommender:<tag>
az acr login --name <acrName>
docker push <acrName>.azurecr.io/movie-recommender:<tag>

# Or build directly into ACR
az acr build --registry <acrName> --image movie-recommender:<tag> --file movie_recommender/Dockerfile .
```

---

## ☁️ Deploy on Azure AKS

```bash
# Login & create resources
az login
az group create --name <rgName> --location <region>
az acr create --resource-group <rgName> --name <acrName> --sku Standard
az aks create --resource-group <rgName> --name <aksName> \
  --node-count 3 --enable-managed-identity --attach-acr <acrName> --generate-ssh-keys
az aks get-credentials --resource-group <rgName> --name <aksName>
```

---

## 🚀 Helm Deployment

```bash
# Update values.yaml (set image repo, tag, secrets)
helm upgrade --install movie-sense ./helm \
  --namespace movie-sense --create-namespace \
  --set image.repository=<acrName>.azurecr.io/movie-recommender \
  --set image.tag=<tag>
```

Verify:

```bash
kubectl get pods -n movie-sense
kubectl get svc -n movie-sense
```

---

## 🔐 Secrets & Config

* Store `SECRET_KEY`, DB credentials, and API keys via **Kubernetes Secrets** or **Azure Key Vault**.
* For PostgreSQL, use **Azure Database for PostgreSQL** and define `DATABASE_URL` in `values.yaml`.
