<script setup lang="ts">
  import {storeToRefs} from "pinia";
  import { useUser } from "@/stores/user";
  import router from "../../router";

  const userStore = useUser();
  const { user, isLogin } = storeToRefs(userStore);
  const log = ()=> {
    console.log('user', user.value)
    console.log('isLogin', isLogin.value)
  }

  const login = (username: string, password: string) => {
    userStore.login(username, password, localStorage.getItem('prevPath'));
  }
  const logout = () => {
    userStore.logout(localStorage.getItem('prevPath'));
  }
</script>

<template>
  <button @click="login">login</button>
  <button @click="logout">logout</button>
  <button @click="log">isLogin</button>
  <button @click="log">userData</button>
</template>

<style scoped lang="scss">

</style>
