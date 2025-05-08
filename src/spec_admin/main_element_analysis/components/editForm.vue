<template>
  <FormDialog
      v-model="visible"
      :width="1200"
      :title="form.id ? 'Update' : 'Add'"
      desc="Main Element Analysis"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="4">
          <spec-code v-model="form.spec_id" :hide-details="false" :spec="form.spec" :rules="rules.spec_code" :disabled="!!form.id" />
        </v-col>
        <v-col cols="4">
          <MillCode v-model="form.mill_id" :hide-details="false" />
        </v-col>
        <v-col cols="4">
          <v-select
              v-model="form.type"
              color="#333"
              variant="underlined"
              label="Type"
              placeholder="Please select the type"
              bg-color="white"
              item-title="title"
              item-value="value"
              :items="['Main', 'ISS', 'ISB']"
          ></v-select>
        </v-col>
        <v-col cols="4">
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
        <v-col cols="4">
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
        
        <v-divider class="mb-4" />
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_c"
              density="default"
              variant="underlined"
              label="Carbon Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_c"
              density="default"
              variant="underlined"
              label="Carbon Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_c"
              density="default"
              variant="underlined"
              label="Carbon Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_s"
              density="default"
              variant="underlined"
              label="Sulphur Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_s"
              density="default"
              variant="underlined"
              label="Sulphur Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_s"
              density="default"
              variant="underlined"
              label="Sulphur Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_cr"
              density="default"
              variant="underlined"
              label="Chrome Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_cr"
              density="default"
              variant="underlined"
              label="Chrome Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_cr"
              density="default"
              variant="underlined"
              label="Chrome Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_al"
              density="default"
              variant="underlined"
              label="Alumin Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_al"
              density="default"
              variant="underlined"
              label="Alumin Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_al"
              density="default"
              variant="underlined"
              label="Alumin Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_cu"
              density="default"
              variant="underlined"
              label="Copper Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_cu"
              density="default"
              variant="underlined"
              label="Copper Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_cu"
              density="default"
              variant="underlined"
              label="Copper Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_ti"
              density="default"
              variant="underlined"
              label="Titanium Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_ti"
              density="default"
              variant="underlined"
              label="Titanium Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_ti"
              density="default"
              variant="underlined"
              label="Titanium Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_ca"
              density="default"
              variant="underlined"
              label="Calcium Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_ca"
              density="default"
              variant="underlined"
              label="Calcium Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_ca"
              density="default"
              variant="underlined"
              label="Calcium Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_si"
              density="default"
              variant="underlined"
              label="Silicon Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_si"
              density="default"
              variant="underlined"
              label="Silicon Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_si"
              density="default"
              variant="underlined"
              label="Silicon Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_mo"
              density="default"
              variant="underlined"
              label="Moly Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_mo"
              density="default"
              variant="underlined"
              label="Moly Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_mo"
              density="default"
              variant="underlined"
              label="Moly Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_b"
              density="default"
              variant="underlined"
              label="Boron Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_b"
              density="default"
              variant="underlined"
              label="Boron Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_b"
              density="default"
              variant="underlined"
              label="Boron Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_nb"
              density="default"
              variant="underlined"
              label="Niobium Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_nb"
              density="default"
              variant="underlined"
              label="Niobium Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_nb"
              density="default"
              variant="underlined"
              label="Niobium Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_v"
              density="default"
              variant="underlined"
              label="Vanadium Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_v"
              density="default"
              variant="underlined"
              label="Vanadium Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_v"
              density="default"
              variant="underlined"
              label="Vanadium Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_sal"
              density="default"
              variant="underlined"
              label="SOL AL Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_sal"
              density="default"
              variant="underlined"
              label="SOL AL Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_sal"
              density="default"
              variant="underlined"
              label="SOL AL Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_mn"
              density="default"
              variant="underlined"
              label="Manganese Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_mn"
              density="default"
              variant="underlined"
              label="Manganese Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_mn"
              density="default"
              variant="underlined"
              label="Manganese Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_sp"
              density="default"
              variant="underlined"
              label="S&P Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_sp"
              density="default"
              variant="underlined"
              label="S&P Max"
              class="no-input-control"
              bg-color="white"
              clearableno-input-control
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_sp"
              density="default"
              variant="underlined"
              label="S&P Precision"
              bg-color="white"
              hide
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_ni"
              density="default"
              variant="underlined"
              label="Nickel Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_ni"
              density="default"
              variant="underlined"
              label="Nickel Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_ni"
              density="default"
              variant="underlined"
              label="Nickel Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_co"
              density="default"
              variant="underlined"
              label="Cobalt Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_co"
              density="default"
              variant="underlined"
              label="Cobalt Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_co"
              density="default"
              variant="underlined"
              label="Cobalt Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_sn"
              density="default"
              variant="underlined"
              label="Tin Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_sn"
              density="default"
              variant="underlined"
              label="Tin Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_sn"
              density="default"
              variant="underlined"
              label="Tin Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_n"
              density="default"
              variant="underlined"
              label="Nitrogen Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_n"
              density="default"
              variant="underlined"
              label="Nitrogen Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_n"
              density="default"
              variant="underlined"
              label="Nitrogen Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_min_value_h"
              density="default"
              variant="underlined"
              label="Hydrogen Min"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.main_el_max_value_h"
              density="default"
              variant="underlined"
              label="Hydrogen Max"
              class="no-input-control"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.precision_h"
              density="default"
              variant="underlined"
              label="Hydrogen Precision"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-divider class="mb-4" />
        <v-col cols="3">
          <v-text-field
              v-model="form.code_1"
              :maxlength="2"
              density="default"
              variant="underlined"
              label="Other Elements"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.other_el_min_value_1"
              density="default"
              variant="underlined"
              label="Min"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="2">
          <v-number-input
              v-model="form.other_el_max_value_1"
              density="default"
              variant="underlined"
              label="Max"
              bg-color="white"
              clearable
          ></v-number-input>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import FormDialog from "@/components/FormDialog.vue";
import {toast} from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";



const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const codeTypes = ref([
  {
    title: "5.65 ROOT CSA",
    value: "1",
  },
  {
    title: "200 MM",
    value: "2",
  },
  {
    title: "50 MM",
    value: "3",
  },
  {
    title: "8 IN",
    value: "4",
  },
  {
    title: "2 IN",
    value: "5",
  },
  {
    title: "80 MM",
    value: "6",
  },
]);
const data = reactive({
  form: {
    id: undefined,
    spec_id: undefined,
    spec: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    type: "Main",
    main_el_min_value_c: undefined,
    main_el_max_value_c: undefined,
    precision_c: undefined,
    main_el_min_value_s: undefined,
    main_el_max_value_s: undefined,
    precision_s: undefined,
    main_el_min_value_cr: undefined,
    main_el_max_value_cr: undefined,
    precision_cr: undefined,
    main_el_min_value_al: undefined,
    main_el_max_value_al: undefined,
    precision_al: undefined,
    main_el_min_value_cu: undefined,
    main_el_max_value_cu: undefined,
    precision_cu: undefined,
    main_el_min_value_ti: undefined,
    main_el_max_value_ti: undefined,
    precision_ti: undefined,
    main_el_min_value_ca: undefined,
    main_el_max_value_ca: undefined,
    precision_ca: undefined,
    main_el_min_value_si: undefined,
    main_el_max_value_si: undefined,
    precision_si: undefined,
    main_el_min_value_mo: undefined,
    main_el_max_value_mo: undefined,
    precision_mo: undefined,
    main_el_min_value_b: undefined,
    main_el_max_value_b: undefined,
    precision_b: undefined,
    main_el_min_value_nb: undefined,
    main_el_max_value_nb: undefined,
    precision_nb: undefined,
    main_el_min_value_v: undefined,
    main_el_max_value_v: undefined,
    precision_v: undefined,
    main_el_min_value_sal: undefined,
    main_el_max_value_sal: undefined,
    precision_sal: undefined,
    main_el_min_value_mn: undefined,
    main_el_max_value_mn: undefined,
    precision_mn: undefined,
    main_el_min_value_sp: undefined,
    main_el_max_value_sp: undefined,
    precision_sp: undefined,
    main_el_min_value_ni: undefined,
    main_el_max_value_ni: undefined,
    precision_ni: undefined,
    main_el_min_value_co: undefined,
    main_el_max_value_co: undefined,
    precision_co: undefined,
    main_el_min_value_sn: undefined,
    main_el_max_value_sn: undefined,
    precision_sn: undefined,
    main_el_min_value_n: undefined,
    main_el_max_value_n: undefined,
    precision_n: undefined,
    main_el_min_value_h: undefined,
    main_el_max_value_h: undefined,
    precision_h: undefined,
    code_1: undefined,
    other_el_min_value_1: undefined,
    other_el_max_value_1: undefined,
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
    id: undefined,
    spec_id: commonStore.spec.id,
    spec: commonStore.spec,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    type: "Main",
    main_el_min_value_c: undefined,
    main_el_max_value_c: undefined,
    precision_c: undefined,
    main_el_min_value_s: undefined,
    main_el_max_value_s: undefined,
    precision_s: undefined,
    main_el_min_value_cr: undefined,
    main_el_max_value_cr: undefined,
    precision_cr: undefined,
    main_el_min_value_al: undefined,
    main_el_max_value_al: undefined,
    precision_al: undefined,
    main_el_min_value_cu: undefined,
    main_el_max_value_cu: undefined,
    precision_cu: undefined,
    main_el_min_value_ti: undefined,
    main_el_max_value_ti: undefined,
    precision_ti: undefined,
    main_el_min_value_ca: undefined,
    main_el_max_value_ca: undefined,
    precision_ca: undefined,
    main_el_min_value_si: undefined,
    main_el_max_value_si: undefined,
    precision_si: undefined,
    main_el_min_value_mo: undefined,
    main_el_max_value_mo: undefined,
    precision_mo: undefined,
    main_el_min_value_b: undefined,
    main_el_max_value_b: undefined,
    precision_b: undefined,
    main_el_min_value_nb: undefined,
    main_el_max_value_nb: undefined,
    precision_nb: undefined,
    main_el_min_value_v: undefined,
    main_el_max_value_v: undefined,
    precision_v: undefined,
    main_el_min_value_sal: undefined,
    main_el_max_value_sal: undefined,
    precision_sal: undefined,
    main_el_min_value_mn: undefined,
    main_el_max_value_mn: undefined,
    precision_mn: undefined,
    main_el_min_value_sp: undefined,
    main_el_max_value_sp: undefined,
    precision_sp: undefined,
    main_el_min_value_ni: undefined,
    main_el_max_value_ni: undefined,
    precision_ni: undefined,
    main_el_min_value_co: undefined,
    main_el_max_value_co: undefined,
    precision_co: undefined,
    main_el_min_value_sn: undefined,
    main_el_max_value_sn: undefined,
    precision_sn: undefined,
    main_el_min_value_n: undefined,
    main_el_max_value_n: undefined,
    precision_n: undefined,
    main_el_min_value_h: undefined,
    main_el_max_value_h: undefined,
    precision_h: undefined,
    code_1: undefined,
    other_el_min_value_1: undefined,
    other_el_max_value_1: undefined,
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
