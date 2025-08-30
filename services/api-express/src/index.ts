import express from "express";
import cors from "cors";
import fs from "fs"; import path from "path";
import YAML from "yaml";

const app = express();
app.use(cors()); app.use(express.json());
const PORT = process.env.PORT || 8081;

function loadCatalog() {
  const root = process.env.REPO_ROOT || process.cwd();
  const dir = process.env.CATALOG_DIR || path.join(root, "preskills/catalog");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".yaml"));
  return files.map(f => {
    const y = YAML.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    return { packId: y.pack_id, version: y.version, domain: y.domain, level: y.level, durationHintHours: y.duration_hint_hours, ncuCap: y.ncu_cap, safetyClass: y.safety_class, policyHash: y.policy_hash };
  });
}

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/v1/catalog/preskills", (req,res)=> res.json(loadCatalog()));
app.listen(PORT, () => console.log("Express stub on", PORT));
