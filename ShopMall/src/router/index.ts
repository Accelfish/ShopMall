import { createRouter, createWebHistory } from 'vue-router';
import HomeView from "@/views/HomeView.vue";
import ProductListView from "@/views/Product/ProductListView.vue";
import ProductDetailView from "@/views/Product/ProductDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'product',
      component: ProductListView,
    },
    {
      path: '/:id',
      name: 'productDetail',
      component: ProductDetailView
    },
    {
      path: '/store',
      name: 'store',
      component: ProductListView
    },
    {
      path: '/store/product',
      name: 'storeProduct',
      component: ProductListView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Member/LoginView.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('@/views/Member/LogoutView.vue'),
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

// router.beforeEach((to, from, next) => {
//   next();
// })


export default router
