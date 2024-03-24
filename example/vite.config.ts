import { defineConfig } from "vite";
import { colorScheme } from "vite-plugin-color-scheme";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    colorScheme({
      defaultScheme: "dark",
      persistKey: "color-scheme",
      variables: {
        light: {
          "--background-color": "#fff",
          "--text-color": "#000",
        },
        dark: {
          "--background-color": "#000",
          "--text-color": "#fff",
        },
      },
    }),
  ],
});
