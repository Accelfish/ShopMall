<script setup lang="ts">
import PreviewImage from "@/components/PreviewImage.vue";

interface ICard {
  title: string,
  url: string,
  isZoomImg: boolean,
  img?: string,
  useGrayPreviewImage?: boolean,
  isLazyLoading?: boolean,
}

const props = withDefaults(defineProps<ICard>(), {
  title: '',
  img: '',
  isZoomImg: false,
  isLazyLoading: true,
  useGrayPreviewImage: false,
});


</script>
<template>
  <RouterLink class="link flex justify-center" :to="url" v-if="url">
    <div class="card group">
      <div class="card__head">
        <slot name="head">
          <div class="card__img" :class="{'group-hover:scale-150 transition ease-in-out duration-200': isZoomImg}">
            <PreviewImage
                :isLazyLoading=props.isLazyLoading
                :title="props.title"
                :img="props.img"
                :preview="false"
                :useGrayPreviewImage="false"
            />
          </div>
        </slot>
      </div>
      <div class="card__body">
        <slot name="body">
          <div class="card__title">
            {{ props.title }}
          </div>
        </slot>
      </div>
      <div class="card__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </RouterLink>
  <div class="flex justify-center" v-else>
    <div class="card group ">
      <div class="card__head">
        <slot name="head">
          <div class="card__img" :class="{'group-hover:scale-150 transition ease-in-out duration-200': isZoomImg}">
            <PreviewImage
                :isLazyLoading=props.isLazyLoading
                :title="props.title"
                :img="props.img"
                :preview="false"
                :useGrayPreviewImage="false"
            />
          </div>
        </slot>
      </div>
      <div class="card__body">
        <slot name="body">
          <div class="card__title">
            {{ props.title }}
          </div>
        </slot>
      </div>
      <div class="card__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.card__head {
  width: 100%;
  max-width: 200px;
  height: 100%;
  max-height: 200px;
  overflow: hidden;
}
</style>
