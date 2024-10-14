import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

// @ts-check
import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://modloader.pages.dev',
  integrations: [starlight(
    {
      title: 'SugarCube 2 ModLoader',
      social: {
        github: 'https://github.com/Lyoko-Jeremie/sugarcube-2-ModLoader',
      },
      defaultLocale: 'zh-cn',
      locales: {
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-cn',
        },
        'en': {
          label: 'English',
        },
      },
      sidebar: [
        {
          label: 'ModLoader',
          autogenerate: { directory: 'mod-loader' },
        },
      ],
    },
  ), tailwind(), sitemap()],
})