import React, { useMemo, useState } from "react";
import "./index.css";

function Hash({ value }: { value?: string }) {
  const short = value?.startsWith("0x") ? value.slice(0, 10) + "…" + value.slice(-6) : value;
  return <span className="font-mono text-xs px-2 py-1 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">{short}</span>;
}
function Badge({ children, tone = "zinc" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    zinc: "bg-zinc-100 text-zinc-700 border-zinc-200",
  };
  return <span className={`text-xs px-2 py-1 rounded-full border ${tones[tone] || tones.zinc}`}>{children}</span>;
}
function Section({ title, right, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
        <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
        <div className="flex items-center gap-2">{right}</div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const sample = {
  agentId: "0x0af3a0f9b3b4c9e2d43e0f4b89f0cd2a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
  receipts: [
    { examId: "EX-001", stageId: "STAGE-DEV-001", ts: 1730318400, domain: "coding", stageType: "build_break", score: 92, grade: "PASS", ncuUsed: 41, policyHash: "0xabc...", coexHash: "0x1111...", artifactHash: "0xffff...", attestationUid: "0xatt...", noresMode: true, stabilityMod: 2, baseline: false },
  ],
  sleepStamps: [
    { version: "1.4", tsWindowStart: 1730265600, tsWindowEnd: 1730294400, healthcheckStatus: "pass", rollingAck7d: 6, missedWindows7d: 0, activationsCount: 4, quarantinedCount: 0, classvoteEpoch: "2024w44", unpairedCount: 3, pairedCount: 3, sleepSuggested: false, teamBucket: "B-13", teamEpoch: "2024w44", gcDigest: "0x6a1b…29f3", swarmMode: false, teamSleepSync: 0.0 },
  ],
  scores: { domain: "coding", level: 5, cleanliness: 0.94, velocity: 0.18, scs: 0.92, iscore: 0.88, sysc: null as number | null, updatedAt: "2025-08-01T12:00:00Z" },
};

function tsToStr(ts: number) { return new Date(ts * 1000).toLocaleString(); }
function computePrice(x: any) {
  const { level, cleanliness, velocity, scs, iscore, sysc } = x;
  const a = Math.max(level, 1);
  const b = 0.5 + 0.5 * (cleanliness ?? 0.8);
  const c = 1 + (velocity ?? 0);
  const d = 0.5 + 0.5 * (scs ?? 0.8);
  const e = 0.7 + 0.3 * (iscore ?? 0.8);
  const j = sysc == null ? 1 : 0.7 + 0.3 * sysc;
  return Math.round(a * b * c * d * e * j * 100) / 100;
}
function ExportButton({ filename, data }: { filename: string; data: any }) {
  const onClick = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return <button onClick={onClick} className="text-xs px-3 py-1.5 rounded border border-zinc-300 hover:border-zinc-400 bg-white">Export JSON</button>;
}
function StageCard({ r }: any) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={r.domain === "coding" ? "blue" : "violet"}>{r.domain}</Badge>
            <Badge tone="zinc">{r.stageType}</Badge>
            {r.baseline && <Badge tone="amber">baseline</Badge>}
          </div>
          <div className="mt-2 text-sm text-zinc-500">{tsToStr(r.ts)}</div>
          <div className="mt-1 text-sm">Exam <span className="font-mono">{r.examId}</span> • Stage <span className="font-mono">{r.stageId}</span></div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-zinc-900">{r.score}</div>
          <div className="text-sm text-zinc-500">grade {r.grade}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-zinc-500">NCU</span><Badge tone="zinc">{r.ncuUsed}</Badge>
        <span className="text-xs text-zinc-500">policy</span><Hash value={r.policyHash} />
        <span className="text-xs text-zinc-500">coex</span><Hash value={r.coexHash} />
        <span className="text-xs text-zinc-500">artifact</span><Hash value={r.artifactHash} />
        <span className="text-xs text-zinc-500">attestation</span><Hash value={r.attestationUid} />
      </div>
    </div>
  );
}
function TranscriptTab({ data }: any) {
  const [query, setQuery] = useState(""); const [domain, setDomain] = useState("all");
  const filtered = useMemo(() => data.receipts.filter((r: any) => {
    const q = query.toLowerCase();
    const hit = !q || [r.examId, r.stageId, r.policyHash].some((s: any) => String(s).toLowerCase().includes(q));
    const dom = domain === "all" || r.domain === domain;
    return hit && dom;
  }), [data.receipts, query, domain]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search receipts…" className="w-full md:w-72 text-sm px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <select value={domain} onChange={(e)=>setDomain(e.target.value)} className="text-sm px-3 py-2 rounded-lg border border-zinc-300">
          <option value="all">All domains</option><option value="coding">Coding</option><option value="chess">Chess</option>
        </select>
        <ExportButton filename="transcript.json" data={data.receipts} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">{filtered.map((r: any) => <StageCard key={r.examId} r={r} />)}</div>
    </div>
  );
}
function SleepTab({ data }: any) {
  const s = data.sleepStamps[0];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Section title="Continuity">
        <div className="flex items-center gap-4">
          <div><div className="text-3xl font-semibold">{s.rollingAck7d}</div><div className="text-xs text-zinc-500">acks (last 7d)</div></div>
          <div><div className="text-3xl font-semibold">{s.activationsCount}</div><div className="text-xs text-zinc-500">skills activated</div></div>
          <div><div className="text-3xl font-semibold">{s.quarantinedCount}</div><div className="text-xs text-zinc-500">quarantined</div></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone={s.healthcheckStatus === "pass" ? "green" : s.healthcheckStatus === "warn" ? "amber" : "red"}>{s.healthcheckStatus}</Badge>
          <Badge tone="zinc">epoch {s.teamEpoch}</Badge>
          <Badge tone="zinc">bucket {s.teamBucket}</Badge>
          {s.swarmMode ? <Badge tone="violet">swarm</Badge> : <Badge tone="zinc">solo</Badge>}
        </div>
      </Section>
      <Section title="Window">
        <div className="text-sm text-zinc-700">{tsToStr(s.tsWindowStart)} → {tsToStr(s.tsWindowEnd)}</div>
        <div className="mt-2 text-sm flex gap-6">
          <div><div className="font-semibold">Advised</div><div className="text-zinc-600">{s.advisedWindowHours ?? 6}h</div></div>
          <div><div className="font-semibold">Actual</div><div className="text-zinc-600">{s.actualWindowHours ?? 6}h</div></div>
        </div>
      </Section>
    </div>
  );
}
function ScoresTab({ data }: any) {
  const { scores } = data; const p = computePrice(scores);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Section title="Capability Scores">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-zinc-500">Level</div><div className="font-semibold">{scores.level}</div>
          <div className="text-zinc-500">Cleanliness</div><div className="font-semibold">{(scores.cleanliness*100).toFixed(0)}%</div>
          <div className="text-zinc-500">Velocity</div><div className="font-semibold">{(scores.velocity*100).toFixed(0)}%</div>
          <div className="text-zinc-500">SCS</div><div className="font-semibold">{(scores.scs*100).toFixed(0)}%</div>
          <div className="text-zinc-500">IS</div><div className="font-semibold">{(scores.iscore*100).toFixed(0)}%</div>
          <div className="text-zinc-500">SysC</div><div className="font-semibold">{scores.sysc == null ? "—" : (scores.sysc*100).toFixed(0)+"%"}</div>
        </div>
      </Section>
      <Section title="Indicative Price">
        <div className="text-4xl font-semibold">${p.toFixed(2)}</div>
        <div className="text-xs text-zinc-500 mt-1">Illustrative; see Capability Oracle for exact pricing.</div>
      </Section>
      <Section title="Updated">
        <div className="text-sm">{new Date(scores.updatedAt).toLocaleString()}</div>
        <div className="mt-2"><ExportButton filename="scores.json" data={scores} /></div>
      </Section>
    </div>
  );
}
async function sha256Hex(str: string) {
  const d = new TextEncoder().encode(str);
  const h = await crypto.subtle.digest("SHA-256", d);
  return "0x"+Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
function VerifyTab() {
  const [policy,setPolicy]=useState(""); const [coex,setCoex]=useState(""); const [artifact,setArtifact]=useState(""); const [concat,setConcat]=useState(""); const [out,setOut]=useState<any>(null);
  const run=async()=>{ const h = concat? await sha256Hex(concat): null; setOut({policy,coex,artifact,concatHash:h}); };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Section title="Receipt Inputs" right={<button onClick={run} className="text-xs px-3 py-1.5 rounded border border-zinc-300 bg-white">Compute</button>}>
        <div className="space-y-3">
          <div><div className="text-xs text-zinc-500 mb-1">policyHash</div><input value={policy} onChange={e=>setPolicy(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-300" placeholder="0x…" /></div>
          <div><div className="text-xs text-zinc-500 mb-1">coexHash</div><input value={coex} onChange={e=>setCoex(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-300" placeholder="0x…" /></div>
          <div><div className="text-xs text-zinc-500 mb-1">artifactHash</div><input value={artifact} onChange={e=>setArtifact(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-300" placeholder="0x…" /></div>
          <div><div className="text-xs text-zinc-500 mb-1">optional: sha256(concat)</div><input value={concat} onChange={e=>setConcat(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border border-zinc-300" placeholder="policyHash||coexHash||artifactHash" /></div>
        </div>
      </Section>
      <Section title="Verifier Output">
        {!out ? <div className="text-sm text-zinc-500">Enter values and click Compute.</div> :
          <div className="space-y-2 text-sm">
            <div>policyHash: <Hash value={out.policy || "—"} /></div>
            <div>coexHash: <Hash value={out.coex || "—"} /></div>
            <div>artifactHash: <Hash value={out.artifact || "—"} /></div>
            <div>sha256(concat): <Hash value={out.concatHash || "—"} /></div>
          </div>
        }
      </Section>
    </div>
  );
}
export default function App() {
  const [active, setActive] = useState<"transcript"|"sleep"|"scores"|"verify"|"about">("transcript");
  const [agentId, setAgentId] = useState(sample.agentId);
  const data = sample;
  return (
  <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
    <header className="px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-white grid place-items-center font-bold">A</div>
          <div><div className="text-sm font-semibold">Adept Transcript Explorer</div><div className="text-xs text-zinc-500">verifiable receipts • wallet‑less • sleep‑gated</div></div>
        </div>
        <div className="flex items-center gap-2">
          <input value={agentId} onChange={(e)=>setAgentId(e.target.value)} className="hidden md:block w-[480px] text-sm px-3 py-2 rounded-lg border border-zinc-300" />
          <button className="px-3 py-2 text-sm rounded-lg border border-zinc-300 bg-white hover:border-zinc-400">Fetch</button>
        </div>
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        {[["transcript","Transcript"],["sleep","Sleep"],["scores","Scores"],["verify","Verify"],["about","About"]].map(([k,l])=>(
          <button key={k} onClick={()=>setActive(k as any)} className={`px-3 py-2 text-sm rounded-lg border ${active===k? "border-zinc-900 bg-zinc-900 text-white":"border-zinc-300 bg-white hover:border-zinc-400"}`}>{l}</button>
        ))}
      </div>
      {active==="transcript"&&<TranscriptTab data={data}/>}
      {active==="sleep"&&<SleepTab data={data}/>}
      {active==="scores"&&<ScoresTab data={data}/>}
      {active==="verify"&&<VerifyTab/>}
      {active==="about"&&(
        <div className="space-y-6">
          <Section title="Ecosystem API Network">
            <div className="text-sm">
              Primary APIs: Genesis, Stages, Transcript (ATS‑1), Capability Oracle, Sleep, TeamCohorts, Governance, Preskills.
              Webhooks: stage.completed, owner.banned, cohort.epoch.updated, preskill.completed.
            </div>
          </Section>
          <Section title="Partner Opportunities">
            <ul className="list-disc pl-6 text-sm">
              <li>Oracle Guilds (per‑attempt revenue share)</li>
              <li>Certified Labs (attested runners)</li>
              <li>Program Authors (Original Programs / Preskills)</li>
              <li>Placement Networks (ATS integrations)</li>
              <li>Scholarship Sponsors (AdeptAssets)</li>
              <li>Verification Tools (policy hash registry clients)</li>
              <li>Audit/Compliance (DP configs, attestations)</li>
            </ul>
          </Section>
        </div>
      )}
    </main>
    <footer className="max-w-6xl mx-auto px-6 py-8 text-xs text-zinc-500">
      <div className="flex items-center justify-between">
        <div>© {new Date().getFullYear()} Adept Network — Master Spec compliant</div>
        <div className="flex items-center gap-3">
          <a className="underline underline-offset-2" href="#">OpenAPI</a>
          <a className="underline underline-offset-2" href="#">Policy Hash Registry</a>
          <a className="underline underline-offset-2" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  </div>);
}
