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
import {find, includes} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';


const formatCode = (code, name) => {
    if (!name) {
        return code;
    }
    return `${code}x${name}`;
}

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
  /** 年份 */
  rules: {
    type: Array,
    default: []
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
    default: 'Semi Size Code'
  },
  semi_size: {
    type: Object,
  },
  placeholder: {
    type: String,
    default: 'Please select code'
  },
  type:{
    type: String,
    default: 'code'
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

const handleSearch = async (val) => {
  if (val) {
    if (val.includes("-")) {
      return;
    }
    searching.value = true;
    try {
      const { status, data } = await API.get("/semi_size/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: -1,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      if (status === 200) {
        items.value = (data.items || []).map(item => ({
          ...item,
          code: formatCode(item.width_mm, item.thick_mm)
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

const getData = async () => {
  const { status, data } = await API.get("/semi_size/", {
    params: {
      page: 1,
      itemsPerPage: -1,
      sortBy: ["updated_at"],
      descending: [false],
    },
  })
  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
      code: formatCode(item.width_mm, item.thick_mm)
    }));
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id})
    if (item) {
      const rawItem = toRaw(item);
      const size = `${rawItem.width_mm} × ${rawItem.thick_mm}`;
      emit("change", { ...rawItem, size });
    }
  }
}

watch(
    () => props.semi_size,
    (value) => {
      if (!value) {
        getData();
        return;
      }
      const $items = toRaw(items.value);
      const $isExist = includes($items, { id: value.id });
      if (value && value.id && !$isExist) {
        items.value = [{
          ...value,
          code: formatCode(value.code, value.name)
        }];
      } else {
        getData();
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
