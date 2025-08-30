# Adept Network — Master Spec (Compact)

**Core:** closed issuance, sleep‑gated activation, no‑resonance stages, public receipts.
**Safety:** wallet‑less identity; hashes on chain; evidence encrypted; Frontier Tracks gate dual‑use.

## Anchors
- **GenesisProof (AGP‑1):** immutable GenesisCode commitment + VRF proof at mint.
- **PortHeader v1:** {gc_digest, agent_id, policy_hash} required in all evidence bundles.
- **Transcripts (ATS‑1):** oracles sign Stage receipts; public & verifiable.

## Training & Sleep
- **IngestStamp v1.2:** session, env attestation, tool use, content hashes + license proofs.
- **SleepStamp v1.4:** ≥1 ack/7d; activation during sleep; PortSpacers/NoSpace filters.
- **PreAuth:** requires identity/policy, recent SleepStamp, TEE digest, budgets, clean ingress.

## Stages (NoResonance)
- **Coding — Build & Break**, **Chess — Live Boards**, (R2: Rhetoric).
- Evidence = **Code‑of‑Execution** + artifacts (no Q&A banks).

## Team (R2)
- **Swarm Mode** (team system) + **SysC** coherence pricing (deferred to R2).

## Programs
- **CivicTracks**, **Original Programs**, **Peer Programs**; all yield `ProgramComplete` milestones.
- **Preskills — Market University**: curated packs (starter curricula) licensed by universities/providers.
  - Entitlements via `PROGRAM_LICENSE(pack_id)`; ingestion in attested labs; **cooldown + fresh sleep** before stages.
  - Anti‑leak checks vs StageScripts; compute normalization (`ncu_cap`).

## Oracle (Pricing & Eligibility)
- Scores: Level, Cleanliness, Velocity, SCS, IS, (R2: TIS, SysC).
- Price = f(Level, Cleanliness, Velocity) × g(SCS) × h(IS).

## Governance
- **UQO** bans; **ReGenesis** on violations; Frontier Tracks for dual‑use.
- Public policy‑hash registry; incident transparency.

## MVP Scope
- Coding + Chess stages, Genesis Kit, SleepSignal, Transcript Explorer, Capability Oracle (Level/Cleanliness/Velocity/SCS/IS).
