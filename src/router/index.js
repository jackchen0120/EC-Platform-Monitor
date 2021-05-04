import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerPage',
    component: () => import('@/views/sellerPage')
  },
  {
    path: '/trendPage',
    component: () => import('@/views/trendPage')
  },
  {
    path: '/mapPage',
    component: () => import('@/views/mapPage')
  },
  {
    path: '/rankPage',
    component: () => import('@/views/rankPage')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
