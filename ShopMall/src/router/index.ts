import {createRouter, createWebHistory} from 'vue-router';
import ProductListView from "@/views/Product/ProductListView.vue";
import ProductDetailView from "@/views/Product/ProductDetailView.vue";
import {useEnv} from "@/compositions/useEnv";
const { MODE, VITE_APP_NAME, VITE_BASE_API, VITE_PUBLIC_PATH, VITE_BASE_UPLOAD_API } = useEnv()

declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        isAdmin?: boolean
        // 每个路由都必须声明
        title: string,
    }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'product',
      component: ProductListView,
            meta: {title: `商品列表-${VITE_APP_NAME}`}
    },
    {
      path: '/:id',
      name: 'productDetail',
            component: ProductDetailView,
            meta: {title: `商品詳情-${VITE_APP_NAME}`}
    },
    {
      path: '/store',
      name: 'store',
            component: ProductListView,
            meta: {title: `商店-${VITE_APP_NAME}`}
    },
    {
      path: '/store/product',
      name: 'storeProduct',
            component: ProductListView,
            meta: {title: `商店商品-${VITE_APP_NAME}`}
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Member/LoginView.vue'),
            meta: {title: `登入-${VITE_APP_NAME}`}

    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('@/views/Member/LogoutView.vue'),
            meta: {title: `登出-${VITE_APP_NAME}`}

        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/Member/RegisterView.vue'),
            meta: {title: `註冊-${VITE_APP_NAME}`}
    },
    {
      path: '/ErrorPage/404:pathMatch(.*)*',
      name: 'notFound',
            component: () => import('@/views/ErrorPage/NotFound.vue'),
            meta: {title: `找不到頁面-${VITE_APP_NAME}`}
    },
    {
      path: '/:pathMatch(.*)*',
            redirect: '/ErrorPage/404:pathMatch(.*)*',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
        return {top: 0}
  },
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next();
})


export default router
