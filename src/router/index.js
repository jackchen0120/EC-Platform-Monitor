import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: () => import('@/views/screenPage')
  },
  // {
  //   path: '/sellerPage',
  //   component: () => import('@/views/sellerPage')
  // },
  // {
  //   path: '/trendPage',
  //   component: () => import('@/views/trendPage')
  // },
  // {
  //   path: '/mapPage',
  //   component: () => import('@/views/mapPage')
  // },
  // {
  //   path: '/rankPage',
  //   component: () => import('@/views/rankPage')
  // },
  // {
  //   path: '/hotPage',
  //   component: () => import('@/views/hotPage')
  // },
  // {
  //   path: '/stockPage',
  //   component: () => import('@/views/stockPage')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
