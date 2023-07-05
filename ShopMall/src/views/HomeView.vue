<script setup lang="ts">
import {reactive, ref} from "vue";
import Product from "@/entities/product";
import Card from '@/components/Card.vue';
import Pagination from '@/components/Pagination.vue';

interface IPagination {
    totalPage: number,
    currentPage: number,
}

const isLoading = ref(true);
const perPage = ref(16);

let pageData: IPagination = reactive({
  totalPage: 1,
  currentPage: 1
});

let products: Product[] = reactive([]);
try {
    products = await fetch('/data.json').then((res) => res.json());
    pageData = {
      totalPage: Math.ceil(products.length/perPage.value),
      currentPage: 1,
    }
} catch (e) {
} finally {
    isLoading.value = false;
}

const updateCurrentPage = (toPage: number) => {
  pageData.currentPage = toPage;
  console.log(pageData.currentPage);
}

</script>
<template>
    <div class="product__container" v-if="!isLoading">
        <div class="product__item" v-for="product in products.slice(0,16)" :key="product.id">
            <Card :title="product.name"
                  :url="product.url ? product.url : ''"
                  :price="product.sellPrice"
                  :rating="product.rating"
                  :isLazyLoading = "false"
            />
        </div>
    </div>
    <div class="pagination__container">
        {{pageData.currentPage}}

      <Pagination :totalPage = "pageData.totalPage"
                  :currentPage = "pageData.currentPage"
                  @update-current-page = "updateCurrentPage"
      />
    </div>
</template>
<style scoped lang="scss">
.product__container {
  display: grid;
  grid-template-columns: repeat(4, 3fr);
  grid-template-rows: repeat(4, 3fr);
  height: 100%;
  width: 100%;
  padding: 0 2rem;
}

.product__item {
  max-width:100%;
}

@media (max-width: 414px) {
  .product__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(8, 1fr);
    height: 100%;
    width: 100%;
    padding: 0 2rem;
  }
}
</style>
