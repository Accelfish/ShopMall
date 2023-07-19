<script setup lang="ts">
import router from "../../router";
import {ref} from "vue";

const isShowPassword = ref(false);

const toggleShowPassword = () => {
  isShowPassword.value = !isShowPassword.value;
}

const register = () => {
  router.push('/login');
}
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1>註冊</h1>
    <form class="flex flex-col mb-3">
      <div class="mb-3 p-2 border-2">
        <input class="w-full focus:outline-none" type="text" placeholder="Account"/>
      </div>
      <div class="flex bg-white mb-3 border-2 p-2">
        <input class="focus:outline-none" :type="isShowPassword?'text':'password'" placeholder="Password"/>
        <button type="button" @click="toggleShowPassword">
          <template v-if="isShowPassword">
            <font-awesome-icon icon="fa-solid fa-eye"/>
          </template>
          <template v-else>
            <font-awesome-icon icon="fa-solid fa-eye-slash"/>
          </template>
        </button>
      </div>
      <button class="rounded bg-gray-700 text-white p-2" type="button" @click="register">註冊</button>
    </form>
    <RouterLink :to="{name:'login'}">登入</RouterLink>
  </div>
</template>

<style scoped lang="scss">

</style>
