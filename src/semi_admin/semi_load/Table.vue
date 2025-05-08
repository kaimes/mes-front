<template>
  <v-container fluid>
    <delete-dialog />
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <SemiLoadSelect
              v-model="search.semi_load"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="selected.scarfed_status"
              :rules="[rules.required]"
              label="Consignment Code"
              hide-details
              required
              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <SiteSelect
              v-model="selected.site"
              :rules="[rules.required]"
              disabled
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
            >
              Search
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
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
        <template v-slot:[`item.site`]="{ item }">
            <span class="table_action_icon">
              {{ item.site?.code }}
            </span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
            <span class="table_action_icon">
              <v-icon
                  color="success"
                  @click="goDetail(item)"
                  icon="mdi-pencil"
              ></v-icon>
            </span>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script>
import DeleteDialog from "@/semi_admin/semi/DeleteDialog.vue";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useSemiLoadStore } from "./storePinia";
import { getCurrentInstance } from "vue";
import SiteSelect from "@/semi_admin/semi/components/SiteSelect.vue";
import SemiLoadSelect from "@/semi_admin/semi/components/SemiLoadSelect.vue";

import { required } from "@/util/form";
export default {
  name: "SemiLoadTable",

  components: {
    DeleteDialog,
    SiteSelect,
    SemiLoadSelect,
  },

  setup() {
    return {
      rules: { required },
    };
  },
  data() {
    return {
      localOrganizationStatus: localStorage.getItem("organizationStatus"),
    };
  },
  computed: {
    ...mapState(useSemiLoadStore, ["table", "headers", "selected", "search"]),
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
        vm.search.semi_load,
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
    ...mapActions(useSemiLoadStore, [
      "getAll",
      "removeShow",
      "editShow",
      "goDetail",
    ]),
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      handleSearch();
    },
  },
};
</script>
