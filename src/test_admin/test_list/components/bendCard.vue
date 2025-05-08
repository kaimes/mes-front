<template>
  <div class="panel border">
    <v-form ref="bendForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_bend') }}</div>
      <v-row align="center">

        <v-col cols="3">
          <v-text-field type="number" v-model="form.check_digit_1_1" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_1')" persistent-placeholder bg-color="white" clearable :readonly="!form.id" :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.code" density="comfortable" variant="underlined" :label="$t('test_list.detail.code')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.test_standard" density="comfortable" variant="underlined":label="$t('test_list.detail.test_standard')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.heat_treated_by" density="comfortable" variant="underlined" :label="$t('test_list.detail.heat_treated_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <dict-code
              v-model="form.result_1"
              :disabled="disabled"
              density="comfortable"
              :label="$t('test_list.detail.result')"
              code="pass_status"
              persistent-placeholder
              :hide-details="false"
              clearable
          />

        </v-col>


      </v-row>
    </v-form>
  </div>
</template>
<script setup>
import {computed, getCurrentInstance, nextTick, reactive, toRaw, toRefs} from "vue";
import { toast } from "vue3-toastify";
import CastCode from "@/components/picker/CastCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const {proxy} = getCurrentInstance();
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
    check_digit_1_1: [
      value => {
        if (!form.value.id) return true;
        if (form.value.check_digit_1 !== value) return "Check Digit 1 is incorrect"
        return true;
      }
    ],
  }
});


const { rules } = toRefs(data);

const handleClose = () => {
  nextTick(() => {
    proxy.$refs["bendForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["bendForm"].validate();
  return valid;
}


defineExpose({
  getData,
});

</script>
<style scoped>

</style>
