import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import OrderList from '../pages/OrderList.vue';
import OrderDetail from '../pages/OrderDetail.vue';
import Home from '../pages/Home.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/orders', component: OrderList },
  { path: '/order/:id', component: OrderDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;