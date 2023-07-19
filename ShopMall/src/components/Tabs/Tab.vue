<script setup lang="ts">

import {inject} from 'vue';

interface Tab {
  title: string;
}

const props = withDefaults(defineProps<Tab>(), {
  title: '',
});

const selectedTab = inject('seletedTab');
</script>

<template>
  <div class="tab__content" v-show="props.title === selectedTab">
    <slot/>
  </div>
</template>

<style scoped lang="scss">
</style>
