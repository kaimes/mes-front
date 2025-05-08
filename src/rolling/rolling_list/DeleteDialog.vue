<template>
  <v-dialog v-model="showRemove" persistent max-width="400">
    <v-card
        prepend-icon="mdi-help-circle-outline"
        text="Are you sure you want to delete this Rolling?"
        title="Delete Rolling?"
    >
      <v-card-actions>
        <v-spacer />
        <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="closeRemove()">{{
            $t("users.delete_Cancel")
          }}</v-btn>
        <v-btn class="text-none" color="primary" variant="flat" @click="remove()">{{
            $t("users.deelte_conform")
          }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "RollingDeleteDialog",
  data() {
    return {};
  },
  computed: {
    ...mapFields("rolling_list", ["dialogs.showRemove"]),
  },

  methods: {
    ...mapActions("rolling_list", ["remove", "closeRemove"]),
  },
};
</script>
