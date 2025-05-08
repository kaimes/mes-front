<template>
  <div class="panel border">
    <v-form ref="decarburizationForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_hydrogen') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field type="number" v-model="form.check_digit_1_1" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.section" density="comfortable" variant="underlined" :label="$t('test_list.detail.section')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.section_size_code" density="comfortable" variant="underlined" :label="$t('test_list.detail.section_size_code')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.bloom" density="comfortable" variant="underlined" :label="$t('test_list.detail.bloom')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.inspection_authority_code" density="comfortable" variant="underlined" :label="$t('test_list.detail.inspection_authority_code')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.kg" density="comfortable" variant="underlined" :label="$t('test_list.detail.kg')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <spec-code v-model="form.spec_id" placeholder="" density="comfortable" persistent-placeholder :store="false" :hide-details="false" />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.max" density="comfortable" variant="underlined" :label="$t('test_list.detail.max')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.status" density="comfortable" variant="underlined" :label="$t('test_list.detail.status')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.spec_test" density="comfortable" variant="underlined" :label="$t('test_list.detail.spec_test')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.rail_grade" density="comfortable" variant="underlined" :label="$t('test_list.detail.rail_grade')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.max_test" density="comfortable" variant="underlined" :label="$t('test_list.detail.max_test')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.result" density="comfortable" variant="underlined" :label="$t('test_list.detail.result')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
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
import SpecCode from "@/components/picker/SpecCode.vue";
import CastCode from "@/components/picker/CastCode.vue";

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
    proxy.$refs["decarburizationForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["decarburizationForm"].validate();
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
