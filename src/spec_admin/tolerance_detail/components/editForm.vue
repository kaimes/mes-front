<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Tolerance Detail"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <mill-code v-model="form.mill_id" :hide-details="false" :spec="form.mill" :rules="rules.mill_id" @change="handleMillChange" />
        </v-col>
        <v-col cols="6">
          <tolerance-code v-model="form.tolerance_id" :hide-details="false" :tolerance="form.tolerance" :rules="rules.tolerance_id" @change="handleToleranceChange" />
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.bar_loc_code"
              density="default"
              label="Bar Loc Code"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.value_min"
              density="default"
              label="Value Min"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.value_max"
              density="default"
              label="Value Max"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.diff_actual_min"
              density="default"
              label="Diff Actual Min"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.diff_actual_max"
              density="default"
              label="Diff Actual Max"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.diff_percent_min"
              density="default"
              label="Diff Percent Min"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.diff_percent_max"
              density="default"
              label="Diff Percent Max"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
import ToleranceCode from "@/components/picker/ToleranceCode.vue";
import useCommonStore from "@/app/common";
import {isThanZero} from "@/util/util";
import {toast} from "vue3-toastify";
const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    mill_id: undefined,
    mill: {},
    tolerance_id: undefined,
    tolerance: {},
    bar_loc_code: undefined,
    value_min: undefined,
    value_max: undefined,
    diff_actual_min: undefined,
    diff_actual_max: undefined,
    diff_percent_min: undefined,
    diff_percent_max: undefined,
  },
  rules: {
    // weight_min: [
    //   value => {
    //     if (isThanZero(value)) return true
    //     return 'Weight Min is required.'
    //   }
    // ],
    // weight_max: [
    //   value => {
    //     if (isThanZero(value)) return true
    //     return 'Weight Max is required.'
    //   }
    // ],
    tolerance_id: [
      value => {
        if (value) return true
        return 'Tolerance is required.'
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
      mill_id: data.mill_id,
      mill: data.mill,
      tolerance_id: data.tolerance_id,
      tolerance: data.tolerance,
      bar_loc_code: data.bar_loc_code,
      value_min: data.value_min,
      value_max: data.value_max,
      diff_actual_min: data.diff_actual_min,
      diff_actual_max: data.diff_actual_max,
      diff_percent_min: data.diff_percent_min,
      diff_percent_max: data.diff_percent_max
    };
  }
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    mill_id: undefined,
    mill: {},
    tolerance_id: undefined,
    tolerance: {},
    bar_loc_code: undefined,
    value_min: undefined,
    value_max: undefined,
    diff_actual_min: undefined,
    diff_actual_max: undefined,
    diff_percent_min: undefined,
    diff_percent_max: undefined
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}

const handleMillChange = (data) => {
  form.value.mill = data;
}

const handleToleranceChange = (data) => {
  form.value.tolerance = data;
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  if (!params.id) {
    delete params.mill;
  }
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    if (res.response.status === 400) {
      toast.error(res.response.data.detail || "Bad Request", { autoClose: 60000 });
    } else {
      toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
    }
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
