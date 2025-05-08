<template>
  <div class="panel border">
    <v-form ref="decarburizationForm">
      <div class="text-subtitle-2 font-weight-regular pt-4 pb-4">{{ $t('test_list.detail.test_resistivity') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field type="number" v-model="form.check_digit_1_1" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <!-- <v-col cols="3">
          <v-text-field v-model="form.section" density="comfortable" variant="underlined" label="Section" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.section_size_code" density="comfortable" variant="underlined" label="Section Size Code" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.bloom" density="comfortable" variant="underlined" label="Bloom" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col> -->
        <v-col cols="3">
          <v-text-field type="number" v-model="form.kg" density="comfortable" variant="underlined" :label="$t('test_list.detail.kg')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.status" density="comfortable" variant="underlined" label="Status" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
        <v-col cols="3">
          <v-text-field type="number" v-model="form.temperature" density="comfortable" variant="underlined" :label="$t('test_list.detail.temperature')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
<!--        <v-col cols="3">-->
<!--          <v-text-field type="number" v-model="form.temp" density="comfortable" variant="underlined" label="Temp" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
        <v-col cols="3">
          <v-text-field type="number" v-model="form.humidity" density="comfortable" variant="underlined" :label="$t('test_list.detail.humidity')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.distance" density="comfortable" variant="underlined" :label="$t('test_list.detail.distance')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.volt" density="comfortable" variant="underlined" :label="$t('test_list.detail.voit')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.current" density="comfortable" variant="underlined" :label="$t('test_list.detail.current')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="actualResistivity" density="comfortable" variant="underlined" :label="$t('test_list.detail.resistivity_mo')" persistent-placeholder bg-color="white" clearable disabled />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="correctionFactorValue" density="comfortable" variant="underlined" :label="$t('test_list.detail.correction_factor')" persistent-placeholder bg-color="white" clearable disabled />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.resistivity" density="comfortable" variant="underlined" :label="$t('test_list.detail.correct_resistivity')" persistent-placeholder bg-color="white" clearable disabled />
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, toRefs, watch, onMounted } from "vue";
import { toast } from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import RunoutApi from "@/finished_product/runout_detail/api.js";
import ProductTypeApi from "@/product_type/api.js";
import { round } from "xe-utils";

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  runout_id: {
    type: Number,
    required: true
  }
})

// 创建本地数据副本
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const data = reactive({
  rules: {
    test_code: [
      value => {
        if (value) return true
        return 'Test Code is required.'
      }
    ]
  },
  correctionFactors: {
    5: 1.049,
    6: 1.044,
    7: 1.039,
    8: 1.034,
    9: 1.029,
    10: 1.024,
    11: 1.019,
    12: 1.014,
    13: 1.009,
    14: 1.005,
    15: 1.000,
    16: 0.995,
    17: 0.990,
    18: 0.986,
    19: 0.981,
    20: 0.977,
    21: 0.972,
    22: 0.968,
    23: 0.963,
    24: 0.959,
    25: 0.955,
    26: 0.951,
    27: 0.947,
    28: 0.942,
    29: 0.938,
    30: 0.943
  },
  product_type_id: null,
  dim3: null,
});

const { rules, correctionFactors, product_type_id, dim3 } = toRefs(data);

const getProductTypeId = async () => {
  try {
    const { data: runout } = await RunoutApi.getById(props.runout_id);
    data.product_type_id = runout.product_type_id;
    console.log('product_type:', data.product_type_id);
    await getDim3();
  } catch (error) {
    console.error('获取 product_type_id 失败:', error);
  }
}

const getDim3 = async () => {
  try {
    const { data: product_type } = await ProductTypeApi.getProductTypeDim3(data.product_type_id);
    data.dim3 = product_type;
    console.log('dim_3:', data.dim3);
  } catch (error) {
    console.error('获取 dim_3 失败:', error);
  }
}

// 计算修正后的温度商
const correctedTemperature = computed(() => {
  const temperature = form.value.temperature;
  if (temperature) {
    const quotient = Math.floor(10 * temperature / 10);
    const remainder = (10 * temperature) % 10;
    if (remainder > 4) {
      return quotient + 1;
    }
    return quotient;
  }
  return null;
});

// 计算 Correction Factor
const correctionFactor = computed(() => {
  const tempCorrection = correctedTemperature.value;
  if (tempCorrection !== null && correctionFactors.value[tempCorrection] !== undefined) {
    return correctionFactors.value[tempCorrection];
  }
  return null;
});

// 计算 Actual Resistivity
const actualResistivity = computed(() => {
  const { kg, volt, current, distance } = form.value;
  if (kg && volt && current && distance && dim3.value) {
    const adjustedKg = kg / dim3.value;
    const result = ((adjustedKg * volt) / (distance * current * 7.85)) * 100;
    return Math.floor(result*100)/100;
  }
  return null;
});

// 计算 Correction Resistivity 并更新 form.resistivity
watch([actualResistivity, correctionFactor], ([actualResistivityValue, correctionFactorValue]) => {
  if (actualResistivityValue !== null && correctionFactorValue !== null) {
    const correctionResistivity = actualResistivityValue * correctionFactorValue;
    form.value.resistivity = round(correctionResistivity, 2);
  } else {
    form.value.resistivity = null;
  }
});

const correctionFactorValue = computed({
  get: () => correctionFactor.value,
  set: (val) => val
});

const handleClose = () => {
  nextTick(() => {
    proxy.$refs["decarburizationForm"].resetValidation();
  })
}

const getData = async () => {
  const { valid } = await proxy.$refs["decarburizationForm"].validate();
  if (!valid) {
    return;
  }
  return valid;
}

onMounted(() => {
  getProductTypeId();
})

defineExpose({
  getData,
});

</script>
<style scoped>

</style>
