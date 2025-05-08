<template>
  <div class="panel border pt-6">
    <v-form ref="sulphurForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_sulphur') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field v-model="form.check_digit_1_1" type="number" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
<!--        <v-col cols="3">-->
<!--          <v-text-field v-model="form.testing_machine" density="comfortable" variant="underlined" label="Testing Machine" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>-->
<!--        </v-col>-->
        <v-col cols="3">
          <v-text-field v-model="form.rail_grade" type="number" density="comfortable" variant="underlined" :label="$t('test_list.detail.rail_grade')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.max" density="comfortable" variant="underlined" :label="$t('test_list.detail.max')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.result" density="comfortable" variant="underlined" :label="$t('test_list.detail.result')" persistent-placeholder bg-color="white" clearable :disabled="disabled" />
        </v-col>
        <v-col cols="3">
          <dict-code
              v-model="form.d_val"
              :disabled="disabled"
              density="comfortable"
              :label="$t('test_list.detail.d_val')"
              code="test_sulphur_d_val"
              persistent-placeholder
              :hide-details="false"
              clearable
          />
        </v-col>
        <v-col cols="3">
          <dict-code
              v-model="form.in_spec"
              :disabled="disabled"
              density="comfortable"
              :label="$t('test_list.detail.in_spec')"
              code="pass_status"
              persistent-placeholder
              :hide-details="false"
              clearable
          />
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
    rail_grade: undefined,
    max: undefined,
    result: undefined,
    d_val: undefined,
    in_spec: undefined,
  };
  nextTick(() => {
    proxy.$refs["sulphurForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["sulphurForm"].validate();
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
