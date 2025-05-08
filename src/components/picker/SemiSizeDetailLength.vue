<template>
  <v-autocomplete
      v-model="valueId"
      @update:search="handleSearch"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
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
import {find, includes, some} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';
import {formatCode} from "@/util/util";
import { param } from "jquery";

const searching = ref(false);
const items = ref([])
let cache = [];
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: ''
  },
  /** 年份 */
  rules: {
    type: Array,
    default: []
  },
  hideDetails: {
    type: Boolean,
    default: true
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
    default: 'id'
  },
  itemTitle: {
    type: String,
    default: 'length_mm'
  },
  label: {
    type: String,
    default: 'Opt Length'
  },
  semi_size: {
    type: Object,
  },
  placeholder: {
    type: String,
    default: 'Please select Length'
  },
  semi_size_id:{
    type: Number,
    default: null,
  }
})

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});

const handleSearch = async (val) => {
  if (val) {
    if (val.includes("-")) {
      return;
    }
    searching.value = true;
    try {
      const { status, data } = await API.get("/semi_size_detail/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })

      if (status === 200) {
        items.value = (data.items || []).map(item => ({
          ...item,
          length: formatCode(item.length_mm)
        }));
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
}

const getData = async () => {
  const params = {
    page: 1,
    itemsPerPage: 20,
    sortBy: ["updated_at"],
    descending: [false],
  };
    if (props.semi_size_id) {
    params["fields"] = ["semi_size_id"];
    params["ops"] = ["=="];
    params["values"] = [props.semi_size_id];
  }

  const { status, data } = await API.get("/semi_size_detail/", {params}
  )

  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
      length: formatCode(item.length_mm)
    }));
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id})
    if (item) {
      emit("change", item)
    }
  }else{
    emit("change", id)
  }
}

watch(
    () => props.semi_size_id,
    (value) => {
      if (!value) {
        getData();
        return;
      }
      const $items = toRaw(items.value);
      const $isExist = some($items, { length: value.length_mm });
      if (value && value.id && !$isExist) {
        items.value = [{
          ...value,
          length: formatCode(value.length_mm)
        }];
      } else {
        getData();
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
