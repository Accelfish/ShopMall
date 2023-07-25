<script setup lang="ts">
import ProductListView from "@/views/Product/ProductListView.vue";
import StoreCard from "@/components/StoreCard.vue";
import api from "@/api/api";
import {onMounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import StoreInst from "@/entities/storeInst"
const route = useRoute();
const router = useRouter();
const storeId: number = route.params.storeId ? parseInt(route.params.storeId as string, 10) : 0;

let store:StoreInst = reactive(new StoreInst(0, '', 0, '', ''));

onMounted(async () => {
  try {
    const data:StoreInst = await api.getStore(storeId);
    if (data) {
      Object.assign(store, data);
    }
  } catch (e) {
    alert('Get Error');
    await router.replace({name: 'notFound'});
  }
})

</script>

<template>
  <StoreCard
      :id="store.id"
      :name="store.name"
      :rating="store?.rating"
      :description="store?.description"
      :image="store?.image"/>
  <ProductListView/>
</template>

<style scoped lang="scss">

</style>
