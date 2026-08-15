import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), "client", "src");
const findings = [];
const semantic = /<(button|a|Button|Select|SelectTrigger|Link|SidebarMenuButton|DropdownMenuItem|DropdownMenuTrigger|DialogClose|Textarea|Input)\b|role=["'](button|separator|tab|menuitem)["']/;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    if (!entry.isFile() || !path.endsWith(".tsx")) continue;
    if (path.endsWith("ComponentShowcase.tsx")) continue;
    const lines = (await readFile(path, "utf8")).split("\n");
    lines.forEach((line, index) => {
      if (!/onClick=|onKeyDown=|onMouseDown=|onPointerDown=/.test(line)) return;
      const context = lines.slice(Math.max(0, index - 5), index + 1).join(" ");
      if (!semantic.test(context)) findings.push(`${path}:${index + 1}: ${line.trim()}`);
    });
  }
}

await walk(root);
console.log(JSON.stringify({ checkedRoot: root, findings }, null, 2));
if (findings.length > 0) process.exitCode = 1;
