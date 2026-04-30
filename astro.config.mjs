import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://ringdove.studio',
  output: 'static',
  adapter: vercel(),
  integrations: [mdx()],
  prefetch: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
