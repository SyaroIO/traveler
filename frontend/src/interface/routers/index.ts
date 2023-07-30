import { createRouter, createWebHistory } from 'vue-router'

const index = () => import(':/pages/IndexPage.vue')
const single = () => import(':/pages/SinglePage.vue')
const register = () => import(':/pages/RegisterPage.vue')
const verification = () => import(':/pages/VerificationPage.vue')
const authenticate = () => import(':/pages/AuthenticatePage.vue')
const notfound = () => import(':/pages/NotFoundPage.vue')

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/user/register',
    name: 'register',
    component: register
  },
  {
    path: '/user/verification',
    name: 'verification',
    component: verification
  },
  {
    path: '/user/authenticate',
    name: 'authenticate',
    component: authenticate
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
export const route = (name: string) => router.push({ name })
