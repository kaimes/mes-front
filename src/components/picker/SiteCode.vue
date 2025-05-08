<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
    @update:model-value="handleChoose"
    label="Site Code"
    prepend-inner-icon="mdi-map-marker-radius-outline"
    append-inner-icon="mdi-magnify"
    :item-title="itemCode"
    :item-value="itemValue"
    :density="density"
    :variant="variant"
    auto-select-first
    :hide-details="hideDetails"
    :rules="rules"
    :loading="searching"
    :items="items"
    clearable
  ></v-autocomplete>
</template>
<script setup>
import {find, includes, some} from "lodash";
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
  semiStatus: {
    type: String,
    default: "",
  },
  area: {
    type: Object,
  },
  // 如果存在code或者变化了 则需要设置当前code的值
  code: {
    type: String,
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "Please select",
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

const handleSearch = async (val, first = false) => {
  if (val && val.length >= 1) {
    // 处理如果包含- 就阻止去搜索
    if (val.includes("-")) {
      return;
    }
    searching.value = true;
    try {
      const { status, data } = await API.get("/site/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      });
      if (status === 200 && data.items.length > 0) {
        items.value = (data.items || []).map(item => ({
          ...item,
          code: formatCode(item.code, item.desc)
        }));
        if (first) {
          emit("update:modelValue", data.items[0].id);
        }
      } else {
        items.value = cache;
      }
    } finally {
      searching.value = false;
    }
  }
};

const getData = async (val) => {
  const { status, data } = await API.get("/site/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  });
  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
      code: formatCode(item.code, item.desc)
    }));
    items.value = $data;
    cache = $data;
  }
};

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id });
    if (item) {
      emit("change", item);
    }
  }else{
    emit("change", id);
  }
};

// 该代码仅仅用于semi detail页面
watch(() => props.semiStatus, (val) => {
  if (!val) {
    return;
  }
  if (val === "scrapped") {
    handleSearch("sc", true);
  } else {
    emit("update:modelValue", undefined);
    items.value = cache;
  }
})

watch(
    () => props.area,
    async (value) => {
      const $items = toRaw(items.value);
      if ($items.length === 0) {
        await getData();
      }
      const $isExist = some($items, { id: value?.id });
      if (value && value.id && !$isExist) {
        const item = toRaw(value);
        items.value = [
          ...$items,
          {
            ...item,
            code: formatCode(item.code, item.desc)
          }
        ];
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
