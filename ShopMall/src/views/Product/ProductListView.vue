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

const deviceDetector = useDeviceDetector();
const isMobile: Ref<boolean> = ref(deviceDetector.mobile);
const isLoading: Ref<boolean> = ref(true);
const perPage: Ref<number> = ref(12);
let products: Ref<ProductInst[]> = ref([]);

onBeforeRouteUpdate(async (to, from) => {
  keyword.value = to.query.keyword ? to.query.keyword as string : '';
  if(to.query.page !== from.query.page){
    setCurrentPage(to.query.page ? parseInt(to.query.page as string, 10) : 1);
  }
  if (keyword.value) {
    if (keyword.value !== from.query.keyword) {
      setCurrentPage(1);
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
  if (currentRate.value === rate) {
    currentRate.value = 0;
  } else {
    currentRate.value = rate;
  }

  updateCurrentPage(1)
}

const setPriceQueryObject = () => {
  console.log('setPriceQueryObject', currentMinPrice.value, currentMaxPrice.value)
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


async function getProducts(): Promise<ProductInst[]> {
  let productList: ProductInst[] = [];
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

    productList.forEach((item: ProductInst) => {
      item.url = item.onSell ? `/${item.id}` : '';
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
  <div class="flex" :class="{'flex-col': isMobile}">
    <div class="filterPannel bg-white">
      <div class="filterPannel__container">
        <div class="filterPannel__item mb-2" :class="{'flex flex-col': isMobile}">
          <div class="filterPannel__title">
            價格
          </div>
          <div class="filterPannel__content" :class="{'flex flex-col': isMobile}">
            <div class="filterPannel__inputGroup flex items-center">
              <div :class="[isMobile ? 'w-full': 'w-16']">
                <NumberInput
                    :class="[isMobile ? 'text-base': 'text-xs']"
                    v-model:modelValue="currentMinPrice"
                    :maxlength="13"
                    :placeholder="'$ 最小值'"
                    :isShowButton="false"/>
              </div>
              <span>～</span>
              <div :class="[isMobile ? 'w-full': 'w-16']">
                <NumberInput
                    :class="[isMobile ? 'text-base': 'text-xs']"
                    v-model:modelValue="currentMaxPrice"
                    :maxlength="13"
                    :placeholder="'$ 最大值'"
                    :isShowButton="false"/>
              </div>
            </div>
            <div class="filterPannel__button">
              <button class="rounded-md w-full my-2 px-1 py-0.5 p bg-sky-400 hover:bg-sky-500 text-white"
                      @click="setPriceQueryObject">
                套用
              </button>
            </div>
          </div>
        </div>
        <div class="border-t-2"></div>
        <div class="filterPannel__item my-2" :class="{'flex flex-col': isMobile}">
          <div class="filterPannel__title">
            評價
          </div>
          <div class="filterPannel__content">
            <ul :class="{'flex justify-between': isMobile}">
              <li class="max-w-fit block cursor-pointer mb-1"
                  :class="{'bg-amber-300': rate===currentRate,
                   'flex items-center mr-3 border-2 rounded px-2': isMobile}"
                  v-for="rate in rateRage"
                  :key="rate"
                  @click="setRateQueryObject(rate)">
                <template v-if="isMobile">
                  <span class="mr-1">{{ rate }}</span>
                  <Rating :max-rate="1" :show-rate="rate"></Rating>
                </template>
                <template v-else>
                  <Rating :max-rate="5" :show-rate="rate"></Rating>
                </template>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <template v-if="!isLoading">
      <div class="list w-full"
           :class="[isMobile ? 'mx-0':'ml-8']"
           v-if="showProductList.length">
        <div class="list__container
                    grid grid-cols-2 gap-3
                    md:grid-cols-4 md:gap-3
                    mb-12">
          <div class="list__item p-2"
               v-for="product in showProductList"
               :key="product.id">
            <Card class="h-full"
                  :title="product.name"
                  :img="product.image? product.image : ''"
                  :url="product.url ? product.url : ''"
                  :isLazyLoading="true"
                  :isZoomImg="!!product.image"
                  :useGrayPreviewImage="true">
              <template #body>
                <div class="flex flex-col justify-between">
                  <div class="card__title">
                    <div class="w-5/6 line-clamp-1">
                      {{ product.name }}
                    </div>
                  </div>
                  <div class="card__price">
                        <span v-if="product.price > product.sellPrice" class="line-through mr-1">
                          ${{ product.price }}
                        </span>
                    <span>${{ product.sellPrice }}</span>
                  </div>
                  <div class="card__rating" v-if="product?.rating > 0">
                    <Rating class="w-full" :max-rate="5" :show-rate="product?.rating"></Rating>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
        <div class="pagination__container w-full">
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
