// Render the 4 mockup designs to PDFs for visual comparison
import { renderToBuffer } from "@react-pdf/renderer";
import { mkdirSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  logLevel: "error",
  appType: "custom",
});
try {
  const { SAMPLE_CV } = await server.ssrLoadModule("/src/lib/cv/sample.ts");
  const mods = {
    Minimal: await server.ssrLoadModule("/src/components/styles/Minimal.tsx"),
    Classic: await server.ssrLoadModule("/src/components/styles/Classic.tsx"),
    Sidebar: await server.ssrLoadModule("/src/components/styles/Sidebar.tsx"),
    ProClassic: await server.ssrLoadModule(
      "/src/components/styles/ProClassic.tsx",
    ),
    BigType: await server.ssrLoadModule("/src/components/styles/BigType.tsx"),
    EdgeStrip: await server.ssrLoadModule(
      "/src/components/styles/EdgeStrip.tsx",
    ),
  };
  mkdirSync("docs/design-mockups", { recursive: true });
  for (const [name, m] of Object.entries(mods)) {
    const buf = await renderToBuffer(
      createElement(m[name], { cv: SAMPLE_CV, backupString: "cv0$x" }),
    );
    writeFileSync(`docs/design-mockups/${name.toLowerCase()}.pdf`, buf);
    console.log(`${name.toLowerCase()}: ${buf.length} bytes`);
  }
} finally {
  await server.close();
}
