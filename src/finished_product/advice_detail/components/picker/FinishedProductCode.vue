<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
    @update:model-value="handleChoose"
    @click:clear="handleClear"
    label="Finished Product Code"
    prepend-inner-icon="mdi-file-document-refresh"
    append-inner-icon="mdi-magnify"
    :item-title="itemCode"
    :item-value="itemValue"
    :hide-details="hideDetails"
    :density="density"
    :variant="variant"
    :rules="rules"
    :loading="searching"
    :items="items"
    clearable
    multiple
  ></v-autocomplete>
</template>
<script setup>
import { find } from "lodash";
import {computed, defineEmits, getCurrentInstance, ref, toRaw, watch} from "vue";
import API from "@/api";

const {proxy} = getCurrentInstance();
const searching = ref(false);
const items = ref([]);
let cache = [];
const emit = defineEmits(["update:value", "change"]);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
  type: [String, Number, Array], // 允许数组
  default: () => [],
},
  type: {
    type: String,
  },
  itemValue: {
    type: String,
    default: "id",
  },
  itemCode: {
    type: String,
    default: "code",
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
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  finished_product: {
    type: Object,
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "请选择",
  },
});

const valueId = computed({
  get: () => props.value || [],
  set: (val) => {
    emit("update:value", val); // 多选时 val 是一个数组
  },
});


const handleSearch = async (val) => {
  if (val && val.length >= 1) {
    if (val.includes("-")) {
      return;
    }
    searching.value = true;
    try {
      const { status, data } = await API.get("/finished_product/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 5,
          sortBy: ["updated_at"],
          descending: [false],
          fields: props.type ? ["status", "status", "order_item_id", "order_id"] : ["status", "status", "order_item_id"],
          ops: props.type ? ["!=", "is_null", "is_not_null", "eq"] : ["!=", "is_null", "is_not_null"],
          values: props.type ? ["dispatched", true, true, props.type] : ["dispatched", true, true],
          filter_type: "custom"
        },
      });
      if (status === 200) {
        items.value = data.items;
      } else {
        items.value = [];
      }
    } finally {
      searching.value = false;
    }
  } else {
    if (items.value.length === 0) {
      items.value = cache;
    }
  }
};

const getData = async () => {
  const { status, data } = await API.get("/finished_product/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
      fields: props.type ? ["status", "status", "order_item_id", "order_id"] : ["status", "status", "order_item_id"],
      ops: props.type ? ["!=", "is_null", "is_not_null", "eq"] : ["!=", "is_null", "is_not_null"],
      values: props.type ? ["dispatched", true, true, props.type] : ["dispatched", true, true],
      filter_type: "custom"
    },
  });
  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
      code: item.code
    }));
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
  
};

const handleClear = () => {
  items.value = cache;
}

const handleChoose = (ids) => {
  if (Array.isArray(ids) && ids.length > 0) {
    const selectedItems = ids.map(id => find(items.value, { id })).filter(Boolean);
    emit("change", selectedItems);
  } else {
    emit("change", []); 
  }
};


getData();
</script>
<style scoped>
</style>
