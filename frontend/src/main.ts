import { createApp } from 'vue'
import { router } from '@/router'
import ElementPlus from 'element-plus'
import 'default-passive-events'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/dark/css-vars.scss'
import '@/styles/style.scss'
import VueApp from './App.vue'

createApp(VueApp).use(ElementPlus).use(router).mount('#app')
