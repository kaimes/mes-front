<template>
  <FormDialog
      v-model="visible"
      :width="500"
      :title="form.id ? 'Update' : 'Add'"
      desc="Other Elements"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="6">
          <dict-code
              v-model="form.code"
              :hide-details="false"
              :rules="rules.code"
              bg-color="white"
              density="default"
              variant="underlined"
              color="#333"
              label="Code"
              code="other_code"
              persistent-placeholder
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.element_abbr"
              :rules="rules.element_abbr"
              variant="underlined"
              label="Abbr"
              persistent-placeholder
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.min_value"
              :rules="rules.min_value"
              variant="underlined"
              label="Min"
              persistent-placeholder
              @blur="handleBlur('min_value')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.max_value"
              :rules="rules.max_value"
              variant="underlined"
              label="Max"
              persistent-placeholder
              @blur="handleBlur('max_value')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.precision"
              :rules="rules.precision"
              variant="underlined"
              label="Precision"
              persistent-placeholder
              @blur="handleBlur('precision', 'init')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.uom"
              variant="underlined"
              label="UOM"
              persistent-placeholder
              clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import {toast} from "vue3-toastify";
import API from "../api";
import DictCode from "@/components/picker/DictCode.vue";


const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const parent = ref({
  type: undefined,
  id: undefined,
});
const data = reactive({
  form: {
    id: undefined,
    spprodan_id: undefined,
    code: undefined,
    min_value: undefined,
    max_value: undefined,
    precision: undefined,
    element_abbr: undefined,
    uom: undefined,
    spmainel_id: undefined,
  },
  rules: {
    code: [
      value => {
        if (value) return true
        return 'Code is required.'
      }
    ],
    precision: [
      value => {
        if (isThanZero(value)) return true
        return 'precision is required.'
      },
    ],
    min_value: [
      value => {
        if (isThanZero(value)) return true
        return 'min is required.'
      },
      value => {
        if (form.value.max_value && greaterThan(value, form.value.max_value)) {
          return 'min must be smaller than max'
        }
        return true
      },
      value => {
        if (value && form.value.max_value && value === form.value.max_value) {
          return 'min cannot be equal max'
        }
        return true
      },
    ],
    max_value: [
      value => {
        if (isThanZero(value)) return true
        return 'max is required.'
      },
      value => {
        if (form.value.min_value && greaterThan(form.value.min_value, value)) {
          return 'max must be greater than min'
        }
        return true
      },
      value => {
        if (value && form.value.min_value && value === form.value.min_value) {
          return 'max cannot be equal min'
        }
        return true
      },
    ]
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh', 'change']);

const handleShow = (data, value) => {
  parent.value = value;
  if (data) {
    form.value = {
      id: data.id,
      spprodan_id: data.spprodan_id,
      code: data.code,
      min_value: data.min_value,
      max_value: data.max_value,
      precision: data.precision,
      element_abbr: data.element_abbr,
      uom: data.uom,
      spmainel_id: data.spmainel_id,
    };
  }
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  loading.value = false;
  parent.value = {
    type: undefined,
    id: undefined,
  };
  form.value = {
    id: undefined,
    spprodan_id: undefined,
    code: undefined,
    min_value: undefined,
    max_value: undefined,
    precision: undefined,
    element_abbr: undefined,
    uom: undefined,
    spmainel_id: undefined,
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
  if (!parent.value.id) {
    handleClose();
    emit("change", params);
    return;
  }
  try {
    await API.add(parent.value.type, parent.value.id, params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || (params.id ? "Update Fail" : "Create Fail"), { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleBlur = (field, type = "double") => {
  const value = form.value[field];
  if (!value) {
    form.value[field] = undefined;
  } else {
    form.value[field] = type === "double" ? parseFloat(value).toFixed(2) : parseInt(value, 10);
  }
}


defineExpose({
  handleShow,
});
watch(() => form.value.code, (newVal) => {
  if (newVal) {
    form.value.element_abbr = newVal.toLowerCase();
  }
});

</script>
<style scoped>

</style>

