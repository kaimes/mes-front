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
        <v-col cols="2">
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
        <v-col cols="2">
          <v-text-field
              type="number"
              v-model="form.thick_to"
              :rules="rules.thick_to"
              :min="0"
              class="no-input-control"
              persistent-placeholder
              variant="underlined"
              label="Thickness To"
              @blur="handleBlur('thick_to')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <dict-code
              v-model="form.impact_location"
              :hide-details="false"
              bg-color="white"
              density="default"
              variant="underlined"
              color="#333"
              label="Impact Location"
              code="impact_location"
          />
        </v-col>
        <v-col cols="4">
          <dict-code
              v-model="form.orientation"
              :hide-details="false"
              bg-color="white"
              density="default"
              variant="underlined"
              color="#333"
              label="Orientation"
              code="impact_orientation"
          />
        </v-col>
      </v-row>
      <!-- <v-tabs
          v-model="tab"
          bg-color="white"
          center-active
          grow
          align-tabs="center"
      >
        <v-tab value="one">Impact Details</v-tab>
      </v-tabs> -->
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-row class="pt-6">
            <v-col cols="4">
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
            <v-col cols="4">
              <dict-code
                  v-model="form.impact_units"
                  bg-color="white"
                  density="default"
                  variant="underlined"
                  color="#333"
                  label="Impact Energy Units"
                  code="impact_i"
              />
            </v-col>
            <v-col cols="4">
              <dict-code
                  v-model="form.temp_units"
                  bg-color="white"
                  density="default"
                  variant="underlined"
                  color="#333"
                  label="Impact Temperature Units"
                  code="impact_t"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.ave_value_1"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="10*10 Avg Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.min_value_1"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="10*10 Ind Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.temp_value_1"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="Temp"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.ave_value_2"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="10*7.5 Avg Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.min_value_2"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="10*7.5 Ind Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.temp_value_2"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="10*7.5: Temp"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>



            <v-col cols="4">
              <v-text-field
                  v-model="form.ave_value_3"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="10*5 Avg Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.min_value_3"
                  :maxlength="5"
                  density="default"
                  variant="underlined"
                  label="10*5 Ind Min"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="form.temp_value_3"
                  :maxlength="3"
                  density="default"
                  variant="underlined"
                  label="10*5: Temp"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>


            <v-col cols="4">
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
            <v-col cols="4">
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
            <v-col cols="4">
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
            <v-col cols="4">
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
            <v-col cols="4">
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
            <v-col cols="4">
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
            <v-col cols="4">
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
            <v-col cols="4">
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
            <v-col cols="4"> 
              <v-text-field
                  v-model="form.notch"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Notch"
              ></v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field
                  v-model="form.sequence"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Sequence"
              ></v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field
                  v-model="form.freq"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Freq"
              ></v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field
                  v-model="form.fio"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Impacts FIO"
              ></v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field
                  v-model="form.pt"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Print Units"
              ></v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field
                  v-model="form.pred"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Predicted Result Allowed"
              ></v-text-field>
            </v-col>
            <v-col cols="4"> 
              <v-text-field
                  v-model="form.tpsr"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="TPSR Code"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import { toast } from "vue3-toastify";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";

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
    "impact_location": undefined,
    "orientation": undefined,
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
    "ave_value_3": undefined,
    "min_value_3": undefined,
    "temp_value_3": undefined,
    "reduction_75": undefined,
    "reduction_50": undefined,
    "reduction_25": undefined,
    "info_temp_value_1": undefined,
    "info_temp_value_2": undefined,
    "info_temp_value_3": undefined,
    "heat_code": undefined,
    "std": undefined,
    "spaeter_certs": undefined,
    "notch": undefined,
    "sequence": undefined,
    "freq": undefined,
    "fio": undefined,
    "pt": undefined,
    "pred": undefined,
    "tpsr": undefined,
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
        if (form.value.thick_to && greaterThan(value, form.value.thick_to)) {
          return 'thickness from must be smaller than thickness to'
        }
        return true
      },
      value => {
        if (value && form.value.thick_to && value === form.value.thick_to) {
          return 'thickness from cannot be equal thickness to'
        }
        return true
      },
    ],
    thick_to: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness To is required.'
      },
      value => {
        if (form.value.thick_from && greaterThan(form.value.thick_from, value)) {
          return 'thickness to must be greater than thickness from'
        }
        return true
      },
      value => {
        if (value && form.value.thick_from && value === form.value.thick_from) {
          return 'thickness to cannot be equal thickness from'
        }
        return true
      },
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
    "mill_id": undefined,
    "mill": undefined,
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "thick_from": undefined,
    "thick_to": undefined,
    "spec_code": undefined,
    "impact_location": undefined,
    "orientation": undefined,
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
    "ave_value_3": undefined,
    "min_value_3": undefined,
    "temp_value_3": undefined,
    "reduction_75": undefined,
    "reduction_50": undefined,
    "reduction_25": undefined,
    "info_temp_value_1": undefined,
    "info_temp_value_2": undefined,
    "info_temp_value_3": undefined,
    "heat_code": undefined,
    "std": undefined,
    "spaeter_certs": undefined,
    "notch": undefined,
    "sequence": undefined,
    "freq": undefined,
    "fio": undefined,
    "pt": undefined,
    "pred": undefined,
    "tpsr": undefined,
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
    toast.error((res?.response?.data?.detail || params.id) ? "Update Fail" : "Create Fail", {
      autoClose: 60000
    });
  } finally {
    loading.value = false;
  }
}

const handleBlur = (field) => {
  let value = form.value[field];

  if (value === null || value === '' || isNaN(value)) {
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
