<template>
  <v-autocomplete
      v-model="valueId"
      @update:search="handleSearch"
      @update:model-value="handleChoose"
      @click:clear="handleClear"
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
import {find, includes, some} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';
import {getOrderLast} from "@/util/util";

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
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  itemTitle: {
    type: String,
    default: 'order_code'
  },
  label: {
    type: String,
    default: 'Order Number'
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please select Order Number'
  },
  length: {
    type: Number,
    default: 6,
  },
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
    searching.value = true;
    try {
      const {status, data} = await API.get("/order/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      if (status === 200) {
        items.value = (data.items || []).map(item => ({
          ...item,
          [props.itemTitle]: getOrderLast(item[props.itemTitle], props.length),
        }));
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
}

const handleClear = () => {
  emit('update:value', undefined);
  if (cache.length !== 0) {
    items.value = cache;
  }
}

const getData = async () => {
  const {status, data} = await API.get("/order/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  })
  if (status === 200) {
    const $items = (data.items || []).map(item => ({
      ...item,
      [props.itemTitle]: getOrderLast(item[props.itemTitle], props.length),
    }));
    items.value = $items
    cache = $items;
  } else {
    items.value = [];
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

watch(
  () => props.order,
  async (value) => {
    const $items = toRaw(items.value);
    if ($items.length === 0) {
      await getData();
    }
    if (value && value.id) {
      const item = toRaw(value);
      // 处理后6位
      item[props.itemTitle] = getOrderLast(item[props.itemTitle], props.length);
      const $isExistItems = some($items, {id: value?.id});
      const $isExistCache = some(cache, {id: value?.id});
      if (!$isExistItems) {
        items.value = [
          ...$items,
          item,
        ];
      }
      if (!$isExistCache) {
        cache = [
          ...cache,
          item,
        ];
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

getData();
</script>
<style scoped>

</style>
