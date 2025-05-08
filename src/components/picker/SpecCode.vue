<template>
  <v-autocomplete
      v-model="valueId"
      @input="handleSearch"
      @update:model-value="handleChoose"
      @click:clear="handleClear"
      label="Spec Code"
      :prepend-inner-icon="prependInnerIcon"
      :append-inner-icon="appendInnerIcon"
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
import {concat, debounce, find, includes, some, trim, uniqBy} from "lodash";
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
  },
  prependInnerIcon: {
    type: String,
    default: 'mdi-file-document-refresh'
  },
  appendInnerIcon: {
    type: String,
    default: 'mdi-magnify'
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

const handleSearch = debounce(async (e) => {
  const val = trim(e.target.value);
  if (val) {
    searching.value = true;
    try {
      const {status, data} = await API.get("/spec/", {
        params: {
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
          spec_code: val.split('-')[0], // code-version-version_status
          version_status:'R'
        },
      })
      if (status === 200 && data.items?.length > 0) {
        const $data = (data.items || []).map(item => {
          let specTitle = item.spec_code;
          if (item?.version) {
            specTitle = `${item.spec_code}-${item?.version || ''}-${item?.version_status || ''}`;
          }
          return {
            ...item,
            specTitle
          };
        });
        const $arr = concat($data, toRaw(items.value));
        items.value = uniqBy($arr, 'id');
      }
    } finally {
      searching.value = false;
    }
  }
}, 500);

const getData = async () => {
  const {status, data} = await API.get("/spec/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
      version_status:'R'
    },
  })
  if (status === 200 && data.items?.length > 0) {
    let $data = (data.items || []).map(item => {
      let specTitle = item.spec_code;
      if (item?.version) {
        specTitle = `${item.spec_code}-${item?.version || ''}-${item?.version_status || ''}`;
      }
      return {
        ...item,
        specTitle
      };
    });
    const spec = commonStore.spec;
    if (spec?.id) {
      // $data.push(spec);
      let specTitle = spec.spec_code || '';
      if (spec?.version) {
        specTitle = `${spec.spec_code || ''}-${spec?.version || ''}-${spec?.version_status || ''}`;
      }
      $data.push({...spec, specTitle});
    }
    if (props.spec?.id) {
      // $data.push(toRaw(props.spec));
      const propSpec = toRaw(props.spec);
      let specTitle = propSpec.spec_code || '';
      if (propSpec?.version) {
        specTitle = `${propSpec.spec_code || ''}-${propSpec?.version || ''}-${propSpec?.version_status || ''}`;
      }
      $data.push({...propSpec, specTitle});
    }
    $data = uniqBy($data, 'id');
    items.value = $data;
    cache = $data;
  } else {
    if (props.spec?.id) {
      const propSpec = toRaw(props.spec);
      let specTitle = propSpec.spec_code || '';
      if (propSpec?.version) {
        specTitle = `${propSpec.spec_code || ''}-${propSpec?.version || ''}-${propSpec?.version_status || ''}`;
      }
      cache = [
        // toRaw(props.spec),
        {...propSpec, specTitle},
      ];
      items.value = cache;
    }
  }
}

const handleClear = () => {
  emit('update:modelValue', undefined)
  items.value = cache;
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
  }
}

watch(
    () => props.spec,
    (value) => {            
      const $items = toRaw(items.value);
      if (!value?.id && props.store) {
        const spec = commonStore.spec;
        if (spec.id) {
          let specTitle = spec.spec_code;
          if (spec?.version) {
            specTitle = `${spec.spec_code}-${spec?.version || ''}-${spec?.version_status || ''}`;
          }
          items.value = [...$items, {...spec, specTitle}];
        }
        return
      }
      const $isExist = some($items, { id: value.id });
      if (value && value.id && !$isExist) {
        const item = toRaw(value);
        let specTitle = item.spec_code;
        if (item?.version) {
          specTitle = `${item.spec_code}-${item?.version || ''}-${item?.version_status || ''}`;
        }
        items.value = [...$items, {
          ...item,
          specTitle
        }];
      }
    },
    {
      immediate: true,
      deep: true
    }
)

getData()
</script>
<style scoped>

</style>
