<template>
  <v-dialog v-model="showRemove" persistent max-width="400">
    <v-card
        prepend-icon="mdi-help-circle-outline"
        :text="$t('users.delete_tips')"
        :title="$t('users.delete_title')"
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
// import { mapActions } from "vuex";
// import { mapFields } from "vuex-map-fields";

import { mapState } from 'pinia'
import { mapActions } from 'pinia'

import { useAuthStore } from './storePinia'



export default {
  name: "UserDeleteDialog",
  data() {
    return {};
  },
  computed: {
    // ...mapFields("auth", ["dialogs.showRemove"]),

    ...mapState(useAuthStore,{
      showRemove: store => store.dialogs.showRemove,
    }),


  },

  methods: {
    // ...mapActions("auth", ["remove", "closeRemove"]),

    ...mapActions(useAuthStore, ["remove", "closeRemove"]),

  },
};
</script>
