<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
    @update:model-value="handleChoose"
    label="Section Type"
    prepend-inner-icon="mdi-file-document-refresh"
    append-inner-icon="mdi-magnify"
    item-title="code"
    :item-value="itemValue"
    :hide-details="hideDetails"
    :density="density"
    :variant="variant"
    :rules="rules"
    :loading="searching"
    :items="items"
    clearable
  ></v-autocomplete>
</template>
<script setup>
import {find, includes, some} from "lodash";
import { computed, defineEmits, ref, toRaw, watch } from "vue";
import API from "@/api";

const searching = ref(false);
const items = ref([]);
let cache = [];
const emit = defineEmits(["update:modelValue", "change"]);
const props = defineProps({
  /**当前双向数据绑定的值 */
  modelValue: {
    type: [String, Number],
    default: "",
  },
  itemValue: {
    type: String,
    default: "id",
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  /** 年份 */
  rules: {
    type: Array,
    default: [],
  },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  product_category: {
    type: Object,
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "Please select",
  },
});

const valueId = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit("update:modelValue", val);
  },
});

const handleSearch = async (val) => {
  if (val && val.length >= 1) {
    searching.value = true;
    try {
      const { status, data } = await API.get("/product_category/cate/get", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      });
      if (status === 200) {
        items.value = data.items || [];
      } else {
        items.value = [];
      }
    } finally {
      searching.value = false;
    }
  } else {
    emit('update:modelValue', undefined)
    items.value = cache;
  }
};

const getData = async () => {
  const { status, data } = await API.get("/product_category/cate/get", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  });
  if (status === 200) {
    items.value = data.items || [];
    cache = data.items || [];
  } else {
    items.value = [];
  }
};

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id });
    if (item) {
      emit("change", item);
    }
  }else{
    emit("change", id);
    getData();
  }
};
watch(
  () => props.product_category,
  (value) => {
      if (!value) {
        getData();
        return;
      }
      const $items = toRaw(items.value);
      const $isExist = some($items, { id: value.id });
      if (value && value.id && !$isExist) {
        items.value = [{
          ...value,
        }];
      } else {
        getData();
      }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style scoped>
</style>
