<template>
  <v-dialog v-model="showRemove" persistent max-width="400">
    <v-card
        prepend-icon="mdi-help-circle-outline"
        text="Are you sure you would like to delete this role?"
        title="Delete Role?"
    >
      <v-card-actions>
        <v-spacer />
        <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="closeRemove">{{
            $t("users.delete_Cancel")
          }}</v-btn>
        <v-btn class="text-none" color="primary" variant="flat" @click="remove">{{
            $t("users.deelte_conform")
          }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useRoleStore } from "./storePinia";

export default {
  name: "UserDeleteDialog",
  data() {
    return {};
  },
  computed: {
    ...mapState(useRoleStore, {
      showRemove: (store) => store.dialogs.showRemove,
    }),
  },

  methods: {
    ...mapActions(useRoleStore, ["remove", "closeRemove"]),
  },
};
</script>
