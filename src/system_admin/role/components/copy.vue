<template>
  <v-dialog
      v-model="visible"
      max-width="400"
      :close-on-back="false"
      persistent
  >
    <v-card
        prepend-icon="mdi-help-circle-outline"
        title="Copy Role"
        subtitle="To create new role from current role"
    >
      <v-divider></v-divider>
      <div class="pa-4">
        <v-form ref="copyForm">
            <v-text-field
                v-model="form.name"
                density="comfortable"
                variant="underlined"
                placeholder="Press New Role Name"
                bg-color="white" clearable
            />
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
    name: undefined,
  },
  payload: {},
  rules: {

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
    name: undefined,
  };
  payload.value = {};
  nextTick(() => {
    proxy.$refs["copyForm"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["copyForm"].validate();
  if (!valid) {
      return;
    }
  
  loading.value = true;
  const { name } = toRaw(form.value);
  const params = toRaw(payload.value);
  if (name) {
    params["name"] = name;
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
