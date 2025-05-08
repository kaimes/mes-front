<template>
  <v-form ref="impactForm">
    <div class="panel border">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">Test Impact</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field type="number" v-model="form.check_digit_1_1"  :readonly="!form.id" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <!-- <v-col cols="3">
          <v-text-field type="number" v-model="form.retest_seq" density="comfortable" variant="underlined" label="Retest Seq" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col> -->
        <v-col cols="3">
          <v-text-field v-model="form.testing_machine" density="comfortable" variant="underlined" :label="$t('test_list.detail.testing_machine')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.temp_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.temperature_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field type="number" v-model="form.temp_c" density="comfortable" variant="underlined" :label="$t('test_list.detail.temperature_c')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
            :class="getValueEqualClass(form.temp_c, 'temp_c')"
            :hint="getValueEqualHint('temp_c', 'temp_c')"
            persistent-hint
          ></v-text-field>
        </v-col>
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.temp_units" :maxlength="1" density="comfortable" variant="underlined" label="Units" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
        <v-col cols="3">
          <v-text-field type="number" v-model="form.energy_1_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_1_j')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
          :class="getValueGreaterThanClass(form.energy_1_j, 'ave_value_1')"
          :hint="getValueGreaterThanHint('energy_1_j', 'ave_value_1')"
          persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.energy_2_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_2_j')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
          :class="getValueGreaterThanClass(form.energy_2_j, 'ave_value_1')"
          :hint="getValueGreaterThanHint('energy_2_j', 'ave_value_1')"
          persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.energy_3_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_3_j')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
          :class="getValueGreaterThanClass(form.energy_3_j, 'ave_value_1')"
          :hint="getValueGreaterThanHint('energy_3_j', 'ave_value_1')"
          persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field readonly type="number" v-model="form.energy_average_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_average_j')" persistent-placeholder bg-color="white" :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.energy_1_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_1_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.energy_2_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_2_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.energy_3_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_3_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field readonly type="number" v-model="form.energy_average_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_average_f')" persistent-placeholder bg-color="white" :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.shear_1" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_1')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.shear_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_2')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.shear_3" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_3')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field readonly type="number" v-model="form.shear_average" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_average')" persistent-placeholder bg-color="white" :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field type="number" v-model="form.impact_size" density="comfortable" variant="underlined" :label="$t('test_list.detail.impact_size')" persistent-placeholder bg-color="white" :disabled="disabled"></v-text-field>
        </v-col>
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.energy_units" :maxlength="1" density="comfortable" variant="underlined" label="Energy Units" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.impact_units" :maxlength="1" density="comfortable" variant="underlined" label="Impact Units" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
<!--        <v-col cols="3">-->
<!--         <v-text-field v-model="form.susp" density="comfortable" variant="underlined" label="Test Susp" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->

<!--         <v-col cols="3">-->
<!--          <v-text-field  v-model="form.standard" density="comfortable" variant="underlined" label="Test Standard" persistent-placeholder bg-color="white" clearable :disabled="disabled"-->
<!--            :rules="rules.standard"-->
<!--            persistent-hint-->
<!--          ></v-text-field>-->
<!--         </v-col>-->
      </v-row>
    </div>
    <div class="panel border mt-4">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">Retest 1</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field type="number" v-model="form.check_digit_2_2"  :readonly="!form.id" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_1')" persistent-placeholder bg-color="white" clearable readonly :disabled="disabled"></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field v-model="form.r1_testing_machine" density="comfortable" variant="underlined" :label="$t('test_list.detail.testing_machine')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_temp_c" density="comfortable" variant="underlined" :label="$t('test_list.detail.temperature_c')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
          :class="getValueEqualClass(form.r1_temp_c, 'temp_c')"
          :hint="getValueEqualHint('r1_temp_c', 'temp_c')"
          persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_temp_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.temperature_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_energy_1_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_j')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
          :class="getValueGreaterThanClass(form.r1_energy_1_j, 'ave_value_1')"
          :hint="getValueGreaterThanHint('r1_energy_1_j', 'ave_value_1')"
          persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_energy_2_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_j')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
          :class="getValueGreaterThanClass(form.r1_energy_2_j, 'ave_value_1')"
          :hint="getValueGreaterThanHint('r1_energy_2_j', 'ave_value_1')"
          persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_energy_3_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_j')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
          :class="getValueGreaterThanClass(form.r1_energy_3_j, 'ave_value_1')"
          :hint="getValueGreaterThanHint('r1_energy_3_j', 'ave_value_1')"
          persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field readonly type="number" v-model="form.r1_energy_average_j" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_average_j')" persistent-placeholder bg-color="white" :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_energy_1_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_1_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_energy_2_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_1_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_energy_3_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_1_f')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field readonly type="number" v-model="form.r1_energy_average_f" density="comfortable" variant="underlined" :label="$t('test_list.detail.energy_average_f')" persistent-placeholder bg-color="white" :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_shear_1" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_1')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_shear_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_2')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.r1_shear_3" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_3')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field readonly type="number" v-model="form.r1_shear_average" density="comfortable" variant="underlined" :label="$t('test_list.detail.shear_average')" persistent-placeholder bg-color="white" :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.r1_tester" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.r1_temp_units" density="comfortable" maxlength="1" variant="underlined" label="Temp Units" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.r1_impact_units" density="comfortable" maxlength="1" variant="underlined" label="Impact Units" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.r1_energy_units" density="comfortable" maxlength="1" variant="underlined" label="Energy Units" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->

<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.r1_susp" density="comfortable" variant="underlined" label="Test Susp" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
      </v-row>
    </div>

  </v-form>
</template>
<script setup>
import {computed, getCurrentInstance, nextTick, reactive, toRaw, toRefs, watch, ref} from "vue";
import { toast } from "vue3-toastify";
import API from "@/test_admin/test_list/api";
import { useI18n } from "vue-i18n";
const {proxy} = getCurrentInstance();
const emit = defineEmits(['update:modelValue', 'update:validationStatus'])

const { t } = useI18n()
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  spec_id: {
    type: Number,
    required: true
  },
  test_sample_id: {
    type: Number,
    required: true
  },
  test_standard: {
    type: String,
    default: null
  }
})

// 创建本地数据副本
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const data = reactive({
  rules: {
    check_digit_1_1: [
      value => {
        if (!form.value.id) return true;
        if (form.value.check_digit_1 !== value) return "Check Digit 0 is incorrect"
        return true;
      }
    ],
    check_digit_2_2: [
      value => {
        if (!form.value.id) return true;
        if (form.value.check_digit_2 !== value) return "Check Digit 1 is incorrect"
        return true;
      }
    ],
    standard: [
      value=>{
        if (!value) return true;
        return ['1', '2'].includes(value) || 'only 1(BSEN) or 2(ASTM)'; 
      }
    ]
  }
});


const { rules } = toRefs(data);

const testRequire = ref({})

const handleClose = () => {
  nextTick(() => {
    proxy.$refs["impactForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["impactForm"].validate();
  if (!valid) {
    return;
  }
  return valid;
}

watch(
    () => [
      form.value.energy_1_f,
      form.value.energy_2_f,
      form.value.energy_3_f
    ],
    ([e1, e2, e3]) => {
      const sum = [e1, e2, e3]
          .filter(v => v !== null && v !== undefined && v !== '')
          .reduce((acc, cur) => acc + Number(cur), 0);

      form.value.energy_average_f = Math.round(sum / 3);
    },
    { deep: true, immediate: true }
);

watch(
    () => [
      form.value.r1_shear_1,
      form.value.r1_shear_2,
      form.value.r1_shear_3
    ],
    ([e1, e2, e3]) => {
      const sum = [e1, e2, e3, form.value.shear_1, form.value.shear_2, form.value.shear_3]
          .filter(v => v !== null && v !== undefined && v !== '')
          .reduce((acc, cur) => acc + Number(cur), 0);

      form.value.r1_shear_average = (sum / 6).toFixed(2);
    },
    { deep: true,  }
);

watch(
    () => [
      form.value.r1_energy_1_f,
      form.value.r1_energy_2_f,
      form.value.r1_energy_3_f
    ],
    ([e1, e2, e3]) => {
      const sum = [e1, e2, e3, form.value.energy_1_f, form.value.energy_2_f, form.value.energy_3_f]
          .filter(v => v !== null && v !== undefined && v !== '')
          .reduce((acc, cur) => acc + Number(cur), 0);

      form.value.r1_energy_average_f = Math.round(sum / 6);
    },
    { deep: true,  }
);

watch(
    () => [
      form.value.r1_energy_1_j,
      form.value.r1_energy_2_j,
      form.value.r1_energy_3_j
    ],
    ([e1, e2, e3]) => {
      const sum = [e1, e2, e3, form.value.energy_1_j, form.value.energy_2_j, form.value.energy_3_j]
          .filter(v => v !== null && v !== undefined && v !== '')
          .reduce((acc, cur) => acc + Number(cur), 0);

      form.value.r1_energy_average_j = Math.round(sum / 6);

      if (props.test_standard !== "BSEN"){
        form.value.r1_energy_1_f = e1 ? (Number(e1) * 0.73756).toFixed(2) : null;
        form.value.r1_energy_2_f = e2 ? (Number(e2) * 0.73756).toFixed(2) : null;
        form.value.r1_energy_3_f = e3 ? (Number(e3) * 0.73756).toFixed(2) : null;
      }
      else {
        form.value.r1_energy_1_f = null
        form.value.r1_energy_2_f = null
        form.value.r1_energy_3_f = null
      }


      if (form.value.r1_energy_average_j) {
        form.value.energy_average_f = null; // 或 null，看你需求
        form.value.energy_average_j = null;
      }
    },
    { deep: true,  }
);

watch(
    () => [
      form.value.energy_1_j,
      form.value.energy_2_j,
      form.value.energy_3_j
    ],
    ([e1, e2, e3]) => {
      const sum = [e1, e2, e3]
          .filter(v => v !== null && v !== undefined && v !== '')
          .reduce((acc, cur) => acc + Number(cur), 0);

      form.value.energy_average_j = Math.round(sum / 3);

      if (props.test_standard !== "BSEN"){
        form.value.energy_1_f = e1 ? (Number(e1) * 0.73756).toFixed(2) : null;
        form.value.energy_2_f = e2 ? (Number(e2) * 0.73756).toFixed(2) : null;
        form.value.energy_3_f = e3 ? (Number(e3) * 0.73756).toFixed(2) : null;
      }
      else {
        form.value.energy_1_f = null
        form.value.energy_2_f = null
        form.value.energy_3_f = null
      }


    },
    { deep: true, immediate: true }
);

watch(
    () => [
      form.value.shear_1,
      form.value.shear_2,
      form.value.shear_3
    ],
    ([e1, e2, e3]) => {
      const sum = [e1, e2, e3]
          .filter(v => v !== null && v !== undefined && v !== '')
          .reduce((acc, cur) => acc + Number(cur), 0);

      form.value.shear_average = (sum / 3).toFixed(2);
    },
    { deep: true, immediate: true }
);

defineExpose({
  getData,
});


const loadTestSpecRequire = async () => {
  if (!props.spec_id || !props.test_sample_id) {
    return;
  }

  try {
    // 调用API加载数据
    const response = await API.getSpImpactSpecRequire({
      spec_id: props.spec_id,
      test_sample_id: props.test_sample_id
    });
    testRequire.value = response.data;;
  } catch (error) {
    testRequire.value = {};
    toast.error( error.response.data?.detail || "load impact spec require failed" , {
          autoClose: 60000
    });
  }
};


watch(
  [() => props.spec_id, () => props.test_sample_id],
  ([newSpecId, newTestSampleId], [oldSpecId, oldTestSampleId]) => {
    console.log("watch",newSpecId, newTestSampleId, oldSpecId, oldTestSampleId)
    if (newSpecId !== oldSpecId || newTestSampleId !== oldTestSampleId) {
      loadTestSpecRequire();
    }
  },
  { immediate: true } // 组件创建时立即执行一次
);

const isValueGreaterThan = (testVal, specAttr) => {
  if (!testVal || !testRequire.value) {
    return true;
  }
  const numValue = parseFloat(testVal);
  const minValue = testRequire.value[`${specAttr}`] || 0;
  const isValid = Number(numValue) >= Number(minValue);
  return isValid;
}

const getValueGreaterThanClass = (testVal, specAttr) => {
  if (!testVal || !testRequire.value) return 'text-normal';
  return isValueGreaterThan(testVal, specAttr) ? 'text-success' : 'text-error';
}

const getValueGreaterThanHint = (testAttr, specAttr) => {
  if (!testRequire.value) return '';
  const value = form.value[testAttr];
  if (!value) return '';
  if (isValueGreaterThan(value, specAttr)) return '';
  
  const minValue = testRequire.value[`${specAttr}`] || 0;
  return `range: ≥${minValue}`;
}

const getValueEqualClass = (testVal, specAttr) => {
  if (!testVal || testRequire.value[`${specAttr}`] === null || testRequire.value[`${specAttr}`] === undefined) {
    return 'text-normal';
  }
  const isValid = testVal === testRequire.value[`${specAttr}`];
  return isValid ? 'text-success' : 'text-error';
}


const getValueEqualHint = (testAttr, specAttr) => {
  if (!testRequire.value || testRequire.value[`${specAttr}`] === null || testRequire.value[`${specAttr}`] === undefined) return '';
  const value = form.value[testAttr];
  if (!value) return '';
  if ( String(value) === String(testRequire.value[`${specAttr}`])) {
    return '';
  }
  return `= ${testRequire.value[`${specAttr}`]}`;
}

const fieldValidationStatus = computed(() => ({
  temp_c_valid: getValueEqualClass(form.value.temp_c, 'temp_c') != 'text-error',
  energy_1_j_valid: getValueGreaterThanClass(form.value.energy_1_j, 'ave_value_1') != 'text-error',
  energy_2_j_valid: getValueGreaterThanClass(form.value.energy_2_j, 'ave_value_1') != 'text-error',
  energy_3_j_valid: getValueGreaterThanClass(form.value.energy_3_j, 'ave_value_1') != 'text-error',
  r1_temp_c_valid: getValueEqualClass(form.value.r1_temp_c, 'temp_c') != 'text-error',
  r1_energy_1_j_valid: getValueGreaterThanClass(form.value.r1_energy_1_j, 'ave_value_1') != 'text-error',
  r1_energy_2_j_valid: getValueGreaterThanClass(form.value.r1_energy_2_j, 'ave_value_1') != 'text-error',
  r1_energy_3_j_valid: getValueGreaterThanClass(form.value.r1_energy_3_j, 'ave_value_1') != 'text-error',
}));

watch(fieldValidationStatus, (newVal) => {
  const allPass = Object.values(newVal).every(val => val === true);
  const pass_status = allPass ? 'P' : 'F';
  emit('update:validationStatus', pass_status);
})

</script>
<style scoped>
.text-success :deep(.v-field__input){
  color: green !important;
}
.text-error :deep(.v-field__input){
  color: red !important;
  font-weight: bold;
}

.text-normal :deep(.v-field__input){
  color: #333 !important;
}
</style>
