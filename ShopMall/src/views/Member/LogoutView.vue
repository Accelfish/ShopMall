<script setup lang="ts">
import {useUser} from "@/stores/user";
import {onMounted} from "vue";

const userStore = useUser();
onMounted(() => {
  userStore.logout();
})

</script>
<template>
  <div>logout...</div>
</template>

<style scoped lang="scss">

</style>
