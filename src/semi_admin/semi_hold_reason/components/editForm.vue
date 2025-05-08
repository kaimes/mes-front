<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ?  $t('global.edit') : $t('global.new')"
      desc="Hold Reason"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :mill="form.mill" :rules="rules.mill_id" :hide-details="false" />
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.code"
              :rules="rules.code"
              density="default"
              variant="underlined"
              :label="$t('semi_hold_reason.edit.code')"
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
              :label="$t('semi_hold_reason.edit.type')"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.name"
              density="default"
              variant="underlined"
              :label="$t('semi_hold_reason.edit.name')"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.desc"
              density="default"
              variant="underlined"
              :label="$t('semi_hold_reason.edit.desc')"
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
import FormDialog from "@/components/FormDialog.vue";
import MillCode from "@/components/picker/MillCode.vue";
import {toast} from "vue3-toastify";
import useCommonStore from "@/app/common";
import API from "../api";

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
    name: undefined,
    desc: undefined,
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
      mill_id: params.mill.id,
      mill: params.mill,
      code: params.code,
      type: params.type,
      name: params.name,
      desc: params.desc,
    }
  }

}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    mill_id: undefined,
    code: undefined,
    type: undefined,
    name: undefined,
    desc: undefined,
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

defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
