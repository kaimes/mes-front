<template>
  <v-dialog v-model="showRemove" persistent max-width="800px">

      <v-card
        prepend-icon="mdi-help-circle-outline"
        :title="$t('defect_reason.delete_title')"
        :text="$t('defect_reason.delete_tips')"
      >
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="closeRemove()">{{
          $t("defect_reason.delete_Cancel")
        }}</v-btn>
        <v-btn color="red darken-1" text @click="remove()">{{
          $t("defect_reason.deelte_conform")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import { mapActions } from "vuex";
// import { mapFields } from "vuex-map-fields";

import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useDefectReasonStore } from "./storePinia";

export default {
  name: "UserDeleteDialog",
  data() {
    return {};
  },
  computed: {
    // ...mapFields("auth", ["dialogs.showRemove"]),

    ...mapState(useDefectReasonStore, {
      showRemove: (store) => store.dialogs.showRemove,
    }),
  },

  methods: {
    // ...mapActions("auth", ["remove", "closeRemove"]),

    ...mapActions(useDefectReasonStore, ["remove", "closeRemove"]),
  },
};
</script>
