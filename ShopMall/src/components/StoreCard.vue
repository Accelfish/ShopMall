<script setup lang="ts">
import ProfileIcon from "@/components/ProfileIcon.vue";
import Rating from "@/components/Rating.vue";
import {EProfileIcon} from "@/enum/Enums";

interface Store {
  id: number;
  name: string;
  rating?: number;
  description?: string;
  image?: string;
}

let props = withDefaults(defineProps<Store>(), {
  id: 0,
  name: '',
  rating: 0,
  description: '',
  image: '',
});

console.log(props);

</script>

<template>
  <div class="store">
    <div class="store__info flex p-4">
      <div class="store__head mr-4">
        <div class="w-20 h-20">
          <ProfileIcon :img="props.image"
                       :alt="props.name"
                       :type="EProfileIcon.store"
          ></ProfileIcon>
        </div>
      </div>
      <div class="store__body flex flex-col justify-center">
        <div class="store__name">
          <h3><span class="mr-3">店家名稱：</span>{{props.name}}</h3>
        </div>
        <div class="store__rating flex items-center" v-if="props.rating">
          <span class="mr-3">店家評價：</span>
          <span class="flex items-center">
            <Rating :max-rate="5" :show-rate="props.rating"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
