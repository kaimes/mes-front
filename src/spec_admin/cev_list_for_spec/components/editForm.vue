<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="CEV End Use"
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
              v-model="form.cev_value"
              :rules="rules.cev"
              density="default"
              variant="underlined"
              label="CEV Value"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.steel_type"
              :maxlength="5"
              density="default"
              variant="underlined"
              label="Steel Type"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.section_code"
              density="default"
              variant="underlined"
              label="Section Code"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col> -->
        <v-col cols="6">
          <v-text-field
              v-model="form.flange"
              density="default"
              variant="underlined"
              label="Flange No."
              bg-color="white"
              type="number"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.flange_min"
              density="default"
              variant="underlined"
              label="Flange Min"
              bg-color="white"
              type="number"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.flange_max"
              density="default"
              variant="underlined"
              label="Flange Max"
              bg-color="white"
              type="number"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.material_type"
              :maxlength="5"
              density="default"
              variant="underlined"
              label="Material Type"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.cev_min"
              density="default"
              variant="underlined"
              label="Cev Min"
              bg-color="white"
              type="number"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.cev_max"
              density="default"
              variant="underlined"
              label="Cev Max"
              bg-color="white"
              type="number"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.quality_code"
              :maxlength="20"
              density="default"
              variant="underlined"
              label="Quality Code"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.st"
              :maxlength="5"
              density="default"
              variant="underlined"
              label="ST"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.risk"
              :maxlength="5"
              density="default"
              variant="underlined"
              label="Risk"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
              v-model="form.notes"
              density="default"
              variant="underlined"
              label="Notes"
              bg-color="white"
              rows="3"
              required
              clearable
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import {toast} from "vue3-toastify";
import API from "../api";
import useCommonStore from "@/app/common";
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
    cev_value: undefined,
    steel_type: undefined,
    // section_code: undefined,
    flange: undefined,
    flange_min: undefined,
    flange_max: undefined,
    material_type: undefined,
    // spec_short_name: undefined,
    // full_spec_name: undefined,
    cev_min: undefined,
    cev_max: undefined,
    st: undefined,
    quality_code: undefined,
    risk: undefined,
    notes: undefined,
  },
  rules: {
    spec_code: [
      value => {
        if (value) return true
        return 'Spec Code is required.'
      }
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
  console.log("form.value", form.value)
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    spec_id: undefined,
    spec: undefined,
    mill_id: undefined,
    mill: undefined,
    cev_value: undefined,
    steel_type: undefined,
    // section_code: undefined,
    flange: undefined,
    flange_min: undefined,
    flange_max: undefined,
    material_type: undefined,
    // spec_short_name: undefined,
    // full_spec_name: undefined,
    cev_min: undefined,
    cev_max: undefined,
    st: undefined,
    quality_code: undefined,
    risk: undefined,
    notes: undefined,
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

defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
