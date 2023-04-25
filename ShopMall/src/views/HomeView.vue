<script setup lang="ts">
import {reactive, ref} from "vue";
import Product from "@/entities/product";
import Card from '@/components/Card.vue';

const isLoading = ref(true);
let products: Product[] = reactive([]);
try {
    products = await fetch('/data.json').then((res) => res.json());
} catch (e) {
} finally {
    isLoading.value = false;
}

</script>
<template>
    <div class="product">
        <div class="product__container" v-if="!isLoading">
            <div class="card" v-for="product in products" :key="product.id">
                <Card :title="product.name"
                      :url="product.url ? product.url : ''"
                      :price="product.sellPrice"
                      :rating="product.rating"
                      :isLazyLoading = "false"
                />
            </div>
        </div>
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

.product__list {

}

.product__card {

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
