<template>
  <v-select
    v-model="valueId" 
    @update:model-value="handleChoose"
    :label="label"
    :item-title="itemTitle"
    :item-value="itemValue"
    :hide-details="hideDetails"
    :disabled="disabled"
    :multiple="multiple"
    :density="density"
    :variant="variant"
    :rules="rules"
    :items="filteredItems" 
    :persistent-placeholder="persistentPlaceholder"
    
  >
    <template v-slot:selection="{ props, item, index }">
      <template v-if="multiple">
        <v-chip v-if="index < max">
          <span>{{ item.title }}</span>
        </v-chip>
      </template>
      <template v-else>
        <v-list-item class="no-padding" min-height="0" :title="item.raw.title" :subtitle="item.raw.desc"></v-list-item>
      </template>
      <span
        v-if="index === max && multiple"
        class="text-grey text-caption align-self-center"
      >
        (+{{ valueId.length - max }} others)
      </span>
    </template>
  </v-select>
</template>

<script setup>
import { find } from "lodash";
import { computed, defineEmits, defineProps } from "vue";
import useCommonStore from "@/app/common";

const commonStore = useCommonStore();
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /** 当前双向数据绑定的值 */
  modelValue: {
    type: [String, Number, Array],
  },
  label: {
    type: String,
    default: ''
  },
  // 字典值
  code: {
    type: String,
    required: true,
    default: ''
  },
  itemTitle: {
    type: String,
    default: 'title'
  },
  itemValue: {
    type: String,
    default: 'value'
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  rules: {
    type: Array,
    default: []
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  persistentPlaceholder: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  // 如果设置了chips和max 则 desc字段无法展示
  max: {
    type: Number,
    default: 2
  },
  /** 输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please select an option'
  }
});

// 双向绑定 modelValue
const valueId = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val);
  }
});

// 获取字典中的所有项
const items = computed(() => {
  return commonStore.dict[props.code] || [];
});

// 计算过滤后的 items
const filteredItems = computed(() => {
  if (!props.modelValue) return items.value;  // 如果没有选择任何值，返回所有选项
  
  switch (props.modelValue) {
    case 'BWS':
      return [{ value: 'scrap', title: 'scrap' }, { value: 'BWS', title: 'BWS' }];
    case 'Roster':
      return [{ value: 'scrap', title: 'scrap' },  { value: 'Roster', title: 'Roster' }];  // BWS 和 Roster 只能选择 Scrap
    case 'beam_mill':
      return [
        { value: 'BWS', title: 'BWS' },
        { value: 'Roster', title: 'Roster' },
        { value: 'scrap', title: 'scrap' },
        { value: 'beam_mill', title: 'beam_mill' },
      ];  // Beam Mill 可以选择 BWS, Roster, 或 Scrap
    case 'scrap':
      return [{ value: 'scrap', title: 'scrap' }];  // 如果选了 Scrap，不能选择其他选项
    default:
      return items.value;  // 默认情况下显示所有项
  }
});

// 选择项后触发的处理函数
const handleChoose = (id) => {
  
  if (id) {
    const item = find(filteredItems.value, (item) => item[props.itemValue] === id);    
    if (item) {
      emit('change', item);  // 传递选中的项
    }
  } else {
    emit('change', {});  // 清空选中的项
  }
};
</script>

<style scoped>
/* 可以添加组件样式 */
</style>
