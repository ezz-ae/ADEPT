# Adept API (FastAPI Stub)


Dev server:
```bash
cd services/api-fastapi
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
```

- OpenAPI json: http://localhost:8080/openapi.json
- Health: http://localhost:8080/health
- Example:
  - POST /v1/genesis/issue
  - GET  /v1/catalog/preskills
  - POST /v1/preskills/{id}/assign
  - POST /v1/preskills/{id}/ingest
  - GET  /v1/agents/{agentId}/preskills
