<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Mill"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="12">
          <v-text-field
              v-model="form.code"
              :rules="rules.code"
              :disabled="!!form.id"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
              v-model="form.type"
              :rules="rules.type"
              label="Type"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <UserCode v-model="form.user_ids" :multiple="true" density="default" :hide-details="false" :rules="rules.user_ids" />
        </v-col>
        <v-col cols="12">
          <v-textarea
              v-model="form.desc"
              :rules="rules.desc"
              label="Description"
              rows="3"
              clearable
          />
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import FormDialog from "@/components/FormDialog.vue";
import UserCode from "@/components/picker/UserCode.vue";
import API from "../api";

const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    code: undefined,
    desc: undefined,
    type: undefined,
    user_ids: [],
  },
  rules: {
    code: [
      value => {
        if (value) return true
        return 'Code is required.'
      }
    ],
    type: [
      value => {
        if (value) return true
        return 'Type is required.'
      }
    ],
    user_ids: [
      value => {
        if (value && value.length > 0) return true
        return 'User is required.'
      }
    ],
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const snackbar = inject('snackbar');

const handleShow = (data) => {
  if (data) {
    const params = toRaw(data);
    form.value = {
      id: params.id,
      code: params.code,
      type: params.type,
      desc: params.desc,
      user_ids: (params.dispatch_user || []).map(item => item.id),
    }
  }
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    code: undefined,
    desc: undefined,
    type: undefined,
    user_ids: [],
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
  try {
    await API.saveMill(params);
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

defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
