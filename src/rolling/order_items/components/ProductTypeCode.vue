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
      :clearable="clearable"
      :chips="multiple"
      :multiple="multiple"
  ></v-autocomplete>
</template>
<script setup>
import {find} from "lodash";
import {computed, defineEmits, ref, watch} from "vue";
import API from '@/api';
import _ from 'lodash';

const searching = ref(false);
const items = ref([])
const selItems = ref([])
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  modelValue: {
    type: [Number, Array],
    default: null
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
  itemTitle: {
    type: String,
    default: 'code'
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  label: {
    type: String,
    default: 'ProductType Code'
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please Select ProductType Code'
  },
  /** 多选 */
  multiple: {
    type: Boolean,
    default: false
  },
  // 清除图标
  clearable: {
    type: Boolean,
    default: true
  },
  product_class: {
    type: String,
    default: null
  },
  product_category: {
    type: String,
    default: null
  }
})

const valueId = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});

const handleSearch = async (val) => {
  if (val) {
    searching.value = true;
    try {
      const params = {
        q: val,
        page: 1,
        itemsPerPage: 50,
        sortBy: ["updated_at"],
        descending: [false],
        dims: 1,
      }
      if (props.product_class) {
        params.product_class = props.product_class
      }
      if (props.product_category) {
        params.product_category = props.product_category
      }
      const {data, status} = await API.get("/product_type/", {params})
      if (status === 200) {
        if (props.multiple) {
          // 合并选择的 和 新查出来的
          items.value = _.unionBy(data.items, selItems.value, 'id')
        } else {
          // 单选
          items.value = data.items || []
        }
      } else {
        items.value = [];
      }
    } finally {
      searching.value = false;
    }
  }
}

const handleChoose = async (ids) => {
  if ((Array.isArray(ids) && ids.length) || typeof ids === 'number') {
    if (props.multiple) {
      // 多选
      const selectedItems = ids.map(id => find(items.value, {id})).filter(Boolean) || []
      emit("change", selectedItems)
      selItems.value = selectedItems
    } else {
      // 单选
      const selectedItems = find(items.value, {id: ids}) || null
      emit("change", selectedItems)
      selItems.value = selectedItems
    }
  } else {
    emit("change", ids)
    selItems.value = ids
  }
}

const getData = async (ids) => {
  const params = {
    page: 1,
    itemsPerPage: 5,
    sortBy: ["updated_at"],
    descending: [false],
  }

  if ((Array.isArray(ids) && ids.length) || typeof ids === 'number') {
    params.values = [ids]
    params.fields = ['id']
    params.ops = [props.multiple ? 'in' : 'eq']
  }
  if (props.product_class) {
    params.product_class = props.product_class
  }
  if (props.product_category) {
    params.product_category = props.product_category
  }
  const {status, data} = await API.get("/product_type/", {params})
  if (status === 200) {
      if (props.multiple) {
        const its =  (props.product_class || props.product_category) ? data.items :  _.unionBy(data.items, items.value, 'id')
        items.value = _.unionBy(its, selItems.value, 'id')
      }else{
        items.value = data.items || []
      }
  } else {
    items.value = [];
  }
}

watch(() => props.modelValue, (val) => {
  getData(val)
}, {immediate: true})

watch(() => props.product_class, (val) => {
  getData(props.modelValue)
})

watch(() => props.product_category, (val) => {
  getData(props.modelValue)
})

</script>


<style scoped>
</style>
