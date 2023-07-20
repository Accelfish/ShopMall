<script setup lang="ts">
import {reactive, ref, onMounted} from "vue";
import type {Ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import ProductInst from "../../entities/productInst";
import {CartItem} from "../../entities/cartInst";
import StoreInst from "../../entities/storeInst";
import ProductIntro from "@/views/Product/ProductIntro.vue";
import ProductMessage from "@/views/Product/ProductMessage.vue";
import api from '@/api/api';
import PreviewImage from "@/components/PreviewImage.vue";
import Rating from "@/components/Rating.vue";
import NumberInput from "@/components/NumberInput.vue";
import TabsWrapper from "@/components/Tabs/TabsWrapper.vue";
import Tab from '@/components/Tabs/Tab.vue';
import StoreCard from "@/components/StoreCard.vue";

import {useDeviceDetector} from "@/compositions/useDevice";
import {useUser} from "@/stores/user";
import {useCart} from "@/stores/cart";
import ProfileIcon from "@/components/ProfileIcon.vue";
import {EProfileIcon} from "@/enum/Enums";

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
      Object.assign(product, productDetail);
      if (!product.onSell) {
        alert('Not On Sell');
        await router.replace({name: 'productList'});
      }
    } else {
      await router.replace({name: 'notFound'});
    }
  } catch (e) {
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
  try {
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
  } catch (e: any) {
    alert(e.message);
  }
}

</script>
<template>
  <div class="product__container
              grid
              grid-cols-1
              md:grid-cols-2
              md:gap-6" v-if="!isLoading">
    <div class="product__head
                flex
                items-center
                justify-center
                p-1
                rounded
                bg-gray-50">
      <div class="w-full md:w-7/12 h-full">
        <PreviewImage
            :title="product.name"
            :isLazyLoading="true"
            :img="product.image"
            :preview="!isMobile && !!product.image"
            :useGrayPreviewImage="true"
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
        <div class="product__price"
             :class="[isMobile ? 'p-0' : 'p-4']">
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
          <div class="flex"
               :class="[isMobile ? 'flex-col': 'h-11 items-center']">
            <NumberInput class="mr-4"
                         :min-value="1" :max-value="product.inventory" :is-show-button="true"
                         v-model="addCartCount"/>
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

    <div class="bg-gray-50
                md:col-span-2
                mb-4">
      <StoreCard
          :id="product.store.id"
          :name="product.store.name"
          :rating="product.store?.rating"
          :description="product.store?.description"
          :image="product.store?.image"/>
    </div>
    <div class="md:col-span-2">
      <TabsWrapper class="sticky top-24 z-50" :class="{'-mx-4':isMobile}">
        <Tab title="商品介紹" :link="{id: pid, name: 'ProductIntro'}"/>
        <Tab title="評價" :link="{id: pid, name: 'ProductMessage'}"/>
      </TabsWrapper>
      <RouterView class="md:col-span-2 min-h-[6rem]" v-slot="{Component}">
        <component :is="Component"/>
      </RouterView>
    </div>
  </div>
</template>
<style scoped lang="scss">
.product__content {
  min-height: 200px;
}
</style>
