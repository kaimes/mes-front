<template>
  <FormDialog
    v-model="visible"
    :width="460"
    :title="form.id ? $t('test_sample.new.update') : $t('global.new')"
    :desc="$t('test_result_through_thickness_tensile.new.desc')"
    :loading="loading"
    @close="handleClose"
    @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <test-sample-code
            v-model="form.test_sample_id"
            :hide-details="false"
            :test_sample="form.test_sample"
            :rules="rules.test_sample_id"
            @change="handleChange"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.test_sample_part"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.test_sample_part')"
            bg-color="white"
            :rules="rules.test_sample_part"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.tested_diameter_1"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.tested_diameter_1')"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.tested_diameter_2"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.tested_diameter_2')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.tested_diameter_3"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.tested_diameter_3')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.value_mpa_1"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.value_1')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.value_mpa_2"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.value_2')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.value_mpa_3"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.value_3')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.yield_rt0_5_1"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.yield_rt_051')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.yield_rt0_5_2"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.yield_rt_052')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.yield_rt0_5_3"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.yield_rt_053')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.reduction_in_area_1"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.reduction_in_area_1')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.reduction_in_area_2"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.reduction_in_area_2')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.reduction_in_area_3"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.reduction_in_area_3')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.ria_average"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_result_through_thickness_tensile.new.ria_average')"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {
  getCurrentInstance,
  inject,
  nextTick,
  reactive,
  ref,
  toRaw,
  toRefs,
} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import API from "../api";
import TestSampleCode from "../../../components/picker/TestSampleCode.vue";
import useCommonStore from "@/app/common";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
import { toast } from "vue3-toastify";

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    test_sample_id: undefined,
    test_sample: undefined,
    test_sample_part: undefined,
    tested_diameter_1: undefined,
    tested_diameter_2: undefined,
    tested_diameter_3: undefined,
    value_mpa_1: undefined,
    value_mpa_2: undefined,
    value_mpa_3: undefined,
    yield_rt0_5_1: undefined,
    yield_rt0_5_2: undefined,
    yield_rt0_5_3: undefined,
    reduction_in_area_1: undefined,
    reduction_in_area_2: undefined,
    reduction_in_area_3: undefined,
    ria_average: undefined,
  },
  rules: {
    test_sample_id: [
      (value) => {
        if (value) return true;
        return "TestSampleCode is required.";
      },
    ],
    test_sample_part:[
      // 如果有值限制字符长度为1
      (value) => {
        if (value && value.length > 1) {
          return "TestSamplePart is too long.";
        }
        return true;
      },
    ]
  },
});

const { form, rules } = toRefs(data);
const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);

const handleShow = (data) => {
  visible.value = true;
  if (data) {
    form.value = {
      id: data.id,
      test_sample_id: data.test_sample_id,
      test_sample: data.test_sample,
      test_sample_part: data.test_sample.test_sample_part,
      tested_diameter_1: data.tested_diameter_1,
      tested_diameter_2: data.tested_diameter_2,
      tested_diameter_3: data.tested_diameter_3,
      value_mpa_1: data.value_mpa_1,
      value_mpa_2: data.value_mpa_2,
      value_mpa_3: data.value_mpa_3,
      yield_rt0_5_1: data.yield_rt0_5_1,
      yield_rt0_5_2: data.yield_rt0_5_2,
      yield_rt0_5_3: data.yield_rt0_5_3,
      reduction_in_area_1: data.reduction_in_area_1,
      reduction_in_area_2: data.reduction_in_area_2,
      reduction_in_area_3: data.reduction_in_area_3,
      ria_average: data.ria_average,
      ...data,
    };
  } else {
    form.value = {
      id: undefined,
      test_sample_id: undefined,
      test_sample: undefined,
      test_sample_part: undefined,
      tested_diameter_1: undefined,
      tested_diameter_2: undefined,
      tested_diameter_3: undefined,
      value_mpa_1: undefined,
      value_mpa_2: undefined,
      value_mpa_3: undefined,
      yield_rt0_5_1: undefined,
      yield_rt0_5_2: undefined,
      yield_rt0_5_3: undefined,
      reduction_in_area_1: undefined,
      reduction_in_area_2: undefined,
      reduction_in_area_3: undefined,
      ria_average: undefined,
    };
  }
  console.log("visible.value", visible.value);
};

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    test_sample_id: undefined,
    test_sample: undefined,
    test_sample_part: undefined,
    tested_diameter_1: undefined,
    tested_diameter_2: undefined,
    tested_diameter_3: undefined,
    value_mpa_1: undefined,
    value_mpa_2: undefined,
    value_mpa_3: undefined,
    yield_rt0_5_1: undefined,
    yield_rt0_5_2: undefined,
    yield_rt0_5_3: undefined,
    reduction_in_area_1: undefined,
    reduction_in_area_2: undefined,
    reduction_in_area_3: undefined,
    ria_average: undefined,
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  });
};

const handleSave = async () => {
  const { valid } = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 500, 
    });
  }catch (res) {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

const handleChange = (value) => {
  form.value.test_sample_part = value.test_sample_part;
}

defineExpose({
  handleShow,
});
</script>
<style scoped>
</style>
