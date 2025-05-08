<template>
  <div class="panel border">
    <v-form ref="cleannessForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_requirements') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field type="number" v-model="form.check_digit_1_1" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.testing_machine" density="comfortable" variant="underlined" :label="$t('test_list.detail.testing_machine')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.type" density="comfortable" variant="underlined" :label="$t('test_list.detail.type')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.k_number" density="comfortable" variant="underlined" :label="$t('test_list.detail.k_number')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.k_value" density="comfortable" variant="underlined" :label="$t('test_list.detail.k_oxide')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
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
import { useI18n } from "vue-i18n";

const { t } = useI18n()

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
    proxy.$refs["cleannessForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["cleannessForm"].validate();
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
