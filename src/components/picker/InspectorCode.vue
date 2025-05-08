<template>
  <v-autocomplete
      v-model="valueId"
      @input="handleSearch"
      @update:model-value="handleChoose"
      @click:clear="handleClear"
      label="Inspector"
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
import {concat, debounce, find, includes, some, trim, uniqBy} from "lodash";
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
  /** 年份 */
  rules: {
    type: Array,
    default: []
  },
  persistentPlaceholder: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  itemValue: {
    type: String,
    default: 'id'
  },
  itemTitle: {
    type: String,
    default: 'code'
  },
  label: {
    type: String,
    default: 'Inspector Code'
  },
  inspector: {
    type: Object,
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

const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  if (val) {
    searching.value = true;
    try {
      const { status, data } = await API.get("/inspector/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      if (status === 200 && data.items.length > 0) {
        const $arr = concat(data.items, toRaw(items.value)).map(item => ({
          ...item,
          code: item.code
        }));
        items.value = uniqBy($arr, 'id');
      }
    } finally {
      searching.value = false;
    }
  }
}, 500);

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

const getData = async () => {
  const { status, data } = await API.get("/inspector/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [true],
    },
  })
  if (status === 200) {
    let $data = (data.items || []).map(item => ({
      ...item,
      code: item.code
    }));
    if (props.inspector?.id) {
      $data.push(toRaw(props.inspector))
    }
    $data = uniqBy($data, 'id');
    items.value = $data;
    cache = $data;
  }
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id})
    if (item) {
      emit("change", item)
    }
  }
}

watch(
    () => props.inspector,
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
