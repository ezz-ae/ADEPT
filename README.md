# Adept Network — Unified Repository (MVP)

**Date:** 2025-08-30

This repository contains everything you need to run the MVP slice of **Adept Network**:
- **Master Spec (cleaned, professional)** with safety, RBAC, and receipts.
- **Full OpenAPI v1** (including **Preskills / Market University** endpoints).
- **Solidity contracts (Foundry scaffold)** for interfaces + tests.
- **Transcript Explorer UI** (Vite + React + Tailwind) ready to run.
- **Pilot packet** (one‑pager, MOU, success metrics, outreach, case study template).
- **Policies** (Ethics, Frontier Tracks, UQO, Privacy) and **Ops** (Policy Hash Registry, TEE checklist).
- **CLI verifier** for policy/coex/artifact hashes.
- **Preskill manifests** (starter catalog).

## Quickstart

### 1) Contracts (Foundry)
```bash
cd contracts/foundry
forge install foundry-rs/forge-std
forge test -vv
```

### 2) API docs
Open `api/openapi.yaml` in Swagger UI / Redocly / your gateway docs.

### 3) Transcript Explorer (UI)
```bash
cd ui/transcript-explorer
npm i
npm run dev
# open http://localhost:5173
```

> The UI ships with local sample data. Wire it to your API when ready.

### 4) Pilot
Use `pilot/` to contact partners and run a 3‑week coding pilot.

## Repo Layout
```
/api/openapi.yaml
/contracts/foundry/            # solidity interfaces, mocks, tests
/docs/                         # master spec + policies + ops
/pilot/                        # partner materials
/preskills/catalog/            # example manifests (YAML)
/ui/transcript-explorer/       # Vite + React + Tailwind UI
/cli/verify_receipt.py         # hash helper
```
