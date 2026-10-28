import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "vite";

// Sin plugins de grabación ni de telemetría: la consola, la red y la sesión del navegador no se registran.
// Desarrollo: Vite sirve `client/` y reenvía /api al servidor Express (server/index.ts, por defecto :3001).
const API_TARGET = `http://127.0.0.1:${process.env.PORT ?? 3001}`;

// Ship the existing curriculum HTML in the Vite artifact. Without this,
// root: client/ silently excludes all files from the sibling campus/ folder.
function publishStaticCampus() {
  return {
    name: "linguaforge-publish-campus",
    apply: "build" as const,
    closeBundle() {
      const root = import.meta.dirname;
      const source = path.resolve(root, "campus");
      const destination = path.resolve(root, "dist/public/campus");
      for (const name of [
        "index.html", "ruta.html", "tokens.css", "app.js",
        "cursos/forja-linguistica/quiz.json",
        "cursos/forja-linguistica/semana-01.md",
      ]) {
        if (!fs.existsSync(path.join(source, name))) {
          throw new Error("Required LinguaForge campus asset not found: " + name);
        }
      }
      fs.cpSync(source, destination, {
        recursive: true,
        filter: entry => {
          if (fs.lstatSync(entry).isSymbolicLink()) return false;
          const parts = path.relative(source, entry).split(path.sep);
          return !parts.some(part => part === ".git" || part === "node_modules" ||
            part === "__pycache__" || part.startsWith(".env"));
        },
      });
      fs.copyFileSync(path.resolve(root, "campus.html"), path.resolve(root, "dist/public/campus.html"));
      for (const name of ["index.html", "ruta.html", "tokens.css", "sw.js"]) {
        if (!fs.statSync(path.join(destination, name)).size) {
          throw new Error("Empty campus publication asset: " + name);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), jsxLocPlugin(), publishStaticCampus()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (
            id.includes("react-dom") ||
            id.includes("react") ||
            id.includes("scheduler")
          )
            return "react-vendor";
          if (id.includes("@radix-ui") || id.includes("lucide-react"))
            return "ui-vendor";
          if (id.includes("@tanstack") || id.includes("trpc"))
            return "data-vendor";
          return "vendor";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app", "localhost", "127.0.0.1"],
    proxy: {
      "/api": { target: API_TARGET, changeOrigin: false },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
