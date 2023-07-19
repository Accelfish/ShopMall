<script setup lang="ts">
import {toRefs, ref} from "vue";
import {usePaginator} from "@/compositions/usePaginator";
import {useDeviceDetector} from "@/compositions/useDevice";

const deviceDetector = useDeviceDetector();
const isMobile = ref(deviceDetector.mobile);

interface IPagination {
  totalLength: number,
  currentPage: number,
  pageSize: number,
}

const emit = defineEmits<{
  (e: 'updateCurrentPage', page: number): void
}>();

let props = withDefaults(defineProps<IPagination>(), {
  totalLength: 0,
  currentPage: 0,
  pageSize: 5,
});

let data = toRefs(props);

const {
  currentPage,
  pageSize,
  totalItems,
  totalButtons,
  totalPages,
  slice,
  hasPrev,
  hasNext,
  goPrev,
  goNext,
  goStart,
  goEnd,
  buttons,
} = usePaginator({
  currentPage: data.currentPage,
  pageSize: data.pageSize,
  totalItems: data.totalLength,
  totalButtons: isMobile.value ? 0 : 7,
})

function updateCurrentPage(page: number) {
  emit('updateCurrentPage', page)
};

</script>
<template>
  <div class="w-full m-0 p-0 flex justify-between"
       :class="[isMobile ? 'justify-center' : 'justify-between' ] ">
    <button class="m-0 border-0 bg-transparent flex justify-center items-center cursor-pointer p-1 md:p-2 text-base h-7"
            :class="[isMobile && !hasPrev ? 'invisible' : 'visible']"
            :disabled="!hasPrev"
            @click="updateCurrentPage(goPrev())"
    >
      <svg class="pagination__icon w-4 h-4"
           enable-background="new 0 0 11 11"
           viewBox="0 0 11 11" x="0" y="0">
        <g>
          <path
              d="m8.5 11c-.1 0-.2 0-.3-.1l-6-5c-.1-.1-.2-.3-.2-.4s.1-.3.2-.4l6-5c .2-.2.5-.1.7.1s.1.5-.1.7l-5.5 4.6 5.5 4.6c.2.2.2.5.1.7-.1.1-.3.2-.4.2z">
          </path>
        </g>
      </svg>
    </button>
    <button
        class="m-0 border-0 flex justify-center items-center cursor-pointer p-1 md:p-2 text-base h-7 rounded"
        :class="[button.active && !isMobile ? 'cursor-default text-white pagination__item-active' : 'bg-transparent']"
        v-for="(button, idx) in buttons"
        :key="idx"
        @click="updateCurrentPage(button.page)"
    >
      {{ button.ellipsis ? '...' : button.page }}
    </button>
    <button class="m-0 border-0 bg-transparent flex justify-center items-center cursor-pointer p-1 md:p-2 text-base h-7"
            :class="{'pagination__item-hidden': !hasNext && isMobile}"
            :disabled="!hasNext"
            @click="updateCurrentPage(goNext())"
    >
      <svg class="pagination__icon w-4 h-4"
           enable-background="new 0 0 11 11"
           viewBox="0 0 11 11" x="0" y="0">
        <path
            d="m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z">
        </path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.pagination__item-active {
  background-color: #EE4D2DFF;
}

</style>
