<script setup lang="ts">
import {storeToRefs} from "pinia";
import { useUser } from "@/stores/user";
import {onMounted} from "vue";
import router from "@/router";
import {useCart} from "@/stores/cart";
import type {ICart, ICartItem} from "@/modal/ICart";


const userStore = useUser();
const cartStore = useCart();
const {user, isLogin} = storeToRefs(userStore);

if(!userStore.isLogin){
  router.push({name: 'login'});
}

const {cart} = storeToRefs(cartStore);
const add = (cartItem: ICartItem) => {
  cartStore.addProduct({
    productId: cartItem.productId,
    name: cartItem.name,
    price: cartItem.price,
    quantity: 1,
  });
}

const minus = (cartItem: ICartItem) => {
  cartStore.minusProduct(cartItem, 1);
}

const remove = (cartItem: ICartItem) => {
  cartStore.removeProduct(cartItem);
}
</script>

<template>
  <div class="bg-gray-200" v-for="cartItem in cart" :key="cartItem.productId">
    <div>{{cartItem.name}}</div>
    <div>${{cartItem.price}}</div>
    <div>數量: {{cartItem.quantity}}</div>
    <div><button @click="add(cartItem)">add</button></div>
    <div><button @click="minus(cartItem)">minus</button></div>
    <div><button @click="remove(cartItem)">remove</button></div>
  </div>
</template>

<style scoped lang="scss">

</style>
