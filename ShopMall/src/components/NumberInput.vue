<script setup lang="ts">
import {onMounted, ref, computed} from 'vue';

interface Props {
  modelValue: number | null,
  isShowButton: boolean,
  maxValue?: number | undefined,
  minValue?: number | undefined,
  maxLength?: number | undefined,
  placeholder?: string,
}

let props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  maxValue: undefined,
  minValue: undefined,
  maxLength: undefined,
  placeholder: '',
  isShowButton: true,
});

const modelValue = ref(props.modelValue);

const maxLength = ref(props.maxLength);
onMounted(() => {
  if (props.maxLength) {
    if (props.maxValue) {
      maxLength.value = props.maxValue.toString().length;
    }
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void,
}>()

const btnEvent = (value: number) => {
  let defaultValue = parseInt(modelValue.value?.toString() || '', 10);
  if (isNaN(defaultValue)) {
    defaultValue = 0;
  }
  if (props.minValue === undefined && props.maxValue === undefined) {
    defaultValue += value;
    modelValue.value = defaultValue;
    emit('update:modelValue', modelValue.value);
    return;
  }

  if (props.maxValue && value > 0) {
    if ((defaultValue + value) <= props.maxValue) {
      defaultValue += value;
      modelValue.value = defaultValue;
      emit('update:modelValue', modelValue.value);
    }
    return;
  }

  if (props.minValue && value < 0) {
    if ((defaultValue + value) >= props.minValue) {
      defaultValue += value;
      modelValue.value = defaultValue;
      emit('update:modelValue', modelValue.value);
    }
    return;
  }
}

const filterNum = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.value = target.value.replace(/[^0-9]+/g, '');
  const maxVal = parseInt(props.maxValue?.toString()||'', 10);
  const minVal = parseInt(props.minValue?.toString()||'', 10);
  const newVal = parseInt(target.value, 10);
  console.log(newVal);
  if (isNaN(newVal)) {
    if (minVal) {
      target.value = minVal.toString();
    } else {
      target.value = '';
    }
  } else {
    if (newVal>maxVal){
      target.value = maxVal.toString();
    }
    if (newVal<minVal){
      target.value = minVal.toString();
    }
  }

  if (target.value != '') {
    modelValue.value = parseInt(target.value, 10);
  } else {
    modelValue.value = null;
  }
  emit('update:modelValue', modelValue.value);
}

</script>

<template>
  <div class="numRange h-full flex items-center">
    <button class="rounded px-2 h-full text-2xl"
            :class="{'hidden': !isShowButton}"
            @click="btnEvent(-1)">
      -
    </button>
    <input type="text"
           class="flex-1 w-full text-center h-full border-2 focus:outline-none"
           :class="{'mx-2': isShowButton}"
           :min="props.minValue"
           :max="props.maxValue"
           :maxlength="maxLength"
           :placeholder="props.placeholder"
           @input="filterNum"
           :value = "modelValue"/>
    <button class="rounded px-2 h-full text-2xl"
            :class="{'hidden': !isShowButton}"
            @click="btnEvent(1)">
      +
    </button>
  </div>
</template>

<style scoped lang="scss">

</style>
