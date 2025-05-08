<template>
  <v-autocomplete
      v-model="valueId"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
      prepend-inner-icon="mdi-file-document-refresh"
      append-inner-icon="mdi-magnify"
      :hide-details="hideDetails"
      :density="density"
      :variant="variant"
      :rules="rules"
      :loading="searching"
      :items="items"
      item-value="area_id" 
      item-title="area_code"
      clearable
  ></v-autocomplete>
</template>
<script setup>
import {compact, includes} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';

const searching = ref(false);
const items = ref([])
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
    default: ''
  },
  code: {
    type: String,
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
  disabled: {
    type: Boolean,
    default: false
  },
  density: {
    type: String,
    default: 'compact'
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  label: {
    type: String,
    default: 'Area'
  },
  placeholder: {
    type: String,
    default: 'Please select'
  },
  area: {
    type: Object
  },
  context: {
    type: String,
    default: '' // 新增context属性区分调用来源
  }
})

// const valueId = computed({
//   get: () => {
//     return props.value;
//   },
//   set: (val) => {
//     emit('update:modelValue', val)
//   }
// });
const valueId = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:modelValue', val);
}
});

const getData = async (code) => {
  try {
    const { data } = await API.get(`/area/item/get_area_by_site/${code}`)
    items.value.area_code = compact(data || []);
  } finally {
    searching.value = false;
  }
}

// const getArea = async () => {
//   searching.value = true;
//   try {
//     const { data } = await API.get('/area/item/code/finished')
//     items.value = compact(data || []);
//   } finally {
//     searching.value = false;
//   }
// }

// const getArea1 = async () => {
//   searching.value = true;
//   try {
//     const { data } = await API.get('/area/item/code/finished')
//     items.value = compact(data || []).filter(item => item.area_code !== 'ADC');
//   } finally {
//     searching.value = false;
//   }
// }

const getArea = async () => {
  searching.value = true;
  try {
    if (props.context === 'finished_product') {
      const { data } = await API.get('/area/item/code/finished')
      items.value = compact(data || []).filter(item => item.area_code !== 'ADC');
    } else {
      const { data } = await API.get('/area/item/code/finished')
      items.value = compact(data || []);
    }
  } finally {
    searching.value = false;
  }
}
  
const handleChoose = (area_id) => {
  const selectedItem = items.value.find(item => item.area_id === area_id);
  console.log('selectedItem', selectedItem);
  emit("change", selectedItem); 
};

watch(
    () => props.area,
    (value) => {
      if (!value) {
        return
      }
      getData(value);
    }
)

getArea();
</script>
<style scoped>

</style>
