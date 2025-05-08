<template>
  <v-autocomplete
      v-model="valueId"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
      prepend-inner-icon="mdi-file-document-refresh"
      append-inner-icon="mdi-magnify"
      :hide-details="hideDetails"
      variant="underlined"
      :rules="rules"
      :loading="searching"
      :items="items"
      :disabled="disabled"
      clearable
  ></v-autocomplete>
</template>
<script setup>
import { compact } from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';

const searching = ref(false);
const items = ref([])
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: ''
  },
  /** 年份 */
  rules: {
    type: Array,
    default: []
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  spec: {
    type: Object,
  },
  label: {
    type: String,
    default: 'Product Class'
  },
  placeholder: {
    type: String,
    default: 'Please select code'
  }
})

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});

const getData = async () => {
  try {
    const { data } = await API.get("/product_class/item/codes")
    console.log("data", data)
    items.value = compact(data || []);
  } finally {
    searching.value = false;
  }
}

const handleChoose = (item) => {
  emit("change", item)
}

getData();
</script>
<style scoped>

</style>
