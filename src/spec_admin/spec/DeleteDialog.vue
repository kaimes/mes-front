<template>
  <v-dialog v-model="dialogs.showRemove" persistent max-width="400px">
    <v-card
        prepend-icon="mdi-help-circle-outline"
        :text="$t('spec.delete_tips')"
        :title="$t('spec.delete_title')"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
            class="text-none"
            color="#e3e3e3"
            variant="flat"
            @click="closeRemove"
        >
          {{ $t("spec.delete_Cancel") }}
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="remove"
        >
          {{ $t("spec.deelte_conform") }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
// import { mapActions } from "vuex";
// import { mapFields } from "vuex-map-fields";

import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useSpecStore } from "./storePinia";

export default {
  name: "UserDeleteDialog",
  data() {
    return {};
  },
  computed: {
    ...mapState(useSpecStore, ["dialogs"]),
  },

  methods: {
    ...mapActions(useSpecStore, ["remove", "closeRemove"]),
  },
};
</script>
