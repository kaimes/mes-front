<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />

    <v-col>
      <v-card>
        <v-list-item lines="two">
          <template #append>
            <v-row>
              <v-spacer />
              <v-btn
                color="primary"
                class="ml-2"
                @click="editShow()"
                :disabled="localOrganizationStatus === 'Expired'"
                >New</v-btn
              >
            </v-row>
          </template>
        </v-list-item>

        <v-card-title>
          <v-text-field
            v-model="table.options.q"
            append-icon="search"
            label="Search By Code"
            single-line
            hide-details
            clearable
          />
        </v-card-title>
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
        </v-data-table-server>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
// import { mapGetters } from "vuex";
// import { mapFields } from "vuex-map-fields";
// import { mapActions, mapState } from "vuex";
import DeleteDialog from "@/defect_reason/DeleteDialog.vue";

import NewEditSheet from "@/defect_reason/NewEditSheet.vue";
import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useDefectReasonStore } from "./storePinia";

export default {
  name: "DefectReasonTable",

  components: {
    NewEditSheet,
    DeleteDialog,
  },
  data() {
    return {
      headers: [

        { title: "Code", value: "code", sortable: true },
        { title: "Name", value: "name", sortable: true },  
        { title: "Type", value: "type", sortable: true },      
        { title: "Desc", value: "desc", sortable: true },
        { title: "Required Roles", value: "required_roles", sortable: true },
      
        {
          title: "",
          value: "action",
          sortable: false,
          align: "end",
        },
      ],
      localOrganizationStatus: localStorage.getItem("organizationStatus"), // organizationStatus取的是本地缓存的数据
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),
    // ...mapFields("location", [
    //   "table.options.q",
    //   "table.options.page",
    //   "table.options.itemsPerPage",
    //   "table.options.sortBy",
    //   "table.options.descending",
    //   "table.loading",
    //   "table.rows.items",
    //   "table.rows.total",
    // ]),

    ...mapState(useDefectReasonStore, ["table"]),
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
    ...mapActions(useDefectReasonStore, [
      "getAll",
      // "createEditShow",
      "removeShow",
      "editShow",
    ]),
    // ...mapGetters("auth", ["getPermission"]),
    // ...mapActions("location", [
    //   "getAll",
    //   "createEditShow",
    //   "removeShow",
    //   "closeCreateEdit",
    // ]),
    // ...mapActions("job", ["showJobEdit4Customer"]),
    // clickNewJobOnLocation(item) {
    //   this.showJobEdit4Customer({ job: null, loc: item });
    // },
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
