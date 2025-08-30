#!/usr/bin/env python3
import argparse, hashlib
def sha256_hex(s): return '0x'+hashlib.sha256(s.encode()).hexdigest()
p=argparse.ArgumentParser(); p.add_argument('--policy-hash'); p.add_argument('--coex-hash'); p.add_argument('--artifact-hash'); p.add_argument('--concat'); a=p.parse_args()
print('[*] policyHash:', a.policy_hash); print('[*] coexHash:', a.coex_hash); print('[*] artifactHash:', a.artifact_hash)
if a.concat: print('[*] sha256(concat)=', sha256_hex(a.concat))
