<template>
  <v-autocomplete
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
      :items="items"
      :persistent-placeholder="persistentPlaceholder"
      :clearable="clearable"
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
  </v-autocomplete>
</template>
<script setup>
import { find } from "lodash";
import {computed, defineEmits, ref} from "vue";
import useCommonStore from "@/app/common";

const commonStore = useCommonStore();
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
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
  clearable: {
    type: Boolean,
    default: true
  },
  // 如果设置了chips和max 则 desc字段无法展示
  max: {
    type: Number,
    default: 1
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please select an option'
  },
  str_sort: {
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

const items = computed(() => {
  const dictItems = commonStore.dict[props.code] || [];
  const extendedItems = [...dictItems];

  // 单选
  if (!props.multiple && props.modelValue != null) {
    const exists = dictItems.some(item => item[props.itemValue] === props.modelValue);
    if (!exists) {
      extendedItems.push({
         [props.itemValue]: props.modelValue,
         [props.itemTitle]: props.modelValue, 
         desc: ''
      });
    }
  }

  // 多选
  if (props.multiple && Array.isArray(props.modelValue)) {
    props.modelValue.forEach(val => {
      const exists = dictItems.some(item => item[props.itemValue] === val);
      if (!exists) {
        extendedItems.push({
          [props.itemValue]: val,
          [props.itemTitle]: val,
          desc: ''
        });
      }
    });
  }

  if (props.str_sort) {
    // 按 itemTitle 进行字母排序
    extendedItems.sort((a, b) => {
      const titleA = String(a[props.itemTitle]).toUpperCase();
      const titleB = String(b[props.itemTitle]).toUpperCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
  }

  return extendedItems;
});

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, (item) => {
      return item[`${props.itemValue}`] === id;
    })
    if (item) {
      emit("change", item)
    }
  } else {
    emit("change", {})
  }
}
</script>
<style scoped>

</style>
