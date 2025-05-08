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
const items = ref(["BWS", "Roster", "beam_mill", "scrap"])
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
    default: 'underlined'
  },
  label: {
    type: String,
    default: 'Business Type'
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
    const { data } = await API.get("/finished_product/item/stock_type")
    items.value = compact(data || []);
  } finally {
    searching.value = false;
  }
}

const handleChoose = (item) => {
  emit("change", item)
}
// 暂时写死
// getData();
</script>
<style scoped>

</style>