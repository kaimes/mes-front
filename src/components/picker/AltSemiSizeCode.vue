<template>
  <v-autocomplete
      v-model="valueId"
      @update:search="handleSearch"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
      :prepend-inner-icon="prependInnerIcon"
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
      :bg-color="bgColor"
  ></v-autocomplete>
</template>
<script setup>
import {computed, defineEmits, onMounted, ref, watch} from "vue";
import API from '@/api';
import _, {update} from 'lodash';

const searching = ref(false);
const items = ref([])
const selItems = ref([])
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  modelValue: {
    type: [Number, Array, String],
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
  bgColor: {
    type: String,
    default: 'white'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  label: {
    type: String,
    default: 'Semi Size'
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please Select Semi Size'
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
  order_group_id: {
    type: Number,
    required: true
  },
  prependInnerIcon: {
    type: String,
    default: 'mdi-file-document-refresh'
  },
  disabledSearch:{
    type: Boolean,
    default: false
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

const handleSearch = (val) => {
  if (props.disabledSearch){
    return;
  }

  if (val) {
    searching.value = true;
    try {
      const filteredItems = items.value.filter(item => {
        const searchString = `[${item.rank_seq}] ${item?.semi_size?.width_mm}x${item?.semi_size?.thick_mm}`;
        return searchString.toLowerCase().includes(val.toLowerCase());
      });

      if (props.multiple) {
        // 合并选择的 和 新查出来的
        items.value = _.unionBy(filteredItems, selItems.value, 'id');
      } else {
        // 单选
        items.value = filteredItems || [];
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

const getData = async () => {
  const params = {
    page: 1,
    itemsPerPage: -1,

  }

  const {status, data} = await API.get("/alternative_semi_size/semi_size_by_order_group/"+props.order_group_id, {params})
  if (status === 200) {
      // 新增：按rank_seq排序并去重
      const sortedItems = data.items.sort((a, b) => a.rank_seq - b.rank_seq);
      
      const uniqueSizes = new Map();
      sortedItems.forEach(item => {
        const sizeKey = `${item.semi_size.width_mm}x${item.semi_size.thick_mm}`;
        if (!uniqueSizes.has(sizeKey)) {
          uniqueSizes.set(sizeKey, {
            ...item,
            code: `[${item.rank_seq}] ${sizeKey}`
          });
        }
      });
      
      const uniqueItems = Array.from(uniqueSizes.values());

      if (props.multiple) {
        const its = (props.product_class || props.product_category) ? uniqueItems : _.unionBy(uniqueItems, items.value, 'id');
        const itms = _.unionBy(its, selItems.value, 'id');
        itms.sort((a, b) => a.rank_seq - b.rank_seq);
        items.value = itms;
      } else {
        items.value = uniqueItems;
      }

      // 如果没有选中值，并且有数据，则自动选中第一个
      if (!props.modelValue && uniqueItems.length > 0) {
        const firstItem = uniqueItems[0];
        emit('update:modelValue', firstItem.id);
        const selfirst = props.multiple ? [firstItem] : firstItem;
        emit('change', selfirst);
        selItems.value = selfirst;
      }
    } else {
      items.value = [];
    }
  }



watch( () => props.modelValue, async (val) => {
  if (items.value.length === 0) {
    await getData()
  }
  if (val === null) {
    selItems.value = val;
    emit('change', val);
    await getData()
  }
  else if (typeof val === 'number') {
    const item = _.find(items.value, {id: val});
    if (item) {
      selItems.value = item;
      emit('change', item);
    }
  }
  // type array
  else if (typeof val === 'object') {
    console.log('val', val)
    const selectedItems = val.map(id => _.find(items.value, {id})).filter(Boolean) || []
    selItems.value = selectedItems
    emit('change', selectedItems);
  }
}, {immediate: true})


</script>


<style scoped>
</style>
