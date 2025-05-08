<template>
  <v-dialog v-model="showRemove" persistent max-width="800px">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ $t("services.delete.delete_title") }}
          <!-- Delete Service? -->
        </span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            {{ $t("services.delete.comform_delete") }}
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" variant="text" @click="closeRemove()">
          {{$t('global.cancel')}}
        </v-btn>
        <v-btn color="red darken-1" variant="text" @click="remove()">
          {{$t('global.delete')}}

        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "ServiceDeleteDialog",
  data() {
    return {};
  },
  computed: {
    ...mapFields("service", ["dialogs.showRemove"])
  },

  methods: {
    ...mapActions("service", ["remove", "closeRemove"])
  }
};
</script>
