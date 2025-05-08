<template>
  <div class="panel border">
    <v-form ref="prodanForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_prodan') }}</div>
      <v-row align="center">
        <v-col cols="3">
  <v-text-field type="number" v-model="form.result_c" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_c')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_si" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_si')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_mn" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_mn')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_p" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_p')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_s" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_s')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_cr" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_cr')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_mo" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_mo')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_ni" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_ni')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_al" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_al')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_b" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_b')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_co" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_co')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_cu" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_cu')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_nb" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_nb')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_sn" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_sn')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_ti" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_ti')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_v" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_v')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_ca" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_ca')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_n2" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_n2')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_o" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_o')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_h" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_h')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_sal" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_sal')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_as" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_as')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_bi" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_bi')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_ce" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_ce')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_pb" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_pb')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_sb" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_sb')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_w" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_w')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_zn" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_zn')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.result_zr" density="comfortable" variant="underlined" :label="$t('test_list.detail.result_zr')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script setup>
import {computed, nextTick, reactive, toRaw, toRefs} from "vue";
import { toast } from "vue3-toastify";
import MillCode from "@/components/picker/MillCode.vue";
import TestSampleCode from "@/components/picker/TestSampleCode.vue";

const emit = defineEmits(['update:modelValue'])

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
  }
});


const { rules } = toRefs(data);

const handleClose = () => {
  nextTick(() => {
    proxy.$refs["prodanForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["prodanForm"].validate();
  if (!valid) {
    return;
  }
  return valid;
}


defineExpose({
  getData,
});

</script>
<style scoped>

</style>
