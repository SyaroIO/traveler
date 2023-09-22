import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import(':/layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import(':/pages/IndexPage.vue')
      },
      {
        path: '/404',
        name: '404',
        component: () => import(':/pages/NotFoundPage.vue')
      },
      {
        path: '/:catchAll(.*)',
        redirect: '/404'
      },
      {
        path: '/footprint',
        redirect: '/footprint/personal'
      },
      {
        path: '/footprint/personal',
        name: 'footprint/personal',
        component: () => import(':/pages/FootprintPersonal.vue')
      },
      {
        path: '/footprint/group',
        name: 'footprint/group',
        component: () => import(':/pages/FootprintGroup.vue')
      },
      {
        path: '/footprint/group/:id/:password',
        name: 'footprint/room',
        component: () => import(':/pages/FootprintRoom.vue'),
        props: true
      },
      {
        path: '/footprint/random',
        name: 'footprint/random',
        component: () => import(':/pages/FootprintRandom.vue'),
        props: true
      },
      {
        path: '/test',
        name: 'test',
        component: async () => {
          const component = await import(':/pages/NotFoundPage.vue')
          await new Promise((reslove) => setTimeout(reslove, 1000))
          return component
        }
      }
    ]
  }
]

export const router = createRouter({
  routes,
  history: createWebHistory()
})

export interface RouterParams {
  [key: string]: string | number
}

export const route = (name: string, params?: RouterParams) =>
  router.push({ name, params })
