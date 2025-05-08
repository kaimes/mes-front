<template>
  <FormDialog
    v-model="visible"
    :width="460"
    :title="form.id ? 'Update' : 'Add'"
    desc="Test Result Impact Details"
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
            v-model="form.size_code"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            label="Size Code"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.retest_seq"
            density="default"
            variant="underlined"
            label="Retest No."
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_temp_c"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Temp(C)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_temp_f"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Temp(F)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_1_j"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy1(J)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_2_j"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy2(J) "
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_3_j"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy3(J)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_average_j"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy Average(J)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_1_f"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy1(Ftlbs) "
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_2_f"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy2(Ftlbs)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_3_f"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy3(Ftlbs)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_energy_average_f"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Energy Average(Ftlbs)"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_shear_1"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Shear1"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_shear_2"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Shear2"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_shear_3"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Shear3"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_shear_average"
            type="number"
            density="default"
            variant="underlined"
            label="Impact Shear Average"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_temp_units"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            label="Impact Temp Units"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.charpy_i_units"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            label="Impact IUnits"
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
import DictCode from "@/components/picker/DictCode.vue";

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    test_sample_id: undefined,
    test_sample: undefined,
    size_code: undefined,
    charpy_temp_c: undefined,
    charpy_temp_f: undefined,
    charpy_energy_1_j: undefined,
    charpy_energy_2_j: undefined,
    charpy_energy_3_j: undefined,
    charpy_energy_average_j: undefined,
    charpy_energy_1_f: undefined,
    charpy_energy_2_f: undefined,
    charpy_energy_3_f: undefined,
    charpy_energy_average_f: undefined,
    charpy_shear_1: undefined,
    charpy_shear_2: undefined,
    charpy_shear_3: undefined,
    charpy_shear_average: undefined,
    charpy_temp_units: undefined,
    charpy_i_units: undefined,
    orientation: undefined,
    retest_seq: undefined
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
      size_code: data.size_code,
      standard: data.standard,
      insp_code: data.insp_code,
      charpy_temp_c: data.charpy_temp_c,
      charpy_temp_f: data.charpy_temp_f,
      charpy_energy_1_j: data.charpy_energy_1_j,
      charpy_energy_2_j: data.charpy_energy_2_j,
      charpy_energy_3_j: data.charpy_energy_3_j,
      charpy_energy_average_j: data.charpy_energy_average_j,
      charpy_energy_1_f: data.charpy_energy_1_f,
      charpy_energy_2_f: data.charpy_energy_2_f,
      charpy_energy_3_f: data.charpy_energy_3_f,
      charpy_energy_average_f: data.charpy_energy_average_f,
      charpy_shear_1: data.charpy_shear_1,
      charpy_shear_2: data.charpy_shear_2,
      charpy_shear_3: data.charpy_shear_3,
      charpy_shear_average: data.charpy_shear_average,
      charpy_temp_units: data.charpy_temp_units,
      charpy_i_units: data.charpy_i_units,
      orientation: data.orientation,
      retest_seq: data.retest_seq,
      ...data,
    };
  } else {
    form.value = {
      id: undefined,
      test_sample_id: undefined,
      test_sample: undefined,
      standard: undefined,
      insp_code: undefined,
      size_code: undefined,
      charpy_temp_c: undefined,
      charpy_temp_f: undefined,
      charpy_energy_1_j: undefined,
      charpy_energy_2_j: undefined,
      charpy_energy_3_j: undefined,
      charpy_energy_average_j: undefined,
      charpy_energy_1_f: undefined,
      charpy_energy_2_f: undefined,
      charpy_energy_3_f: undefined,
      charpy_energy_average_f: undefined,
      charpy_shear_1: undefined,
      charpy_shear_2: undefined,
      charpy_shear_3: undefined,
      charpy_shear_average: undefined,
      charpy_temp_units: undefined,
      charpy_i_units: undefined,
      orientation: undefined,
      retest_seq: undefined
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
    size_code: undefined,
    standard: undefined,
    insp_code: undefined,
    charpy_temp_c: undefined,
    charpy_temp_f: undefined,
    charpy_energy_1_j: undefined,
    charpy_energy_2_j: undefined,
    charpy_energy_3_j: undefined,
    charpy_energy_average_j: undefined,
    charpy_energy_1_f: undefined,
    charpy_energy_2_f: undefined,
    charpy_energy_3_f: undefined,
    charpy_energy_average_f: undefined,
    charpy_shear_1: undefined,
    charpy_shear_2: undefined,
    charpy_shear_3: undefined,
    charpy_shear_average: undefined,
    charpy_temp_units: undefined,
    charpy_i_units: undefined,
    orientation: undefined,
    retest_seq: undefined
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

defineExpose({
  handleShow,
});
</script>
<style scoped>
</style>
