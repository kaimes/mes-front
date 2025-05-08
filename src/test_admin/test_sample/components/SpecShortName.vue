<template>
  <v-autocomplete
      v-model="valueId"
      @update:search="handleSearch"
      @update:model-value="handleChoose"
      label="Spec Short Name"
      prepend-inner-icon="mdi-file-document-refresh"
      append-inner-icon="mdi-magnify"
      item-title="specTitle"
      :item-value="itemValue"
      :hide-details="hideDetails"
      :persistent-placeholder="persistentPlaceholder"
      :disabled="disabled"
      :density="density"
      variant="underlined"
      :rules="rules"
      :loading="searching"
      :items="items"
      clearable
  ></v-autocomplete>
</template>
<script setup>
import { find, includes } from "lodash";
import {computed, defineEmits, ref, toRaw, watch, watchEffect} from "vue";
import API from '@/api';
import useCommonStore from "@/app/common";

const commonStore = useCommonStore();
const searching = ref(false);
const items = ref([])
let cache = [];
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  value: {
    type: [String, Number],
  },
  itemValue: {
    type: String,
    default: 'id'
  },
  density: {
    type: String,
    default: 'default'
  },
  /** 年份 */
  rules: {
    type: Array,
    default: []
  },
  persistentPlaceholder: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 组件是否全局同步
  store: {
    type: Boolean,
    default: true
  },
  spec: {
    type: Object,
    default: {}
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: '请选择'
  }
})

const valueId = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});

const handleSearch = async (val) => {
  if (val && val.length >= 1) {
    searching.value = true;
    try {
      const {status, data} = await API.get("/spec/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      if (status === 200 && data.items?.length > 0) {
        items.value = (data.items || []).map(item => {
          let specTitle = item.short_name;
          if (item?.version) {
            specTitle = `${item.short_name}`;
          }
          return {
            ...item,
            specTitle
          };
        });
      }
    } finally {
      searching.value = false;
    }
  } else {
    if (items.value.length === 0) {
      if (cache.length > 0) {
        items.value = cache;
        return;
      }
      await getData();
    }
  }
}

const getData = async () => {
  const {status, data} = await API.get("/spec/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  })
  if (status === 200 && data.items?.length > 0) {
    const $data = (data.items || []).map(item => {
      let specTitle = item.short_name;
      if (item?.version) {
        specTitle = `${item.short_name}`;
      }
      return {
        ...item,
        specTitle
      };
    });
    items.value = $data;
    cache = $data;
  }
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id})
    if (item) {
      if (props.store) {
        commonStore.setSpec(toRaw(item));
      }
      emit("change", item)
    }
  } else {
    emit("change", {})
    getData();
  }
}
watch(
    () => props.spec,
    (value) => {
      const $items = toRaw(items.value);
      if (!value?.id && props.store) {
        const spec = commonStore.spec;
        if (spec.id) {
          let specTitle = spec.short_name;
          if (spec?.version) {
            specTitle = `${spec.short_name}`;
          }
          items.value = [{...spec, specTitle}];
        } else {
          getData();
        }
        return
      }
      const $isExist = includes($items, { id: value.id });
      if (value && value.id && !$isExist) {
        const item = toRaw(value);
        let specTitle = item.short_name;
        if (item?.version) {
          specTitle = `${item.short_name}`;
        }
        items.value = [{
          ...item,
          specTitle
        }];
      } else {
        getData();
      }
    },
    {
      immediate: true,
      deep: true
    }
)
</script>
<style scoped>

</style>
