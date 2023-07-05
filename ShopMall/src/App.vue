<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {ref, watch, reactive} from 'vue';
import {useUser} from "@/stores/user";
import {useEnv} from "@/compositions/useEnv";
import {storeToRefs} from "pinia";
import router from "@/router";

const routeMap = reactive({
  'menu': [{
      id: 1,
      path: '/Product',
      text: 'Product',
    },
    {
      id: 2,
      path: '/About',
      text: 'About',
    },],
  'member': [
    {
      id: 3,
      path: '/login',
      text: 'Login',
    },
    {
      id:4,
      path:'/register',
      text:'Register',
    }
  ]
})

const {VITE_APP_NAME} = useEnv();
const userStore = useUser();
const {user, isLogin} = storeToRefs(userStore);
console.log('user', user.value)
console.log('isLogin', isLogin.value)
const isMobileNavOpen = ref(false);

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
}

const closeMobileNav = () => {
  console.log('closeMobileNav')
  isMobileNavOpen.value = false;
}

watch(router.currentRoute, () => {
  closeMobileNav();
  if(router.currentRoute.value.path === '/logout'
      || router.currentRoute.value.path === '/login'
      || router.currentRoute.value.path === '/register') return;

  localStorage.setItem('prevPath', router.currentRoute.value.path);
})

</script>

<template>
  <header class="header-wrapper fixed top-0 left-0 right-0 z-10 w-full bg-black">
    <div class="header flex justify-between px-8 h-full w-auto items-center">
      <h2 class="header__logo md:mr-20">
        <a class="block h-full hover:bg-transparent" href="/" title="線上藝廊">線上藝廊</a>
      </h2>
      <div class="hidden header__body md:flex flex-1 items-center justify-between">
        <nav class="nav">
          <RouterLink v-for="item in routeMap.menu" :key="item.id"
                      class="nav__item" :to="item.path">
            {{item.text}}
          </RouterLink>
        </nav>

        <div class="header__foot">
          <div v-if="isLogin">
            <RouterLink class="nav__item" to="/logout">{{ user.name }}</RouterLink>
            <RouterLink class="nav__item" to="/logout">Logout</RouterLink>
          </div>
          <div v-else>
            <RouterLink v-for="item in routeMap.member" :key="item.id"
                        class="nav__item" :to="{path: item.path}">
              {{item.text}}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="md:hidden">
        <!-- Mobile menu button -->
        <button @click="toggleMobileNav">
          <svg class="w-6 h-6 text-gray-500 hover:text-green-500 "
               x-show="!showMenu"
               fill="none"
               stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2"
               viewBox="0 0 24 24"
               stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="flex justify-center bg-black border-0" :class="{'hidden' : !isMobileNavOpen}">
      <ul>
        <RouterLink v-for="item in routeMap.menu" :key="item.id"
                    class="nav__item" :to="item.path">
          <li>
            {{item.text}}
          </li>
        </RouterLink>
        <template v-if="isLogin">
          <RouterLink class="nav__item" to="/logout">
            <li>
              {{ user.name }}
            </li>
          </RouterLink>
          <RouterLink class="nav__item" to="/logout">
            <li>
              Logout
            </li>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink v-for="item in routeMap.member" :key="item.id"
                      class="nav__item" :to="{path: item.path}">
            {{item.text}}
          </RouterLink>
        </template>
      </ul>
    </div>


  </header>
  <main class="main min-h-screen w-full" @click="closeMobileNav">
    <Suspense>
      <RouterView/>
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </main>
</template>

<style scoped lang="scss">
.header-wrapper {
  grid-area: header;
  height: 6rem;
  min-height: 6rem;
}

.header__logo {
  width: 220px;
  height: 50px;

  & > a {
    text-indent: -9999px;
    background-image: url('@/assets/logo.svg');
    background-repeat: no-repeat;
    background-position: -40px -115px;
    background-size: 140% 560%;
  }
}

.nav__item + .nav__item {
  margin-left: 1rem;
}

.main {
  grid-area: main;
}
</style>
