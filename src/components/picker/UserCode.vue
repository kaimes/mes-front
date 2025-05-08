<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
    @update:model-value="handleChoose"
    label="Users"
    append-inner-icon="mdi-magnify"
    prepend-inner-icon="mdi-account"
    item-title="email"
    :multiple="multiple"
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

const commonStore = useCommonStore();
const searching = ref(false);
const items = ref([]);
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
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  /** 年份 */
  rules: {
    type: Array,
    default: [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  cast: {
    type: Object,
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

const handleSearch = async (val) => {
  searching.value = true;
  try {
    const { status, data } = await API.get("/user/", {
      params: {
        q: val,
        page: 1,
        itemsPerPage: 10,
        sortBy: ["email"],
        descending: [true],
      },
    });
    if (status === 200) {
      items.value = data.items || [];
    } else {
      items.value = [];
    }
  } finally {
    searching.value = false;
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
// watch(
//   () => props.cast,
//   (value) => {
//     const $items = toRaw(items.value);
//
//     const $isExist = includes($items, { id: value.id });
//     if (value && value.id && !$isExist) {
//       items.value = [value];
//     }
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );
handleSearch();
</script>
<style scoped>
</style>
