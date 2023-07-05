<script setup lang="ts">
import placeholderImage from '@/assets/images/online-shopping.png';
import {computed, reactive, watch, ref, onMounted, watchEffect, nextTick} from 'vue';
import type { Ref } from 'vue'
import useCursorPosinEle from "@/compositions/useCursorPosinEle";
interface IPreviewImg {
  isLazyLoading: boolean,
  title: string,
  img?: string,
  preview?: boolean,
  ratio?: number,
}
//ratio = zoomzonesize / imgsize;

const handleReplaceLazyLoadingImage = function(event: { target: { src: string; onerror: null; }; }) {
  event.target.src = placeholderImage;
  event.target.onerror = null;
}


const props = withDefaults(defineProps<IPreviewImg>(), {
  img: placeholderImage,
  title: '',
  isLazyLoading: false,
  preview: true,
  ratio: 4,
});

const pos = reactive({
  top: 0,
  left: 0,
});

const zoomZonePos = reactive({
  top: 0,
  left: 0,
});

const zoomZoneSize = reactive({
  width: 0,
  height: 0,
});

const imgContainerSize = reactive({
  width: 0,
  height: 0,
});

const isShowZoomContainer = ref(false);

const zoomContainer:Ref<HTMLElement> = ref();
const imgTarget:Ref<HTMLElement> = ref();
const imgContainer:Ref<HTMLElement> = ref();


onMounted(()=>{})

const resizeZoomZone = ()=>{
  if(imgTarget.value) {
    zoomZoneSize.width = imgTarget.value ? imgTarget.value.clientWidth / props.ratio : 0;
    zoomZoneSize.height = imgTarget.value ? imgTarget.value.clientHeight / props.ratio : 0;
    imgContainerSize.width = imgContainer.value.clientWidth;
    imgContainerSize.height = imgContainer.value.clientHeight;
  }
}

const UpdzoomZoneSize = () => {
  zoomZoneSize.width = zoomZoneSize.width += event.deltaY * -0.01;
  zoomZoneSize.height = zoomZoneSize.height += event.deltaY * -0.01;
}

const moveZoomContainer = () => {
  if(event && zoomContainer.value) {
    const data = useCursorPosinEle(zoomContainer.value, event);
    pos.left = data.posX;
    pos.top = data.posY;
    isShowZoomContainer.value = true;
  }
}

const mouseLeaveZoomContainer = () => isShowZoomContainer.value = false;

watch(pos, (newVal, oldVal) => {
  if(imgTarget.value){
    let x = pos.left - (zoomZoneSize.width/2);
    let y = pos.top - (zoomZoneSize.height/2);
    if(x > imgTarget.value.clientWidth - zoomZoneSize.width){
      x = imgTarget.value.clientWidth - zoomZoneSize.width;
    }
    if (x < 0) {x = 0;}
    if(y > imgTarget.value.clientHeight - zoomZoneSize.height){
      y = imgTarget.value.clientHeight - zoomZoneSize.height;
    }
    if (y < 0) {y = 0;}
    zoomZonePos.left = x;
    zoomZonePos.top = y;
  }
})


</script>

<template>
  <div class="imgContainer
              max-w-full
              border-2
              relative"
        ref="imgContainer">
    <div class="imgContainer__content"
         @mousemove="moveZoomContainer"
         @mouseleave="mouseLeaveZoomContainer"
         ref="zoomContainer">
      <picture>
        <img class="imgContainer__target block m-0"
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
           @wheel.prevent="UpdzoomZoneSize"
           v-show="props.preview && isShowZoomContainer"
           :style="{ 'left': `${zoomZonePos.left}px`, 'top':`${zoomZonePos.top}px`,
                     'width': `${zoomZoneSize.width}px`, 'height': `${zoomZoneSize.height}px` }">
      </div>
    </div>
    <div class="imgContainer__zoomView"
         v-show="props.preview && isShowZoomContainer"
         :style="{'background-image': `url(${props.img})`,
         'background-size': imgTarget ? `${imgTarget.clientWidth * props.ratio}px ${imgTarget.clientHeight * props.ratio}px` : 'auto',
         'background-position':`-${(zoomZonePos.left * props.ratio)}px -${(zoomZonePos.top * props.ratio)}px`,
         'left': `${imgContainerSize.width + 10}px`}"
    >
    </div>
  </div>
</template>

<style scoped lang="scss">
.imgContainer {
}

.imgContainer__target{}

.imgContainer__content{}

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
  top: 0;
  left: 410px;
  border: 1px solid;
  width: 300px;
  height: 300px;
}
</style>
