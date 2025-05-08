<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Quality"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <mill-code v-model="form.mill_id" :hide-details="false" :mill="form.mill" :rules="rules.mill_id" />
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
              v-model="form.name"
              density="default"
              label="Name"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.version"
              density="default"
              label="Version"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.version_status"
              density="default"
              label="Version Status"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.type"
              density="default"
              label="Type"
              bg-color="white"
              :hide-details="false"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.standard"
              density="default"
              label="Standard"
              bg-color="white"
              :hide-details="false"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <VueDatePicker @update:model-value="formatDate($event, 'release_date')" :teleport="true" :enable-time-picker="false">
            <template #trigger>
              <v-text-field
                  v-model="form.release_date"
                  density="default"
                  label="Release Date"
                  bg-color="white"
                  :hide-details="false"
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="6">
          <VueDatePicker @update:model-value="formatDate($event, 'archive_date')" :teleport="true" :enable-time-picker="false">
            <template #trigger>
              <v-text-field
                  v-model="form.archive_date"
                  density="default"
                  label="Archive Date"
                  bg-color="white"
                  :hide-details="false"
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.quality_group"
              density="default"
              label="Quality Group"
              bg-color="white"
              :hide-details="false"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.spec_units"
              density="default"
              label="Spec Units"
              bg-color="white"
              :hide-details="false"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.source_type"
              density="default"
              label="Source Type"
              bg-color="white"
              :hide-details="false"
              clearable
          ></v-text-field>
          </v-col>
          <v-col cols="6">
          <DictCode
              v-model="form.require_dressing"
              code="quality_require_dressing"
              label="Require Dressing"
              variant="underlined"
              :hide-details="false"
              :clearable="true"
          />
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
import DictCode from "@/components/picker/DictCode.vue";
import useCommonStore from "@/app/common";
import {isThanZero} from "@/util/util";
import {toast} from "vue3-toastify";
import moment from "moment/moment";
const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    mill_id: undefined,
    mill: {},
    code: undefined,
    name: undefined,
    version: undefined,
    version_status: undefined,
    type: undefined,
    standard: undefined,
    release_date: undefined,
    archive_date: undefined,
    quality_group: undefined,
    desc: undefined,
    spec_units: undefined,
    source_type: undefined,
    require_dressing: undefined
  },
  rules: {
    mill_id: [
      value => {
        if (value) return true
        return 'Mill Code is required.'
      }
    ],
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
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    form.value = {
      id: data.id,
      version: data.version,
      version_status: data.version_status,
      standard: data.standard,
      release_date: data.release_date,
      archive_date:data.archive_date,
      quality_group: data.quality_group,
      spec_units: data.spec_units,
      source_type: data.source_type,
      mill_id: data.mill_id,
      mill: data.mill,
      code: data.code,
      type: data.type,
      name: data.name,
      desc: data.desc,
      require_dressing: data.require_dressing
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
    name: undefined,
    version: undefined,
    version_status: undefined,
    type: undefined,
    standard: undefined,
    release_date: undefined,
    archive_date: undefined,
    quality_group: undefined,
    desc: undefined,
    spec_units: undefined,
    source_type: undefined,
    require_dressing: undefined
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}

const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  } else {
    form.value[key] = undefined;
  }
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
