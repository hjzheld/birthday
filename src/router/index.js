import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/App.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },

    // ==========================================
    // 존재하지 않는 모든 주소 → 메인으로 이동
    // ==========================================
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router