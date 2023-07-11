<script setup lang="ts">
import {reactive, ref, onMounted} from "vue";
import type {Ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import ProductInst from "../../entities/productInst";
import {CartItem} from "../../entities/cartInst";
import StoreInst from "../../entities/storeInst";

import api from '@/api/api';
import PreviewImage from "@/components/PreviewImage.vue";
import Rating from "@/components/Rating.vue";
import NumberInput from "@/components/NumberInput.vue";
import {useDeviceDetector} from "@/compositions/useDevice";
import {useUser} from "@/stores/user";
import {useCart} from "@/stores/cart";

const route = useRoute();
const router = useRouter();
const pid: number = parseInt(route.params.id as string);
const isLoading: Ref<boolean> = ref(true);
const deviceDetector = useDeviceDetector();
const isMobile: Ref<boolean> = ref(deviceDetector.mobile);
const {isLogin} = useUser();
const {addProduct} = useCart();

const addCartCount: Ref<number> = ref(1);

let product: ProductInst = reactive(new ProductInst(
    0,
    '',
    0,
    0,
    0,
    0,
    new StoreInst(0, '', 0, '', ''),
    false,
    0,
    '',
    '',
));

onMounted(async () => {
  try {
    const productDetail: ProductInst = await api.getProductDetail(pid);

    if (productDetail) {
      product = productDetail;
      if (!product.onSell) {
        alert('Not On Sell');
        await router.replace({name: 'productList'});
      }
    } else {
      await router.replace({name: 'notFound'});
    }
  } catch (e) {
    console.log(e);
    alert('Get Error');
    await router.replace({name: 'notFound'});
  } finally {
    isLoading.value = false;
  }
})

const addProductToCart = async () => {
  if (!isLogin) {
    await router.push({name: 'login', query: {redirect: route.path}});
    return;
  }

  if (product.inventory === 0) {
    alert('No Inventory');
    return;
  }
  try{
    await addProduct(new CartItem(
        false,
        product.id,
        product.name,
        product.sellPrice,
        addCartCount.value,
        new StoreInst(product.store.id,
            product.store.name,
            product.store.rating,
            product.store.description,
            product.store.image,),
        product.onSell,
        product.inventory,
        product.image,
    ));
    alert('加入購物車成功');
  } catch(e: any) {
    alert(e.message);
    //await router.push('/');
  }
}

</script>
<template>
  <div class="product__container
              grid grid-cols-1
              md:grid-cols-2
              md:gap-6" v-if="!isLoading">
    <div class="product__head
                flex
                items-center
                justify-center
                p-1
                rounded
                bg-gray-50">
      <div class="w-full md:w-7/12">
        <PreviewImage
            :title="product.name"
            :isLazyLoading="true"
            :img="product.image"
            :preview="!isMobile && !!product.image"
        />
      </div>
    </div>
    <div class="product__info flex flex-col" :class="{'mb-4': isMobile}">
      <div class="mb-4 info__head">
        <h2 class="product__title text-3xl mb-2">
          {{ product.name }}
        </h2>
        <div class="flex items-center mb-3">
          <template v-if="product.rating > 0">
            <span class="mr-2">評價：</span>
            <span class="mr-2">{{ product.rating }}</span>
            <Rating :max-rate="5" :show-rate="product.rating"/>
          </template>
          <span v-else>未有評價</span>
        </div>
        <div class="product__price p-4">
          <span v-if="product.price > product.sellPrice"
                class="line-through mr-1 text-gray-400">
            ${{ product.price }}
          </span>
          <span class="text-gray-950 text-2xl">
            ${{ product.sellPrice }}
          </span>
        </div>
      </div>
      <div class="info__body">
        <div class="cart">
          <div class="flex items-center h-11">
            <NumberInput :min-value="1" :max-value="product.inventory" v-model:modelValue="addCartCount"/>
            <div class="product__inventory h-full flex items-center text-gray-400">
              <span>
                庫存：
              </span>
              <span>
                {{ product.inventory }}
              </span>
            </div>
          </div>
          <div class="cart__msg" v-show="addCartCount===product.inventory">
            <span class="text-red-500">已達到購買上限</span>
          </div>
          <button class="rounded px-5 py-3 py-1 bg-gray-700 text-white mt-4"
                  :disabled="product.inventory <= 0"
                  @click="addProductToCart">
            加入購物車
          </button>
        </div>
      </div>
    </div>

    <div class="store
                bg-gray-50
                md:col-span-2
                p-4
                rounded">
      <div class="store__info flex">
        <div class="store__head mr-4">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-white p-2 border-2">
            <img v-if="product.store.image"
                 :src="product.store.image"
                 :alt="product.store.name">
            <font-awesome-icon v-else icon="fa-solid fa-store" class="w-full h-full"/>
          </div>
        </div>
        <div class="store__body flex flex-col justify-center">
          <div class="store__name">
            <h3><span class="mr-3">店家名稱：</span>{{ product.store.name }}</h3>
          </div>
          <div class="store__rating flex items-center">
            <span class="mr-3">店家評價：</span>
            <span class="flex items-center">
              {{ product.store.rating }}
              <Rating class="ml-2" :max-rate="1" :show-rate="1"/>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="product__detail
                md:col-span-2
                min-h-min
                bg-gray-50
                p-4
                rounded">
      <h3 class="text-2xl mb-2">商品詳情</h3>
      <div class="product__content flex justify-center p-4" v-if="product.description">
        <div v-html="product.description"></div>
      </div>
      <div class="product__content product__content-empty flex justify-center items-center" v-else>
        <p class="text-gray-300 text-3xl">暫無詳情</p>
      </div>

    </div>
  </div>
</template>
<style scoped lang="scss">
.product__content {
  min-height: 200px;
}
</style>
