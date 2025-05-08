<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Bend Test Spec Detail"
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
              type="number"
              v-model="form.thick_from"
              :rules="rules.thick_from"
              class="no-input-control"
              variant="underlined"
              label="Thickness From"
              @blur="handleBlur('thick_from')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.thick_to"
              :rules="rules.thick_to"
              variant="underlined"
              label="Thickness To"
              @blur="handleBlur('thick_to')"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <DictCode v-model="form.location" code="spria_loc" label="Location" :hide-details="false" />

        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.filler"
              density="default"
              variant="underlined"
              label="Filler"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <DictCode v-model="form.code" code="spscond_code" label="Code" :hide-details="false" @change="handleCodeChange"/>

        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.text"
              density="default"
              variant="underlined"
              label="Text"
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
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import {toast} from "vue3-toastify";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";


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
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    filler: undefined,
    code: undefined,
    text: undefined

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
    ]

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
      ...params,
    }
  } else {
    form.value.spec = commonStore.spec;
    form.value.spec_id = commonStore.spec.id;
  }
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    spec_id: commonStore.spec.id,
    spec: commonStore.spec,
    mill_id: undefined,
    mill: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    filler: undefined,
    code: undefined,
    text: undefined
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

const handleBlur = (field) => {
  let value = form.value[field];

  if (value === null || value === '' || isNaN(value)) {
    form.value[field] = undefined;
  } else {
    form.value[field] = parseFloat(value).toFixed(2);
  }
}

const handleCodeChange = (code) => {
  form.value.text = code.text;
  
}

defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
