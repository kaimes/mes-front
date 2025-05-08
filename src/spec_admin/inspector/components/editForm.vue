<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Inspector"
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
          <v-text-field
              v-model="form.code"
              density="default"
              label="Code"
              :hide-details="false"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.type"
              density="default"
              label="Type"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.name"
              density="default"
              label="Name"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
              v-model="form.desc"
              density="default"
              label="Desc"
              bg-color="white"
              rows="3"
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
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
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
    code: undefined,
    type: undefined,
    name: undefined,
    desc: undefined,
  },
  rules: {
    weight_min: [
      value => {
        if (isThanZero(value)) return true
        return 'Weight Min is required.'
      }
    ],
    weight_max: [
      value => {
        if (isThanZero(value)) return true
        return 'Weight Max is required.'
      }
    ],
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
    form.value = {
      id: data.id,
      mill_id: data.mill_id,
      mill: data.mill,
      code: data.code,
      type: data.type,
      name: data.name,
      desc: data.desc,
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
    code: undefined,
    type: undefined,
    name: undefined,
    desc: undefined,
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}

const handleMillChange = (data) => {
  form.value.mill = data;
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
