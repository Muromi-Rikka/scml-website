import path from "node:path";
import { fileURLToPath } from "node:url";
import { RemarkCodeBlockToGlobalComponentPluginFactory } from "rspress-plugin-devkit";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface PluginMermaidOptions {
  /** 浅色主题，如 'zinc-light' | 'github-light' | 'tokyo-night-light' */
  themeLight?: string;
  /** 深色主题，如 'zinc-dark' | 'tokyo-night' | 'github-dark' */
  themeDark?: string;
  /** 兼容：同时作为浅色/深色主题（未设置 themeLight/themeDark 时生效） */
  theme?: string;
  /** 背景色（或 CSS 变量） */
  bg?: string;
  /** 前景色 */
  fg?: string;
  /** 是否透明背景，默认 true */
  transparent?: boolean;
}

export default function pluginMermaid(options: PluginMermaidOptions = {}) {
  const componentPath = path.join(__dirname, "MermaidRender.tsx");

  const remarkMermaid = new RemarkCodeBlockToGlobalComponentPluginFactory({
    components: [
      {
        lang: "mermaid",
        componentPath,
        childrenProvider() {
          return [];
        },
        propsProvider(code: string) {
          return {
            code,
            config: options,
          };
        },
      },
    ],
  });

  const elkShimPath = path.join(__dirname, "elk-shim.js");

  return {
    name: "rspress-plugin-mermaid-beautiful",
    markdown: {
      remarkPlugins: [remarkMermaid.remarkPlugin],
      globalComponents: remarkMermaid.mdxComponents,
    },
    builderConfig: {
      ...remarkMermaid.builderConfig,
      // 通过 <script> 加载 elk.bundled.js，用 shim 避免打包 UMD（其内联 require 在浏览器未定义）
      html: {
        tags: [
          {
            tag: "script",
            attrs: { src: "/elk.bundled.js" },
          },
        ],
      },
      tools: {
        rspack(config: any) {
          config.resolve = config.resolve || {};
          config.resolve.alias = {
            ...config.resolve.alias,
            "elkjs/lib/elk.bundled.js": elkShimPath,
          };
          return config;
        },
      },
    },
  };
}
