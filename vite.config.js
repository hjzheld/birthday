import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

const repository = process.env.GITHUB_REPOSITORY || '';
const [owner, repo] = repository.split('/');

const githubPagesBase =
  owner && repo && repo !== `${owner}.github.io`
    ? `/${repo}/`
    : '/';

export default defineConfig({
  plugins: [vue()],
  base: '/birthday/',

  // 로컬에서는 /
  // GitHub Pages에서는 자동으로 /리포지토리명/
  base: process.env.GITHUB_ACTIONS === 'true'
    ? githubPagesBase
    : '/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
