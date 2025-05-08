<template>
  <v-autocomplete
    v-model="valueId"
    @input="handleSearch"
    @update:model-value="handleChoose"
    @click:clear="handleClear"
    label="Children Spec"
    prepend-inner-icon="mdi-file-document-refresh"
    append-inner-icon="mdi-magnify"
    :persistent-placeholder="persistentPlaceholder"
    :item-title="itemCode"
    :item-value="itemValue"
    :hide-details="hideDetails"
    :density="density"
    :variant="variant"
    :rules="rules"
    :loading="searching"
    :items="items"
    :multiple="multiple"
    :chips="chips"
    :closable-chips="closableChips"
    clearable
  >
    <template v-slot:chip="{ props, item }">
      <v-chip
          v-bind="props"
          :text="item.raw[`${itemCode}`]"
      ></v-chip>
    </template>
  </v-autocomplete>
</template>
<script setup>
import {filter, includes, concat, uniqBy, debounce, trim} from "lodash";
import { computed, defineEmits, ref, toRaw, watch } from "vue";
import API from "@/api";

const searching = ref(false);
const items = ref([]);
let cache = [];
const emit = defineEmits(["update:modelValue", "change"]);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: Array,
    default: [],
  },
  itemValue: {
    type: String,
    default: "id",
  },
  itemCode: {
    type: String,
    default: "desc",
  },
  id: {
    type: String,
  },
  /** 年份 */
  rules: {
    type: Array,
    default: [],
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  chips: {
    type: Boolean,
    default: true,
  },
  closableChips: {
    type: Boolean,
    default: true,
  },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  persistentPlaceholder: {
    type: Boolean,
    default: false,
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "请选择",
  },
});

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit("update:modelValue", val);
  },
});

const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  if (val) {
    if (searching.value) {
      return;
    }
    searching.value = true;
    try {
      const { status, data } = await API.post("/spec/data/childrenspec", {
        spec_code: val,
        id: props.id
      });
      if (status === 200) {
        if (data.options.length > 0) {
          const $data = data.options.map(item => ({
            ...item,
            desc: item.name ? `${item.code}(${item.name})` : item.code
          }));
          const $arr = concat($data, toRaw(items.value));
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

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

const getData = async () => {
  const { status, data } = await API.post("/spec/data/childrenspec", {
    id: props.id
  });
  if (status === 200) {
    
    const $data = (data.options || []).map(item => ({
      ...item,
      desc: item.name ? `${item.code}(${item.name})` : item.code
    }));
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
};

const handleChoose = (arr) => {
  if (arr) {
    const item = filter(items.value, (o) => includes(arr, o.id));
    emit("change", item);
  }
};

getData();

watch(() => props.id, (val) => {
  if (val) {
    emit('update:modelValue', undefined)
    getData()
  }
})
</script>
<style scoped>
</style>
