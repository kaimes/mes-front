<template>
  <v-dialog v-model="showRemove" persistent max-width="800px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t("semi_size.delete.delete_title") }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>{{ $t("semi_size.delete.delete_desc") }}</v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="closeRemove()">{{
          $t("semi_size.delete.delete_cancel")
        }}</v-btn>
        <v-btn color="red darken-1" text @click="remove()">{{
          $t("semi_size.delete.delete_confirm")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useSemiSizeStore } from "./storePinia";

export default {
  name: "SemiSizeDeleteDialog",
  data() {
    return {};
  },
  computed: {
    ...mapState(useSemiSizeStore, {
      showRemove: (store) => store.dialogs.showRemove,
    }),
  },

  methods: {
    ...mapActions(useSemiSizeStore, ["remove", "closeRemove"]),
  },
};
</script>
