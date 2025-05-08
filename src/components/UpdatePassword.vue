<template>
  <v-dialog v-model="visible" width="460px" absolute :close-on-back="false" z-index="9999" persistent>
    <v-card prepend-icon="mdi-lock-reset" title="Update Password" class="bg-white" elevation="0" variant="outlined">
      <v-divider></v-divider>
      <v-form ref="passwordForm" class="pa-4" @submit.prevent>
        <v-alert
            text="The password must be between 8 and 32 characters, with at least one letter(a-z,A-Z) and one number (0-9)"
            type="warning"
            variant="tonal"
            density="compact"
            prominent
        ></v-alert>
        <v-row align="center" no-gutters>
          <v-col cols="12" md="12">
            <v-text-field
                v-model="form.old_password"
                :rules="rules.old_password"
                :append-icon="hideOldPass ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (hideOldPass = !hideOldPass)"
                :type="hideOldPass ? 'password' : 'text'"
                label="Old Password"
                name="old_password"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
                autocomplete="new-password"
                v-model="form.password"
                :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="rules.password"
                @click:append="() => (hidePassword = !hidePassword)"
                :type="hidePassword ? 'password' : 'text'"
                label="New Password"
                required
                name="password"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
                autocomplete="new-password"
                v-model="form.re_password"
                :rules="rules.re_password"
                :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (hidePassword = !hidePassword)"
                :type="hidePassword ? 'password' : 'text'"
                label="Confirm New Password"
                name="re_password"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="d-flex ga-2 align-center">
          <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleClose">
            Cancel
          </v-btn>
          <v-btn class="text-none" color="primary" variant="flat" :loading="loading" @click="handleSave">
            Confirm
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {reactive, ref, nextTick, toRefs, getCurrentInstance, toRaw} from "vue";
import {toast} from "vue3-toastify";
import {validatePassword} from "@/util/util";
import UserApi from "@/auth/api";

const visible = ref(false);
const loading = ref(false);
const hideOldPass = ref(false);
const hidePassword = ref(false);

const {proxy} = getCurrentInstance();

const data = reactive({
  form: {
    id: undefined,
    password: undefined,
    re_password: undefined,
    old_password: undefined,
  },
  rules: {
    old_password: [
      value => {
        if (value) return true
        return 'Please enter the old password.'
      }
    ],
    password: [
      value => {
        if (!value) return 'Please enter the new password.'
        if (!validatePassword(value)) return 'The password must be between 8 and 32 characters, with at least one letter(a-z,A-Z) and one number (0-9).'
        return true;
      }
    ],
    re_password: [
      value => {
        if (!value) return 'Please enter the repeat password.'
        if (!validatePassword(value)) return 'The password must be between 8 and 32 characters, with at least one letter(a-z,A-Z) and one number (0-9).'
        if (value !== form.value.password) return 'The two passwords are inconsistent.'
        return true
      }
    ],
  },
});

const { form, rules } = toRefs(data);

const handleShow = (id) => {
  form.value.id = id;
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    form.value = {
      id: undefined,
      password: undefined,
      re_password: undefined,
      old_password: undefined,
    };
    proxy.$refs["passwordForm"].resetValidation();
  });
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["passwordForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  UserApi.updatePassword(toRaw(form.value)).then(res => {
    handleClose();
    toast.success("Password changed successfully.", {
      position: "bottom-center"
    });
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Password changed Fail", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

defineExpose({
  handleShow,
});
</script>
<style scoped>

</style>
