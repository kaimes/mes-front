<template>
  <div class="panel border">
    <v-form ref="decarburizationForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_decarburization') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field type="number" v-model="form.check_digit_1_1" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.section" density="comfortable" variant="underlined" :label="$t('test_list.detail.section')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.section_size_code" density="comfortable" variant="underlined" :label="$t('test_list.detail.section_siez_code')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
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
<!--        <v-col cols="3">-->
<!--          <spec-code v-model="form.spec_id" placeholder="" density="comfortable" persistent-placeholder :store="false" :hide-details="false" />-->
<!--        </v-col>-->
        <v-col cols="3">
          <v-text-field type="number" v-model="form.max" density="comfortable" variant="underlined" :label="$t('test_list.detail.max')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.status" density="comfortable" variant="underlined" :label="$t('test_list.detail.status')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.decarburisation" density="comfortable" variant="underlined" :label="$t('test_list.detail.decarburisation')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.decarburisation_min" density="comfortable" variant="underlined" :label="$t('test_list.detail.decarburisation_min')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.decarburisation_max" density="comfortable" variant="underlined" :label="$t('test_list.detail.decarburisation_max')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          
          <v-text-field v-model="form.decarb" density="comfortable" variant="underlined" :label="$t('test_list.detail.decarb')" persistent-placeholder bg-color="white" clearable :disabled="disabled" @blur="handleBlur('decarb')"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script setup>
import {computed, nextTick, reactive, toRaw, toRefs} from "vue";
import { toast } from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import DictCode from "@/components/picker/DictCode.vue";

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


const handleBlur = (field, type = "double") => {
  let value = form.value[field];
  if (!value) {
    form.value[field] = undefined;
  } else {
    form.value[field] = type === "double" ? parseFloat(value).toFixed(2) : parseInt(value, 10);
  }
}

defineExpose({
  getData,
});

</script>
<style scoped>

</style>
