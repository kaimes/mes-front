<template>
  <div class="d-flex align-items-center ga-2">
    <v-autocomplete
        v-model="codeId"
        @input="handleSearch"
        @update:model-value="handleCodeChoose"
        @click:clear="handleClear"
        :label="label"
        :placeholder="placeholder"
        prepend-inner-icon="mdi-file-document-refresh"
        :item-title="itemTitle"
        :item-value="itemValue"
        :hide-details="hideDetails"
        :density="density"
        :variant="variant"
        :rules="rules"
        :loading="searching"
        :items="items"
        clearable
    >
    </v-autocomplete>
    <v-autocomplete
      v-model="sapId"
      @input="handleSearch"
      @update:model-value="handleSapChoose"
      @click:clear="handleClear"
      placeholder="Sap Order Code"
      item-title="sap_order_code"
      item-value="sap_order_code"
      append-inner-icon="mdi-magnify"
      :hide-details="hideDetails"
      :density="density"
      :variant="variant"
      :loading="searching"
      :items="items"
      clearable
    >
    </v-autocomplete>
  </div>
</template>
<script setup>
import {find, debounce, some, trim, concat, uniqBy} from "lodash";
import {computed, defineEmits, ref, toRaw, unref, watch} from "vue";
import API from '@/api';
import {getOrderLast} from "@/util/util";

const searching = ref(false);
const items = ref([])
let cache = unref([]);
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: ''
  },
  rules: {
    type: Array,
    default: []
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  itemValue: {
    type: String,
    default: 'id'
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  itemTitle: {
    type: String,
    default: 'order_code'
  },
  length: {
    type: Number,
    default: 6,
  },
  label: {
    type: String,
    default: 'Order Number'
  },
  order: {
    type: Object,
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please select Order Number'
  }
})
const codeId = ref(props.value || undefined);
const sapId = ref(undefined);

const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  console.log("val", val)
  if (val) {
    searching.value = true;
    try {
      const {status, data} = await API.get("/order/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      if (status === 200) {
        if (data.items.length > 0) {
          const $data = data.items.map(item => ({
            ...item,
            [props.itemTitle]: getOrderLast(item[props.itemTitle], props.length),
            "sap_order_code": getOrderLast(item["sap_order_code"], props.length),
          }));
          const $arr = concat($data, toRaw(items.value));
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

const getData = async () => {
  const {status, data} = await API.get("/order/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  })
  if (status === 200) {
    let $data = (data.items || []).map(item => ({
      ...item,
      [props.itemTitle]: getOrderLast(item[props.itemTitle], props.length),
      "sap_order_code": getOrderLast(item["sap_order_code"], props.length),
    }));
    if (props.order?.id) {
      $data = [
        ...$data,
        toRaw(props.order),
      ];
    }
    items.value = $data;
    cache = $data;
  } else {
    items.value = [];
  }
}

const handleCodeChoose = (id) => {
  if (id) {
    const item = find(items.value, { id })
    if (item) {
      sapId.value = item["sap_order_code"];
      emit('update:modelValue', item[props.itemValue])
      emit("change", item)
    }
  }
}

const handleSapChoose = (sap_order_code) => {
  if (sap_order_code) {
    const item = find(items.value, { sap_order_code })
    console.log("item", item)
    if (item) {
      codeId.value = item[props.itemValue];
      emit('update:modelValue', item[props.itemValue])
      emit("change", item)
    }
  }
}

const handleClear = () => {
  console.log("**********clear")
  codeId.value = undefined;
  sapId.value = undefined;
  emit('update:modelValue', undefined)
  items.value = cache;
}

watch(
    () => props.order,
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
