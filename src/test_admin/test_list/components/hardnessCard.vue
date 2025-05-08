<template>
  <div class="panel border">
    <v-form ref="hardnessForm">
      <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.test_hardness') }}</div>
      <v-row align="center">
        <v-col cols="3">
          <v-text-field type="number" :model-value="form.check_digit_1_1" @update:modelValue="(val) => form.check_digit_1_1 = val === '' ? null : val"  :readonly="!form.id" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.testing_machine" density="comfortable" variant="underlined" :label="$t('test_list.detail.testing_machine')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" density="comfortable" variant="underlined" v-model="form.bhn_min_max"
          :label="$t('test_list.detail.bhn')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" density="comfortable" variant="underlined" v-model="form.ball_size_mm"
          :label="$t('test_list.detail.ball_size')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" density="comfortable" variant="underlined" v-model="form.load_kg"
          :label="$t('test_list.detail.load_kg')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>

<!--        <v-col cols="3">-->
<!--          <dict-code-->
<!--              v-model="form.result"-->
<!--              :hide-details="false"-->
<!--              variant="underlined"-->
<!--              label="Result"-->
<!--              bg-color="white"-->
<!--              code="pass_status"-->
<!--              density="comfortable"-->
<!--              :disabled="disabled"-->
<!--          />-->
<!--        </v-col>-->


      </v-row>
      <v-row align="center">
        <v-col cols="2">
          <v-text-field type="text" v-model="form.hardness_1" density="comfortable" variant="underlined" :maxlength="3"
          :label="$t('test_list.detail.hardness_1')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field type="text" v-model="form.hardness_2" density="comfortable" variant="underlined" :maxlength="3"
          :label="$t('test_list.detail.hardness_2')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field type="text" v-model="form.hardness_3" density="comfortable" variant="underlined" :maxlength="3"
          :label="$t('test_list.detail.hardness_3')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field type="text" v-model="form.hardness_4" density="comfortable" variant="underlined" :maxlength="3"
          :label="$t('test_list.detail.hardness_4')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field type="text" v-model="form.hardness_5" density="comfortable" variant="underlined" :maxlength="3"
          :label="$t('test_list.detail.hardness_5')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              type="number"
              density="comfortable"
              variant="underlined"
              v-model="form.hardness_av"
              :label="$t('test_list.detail.hardness_avg_unit')"
              :maxlength="3"
              persistent-placeholder
              bg-color="white"
              clearable
              :disabled="disabled"
          ></v-text-field>
        </v-col>

      </v-row>
    </v-form>
  </div>
</template>
<script setup>
import {computed, nextTick, reactive, toRaw, toRefs, watch} from "vue";
import { toast } from "vue3-toastify";
import {log} from "@openid/appauth";
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

// 创建本地数据副本
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 计算 hardness_av 的平均值
watch(
    () => [
      form.value.hardness_1,
      form.value.hardness_2,
      form.value.hardness_3,
      form.value.hardness_4,
      form.value.hardness_5
    ],
    ([h1, h2, h3, h4, h5]) => {
      const values = [h1, h2, h3, h4, h5].filter(v =>
          v !== null && v !== undefined && v !== ""
      );

      if (values.length === 0) {
        form.value.hardness_av = "";
      } else {
        const sum = values.reduce((acc, val) => acc + Number(val), 0);
        form.value.hardness_av = Math.round(sum / values.length);
      }
    },
    { immediate: true } // 立即执行一次以初始化
);




const data = reactive({
  rules: {
    test_code: [
      value => {
        if (value) return true
        return 'Test Code is required.'
      }
    ],

  }
});


const {rules} = toRefs(data);

const handleClose = () => {
  nextTick(() => {
    proxy.$refs["hardnessForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["hardnessForm"].validate();
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
