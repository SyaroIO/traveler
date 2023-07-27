import { createRouter, createWebHistory } from 'vue-router'

const index = () => import('@/pages/IndexPage.vue')
const single = () => import('@/pages/SinglePage.vue')
const notfound = () => import('@/pages/NotFoundPage.vue')

const routes = [
    {
        path: '/',
        name: 'index',
        component: index
    },
    {
        path: '/single',
        name: 'single',
        component: single
    },
    {
        path: '/404',
        name: '404',
        component: notfound
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/404'
    }
]

export const router = createRouter({
    routes,
    history: createWebHistory()
})
