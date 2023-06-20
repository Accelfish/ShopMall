<script setup lang="ts">
  import { useUser } from "@/stores/user";
  import {onMounted} from "vue";

  const userStore = useUser();
  onMounted(()=> {
    userStore.logout();

  })

</script>

<template>
</template>

<style scoped lang="scss">

</style>
