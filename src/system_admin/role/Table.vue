<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <PermissionSheet />
    <copy-dialog ref="copyRef" @refresh="handleSearch" />
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
            v-model="table.options.q"
            label="Search By Name"
            variant="underlined"
            bg-color="white"
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="d-flex ga-4 align-center">
            <v-btn
              class="text-none"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
            >
              Reset
            </v-btn>
            <v-btn
              type="submit"
              class="text-none"
              color="primary"
              variant="flat"
              :loading="loading"
            >
              Search
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn
            v-permission="`Create`"
            color="primary"
            variant="flat"
            @click="editShow(null)"
            :disabled="localOrganizationStatus === 'Expired'"
            >New</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
        fixed-header
        height="650"
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
          <div class="d-flex align-center ga-2 justify-center">
            <!-- <v-btn
                density="default"
                size="small"
                variant="outlined"
                class="mr-4"
                @click="showPermission(item)"
                v-permission="`PermissionButton`"
            >
              Permission
            </v-btn> -->

            <v-icon
                small
                class="mr-2"
                @click="handleCopy(item)"
                v-permission="`Create`"
            >mdi-content-copy</v-icon>  

            <v-icon
                small
                class="mr-2"
                @click="showPermission(item)"
                v-permission="`PermissionButton`"
            >mdi-link-edit</v-icon>

            <v-icon
                small
                class="mr-2"
                @click="editShow(item)"
                v-permission="`Detail`"
            >mdi-pencil</v-icon>

            <v-icon small @click="removeShow(item)" v-permission="`Delete`"
            >mdi-delete</v-icon
            >
          </div>
        </template>
        <template v-slot:[`item.mill`]="{ item }">
          <span v-for="(mill, index) in item.mill" :key="index">
            {{ mill.code }} &nbsp;&nbsp;
          </span>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script>
import DeleteDialog from "@/system_admin/role/DeleteDialog.vue";

import NewEditSheet from "@/system_admin/role/NewEditSheet.vue";
import PermissionSheet from "@/system_admin/role/PermissionSheet.vue";
import { mapState, mapActions } from "pinia";

import { useRoleStore } from "./storePinia";
import CopyDialog from "./components/copy.vue";

export default {
  name: "RoleTable",

  components: {
    NewEditSheet,
    DeleteDialog,
    PermissionSheet,
    CopyDialog,
  },
  data() {
    return {
      localOrganizationStatus: localStorage.getItem("organizationStatus"),
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),
    ...mapState(useRoleStore, ["table", "headers"]),
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
    ...mapActions(useRoleStore, [
      "getAll",
      "removeShow",
      "editShow",
      "showPermission",
    ]),
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      handleSearch();
    },
    handleCopy(item) {
      this.$refs["copyRef"].handleShow(item);
    },
    // showPermission(item) {
    //   this.$router.push({ name: "RoleDetail", query: { id: item.id } });
    // }
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
