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
import { filter, includes, concat, uniqBy, findIndex, map} from "lodash";
import { computed, defineEmits, ref, toRaw, watch } from "vue";
import {toast} from "vue3-toastify";
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
  type: {
    type: String,
  },
  business_type: {
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
    default: "Please select Finished Product Code",
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

const handleSearch = async (val) => {
  if (val) {
    if (searching.value) {
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
        }, 
      });
      if (status === 200) {
        if (data.items.length > 0) {
          const $arr = concat(data.items, toRaw(items.value));
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
};

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

const getData = async () => {
  const { status, data } = await API.get("/finished_product/", { 
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    }, 
  });
  if (status === 200) {
    const $data = data.items || [];
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
</script>
<style scoped>
</style>
