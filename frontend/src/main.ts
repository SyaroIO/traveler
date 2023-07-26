import { createApp } from 'vue';
import { router } from '@/router'
import './style.css';
import 'default-passive-events';
import VueApp from './App.vue';

createApp(VueApp)
    .use(router)
    .mount('#app');
