<script setup lang="ts">
import {RouterLink, RouterView, useRoute} from 'vue-router'
import {ref, watch, reactive} from 'vue';
import {useUser} from "@/stores/user";
import {useEnv} from "@/compositions/useEnv";
import {useDeviceDetector} from "@/compositions/useDevice";
import {storeToRefs} from "pinia";
import router from "@/router";
const route = useRoute();

const routeMap = reactive({
  'menu': [],
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
const deviceDetector = useDeviceDetector();
const isMobile = ref(deviceDetector.mobile);
const userStore = useUser();
const {user, isLogin} = storeToRefs(userStore);
console.log('user', user.value)
const isMobileNavOpen = ref(false);
const keyword = ref(route.query.keyword as string);

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
}

const search = () => {
  if (keyword.value.trim() === '') return;
  router.push({name: 'product', query: {...route.query,keyword: keyword.value.trim()}});
}

watch(()=>route.path,
  () => {
    closeMobileNav();
    if (route.path === '/logout'
        || route.path === '/login'
        || route.path === '/register') return;
    localStorage.setItem('prevPath', route.path);
})

</script>

<template>
  <header class="header-wrapper fixed top-0 left-0 right-0 z-10 w-full bg-black">
    <div class="header flex justify-between px-8 h-full w-full items-center">
      <h2 class="header__logo mr-5 md:mr-20"
          :class="{'header__logo--mobile': isMobile}">
        <RouterLink class="block h-full hover:bg-transparent" :to="'/'" title="線上商店">線上商店</RouterLink>
      </h2>
      <div class="hidden header__body md:flex flex-1 items-center justify-between h-full">
        <div class="flex-1 flex justify-center items-center">
          <nav class="nav w-1/2">
            <div class="w-full flex bg-white">
              <input class="rounded w-full h-8 px-3 py-2" type="text" placeholder="搜尋" v-model.trim="keyword">
              <button class="w-12 bg-gray-800 text-white" @click="search">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-white"/>
              </button>
            </div>
          </nav>
        </div>
        <div class="header__foot">
          <div v-if="isLogin">
            <span class="nav__item" to="/logout">{{ user.name }}</span>
            <RouterLink class="nav__item" to="/logout">Logout</RouterLink>
          </div>
          <div v-else>
            <RouterLink v-for="item in routeMap.member" :key="item.id"
                        class="nav__item" :to="{path: item.path}">
              {{ item.text }}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="md:hidden flex justify-between w-full">
        <div class="w-4/5 flex bg-white">
          <input class="rounded w-full h-8 px-3 py-2" type="text" placeholder="搜尋" v-model.trim="keyword">
          <button class="w-12 bg-gray-800 text-white" @click="search">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-white"/>
          </button>
        </div>
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
    <nav class="nav nav--mobile bg-black border-0" :class="{'hidden' : !isMobileNavOpen}">
      <ul class="flex flex-col">
        <li class="nav__item  flex justify-center ml-0"
            v-for="item in routeMap.menu" :key="item.id">
          <RouterLink :to="item.path">
            {{ item.text }}
          </RouterLink>
        </li>
        <template v-if="isLogin">
          <li class="nav__item  flex justify-center">
              {{ user.name }}
          </li>
          <li class="nav__item  flex justify-center">
            <RouterLink to="/logout">
                Logout
            </RouterLink>
          </li>
        </template>
        <template v-else>
          <li  class="nav__item flex justify-center"
               v-for="item in routeMap.member" :key="item.id">
            <RouterLink :to="{path: item.path}">
                {{ item.text }}
            </RouterLink>
          </li>
        </template>
      </ul>
    </nav>
  </header>
  <main class="main min-h-screen w-full pt-2" @click="closeMobileNav">
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

.header__logo--mobile {
  width: 50px;
  height: 50px;

  & > a {
    background-position: -78px -100px;
    background-size: 350px 250px;
  }
}

.nav__item {
  color: #fff;
}

.nav__item + .nav__item {
  margin-left: 1rem;
}

.main {
  grid-area: main;
}

@media(min-width: 375px) {
  .nav--mobile .nav__item + .nav__item {
    margin-left: 0
  }
}

</style>
