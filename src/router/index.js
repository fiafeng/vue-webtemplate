import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login.vue'
import HomePage from '@/views/homePage.vue'
import myProcess from '@/views/flowable/task/myProcess/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    name: 'index',
    path: '/',
    component: HomePage
  },
  {
    name: 'login',
    path: '/login',
    component: login
  },
  {
    name: '流程',
    path: '/flowable/task/myProcess',
    component: myProcess
  },

]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
