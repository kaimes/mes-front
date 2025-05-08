<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Spec Remark"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="6">
          <v-text-field
              v-model="form.code"
              :rules="rules.code"
              persistent-placeholder
              variant="underlined"
              label="Code"
              
              :readonly="isUse"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :hide-details="false" />
        </v-col>

      
        <v-col cols="6">
          <v-text-field
              v-model="form.name"
              :rules="rules.name"
              persistent-placeholder
              variant="underlined"
              label="Name"
              clearable
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
              v-model="form.desc"
              :rules="rules.desc"
              :min="0"
              class="no-input-control"
              persistent-placeholder
              variant="underlined"
              label="Describe"
              clearable
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <DictCode
              v-model="form.type"
              code="Remark_Type"
              :rules="rules.type"
              persistent-placeholder
              variant="underlined"
              label="Type"
              clearable
          ></DictCode>
        </v-col>
        <v-col cols="6">
          <DictCode
              v-model="form.group"
              code="Remark_Group"
              :rules="rules.group"
              persistent-placeholder
              variant="underlined"
              label="Group"
              clearable
          ></DictCode>
        </v-col>

      </v-row>

 
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
const isUse = ref(false)
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
    "code": undefined,
    "type": undefined,
    "group": undefined,
    "name": undefined,
    "desc": undefined
  },
  rules: {
    code: [
      value => {
        if (value) return true
        return 'Remark Code is required.'
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
    isUse.value = true
    const value = toRaw(data);
    form.value = { ...value };
  } else {
    isUse.value = false
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
  
    "code": undefined,
    "type": undefined,
    "group": undefined,
    "name": undefined,
    "desc": undefined
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
