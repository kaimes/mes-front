<template>
  <v-autocomplete
      v-model="valueId"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
      prepend-inner-icon="mdi-file-document-refresh"
      append-inner-icon="mdi-magnify"
      :hide-details="hideDetails"
      :density="density"
      :variant="variant"
      :rules="rules"
      :loading="searching"
      :items="items"
      :disabled="disabled"
      clearable
  ></v-autocomplete>
</template>
<script setup>
import { compact } from "lodash";
import {computed, defineEmits, ref} from "vue";
import API from '@/api';

const searching = ref(false);
const items = ref([])
const emit = defineEmits(['update:value', 'change']);
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
  density: {
    type: String,
    default: 'compact'
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  label: {
    type: String,
    default: 'Stock Type'
  },
  placeholder: {
    type: String,
    default: 'Please select'
  }
})

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit('update:value', val)
  }
});

const getData = async () => {
  try {
    const { data } = await API.get("/site_type/item/codes")
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