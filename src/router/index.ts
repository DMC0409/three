import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: () => import('../view/main.vue')
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../view/demo.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router