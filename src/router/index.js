import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "@/views/login.vue";
import HomePage from "@/views/homePage.vue";

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
]
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
