import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from the root of veshell.com.
export default defineConfig({ base: "/", plugins: [react()] });
