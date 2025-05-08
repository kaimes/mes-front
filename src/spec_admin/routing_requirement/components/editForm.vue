<template>
  <FormDialog
      v-model="visible"
      :width="620"
      :title="form.id ? 'Update' : 'Add'"
      desc="Routing Requirement"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="6">
          <spec-code v-model="form.spec_id" :spec="form.spec" :rules="rules.spec_code" :hide-details="false" :disabled="!!form.id" />
        </v-col>
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :hide-details="false" />
        </v-col>
      </v-row>
      <v-tabs
          v-model="tab"
          bg-color="white"
          center-active
          grow
          align-tabs="center"
      >
        <v-tab value="one">General Info</v-tab>
        <v-tab value="two">Routing Details</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-row class="pt-6">
            <v-col cols="6">
              <v-text-field
                  type="number"
                  v-model="form.thick_from"
                  :rules="rules.thick_from"
                  class="no-input-control"
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
            <v-col cols="6">
              <v-text-field
                  v-model="form.location"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Location"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.steel_type"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Steel Type"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="form.qual_code"
                  :maxlength="4"
                  density="default"
                  variant="underlined"
                  label="Quality Code"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="form.sub_type"
                  :maxlength="4"
                  density="default"
                  variant="underlined"
                  label="Sub Type"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <DictCode v-model="form.other_quality_code" code="spec_other_quality_code" label="Other Quality Code" :hide-details="false" :multiple="true"/>
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="two">
          <v-row class="pt-6">
            <v-col cols="6">
              <v-text-field
                  v-model="form.level"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Degassing Level"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.injection"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Injection Level"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.pouring_practice"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Pouring Practice(1)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.shrouding"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Shrouding"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.slow_cooling"
                  density="default"
                  variant="underlined"
                  label="Slow Cooling(h)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.hot_connecting"
                  :maxlength="1"
                  density="default"
                  variant="underlined"
                  label="Hot Connecting"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.sc_code"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Scarfing Code 1"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.sc_code_2"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Scarfing Code 2"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.sl_practice"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Slitting Practice 1"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.sd_practice"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Subdividing Practice 1"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.inspection"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Inspection"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.sulphur_printing"
                  :maxlength="2"
                  density="default"
                  variant="underlined"
                  label="Sulphur Printing"
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
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import API from "../api";
import SpecCode from "@/components/picker/SpecCode.vue";
import {toast} from "vue3-toastify";
import useCommonStore from "@/app/common";
import MillCode from "@/components/picker/MillCode.vue";
import {greaterThan, isThanZero} from "@/util/util";
import DictCode from "@/components/picker/DictCode.vue";

const commonStore = useCommonStore();
const visible = ref(false);
const tab = ref("one");
const loading = ref(false);
const data = reactive({
  form: {
    "sub_type": undefined,
    "id": undefined,
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "mill_id": undefined,
    "mill": undefined,
    "thick_from": undefined,
    "thick_to": undefined,
    "location": undefined,
    "level": undefined,
    "injection": undefined, 
    "pouring_practice": undefined,
    "shrouding": undefined,
    "slow_cooling": undefined,
    "hot_connecting": undefined,
    "sc_code": undefined,
    "sc_code_2": undefined,
    "sl_practice": undefined,
    "sd_practice": undefined,
    "inspection": undefined,
    "sulphur_printing": undefined,
    "qual_code": undefined,
    "steel_type": undefined,
    "other_quality_code": undefined
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
    const params = toRaw(data);
    form.value = {
      ...params,
    }
  } else {
    form.value.spec = commonStore.spec;
    form.value.spec_id = commonStore.spec.id;
  }
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    "id": undefined,
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "mill_id": undefined,
    "mill": undefined,
    "thick_from": undefined,
    "thick_to": undefined,
    "location": undefined,
    "level": undefined,
    "injection": undefined, 
    "pouring_practice": undefined,
    "shrouding": undefined,
    "slow_cooling": undefined,
    "hot_connecting": undefined,
    "sc_code": undefined,
    "sc_code_2": undefined,
    "sl_practice": undefined,
    "sd_practice": undefined,
    "inspection": undefined,
    "sulphur_printing": undefined,
    "qual_code": undefined,
    "steel_type": undefined,
    "other_quality_code": undefined
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
  
  if (params.other_quality_code && params.other_quality_code.length > 0){
    params.other_quality_code = params.other_quality_code.join(',')
  }else{
    params.other_quality_code = ""
  }

  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
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
