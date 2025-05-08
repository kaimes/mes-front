<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
    @update:model-value="handleChoose"
    :label="label"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-file-document-refresh"
    append-inner-icon="mdi-magnify"
    item-title="code"
    item-value="id"
    return-object
    :hide-details="hideDetails"
    density="default"
    variant="underlined"
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
import {formatCode} from "@/util/util";

const searching = ref(false);
const items = ref([]);
let cache = [];
const emit = defineEmits(["update:value", "change"]);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: "",
  },
  rules: {
    type: Array,
    default: [],
  },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: "Defect Reason",
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "Please select Defect reason",
  },
  type: {
    type: String,
    default: undefined
  },
});

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit("update:value", val);
  },
});

const handleSearch = async (val) => {
  if (val) {
    // 处理如果包含- 就阻止去搜索
    if (val.includes("-")) {
      return;
    }
    searching.value = true;
    const params = {
      q: val,
      page: 1,
      itemsPerPage: 20,
      sortBy: ["updated_at"],
      descending: [false],
    };

    if (props.type) {
      params['fields'] = ['type']
      params['ops'] = ['eq']
      params['values'] = [props.type]

    }

    try {
      const { status, data } = await API.get("/defect_reason/", {
        params:params
      });
      if (status === 200) {
        items.value = (data.items || []).map(item => ({
          ...item,
          code: formatCode(item.code, item.name)
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
};
const getData = async () => {
  const params = {
      page: 1,
      itemsPerPage: 20,
      sortBy: ["updated_at"],
      descending: [false],
    };

    if (props.type) {
      params['fields'] = ['type']
      params['ops'] = ['eq']
      params['values'] = [props.type]

    }
  const { status, data } = await API.get("/defect_reason/", {
    params:params
  });
  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
      code: formatCode(item.code, item.name)
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
</script>
<style scoped>
</style>