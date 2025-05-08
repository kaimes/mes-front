<template>
    <div class="panel border">
      <v-form ref="cleannessForm">
        <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.spec_requirements') }}</div>
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="form.temp_max" density="comfortable" variant="underlined" :label="$t('test_list.detail.max')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.resistivity_max" density="comfortable" variant="underlined" :label="$t('test_list.detail.max_resistivity')" persistent-placeholder bg-color="white" clearable disabled></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </template>
  <script setup>
  import {computed, nextTick, reactive, toRaw, toRefs} from "vue";
  import { toast } from "vue3-toastify";
  
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
    form.value = {
      resistivity_max: undefined,
      temp_max: undefined,
    };
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
  