<template>
  <v-form ref="searchForm" @submit.prevent="handleSubmit" @keyup.enter="handleSubmit">
    <v-row align="center">
      <v-col
        v-for="(field, index) in sortedFields" 
        :key="field.model || index"
        :cols="field.cols || 2"
        v-show="shouldShow(field)"
      >
        <component
          :is="componentMap[field.component] || field.component"
          v-model="formData[field.model]"
          v-bind="field.props"
          @change="field.props?.change && field.props.change($event)"
        >
          <template v-for="(slotContent, slotName) in field.slots" #[slotName]>
            {{ slotContent }}
          </template>
        </component>
      </v-col>
      <v-col cols="2">
        <div class="d-flex ga-4 align-center">
          <v-btn
              type="text"
              class="text-none"
              color="#e3e3e3"
              variant="flat"
              @click="handleSetting"
          >
            Setting
          </v-btn>
          <v-btn
              class="text-none"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            Reset
          </v-btn>
          <v-btn
              type="submit"
              class="text-none"
              color="primary"
              variant="flat"
              :loading="loading"
              v-permission="`Search`"
          >
            Search
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <FormDialog
        v-model="visible"
        :width="300"
        title="Table Column"
        desc="Setting Column"
        body-class="pa-0"
        @close="handleClose"
        @save="handleSave"
    >
      <div class="column">
        <div class="column-selected">
          <div class="text-subtitle-1 font-weight-bold pa-4">Display Fields</div>
          <Draggable
              v-model="selected"
              item-key="title"
          >
            <template #item="{ element }">
              <div class="column-item pt-1 pb-1 pl-2 pr-4">
                <v-icon size="small" class="mr-2">mdi-drag</v-icon>
                <div class="column-item-title text-subtitle-1 bold">
                  {{ element.title }}
                </div>
                <v-switch
                    color="primary"
                    :model-value="true"
                    density="compact"
                    hide-details
                    @change="handleToggle(element.key, true)"
                ></v-switch>
              </div>
            </template>
          </Draggable>
        </div>
        <v-divider></v-divider>
        <div class="column-unselected">
          <div class="text-subtitle-1 font-weight-bold pa-4">Field not shown</div>
          <div v-for="(element, index) in unselected" class="column-item pt-1 pb-1 pl-4 pr-4" :key="`${element.key}_${index}`">
            <div class="column-item-title text-subtitle-1 bold">
              {{ element.title }}
            </div>
            <v-switch
                color="primary"
                :model-value="false"
                density="compact"
                hide-details
                @change="handleToggle(element.key, false)"
            ></v-switch>
          </div>
        </div>
      </div>
    </FormDialog>
  </v-form>
</template>

<script setup>
import {computed, defineAsyncComponent, getCurrentInstance, onMounted, ref, toRaw} from 'vue';
import useCommonStore from "@/app/common";
import store from "@/store";
import {isEmpty, remove} from "lodash";
import Draggable from "vuedraggable";
import FormDialog from "@/components/FormDialog.vue";

const componentMap = {
  AdviceCode: defineAsyncComponent(() => import('@/components/picker/AdviceCode.vue')),
  Area: defineAsyncComponent(() => import('@/finished_product/finished_product/components/picker/Area.vue')),
  AreaCode: defineAsyncComponent(() => import('@/components/picker/AreaCode.vue')),
  CastCode: defineAsyncComponent(() => import('@/components/picker/CastCode.vue')),
  DictCode: defineAsyncComponent(() => import('@/components/picker/DictCode.vue')),
  RunoutCode: defineAsyncComponent(() => import('@/components/picker/RunoutCode.vue')),
  OrderCode: defineAsyncComponent(() => import('@/components/picker/OrderCode.vue')),
  OrderItemCode: defineAsyncComponent(() => import('@/components/picker/OrderItemCode.vue')),
  TreeDictCode: defineAsyncComponent(() => import('@/components/picker/TreeDictCode.vue')),
  LoadCode: defineAsyncComponent(() => import('@/components/picker/LoadCode.vue')),
  HoldReasonCode: defineAsyncComponent(() => import('@/components/picker/HoldReasonCode.vue')),
  Site: defineAsyncComponent(() => import('@/finished_product/finished_product/components/picker/Site.vue')),
  StoreCode: defineAsyncComponent(() => import('@/finished_product/finished_product/components/picker/StoreCode.vue')),
  SiteType: defineAsyncComponent(() => import('@/components/picker/SiteType.vue')),
  ProductTypeCode: defineAsyncComponent(() => import('@/components/picker/ProductTypeCode.vue')),
  ReservedOrderCode: defineAsyncComponent(() => import('@/finished_product/finished_product/components/picker/ReservedOrderCode.vue')),
  ReservedOrderItemCode: defineAsyncComponent(() => import('@/finished_product/finished_product/components/picker/ReservedOrderItemCode.vue')),
};

const formConfig = ref([
  {
    component: 'v-text-field', // 直接使用Vuetify组件名
    model: 'code',
    visible: () => defaultMillCode.value === 'SRSM',
    props: {
      label: 'Code',
      density: 'default',
      variant: 'underlined',
      placeholder: 'code',
      bgColor: 'white',
      hideDetails: true,
      clearable: true
    }
  },
  {
    component: "RunoutCode",
    model: 'runout_id',
    visible: () => defaultMillCode.value !== 'SRSM',
    props: {
      label: 'Runout Code',
      hideDetails: true,
      change: handlePickRunoutCode
    }
  },
  {
    component: "SiteType",
    model: 'site_type_code',
    visible: true,
    props: {
      label: 'Site Type',
      type: 'finished',
      itemValue: 'site_type_code',
      density: 'default',
      hideDetails: true,
    },
    defaultValue: 'WAREHOUSE'
  },
  {
    component: "Site",
    model: 'site_code',
    visible: true,
    dependencies: ['site_type_code'],
    // props: computed(() => ({
    //   code: searchOptions.value.site_type_code, // 动态计算属性值
    //   clearable: true,
    //   density: 'default'
    // }))
    get props() {
      return {
        label: "Site",
        hideDetails: true,
        code: searchOptions.value.site_type_code, // 正确绑定 site_type_code
      };
    }
  },
  {
    component: "Area",
    model: 'area_code',
    visible: true,
    get props() {
      return {
        hideDetails: true,
        label: "Area",
        code: searchOptions.value.site_code, // 正确绑定 site_type_code
      };
    }
  },
  {
    component: 'CastCode',
    model: 'cast_id',
    visible: true,
    props: {
      label: "Cast Code",
      hideDetails: true
    }
  },
  {
    component: "HoldReasonCode",
    model: 'hold_reason_id',
    visible: true,
    props: {
      label: "Hold Reason Code",
      hideDetails: true,
      change: handlePickHoldReasonCode
    }
  },
  {
    component: "DictCode",
    model: 'stock_type',
    visible: true,
    props: {
      label: "Business Type",
      hideDetails: true,
      code: `business_type#${json_defaultMillCode.value}`
    }
  },
  {
    component: "StoreCode",
    model: 'store_code',
    visible: true,
    props: {
      label: "Store",
      hideDetails: true,
    }
  },
  {
    component: "TreeDictCode",
    model: 'rework_status',
    visible: true,
    props: {
      label: "Rework Status",
      code: "rework_type",
      selectStrategy: "classic",
      hideDetails: true,
    }
  },
  {
    component: "DictCode",
    model: 'allocation_status',
    visible: true,
    props: {
      label: "Allocated Status",
      code: "allocation_status",
      hideDetails: true,
      multiple: true,
    }
  },
  {
    component: "DictCode",
    model: 'reserve_status',
    visible: true,
    props: {
      label: "Reserve Status",
      code: "reserve_status",
      hideDetails: true,
      multiple: true,
    }
  },
  {
    component: "DictCode",
    model: 'load_status',
    visible: true,
    props: {
      label: "Load Status",
      code: "load_status",
      hideDetails: true,
    }
  },
  {
    component: "DictCode",
    model: 'advice_status',
    visible: true,
    props: {
      label: "Advice Status",
      code: "finished_advice_status",
      hideDetails: true,
    }
  },
  {
    component: "AdviceCode",
    model: 'advice_id',
    visible: true,
    props: {
      label: "Advice Code",
      change: handlePickAdviceCode,
    }
  },
  {
    component: "LoadCode",
    model: 'load_id',
    visible: true,
    props: {
      label: "Load Code",
      hideDetails: true,
      change: handlePickLoadCode,
    }
  },
  {
    component: "ProductTypeCode",
    model: 'product_type_id',
    visible: true,
    get props() {
      return {
        label: "Product Type Code",
        variant: "underlined",
        multiple: true,
        hideDetails: true,
        product_class: searchOptions.value.product_class,
        product_category: searchOptions.value.product_category_code,
      };
    },
  },
  {
    component: "OrderCode",
    model: 'order_id',
    visible: true,
    props: {
      label: "Allocated Order",
      variant: "underlined",
      hideDetails: true,
    }
  },
  {
    component: "OrderItemCode",
    model: 'order_item_id',
    visible: true,
    get props() {
      return {
        label: "Allocated Item",
        variant: "underlined",
        hideDetails: true,
        order_id: searchOptions.value.order_id,
      };
    },
  },
  {
    component: "ReservedOrderCode",
    model: 'reserved_order_id',
    visible: true,
    props: {
      label: "Reserved Order",
      variant: "underlined",
      hideDetails: true,
    }
  },
  {
    component: "ReservedOrderItemCode",
    model: 'reserved_order_item_id',
    visible: true,
    get props() {
      return {
        label: "Reserved Order Item",
        variant: "underlined",
        hideDetails: true,
        order_id: searchOptions.value.reserved_order_id,
      };
    },
  },
  {
    component: "DictCode",
    model: 'exist_flag',
    visible: true,
    props: {
      label: "Exist",
      code: "exist_flag",
      hideDetails: true,
      multiple: true,
    }
  },
  {
    component: "DictCode",
    model: 'status',
    visible: true,
    props: {
      label: "Status",
      code: "finished_product_status",
      hideDetails: true,
      multiple: true,
    }
  },
  // 其他表单项配置...
]);

const {proxy} = getCurrentInstance();
const commonStore = useCommonStore();

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true
  },
  config: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  storageKey: String
});

const emit = defineEmits(['update:modelValue', 'search', 'reset']);

const visible = ref(false);

const selected = ref([]);
const unselected = ref([]);

const formData = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});

const formStore = computed(() => commonStore.form[props.name] || {});

// 排序后的字段配置
const sortedFields = computed(() => 
  [...props.config].sort((a, b) => (a.order || 0) - (b.order || 0))
);

// 字段显示控制
const shouldShow = (field) => {
  return typeof field.visible === 'function'
    ? field.visible(formData.value) 
    : field.visible;
};

// 表单提交
const handleSubmit = () => {
  emit('search');
};

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  emit('reset');
}

const handleSetting = () => {
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
}

const handleSave = () => emit('save')

// 如果是false说明是要隐藏
const handleToggle = (key, value) => {
  const $selected = toRaw(selected.value);
  const $unselected = toRaw(unselected.value);
  if (value) {
    const $filterSelectedItem = remove($selected, (item) => item.key === key);
    selected.value = $selected;
    unselected.value = [
      ...$unselected,
      ...$filterSelectedItem,
    ];
  } else {
    const $filterUnselectedItem = remove($unselected, (item) => item.key === key);
    unselected.value = $unselected;
    selected.value = [
      ...$selected,
      ...$filterUnselectedItem,
    ];
  }
}

const updateFormConfigs = () => {
  const $form = toRaw(formStore.value);
  console.log("formStore", $form)
  // 说明没有配置过 此时配置默认值
  if (!isEmpty($form)) {
    console.log("*******")
  } else {
    const $configOrigin = [...toRaw(props.config)];
    const $configFilter = remove($configOrigin, (field) => shouldShow(field));
    console.log("$configOrigin", $configOrigin)
    console.log("$configFilter", $configFilter)
    selected.value = $configFilter.map(item => ({
      key: item.model,
      title: item.props.label,
      visible: true,
    }));
    unselected.value = $configOrigin.map(item => ({
      key: item.model,
      title: item.props.label,
      visible: false,
    }));
  }
}

onMounted(() => {
  updateFormConfigs();
  commonStore.$subscribe((res) => {
    // 接口获取数据后 重新初始化业务逻辑
    updateFormConfigs();
    console.log("数据获取成功.....")
  });

});
</script>
<style lang="scss" scoped>
.column {
  &-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #ffffff;
    cursor: pointer;
    padding: 0 2px;
    &:hover {
      background-color: #f3f3f3;
    }
    &-title {
      display: flex;
      flex: 1;
      flex-shrink: 0;
    }
  }
}
</style>
