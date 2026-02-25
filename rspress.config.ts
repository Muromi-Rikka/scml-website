import * as path from "node:path";
import { defineConfig } from "@rspress/core";
import { pluginLlms } from "@rspress/plugin-llms";
import { pluginSitemap } from "@rspress/plugin-sitemap";
export default defineConfig({
  root: path.join(__dirname, "docs"),
  plugins: [pluginLlms(), pluginSitemap({ siteUrl: "https://modloader.pages.dev" })],
  title: "ModLoader 文档",
  icon: "/logo.png",
  logo: {
    light: "/logo.png",
    dark: "/logo.png",
  },
  themeConfig: {
    llmsUI: true,
    lastUpdated: true,
    enableContentAnimation: true,
    enableAppearanceAnimation: true,
    enableScrollToTop: true,
    editLink: {
      docRepoBaseUrl: "https://github.com/Muromi-Rikka/scml-website/tree/master/docs",
    },
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader",
      },
    ],
  },
});
