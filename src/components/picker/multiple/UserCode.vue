<template>
  <v-autocomplete
      v-model="valueId"
      @input="handleSearch"
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
import {filter, includes, concat, uniqBy, debounce, trim} from "lodash";
import {computed, defineEmits, ref, toRaw} from "vue";
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
  itemValue: {
    type: String,
    default: "id",
  },
  itemCode: {
    type: String,
    default: "email",
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
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "Please select",
  }
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
      const {status, data} = await API.get("/user/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 50,
          sortBy: ["email"],
          descending: [true],
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
}, 500);

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

const getData = async () => {

  const {status, data} = await API.get(
      "/user/",
      {
        params: {
          page: 1,
          itemsPerPage: 50,
          sortBy: ["email"],
          descending: [true],
        },
      },
  );
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
