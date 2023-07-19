<script setup lang="ts">
import {EProfileIcon} from "@/enum/Enums";

interface ProfileIcon {
  img?: string,
  alt?: string,
  type?: EProfileIcon,
}

let props = withDefaults(defineProps<ProfileIcon>(), {
  img: '',
  alt: '',
  type: EProfileIcon.person,
});


</script>

<template>
  <div class="w-full h-full rounded-full overflow-hidden bg-white p-2 border-2">
    <img v-if="props.img"
         :src="props.img"
         :alt="props.alt">
    <template v-else>
      <font-awesome-icon v-if="props.type === EProfileIcon.person"
                         icon="fa-solid fa-user"
                         class="w-full h-full"/>
      <font-awesome-icon v-else
                         icon="fa-solid fa-store"
                         class="w-full h-full"/>
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>
