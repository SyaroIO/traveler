import { createApp as create } from 'vue'
import { router } from ':/routers'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'default-passive-events'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ':/styles/dark/css-vars.scss'
import ':/styles/style.scss'
import App from './App.vue'

export const app = create(App).use(ElementPlus).use(router).use(createPinia())
export const mount = (id: string) => {
  const element = document.createElement('div')
  element.id = id
  document.body.appendChild(element)
  return app.mount(element)
}
