import * as path from "node:path";
import { defineConfig } from "@rspress/core";
import { pluginLlms } from "@rspress/plugin-llms";
import { pluginSitemap } from "@rspress/plugin-sitemap";
import pluginMermaid from "./plugin-mermaid/index";
import fileTree from "rspress-plugin-file-tree";
export default defineConfig({
  root: path.join(__dirname, "docs"),
  lang: "zh",
  locales: [
    {
      lang: "zh",
      label: "简体中文",
      title: "ModLoader 文档",
      description: "SugarCube-2 Mod 加载框架文档",
    },
    {
      lang: "en",
      label: "English",
      title: "ModLoader Docs",
      description: "SugarCube-2 Mod Loading Framework Documentation",
    },
  ],
  plugins: [
    pluginLlms(),
    pluginSitemap({ siteUrl: "https://modloader.pages.dev" }),
    pluginMermaid({
      themeLight: "solarized",
      themeDark: "dracula",
      transparent: true,
    }),
    fileTree(),
  ],
  title: "ModLoader 文档",
  icon: "/logo.png",
  logo: {
    light: "/logo.png",
    dark: "/logo.png",
  },
  themeConfig: {
    locales: [
      { lang: "zh", outlineTitle: "大纲" },
      { lang: "en", outlineTitle: "On this page" },
    ],
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
