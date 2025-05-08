<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
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
            >
              Search
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="text-end">
            <v-btn
              color="primary"
              @click="editShow(null)"
              :disabled="localOrganizationStatus === 'Expired'"
              v-permission="`Create`"
              elevation="0"
              >New</v-btn
            >
          </v-col>
        <!-- <v-col cols="6" class="text-end">
          <router-link :to="{ path: '/semi_size_detail' }">
            <v-btn
                color="primary"
                variant="flat"
                v-permission="`Create`"
            >
              New
            </v-btn>
          </router-link>
        </v-col> -->
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          height="610"
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
          <div class="d-flex align-center ga-4">
            <router-link :to="{ path: '/semi_size_detail', query: { id: item.id } }">
              <v-icon icon="mdi-pencil" v-permission="`Detail`"></v-icon>
            </router-link>
            <v-icon small @click="removeShow(item)" v-permission="`Delete`">mdi-delete</v-icon>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

  </v-container>
</template>

<script>
import DeleteDialog from "@/semi_admin/semi_size/DeleteDialog.vue";
import NewEditSheet from "@/semi_admin/semi_size/NewEditSheet.vue";
import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useSemiSizeStore } from "./storePinia";

export default {
  name: "SemiSizeTable",

  components: {
    NewEditSheet,
    DeleteDialog,
  },
  data() {
    return {
      headers: [
        {
          title: "Action",
          value: "action",
          sortable: false,
          fixed: true,
          width: 88,
          align: "center",
        },
        { title: "Size Code", value: "code" , sortable: true },
        { title: "Width(mm)", value: "width_mm", sortable: true },
        { title: "Thick(mm)", value: "thick_mm", sortable: true },
        { title: "Norm Suffix", value: "norm_suffix", sortable: false },
        
      ],
      localOrganizationStatus: localStorage.getItem("organizationStatus"), // organizationStatus取的是本地缓存的数据
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),
    ...mapState(useSemiSizeStore, ["table"]),
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
    ...mapActions(useSemiSizeStore, [
      "getAll",
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
