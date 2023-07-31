import { createRouter, createWebHistory } from 'vue-router'

const layouts = {
  main: () => import(':/layouts/MainLayout.vue'),
  clear: () => import(':/layouts/ClearLayout.vue')
}

const pages = {
  index: () => import(':/pages/IndexPage.vue'),
  single: () => import(':/pages/SinglePage.vue'),
  notfound: () => import(':/pages/NotFoundPage.vue'),
  test: async () => {
    const component = await import(':/pages/NotFoundPage.vue')
    await new Promise((reslove) => setTimeout(reslove, 1000))
    return component
  }
}

const routes = [
  {
    path: '/',
    name: 'index',
    component: layouts.main,
    props: {
      component: pages.index
    }
  },
  {
    path: '/single',
    name: 'single',
    component: layouts.clear,
    props: {
      component: pages.single
    }
  },
  {
    path: '/test',
    name: 'test',
    component: layouts.main,
    props: {
      component: pages.test
    }
  },
  {
    path: '/404',
    name: '404',
    component: layouts.main,
    props: {
      component: pages.notfound
    }
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
