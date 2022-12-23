import { createApp } from 'vue';
import './style.css';
import 'default-passive-events';
import UI from './UI.vue';
import App from './app.js';

const app = new App();

window.$ = {};
$.app = app;
await app.init();
createApp(UI).mount('#app')
