<script setup lang="ts">
import {toRefs} from "vue";

interface IRating {
  maxRate: number,
  showRate: number,
}

let props = withDefaults(defineProps<IRating>(), {
  maxRate: 5,
  showRate: 0,
});

let data = toRefs(props);

</script>

<template>
  <div class="ratings">
    <div class="empty_star">
      <template v-for="index in data.maxRate.value" :key="index">★</template>
    </div>
    <div class="full_star" :style="{width: data.showRate.value/data.maxRate.value * 100 + '%' }">
      <template v-for="index in data.maxRate.value" :key="index">★</template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ratings {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  color: #ddd;
  overflow: hidden;
  font-size: 20px;
}

.full_star {
  width: 90%;
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  overflow: hidden;
  color: #D56A16;
}
</style>
