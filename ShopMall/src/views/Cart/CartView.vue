<script setup lang="ts">
import placeholderImage from '@/assets/images/online-shopping.png';
import {storeToRefs} from "pinia";
import {useUser} from "@/stores/user";
import {onMounted, ref, computed} from "vue";
import type {Ref} from "vue";

import router from "@/router";
import {useCart} from "@/stores/cart";
import {useDeviceDetector} from "@/compositions/useDevice";
import type {ICartItem} from "@/modal/ICart";
import {CartItem} from "../../entities/cartInst";
import NumberInput from "@/components/NumberInput.vue";

const deviceDetector = useDeviceDetector();
const userStore = useUser();
const cartStore = useCart();
const { minusProduct, removeProduct, setProduct} = useCart();

const isMobile = ref(deviceDetector.mobile);
const {isLogin} = storeToRefs(userStore);
const cartCheckout: Ref<HTMLElement | null> = ref(null);

onMounted(
    () => {
      if (!isLogin.value) {
        router.push({name: 'login'});
      }
      cart.value.forEach((item: ICartItem) => {
        item.isCheck = false;
      })
    }
)

const {cart} = storeToRefs(cartStore);

const totalCount = computed(() => {
  return {
    count: cart.value.filter((item: ICartItem) => item.isCheck).length,
    totalPrice: cart.value.filter((item: ICartItem) => item.isCheck)
        .reduce((pre: number, cur: ICartItem) => {
          return pre + cur.price * cur.quantity;
        }, 0)
  }
});

const changeQuantity = (cartItem: ICartItem, quantity: number) => {
  const item = new CartItem(
      cartItem.isCheck,
      cartItem.productId,
      cartItem.name,
      cartItem.price,
      cartItem.quantity,
      cartItem.store,
      cartItem.onSell,
      cartItem.inventory,
      cartItem.image,
      cartItem.id,
  );
  if (quantity === 0) {
    removeProduct(item);
  } else {
    item.quantity = quantity;
    setProduct(item);
  }
}

const remove = (cartItem: ICartItem) => {
  const item = new CartItem(
      cartItem.isCheck,
      cartItem.productId,
      cartItem.name,
      cartItem.price,
      cartItem.quantity,
      cartItem.store,
      cartItem.onSell,
      cartItem.inventory,
      cartItem.image,
      cartItem.id,
  );
  removeProduct(item);
}

const checkout = () => {
  const isAnyProductCheck = cart.value.some((item: ICartItem) => item.isCheck);
  if (isAnyProductCheck) {
    router.push({name: 'cartCheckout'});
  } else {
    alert('請先勾選商品，再進行結帳');
  }
}

const isCheckAll = computed({
  get: () => cart.value.every((item: ICartItem) => item.isCheck),
  set: (val) => {
    cart.value.forEach((item: ICartItem) => {
      item.isCheck = val;
    })
  }
})
</script>

<template>
  <div class="relative cart" v-if="cart.length">
    <div class="cart__list bg-gray-200 pb-4">
      <div class="flex items-center cartItem" :class="[!isMobile ? 'px-6 py-4' : 'px-2 py-1']">
        <div :class="[isMobile ? 'w-5' : 'w-10']">
          <input v-model="isCheckAll" type="checkbox">
        </div>
        <div class="w-20 flex-none" :class="[isMobile ? 'mr-0' : 'mr-10']"></div>
        <div v-show="!isMobile" class="flex-1 flex items-center">
          <div class="w-full">
            商品
          </div>
          <div class="w-full">
            單價
          </div>
          <div class="w-full">
            數量
          </div>
          <div class="w-20">
          </div>
        </div>
      </div>
      <div class="flex items-center cartItem" v-for="cartItem in cart" :key="cartItem.productId">
        <div :class="[!isMobile ? 'px-6 py-4' : 'px-2 py-1']">
          <input v-model="cartItem.isCheck" type="checkbox">
        </div>
        <div class="w-20 h-20 flex-none" :class="[isMobile ? 'mr-0' : 'mr-10']">
          <img :src="cartItem.image?cartItem.image:placeholderImage" alt="" class="object-contain w-full h-full">
        </div>
        <div class="flex-1 flex items-center" :class="{'flex-col':isMobile}">
          <div class="w-full flex justify-between items-center">
            <div class="text-base">
              {{ cartItem.name }}
            </div>
            <div v-show="isMobile">
              <button class="p-2" type="button" @click="remove(cartItem)">
                <font-awesome-icon icon="fa-solid fa-trash"/>
              </button>
            </div>
          </div>
          <div class="w-full text-base">
            ${{ cartItem.price }}
          </div>
          <div class="w-full" :class="[isMobile? 'h-10' : 'h-14']">
            <NumberInput
                :model-value="cartItem.quantity"
                @update:modelValue="changeQuantity(cartItem, $event as number)"
                :is-show-button="true"
                :min-value="1"
                :max-value="cartItem.inventory"
            />
          </div>
          <div class="w-20" v-show="!isMobile">
            <button class="p-2" type="button" @click="remove(cartItem)">
              <font-awesome-icon icon="fa-solid fa-trash"/>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div ref="cartCheckout" class="cart__checkout sticky bottom-0 left-0 w-full bg-gray-700">
      <div class="flex flex-col items-end p-2">
        <div class="text-white mb-4 text-base">
          總金額（共 {{ totalCount.count }} 種商品）：$ {{ totalCount.totalPrice }}
        </div>
        <button type="button" class="rounded px-3 py-1 bg-white" @click="checkout">
          結帳
        </button>
      </div>
    </div>
  </div>
  <div class="h-full" v-else>
    <div class="flex flex-col justify-center items-center h-full">
      <p class="text-gray-300 text-3xl mb-4">購物車是空的</p>
      <RouterLink class="text-2xl border-2 rounded-2xl bg-gray-600 text-white p-2" :to="{path: '/'}">
        <span class="hover:translate-x-3">></span>
        <span>點此前往選購</span>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped lang="scss">

</style>
