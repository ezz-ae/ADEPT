*** Begin Patch
*** Add File: ui/transcript-explorer/tailwind.config.js
+/** @type {import('tailwindcss').Config} */
+export default {
+  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
+  theme: { extend: {} },
+  plugins: [],
+};

*** Add File: ui/transcript-explorer/postcss.config.js
+export default { plugins: { tailwindcss: {}, autoprefixer: {} } };

*** Update File: ui/transcript-explorer/src/index.css
@@
-/* empty */
+@tailwind base;
+@tailwind components;
+@tailwind utilities;
+
+:root { color-scheme: light; }
+* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
+:focus-visible { outline: 2px solid #0a0a0a; outline-offset: 2px; }

*** Update File: ui/transcript-explorer/src/main.tsx
@@
-import React from "react";
-import { createRoot } from "react-dom/client";
-import "./index.css";
-import App from "./ui/App";
-createRoot(document.getElementById("root")!).render(<App />);
+import React from "react";
+import { createRoot } from "react-dom/client";
+import "./index.css"; // ensures Tailwind CSS loads once
+import App from "./ui/App";
+createRoot(document.getElementById("root")!).render(<App />);

*** Update File: ui/transcript-explorer/index.html
@@
-  <head>
+  <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
-    <title>Adept Transcript Explorer</title>
+    <title>Adept Network — We certify capability, not vibes.</title>
+    <meta name="description" content="Sleep-gated AI agents that prove skill on no-resonance Stages. Verifiable ATS-1 transcripts.">
+    <link rel="canonical" href="https://adept-omega.vercel.app/">
+    <meta property="og:title" content="Adept Network" />
+    <meta property="og:description" content="Verifiable capability credentials for AI agents." />
+    <meta property="og:type" content="website" />
+    <meta property="og:url" content="https://adept-omega.vercel.app/" />
+    <meta property="og:image" content="/og.png" />
+    <meta name="twitter:card" content="summary_large_image" />
+    <meta name="twitter:title" content="Adept Network" />
+    <meta name="twitter:description" content="We certify capability, not vibes." />
+    <meta name="twitter:image" content="/og.png" />
+    <meta name="theme-color" content="#0a0a0a" />
     <link rel="icon" href="data:," />
   </head>

*** Add File: ui/transcript-explorer/public/robots.txt
+User-agent: *
+Allow: /
+Sitemap: https://adept-omega.vercel.app/sitemap.xml

*** Add File: ui/transcript-explorer/public/sitemap.xml
+<?xml version="1.0" encoding="UTF-8"?>
+<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
+  <url><loc>https://adept-omega.vercel.app/</loc></url>
+</urlset>

*** Add File: vercel.json
+{
+  "headers": [
+    {
+      "source": "/(.*)",
+      "headers": [
+        { "key": "X-Content-Type-Options", "value": "nosniff" },
+        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
+        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
+      ]
+    }
+  ]
+}
*** End Patch
