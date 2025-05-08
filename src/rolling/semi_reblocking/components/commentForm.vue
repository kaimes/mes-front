<template>
  <v-dialog
      v-model="visible"
      max-width="700"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Update Comment"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <div class="pa-4">
        <v-form ref="editForm">
          <v-textarea
              v-model="form.comment"
              label="Comment"
              rows="5"
              clearable
              counter="200"
          ></v-textarea>
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
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import API from "../api";

const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    comment: undefined,
  },
  rules: {

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
      comment: params.comment,
      semi_code:params.semi_code
    }
  }
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    comment: undefined,
    semi_code:undefined
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
    await API.update(params);
    handleClose();
    emit("refresh");
    toast.success("Update Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error("Update Fail", { autoClose: 60000 });
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
