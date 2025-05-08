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
                class="text-none ml-4"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
              >
                {{ $t("global.reset") }}
              </v-btn>
              <v-btn
                type="submit"
                class="text-none my-1"
                color="primary"
                variant="flat"
                :loading="loading"
                v-permission="`Search`"
              >
                {{ $t("global.search") }}
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
              >{{ $t('global.new') }}</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
      <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
        <v-data-table-server
          show-current-page
          fixed-header
          height="650"
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
  import DeleteDialog from "@/regrade_reason/DeleteDialog.vue";
  
  import NewEditSheet from "@/regrade_reason/NewEditSheet.vue";
  import { mapState } from "pinia";
  import { mapActions } from "pinia";
  
  import { useRegradeReasonStore } from "./storePinia";
  
  export default {
    name: "RegradeReasonTable",
  
    components: {
      NewEditSheet,
      DeleteDialog,
    },
    data() {
      return {
        translateHeaders: [
  
        {
            title: "regrade_reason.table.action",
            value: "action",
            sortable: false,
            align: "center",
            fixed: true,
            width: "120px"
          },
        { title: "regrade_reason.table.mill_code", value: "mill.code", sortable: true },
        { title: "regrade_reason.table.code", value: "code", sortable: true },
        { title: "regrade_reason.table.desc", value: "desc", sortable: true },  
        { title: "regrade_reason.table.supp_recalc", value: "supp_recalc", sortable: true },
        ],
        localOrganizationStatus: localStorage.getItem("organizationStatus"), // organizationStatus取的是本地缓存的数据
      };
    },
  
    computed: {
      ...mapState("auth", ["userInfo"]),
      
      ...mapState(useRegradeReasonStore, ["table"]),
      headers(){
      return this.translateHeaders.map(header => {
        return{
          ...header,
          title: this.$t(header.title) || header.title
        }
      })
    }
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
      ...mapActions(useRegradeReasonStore, [
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
