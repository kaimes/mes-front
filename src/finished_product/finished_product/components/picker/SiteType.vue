<template>
  <v-autocomplete
      v-model="valueId"
      @update:model-value="handleChoose"
      :label="label"
      :placeholder="placeholder"
      prepend-inner-icon="mdi-sitemap-outline"
      append-inner-icon="mdi-magnify"
      :hide-details="hideDetails"
      :density="density"
      :variant="variant"
      :rules="rules"
      :loading="searching"
      :items="items"
      :disabled="disabled"
      clearable
  ></v-autocomplete>
</template>
<script setup>
import { compact } from "lodash";
import { computed, defineEmits, ref, watch } from "vue"; // 正确：从 vue 导入 watch
import API from '@/api';
import { useStore } from 'vuex'

const store = useStore();
const searching = ref(false);
const mill = ref(null); // 添加 mill 变量
const items = ref([])
const emit = defineEmits(['update:value', 'change']);
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
    default: 'underlined'
  },
  label: {
    type: String,
    default: 'Site Type'
  },
  placeholder: {
    type: String,
    default: 'Please select'
  }
})

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit('update:value', val)
  }
});

const defaultMillCode = computed(() => store.state.auth.defaultMillCode);
const getData = async () => {
  
  try {
    const { data } = await API.get("/site_type/items/codes", {
      params: {
        mill_code: defaultMillCode.value
      }
    })
    items.value = compact(data || []);
  } finally {
    searching.value = false;
  }
}
const handleChoose = (item) => {
  emit("change", item)
}

watch(defaultMillCode, (val) => {
  if (val){
    getData();
  }
},{immediate: true})
</script>
<style scoped>

</style>
