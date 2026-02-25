import React, { useMemo, useState, useEffect } from "react";
import { renderMermaidSVG, THEMES } from "beautiful-mermaid";

function getIsDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getBuiltinTheme(isDark: boolean, themeLight?: string, themeDark?: string) {
  const name = isDark
    ? themeDark && THEMES[themeDark as keyof typeof THEMES]
      ? themeDark
      : "dracula"
    : themeLight && THEMES[themeLight as keyof typeof THEMES]
      ? themeLight
      : "solarized";
  return THEMES[name as keyof typeof THEMES];
}

export interface MermaidRendererProps {
  code: string;
  config?: {
    /** 浅色主题（与 themeDark 二选一或同时使用） */
    themeLight?: keyof typeof THEMES | string;
    /** 深色主题 */
    themeDark?: keyof typeof THEMES | string;
    /** 兼容：同时作为浅色/深色主题 */
    theme?: keyof typeof THEMES | string;
    bg?: string;
    fg?: string;
    transparent?: boolean;
    [key: string]: unknown;
  };
}

const MermaidRenderer: React.FC<MermaidRendererProps> = (props) => {
  const { code, config = {} } = props;
  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    setIsDark(getIsDark());
    const observer = new MutationObserver(() => {
      setIsDark(getIsDark());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const { svg, error } = useMemo(() => {
    try {
      const light = (config.themeLight as keyof typeof THEMES) ?? config.theme;
      const dark = (config.themeDark as keyof typeof THEMES) ?? config.theme;
      const builtin = getBuiltinTheme(isDark, light, dark);

      const options = {
        ...builtin,
        ...(config.bg != null && { bg: config.bg }),
        ...(config.fg != null && { fg: config.fg }),
        transparent: config.transparent ?? true,
      };

      const svgString = renderMermaidSVG(code, options);
      return { svg: svgString, error: null };
    } catch (err) {
      return {
        svg: null,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }, [
    code,
    isDark,
    config.theme,
    config.themeLight,
    config.themeDark,
    config.bg,
    config.fg,
    config.transparent,
  ]);

  if (error) {
    return <pre className="rspress-mermaid-error">{error.message}</pre>;
  }
  if (!svg) return null;
  return <div className="rspress-mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default MermaidRenderer;
