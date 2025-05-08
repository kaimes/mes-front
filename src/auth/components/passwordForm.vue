<template>
  <FormDialog
      v-model="visible"
      :width="500"
      title="Edit"
      :desc="$t('users.edit.change_password')"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form @submit.prevent v-slot="{ isValid }">
      <v-alert
          text="The password must be between 8 and 32 characters, with at least one letter(a-z,A-Z) and one number (0-9)"
          type="warning"
          variant="tonal"
          density="compact"
          prominent
      ></v-alert>
      <v-row no-gutters>
        <v-col cols="12" md="12" v-if="old_password_visible">
          <v-text-field
              v-model="form.old_password"
              :append-icon="hideOldPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (hideOldPass = !hideOldPass)"
              :type="hideOldPass ? 'password' : 'text'"
              :label="$t('users.edit.old_password')"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field
              autocomplete="new-password"
              v-model="form.password"
              :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (hidePassword = !hidePassword)"
              :type="hidePassword ? 'password' : 'text'"
              :label="$t('users.edit.new_password')"
              required
              name="new-password"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field
              autocomplete="new-password"
              v-model="form.re_password"
              :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (hidePassword = !hidePassword)"
              :type="hidePassword ? 'password' : 'text'"
              :label="$t('users.edit.confirm_new_password')"
              name="confirm"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>

<script>
import { toast } from "vue3-toastify";
import { mapWritableState } from "pinia";

import { required, email } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";

import { useAuthStore } from "../storePinia";
import UserApi from "@/auth/api";

export default {
  components: {FormDialog},
  setup() {
    return {
      rules: { required, email },
    };
  },
  name: "UserEditPassword",
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        id: undefined,
        email: undefined,
        password: undefined,
        re_password: undefined,
        old_password: undefined,
      },
      hidePassword: false,
      hideOldPass: false,
    };
  },

  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),

    old_password_visible() {
      return this.userInfo?.email == this.form.email;
    },
  },

  methods: {
    handleShow(data) {      
      this.form.id = data.id;
      this.form.email = data.email;
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
      this.$nextTick(() => {
        this.hideOldPass = false;
        this.hidePassword = false;
        this.form = {
          id: undefined,
          password: undefined,
          re_password: undefined,
          old_password: undefined,
        };
      })
    },
    isSucceedPassword(s) {
      const re = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}");
      return re.test(s);
    },
    handleSave() {
      const { id, password, re_password, old_password } = this.form;
      if (!old_password && this.userInfo?.email == this.form.email) {
        toast.error("Please enter the old password.", {
          position: "bottom-center",
          autoClose: 60000
        });
        return false;
      }
      if (!password || !re_password) {
        toast.error("Please enter the password.", {
          position: "bottom-center",
          autoClose: 60000
        });
        return false;
      }

      if (!this.isSucceedPassword(password)) {
        toast.error("The password must be between 8 and 32 characters, with at least one letter(a-z,A-Z) and one number (0-9)", {
          position: "bottom-center",
          autoClose: 60000
        });
        return false;
      }
      if (password !== re_password) {
        toast.error("The two passwords are inconsistent.", {
          position: "bottom-center",
          autoClose: 60000
        });
        return false;
      }
      this.loading = true;
      UserApi.updatePassword({
        id,
        password,
        old_password,
      }).then(res => {
        this.handleClose();
        toast.success("Password changed successfully.", {
          position: "bottom-center"
        });
      }).catch(res => {
        toast.error(res?.response?.data?.detail || "Password changed Fail", {
          position: "bottom-center",
          autoClose: 60000
        });
      }).finally(() => {
        this.loading = false;
      });
    },

  },
};
</script>
