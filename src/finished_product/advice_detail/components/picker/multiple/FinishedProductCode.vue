<template>
  <v-autocomplete
    v-model="valueId"
    @update:search="handleSearch"
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
import { filter, includes, concat, uniqBy, findIndex, map} from "lodash";
import { computed, defineEmits, ref, toRaw, watch } from "vue";
import {toast} from "vue3-toastify";
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
  business_type: {
    type: String,
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
  finished_product: {
    type: Object,
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: "Please select Finished Product Code",
  },
  skip:{
    type: Boolean,
    default: false
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

const handleSearch = async (val) => {
  if (val) {
    if (searching.value) {
      return;
    }
    searching.value = true;
    try {
      const params = {
        q: val,
        page: 1,
        itemsPerPage: 20,
        sortBy: ["updated_at"],
        descending: [false],
        filter_type: "custom",
        fields: ["status", "status", "order_item_id"],
        ops: ["!=", "is_null", "is_not_null"],
        values: ["dispatched", true, true],
      };
      if (props.type) {
        params["fields"] = ["status", "status", "order_item_id", "order_id"];
        params["ops"] = ["!=", "is_null", "is_not_null", "eq"];
        params["values"] = ["dispatched", true, true, props.type];
      }
      const { status, data } = await API.get("/finished_product/", { params });
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
};

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
}

const getData = async () => {
  const params = {
    page: 1,
    itemsPerPage: 20,
    sortBy: ["updated_at"],
    descending: [false],
    filter_type: "custom",
    fields: ["status", "status", "order_item_id"],
    ops: ["!=", "is_null", "is_not_null"],
    values: ["dispatched", true, true],
  };
  if (props.type) {
    params["fields"] = ["status", "status", "order_item_id", "order_id"];
    params["ops"] = ["!=", "is_null", "is_not_null", "eq"];
    params["values"] = ["dispatched", true, true, props.type];
  }
  const { status, data } = await API.get("/finished_product/", { params });
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

  if (props.skip) {
    let previousItem = null;  // 用来保存上一个对象
    for (let index = 0; index < item.length; index++) {
      const $item = item[index];  // 获取当前的 $item
      if (props.business_type === 'bws' || props.business_type === 'roster') {
        // 先检查 order_id 是否存在
        if (!$item.order_id) {
          toast.warning("The selected item must have an order.", {
            position: "bottom-center"
          });
          item.splice(index, 1);  // 移除当前项
          continue;  // 跳过当前循环，继续下一轮
        }
        if (previousItem) {  // 如果之前有对象
          // 判断当前对象的 order_id 是否与上一个对象的 order_id 不相同
          if ($item.order_id !== previousItem.order_id) {
            toast.warning("Please select a finished product with the same order.", {
              position: "bottom-center"
            });
            item.splice(index, 1);  // 移除当前项
            continue;  // 跳过当前循环，继续下一轮
          }
        }
        previousItem = $item;  // 将当前项赋值给 previousItem


        // 检查 exist_flag 和 rework_type 是否符合要求
        if (($item.exist_flag !== 'Y' && $item.exist_flag !== null) || 
            ($item.rework_type !== 'Complete' && $item.rework_type !== null)) {
          toast.warning("The selected finished product mult or rework is being done.", {
            position: "bottom-center"
          });
          item.splice(index, 1);  // 移除当前 item
          break;  // 直接退出循环，停止对该 item 的进一步处理
        }
      }
    }
    // 更新 valueId 的值
    valueId.value = item.map(item => item.id);
  }

  
  emit("change", item);
}

};

getData();
</script>
<style scoped>
</style>
