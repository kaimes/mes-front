<template>
  <v-autocomplete
      v-model="valueId"
      @click:clear="handleClear"
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
import {concat, debounce, find, includes, some, trim, uniqBy} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';
import {formatCode} from "@/util/util";
import store from '@/store'


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
    default: 'Mill Code'
  },
  mill: {
    type: Object,
  },
  placeholder: {
    type: String,
    default: 'Please select code'
  },
  defaultMill: {
    type: Boolean,
    default: true
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

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

const handleSearch = debounce(async (e) => {
  const val = trim(e);
  if (val) {
    searching.value = true;
    try {
      const { status, data } = await API.get("/mill/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      if (status === 200) {
        if (data.items.length > 0) {
          const $arr = concat(data.items, toRaw(items.value)).map(item => ({
            ...item,
            code: formatCode(item.code, item.desc)
          }));
          items.value = uniqBy($arr, 'id');
        }
      } else {
        emit('update:modelValue', undefined);
        items.value = cache;
      }
    } finally {
      searching.value = false;
    }
  }
}, 500);

const getData = async () => {
  const { status, data } = await API.get("/mill/", {
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
      code: formatCode(item.code, item.desc)
    }));
    items.value = $data;
    cache = $data;
    // 默认选中当前用户的mill
    if (props.defaultMill && !valueId.value){
      const defaultMillId = localStorage.getItem('defaultMillId') || store.state.auth?.userInfo?.current_mill_id;
      if (defaultMillId  && !props.mill?.id) {
        valueId.value =parseInt(defaultMillId)
      } else {
        valueId.value = items.value[0]?.id;
      }
    }
  } else {
    items.value = [];
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
    () => props.mill,
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
