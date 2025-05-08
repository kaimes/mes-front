<template>
  <FormDialog
      v-model="visible"
      :width="660"
      :title="form.id ? 'Update' : 'Add'"
      desc="Spec Impact"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="6">
          <spec-code v-model="form.spec_id" :hide-details="false" :spec="form.spec" :rules="rules.spec_code" @change="handleSpecCodeChange" :disabled="!!form.id" />
        </v-col>
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :hide-details="false" />
        </v-col>
        
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.thick_from"
              :rules="rules.thick_from"
              persistent-placeholder
              variant="underlined"
              label="Thickness From"
              @blur="handleBlur('thick_from')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.thick_to"
              :rules="rules.thick_to"
              class="no-input-control"
              variant="underlined"
              label="Thickness To"
              @blur="handleBlur('thick_to')"
              clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-tabs
          v-model="tab"
          bg-color="white"
          center-active
          grow
          align-tabs="center"
      >
        <v-tab value="one">Impact Details</v-tab>
        <v-tab value="two">Shear Details</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-row class="pt-6">
            <v-col cols="6">
              <v-text-field
                  v-model="form.location"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Sample Location"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.impact_units"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="I"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.temp_units"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="T"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.option"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Opt"
                  bg-color="white"
                  clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.ave_value_1"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Impact 1: Average"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.min_value_1"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Impact 1: Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.temp_value_1"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="Impact 1: Temp"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.ave_value_2"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Impact 2: Average"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.min_value_2"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Impact 2: Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.temp_value_2"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="Impact 2: Temp"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="two">
          <v-row class="pt-6">
            <v-col cols="6">
              <v-text-field
                  v-model="form.reduction_75"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Sub-size Reduction-7.5%"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.reduction_50"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Sub-size Reduction-5.0%"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.reduction_25"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Sub-size Reduction-2.5%"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.info_temp_value_1"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="Info Temp 1"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.info_temp_value_2"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="Info Temp 2"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.info_temp_value_3"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="Info Temp 3"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.heat_code"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="Heat Code"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.std"
                  :maxlength="4"
                  density="default"
                  variant="underlined"
                  label="Standard"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.spaeter_certs"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Spaeter Type Certification"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {computed, getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import { toast } from "vue3-toastify";
import {Decimal} from 'decimal.js';
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";

const commonStore = useCommonStore();
const visible = ref(false);
const tab = ref("one");
const loading = ref(false);
const data = reactive({
  form: {
    "id": undefined,
    "mill_id": undefined,
    "mill": undefined,
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "thick_from": undefined,
    "thick_to": undefined,
    "spec_code": undefined,
    "summary_name": undefined,
    "type": undefined,
    "sub_type": undefined,
    "location": undefined,
    "impact_units": undefined,
    "temp_units": undefined,
    "option": undefined,
    "ave_value_1": undefined,
    "min_value_1": undefined,
    "temp_value_1": undefined,
    "ave_value_2": undefined,
    "min_value_2": undefined,
    "temp_value_2": undefined,
    "reduction_75": undefined,
    "reduction_50": undefined,
    "reduction_25": undefined,
    "info_temp_value_1": undefined,
    "info_temp_value_2": undefined,
    "info_temp_value_3": undefined,
    "heat_code": undefined,
    "std": undefined,
    "spaeter_certs": undefined,
  },
  rules: {
    spec_code: [
      value => {
        if (value) return true
        return 'Spec Code is required.'
      }
    ],
    thick_from: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness From is required.'
      },
      value => {
        if (greaterThan(value, form.value.thick_to)) {
          return 'thickness from must be smaller than thickness to'
        }
        return true
      }
    ],
    thick_to: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness To is required.'
      },
      value => {
        if (greaterThan(form.value.thick_from, value)) {
          return 'thickness to must be greater than thickness from'
        }
        return true
      }
    ],
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    const value = toRaw(data);
    form.value = { ...value };
  } else {
    form.value.spec = commonStore.spec;
    form.value.spec_id = commonStore.spec.id;
  }
  visible.value = true;
}

const handleSpecCodeChange = (data) => {
  form.value.summary_name = data.summary_name;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    "id": undefined,
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "thick_from": undefined,
    "thick_to": undefined,
    "spec_code": undefined,
    "summary_name": undefined,
    "type": undefined,
    "sub_type": undefined,
    "location": undefined,
    "option": undefined,
    "ave_value_1": undefined,
    "min_value_1": undefined,
    "temp_value_1": undefined,
    "ave_value_2": undefined,
    "min_value_2": undefined,
    "temp_value_2": undefined,
    "reduction_75": undefined,
    "reduction_50": undefined,
    "reduction_25": undefined,
    "info_temp_value_1": undefined,
    "info_temp_value_2": undefined,
    "info_temp_value_3": undefined,
    "heat_code": undefined,
    "std": undefined,
    "spaeter_certs": undefined,
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  if (!params.id) {
    delete params.spec;
  }

  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleBlur = (field) => {
  let value = form.value[field];

  if (!value) {
    form.value[field] = undefined;
  } else {
    form.value[field] = parseFloat(value).toFixed(2);
  }
}


defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
