import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

import starlight from '@astrojs/starlight'

import tailwind from '@astrojs/tailwind'

// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://modloader.pages.dev',
  integrations: [
    starlight({
      title: 'SugarCube 2 ModLoader',
      social: {
        github: 'https://github.com/Muromi-Rikka/scml-website',
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
        {
          label: 'Degrees of Lewdity',
          autogenerate: { directory: 'dol' },
        },
        {
          label: 'Course of Temptation',
          autogenerate: { directory: 'cot' },
        },
      ],
    }),
    tailwind(),
    sitemap(),
    react(),
  ],
})
