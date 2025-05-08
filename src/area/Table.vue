<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
              v-model="table.options.q"
              label="Search By Code, Address Text"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <AreaType 
            v-model="table.options.type" 
            label="Type"
            variant="underlined"
            class="mt-4"
          />
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
        <v-col cols="3" class="text-end">
          <v-btn
              color="primary"
              variant="flat"
              @click="editShow(null)"
              :disabled="localOrganizationStatus === 'Expired'"
              v-permission="`Create`"
          >New</v-btn>
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
        <template v-slot:[`item.actions`]="{ item }">
            <span class="table_action_icon">
              <v-icon
                  small
                  class="mr-2"
                  @click="editShow(item)"
                  :disabled="localOrganizationStatus === 'Expired'"
                  v-permission="`Update`"
              >mdi-pencil</v-icon>
              <v-icon small @click="removeShow(item)" v-permission="`Delete`">mdi-delete</v-icon>
            </span>
        </template>
      </v-data-table-server>
    </v-card>

  </v-container>
</template>

<script>
import DeleteDialog from "@/area/DeleteDialog.vue";
import NewEditSheet from "@/area/NewEditSheet.vue";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useAreaStore } from "./storePinia";
import { getCurrentInstance } from "vue";
import AreaType from "@/components/picker/AreaType.vue";
export default {
  name: "AreaTable",

  components: {
    NewEditSheet,
    DeleteDialog,
    AreaType
  },
  // setup() {
  //   const areaStore = useAreaStore();
  //   return { areaStore };
  // },
  data() {
    return {
      // headers: [
      //   { title: this.$t("area.table.code"), value: "code", sortable: true },
      //   { title: this.$t("area.table.type"), value: "type", sortable: true },
      //   { title: this.$t("area.table.desc"), value: "desc", sortable: true },
      //   {
      //     title: this.$t("area.table.site_id"),
      //     value: "site_id",
      //     sortable: true,
      //   },
      //   {
      //     title: this.$t("area.table.latitude"),
      //     value: "latitude",
      //     sortable: true,
      //   },
      //   {
      //     title: this.$t("area.table.longitude"),
      //     value: "longitude",
      //     sortable: true,
      //   },
      //   {
      //     title: "",
      //     value: "action",
      //     sortable: false,
      //     align: "end",
      //   },
      // ],
      localOrganizationStatus: localStorage.getItem("organizationStatus"), // organizationStatus取的是本地缓存的数据
    };
  },
  computed: {
    ...mapState(useAreaStore, ["table", "headers"]),
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

  methods: {
    ...mapActions(useAreaStore, ["getAll", "removeShow", "editShow"]),
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      this.handleSearch();
    },
  },
};
</script>
