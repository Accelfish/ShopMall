<script setup lang="ts">
import {reactive, ref, computed} from "vue";
import Product from "@/entities/product";
import Card from '@/components/Card.vue';
import Pagination from '@/components/Pagination.vue';

interface IPagination {
    totalPage: number,
    currentPage: number,
}

const isLoading = ref(true);
const perPage = ref(16);

const pageData: IPagination = reactive({
  totalPage: 1,
  currentPage: 1
});

const products: Product[] = reactive({data:[]});

try {
    products.data = await fetch('/data.json').then((res) => res.json())
    pageData.totalPage = Math.ceil(products.data.length/perPage.value);
    pageData.currentPage = 1;
} catch (e) {
} finally {
    isLoading.value = false;
}

const getProductList: Product[] = computed({
  get: () => {
    const begin: number = pageData.currentPage === 1 ? 0 : (pageData.currentPage - 1) * perPage.value;
    const end: number = pageData.currentPage * perPage.value > products.data.length ?
                          products.data.length - 1 :
                          pageData.currentPage * perPage.value;

    return products.data.slice(begin, end);
  },
})

const updateCurrentPage = (toPage: number) => {
  pageData.currentPage = toPage;
  console.log(pageData.currentPage);
}

</script>
<template>
    <div class="product__container" v-if="!isLoading">
        <div class="product__item" v-for="product in getProductList" :key="product.id">
            <Card :title="product.name"
                  :url="product.url ? product.url : ''"
                  :price="product.sellPrice"
                  :rating="product.rating"
                  :isLazyLoading = "false"
            />
        </div>
    </div>
    <div class="pagination__container">
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
