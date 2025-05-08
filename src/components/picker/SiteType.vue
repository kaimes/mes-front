<template>
  <v-autocomplete
      v-model="valueId"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
      prepend-inner-icon="mdi-sitemap-outline"
      append-inner-icon="mdi-magnify"
      :hide-details="hideDetails"
      :item-title="itemCode"
      :item-value="itemValue"
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
import {compact, includes} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';
import { param } from "jquery";

const searching = ref(false);
const items = ref([])
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: ''
  },
  //  semi 和 finished
  type: {
    type: String,
    required: true,
    validator: value => ["finished", "semi"].includes(value),
  },
  itemValue: {
    type: String,
    default: "site_type_id",
  },
  itemCode: {
    type: String,
    default: "site_type_code",
  },
  code: {
    type: String,
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
    default: 'Site Type'
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
    emit('update:modelValue', val)
  }
});

const getData = async (code) => {
  if (!props.type) {
    return;
  }
  try {
    const { data } = await API.get(`/area/item/code/site_type/${props.type}`)
    items.value = data || [];
  } finally {
    searching.value = false;
  }
}

const handleChoose = (item) => {
  emit("change", item)
}

// 监听site type code
watch(
  () => props.type,
  (value) => {
    if (value) {
      emit("update:modelValue", undefined);
      getData();
    } else {
      items.value = [];
      valueId.value = ''; // 清空 valueId
    }
  }
);

getData();

</script>
<style scoped>

</style>
