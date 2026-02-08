import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../routes/page.vue'),
  },
  {
    path: '/illustration',
    name: 'illustration',
    component: () => import('../routes/illustration/illustration.vue'),
  },
  {
    path: '/pixelart',
    name: 'pixelart',
    component: () => import('../routes/pixelart/pixelart.vue'),
  },
  {
    path: '/vtuber',
    name: 'vtuber',
    component: () => import('../routes/vtuber/vtuber.vue'),
  },
  {
    path: '/comissao',
    name: 'comissao',
    component: () => import('../routes/comissao/commision.vue'),
  },
  {
    path: '/art/:slug',
    name: 'art-detail',
    component: () => import('../routes/art/[slug]/art.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../routes/erro.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
