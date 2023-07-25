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
            name: 'ProductDetail',
            component: ProductDetailView,
            meta: {title: `商品詳情-${VITE_APP_NAME}`},
            redirect: (to) => (
                {name: 'ProductIntro', params: {id: to.params.id}}
            ),
            children: [{
                    name: 'ProductIntro',
                    path: 'intro',
                    meta:{
                        title: `商品介紹-${VITE_APP_NAME}`,
                    },
                    component: ()=>import('@/views/Product/ProductIntro.vue'),
                },
                {
                    name: 'ProductMessage',
                    path: 'message',
                    meta:{
                        title: `商品介紹-${VITE_APP_NAME}`,
                    },
                    component: ()=>import('@/views/Product/ProductMessage.vue'),
                },
            ],
        },
        {
            path: '/store/:storeId',
            name: 'store',
            component: ()=>import('@/views/Store/Store.vue'),
            meta: {title: `商店-${VITE_APP_NAME}`}
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/Cart/CartView.vue'),
            meta: {title: `購物車-${VITE_APP_NAME}`}
        },
        {
            path: '/cart/checkout',
            name: 'cartCheckout',
            component: () => import('@/views/Cart/CheckoutView.vue'),
            meta: {title: `結帳-${VITE_APP_NAME}`}
        },
        {
            path: '/cart/result',
            name: 'checkoutResult',
            component: () => import('@/views/Cart/CheckoutResultView.vue'),
            meta: {title: `訂單結果-${VITE_APP_NAME}`}
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
            redirect: (to) => (
                {name: 'notFound'}
            ),
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        };
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
