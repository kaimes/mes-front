<template>
  <div class="panel border">
    <v-form ref="decarForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_requirements') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field v-model="form.decarb_value_max" density="comfortable" variant="underlined" :label="$t('test_list.detail.decarb_value_max')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
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
    decarb_value_max: undefined,
  };
  nextTick(() => {
    proxy.$refs["decarForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["decarForm"].validate();
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
