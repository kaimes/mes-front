<template>
  <v-autocomplete
    v-model="valueId"
    @input="handleSearch"
    @update:model-value="handleChoose"
    @click:clear="handleClear"
    label="Cast Code"
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
import {concat, debounce, find, some, trim, uniqBy} from "lodash";
import { computed, defineEmits, ref, toRaw, watch } from "vue";
import API from "@/api";
import useCommonStore from "@/app/common";

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
  itemTitle: {
    type: String,
    default: "cast_code",
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

const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  try {
    if (val) {
      searching.value = true;
      try {
        const { status, data } = await API.get("/cast/", {
          params: {
            q: val,
            page: 1,
            itemsPerPage: 20,
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
  } finally {
    searching.value = false;
  }
}, 500);

const getData = async () => {
  const { status, data } = await API.get("/cast/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  });
  if (status === 200) {
    let $data = data.items || [];
    const cast = commonStore.cast || {};
    if (cast?.id) {
      $data.push(cast)
    }
    if (props.cast?.id) {
      $data.push(toRaw(props.cast))
    }
    $data = uniqBy($data, 'id');
    items.value = $data;
    cache = $data;
  }
};

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id });
    if (item) {
      emit("change", item);
    }
  }
};

watch(
    () => props.cast,
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
