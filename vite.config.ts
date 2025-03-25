import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/sliding-stones/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
