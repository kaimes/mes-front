<template>
  <v-dialog v-model="showRemove" persistent max-width="400">
    <v-card
        prepend-icon="mdi-help-circle-outline"
        title="Delete Section Weight?"
        text="Are you sure you would like to delete this data?"
    >
      <v-card-actions>
        <v-spacer />
        <v-btn color="#e3e3e3" variant="flat" @click="closeRemove()">{{
            $t("users.delete_Cancel")
          }}</v-btn>
        <v-btn color="primary" variant="flat" @click="remove()">{{
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
    ...mapFields("product_type", ["dialogs.showRemove"]),
  },

  methods: {
    ...mapActions("product_type", ["remove", "closeRemove"]),
  },
};
</script>
