<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
    @update:model-value="handleChoose"
    @click:clear="getData"
    label="Menu"
    prepend-inner-icon="mdi-file-document-refresh"

    item-title="title"
    :item-value="itemValue"
    :hide-details="hideDetails"
    :persistent-placeholder="persistentPlaceholder"
    density="default"
    variant="underlined"
    :rules="rules"
    :loading="searching"
    :items="items"
    clearable
  ></v-autocomplete>
</template>
<script setup>
import { find, some } from "lodash";
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
  /** 年份 */
  rules: {
    type: Array,
    default: [],
  },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  persistentPlaceholder: {
    type: Boolean,
    default: false,
  },
  roleID: {
    type: Number,
    default: 1,
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "Please select",
  },
  menu: {
    type: Object,
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
  if (val && val.length > 1&& props.roleID) {
    searching.value = true;
    try {
      const { status, data } = await API.get(`/menu/get_by_role/${props.roleID}`, {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 100,
          sortBy: ["updated_at"],
          descending: [false],
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
  }
};
const getData = async () => {
  if (!props.roleID) {
    return;
  }
  const { status, data } = await API.get(`/menu/get_by_role/${props.roleID}`, {
    params: {
      page: 1,
      itemsPerPage: 100,
      sortBy: ["updated_at"],
      descending: [false],
    },
  });
  if (status === 200) {
    items.value = data.items || [];
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
  } else {
    emit("change", {});
  }
};


watch(
  () => props.roleID,
  async (newRoleId) => {
    if (newRoleId) {
      await getData();
    }
  },
  { immediate: true } // 组件初始化时也执行一次
);

watch(
  () => props.menu,
  (value) => {
    const $items = toRaw(items.value);
    if (!value) {
      const test_sample = commonStore.test_sample;
      if (test_sample.id) {
        items.value = [test_sample];
      } else {
        getData();
      }
      return;
    }
    const $isExist = some($items, { id: value.id });
    if (value && value.id && !$isExist) {
      items.value = [value];
    } else {
      getData();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style scoped>
</style>
