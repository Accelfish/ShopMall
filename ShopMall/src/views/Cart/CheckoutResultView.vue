<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import type {Ref} from 'vue';
const route = useRoute();
const router = useRouter();

if(route.query.isSuccess === undefined || route.query.orderId === undefined){
  router.replace({name: 'notFound'});
}

const isSuccess: Ref<boolean> = ref(false);
const orderId: Ref<number> = ref(0);

if(String(route.query.isSuccess).toLowerCase() === 'true') {
  isSuccess.value = true;
  orderId.value = parseInt(route.query.orderId as string, 10);
}
</script>

<template>
  <div class="result result--success" v-if="isSuccess">
    <svg viewBox="0 0 400 400">
      <circle fill="none" stroke="#68E534" stroke-width="20" cx="200" cy="200" r="190" class="circle" transform="rotate(-90 200 200)"/>
      <polyline fill="none" stroke="#68E534" stroke-width="24" points="88,214 173,284 304,138" stroke-linecap="round" stroke-linejoin="round" class="tick"/>
    </svg>
    <h2 class="result__title">訂單成立</h2>
  </div>
  <div class="result result--failed" v-else>
    <svg viewBox="0 0 400 400">
      <circle fill="none" stroke="#f00" stroke-width="20" cx="200" cy="200" r="190" class="circle" transform="rotate(-90 200 200)"/>
      <path fill="#eb1a1a" fill-opacity="1" stroke="#f00" stroke-width="24" stroke-linecap="round" d="M92.00436989915877,312.90761431580233 L311.28483732359126,94.67633573072133" transform="rotate(180 200,200)" class="tick" />
      <path fill="#eb1a1a" fill-opacity="1" stroke="#f00" stroke-width="24" stroke-linecap="round" d="M92.00436989915877,312.90761431580233 L311.28483732359126,94.67633573072133" transform="rotate(90 200,200)" class="tick" />
    </svg>
    <h2 class="result__title">訂單未成立</h2>
  </div>
</template>

<style scoped lang="scss">
.result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-height: 500px;
}

.circle{
  stroke-dasharray:1194;
  stroke-dashoffset:1194;
}

.result svg .circle{
  animation:circle 1s ease-in-out;
  animation-fill-mode:forwards;
}

.tick{
  stroke-dasharray:350;
  stroke-dashoffset:350;
}

.result svg .tick{
  animation: tick .8s ease-out;
  animation-fill-mode:forwards;
  animation-delay: .95s;
}

.result__title {
  font-family:Helvetica;
  font-size:36px;
  margin-top:40px;
  color:#333;
  opacity:0;
}

.result .result__title{
  animation: .6s title ease-in-out;
  animation-delay:1.2s;
  animation-fill-mode:forwards;
}

@keyframes circle{
  from{
    stroke-dashoffset:1194;
  }
  to{
    stroke-dashoffset:2388;
  }
}

@keyframes tick{
  from{
    stroke-dashoffset:350;
  }
  to{
    stroke-dashoffset:0;
  }
}

@keyframes title{
  from{
    opacity:0;
  }
  to{
    opacity:1;
  }
}
</style>
