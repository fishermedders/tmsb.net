import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    (() => {
      const plugin = mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      });
      return {
        enforce: "pre",
        ...plugin,
        // Don't intercept ?raw requests — let Vite's built-in raw loader
        // handle them so import.meta.glob with { query: "?raw" } returns
        // the raw file text rather than the compiled React component.
        transform(code, id) {
          if (id.includes("?raw")) return;
          return plugin.transform?.call(this, code, id);
        },
      };
    })(),
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
});
