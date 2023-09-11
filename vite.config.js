import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/styles/bulma.sass', 'resources/cms/index.js'],
      refresh: true,
    }),
    preact(),
  ],
})
