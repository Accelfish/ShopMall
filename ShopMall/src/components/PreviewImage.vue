<script setup lang="ts">
import placeholderImage from '@/assets/images/online-shopping.png';
import {computed, reactive, watch, ref, onMounted} from 'vue';
import type {Ref} from 'vue'
import useCursorPosinEle from "@/compositions/useCursorPosinEle";

interface IPreviewImg {
  isLazyLoading: boolean,
  title: string,
  img?: string,
  preview?: boolean,
}

const handleReplaceLazyLoadingImage = function (event:Event) {
  const target = event.target as HTMLImageElement;
  target.src = placeholderImage;
  target.onerror = null;
}


const props = withDefaults(defineProps<IPreviewImg>(), {
  img: placeholderImage,
  title: '',
  isLazyLoading: false,
  preview: true,
});

const pos = reactive({
  top: 0,
  left: 0,
});

const zoomZonePos = reactive({
  top: 0,
  left: 0,
});

const DEFAULT_ZOOM_ZONE_SIZE = 400;

const zoomZoneSize = reactive({
  width: DEFAULT_ZOOM_ZONE_SIZE,
  height: DEFAULT_ZOOM_ZONE_SIZE,
});

const imgContainerSize = reactive({
  width: 0,
  height: 0,
});

const zoomViewSize = reactive({
  width: 300,
  height: 300,
});

const isShowZoomContainer = ref(false);

const zoomContainer: Ref<HTMLElement | null> = ref(null);
const imgTarget: Ref<HTMLElement | null> = ref(null);
const imgContainer: Ref<HTMLElement | null> = ref(null);

const defaultRatio: Ref<number> = ref(1);
onMounted(() => {
  defaultRatio.value = zoomViewSize.width / zoomZoneSize.width;
})

const ratio = computed(() => {
  return zoomViewSize.width / zoomZoneSize.width;
});

const resizeZoomZone = () => {
  if (imgTarget.value) {
    zoomZoneSize.width = zoomZoneSize.height = DEFAULT_ZOOM_ZONE_SIZE * defaultRatio.value;
    if(imgContainer.value) {
      imgContainerSize.width = imgContainer.value.clientWidth;
      imgContainerSize.height = imgContainer.value.clientHeight;
    }
  }
}

const UpdZoomZoneSize = (event:WheelEvent) => {
  if (zoomZoneSize.width + event.deltaY * 0.01 <= imgContainerSize.width
      && zoomZoneSize.height + event.deltaY * 0.01 <= imgContainerSize.height) {
    zoomZoneSize.width = zoomZoneSize.width += event.deltaY * 0.01;
    zoomZoneSize.height = zoomZoneSize.height += event.deltaY * 0.01;
  }
}

const moveZoomContainer = (event: MouseEvent) => {
  if (event && zoomContainer.value) {
    const data = useCursorPosinEle(zoomContainer.value, event);
    pos.left = data.posX;
    pos.top = data.posY;
    isShowZoomContainer.value = true;
  }
}

const mouseLeaveZoomContainer = () => {
  isShowZoomContainer.value = false;
};

watch([pos, zoomZoneSize], (newVal, oldVal) => {
  if (imgTarget.value) {
    let x = pos.left - (zoomZoneSize.width / 2);
    let y = pos.top - (zoomZoneSize.height / 2);
    if (x > imgTarget.value.clientWidth - zoomZoneSize.width) {
      x = imgTarget.value.clientWidth - zoomZoneSize.width;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > imgTarget.value.clientHeight - zoomZoneSize.height) {
      y = imgTarget.value.clientHeight - zoomZoneSize.height;
    }
    if (y < 0) {
      y = 0;
    }
    zoomZonePos.left = x;
    zoomZonePos.top = y;
  }
})
</script>

<template>
  <div class="imgContainer
              max-w-full
              relative"
       ref="imgContainer">

    <div class="imgContainer__content"
         @mousemove="moveZoomContainer"
         @mouseleave="mouseLeaveZoomContainer"
         @wheel.prevent="UpdZoomZoneSize"
         ref="zoomContainer">
      <picture>
        <img class="imgContainer__target block m-0 "
             @error="handleReplaceLazyLoadingImage"
             @load="resizeZoomZone"
             :src="img"
             :alt="title"
             :loading="isLazyLoading? 'lazy' : 'auto'"
             ref="imgTarget"
        >
        <source :srcset="img">
      </picture>
      <div class="imgContainer__zoomZone"
           v-show="props.preview && isShowZoomContainer"
           :style="{ 'left': `${zoomZonePos.left}px`, 'top':`${zoomZonePos.top}px`,
                     'width': `${zoomZoneSize.width}px`, 'height': `${zoomZoneSize.height}px` }">
      </div>
    </div>
    <div class="imgContainer__zoomView"
         ref="zoomView"
         v-show="props.preview && isShowZoomContainer"
         :style="{'background-image': `url(${props.img})`,
         'background-repeat': 'no-repeat',
         'background-size': imgTarget ? `${imgContainerSize.width * ratio}px ${imgContainerSize.height * ratio}px` : 'auto',
         'background-position':`-${(zoomZonePos.left * ratio)}px -${(zoomZonePos.top * ratio)}px`,
         'left': `${imgContainerSize.width + 10}px`}"
    >
    </div>
  </div>
</template>

<style scoped lang="scss">
.imgContainer__zoomZone {
  width: 400px;
  height: 400px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transform: translateZ(0);
  transition: all 0s linear;
}

.imgContainer__zoomView {
  position: absolute;
  background-color: #fff;
  z-index: 1;
  top: 0;
  left: 410px;
  border: 1px solid;
  width: 300px;
  height: 300px;
}
</style>
