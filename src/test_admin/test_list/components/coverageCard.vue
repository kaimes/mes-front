<template>
  <div class="panel border">
    <v-form ref="coverageForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">Test Coverage</div>
      <v-row align="center">
        <v-col cols="3">
          <finished-product-code v-model="form.finished_product_id" placeholder="" density="comfortable" persistent-placeholder :hide-details="false" />
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.covered_weight_kg" density="comfortable" variant="underlined" label="Covered Weight(kg)" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="form.covered_quantity" density="comfortable" variant="underlined" label="Covered Quantity" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" label="Tested by" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script setup>
import {computed, nextTick, reactive, toRaw, toRefs} from "vue";
import { toast } from "vue3-toastify";
import FinishedProductCode from "@/components/picker/FinishedProductCode.vue";

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
    proxy.$refs["coverageForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["coverageForm"].validate();
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
