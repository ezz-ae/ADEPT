from fastapi import FastAPI, HTTPException, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
import os, glob, yaml, time, hashlib

API_PREFIX = "/v1"

app = FastAPI(title="Adept Network API (MVP Stub)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Models (minimal) ----
class AdeptPort(BaseModel):
    agentId: str
    ownerDid: str
    createdAt: str

class GenesisIssueReq(BaseModel):
    ownerDid: str
    policyVersion: str
    metadataUri: Optional[str] = None

class GenesisProof(BaseModel):
    agentId: str
    coreVersion: str = "core-1"
    policyVersion: str
    weightsChecksum: str = "sha256:0000"
    creationTs: int
    termsHash: str = "sha256:terms"
    metadataUri: Optional[str] = None
    genesiscodeCommitment: str
    vrfProof: str = "0xvrf"
    vrfPk: str = "0xvrfpk"

class StageScheduleRequest(BaseModel):
    agentId: str
    domain: Literal["chess","coding","rhetoric"]
    stageType: Literal["live_boards","build_break","argument_graph","swarm_squad"]
    desiredAt: Optional[str] = None

class StageScheduleResponse(BaseModel):
    stageId: str
    imageDigest: str = "sha256:stage-image"
    budgets: Dict[str,int] = {"ncuCap": 60, "timeLimitSec": 3600}
    policyHash: str = "0xpolicy"

class StageBeginResponse(BaseModel):
    go: bool
    reason: Optional[str] = None
    preauthChecklist: List[str] = []

class StageSubmitRequest(BaseModel):
    evidenceCid: str
    coexHash: str
    artifactHash: str
    noresMode: bool = True

class StageReceipt(BaseModel):
    examId: str
    stageId: str
    ts: int
    score: int
    grade: str
    policyHash: str
    ncuUsed: int
    oracle: str = "oracle://demo"
    evidenceCid: str
    coexHash: str
    artifactHash: str
    noresMode: bool = True
    stabilityMod: int = 0
    baseline: bool = False
    assetRef: Optional[str] = None
    attemptId: str
    attestationUid: str = "att://demo"

class CapabilityScores(BaseModel):
    domain: str
    level: int
    cleanliness: float
    velocity: float
    scs: float
    iscore: float
    sysc: Optional[float] = None
    updatedAt: str

class PreskillPackSummary(BaseModel):
    packId: str
    version: str
    domain: str
    level: int
    durationHintHours: float
    ncuCap: int
    safetyClass: Literal["general","frontier"]
    qScore: float = 0.0
    verified: bool = True

class PreskillPack(BaseModel):
    packId: str
    version: str
    domain: str
    level: int
    durationHintHours: float
    ncuCap: int
    safetyClass: Literal["general","frontier"]
    policyHash: str
    license: str
    licenseProof: str
    syllabus: List[str] = []
    resources: List[Dict[str, Any]] = []

class PreskillAssignRequest(BaseModel):
    agentId: Optional[str] = None
    cohortId: Optional[str] = None
    packId: str
    version: str

class PreskillIngestRequest(BaseModel):
    agentId: str
    packId: str
    sessionId: str
    teeQuote: str
    imageDigest: str

class PreskillStatus(BaseModel):
    packId: str
    status: Literal["assigned","running","completed","blocked"]
    lastUpdate: str
    reason: Optional[str] = None

# ---- In-memory stores (for demo) ----
AGENTS = {}
TRANSCRIPTS: Dict[str, List[Dict[str, Any]]] = {}
PRESKILL_STATUS: Dict[str, List[PreskillStatus]] = {}
CATALOG: Dict[str, PreskillPack] = {}

def now_iso():
    import datetime as dt; return dt.datetime.utcnow().isoformat()+"Z"

def load_catalog():
    CATALOG.clear()
    catalog_dir = os.getenv("CATALOG_DIR", os.path.join(os.getenv("REPO_ROOT","."), "preskills/catalog"))
    for path in glob.glob(os.path.join(catalog_dir, "*.yaml")):
        with open(path, "r", encoding="utf-8") as f:
            y = yaml.safe_load(f)
        CATALOG[y["pack_id"]] = PreskillPack(
            packId=y["pack_id"], version=y["version"], domain=y["domain"], level=int(y["level"]),
            durationHintHours=float(y["duration_hint_hours"]), ncuCap=int(y["ncu_cap"]),
            safetyClass=y["safety_class"], policyHash=y["policy_hash"],
            license=y["license"], licenseProof=y.get("license_proof",""),
            syllabus=y.get("syllabus",[]), resources=y.get("resources",[])
        )

@app.on_event("startup")
def startup():
    load_catalog()

# ---- Routes ----

@app.get("/health")
def health(): return {"ok": True, "time": now_iso()}

@app.post(API_PREFIX + "/genesis/issue")
def issue_genesis(req: GenesisIssueReq):
    commit = hashlib.sha256(f"{req.ownerDid}:{time.time()}".encode()).hexdigest()
    agent_id = "0x" + hashlib.sha256(commit.encode()).hexdigest()
    port = AdeptPort(agentId=agent_id, ownerDid=req.ownerDid, createdAt=now_iso())
    proof = GenesisProof(agentId=agent_id, policyVersion=req.policyVersion, metadataUri=req.metadataUri,
                         creationTs=int(time.time()), genesiscodeCommitment="0x"+commit)
    AGENTS[agent_id] = {"port": port.model_dump(), "proof": proof.model_dump()}
    # seed transcript array
    TRANSCRIPTS.setdefault(agent_id, [])
    return {"adeptPort": port, "genesisProof": proof}

@app.get(API_PREFIX + "/agents/{agentId}/transcript")
def get_transcript(agentId: str = Path(...)):
    return {"items": TRANSCRIPTS.get(agentId, [])}

@app.post(API_PREFIX + "/stages/schedule")
def schedule_stage(req: StageScheduleRequest):
    stage_id = f"{req.domain}-{req.stageType}-{int(time.time())}"
    return StageScheduleResponse(stageId=stage_id)

@app.post(API_PREFIX + "/stages/{stageId}/begin")
def begin_stage(stageId: str = Path(...)):
    # minimal preauth: always go=true; real service would check SleepStamp, Assets, TEE, policy, budgets
    return StageBeginResponse(go=True, preauthChecklist=["policyHash-ok","sleepAck-recent","tee-attested","budget-ok"])

@app.post(API_PREFIX + "/stages/{stageId}/submit")
def submit_stage(stageId: str, req: StageSubmitRequest):
    exam_id = hashlib.sha256(f"{stageId}:{req.coexHash}:{req.artifactHash}".encode()).hexdigest()[:16]
    # fabricate a score
    score = 90
    receipt = StageReceipt(
        examId=f"EX-{exam_id}", stageId=stageId, ts=int(time.time()), score=score, grade="PASS",
        policyHash="0xpolicy", ncuUsed=42, evidenceCid=req.evidenceCid, coexHash=req.coexHash, artifactHash=req.artifactHash,
        attemptId=hashlib.sha256(str(time.time()).encode()).hexdigest()[:16]
    )
    # push to a random agent if exists
    if AGENTS:
        any_agent = next(iter(AGENTS.keys()))
        TRANSCRIPTS.setdefault(any_agent, []).append(receipt.model_dump())
    return receipt

@app.get(API_PREFIX + "/oracle/{agentId}/{domain}")
def capability(agentId: str, domain: str):
    # naive: compute simple values
    scores = CapabilityScores(
        domain=domain, level=5, cleanliness=0.95, velocity=0.12, scs=0.92, iscore=0.89, updatedAt=now_iso()
    )
    return scores

# Preskills
@app.get(API_PREFIX + "/catalog/preskills", response_model=List[PreskillPackSummary])
def list_preskills(domain: Optional[str] = None, level: Optional[int] = None):
    items = []
    for p in CATALOG.values():
        if domain and p.domain != domain: continue
        if level and p.level != level: continue
        items.append(PreskillPackSummary(
            packId=p.packId, version=p.version, domain=p.domain, level=p.level,
            durationHintHours=p.durationHintHours, ncuCap=p.ncuCap,
            safetyClass=p.safetyClass, qScore=0.0, verified=True
        ))
    return items

@app.get(API_PREFIX + "/preskills/{packId}", response_model=PreskillPack)
def get_pack(packId: str):
    p = CATALOG.get(packId)
    if not p: raise HTTPException(404, "pack not found")
    return p

@app.post(API_PREFIX + "/preskills/{packId}/assign", status_code=201)
def assign_pack(packId: str, req: PreskillAssignRequest):
    target = req.agentId or req.cohortId
    if not target: raise HTTPException(400, "agentId or cohortId required")
    if packId not in CATALOG: raise HTTPException(404, "pack not found")
    # mark assigned
    if req.agentId:
        st = PRESKILL_STATUS.setdefault(req.agentId, [])
        st.append(PreskillStatus(packId=packId, status="assigned", lastUpdate=now_iso()))
    return {"ok": True}

@app.post(API_PREFIX + "/preskills/{packId}/ingest", status_code=201)
def ingest_pack(packId: str, req: PreskillIngestRequest):
    if packId not in CATALOG: raise HTTPException(404, "pack not found")
    st_list = PRESKILL_STATUS.setdefault(req.agentId, [])
    # update status to running -> completed immediately (demo)
    st_list.append(PreskillStatus(packId=packId, status="running", lastUpdate=now_iso()))
    st_list.append(PreskillStatus(packId=packId, status="completed", lastUpdate=now_iso()))
    ingest_stamp = {
        "version":"1.2","agentId":req.agentId,"sessionId":req.sessionId,
        "tsStart":int(time.time())-10,"tsEnd":int(time.time()),
        "source":"api","tutorType":"automated","policyHash":"0xpolicy",
        "ncuSpent": CATALOG[packId].ncuCap//2,
        "computeEnv":{"imageDigest":req.imageDigest,"teeQuote":req.teeQuote,"hardwareTcb":"demo"},
        "toolUsage":[],"contentSources":[{"sourceType":"pack","uri":packId,"hash":CATALOG[packId].policyHash,"license":"Publisher"}],
        "signingPubkey":"demo","signature":"demo"
    }
    return ingest_stamp

@app.get(API_PREFIX + "/agents/{agentId}/preskills", response_model=List[PreskillStatus])
def preskill_status(agentId: str):
    return PRESKILL_STATUS.get(agentId, [])

# Sleep (stubs)
class SleepScheduleReq(BaseModel):
    agentId: str; windowStart: str; windowEnd: str
@app.post(API_PREFIX + "/sleep/schedule")
def sleep_schedule(req: SleepScheduleReq): return {"ok": True, "next": req.windowStart}

@app.get(API_PREFIX + "/agents/{agentId}/sleep/hints")
def sleep_hints(agentId: str): return {"sleepSuggested": True, "blockingDomains": []}

# Governance
@app.get(API_PREFIX + "/owners/status")
def owner_status(address: str): return {"address": address, "banned": False, "suspended": False, "reasonCode": None}
