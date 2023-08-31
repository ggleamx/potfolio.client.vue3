import { createRouter, createWebHistory } from 'vue-router';
import Entity1View from '../views/Entity1View.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Entity1View
  },


];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
