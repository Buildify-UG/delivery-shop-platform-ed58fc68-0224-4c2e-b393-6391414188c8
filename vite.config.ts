import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://zeouviazhsmeguhprjwh.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplb3V2aWF6aHNtZWd1aHByandoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzkxNzcsImV4cCI6MjA5OTgxNTE3N30.bLfSQzfIAVP0XGx64kfTp69ccBnRjwuMMHm9Co3gLSg'),
  },
  server: {
    allowedHosts: true,
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
