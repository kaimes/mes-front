<template>
  <v-autocomplete
    v-model="valueId"
    @input="handleSearch"
    @update:model-value="handleChoose"
    @click:clear="handleClear"
    label="Runout Code"
    prepend-inner-icon="mdi-file-document-refresh"
    append-inner-icon="mdi-magnify"
    :item-title="itemCode"
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
import {concat, debounce, find, some, trim, unionBy, uniqBy} from "lodash";
import {computed, defineEmits, onMounted, ref, toRaw, watch} from "vue";
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
    default: "runout_code",
  },
  /** 年份 */
  rules: {
    type: Array,
    default: [],
  },
  persistentPlaceholder: {
    type: Boolean,
    default: false,
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
  runout: {
    type: Object,
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "请选择",
  },
  pickRunout: {
    type: Number,
    default: 0,
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

const handleClear = () => {
  emit('update:modelValue', undefined)
  emit('change', undefined)
  items.value = cache;
}


const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  if (val) {
    searching.value = true;
    try {
      let params =  {
        q: val,
        page: 1,
        itemsPerPage: 5,
        sortBy: ["updated_at"],
        descending: [false],
      }
      if (props.pickRunout) {
        params.pick_runout_id = props.pickRunout
      }
      const { status, data } = await API.get("/runout/", {
        params:params
      });
      if (status === 200 && data.items.length > 0) {
        const $arr = concat(data.items, toRaw(items.value)).map(item => ({
          ...item,
          code: formatCode(item.runout_code)
        }));
        items.value = uniqBy($arr, 'id');
      }
    } finally {
      searching.value = false;
    }
  }
}, 500);

const getData = async () => {
  let params =  {
    page: 1,
    itemsPerPage: 5,
    sortBy: ["updated_at"],
    descending: [false],
  }
  if (props.pickRunout) {
    params.pick_runout_id = props.pickRunout
  }

  const { status, data } = await API.get("/runout/", {
    params:params
  });
  if (status === 200) {
    let $data = (data.items || []).map(item => ({
      ...item,
      code: formatCode(item.runout_code)
    }));
    if (props.runout?.id) {
      $data.push(toRaw(props.runout))
    }
    $data = uniqBy($data, 'id');
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
  }
};


watch(
    () => props.runout,
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


watch (
    () => props.pickRunout,
    (value) => {
      if (value) {
        emit('update:modelValue', undefined);
        getData();
      }
    }
)

getData()
</script>
<style scoped>
</style>
