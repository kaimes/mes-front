<template>
  <FormDialog
    v-model="visible"
    :width="550"
    :title="form.id ? 'Update' : 'Add'"
    desc="Test Sample Tensile Details"
    :loading="loading"
    @close="handleClose"
    @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="12">
          <test-sample-code
            v-model="form.test_sample_id"
            :hide-details="false"
            :test_sample="form.test_sample"
            :rules="rules.test_sample_id"
          />
        </v-col>
        <v-col cols="6">
          <dict-code
            v-model="form.orientation"
            label="Orientation"
            placeholder="Select Orientation"
            code="result_orientation"
            persistent-placeholder
          />
        </v-col>
        <v-col cols="6">
          <dict-code
            v-model="form.standard"
            label="Standard"
            placeholder="Select Standard"
            code="result_standard"
            persistent-placeholder
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.insp_code"
            density="default"
            variant="underlined"
            label="Insp Code"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.sample_shape"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            label="Sample Shape"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.tested_thickness"
            type="number"
            density="default"
            variant="underlined"
            label="Tested Thickness"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.tested_width"
            type="number"
            density="default"
            variant="underlined"
            label="Tested Width"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.tested_diameter"
            type="number"
            density="default"
            variant="underlined"
            label="Tested Diameter"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.value_mpa"
            type="number"
            density="default"
            variant="underlined"
            label="UTS(MPA)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.yield_tt0_5"
            type="number"
            density="default"
            variant="underlined"
            label="Yield Tt05(MPA)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.yield_high"
            type="number"
            density="default"
            variant="underlined"
            label="Yield High(MPA)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.yield_rp0_2"
            type="number"
            density="default"
            variant="underlined"
            label="Yield Rp 02(MPA)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.yield_low"
            type="number"
            density="default"
            variant="underlined"
            label="Yield Low(MPA)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.elongation_code"
            :rules="rules.stringOne"
            type="number"
            density="default"
            variant="underlined"
            label="Elongation Code(%)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.elongation_a565"
            type="number"
            density="default"
            variant="underlined"
            label="Elongation A565(%)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.elongation_a200"
            type="number"
            density="default"
            variant="underlined"
            label="Elongation A200(%)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.elongation_a50"
            type="number"
            density="default"
            variant="underlined"
            label="Elongation A50(%)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.elongation_8"
            type="number"
            density="default"
            variant="underlined"
            label="Elongation 8(%)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.elongation_2"
            type="number"
            density="default"
            variant="underlined"
            label="Elongation 2(%)"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.elongation_a80"
            type="number"
            density="default"
            variant="underlined"
            label="Elongation A80(%)"
            bg-color="white"
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
import { toast } from "vue3-toastify";
import DictCode from "@/components/picker/DictCode.vue";

const router = useRouter();

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    test_sample_id: undefined,
    test_sample: undefined,
    sample_shape: undefined,
    standard: undefined,
    insp_code: undefined,
    tested_thickness: undefined,
    tested_width: undefined,
    tested_diameter: undefined,
    value_mpa: undefined,
    yield_tt0_5: undefined,
    yield_high: undefined,
    yield_rp0_2: undefined,
    yield_low: undefined,
    elongation_code: undefined,
    elongation_a565: undefined,
    elongation_a200: undefined,
    elongation_a50: undefined,
    elongation_8: undefined,
    elongation_2: undefined,
    elongation_a80: undefined,
    orientation: undefined,
  },
  rules: {
    test_sample_id: [
      (value) => {
        if (value) return true;
        return "TestSampleCode is required.";
      },
    ],
    stringOne: [
      (value) => {
        if (value && value.length > 1) {
          return "Max 1 character.";
        }
        return true;
      },
    ],
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
      standard: data.standard,
      insp_code: data.insp_code,
      sample_shape: data.sample_shape,
      tested_thickness: data.tested_thickness,
      tested_width: data.tested_width,
      tested_diameter: data.tested_diameter,
      value_mpa: data.value_mpa,
      yield_tt0_5: data.yield_tt0_5,
      yield_high: data.yield_high,
      yield_rp0_2: data.yield_rp0_2,
      yield_low: data.yield_low,
      elongation_code: data.elongation_code,
      elongation_a565: data.elongation_a565,
      elongation_a200: data.elongation_a200,
      elongation_a50: data.elongation_a50,
      elongation_8: data.elongation_8,
      elongation_2: data.elongation_2,
      elongation_a80: data.elongation_a80,
      orientation: data.orientation,
    };
  } else {
    form.value = {
      id: undefined,
      test_sample_id: undefined,
      test_sample: undefined,
      standard: undefined,
      insp_code: undefined,
      sample_shape: undefined,
      tested_thickness: undefined,
      tested_width: undefined,
      tested_diameter: undefined,
      value_mpa: undefined,
      yield_tt0_5: undefined,
      yield_high: undefined,
      yield_rp0_2: undefined,
      yield_low: undefined,
      elongation_code: undefined,
      elongation_a565: undefined,
      elongation_a200: undefined,
      elongation_a50: undefined,
      elongation_8: undefined,
      elongation_2: undefined,
      elongation_a80: undefined,
      orientation: undefined,
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
    sample_shape: undefined,
    standard: undefined,
    insp_code: undefined,
    tested_thickness: undefined,
    tested_width: undefined,
    tested_diameter: undefined,
    value_mpa: undefined,
    yield_tt0_5: undefined,
    yield_high: undefined,
    yield_rp0_2: undefined,
    yield_low: undefined,
    elongation_code: undefined,
    elongation_a565: undefined,
    elongation_a200: undefined,
    elongation_a50: undefined,
    elongation_8: undefined,
    elongation_2: undefined,
    elongation_a80: undefined,
    orientation: undefined,
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
  } catch (res) {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

defineExpose({
  handleShow,
});
</script>
<style scoped>
</style>
