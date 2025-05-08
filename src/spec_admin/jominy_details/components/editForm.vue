<template>
  <FormDialog
      v-model="visible"
      :width="900"
      :title="form.id ? 'Update' : 'Add'"
      desc="Jominy Details"
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
          <dict-code
              v-model="form.units"
              :hide-details="false"
              bg-color="white"
              density="default"
              variant="underlined"
              color="#333"
              label="Unit"
              code="spec_units"
          />

        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="form.ideal_dia_min"
              density="default"
              variant="underlined"
              label="Ideal Diameter Min"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="form.ideal_dia_max"
              density="default"
              variant="underlined"
              label="Ideal Diameter Max"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="form.tin_ratio_min"
              density="default"
              variant="underlined"
              label="Ti/N Ratio Min"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="form.tin_ratio_max"
              density="default"
              variant="underlined"
              label="Ti/N Ratio Max"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.first_jominy_pos"
              density="default"
              variant="underlined"
              label="Position1"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              type="number"
              v-model="form.first_jominy_min"
              :rules="rules.first_jominy_min"
              density="default"
              variant="underlined"
              label="Min1"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              type="number"
              v-model="form.first_jominy_max"
              :rules="rules.first_jominy_max"
              density="default"
              variant="underlined"
              label="Max1"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_1"
              density="default"
              variant="underlined"
              label="Position2"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_1"
              density="default"
              variant="underlined"
              label="Min2"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_1"
              density="default"
              variant="underlined"
              label="Max2"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_2"
              density="default"
              variant="underlined"
              label="Position3"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_2"
              density="default"
              variant="underlined"
              label="Min3"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_2"
              density="default"
              variant="underlined"
              label="Max3"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_3"
              density="default"
              variant="underlined"
              label="Position4"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_3"
              density="default"
              variant="underlined"
              label="Min4"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_3"
              density="default"
              variant="underlined"
              label="Max4"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_4"
              density="default"
              variant="underlined"
              label="Position5"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_4"
              density="default"
              variant="underlined"
              label="Min5"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_4"
              density="default"
              variant="underlined"
              label="Max5"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_5"
              density="default"
              variant="underlined"
              label="Position6"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_5"
              density="default"
              variant="underlined"
              label="Min6"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_5"
              density="default"
              variant="underlined"
              label="Max6"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_6"
              density="default"
              variant="underlined"
              label="Position7"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_6"
              density="default"
              variant="underlined"
              label="Min7"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_6"
              density="default"
              variant="underlined"
              label="Max7"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_7"
              density="default"
              variant="underlined"
              label="Position8"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_7"
              density="default"
              variant="underlined"
              label="Min8"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_7"
              density="default"
              variant="underlined"
              label="Max8"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_8"
              density="default"
              variant="underlined"
              label="Position9"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_8"
              density="default"
              variant="underlined"
              label="Min9"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_8"
              density="default"
              variant="underlined"
              label="Max9"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_9"
              density="default"
              variant="underlined"
              label="Position10"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_9"
              density="default"
              variant="underlined"
              label="Min10"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_9"
              density="default"
              variant="underlined"
              label="Max10"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_10"
              density="default"
              variant="underlined"
              label="Position11"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_10"
              density="default"
              variant="underlined"
              label="Min11"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_10"
              density="default"
              variant="underlined"
              label="Max11"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_pos_11"
              density="default"
              variant="underlined"
              label="Position12"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_min_11"
              density="default"
              variant="underlined"
              label="Min12"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="form.other_jominy_max_11"
              density="default"
              variant="underlined"
              label="Max12"
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
import SpecCode from "@/components/picker/SpecCode.vue";
import {toast} from "vue3-toastify";
import API from "../api";
import useCommonStore from "@/app/common";
import MillCode from "@/components/picker/MillCode.vue";
import {greaterThan, isThanZero} from "@/util/util";
import DictCode from "@/components/picker/DictCode.vue";

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
    thick_from: undefined,
    thick_to: undefined,
    units: commonStore.units,
    ideal_dia_min: undefined,
    ideal_dia_max: undefined,
    tin_ratio_max: undefined,
    tin_ratio_min: undefined,
    first_jominy_pos: undefined,
    first_jominy_min: undefined,
    first_jominy_max: undefined,
    other_jominy_max_1:undefined,
    other_jominy_min_1:undefined,
    other_jominy_pos_1:undefined,
    other_jominy_max_2:undefined,
    other_jominy_min_2:undefined,
    other_jominy_pos_2:undefined,
    other_jominy_max_3:undefined,
    other_jominy_min_3:undefined,
    other_jominy_pos_3:undefined,
    other_jominy_max_4:undefined,
    other_jominy_min_4:undefined,
    other_jominy_pos_4:undefined,
    other_jominy_max_5:undefined,
    other_jominy_pos_5:undefined,
    other_jominy_max_6:undefined,
    other_jominy_min_6:undefined,
    other_jominy_pos_6:undefined,
    other_jominy_max_7:undefined,
    other_jominy_min_7:undefined,
    other_jominy_pos_7:undefined,
    other_jominy_max_8:undefined,
    other_jominy_min_8:undefined,
    other_jominy_pos_9:undefined,
    other_jominy_min_9:undefined,
    other_jominy_max_9:undefined,
    other_jominy_pos_10:undefined,
    other_jominy_min_10:undefined,
    other_jominy_max_10:undefined,
    other_jominy_pos_11:undefined,
    other_jominy_min_11:undefined,
    other_jominy_max_11:undefined,
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
    first_jominy_min: [
      value => {
        if (value && greaterThan(value, form.value.first_jominy_max)) {
          return 'min must be smaller than max'
        }
        return true;
      }
    ],
    first_jominy_max: [
      value => {
        if (value && greaterThan(form.value.first_jominy_min, value)) {
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
  visible.value = true;  
  if (data) {
    const params = toRaw(data);
    form.value = {
      ...params,
    }
  } else {
    form.value.spec = commonStore.spec;
    form.value.spec_id = commonStore.spec.id;
  }
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    spec_id: commonStore.spec.id,
    spec: commonStore.spec,
    mill_id: undefined,
    mill: undefined,
    thick_from: undefined,
    thick_to: undefined,
    units: commonStore.units,
    ideal_dia_min: undefined,
    ideal_dia_max: undefined,
    tin_ratio_min: undefined,
    tin_ratio_max: undefined,
    first_jominy_pos: undefined,
    first_jominy_min: undefined,
    first_jominy_max: undefined,
    other_jominy_max_1:undefined,
    other_jominy_min_1:undefined,
    other_jominy_pos_1:undefined,
    other_jominy_max_2:undefined,
    other_jominy_min_2:undefined,
    other_jominy_pos_2:undefined,
    other_jominy_max_3:undefined,
    other_jominy_min_3:undefined,
    other_jominy_pos_3:undefined,
    other_jominy_max_4:undefined,
    other_jominy_min_4:undefined,
    other_jominy_pos_4:undefined,
    other_jominy_max_5:undefined,
    other_jominy_pos_5:undefined,
    other_jominy_max_6:undefined,
    other_jominy_min_6:undefined,
    other_jominy_pos_6:undefined,
    other_jominy_max_7:undefined,
    other_jominy_min_7:undefined,
    other_jominy_pos_7:undefined,
    other_jominy_max_8:undefined,
    other_jominy_min_8:undefined,
    other_jominy_pos_9:undefined,
    other_jominy_min_9:undefined,
    other_jominy_max_9:undefined,
    other_jominy_pos_10:undefined,
    other_jominy_min_10:undefined,
    other_jominy_max_10:undefined,
    other_jominy_pos_11:undefined,
    other_jominy_min_11:undefined,
    other_jominy_max_11:undefined,
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
    toast.error(res?.response?.data?.detail || params.id ? "Update Fail"+res?.response?.data?.detail : "Create Fail", { autoClose: 60000 });
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
