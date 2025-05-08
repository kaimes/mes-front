<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
            v-model="table.options.q"
            label="Search By Code"
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
              v-permission="`Search`"
            >
              Search
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn
            color="primary"
            @click="editShow(null)"
            variant="flat"
            :disabled="localOrganizationStatus === 'Expired'"
            v-permission="`Create`"
            >New</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
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
          <span class="table_action_icon">
            <v-icon small class="mr-2" @click="editShow(item)" v-permission="`Detail`"
              >mdi-pencil</v-icon>
            <v-icon small @click="removeShow(item)" v-permission="`Delete`">mdi-delete</v-icon>
          </span>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script>
// import { mapGetters } from "vuex";
// import { mapFields } from "vuex-map-fields";
// import { mapActions, mapState } from "vuex";
import DeleteDialog from "@/shift/shift_list/DeleteDialog.vue";
import {formatDate, getWeekRange, secondsToHms} from "@/util/util";
import NewEditSheet from "@/shift/shift_list/NewEditSheet.vue";
import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useShiftStore } from "./storePinia";

export default {
  name: "ShiftTable",

  components: {
    NewEditSheet,
    DeleteDialog,
  },
  data() {
    return {
      headers: [

        {
          title: "Actions",
          value: "action",
          sortable: false,
          align: "center",
          fixed: true
        },
        { title: "Shift Number", value: "shift_no", sortable: true },
        {title: "Mill Code", key: "mill.code"},
        { title: "Code", value: "code", sortable: true },
        { title: "Name", value: "name", sortable: true },
        { title: "Description", value: "desc", sortable: true },
        { title: "Shift Day", value: "shift_day", sortable: true },
        { title: "Shift Start", value: "shift_start", sortable: true },
        { title: "Shift End", value: "shift_end", sortable: true },
        {
          title: 'Created At',
          key: 'created_at',
          minWidth: 180,
          value: (item) => formatDate(item['created_at']),
          sortable: true
        },

        // { title: "Code", value: "code", sortable: true },
        // { title: "Longitude", value: "geo_longitude", sortable: true },
        // { title: "Latitude", value: "geo_latitude", sortable: true },
        // { title: "Group", value: "location_group_code", sortable: true },
        // { title: "Team", value: "team.code", sortable: true },
        // {
        //   title: "Address Text",
        //   value: "geo_address_text",
        //   sortable: true,
        // },
        
      ],
      localOrganizationStatus: localStorage.getItem("organizationStatus"), // organizationStatus取的是本地缓存的数据
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),

    ...mapState(useShiftStore, ["table"]),
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
    ...mapActions(useShiftStore, [
      "getAll",
      // "createEditShow",
      "removeShow",
      "editShow",
    ]),
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      handleSearch();
    },
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
