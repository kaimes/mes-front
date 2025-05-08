<template>
  <v-dialog v-model="showRemove" persistent max-width="400">
    <v-card
        prepend-icon="mdi-help-circle-outline"
        text="Are you sure you would like to delete this menu?"
        title="Delete Menu?"
    >
      <v-card-actions>
        <v-spacer />
        <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="closeRemove">{{ $t("users.delete_Cancel") }}</v-btn>
        <v-btn class="text-none" color="primary" variant="flat" @click="handleRemove">{{ $t("users.delete_conform") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useMenuStore } from "./storePinia";
import { toast } from "vue3-toastify";

export default {
  name: "UserDeleteDialog",
  data() {
    return {};
  },
  computed: {
    ...mapState(useMenuStore, {
      showRemove: (store) => store.dialogs.showRemove,
    }),
  },
  methods: {
    ...mapActions(useMenuStore, ["remove", "closeRemove"]),
    handleRemove() {
      this.remove()
        .then(() => {
          toast.success("Location deleted successfully.", { autoClose: 3000 });
          this.closeRemove();
        })
        .catch((err) => {
          toast.error("Location not deleted. Reason: " + err.response.data.detail, { autoClose: 3000 });
          this.closeRemove();
        });
    },
  },
};
</script>