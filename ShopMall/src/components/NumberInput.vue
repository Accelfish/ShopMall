<script setup lang="ts">
import {ref} from 'vue';

interface Props {
  modelValue: number,
  maxValue: number | undefined,
  minValue: number | undefined,
}

let props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  maxValue: undefined,
  minValue: undefined,
});

const modelValue = ref(props.modelValue);
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): number,
}>()

const btnEvent = (value: number) => {
  if (props.minValue === undefined && props.maxValue === undefined) {
    modelValue.value += value;
    emit('update:modelValue', modelValue.value);
    return;
  }

  if (props.maxValue && value > 0) {
    if ((modelValue.value + value) <= props.maxValue) {
      modelValue.value += value;
      emit('update:modelValue', modelValue.value);

    }
    return;
  }

  if (props.minValue && value < 0) {
    if ((modelValue.value + value) >= props.minValue) {
      modelValue.value += value;
      emit('update:modelValue', modelValue.value);
    }
    return;
  }
}

const filterNum = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.value = target.value.replace(/[^0-9]+/g, '');
  if (target.value === '' || target.value === '0') {
    target.value = '1';
  }

  const newVal = parseInt(target.value, 10);
  if (props.maxValue) {
    if (newVal > props.maxValue) {
      target.value = props.maxValue.toString();
    }
  } else if (props.minValue) {
    if (newVal < props.minValue) {
      target.value = props.minValue.toString();
    }
  }
  modelValue.value = parseInt(target.value, 10);
  emit('update:modelValue', modelValue.value);
}

</script>

<template>
  <div class="numRange mr-4 h-full flex items-center">
    <button class="rounded px-2 py-1 h-full text-2xl"
            @click="btnEvent(-1)">
      -
    </button>
    <input type="text"
           class="w-fit text-center mx-2 h-full border-2 focus:outline-none"
           :min="props.minValue"
           :max="props.maxValue"
           @input="filterNum($event)"
           :value="modelValue">
    <button class="rounded px-2 py-1 h-full text-2xl"
            @click="btnEvent(1)">
      +
    </button>
  </div>
</template>

<style scoped lang="scss">

</style>
