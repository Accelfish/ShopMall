<script setup lang="ts">
import {useDeviceDetector} from "@/compositions/useDevice";
import {onMounted, ref} from "vue";
import type {Ref} from 'vue';
import api from "@/api/api";
import {useRoute} from "vue-router";
const deviceDetector = useDeviceDetector();
const isMobile = ref(deviceDetector.mobile);
const route = useRoute();
const pid: number = parseInt(route.params.id as string);

let productDesc:Ref<string> = ref('');

onMounted(async () => {
  try {
    const res:string = await api.getProductDescription(pid);
    if (res) {
      productDesc.value = res;
    }
  } catch (e) {
    alert('Get Error');
  }
})
</script>

<template>
  <div class="product__detail
              bg-gray-50
              h-full">
    <div class="product__content p-4 h-full" v-if="productDesc">
      <div v-html="productDesc"></div>
    </div>
    <div class="product__content product__content-empty flex justify-center items-center h-full" v-else>
      <p class="text-gray-300 text-3xl"> 暫無詳情 </p>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
