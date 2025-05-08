<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Semi Load"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <v-text-field
              v-model="form.semi_load_code"
              :rules="rules.cev"
              density="default"
              variant="underlined"
              label="Semi Load"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.vehicle_code"
              :maxlength="5"
              density="default"
              variant="underlined"
              label="Wagon"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
              v-model="form.semi_count"
              density="default"
              variant="underlined"
              label="Number Of Bollms"
              bg-color="white"
              type="number"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.total_weight_ton"
              density="default"
              variant="underlined"
              label="Weight(Tonnes)"
              bg-color="white"
              type="number"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.supplier_code"
              density="default"
              variant="underlined"
              label="Supplier"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.status"
              :maxlength="5"
              density="default"
              variant="underlined"
              label="Status"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col> -->
        
        
        
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import {toast} from "vue3-toastify";
import API from "../api";
import useCommonStore from "@/app/common";

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,

    semi_load_code: undefined,
    vehicle_code: undefined,
    semi_count: undefined,
    total_weight_ton: undefined,
    supplier_code: undefined,
  
  },
  rules: {}
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
    
  }
  console.log("form.value", form.value)
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    semi_load_code: undefined,
    vehicle_code: undefined,
    semi_count: undefined,
    total_weight_ton: undefined,
    supplier_code: undefined,
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
    params['status'] = 'created'
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
