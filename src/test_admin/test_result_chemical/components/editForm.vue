<template>
  <FormDialog
    v-model="visible"
    :width="460"
    :title="form.id ? 'Update' : 'Add'"
    desc="Test Result Product Analysis"
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
        <!-- <v-col cols="6">
          <v-text-field
            v-model="form.mill_id"
            density="default"
            variant="underlined"
            label="MillId From"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col> -->
        <v-col cols="6">
          <v-text-field
            v-model="form.result_c"
            type="number"
            density="default"
            variant="underlined"
            label="C"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_si"
            type="number"
            density="default"
            variant="underlined"
            label="Si"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_mn"
            type="number"
            density="default"
            variant="underlined"
            label="Mn"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_p"
            type="number"
            density="default"
            variant="underlined"
            label="P"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_s"
            type="number"
            density="default"
            variant="underlined"
            label="S"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_cr"
            type="number"
            density="default"
            variant="underlined"
            label="Cr"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_mo"
            type="number"
            density="default"
            variant="underlined"
            label="Mo"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_ni"
            type="number"
            density="default"
            variant="underlined"
            label="Ni"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_al"
            type="number"
            density="default"
            variant="underlined"
            label="Al"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_b"
            type="number"
            density="default"
            variant="underlined"
            label="B"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_co"
            type="number"
            density="default"
            variant="underlined"
            label="Co"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_cu"
            type="number"
            density="default"
            variant="underlined"
            label="Cu"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_nb"
            type="number"
            density="default"
            variant="underlined"
            label="Nb"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_sn"
            type="number"
            density="default"
            variant="underlined"
            label="Sn"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_ti"
            density="default"
            variant="underlined"
            label="Ti"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_v"
            density="default"
            variant="underlined"
            label="V"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_ca"
            density="default"
            variant="underlined"
            label="Ca"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_n2"
            density="default"
            variant="underlined"
            label="N2"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_o"
            density="default"
            variant="underlined"
            label="O"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_h"
            density="default"
            variant="underlined"
            label="H"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_sal"
            density="default"
            variant="underlined"
            label="Sal"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_as"
            density="default"
            variant="underlined"
            label="As"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_bi"
            density="default"
            variant="underlined"
            label="Bi"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_ce"
            density="default"
            variant="underlined"
            label="Ce"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_pb"
            density="default"
            variant="underlined"
            label="Pb"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_sb"
            density="default"
            variant="underlined"
            label="Sb"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_w"
            density="default"
            variant="underlined"
            label="W"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_zn"
            density="default"
            variant="underlined"
            label="Zn"
            bg-color="white"
            required
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.result_zr"
            density="default"
            variant="underlined"
            label="Zr"
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
    mill_id: undefined,
    result_c: undefined,
    result_si: undefined,
    result_mn: undefined,
    result_p: undefined,
    result_s: undefined,
    result_cr: undefined,
    result_mo: undefined,
    result_ni: undefined,
    result_al: undefined,
    result_b: undefined,
    result_co: undefined,
    result_cu: undefined,
    result_nb: undefined,
    result_sn: undefined,
    result_ti: undefined,
    result_v: undefined,
    result_ca: undefined,
    result_n2: undefined,
    result_o: undefined,
    result_h: undefined,
    result_sal: undefined,
    result_as: undefined,
    result_bi: undefined,
    result_ce: undefined,
    result_pb: undefined,
    result_sb: undefined,
    result_w: undefined,
    result_zn: undefined,
    result_zr: undefined,
  },
  rules: {
    test_sample_id: [
      (value) => {
        if (value) return true;
        return "TestSampleCode is required.";
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
      mill_id: data.mill_id,
      result_c: data.result_c,
      result_si: data.result_si,
      result_mn: data.result_mn,
      result_p: data.result_p,
      result_s: data.result_s,
      result_cr: data.result_cr,
      result_mo: data.result_mo,
      result_ni: data.result_ni,
      result_al: data.result_al,
      result_b: data.result_b,
      result_co: data.result_co,
      result_cu: data.result_cu,
      result_nb: data.result_nb,
      result_sn: data.result_sn,
      result_ti: data.result_ti,
      result_v: data.result_v,
      result_ca: data.result_ca,
      result_n2: data.result_n2,
      result_o: data.result_o,
      result_h: data.result_h,
      result_sal: data.result_sal,
      result_as: data.result_as,
      result_bi: data.result_bi,
      result_ce: data.result_ce,
      result_pb: data.result_pb,
      result_sb: data.result_sb,
      result_w: data.result_w,
      result_zn: data.result_zn,
      result_zr: data.result_zr,
      ...data,
    };
  } else {
    form.value = {
      id: undefined,
      test_sample_id: undefined,
      test_sample: undefined,
      mill_id: undefined,
      result_c: undefined,
      result_si: undefined,
      result_mn: undefined,
      result_p: undefined,
      result_s: undefined,
      result_cr: undefined,
      result_mo: undefined,
      result_ni: undefined,
      result_al: undefined,
      result_b: undefined,
      result_co: undefined,
      result_cu: undefined,
      result_nb: undefined,
      result_sn: undefined,
      result_ti: undefined,
      result_v: undefined,
      result_ca: undefined,
      result_n2: undefined,
      result_o: undefined,
      result_h: undefined,
      result_sal: undefined,
      result_as: undefined,
      result_bi: undefined,
      result_ce: undefined,
      result_pb: undefined,
      result_sb: undefined,
      result_w: undefined,
      result_zn: undefined,
      result_zr: undefined,
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
    mill_id: undefined,
    result_c: undefined,
    result_si: undefined,
    result_mn: undefined,
    result_p: undefined,
    result_s: undefined,
    result_cr: undefined,
    result_mo: undefined,
    result_ni: undefined,
    result_al: undefined,
    result_b: undefined,
    result_co: undefined,
    result_cu: undefined,
    result_nb: undefined,
    result_sn: undefined,
    result_ti: undefined,
    result_v: undefined,
    result_ca: undefined,
    result_n2: undefined,
    result_o: undefined,
    result_h: undefined,
    result_sal: undefined,
    result_as: undefined,
    result_bi: undefined,
    result_ce: undefined,
    result_pb: undefined,
    result_sb: undefined,
    result_w: undefined,
    result_zn: undefined,
    result_zr: undefined,
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
