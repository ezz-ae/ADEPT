FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/services/api-fastapi
COPY ../../ /app
ENV REPO_ROOT=/app
ENV CATALOG_DIR=/app/preskills/catalog
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
