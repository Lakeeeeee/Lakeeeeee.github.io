import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceConfigPath = path.join(rootDir, "mkdocs.yml");
const outputConfigPath = path.join(rootDir, "mkdocs.generated.yml");

function extractAdocTitle(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
    if (line.startsWith("//")) {
      continue;
    }
    if (line.startsWith(":")) {
      continue;
    }
    if (line.startsWith("= ")) {
      const title = line.slice(2).trim();
      return title || null;
    }
    return null;
  }

  return null;
}

function filenameFallback(srcPath) {
  return path.basename(srcPath, path.extname(srcPath));
}

function resolveTitle(srcPath) {
  const absolutePath = path.join(rootDir, "docs", srcPath.replace(/\//g, path.sep));
  return extractAdocTitle(absolutePath) || filenameFallback(srcPath);
}

function rewriteNavLine(line) {
  if (/^\s*#/.test(line)) {
    return line;
  }

  const labeledMatch = line.match(/^(\s*-\s+)([^:#][^:]*?)(:\s+)([^#\s][^#]*?\.adoc)(\s*(#.*)?)$/u);
  if (labeledMatch) {
    const [, prefix, , separator, srcPath, suffix = ""] = labeledMatch;
    const title = resolveTitle(srcPath.trim());
    return `${prefix}${title}${separator}${srcPath.trim()}${suffix}`;
  }

  const plainMatch = line.match(/^(\s*-\s+)([^#\s][^#]*?\.adoc)(\s*(#.*)?)$/u);
  if (plainMatch) {
    const [, prefix, srcPath, suffix = ""] = plainMatch;
    const title = resolveTitle(srcPath.trim());
    return `${prefix}${title}: ${srcPath.trim()}${suffix}`;
  }

  return line;
}

function buildGeneratedConfig() {
  const source = fs.readFileSync(sourceConfigPath, "utf8").replace(/^\uFEFF/, "");
  const lines = source.split(/\r?\n/);
  let inNav = false;

  const rewritten = lines.map((line) => {
    if (/^[A-Za-z_][A-Za-z0-9_]*:\s*$/.test(line)) {
      inNav = line.startsWith("nav:");
      return line;
    }

    if (inNav) {
      return rewriteNavLine(line);
    }

    return line;
  });

  fs.writeFileSync(outputConfigPath, `${rewritten.join("\n")}\n`, "utf8");
}

buildGeneratedConfig();
