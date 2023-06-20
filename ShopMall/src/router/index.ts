import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductListView from "@/views/ProductListView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/:id?',
      name: 'productList',
      component: ProductListView
    },
    {
      path: '/productDetail/:id',
      name: 'productDetail',
      component: ProductDetailView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('@/views/LogoutView.vue'),
    },
    {
      path: '/ErrorPage/404:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/ErrorPage/NotFound.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/ErrorPage/NotFound.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (to.name === "productList" && !to.params.hasOwnProperty("id")) {
    next({name:'productList', params: { id: 1 } });
  }
  next();
})


export default router
