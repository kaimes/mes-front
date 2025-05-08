<template>
  <div class="panel border">
    <v-form ref="tensileForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.spec_requirements') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field v-model="form.spec_units" density="comfortable" variant="underlined" :label="$t('test_list.detail.spec_unit')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tensile_min" density="comfortable" variant="underlined" :label="$t('test_list.detail.tensile_min')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tensile_max" density="comfortable" variant="underlined" :label="$t('test_list.detail.tensile_max')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.yield_min" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_min')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.yield_max" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_max')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.y_t_min" density="comfortable" variant="underlined" :label="$t('test_list.detail.y_min')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.y_t_max" density="comfortable" variant="underlined" :label="$t('test_list.detail.y_max')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.elongation_code" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_code')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.elongation_min" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_min')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script setup>
import {computed, nextTick, reactive, toRaw, toRefs} from "vue";
import { toast } from "vue3-toastify";
import DictCode from "@/components/picker/DictCode.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const data = reactive({
  rules: {
    test_code: [
      value => {
        if (value) return true
        return 'Test Code is required.'
      }
    ]
  }
});


const { rules } = toRefs(data);

// 创建本地数据副本
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  form.value = {
    spec_units: undefined,
    tensile_min: undefined,
    tensile_max: undefined,
    yield_min: undefined,
    yield_max: undefined,
    y_t_min: undefined,
    y_t_max: undefined,
    elongation_code: undefined,
    elongation_min: undefined,
  };
  nextTick(() => {
    proxy.$refs["tensileForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["tensileForm"].validate();
  if (!valid) {
    return;
  }
  return toRaw(form.value);
}


defineExpose({
  getData,
});

</script>
<style scoped>

</style>
