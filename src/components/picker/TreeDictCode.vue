<template>

  <template v-if="disabled">
    <v-chip v-for="tag in selectedText" :key="tag[itemValue]" size="small">
      {{ tag[itemTitle] }}
    </v-chip>
  </template>

  <template v-else>
    <v-menu v-model="menu">
      <template v-slot:activator="{ props }">
        <v-autocomplete
            v-model="selectedText"
            :label="label"
            readonly
            clearable
            v-bind="props"
            :placeholder="placeholder"
            :variant="variant"
            :hide-details="hideDetails"
            :rules="rules"
            :item-title="itemTitle"
            :item-value="itemValue"
            :multiple="true"
            :chips="true"
            @click:clear="clearSelection"
            :disabled="disabled"
        ></v-autocomplete>
      </template>
      <v-treeview
          v-model:selected="selected"
          @update:selected="handleSelect"
          :items="items"
          selectable
          :select-strategy="selectStrategy"
          :item-value="itemValue"
          :item-title="itemTitle"

          :disabled="disabled"
          return-object
      ></v-treeview>
    </v-menu>
  </template>
</template>

<script setup>
import {computed, defineEmits, ref, watch} from "vue";
import useCommonStore from "@/app/common";

const commonStore = useCommonStore();
const items = computed(() => {
  return commonStore.dict[props.code] || [];
});

const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  modelValue: {
    type: Array,
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
  variant: {
    type: String,
    default: 'underlined'
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: 'Please select an option'
  },
  hideDetails: {
    type: Boolean,
    default: 'auto'
  },
  selectStrategy: {
    type: String,
    default: 'leaf'
  },

  rules: {
    type: Array,
    default: []
  },

  disabled: {
    type: Boolean,
    default: false
  },
})

// 控制菜单显示状态
const menu = ref(false);

// 选中项及文本
const selected = ref([]);
const selectedText = ref([]);


const findItemByValue = (its, value) => {
  for (const it of its) {
    if (it[props.itemValue] === value) {
      return it;
    }
    if (it.children) {
      const found = findItemByValue(it.children, value);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

// 清空选择
const clearSelection = () => {
  selected.value = [];
  selectedText.value = [];
  emit('update:modelValue', []);
  emit('change', []);
};


const handleSelect = (val) => {
  selectedText.value = val
  const items = val.map((v) => {
    return v[props.itemValue];
  });
  emit('update:modelValue', items);
  emit('change', items);
};

watch(() => props.modelValue, (val) => {
  const its =[]
  val.forEach((v) => {
    const item = findItemByValue(items.value, v);
    if (item) {
      its.push(item);
    }else{
      its.push({[props.itemValue]: v, [props.itemTitle]: v})
    }
  });

  selected.value = its;
  selectedText.value = its
}, {immediate: true});


</script>

<style scoped>
</style>
