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
      :disabled="!code"
      clearable
  ></v-autocomplete>
</template>
<script setup>
import {compact, includes} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';

const searching = ref(false);
const items = ref([])
const emit = defineEmits(['update:value', 'change']);
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

const getData = async (code) => {
  try {
    const { data } = await API.get(`/area/item/get_area_by_site/${code}`)
    items.value = compact(data || []);
  } finally {
    searching.value = false;
  }
}

const handleChoose = (item) => {
  emit("change", item)
}

watch(
    () => props.code,
    (value) => {
      if (!value) {
        return
      }
      getData(value);
    }
)

</script>
<style scoped>

</style>
