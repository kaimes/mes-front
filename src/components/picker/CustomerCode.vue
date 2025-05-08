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
      :persistent-placeholder="persistentPlaceholder"
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
    default: 'name'
  },
  customer: {
    type: Object,
  },
  label: {
    type: String,
    default: 'Customer'
  },
  /**输入框内部的文字 */
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

const handleSearch = async (val) => {
  if (val) {
    searching.value = true;
    try {
      const { data } = await API.get("/customer/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      items.value = data.items || [];
    } finally {
      searching.value = false;
    }
  } else {
    if (items.value.length === 0) {
      items.value = cache;
    }
  }
}

const getData = async (item) => {
  const { data } = await API.get("/customer/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  })
  let $value = data.items || [];
  if (item) {
    items.value = [...$value, item];
  } else {
    items.value = $value;
  }
  cache = $value;
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id})
    if (item) {
      emit("change", item)
    }
  }else{
    emit("change", id)
    getData()
  }
}

watch(
    () => props.customer,
    (value) => {
      if (!value) {
        getData();
        return;
      }
      const $items = toRaw(items.value);
      const $isExist = some($items, { id: value.id });
      if (value && value.id && !$isExist) {
        items.value = [...$items, value];
      } else {
        getData(value);
      }
    },
    {
      immediate: true,
      deep: true
    }
)
</script>
<style scoped>

</style>
