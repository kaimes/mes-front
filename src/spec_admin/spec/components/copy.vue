<template>
  <v-dialog
      v-model="visible"
      max-width="400"
      :close-on-back="false"
      persistent
  >
    <v-card
        prepend-icon="mdi-help-circle-outline"
        title="Copy Spec"
        subtitle="To create new version or copy as new spec?"
    >
      <v-divider></v-divider>
      <div class="pa-4">
        <v-form ref="copyForm">
          <v-radio-group v-model="type" inline>
            <v-radio label="Create new Spec" value="spec"></v-radio>
            <v-radio :disabled="payload.version === 'draft'" label="Create new Version" value="version"></v-radio>
          </v-radio-group>
          <div v-show="type === 'spec'">
            <v-text-field
                v-model="form.spec_code"
                :rules="rules.spec_code"
                density="comfortable"
                variant="underlined"
                placeholder="Spec Code"
                bg-color="white" clearable
                :maxlength="5"
            />
          </div>
          <div class="text-subtitle-1" v-show="type === 'version'">Current Spec Code: <span class="font-weight-bold">{{ payload.spec_code }}</span></div>
        </v-form>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            class="text-none mr-4"
            color="#e3e3e3"
            variant="flat"
            @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :loading="loading"
            @click="handleSave"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {computed, getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import {validateSpecCode} from "@/util/util";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const type = ref("spec");
const visible = ref(false);
const loading = ref(false);
import {useStore} from "vuex";
import API from "../api";

const store = useStore();

const data = reactive({
  form: {
    spec_code: undefined,
  },
  payload: {},
  rules: {
    spec_code: [
      value => {
        if (currentMill.value !== "TBM") {
          if (!value) {
            return "Spec Code is required";
          }
          return true;
        }
        if (validateSpecCode(value)) return true
        return 'Spec Code must start with one of F, S, C, or D and must not exceed 5 characters.'
      }
    ],
  }
});

const currentMill = computed(() => store.state.auth.defaultMillCode);

const { form, payload, rules } = toRefs(data);

const handleShow = (data) => {
  payload.value = toRaw(data);
  // 处理数组
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    spec_code: undefined,
  };
  payload.value = {};
  type.value = "spec";
  nextTick(() => {
    proxy.$refs["copyForm"].resetValidation();
  })
}

const handleSave = async () => {
  if (type.value === "spec") {
    const {valid} = await proxy.$refs["copyForm"].validate();
    if (!valid) {
      return;
    }
  }
  loading.value = true;
  const { spec_code } = toRaw(form.value);
  const params = toRaw(payload.value);
  params["redio_type"] = type.value;
  if (spec_code) {
    params["spec_code"] = spec_code;
  }
  try {
    await API.copy(params)
    handleClose();
    emit("refresh");
    toast.success("Copy Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || "Copy Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
