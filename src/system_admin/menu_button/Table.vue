<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <v-row align="center">
      <v-col cols="6">
        <span class="text-subtitle-1">Menu: {{ search.menu.name }}</span>
      </v-col>
      <v-spacer />
      <v-col cols="3" class="text-end">
        <v-btn
            class="text-none ml-4 mr-4"
            color="primary"
            variant="flat"
            @click="editShow(undefined)"
            :disabled="localOrganizationStatus === 'Expired'"
        >
          New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          show-current-page
          :headers="headers"
          :items="table.rows.items"
          :items-length="table.rows.total || 0"
          v-model:page="table.options.page"
          v-model:items-per-page="table.options.itemsPerPage"
          v-model:sort-by="table.options.sortBy"
          v-model:sort-desc="table.options.descending"
          :footer-props="{
            'items-per-page-options': [5, 10, 20],
          }"
          :loading="table.loading"
          loading-text="Loading... Please wait"
      >
        <template v-slot:[`item.action`]="{ item }">
            <span class="table_action_icon">
              <v-icon small class="mr-2" @click="editShow(item)"
              >mdi-pencil</v-icon
              >
              <v-icon small @click="removeShow(item)">mdi-delete</v-icon>
            </span>
        </template>
        <template v-slot:[`item.method`]="{ item }">
            <span class="table_action_icon">
              {{ items_method_mapping[item.method] }}
            </span>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script>
import DeleteDialog from "@/system_admin/menu_button/DeleteDialog.vue";

import NewEditSheet from "@/system_admin/menu_button/NewEditSheet.vue";
import { mapState, mapActions } from "pinia";

import { useMenuButtonStore } from "./storePinia";
import SpecCode from "@/components/picker/SpecCode.vue";

export default {
  name: "MenuButtonTable",

  components: {
    SpecCode,
    NewEditSheet,
    DeleteDialog,
  },
  data() {
    return {
      items_method_mapping: {
        0: "GET",
        1: "POST",
        2: "PUT",
        3: "DELETE",
      },
      localOrganizationStatus: localStorage.getItem("organizationStatus"),
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),
    ...mapState(useMenuButtonStore, ["table", "headers", "search"]),
  },

  mounted() {
    this.getAll({});

    this.$watch(
      (vm) => [vm.page],
      () => {
        this.getAll();
      }
    );

    this.$watch(
      (vm) => [
        vm.table.options.q,
        vm.table.options.page,
        vm.table.options.itemsPerPage,
        vm.table.options.sortBy,
        vm.table.options.descending,
      ],
      () => {
        this.getAll();
      }
    );
  },
  destroyed() {
    this.closeCreateEdit();
  },
  methods: {
    ...mapActions(useMenuButtonStore, [
      "getAll",
      "removeShow",
      "editShow",
      "goMenu",
    ]),
  },
};
</script>
<style>
.code {
  display: block;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.overflow_ellipsis_col {
  display: block;
  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
