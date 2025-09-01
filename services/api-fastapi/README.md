import os, json, hmac, hashlib
from fastapi import Depends

SECRET = os.getenv("ORACLE_SECRET", "change-me-dev")

def stable_json(obj) -> bytes:
    # Deterministic JSON for signature
    return json.dumps(obj, sort_keys=True, separators=(",",":")).encode()

def sign_dict(d: dict) -> str:
    return "hmac256:" + hmac.new(SECRET.encode(), stable_json(d), hashlib.sha256).hexdigest()

class SignRequest(BaseModel):
    receipt: dict  # expects fields like StageReceipt, but allows forward-compat

class SignResponse(BaseModel):
    sig: str

@app.post(API_PREFIX + "/oracle/sign", response_model=SignResponse)
def oracle_sign(req: SignRequest):
    # never sign if required fields missing
    required = ["examId","stageId","ts","score","policyHash","evidenceCid","coexHash","artifactHash"]
    if any(k not in req.receipt for k in required):
        raise HTTPException(400, "receipt incomplete")
    return SignResponse(sig=sign_dict(req.receipt))
