<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="4">
          <v-text-field
              v-model="table.options.q"
              label="Search By Spec Code, Short Name, Full Name"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">

          <DictCode
            v-model="table.version_status"
            label="Release Status"
            code="spec_version_status"
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
              Reset1
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
        <v-col cols="3" class="text-end">
            <v-btn
                class="text-none ml-4"
                color="primary"
                variant="flat"
                @click="toSaveDetail"
                v-permission="`Create`"
            >
              New
            </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server fixed-header height="650" show-current-page :headers="headers" :items="table.rows.items"
                           :items-length="table.rows.total || 0" v-model:page="table.options.page"
                           v-model:items-per-page="table.options.itemsPerPage" v-model:sort-by="table.options.sortBy"
                           v-model:sort-desc="table.options.descending" :footer-props="{
            'items-per-page-options': [5, 10, 20],
          }" :loading="table.loading" loading-text="Loading... Please wait">
        <template v-slot:[`item.rolling`]="{ item }">
            <span class="table_action_icon">
              {{ item.rolling?.rolling_code }}
            </span>
        </template>

        <template v-slot:[`item.order_group`]="{ item }">
            <span class="table_action_icon">
              {{ item.order_group?.semi_order_code }}
            </span>
        </template>

        <template v-slot:[`item.semi_load`]="{ item }">
            <span class="table_action_icon">
              {{ item.semi_load?.semi_load_code }}
            </span>
        </template>

        <template v-slot:[`item.site`]="{ item }">
            <span class="table_action_icon">
              {{ item.site?.code }}
            </span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
            <span class="d-block text-end">
              <v-btn
                  variant="text"
                  icon="mdi-content-copy"
                  @click="handleCopy(item)"
                  v-permission="`Create`"
              />
              <v-btn
                  variant="text"
                  icon="mdi-pencil"
                  @click="goDetail(item)"
                  v-permission="`Update`"
              />
              <v-btn
                  variant="text"
                  icon="mdi-delete"
                  @click="removeShow(item)"
                  v-permission="`Delete`"
              />
            </span>
        </template>
      </v-data-table-server>
    </v-card>
    <delete-dialog/>
    <copy-dialog ref="copyRef" @refresh="handleSearch" />
  </v-container>
</template>

<script>
import DeleteDialog from "@/spec_admin/spec/DeleteDialog.vue";
import {mapState} from "pinia";
import {mapActions} from "pinia";
import {useSpecStore} from "./storePinia";
import CopyDialog from "./components/copy.vue";
import API from "./api";
import DictCode from "@/components/picker/DictCode.vue";

export default {
  name: "SpecTable",

  components: {
    DeleteDialog,
    CopyDialog,
    DictCode
  },
  data() {
    return {
      localOrganizationStatus: localStorage.getItem("organizationStatus"),
    };
  },
  computed: {
    ...mapState(useSpecStore, ["table", "headers"]),
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
    ...mapActions(useSpecStore, [
      "getAll",
      "removeShow",
      "editShow",
      "goDetail",
      "searchData",
      "toSaveDetail"
    ]),
    handleCopy(item) {
      this.$refs["copyRef"].handleShow(item);
    },
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      this.table.version_status = 'R'
      handleSearch();
    },
  },
};
</script>
