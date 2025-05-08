<template>
  <FormDialog
      v-model="visible"
      :width="660"
      :title="form.id ? 'Update' : 'Add'"
      desc="Test"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="6">
          <v-text-field
            v-model="form.test_code"
            density="default"
            variant="underlined"
            label="Test Code"
            bg-color="white"
            clearable
            hide-details
        ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.ref_code"
            density="default"
            variant="underlined"
            label="Ref Code"
            bg-color="white"
            clearable
            hide-details
        ></v-text-field>
        </v-col>
        <v-col cols="6">
          <RunoutCode
            v-model="pick.runout_code"
            label="Runout Code"
            @change="handlePickRunoutCode"
          />
        </v-col>
        <v-col cols="6">
          <RollingCode
            v-model="pick.rolling_code"
            label="Rolling Code"
            @change="handlePickRollingCode"
          />
        </v-col>
        <v-col cols="6">
          <SpecCode
            v-model="pick.spec_code"
            label="Spec Code"
            @change="handleSpecCodeChange"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="form.type"
            :items="['Tensile', 'Impact']"
            density="default"
            variant="underlined"
            label="Type"
            bg-color="white"
            clearable
            hide-details
          ></v-select>
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
import RunoutCode from "@/components/picker/RunoutCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {isThanZero} from "@/util/util";
import API from "../api";
import { th } from "date-fns/locale";
import MillCode from "@/components/picker/MillCode.vue";
import { objectEach } from "xe-utils";

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    "id": undefined,
    "test_code": undefined,
    "ref_code": undefined,
    "test_sample_id": undefined,
    "runout_id": undefined,
    "rolling_id": undefined,
    "spec_id": undefined,
    "type": undefined,
  },
  rules: {
    test_code: [
      value => {
        if (value) return true
        return 'Test Code is required.'
      }
    ]
  },
  pick: {
    "runout_code": undefined,
    "rolling_code": undefined,
    "spec_code": undefined,
  }
});

const { form, rules, pick } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    const value = toRaw(data);
    for (const key in form.value) {
      form.value[key] = value[key];
    }
    pick.value.runout_code = data.runout?.runout_code;
    pick.value.rolling_code = data.rolling?.rolling_code;
    pick.value.spec_code = data.spec?.spec_code;
  } else {
    pick.value.runout_code = null;
    pick.value.rolling_code = null;
    pick.value.spec_code = null;
  }
  visible.value = true;
}

function handlePickRunoutCode(runout_item) {
  form.value.runout_id = runout_item?.id
}

function handlePickRollingCode(rolling_item) {
  form.value.rolling_id = rolling_item?.id
}

function handleSpecCodeChange(spec_item) {
  form.value.spec_id = spec_item.id
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    "id": undefined,
    "test_code": undefined,
    "ref_code": undefined,
    "test_sample_id": undefined,
    "runout_id": undefined,
    "rolling_id": undefined,
    "spec_id": undefined,
    "type": undefined,
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


defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
