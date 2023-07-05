<script setup lang="ts">
import {reactive, ref, computed, watch, onMounted} from "vue";
import type {ComputedRef, Ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import type {LocationQueryValue} from 'vue-router';
import Product from "@/entities/product";
import Card from '@/components/Card.vue';
import Pagination from '@/components/Pagination.vue';
import Rating from "@/components/Rating.vue";
import axios from "axios";

interface IFilterQuery {
  page: number,
  rate?: number,
  minPrice?: number | null,
  maxPrice?: number | null,
  keyword?: string,
}
const rateRage: Array<number> = [5, 4, 3, 2, 1];

const route = useRoute();
const router = useRouter();
const queryMinPrice: LocationQueryValue | LocationQueryValue[] = route.query.minprice || route.query.minPrice;
const queryMaxPrice: LocationQueryValue | LocationQueryValue[] = route.query.maxprice || route.query.maxPrice;

const queryKeyword: string = route.query.keyword ? route.query.keyword as string : '';
const page: number = route.query.page ? parseInt(route.query.page as string, 10) : 1;
const filterRate: number = route.query.rate ? parseInt(route.query.rate as string, 10) : 0;
const filterMinPrice: number | null = queryMinPrice ? parseInt(queryMinPrice.toString(), 10) : null;
const filterMaxPrice: number | null = queryMaxPrice ? parseInt(queryMaxPrice.toString(), 10) : null;

const currentPage = ref(page);
const currentRate = ref(filterRate);
const currentMinPrice = ref(filterMinPrice);
const currentMaxPrice = ref(filterMaxPrice);
const keyword = ref(queryKeyword);

// let filter: IFilterQuery = reactive({
//   rate: filterRate,
//   minPrice: filterMinPrice,
//   maxPrice: filterMaxPrice,
//   page: page
// })

// let filterQueryObject: IFilterQuery = reactive({
//   rate: currentRate.value,
//   minPrice: currentMinPrice.value,
//   maxPrice: currentMaxPrice.value,
//   page: currentPage.value,
//   keyword: keyword.value,
// });


const setRateQueryObject = (rate: number) => {
  currentRate.value = rate;
  console.log('setRateQueryObject', rate);
}

const setPriceQueryObject = () => {
  if (currentMinPrice.value && currentMaxPrice.value && currentMinPrice.value > currentMaxPrice.value) {
    [currentMinPrice.value, currentMaxPrice.value] = [currentMaxPrice.value, currentMinPrice.value];
  }

  // filterQueryObject.minPrice = currentMinPrice.value;
  // filterQueryObject.maxPrice = currentMaxPrice.value;
  // console.log('setPriceQueryObject', filterQueryObject.minPrice, filterQueryObject.maxPrice);

}

const setCurrentPage = (page: number) => {
  // filterQueryObject.page = page;
  currentPage.value = page;
  console.log('setCurrentPage', page);
}

const getQuery = computed(() => {
  const tmpObj = {};
  // filterQueryObject.rate ? Object.assign(tmpObj, {rate: filterQueryObject.rate}) : '';
  // filterQueryObject.page ? Object.assign(tmpObj, {page: filterQueryObject.page}) : '';
  // filterQueryObject.minPrice ? Object.assign(tmpObj, {minPrice: filterQueryObject.minPrice}) : '';
  // filterQueryObject.maxPrice ? Object.assign(tmpObj, {maxPrice: filterQueryObject.maxPrice}) : '';
  // filterQueryObject.keyword ? Object.assign(tmpObj, {keyword: filterQueryObject.keyword}) : '';
  currentRate.value ? Object.assign(tmpObj, {rate: currentRate.value}) : '';
  currentPage.value ? Object.assign(tmpObj, {page: currentPage.value}) : '';
  currentMinPrice.value ? Object.assign(tmpObj, {minPrice: currentMinPrice.value}) : '';
  currentMaxPrice.value ? Object.assign(tmpObj, {maxPrice: currentMaxPrice.value}) : '';
  keyword.value ? Object.assign(tmpObj, {keyword: keyword.value}) : '';
  const qs = new URLSearchParams(tmpObj).toString();
  return {value: tmpObj, queryString: qs};
})

// const getFilterPanelObject: ComputedRef<IFilterQuery> = computed(() => {
//   const queryObj: IFilterQuery = {page: filter.page ? filter.page : 1};
//
//   filterQueryObject.rate ? Object.assign(queryObj, {rate: filterQueryObject.rate}) : '';
//   filterQueryObject.page ? Object.assign(queryObj, {page: filterQueryObject.page}) : '';
//
//   let filterMinPrice = filterQueryObject.minPrice;
//   let filterMaxPrice = filterQueryObject.maxPrice;
//   if (filterMinPrice && filterMaxPrice && filterMinPrice > filterMaxPrice) {
//     [filterMinPrice, filterMaxPrice] = [filterMaxPrice, filterMinPrice];
//   }
//
//   filterMinPrice ? Object.assign(queryObj, {minPrice: filterMinPrice}) : '';
//   filterMaxPrice ? Object.assign(queryObj, {maxPrice: filterMaxPrice}) : '';
//
//   return queryObj;
// })

const isLoading: Ref<boolean> = ref(true);
const perPage: Ref<number> = ref(12);
let products: Ref<Product[]> = ref([]);

async function getProducts(): Promise<Product[]> {
  let pd: Product[] = [];
  try {
    let result = await axios.get('/data.json?' + getQuery.value.queryString);
    let productList: Product[] = result.data;
    if (currentMinPrice.value) {
      const minPrice = currentMinPrice.value;
      productList = productList.filter((item: Product) => item.sellPrice >= minPrice || item.price >= minPrice);
    }

    if (currentMaxPrice.value) {
      const maxPrice = currentMaxPrice.value;
      productList = productList.filter((item: Product) => item.sellPrice <= maxPrice || item.price <= maxPrice);
    }

    if (currentRate.value) {
      const filterRate = currentRate.value;
      productList = productList.filter((item: Product) => item.rating >= filterRate);
    }

    if (keyword.value) {
      const filterKeyword = keyword.value;
      productList = productList.filter((item: Product) => item.name.indexOf(filterKeyword) > -1);
    }

    pd = productList.map((item: Product) => {
      item.onSell ? item.url = `/productDetail/${item.id}` : ''
      return item;
    });
  } catch (e) {
    console.log(e);
    alert('get Product Error');
  } finally {
    isLoading.value = false;
  }
  return pd;
}

const updateCurrentPage = (toPage: number) => {
  setCurrentPage(toPage);
  router.push({
    name: 'product',
    query: {
      ...route.query,
      ...getQuery.value.value,
    },
  });
}

const productList: ComputedRef<Product[]> = computed(() => {
  const pd = products.value;
  const begin: number = currentPage.value === 1 ? 0 : (currentPage.value - 1) * perPage.value;
  const result = pd.splice(begin, perPage.value);
  return result;
})

onMounted(async () => {
  const productList = await getProducts();
  products.value = productList;
});

watch(
    () => route.query,
    async (newQuery) => {
      console.log(newQuery);
      getProducts();


      // if (newQuery.keyword) {
      //   keyword.value = newQuery.keyword as string;
      // }
      // console.log(getQuery.value);
    }
)
</script>
<template>
  <div class="flex">
    <div class="filterPannel">
      <div class="filterPannel__container">
        <div class="filterPannel__item mb-2">
          <div class="filterPannel__title">價格</div>
          <div class="filterPannel__content">
            <div class="filterPannel__inputGroup flex">
              <input class="w-16 md:mr-1" v-model.number="currentMinPrice" type="text" placeholder="$ 最小值"
                     maxlength="13"/>~
              <input class="w-16 md:ml-1 md:pl-1" v-model.number="currentMaxPrice" type="text" placeholder="$ 最大值"
                     maxlength="13"/>
            </div>
            <div class="filterPannel__button">
              <button class="rounded-md px-1 py-0.5 p bg-sky-400 hover:bg-sky-500 text-white"
                      @click="setPriceQueryObject">套用
              </button>
            </div>
          </div>
        </div>
        <div class="border-t-2"></div>
        <div class="filterPannel__item my-2">
          <div class="filterPannel__title">評價</div>
          <div class="filterPannel__content">
            <ul>
              <li class="max-w-fit block cursor-pointer mb-1"
                  :class="{'bg-amber-300': rate===currentRate}"
                  v-for="rate in rateRage"
                  :key="rate"
                  @click="setRateQueryObject(rate)"
              >
                <Rating :max-rate="5" :show-rate="rate"></Rating>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <template v-if="!isLoading">
      <div class="list w-full" v-if="productList.length">
        <div class="list__container
                    px-8
                    grid grid-cols-2 gap-3
                    md:grid-cols-4 md:gap-3
                    mb-12">
          <div class="list__item p-2"
               v-for="product in productList"
               :key="product.id">
            <Card :title="product.name"
                  :img="product.image? product.image : ''"
                  :url="product.url ? product.url : ''"
                  :isLazyLoading="true"
                  :isZoomImg="!!product.image">
              <template #body>
                <div class="card__title">
                  {{ product.name }}
                </div>
                <div class="card__price">
                      <span v-if="product.price > product.sellPrice" class="line-through mr-1">
                        ${{ product.price }}
                      </span>
                  <span>${{ product.sellPrice }}</span>
                </div>
                <div class="card__rating" v-if="product?.rating > 0">
                  <Rating :max-rate="5" :show-rate="product?.rating"></Rating>
                </div>
              </template>
            </Card>
          </div>
        </div>
        <div class="pagination__container flex justify-center">
          <Pagination :totalLength="products.length"
                      :currentPage="currentPage"
                      :pageSize="perPage"
                      @update-current-page="updateCurrentPage"
          />
        </div>
      </div>
      <div class="flex justify-center items-center w-full" v-else>
        <p class="text-gray-300 text-3xl">查無結果</p>
      </div>
    </template>
  </div>
</template>
<style scoped lang="scss">
.list__item {
  border: 1px solid #dddddd;
}
</style>
