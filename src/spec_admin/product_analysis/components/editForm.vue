<template>
  <FormDialog
      v-model="visible"
      :width="1200"
      :title="form.id ? 'Update' : 'Add'"
      desc="Product Analysis"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">

      <div class="mb-4 border rounded pt-3 pl-3 pr-3">
        <div class="text-subtitle-1 mb-2">Add to Spec Code:</div>
        <v-row>
          <v-col cols="6">
            <spec-code v-model="form.spec_id" :hide-details="false" :spec="form.spec" :rules="rules.spec_code" :disabled="!!form.id" />
          </v-col>
          <v-col cols="6">
          <MillCode v-model="form.mill_id" :hide-details="false" />
        </v-col>
          <v-col cols="4">
            <v-number-input
                v-model="form.cev_min"
                variant="underlined"
                label="CEV Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="4">
            <v-number-input
                v-model="form.cev_max"
                variant="underlined"
                label="CEV Max"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="4">
            <v-number-input
                v-model="form.cev_value"
                variant="underlined"
                label="CEV Value"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
        </v-row>
      </div>
      <div class="mb-4 border rounded pt-3 pl-3 pr-3">
        <v-row>
          <v-col cols="4">
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
          <v-col cols="4">
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
          <v-col cols="4">
            <v-text-field
                v-model="form.location"
                :maxlength="1"
                density="default"
                variant="underlined"
                label="Location"
                bg-color="white"
                required
                clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_c"
                density="default"
                variant="underlined"
                label="Carbon Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_c"
                density="default"
                variant="underlined"
                label="Carbon Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_s"
                density="default"
                variant="underlined"
                label="Sulphur Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_s"
                density="default"
                variant="underlined"
                label="Sulphur Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_cr"
                density="default"
                variant="underlined"
                label="Chrome Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_cr"
                density="default"
                variant="underlined"
                label="Chrome Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_al"
                density="default"
                variant="underlined"
                label="Alumin Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_al"
                density="default"
                variant="underlined"
                label="Alumin Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_cu"
                density="default"
                variant="underlined"
                label="Copper Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_cu"
                density="default"
                variant="underlined"
                label="Copper Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_ti"
                density="default"
                variant="underlined"
                label="Titanium Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_ti"
                density="default"
                variant="underlined"
                label="Titanium Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_ca"
                density="default"
                variant="underlined"
                label="Calcium Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_ca"
                density="default"
                variant="underlined"
                label="Calcium Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_si"
                density="default"
                variant="underlined"
                label="Silicon Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_si"
                density="default"
                variant="underlined"
                label="Silicon Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_mo"
                density="default"
                variant="underlined"
                label="Moly Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_mo"
                density="default"
                variant="underlined"
                label="Moly Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_b"
                density="default"
                variant="underlined"
                label="Boron Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_b"
                density="default"
                variant="underlined"
                label="Boron Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_nb"
                density="default"
                variant="underlined"
                label="Niobium Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_nb"
                density="default"
                variant="underlined"
                label="Niobium Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_v"
                density="default"
                variant="underlined"
                label="Vanadium Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_v"
                density="default"
                variant="underlined"
                label="Vanadium Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_sol_al"
                density="default"
                variant="underlined"
                label="SOL AL Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_sol_al"
                density="default"
                variant="underlined"
                label="SOL AL Max"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.precision_sol_al"
                density="default"
                variant="underlined"
                label="SOL AL Precision"
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_mn"
                density="default"
                variant="underlined"
                label="Manganese Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_mn"
                density="default"
                variant="underlined"
                label="Manganese Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_sp"
                density="default"
                variant="underlined"
                label="S&P Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_sp"
                density="default"
                variant="underlined"
                label="S&P Max"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.precision_sp"
                density="default"
                variant="underlined"
                label="S&P Precision"
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_ni"
                density="default"
                variant="underlined"
                label="Nickel Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_ni"
                density="default"
                variant="underlined"
                label="Nickel Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_co"
                density="default"
                variant="underlined"
                label="Cobalt Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_co"
                density="default"
                variant="underlined"
                label="Cobalt Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_sn"
                density="default"
                variant="underlined"
                label="Tin Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_sn"
                density="default"
                variant="underlined"
                label="Tin Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_n"
                density="default"
                variant="underlined"
                label="Nitrogen Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_n"
                density="default"
                variant="underlined"
                label="Nitrogen Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_min_val_h"
                density="default"
                variant="underlined"
                label="Hydrogen Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.main_el_max_val_h"
                density="default"
                variant="underlined"
                label="Hydrogen Max"
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
                class="no-input-control"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
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
                v-model="form.other_el_min_val_1"
                density="default"
                variant="underlined"
                label="Min"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="2">
            <v-number-input
                v-model="form.other_el_max_val_1"
                density="default"
                variant="underlined"
                label="Max"
                bg-color="white"
                clearable
            ></v-number-input>
          </v-col>
        </v-row>

      </div>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";


const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    spec_id: commonStore.spec_id,
    spec: commonStore.sepc,
    s_code: undefined,
    cev_min: undefined,
    cev_max: undefined,
    cev_value: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    main_el_min_val_c: undefined,
    main_el_max_val_c: undefined,
    precision_c: undefined,
    main_el_min_val_s: undefined,
    main_el_max_val_s: undefined,
    precision_s: undefined,
    main_el_min_val_cr: undefined,
    main_el_max_val_cr: undefined,
    precision_cr: undefined,
    main_el_min_val_al: undefined,
    main_el_max_val_al: undefined,
    precision_al: undefined,
    main_el_min_val_cu: undefined,
    main_el_max_val_cu: undefined,
    precision_cu: undefined,
    main_el_min_val_ti: undefined,
    main_el_max_val_ti: undefined,
    precision_ti: undefined,
    main_el_min_val_ca: undefined,
    main_el_max_val_ca: undefined,
    precision_ca: undefined,
    main_el_min_val_si: undefined,
    main_el_max_val_si: undefined,
    precision_si: undefined,
    main_el_min_val_mo: undefined,
    main_el_max_val_mo: undefined,
    precision_mo: undefined,
    main_el_min_val_b: undefined,
    main_el_max_val_b: undefined,
    precision_b: undefined,
    main_el_min_val_nb: undefined,
    main_el_max_val_nb: undefined,
    precision_nb: undefined,
    main_el_min_val_v: undefined,
    main_el_max_val_v: undefined,
    precision_v: undefined,
    main_el_min_val_sol_al: undefined,
    main_el_max_val_sol_al: undefined,
    precision_sol_al: undefined,
    main_el_min_val_mn: undefined,
    main_el_max_val_mn: undefined,
    precision_mn: undefined,
    main_el_min_val_sp: undefined,
    main_el_max_val_sp: undefined,
    precision_sp: undefined,
    main_el_min_val_ni: undefined,
    main_el_max_val_ni: undefined,
    precision_ni: undefined,
    main_el_min_val_co: undefined,
    main_el_max_val_co: undefined,
    precision_co: undefined,
    main_el_min_val_sn: undefined,
    main_el_max_val_sn: undefined,
    precision_sn: undefined,
    main_el_min_val_n: undefined,
    main_el_max_val_n: undefined,
    precision_n: undefined,
    main_el_min_val_h: undefined,
    main_el_max_val_h: undefined,
    precision_h: undefined,
    code_1: undefined,
    other_el_min_val_1: undefined,
    other_el_max_val_1: undefined,
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
    cev_min: undefined,
    cev_max: undefined,
    cev_value: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    type: undefined,
    main_el_min_val_c: undefined,
    main_el_max_val_c: undefined,
    precision_c: undefined,
    main_el_min_val_s: undefined,
    main_el_max_val_s: undefined,
    precision_s: undefined,
    main_el_min_val_cr: undefined,
    main_el_max_val_cr: undefined,
    precision_cr: undefined,
    main_el_min_val_al: undefined,
    main_el_max_val_al: undefined,
    precision_al: undefined,
    main_el_min_val_cu: undefined,
    main_el_max_val_cu: undefined,
    precision_cu: undefined,
    main_el_min_val_ti: undefined,
    main_el_max_val_ti: undefined,
    precision_ti: undefined,
    main_el_min_val_ca: undefined,
    main_el_max_val_ca: undefined,
    precision_ca: undefined,
    main_el_min_val_si: undefined,
    main_el_max_val_si: undefined,
    precision_si: undefined,
    main_el_min_val_mo: undefined,
    main_el_max_val_mo: undefined,
    precision_mo: undefined,
    main_el_min_val_b: undefined,
    main_el_max_val_b: undefined,
    precision_b: undefined,
    main_el_min_val_nb: undefined,
    main_el_max_val_nb: undefined,
    precision_nb: undefined,
    main_el_min_val_v: undefined,
    main_el_max_val_v: undefined,
    precision_v: undefined,
    main_el_min_val_sol_al: undefined,
    main_el_max_val_sol_al: undefined,
    precision_sol_al: undefined,
    main_el_min_val_mn: undefined,
    main_el_max_val_mn: undefined,
    precision_mn: undefined,
    main_el_min_val_sp: undefined,
    main_el_max_val_sp: undefined,
    precision_sp: undefined,
    main_el_min_val_ni: undefined,
    main_el_max_val_ni: undefined,
    precision_ni: undefined,
    main_el_min_val_co: undefined,
    main_el_max_val_co: undefined,
    precision_co: undefined,
    main_el_min_val_sn: undefined,
    main_el_max_val_sn: undefined,
    precision_sn: undefined,
    main_el_min_val_n: undefined,
    main_el_max_val_n: undefined,
    precision_n: undefined,
    main_el_min_val_h: undefined,
    main_el_max_val_h: undefined,
    precision_h: undefined,
    code_1: undefined,
    other_el_min_val_1: undefined,
    other_el_max_val_1: undefined,
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
