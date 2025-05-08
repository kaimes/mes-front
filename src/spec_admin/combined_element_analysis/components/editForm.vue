<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Combined Element Analysis"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <spec-code v-model="form.spec_id" :hide-details="false" :spec="form.spec" :rules="rules.spec_code" :disabled="!!form.id" />
        </v-col>
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :hide-details="false" />
        </v-col>
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
              density="default"
              variant="underlined"
              label="Thickness To"
              bg-color="white"
              @blur="handleBlur('thick_to')"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_sign_1"
              density="default"
              variant="underlined"
              label="Sign"
              bg-color="white"
              :maxlength="1"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_symbol_1"
              density="default"
              variant="underlined"
              label="EL1"
              bg-color="white"
              :maxlength="2"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_sign_2"
              density="default"
              variant="underlined"
              label="Sign"
              bg-color="white"
              :maxlength="1"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_symbol_2"
              density="default"
              variant="underlined"
              label="EL2"
              bg-color="white"
              :maxlength="2"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_sign_3"
              density="default"
              variant="underlined"
              label="Sign"
              bg-color="white"
              :maxlength="1"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_symbol_3"
              density="default"
              variant="underlined"
              label="EL3"
              bg-color="white"
              :maxlength="2"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_sign_4"
              density="default"
              variant="underlined"
              label="Sign"
              bg-color="white"
              :maxlength="1"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_symbol_4"
              density="default"
              variant="underlined"
              label="EL4"
              bg-color="white"
              :maxlength="2"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_sign_5"
              density="default"
              variant="underlined"
              label="Sign"
              bg-color="white"
              :maxlength="1"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.comb_el_symbol_5"
              density="default"
              variant="underlined"
              label="EL5"
              bg-color="white"
              :maxlength="2"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.comb_min_1"
              :rules="rules.comb_min_1"
              density="default"
              variant="underlined"
              label="Min"
              bg-color="white"
              :maxlength="5"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.comb_max_1"
              :rules="rules.comb_max_1"
              density="default"
              variant="underlined"
              label="Max"
              bg-color="white"
              :maxlength="5"
              required
              clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import {toast} from "vue3-toastify";
import MillCode from "@/components/picker/MillCode.vue";


const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    spec_id: commonStore.spec.id,
    spec: commonStore.spec,
    mill_id: undefined,
    mill: undefined,
    ln_no: undefined,
    thick_from: undefined,
    thick_to: undefined,
    comb_el_sign_1: undefined,
    comb_el_symbol_1: undefined,
    comb_el_sign_2: undefined,
    comb_el_symbol_2: undefined,
    comb_el_sign_3: undefined,
    comb_el_symbol_3: undefined,
    comb_el_sign_4: undefined,
    comb_el_symbol_4: undefined,
    comb_el_sign_5: undefined,
    comb_el_symbol_5: undefined,
    comb_min_1: undefined,
    comb_max_1: undefined,
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
    comb_min_1: [
      value => {
        if (value && greaterThan(value, form.value.comb_max_1)) {
          return 'min must be smaller than max'
        }
        return true;
      }
    ],
    comb_max_1: [
      value => {
        if (value && greaterThan(form.value.comb_min_1, value)) {
          return 'max must be greater than min'
        }
        return true;
      }
    ],
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    form.value = {
      id: data.id,
      spec_id: data.spec_id,
      spec: data.spec,
      mill_id: data.mill_id,
      mill: data.mill,
      ln_no: data.ln_no,
      thick_from: data.thick_from,
      thick_to: data.thick_to,
      comb_el_sign_1: data.comb_el_sign_1,
      comb_el_symbol_1: data.comb_el_symbol_1,
      comb_el_sign_2: data.comb_el_sign_2,
      comb_el_symbol_2: data.comb_el_symbol_2,
      comb_el_sign_3: data.comb_el_sign_3,
      comb_el_symbol_3: data.comb_el_symbol_3,
      comb_el_sign_4: data.comb_el_sign_4,
      comb_el_symbol_4: data.comb_el_symbol_4,
      comb_el_sign_5: data.comb_el_sign_5,
      comb_el_symbol_5: data.comb_el_symbol_5,
      comb_min_1: data.comb_min_1,
      comb_max_1: data.comb_max_1,
    }
  } else {
    form.value.spec = commonStore.spec;
    form.value.spec_id = commonStore.spec.id;
  }
  visible.value = true;
  console.log("visible.value", visible.value)
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    spec_id: commonStore.spec.id,
    spec: commonStore.spec,
    mill_id: undefined,
    mill: undefined,
    ln_no: undefined,
    thick_from: undefined,
    thick_to: undefined,
    comb_el_sign_1: undefined,
    comb_el_symbol_1: undefined,
    comb_el_sign_2: undefined,
    comb_el_symbol_2: undefined,
    comb_el_sign_3: undefined,
    comb_el_symbol_3: undefined,
    comb_el_sign_4: undefined,
    comb_el_symbol_4: undefined,
    comb_el_sign_5: undefined,
    comb_el_symbol_5: undefined,
    comb_min_1: undefined,
    comb_max_1: undefined,
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
