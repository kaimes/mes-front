<template>
  <v-form ref="multForm">
    <div class="d-flex align-center pr-5 pb-4 pt-4">
      <div class="text-body-1 font-weight-bold ml-5 mb-1">
        Wasted: <span :class="{ 'text-red': wastedLength < 0 }">{{ wastedLength }}</span>mm,
        Original: {{ originLength }}mm
        <span v-if="form.items.length > 1">, new mult will be created</span>
        <span v-if="productTypeCodes.length > 0">
          , Product Type Codes:
          <template v-if="productTypeCodes.length > 2">
            {{ productTypeCodes.join() }}+ 。。。
          </template>
          <template v-else>
            {{ productTypeCodes.join() }}
          </template>
        </span>
      </div>
      <v-spacer></v-spacer>
      <div v-if="defaultMillCode !== 'SRSM'" class="d-flex align-center" style="width:150px">
        <v-text-field
            v-model.number="cutSampleLengthMM"
            :min="0"
            label="Test Sample(mm)"
            persistent-placeholder
            density="compact"
            variant="outlined"
            hide-details
        ></v-text-field>
      </div>
      <!-- <div class="pl-5 pr-5">
        <v-checkbox
            v-model="form.is_cover"
            label="Overwrite Spec"
            color="orange"
            hide-details
        ></v-checkbox>
      </div> -->
      <template v-if="canAdd && defaultMillCode !== 'SRSM'">
        <v-btn density="comfortable" class="ml-4" variant="outlined" icon="mdi-plus" @click="handleAddItem"></v-btn>
      </template>
    </div>
    <div v-for="(item, index) in form.items" class="mult" :key="item.key">
      <div class="mult-content pa-4 border rounded">
        <mult-item v-model="form.items[index]" :product="product" :max="wastedLength" :rules="rules" />
      </div>
      <div class="mult-action">
        <template v-if="form.items.length > 1">
          <v-btn density="comfortable" variant="outlined" icon="mdi-minus" @click="handleRemoveItem(item)"></v-btn>
        </template>
        <template v-else>
          <div class="pa-4"></div>
        </template>
      </div>
    </div>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <div class="d-flex ga-2 align-center">
        <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleClose">
          Cancel
        </v-btn>
        <v-btn :disabled="!isSameProductType || canConfirm6 || canConfirm7" class="text-none" color="primary" variant="flat" :loading="loading" @click="handleSave(false)">
          Confirm
        </v-btn>
        <!-- <v-btn v-permission="`Allocate Force Confirm`" :disabled="!isSameProductType || canConfirm6" class="text-none" color="primary" variant="flat" :loading="loading" @click="handleSave(true)">
          Force Confirm
        </v-btn> -->
        <v-btn  class="text-none" color="primary" variant="flat" :loading="loading" @click="handleSave(true)">
          Force Confirm
        </v-btn>
      </div>

    </v-card-actions>
  </v-form>
</template>
<script setup>
import {computed, getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {toast} from "vue3-toastify";
import {v4 as uuidv4} from 'uuid';
import {useStore} from "vuex";
import {filter, findLast, forEach, head, map, includes, compact, uniq, reject, sortBy} from "lodash";
import MultItem from "./multItem.vue";
import API from "../api";

const {proxy} = getCurrentInstance();
const store = useStore();
const emit = defineEmits(['refresh']);

const props = defineProps({
  length: {
    type: Number,
    default: 1,
  },
  tableList: {
    type: Array,
    default: () => []
  }
})

const loading = ref(false);
const cutSampleLengthMM = ref(0);

const data = reactive({
  form: {
    is_cover: true,
    items: [
      {
        key: uuidv4(),
        "order_id": undefined,
        "order_item_id": undefined,
        "spec_id": undefined,
        "spec_code": undefined,
        "product_type_code": undefined,
        "length_mm": undefined,
        "defective_length": undefined,
        "quantity": undefined,
        "allocation_status": "allocate",
        "defect_reason_id": undefined,
        "status_change_reason": undefined,
        "allocate_reason": undefined,
        "defect_comment": undefined,
        "cut_sample_length_mm": 0,
        "waste": 0,
        "compliance": "0",
      }
    ]
  },
  rules: {
    order_id: [
      value => {
        if (value) return true
        return 'Order Number is required.'
      }
    ],
    order_item_id: [
      value => {
        if (value) return true
        return 'Item No is required.'
      }
    ],
    defect_reason_id: [
      value => {
        if (value) return true
        return 'Defect Reason is required.'
      }
    ],
    status_change_reason: [
      value => {
        if (value) return true
        return 'Change Reason is required.'
      }
    ],
    length_mm: [
      value => {
        if (value > 0) return true
        return 'Length is required.'
      },
      value => {
        if (wastedLength.value < 0) {
          return 'Length value is incorrect.'
        }
        return true
      }
    ],
    defective_length: [
      value => {
        if (wastedLength.value < 0) {
          return 'Defective Length value is incorrect.'
        }
        return true
      }
    ],
    quantity: [
      value => {
        if (defaultMillCode.value !== 'SRSM') {
          if (value > 0) return true
          return 'Quantity is required.'
        } else {
          return true;
        }
      },
      value => {
        if (defaultMillCode.value !== 'SRSM') {
          if (wastedLength.value < 0) {
            return 'Quantity value is incorrect.'
          }
          return true
        } else {
          return true;
        }
      }
    ],
  }
});

const { form, rules } = toRefs(data);

const defaultMillCode = computed(() => store.state.auth.defaultMillCode);
// 获取选中数据里面长度最小的
const product = computed(() => {
  const products = sortBy(props.tableList, "length_mm");
  return head(products);
});

// 判断 Product Type code是否一样
const isSameProductType = computed(() => {
  const codes = map(props.tableList, item => item.product_type?.code);
  const $value = uniq(compact(codes));
  return $value.length === 1;
});

const originLength = computed(() => {
  let value = 0;
  forEach(props.tableList, (item) => {
    value += parseFloat(`${(item.length_mm || 0)}`);
  });
  return value;
});

watch(() => form.value.items, (val) => {
  const wasted = filter(form.value.items, (item) => item.cut_sample_length_mm === 500);
  cutSampleLengthMM.value = wasted.length > 0 ? 500 : 0;
}, {
  deep: true,
})

// 计算最大可以切的长度
const wastedLength = computed(() => {
  const { length_mm,defective_length } = product.value;
  let wasted = 0;
  forEach(form.value.items, (item) => {
    if (item.allocation_status === "allocate") {
      wasted += parseFloat(`${(item.length_mm || 0)}`) * parseInt(`${(item.quantity || 0)}`) + cutSampleLengthMM.value;
    } else {
      wasted += parseFloat(`${(item.length_mm || 0)}`);
    }
    if (item.allocation_status === "free_stock") {
      wasted += parseFloat(`${(item.defective_length || 0)}`);
    }
  });
  return length_mm + defective_length - wasted;
});

// 获取product_type_code
const productTypeCodes = computed(() => {
  const $items = map(props.tableList, (item) => item.product_type?.code);
  return uniq(compact($items));
});

// 包含7的是否可以 confirm
const canConfirm7 = computed(() => {
  // 如果是SRSM 则不需要判断
  if (defaultMillCode.value === "SRSM") {
    return false;
  }
  const wasted = filter(form.value.items, (item) => item.allocation_status === "allocate" && (includes(`${item.compliance}`, '7') || `${item.compliance}`.length === 1));
  return wasted.length > 0;
});

// 包含6的是否可以 confirm
const canConfirm6 = computed(() => {
  // 如果是SRSM 则不需要判断
  if (defaultMillCode.value === "SRSM") {
    return false;
  }
  const wasted = filter(form.value.items, (item) => {
    if (item.allocation_status !== "allocate") {
      return false;
    }
    const $compliance = `${item.compliance}`;
    if ($compliance.length <= 1) {
      return true;
    }
    const $arr = $compliance.split("");
    return parseFloat($arr[0]) <= 6 || parseFloat($arr[1]) <= 6;

  });
  return wasted.length > 0;
});

// 判断是否可以添加数据 如果存在非order类型的数据
const canAdd = computed(() => {
  const hasBundle = props.tableList.some(item => item.type === 'bundle');
  if (hasBundle) {
    return false;
  }
  
  const items = filter(form.value.items, (item) => item.allocation_status !== "allocate");
  return items.length === 0 && props.tableList.length === 1;
});

const handleAddItem = () => {
  const { items } = toRaw(form.value);
  // 如果剩余的长度为0了 就不允许切了
  if (wastedLength.value <= 0) {
    toast.warning("No remaining length to cut", {
      position: "bottom-center"
    });
    return;
  }
  const allocationStatus = wastedLength.value < 6000 ? "scrap" : "allocate";
  form.value.items = [
      ...items,
    {
      key: uuidv4(),
      "order_id": undefined,
      "order_item_id": undefined,
      "spec_id": undefined,
      "spec_code": undefined,
      "product_type_code": undefined,
      "length_mm": wastedLength.value,
      "quantity": allocationStatus === "allocate" ? 1 : undefined,
      "allocation_status": allocationStatus,
      "defect_reason_id": undefined,
      "status_change_reason": undefined,
      "allocate_reason": undefined,
      "defect_comment": undefined,
      "cut_sample_length_mm": 0,
      "waste": 0,
      "compliance": "0",
    }
  ];
}

const handleRemoveItem = (item) => {
  const { items } = toRaw(form.value);
  form.value.items = reject(items, {key: item.key});
}

const handleClose = () => {
  form.value = {
    is_cover: true,
    items: [
      {
        key: uuidv4(),
        "order_id": undefined,
        "order_item_id": undefined,
        "spec_id": undefined,
        "spec_code": undefined,
        "product_type_code": undefined,
        "length_mm": undefined,
        "quantity": undefined,
        "allocation_status": "allocate",
        "defect_reason_id": undefined,
        "status_change_reason": undefined,
        "allocate_reason": undefined,
        "defect_comment": undefined,
        "cut_sample_length_mm": 0,
        "waste": 0,
        "compliance": "0",
      }
    ]
  };
  nextTick(() => {
    proxy.$refs["multForm"].resetValidation();
  })
  emit('refresh', 'close');
}

const handleSave = async (force) => {
  const {valid} = await proxy.$refs["multForm"].validate();
  if (!valid) {
    return;
  }
  const ids = props.tableList.map(item => item.id);
  const { items, is_cover } = toRaw(form.value);
  // 先判断长度是否一致&是否是SRSM
  const { length_mm, spec_code, ...rest } = product.value;
  // 判断如果是SRSM
  if (defaultMillCode.value === "SRSM") {
    const $order = head(items);    
    if (spec_code && $order.allocation_status === "allocate" && $order.spec_code !== spec_code) {
      toast.error("Spec Code is different", { autoClose: 60000 });
      return;
    }
  }
  if (!force) {
    // props.tableList 获取spec_id 并去重
    const runoutIds = Array.from(new Set(props.tableList.map(item => item.runout_id)));

    // data 转set
    if (defaultMillCode.value === "TBM") {
      const {data} = await API.getSpecByRunout({runout_ids: runoutIds});
      const canSpecs = new Set(data.map(item=> item.spec_code))
      const orderSpecs = new Set( items.filter(item=>item?.order_id !== undefined).map(item => item.spec_code));
      // orderSpecs 必须都在 canSpecs 里面
      if (orderSpecs.size > 0 && !Array.from(orderSpecs).every(item => canSpecs.has(item))) {
        toast.error("Spec is not allowed", { autoClose: 60000 });
        return;
      }
    }
    }

  let params = {};
  if (items.length === 1) {
    params = {
      ids,
      is_cover,
      "mult": {
        "waste_length": wastedLength.value,
        ...items[0],
        "cut_sample_length_mm": cutSampleLengthMM.value,
      },
      "regulars": []
    }
  } else {
    const scrap = findLast(items, item => item["allocation_status"] !== "allocate") || {};
    params = {
      ids,
      is_cover,
      "mult": {
        "waste_length": wastedLength.value,
        ...scrap,
        "cut_sample_length_mm": cutSampleLengthMM.value,
      },
      "regulars": items.map(({ cut_sample_length_mm,compliance,waste, ...rest }) => ({
        ...rest
      }))
    };
  }
  delete params.mult.compliance;
  delete params.mult.waste;
  if (params.mult.defective_length && params.mult.length_mm && parseFloat(params.mult.defective_length) > parseFloat(params.mult.length_mm)) {
    toast.error("defective_length can't be greater than length_mm", { autoClose: 60000 });
    return false;
  }
  try {
    await API.createMult(params);
    toast.success("Allocate Success", {
      position: "bottom-center"
    });
    emit('refresh', 'refresh');
  } catch (res) {
    const { data } = res.response;
    toast.error(data?.detail || "Allocate Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}



defineExpose({
  handleSave,
});
</script>
<style lang="scss" scoped>
.mult {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  margin-bottom: 18px;
  &-content {
    flex: 1;
  }
  &-action {
    padding-left: 12px;
  }
}
</style>
