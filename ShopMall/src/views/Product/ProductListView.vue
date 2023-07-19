<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import type {ComputedRef, Ref} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import type {LocationQueryValue} from 'vue-router';
import type ProductInst from "../../entities/productInst";
import NumberInput from "@/components/NumberInput.vue";

import {useDeviceDetector} from "@/compositions/useDevice";

import Card from '@/components/Card.vue';
import Pagination from '@/components/Pagination.vue';
import Rating from "@/components/Rating.vue";
import api from "@/api/api";

const rateRage: Array<number> = [5, 4, 3, 2, 1];

const route = useRoute();
const router = useRouter();
const queryMinPrice: LocationQueryValue | LocationQueryValue[] = route.query.minprice || route.query.minPrice;
const queryMaxPrice: LocationQueryValue | LocationQueryValue[] = route.query.maxprice || route.query.maxPrice;

const page: number = route.query.page ? parseInt(route.query.page as string, 10) : 1;
const filterMinPrice: number | null = queryMinPrice ? parseInt(queryMinPrice.toString(), 10) : null;
const filterMaxPrice: number | null = queryMaxPrice ? parseInt(queryMaxPrice.toString(), 10) : null;

const currentPage: Ref<number> = ref(page);
const currentRate: Ref<number> = ref(parseInt(route.query.rate as string, 10));
const currentMinPrice: Ref<number | null> = ref(filterMinPrice);
const currentMaxPrice: Ref<number | null> = ref(filterMaxPrice);
const keyword: Ref<string> = ref(route.query.keyword as string);

onBeforeRouteUpdate(async (to, from) => {
  keyword.value = to.query.keyword ? to.query.keyword as string : '';
  if (keyword.value) {
    if (from.query.keyword) {
      if (keyword.value !== from.query.keyword) {
        setCurrentPage(1);
      }
    }
  }
  const queryMinPrice: LocationQueryValue | LocationQueryValue[] = to.query.minprice || to.query.minPrice;
  const queryMaxPrice: LocationQueryValue | LocationQueryValue[] = to.query.maxprice || to.query.maxPrice;

  currentRate.value = to.query.rate ? parseInt(to.query.rate as string, 10) : 0;
  currentMinPrice.value = queryMinPrice ? parseInt(queryMinPrice as string, 10) : null;
  currentMaxPrice.value = queryMaxPrice ? parseInt(queryMaxPrice as string, 10) : null;
  const result = await getProducts();
  products.value = result;
})

onMounted(async () => {
  const result = await getProducts();
  products.value = result;
});

const setRateQueryObject = (rate: number) => {
  currentRate.value = rate;
  updateCurrentPage(1)
}

const setPriceQueryObject = () => {
  if (currentMinPrice.value && currentMaxPrice.value && currentMinPrice.value > currentMaxPrice.value) {
    [currentMinPrice.value, currentMaxPrice.value] = [currentMaxPrice.value, currentMinPrice.value];
  }
  updateCurrentPage(1)
}

const setCurrentPage = (page: number) => {
  currentPage.value = page;
}

const getQuery = computed(() => {
  const tmpObj = {};
  currentRate.value ? Object.assign(tmpObj, {rate: currentRate.value}) : '';
  currentPage.value ? Object.assign(tmpObj, {page: currentPage.value}) : '';
  currentMinPrice.value ? Object.assign(tmpObj, {minPrice: currentMinPrice.value}) : '';
  currentMaxPrice.value ? Object.assign(tmpObj, {maxPrice: currentMaxPrice.value}) : '';
  keyword.value ? Object.assign(tmpObj, {keyword: keyword.value}) : '';
  const qs = new URLSearchParams(tmpObj).toString();
  return {value: tmpObj, queryString: qs};
})

const isLoading: Ref<boolean> = ref(true);
const perPage: Ref<number> = ref(12);
let products: Ref<ProductInst[]> = ref([]);

async function getProducts(): Promise<ProductInst[]> {
  let productList:ProductInst[] = [];
  try {
    productList = await api.getProductList(getQuery.value.value);
    if (currentMinPrice.value) {
      const minPrice = currentMinPrice.value;
      productList = productList.filter((item: ProductInst) => item.sellPrice >= minPrice || item.price >= minPrice);
    }

    if (currentMaxPrice.value) {
      const maxPrice = currentMaxPrice.value;
      productList = productList.filter((item: ProductInst) => item.sellPrice <= maxPrice || item.price <= maxPrice);
    }

    if (currentRate.value) {
      const filterRate = currentRate.value;
      productList = productList.filter((item: ProductInst) => item.rating >= filterRate);
    }

    if (keyword.value) {
      const filterKeyword = keyword.value;
      productList = productList.filter((item: ProductInst) => item.name.indexOf(filterKeyword) > -1);
    }

    productList.forEach((item: ProductInst)=>{
      item.url = item.onSell ?`/${item.id}` : '';
      return item;
    });

  } catch (e) {
    console.log(e);
    alert('get ProductInst Error');
  } finally {
    isLoading.value = false;
  }
  return productList;
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

const showProductList: ComputedRef<ProductInst[]> = computed(() => {
  const pd = [...products.value];
  const begin: number = currentPage.value === 1 ? 0 : (currentPage.value - 1) * perPage.value;
  const end: number = begin + perPage.value <= pd.length ? begin + perPage.value : pd.length;
  const result = pd.slice(begin, end);
  return result;
})


</script>
<template>
  <div class="flex">
    <div class="filterPannel">
      <div class="filterPannel__container">
        <div class="filterPannel__item mb-2">
          <div class="filterPannel__title">價格</div>
          <div class="filterPannel__content">
            <div class="filterPannel__inputGroup flex">
              <input class="w-16 md:mr-1 focus:outline-none" v-model.number="currentMinPrice" type="text"
                     placeholder="$ 最小值"
                     maxlength="13"/>~
              <input class="w-16 md:ml-1 md:pl-1 focus:outline-none" v-model.number="currentMaxPrice" type="text"
                     placeholder="$ 最大值"
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
                  @click="setRateQueryObject(rate)">
                <Rating :max-rate="5" :show-rate="rate"></Rating>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <template v-if="!isLoading">
      <div class="list w-full" v-if="showProductList.length">
        <div class="list__container
                    px-8
                    grid grid-cols-2 gap-3
                    md:grid-cols-4 md:gap-3
                    mb-12">
          <div class="list__item p-2"
               v-for="product in showProductList"
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
