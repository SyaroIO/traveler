import { createApp } from 'vue';
import { router } from './route'
import './style.css';
import 'default-passive-events';
import VueApp from './App.vue';
import App from './app';

const app = new App();

window.$ = {};
$.app = app;
await app.init();
createApp(VueApp)
    .use(router)
    .mount('#app');
