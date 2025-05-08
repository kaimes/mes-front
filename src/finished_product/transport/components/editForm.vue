<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Transport"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :mill="form.mill" :rules="rules.mill_id" :hide-details="false" />
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.code"
              :rules="rules.code"
              density="default"
              variant="underlined"
              label="Transport No."
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.type"
              density="default"
              variant="underlined"
              label="Type"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-number-input
              v-model="form.length_mm"
              label="Length(m)"
              :min="0"
              :max="24000"
              class="no-input-control"
              variant="underlined"
              @blur="handleBlur('length_mm')"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="6">
          <v-number-input
              v-model="form.weight_kg"
              label="Weight(Tonnes)"
              :min="0"
              :max="50000"
              class="no-input-control"
              variant="underlined"
              @blur="handleBlur('weight_kg')"
              clearable
          ></v-number-input>
        </v-col>
        <v-col cols="6">
          <DictCode
              v-model="form.status"
              code="transport_status"
              label="Status"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              :hide-details="false"
          />
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import MillCode from "@/components/picker/MillCode.vue";
import {toast} from "vue3-toastify";
import useCommonStore from "@/app/common";
import API from "../api";
import { VNumberInput } from 'vuetify/labs/VNumberInput'

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  form: {
    id: undefined,
    mill_id: undefined,
    mill: undefined,
    code: undefined,
    type: undefined,
    length_mm: undefined,
    weight_kg: undefined,
    status: undefined,
  },
  rules: {
    mill_id: [
      value => {
        if (value) return true
        return 'Mill is required.'
      }
    ],
    code: [
      value => {
        if (value) return true
        return 'Code is required.'
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
      id: params.id,
      mill_id: params.mill?.id,
      mill: params.mill,
      code: params.code,
      type: params.type,
      length_mm: params.length_mm,
      weight_kg: params.weight_kg,
      status: params.status,
    }
  }

}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    mill_id: undefined,
    mill: undefined,
    code: undefined,
    type: undefined,
    length_mm: undefined,
    weight_kg: undefined,
    status: undefined,
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
  const params = toRaw({
    ...form.value,
    length_mm: form.value.length_mm * 1000,
    weight_kg: form.value.weight_kg * 1000,
    });
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleBlur = (field) => {
  const value = form.value[field];

  if (!value) {
    form.value[field] = undefined;
  } else {
    form.value[field] = parseFloat(value).toFixed(4);
  }
}

defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
