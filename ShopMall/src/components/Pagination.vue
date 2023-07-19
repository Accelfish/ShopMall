<script setup lang="ts">
import {toRefs} from "vue";
import usePaginator from "@/compositions/usePaginator";

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
  totalButtons: 7,
})

function updateCurrentPage(page: number) {
  emit('updateCurrentPage', page)
};

</script>
<template>
  <div class="pagination w-full m-0 p-0 inline-flex justify-between list-none">
    <button class="pagination__item pagination__arrow"
            :disabled="!hasPrev"
            @click="updateCurrentPage(goPrev())"
    >
      <svg class="pagination__icon"
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
        class="pagination__item"
        :class="{ 'pagination__item-active': button.active } "
        v-for="(button, idx) in buttons"
        :key="idx"
        @click="updateCurrentPage(button.page)"
    >
      {{ button.ellipsis ? '...' : button.page }}
    </button>
    <button class="pagination__item pagination__arrow"
            :disabled="!hasNext"
            @click="updateCurrentPage(goNext())"
    >
      <svg class="pagination__icon"
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
.pagination {
}

.pagination__item {
  border: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-width: 2rem;
  margin-left: 0.5375rem;
  margin-right: 0.5375rem;
  font-size: 1rem;
  height: 1.875rem;
}

.pagination__item-active {
  background-color: #EE4D2DFF;
  color: #fff;
  cursor: default;
}

.pagination__icon {
  width: 1em;
  height: 1em;
}

@media (min-width: 375px) {
  .pagination__item {
    min-width: 1.5rem;
    margin-left: 0.35375rem;
    margin-right: 0.3375rem;
    font-size: 1rem;
    height: 1.875rem;
  }
}

@media (min-width: 768px) {
  .pagination__item {
    min-width: 2.5rem;
    margin-left: 0.9375rem;
    margin-right: 0.9375rem;
    font-size: 1.25rem;
    height: 1.875rem;
  }
}
</style>
