<script setup lang="ts">
import {ref, reactive, useSlots, provide} from 'vue';
import {useRoute} from 'vue-router';
import {useDeviceDetector} from "@/compositions/useDevice";
import router from "@/router";

const route = useRoute();
const deviceDetector = useDeviceDetector();
const isMobile = ref(deviceDetector.mobile);

const slots = useSlots();

interface Tab {
  id: number,
  title: string;
  link: {
    id: number,
    name: string
  };
}

const tabs: Tab[] = reactive(slots.default ? slots.default().map((tab, index) => {
  return {
    id: index,
    title: tab.props?.title,
    link: tab.props?.link,
  }
}) : []);

const selectedTab = ref(tabs.find(item => item.link.name === route.name)?.title);
provide("seletedTab", selectedTab);

const clickTab = (tab: Tab) => {
  if (selectedTab.value === tab.title) {
    return;
  }
  selectedTab.value = tab.title;
  if (tab.link) {
    router.push(tab.link);
  }
}
</script>

<template>
  <div class="tabs">
    <ul class="tabs__header flex bg-gray-200">
      <li class="tabs__item list-none flex-1 text-center p-2"
          :class="{'bg-sky-400 text-white': route.name === tab.link.name,
                   'cursor-pointer': route.name !== tab.link.name}"
          v-for="tab in tabs"
          :key="tab.id"
          @click="clickTab(tab)">
        {{ tab.title }}
      </li>
    </ul>
    <slot/>
  </div>
</template>

<style scoped lang="scss">
</style>
