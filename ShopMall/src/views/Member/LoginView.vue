<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useUser} from "@/stores/user";
import {ref} from "vue";
import type {Ref} from "vue";

const userStore = useUser();
const {user, isLogin} = storeToRefs(userStore);
const isShowPassword: Ref<boolean> = ref(false);
const account: Ref<string> = ref('Kriz');
const password: Ref<string> = ref('12345');
const errorMessage: Ref<string> = ref('');

const toggleShowPassword = () => {
  isShowPassword.value = !isShowPassword.value;
}

const login = async () => {
  try {
    await userStore.login(account.value, password.value, localStorage.getItem('prevPath') as string);
  } catch (e: any) {
    errorMessage.value = e;
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="mb-1">登入</h1>
    <form class="flex flex-col mb-3">
      <div class="mb-3 p-2 border-2" :class="{'border-red-700': errorMessage}">
        <input class="w-full focus:outline-none" v-model.trim="account" @keyup="errorMessage=''" type="text"
               placeholder="Account"/>
      </div>
      <div class="flex bg-white mb-3 border-2 p-2 border-" :class="{'border-red-700': errorMessage}">
        <input class="focus:outline-none" v-model.trim="password" @keyup="errorMessage=''"
               :type="isShowPassword?'text':'password'" placeholder="Password"/>
        <button type="button" @click="toggleShowPassword">
          <template v-if="isShowPassword">
            <font-awesome-icon icon="fa-solid fa-eye"/>
          </template>
          <template v-else>
            <font-awesome-icon icon="fa-solid fa-eye-slash"/>
          </template>
        </button>
      </div>
      <span class="text-red-700" :class="{'hidden': !errorMessage}">{{ errorMessage }}</span>
      <button class="rounded bg-gray-700 text-white p-2" type="button" @click="login">登入</button>
    </form>
    <RouterLink :to="{name:'register'}">註冊</RouterLink>
  </div>
</template>

<style scoped lang="scss">

</style>
