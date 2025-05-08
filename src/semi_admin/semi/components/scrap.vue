<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? $t('semi.scrap_button.update') : $t('semi.scrap_button.add')"
      :desc="$t('semi.scrap_button.scrap')"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <v-text-field
            type="number"
            v-model="form.scrap_quantity"
            density="default"
            :label="$t('semi.scrap_button.no_pcs')"
            :hide-details="false"
            :rules="rules.Nopcs"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.comment"
            density="default"
            :label="$t('semi.scrap_button.scrap_comment')"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <DefectReason
            :label="$t('semi.scrap_button.reason')"
            v-model="form.defect_reason_id"
            :rules="rules.defect_reason_id"
            variant="underlined"
            density="comfortable"
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
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
import DefectReason from "@/components/picker/DefectReason.vue";
import useCommonStore from "@/app/common";
import {isThanZero} from "@/util/util";
import {toast} from "vue3-toastify";
import {map} from "lodash";
const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    defect_reason_id: undefined,
    // defect_reason: {},
    scrap_quantity: undefined,
    comment: undefined,
  },
  scrap_quantity: undefined,
  rules: {
    Nopcs: [
      value => {
        if (!value) return 'No pcs is required.'
        if (scrap_quantity.value && value > scrap_quantity.value)
            return 'Scrap Quantity must be less than Quantity.'
        return true
        
      }
    ],
  }
});

const { form, rules, scrap_quantity } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  form.value = {
    id: data[0].id,
    defect_reason_id: data[0].defect_reason_id,
    // defect_reason: map(data, (item) => item.defect_reason),
    scrap_quantity: data[0].scrap_quantity,
    comment: data[0].comment,
  };
  scrap_quantity.value = data[0].quantity;  
  
  
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    defect_reason_id: undefined,
    // defect_reason: {},
    scrap_quantity: undefined,
    comment: undefined,
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
    await API.scrap(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Scrap Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    if (res.response.status === 400) {
      toast.error(res.response.data.detail || "Bad Request", { autoClose: 60000 });
    } else {
      toast.error(params.id ? "Scrap Fail" : "Create Fail", { autoClose: 60000 });
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
