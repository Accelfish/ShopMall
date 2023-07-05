<script setup lang="ts" >
import {watch, watchEffect, toRefs, reactive, ref, toRef} from "vue";

interface IPagination {
  totalPage: number,
  currentPage: number,
}

const emit = defineEmits<{
  (e: 'updateCurrentPage', page: number): void
}>()

let props = withDefaults(defineProps<IPagination>(), {
  totalPage: 0,
  currentPage: 0,
});

let propsData = toRefs(props);
let data = reactive({
    totalPage: 0,
    currentPage: 0,
});

function updateCurrentPage (page: number) {emit('updateCurrentPage', page)};
watchEffect(()=>{
    data.currentPage = props.currentPage;
})

</script>
<template>
  <ol class="pagination">
    <li class="pagination__item"
        :class="{'pagination__item-active': data.currentPage == item}"
        v-for="(item, index) in props.totalPage" :key="index"
        @click="updateCurrentPage(item)">
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
  cursor: pointer;

}
.pagination__item-active{
    background-color: #EE4D2DFF;
    color: #fff;
    cursor: default;
}
</style>
