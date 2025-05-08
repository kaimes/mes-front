<template>
  <v-autocomplete
      v-model="valueId"
      @input="handleSearch"
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
      :clearable="clearable"
  ></v-autocomplete>
</template>
<script setup>
import {concat, debounce, find, some, trim, uniqBy} from "lodash";
import {computed, defineEmits, ref, unref, toRaw, watch} from "vue";
import API from '@/api';
import {formatCode} from "@/util/util";

const searching = ref(false);
const items = ref([]);
let cache = unref([]);
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  modelValue: {
    type: [Number, Array],
    default: null
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
    default: 'code'
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
    default: 'Quality Code'
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please Select Cast Quality Code'
  },
  cast: {
    type: Object,
  },
  clearable: {
    type: Boolean,
    default: true
  },
});

const valueId = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, {id})
    if (item) {
      emit("change", item)
    }
  }
}

const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  if (val) {
    searching.value = true;
    try {
      const {data, status} = await API.get("/cast/cast_quality/quality_list", {
        q: val,
        page: 1,
        itemsPerPage: 50,
        sortBy: ["updated_at"],
        descending: [false],
      })
      if (status === 200) {
        if ((data.items || []).length > 0) {
          const $data = data.items.map(item => ({
            ...item,
            code: formatCode(item.code, item.desc)
          }));
          const $arr = concat($data, toRaw(items.value));
          items.value = uniqBy($arr, 'id');
        }
      }
    } finally {
      searching.value = false;
    }
  }
}, 500)


const getData = async () => {
  searching.value = true;
  const {status, data} = await API.get("/cast/cast_quality/quality_list", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  })
  if (status === 200) {
    let $data = (data.items || []).map(item => ({
      ...item,
      code: formatCode(item.code, item.desc)
    }));
    if (props.cast?.id) {
      $data = [
        ...$data,
        toRaw(props.cast),
      ];
    }
    $data = uniqBy($data, 'id');
    items.value = $data;
    cache = $data;
  }
  searching.value = false;
}

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

watch(
    () => props.cast,
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
getData()
</script>
<style scoped>
</style>
