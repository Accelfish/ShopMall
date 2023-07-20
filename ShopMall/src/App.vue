<script setup lang="ts">
import {RouterLink, RouterView, useRoute} from 'vue-router'
import {ref, watch, reactive} from 'vue';
import {useUser} from "@/stores/user";
import {useEnv} from "@/compositions/useEnv";
import {useDeviceDetector} from "@/compositions/useDevice";
import {storeToRefs} from "pinia";
import router from "@/router";
import Loading from "@/components/Loading.vue";
const route = useRoute();

const routeMap = reactive({
  'member': [
    {
      id: 1,
      path: '/login',
      text: '登入',
    },
  ]
})

const {VITE_APP_NAME} = useEnv();
const deviceDetector = useDeviceDetector();
const isMobile = ref(deviceDetector.mobile);
const userStore = useUser();
const {user, isLogin} = storeToRefs(userStore);
const isMobileNavOpen = ref(false);
const keyword = ref(route.query.keyword as string);
const storeId = ref(route.params.id ? parseInt(route.params.storeId as string) : null);

watch(()=>route.params, (newVal)=>{
  storeId.value = newVal.storeId ? parseInt(newVal.storeId as string) : null;
})

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
}

const search = () => {
  if (keyword.value.trim() === '') return;
  if (storeId.value) {
    router.push({name: 'store', query: {...route.query, keyword: keyword.value.trim(), page: 1}});
  } else {
    router.push({name: 'product', query: {...route.query, keyword: keyword.value.trim(), page: 1}});
  }
}

watch(()=>route.query.keyword, (newVal, oldVal)=>{
  if (!newVal) {
    keyword.value = '';
  }
})

watch(() => route.path,
    () => {
      closeMobileNav();
      if (route.path === '/logout'
          || route.path === '/login'
          || route.path === '/register'
          || route.path === '/ErrorPage/404'
      ) return;
      localStorage.setItem('prevPath', route.path);
    })

</script>

<template>
  <header class="header-wrapper fixed top-0 left-0 right-0 z-50 w-screen bg-black">
    <div class="header flex justify-between h-full w-full items-center" :class="[isMobile ? 'px-4' : 'px-8']">
      <h2 class="header__logo mr-5 md:mr-20"
          :class="{'header__logo--mobile': isMobile}">
        <RouterLink class="block h-full hover:bg-transparent" :to="'/'" title="線上商店">線上商店</RouterLink>
      </h2>
      <div class="hidden header__body md:flex flex-1 items-center justify-between h-full">
        <div class="flex-1 flex justify-center items-center">
          <nav class="nav w-1/2">
            <form>
              <div class="w-full flex bg-white">
                <input class="rounded w-full h-8 px-3 py-2 focus:outline-none" type="text" placeholder="搜尋"
                       v-model.trim="keyword"
                       @keyup.enter="search">
                <button class="w-12 bg-gray-800 text-white" type="submit" @click.prevent="search">
                  <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-white"/>
                </button>
              </div>
            </form>
          </nav>
        </div>
        <div class="header__foot flex items-center">
          <template v-if="isLogin">
            <RouterLink :to="{name: 'cart'}" class="nav__item">
              <font-awesome-icon icon="fa-solid fa-cart-shopping" class="w-6 h-6 text-white"/>
            </RouterLink>
            <span class="nav__item">{{ user.name }}</span>
            <RouterLink class="nav__item" :to="{name:'logout'}">Logout</RouterLink>
          </template>
          <template v-else>
            <RouterLink :to="{name: 'cart'}" class="nav__item">
              <font-awesome-icon icon="fa-solid fa-cart-shopping" class="w-6 h-6 text-white"/>
            </RouterLink>
            <RouterLink v-for="item in routeMap.member" :key="item.id"
                        class="nav__item" :to="{path: item.path}">
              {{ item.text }}
            </RouterLink>
          </template>
        </div>
      </div>
      <div class="md:hidden flex justify-between items-center w-full">
        <div class="w-4/6 bg-white h-full">
          <form>
              <input class="rounded w-full h-full max-h-8 px-3 py-2 focus:outline-none" type="text" placeholder="搜尋"
                     v-model.trim="keyword"
                     @keyup.enter="search">
              <button class="w-12 bg-gray-800 text-white hidden" type="submit" @click.prevent="search">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text-white"/>
              </button>
          </form>
        </div>
        <div class="flex items-center">
          <RouterLink :to="{name: 'cart'}" class="p-1.5">
            <font-awesome-icon icon="fa-solid fa-cart-shopping" class="w-6 h-6 text-white"/>
          </RouterLink>
          <!-- Mobile menu button -->
          <button @click="toggleMobileNav" class="p-1.5">
            <svg class="w-6 h-6 text-gray-500 hover:text-green-500 "
                 x-show="!showMenu"
                 fill="none"
                 stroke-linecap="round"
                 stroke-linejoin="round"
                 stroke-width="2"
                 viewBox="0 0 24 24"
                 stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <nav class="nav nav--mobile bg-black border-0" :class="{'hidden' : !isMobileNavOpen}">
      <ul class="flex flex-col">
        <template v-if="isLogin">
          <li class="nav__item flex justify-center">
            {{ user.name }}
          </li>
          <li class="nav__item flex justify-center">
            <RouterLink :to="{name:'logout'}" @click="closeMobileNav">
              Logout
            </RouterLink>
          </li>
        </template>
        <template v-else>
          <li class="nav__item flex justify-center"
              v-for="item in routeMap.member" :key="item.id">
            <RouterLink :to="{path: item.path}" @click="closeMobileNav">
              {{ item.text }}
            </RouterLink>
          </li>
        </template>
      </ul>
    </nav>
  </header>
  <main class="main min-h-screen w-full"
        :class="[isMobile? 'pt-2 px-4' : 'pt-2']"
        @click="closeMobileNav">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <template #default>
          <div>
            <component :is="Component" :key="$route.path"/>
          </div>
        </template>
        <template #fallback>
          <Loading/>
        </template>
      </Suspense>
    </RouterView>
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

  @media(min-width: 320px) and (max-width: 767px) {
    width: 50px;
  }

  & > a {
    text-indent: -9999px;
    background-image: url('@/assets/logo.svg');
    background-repeat: no-repeat;
    background-position: -40px -115px;
    background-size: 140% 560%;

    @media(min-width: 320px) and (max-width: 767px) {
      background-position: -78px -100px;
      background-size: 350px 250px;
    }
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

  + .nav__item {
    margin-left: 1rem;
  }
}

.main {
  grid-area: main;
}

@media(min-width: 375px) {
  .nav--mobile {
    & .nav__item + .nav__item {
      margin-left: 0
    }

    & .nav__item {
      & > a {
        width: 100%;
        height: 100%;
        text-align: center;
        padding: 0.75rem;
      }
    }
  }
}

</style>
