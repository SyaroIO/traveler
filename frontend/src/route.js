import { createRouter, createWebHashHistory } from "vue-router";

const index = () => import("./Index.vue");
const single = () => import("./Single.vue");

const routes = [
  {
    path: "/",
    name: "index",
    component: index
  },
  {
    path: "/single",
    name: "single",
    component: single
  }
];

export const router = createRouter({
  routes, history: createWebHashHistory(),
});