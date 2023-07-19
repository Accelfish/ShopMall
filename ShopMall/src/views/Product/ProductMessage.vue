<script setup lang="ts">
import {useDeviceDetector} from "@/compositions/useDevice";
import {onMounted,onActivated,onDeactivated, ref} from "vue";
import type {Ref} from 'vue';
import type {IMessage} from "@/modal/IProduct";

import api from "@/api/api";
import {useRoute} from "vue-router";
import Rating from "@/components/Rating.vue";
import ProfileIcon from "@/components/ProfileIcon.vue";
import {EProfileIcon} from "@/enum/Enums";
const deviceDetector = useDeviceDetector();
const isMobile = ref(deviceDetector.mobile);
const route = useRoute();
const pid: number = parseInt(route.params.id as string);

let productMessage:Ref<IMessage[]> = ref([]);
console.log('messageCreate');

onMounted(async () => {
  try {
    const res:IMessage[] = await api.getProductMessage(pid);
    console.log('messageMounted');
    if (res) {
      productMessage.value = res;
    }
  } catch (e) {
    console.log(e);
    alert('Get Error');
  }
});

</script>

<template>
  <div class="product__detail
              bg-gray-50
              h-full">
    <div class="product__content flex flex-col h-full" v-if="productMessage.length">
      <div class="border-b-2 p-4" v-for="item in productMessage" :key="item.id">
        <div class="flex items-center">
          <div class="w-10 h-10 mr-1">
            <ProfileIcon :type="EProfileIcon.person"></ProfileIcon>
          </div>
          <div>
            {{item.name? item.name : '匿名'}}
          </div>
        </div>
        <div>
          <Rating :max-rate="5" :show-rate="item.rating"/>
        </div>
        <div>
          {{item.message}}
        </div>
      </div>
    </div>
    <div class="product__content product__content-empty flex justify-center items-center h-full" v-else>
      <p class="text-gray-300 text-3xl">目前沒有任何評價</p>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
