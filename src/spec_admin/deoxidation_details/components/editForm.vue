<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Deoxidation Details"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="12">
          <spec-code v-model="form.spec_id" :hide-details="false" :spec="form.spec" :rules="rules.spec_code" @change="handleSpecCodeChange" :disabled="!!form.id" />
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.thick_from"
              :rules="rules.thick_from"
              class="no-input-control"
              variant="underlined"
              label="Thickness From"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.thick_to"
              :rules="rules.thick_to"
              class="no-input-control"
              variant="underlined"
              label="Thickness To"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <dict-code
              v-model="form.location"
              label="Location"
              placeholder="Select Location"
              code="spria_loc"
              persistent-placeholder
          />
        </v-col>
        <v-col cols="6">
          <dict-code
              v-model="form.remarks"
              label="Remarks"
              placeholder="Select Remarks"
              code="deoxidation_loc"
              persistent-placeholder
          />
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>

<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import { toast } from "vue3-toastify";
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import API from "../api";
import {greaterThan, isThanZero} from "@/util/util";
import DictCode from "@/components/picker/DictCode.vue";

const commonStore = useCommonStore();
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
    "thick_from": undefined,
    "thick_to": undefined,
    "location": undefined,
    "remarks": undefined,
  },
  rules: {
    spec_code: [
      value => {
        if (value) return true
        return 'Spec Code is required.'
      }
    ],
    thick_from: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness From is required.'
      },
      value => {
        if (greaterThan(value, form.value.thick_to)) {
          return 'thickness from must be smaller than thickness to'
        }
      }
    ],
    thick_to: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness To is required.'
      },
      value => {
        if (greaterThan(form.value.thick_from, value)) {
          return 'thickness to must be greater than thickness from'
        }
      }
    ],
    location: [
      value => {
        if (value) return true;
        return 'Location is required.';
      }
    ],
  }
});

const {form, rules} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    const value = toRaw(data);
    form.value = { ...value };
  } else {
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
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "thick_from": undefined,
    "thick_to": undefined,
    "spec_code": undefined,
    "remarks": undefined,
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
    toast.error(res?.response?.data?.data?.tip || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
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
