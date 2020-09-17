import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const children = [{
  path: '/CaseManage',
  component: () => import('../views/CaseManage.vue'),
  name: '用例管理'
}, {
  path: '/CaseExecute',
  component: () => import('../views/CaseExecute.vue'),
  name: '用例执行'
}]

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: 'CaseManage',
    children
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
