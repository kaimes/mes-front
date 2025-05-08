<template>
  <FormDialog
      v-model="dialogs.showEdit"
      :width="500"
      :title="selected.id ? $t('users.edit.edit') : $t('users.edit.add')"
      desc="User"
      :loading="selected.loading"
      @close="closeEdit"
      @save="handleSave"
  >
    <v-form @submit.prevent v-slot="{ isValid }">
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <span class="subtitle-2">{{ $t("users.edit.details") }}</span>
        </v-col>
        <v-col cols="12" sm="12"
        ><v-text-field
            v-model="selected.email"
            :disabled="!dialogs.isAddFalg"
            :label="$t('users.edit.account')"
            :rules="[rules.required, rules.email]"
            hint="User's account."
        /></v-col>

        <v-col cols="12" sm="12"
        ><v-autocomplete
            v-model="selected.role"
            :label="$t('users.edit.role')"
            :items="roleOptions"
            hint="The user's current role."
            item-title="name"
            item-value="id"
            multiple
            chips
        /></v-col>

        <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.is_active"
              hint="Whether the account is activated or not."
              :label="$t('users.edit.activated')"
          /></v-col>
          <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.show_bottom_note"
              hint="Do you want to display the bottom note？"
              :label="$t('users.edit.show_bottom_note')"
          /></v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>

<script>
import { toast } from "vue3-toastify";
import { mapActions, mapWritableState } from "pinia";
import { mapState} from 'vuex';
import { required, email } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";

import { useAuthStore } from "./storePinia";

export default {
  components: {FormDialog},
  setup() {
    return {
      rules: { required, email },
    };
  },
  name: "UserEditSheet",
  data() {
    return {
      roles: [
        "Worker",
        "Planner",
        "Owner",
        "Customer",
        "Address API Admin",
        "VRP API Admin",
        "Address Normalization API Admin",
      ],
      password: null,
      re_password: null,
      old_password: null,
      hidePassword: true,
      hideOldPass: true,
    };
  },

  computed: {
    ...mapWritableState(useAuthStore, [
      "selected",
      "dialogs",
      "roleOptions",
      "millOptions"
    ]),
    ...mapState('auth', ['userInfo']),
  },

  methods: {
    ...mapActions(useAuthStore, ["save", "closeEdit"]),
    handleSave() {
      this.save({
        password: this.password,
        old_password: this.old_password,
        is_me: this.userInfo.email === this.selected.email,
      });
    },
  },
};
</script>
