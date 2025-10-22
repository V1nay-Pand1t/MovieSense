# Stage 1: Build dependencies
FROM python:3.13-slim AS builder

WORKDIR /app
COPY requirements.txt .

# Install build tools temporarily + dependencies into a wheel cache
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential gcc \
#     && pip install --no-cache-dir --prefix=/install -r requirements.txt 

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential gcc curl \
    && python -m pip install --upgrade pip setuptools wheel \
    && pip --version

# Install a compatible tokenizers version first (pin to a range / specific version)
# Then install other requirements into an isolated prefix to keep final image small.
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Install torch/sentence-transformers (adjust for CPU/GPU as needed)
# Note: remove the trailing backslash spaces if copying exactly.
RUN pip install --prefix=/install --no-cache-dir \
    torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu \
    sentence-transformers

RUN apt-get purge -y build-essential gcc \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*


# Stage 2: Final image
FROM python:3.13-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# export djano-promt    
ENV prometheus_multiproc_dir=/tmp/prometheus
RUN command rm -rf /tmp/prometheus && mkdir /tmp/prometheus
# Run migrations + collectstatic + start server
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn movide_recommender.wsgi:application --workers 3 --bind 0.0.0.0:8081"]
