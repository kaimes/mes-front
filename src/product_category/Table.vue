<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
              v-model="table.options.q"
              label="Search By Code, Type"
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
                :loading="table.loading"
            >
              Search
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="text-end">
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
          <div class="d-flex align-center gap-2">
            <v-btn
                variant="text"
                icon="mdi-pencil"
                @click="editShow(item)"
                v-permission="`Detail`"
            />
            <v-btn
                variant="text"
                icon="mdi-delete"
                @click="removeShow(item)"
                v-permission="`Delete`"
            />
          </div>
        </template>
        
        <!-- Example of formatting a numeric column (Dim1) -->
        <template v-slot:[`item.dim1`]="{ item }">
          <span>{{ formatNumber(item.dim1) }}</span>
        </template>

        <template v-slot:[`item.dim2`]="{ item }">
          <span>{{ formatNumber(item.dim2) }}</span>
        </template>

        <!-- You can apply this formatting to any other numeric columns as well -->
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script>
import DeleteDialog from "@/product_category/DeleteDialog.vue";
import NewEditSheet from "@/product_category/NewEditSheet.vue";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useProductCategoryStore } from "./store";
import { getCurrentInstance } from "vue";
import { formatDate } from "@/util/util";

export default {
  name: "ProductCategory",

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
          align: 'center',
          width: 70,
          fixed: true
        },
        { title: "Code", value: "code", sortable: true },
        { title: "Mill Code", value: "mill.code", sortable: true },
        { title: "Type", value: "type", sortable: true },
        { title: "Desc", value: "desc", sortable: true },
        { title: "Dim1", value: "dim1", sortable: true },
        { title: "Dim2", value: "dim2", sortable: true },
        { title: "Dim3", value: "dim3", sortable: true },
        { title: "Dim4", value: "dim4", sortable: true },
        {
          title: 'Updated By',
          value: 'updated_by',
          sortable: true
        },
        {
          title: 'Updated At',
          key: 'updated_at',
          value: (row) => formatDate(row.updated_at),
          sortable: true
        }
      ],
      localOrganizationStatus: localStorage.getItem("organizationStatus"), // organizationStatus取的是本地缓存的数据
    };
  },

  computed: {
    ...mapState(useProductCategoryStore, ["table", "headers"]),
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
    ...mapActions(useProductCategoryStore, ["getAll", "removeShow", "editShow"]),
    
    // 数值格式化函数
    formatNumber(value) {
      if (value === null || value === undefined) return value;
      return value// 使用 JavaScript 内建的 toLocaleString 来格式化 1.8删除toLocaleString()
    },

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
