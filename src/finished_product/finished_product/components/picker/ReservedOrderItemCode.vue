<template>
  <v-autocomplete
      v-model="valueId"
      @update:search="handleSearch"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
      prepend-inner-icon="mdi-file-document-refresh"
      append-inner-icon="mdi-magnify"
      :item-title="itemTitle"
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
import { find } from "lodash";
import { computed, defineEmits, ref, watch } from "vue";
import API from '@/api';
import {formatCode} from "@/util/util";

const searching = ref(false);
const items = ref([])
let cache = [];
const emit = defineEmits(['update:value', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: ''
  },
  rules: {
    type: Array,
    default: []
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  itemValue: {
    type: String,
    default: 'id'
  },
  itemTitle: {
    type: String,
    default: 'line_item_code'
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  label: {
    type: String,
    default: 'Order Item Number'
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please select Order Item Number'
  },
  order_id: Number | String
})

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit('update:value', val)
  }
});

const handleSearch = async (val) => {
  if (val) {
    // 处理如果包含- 就阻止去搜索
    if (val.includes("-")) {
      return;
    }
    searching.value = true;
    try {
      if (props.order_id !== '') {
        const params = {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
          fields: ["order_id"],
          ops: ["eq"],
          values: [props.order_id]
        }

        const { status, data } = await API.get("/order_item/", { params })
        if (status === 200) {
          items.value = (data.items || []).map(item => ({
            ...item,
            code: formatCode(item.line_item_code, item.line_item_desc),
          }));
        } else {
          items.value = [];
        }

      }
    } finally {
      searching.value = false;
    }
  } else {
    if (items.value.length === 0) {
      items.value = cache;
    }
  }
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id })
    if (item) {
      emit("change", item)
    }
  }
}

const getData = async () => {
  const params = {
    page: 1,
    itemsPerPage: 5,
    sortBy: ["updated_at"],
    descending: [false],
    fields: ["order_id"],
    ops: ["eq"],
    values: [props.order_id]
  }
  const { status, data } = await API.get("/order_item/", { params })
  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
      code: formatCode(item.line_item_code, item.line_item_desc),
    }));
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
}


watch(() => props.order_id, (value) => {
  if (value) {
    getData();
  }
});
</script>
<style scoped></style>
