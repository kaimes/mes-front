<template>
    <v-dialog v-model="showRemove" persistent max-width="800px">
  
        <v-card
          prepend-icon="mdi-help-circle-outline"
          :title="$t('regradereason.delete_title')"
          :text="$t('regradereason.delete_tips')"
        >
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeRemove()">{{
            $t("cancel")
          }}</v-btn>
          <v-btn color="red darken-1" text @click="remove()">{{
            $t("delete")
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
  
  import { useRegradeReasonStore } from "./storePinia";
  
  export default {
    name: "UserDeleteDialog",
    data() {
      return {};
    },
    computed: {
      // ...mapFields("auth", ["dialogs.showRemove"]),
  
      ...mapState(useRegradeReasonStore, {
        showRemove: (store) => store.dialogs.showRemove,
      }),
    },
  
    methods: {
      // ...mapActions("auth", ["remove", "closeRemove"]),
  
      ...mapActions(useRegradeReasonStore, ["remove", "closeRemove"]),
    },
  };
  </script>
  