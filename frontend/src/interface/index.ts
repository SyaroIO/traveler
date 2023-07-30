import { createApp as create } from 'vue'
import { router } from ':/routers'
import ElementPlus from 'element-plus'
import 'default-passive-events'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import ':/styles/dark/css-vars.scss'
import ':/styles/style.scss'
import App from './App.vue'

export const createApp = (mount: string | Element): any => create(App).use(ElementPlus).use(router).mount(mount)
