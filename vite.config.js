import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'child_process'

// Get git hash
function getGitHash() {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch (error) {
    console.warn('Unable to get git hash:', error)
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    'import.meta.env.VITE_GIT_HASH': JSON.stringify(getGitHash())
  }
})
