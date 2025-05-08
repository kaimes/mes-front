<template>
  <v-autocomplete
      v-model="valueId"
      @update:model-value="handleChoose"
      @input="handleSearch"
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
import {debounce, trim, find, uniqBy, some, concat} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';
import {formatCode} from "@/util/util";

const searching = ref(false);
const items = ref([])
let cache = [];
const emit = defineEmits(['update:modelValue', 'change']);
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
  order: {
    type: Object,
  },
  order_item: {
    type: Object,
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
    emit('update:modelValue', val)
  }
});

const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  if (val) {
    if (searching.value) {
      return;
    }
    searching.value = true;
    try {
        let params = {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        }
        if (props.order_id) {
          params.fields = ["order_id"];
          params.ops = ["eq"];
          params.values = [props.order_id];
        }
        const { status, data } = await API.get("/order_item/", { params })
        if (status === 200 && (data.items || []).length > 0) {
          const $arr = concat(data.items, toRaw(items.value)).map(item => ({
            ...item,
            code: formatCode(item.line_item_code, item.line_item_desc),
          }));
          items.value = uniqBy($arr, 'id');
        }
      
    } finally {
      searching.value = false;
    }
  }
}, 500)

const handleClear = () => {
  emit('update:modelValue', undefined)
  emit('change', undefined)
  items.value = cache;
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
  let params = {
    page: 1,
    itemsPerPage: 5,
    sortBy: ["updated_at"],
    descending: [false],
  }
  if (props.order_id) {
    params.fields = ["order_id"];
    params.ops = ["eq"];
    params.values = [props.order_id];
  }
  const { status, data } = await API.get("/order_item/", { params })
  if (status === 200) {
    let $data = (data.items || []).map(item => ({
      ...item,
      code: formatCode(item.line_item_code, item.line_item_desc),
    }));
    if (props.order_item?.id) {
      $data.push(toRaw(props.order_item))
    }
    $data = uniqBy($data, 'id');
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
}

watch(
    () => props.order_item,
    (value) => {
      if (!value?.id) {
        return;
      }
      const $items = toRaw(items.value);
      const $isExist = some($items, {id: value?.id});
      if (value && value.id && !$isExist) {
        const item = toRaw(value);
        items.value = [
          ...$items,
          item,
        ];
      }
    }
)

let isFirst = true;
watch(() => props.order_id, (value) => {
  if (isFirst) {
    isFirst = false;
    return;
  }
  if (value) {
    // 变化后重置当前值
    emit('update:modelValue', undefined);
    getData();
  }
});

getData();
</script>
<style scoped></style>
