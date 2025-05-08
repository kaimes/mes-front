<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Spec Elongation Details"
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
              variant="underlined"
              label="Thickness To"
              @blur="handleBlur('thick_to')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.location"
              density="default"
              variant="underlined"
              label="Sample Location"
              bg-color="white"
              :maxlength="1"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.elong_min_value"
              density="default"
              variant="underlined"
              label="Min Val"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <!-- <v-select
              v-model="form.elong_guage_code"
              color="#333"
              density="default"
              variant="underlined"
              label="Code"
              item-title="title"
              item-value="value"
              placeholder="Please select the elong guage code"
              bg-color="white"
              :items="codeTypes"
          ></v-select> -->

          <DictCode v-model="form.elong_guage_code" code="elong_guage_code" label="Gauge Code" :hide-details="false"/>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.freq"
              density="default"
              variant="underlined"
              label="Freq"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.std"
              density="default"
              variant="underlined"
              label="Test Std"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.fio"
              density="default"
              variant="underlined"
              label="Elongn FIO"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.pt"
              density="default"
              variant="underlined"
              label="Print Units"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.pred"
              density="default"
              variant="underlined"
              label="Predicted Result Allowed"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.tpsr"
              density="default"
              variant="underlined"
              label="TPSR Code"
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
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import { VNumberInput } from 'vuetify/labs/VNumberInput'

import FormDialog from "@/components/FormDialog.vue";
import { toast } from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  form: {
    id: undefined,
    spec: commonStore.spec,
    spec_id: commonStore.spec.id,
    mill_id: undefined,
    mill: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    elong_min_value: undefined,
    elong_guage_code: undefined,
    freq: undefined,
    std: undefined,
    fio: undefined,
    pt: undefined,
    pred: undefined,
    tpsr: undefined,
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
    form.value = {
      id: data.id,
      spec_id: data.spec_id,
      spec: data.spec,
      mill_id: data.mill_id,
      mill: data.mill,
      thick_from: data.thick_from,
      thick_to: data.thick_to,
      location: data.location,
      elong_min_value: data.elong_min_value,
      elong_guage_code: data.elong_guage_code,
      freq: data.freq,
      std: data.std,
      fio: data.fio,
      pt: data.pt,
      pred: data.pred,
      tpsr: data.tpsr,
    };
  } else {
    form.value.spec = commonStore.spec;
    form.value.spec_id = commonStore.spec.id;
  }
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    spec: commonStore.spec,
    spec_id: commonStore.spec.id,
    mill_id: undefined,
    mill: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    elong_min_value: undefined,
    elong_guage_code: undefined,
    freq: undefined,
    std: undefined,
    fio: undefined,
    pt: undefined,
    pred: undefined,
    tpsr: undefined,
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
