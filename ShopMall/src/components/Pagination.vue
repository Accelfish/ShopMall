<script setup lang="ts" >
interface IPagination {
  totalPage: number,
  currentPage: number,
}

const emit = defineEmits<{
  (e: 'updateCurrentPage', page: number): void
}>()

const props = withDefaults(defineProps<IPagination>(), {
  totalPage: 0,
  currentPage: 0,
});

const updateCurrentPage:void = (page) => emit('updateCurrentPage', page);


</script>
<template>
  <ol class="pagination">
    <li class="pagination__item" v-for="(item, index) in totalPage" :key="index" @click="updateCurrentPage(item)">
      {{ item }}
    </li>
  </ol>
</template>

<style scoped>
.pagination {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  display:inline-flex;
  justify-content: space-between;
}

.pagination__item{
  display: flex;
  justify-content: center;
  min-width: 2.5rem;
  margin-left:  0.9375rem;
  margin-right: 0.9375rem;
  font-size: 1.25rem;
  height: 1.875rem;
}
</style>
