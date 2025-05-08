<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
    @update:model-value="handleChoose"
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
    clearable
  ></v-autocomplete>
</template>
<script setup>
import { find, includes } from "lodash";
import { computed, defineEmits, ref, toRaw, watch } from "vue";
import API from "@/api";
import useCommonStore from "@/app/common";
import {formatCode} from "@/util/util";

const commonStore = useCommonStore();
const searching = ref(false);
const items = ref([]);
let cache = [];
const emit = defineEmits(["update:modelValue", "change"]);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: "",
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
    default: "请选择",
  },
  runout_id: {
    type: Number,
    default: null,
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
  if (val && val.length >= 1) {
    if (val.includes("-")) {
      return;
    }
    searching.value = true;
    const params= {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
    };
    if (props.runout_id) {
      params.fields = ['runout_id']
      params.ops = ['eq']
      params.values = [props.runout_id]
    }
    try {
      const { status, data } = await API.get("/finished_product/", {params});
      if (status === 200) {
        items.value = data.items;
      } else {
        items.value = [];
      }
    } finally {
      searching.value = false;
    }
  } else {
    emit('update:modelValue', undefined)
    items.value = cache;
  }
};

const getData = async () => {
  const params= {
      page: 1,
      itemsPerPage: 20,
      sortBy: ["updated_at"],
      descending: [false],
    };
    if (props.runout_id) {
      params.fields = ['runout_id']
      params.ops = ['eq']
      params.values = [props.runout_id]
    }
  const { status, data } = await API.get("/finished_product/", { params});
  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
      code: item.code
    }));
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
};

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id });
    if (item) {
      emit("change", item);
    }
  }
};

getData();

watch(() => props.runout_id, (val) => {
  getData()
})
</script>
<style scoped>
</style>
