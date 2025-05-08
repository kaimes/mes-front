<template>
  <new-edit-sheet />
  <delete-dialog />
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
              v-model="q"
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
                :loading="loading"
            >
              Search
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn variant="flat" color="primary" @click="createEditShow()"
                 :disabled="localOrganizationStatus === 'Expired'" v-permission="`Create`">New</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center">
        <v-spacer />
        <v-btn
            variant="text"
            icon="mdi-menu"
            @click="handleOpen"
        />
      </div>
      <v-data-table-server fixed-header height="650" show-current-page :headers="headers" :items="items" :footer-props="{
          'items-per-page-options': [5, 10, 20]
        }" :items-length="total || 0" v-model:page="page" v-model:items-per-page="itemsPerPage"
                           v-model:sort-by="sortBy" v-model:sort-desc.sync="descending" :loading="loading"
                           loading-text="Loading... Please wait">
        <template v-slot:[`item.code`]="{ item }">
          <v-tooltip bottom max-width="500px" :text="item.code">
            <template v-slot:activator="{ props }">
                <span class="code" v-bind="props">
                  {{ item.code }}
                </span>
            </template>
          </v-tooltip>
        </template>

        <template v-slot:[`item.dim1`]="{ item }">
          <span>{{ formatNumber(item.dim1) }}</span>
        </template>

        <template v-slot:[`item.dim2`]="{ item }">
          <span>{{ formatNumber(item.dim2) }}</span>
        </template>

        <template v-slot:[`item.dim3`]="{ item }">
          <span>{{ formatNumber(item.dim3) }}</span>
        </template>

        <template v-slot:[`item.dim4`]="{ item }">
          <span>{{ formatNumber(item.dim4) }}</span>
        </template>

        <template v-slot:[`item.product_type_yield`]="{ item }">
          <span>{{ formatNumber(item.product_type_yield) }}</span>
        </template>

        <template v-slot:[`item.flange_thickness`]="{ item }">
          <span>{{ formatNumber(item.flange_thickness) }}</span>
        </template>

        <template v-slot:[`item.web_thickness`]="{ item }">
          <span>{{ formatNumber(item.web_thickness) }}</span>
        </template>

        <template v-slot:[`item.flange_height`]="{ item }">
          <span>{{ formatNumber(item.flange_height) }}</span>
        </template>

        <template v-slot:[`item.depth_d`]="{ item }">
          <span>{{ formatNumber(item.depth_d) }}</span>
        </template>

        <template v-slot:[`item.width_b`]="{ item }">
          <span>{{ formatNumber(item.width_b) }}</span>
        </template>

        <template v-slot:[`item.mass`]="{ item }">
          <span>{{ formatNumber(item.mass) }}</span>
        </template>

        <template v-slot:[`item.root_radius`]="{ item }">
          <span>{{ formatNumber(item.root_radius) }}</span>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-row>
            <v-col class="d-flex justify-end">
              <v-icon small class="mr-2" @click="createEditShow(item)" v-permission="`Detail`">mdi-pencil</v-icon>
              <v-icon small @click="removeShow(item)" v-permission="`Delete`">mdi-delete</v-icon>
            </v-col>
          </v-row>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
  <MesTable ref="tableRef" name="product_type_list"  v-model="headers" />
</template>

<script>
import { mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import { mapActions, mapState } from 'vuex';
import NewEditSheet from '@/product_type/NewEditSheet.vue';
import DeleteDialog from '@/product_type/DeleteDialog.vue';
import {formatDate} from "@/util/util";
import MesTable from "@/components/table/index.vue";

export default {
  name: 'ProductTypeTable',
  components: {
    MesTable,
    DeleteDialog,
    NewEditSheet
  },
  data() {
    return {
      headers: [
        { title: 'Action', value: 'action', sortable: false, align: 'center', fixed: true },
        { title: 'Code', value: 'code', sortable: true },
        { title: 'Mill Code', minWidth: 120, value: 'mill.code', sortable: true },
        { title: 'Section Type', minWidth: 150, value: 'product_category.code', sortable: true },
        { title: 'Product Code', value: 'product_class.code', sortable: true },
        { title: 'Tolerance Code', value: 'tolerance.code', sortable: true },
        { title: 'Dim1', value: 'dim1', sortable: true },
        { title: 'Dim2', value: 'dim2', sortable: true },
        { title: 'Dim3', value: 'dim3', sortable: true },
        { title: 'Dim4', value: 'dim4', sortable: true },
        { title: 'Yield', value: 'product_type_yield', sortable: true },
        { title: 'Type', value: 'type', sortable: true },
        { title: 'Flange Thick (mm)', value: 'flange_thickness', sortable: true },
        { title: 'Flange Thick 1 (mm)', value: 'flange_thickness_1', sortable: true },
        { title: 'Flange Thick 2 (mm)', value: 'flange_thickness_2', sortable: true },
        { title: 'Flange Thick 3 (mm)', value: 'flange_thickness_3', sortable: true },
        { title: 'Flange Thick 4 (mm)', value: 'flange_thickness_4', sortable: true },


        { title: 'Web Thick (mm)', value: 'web_thickness', sortable: true },
        { title: 'Flange Height (mm)', value: 'flange_height', sortable: true },
        { title: 'Flange Height 1 (mm)', value: 'flange_height_1', sortable: true },
        { title: 'Flange Height 2 (mm)', value: 'flange_height_2', sortable: true },
        { title: 'Flange Height 3 (mm)', value: 'flange_height_3', sortable: true },
        { title: 'Flange Height 4 (mm)', value: 'flange_height_4', sortable: true },

        { title: 'Depth (mm)', value: 'depth_d', sortable: true },
        { title: 'Width (mm)', value: 'width_b', sortable: true },
        { title: 'Width 1 (mm)', value: 'width_b_1', sortable: true },
        { title: 'Width 2 (mm)', value: 'width_b_2', sortable: true },
        { title: 'Mass (kg/m)', value: 'mass', sortable: true },
        { title: 'Root Radius (mm)', value: 'root_radius', sortable: true },
        { title: 'Roughing Xsect', value: 'roughing_xsect', sortable: true },
        { title: 'Cogging Xsect', value: 'cogging_xsect', sortable: true },
        { title: 'Cogging Web', value: 'cogging_web', sortable: true },
        { title: 'Saw Crops Front', value: 'saw_crops_front', sortable: true },
        { title: 'Shear Loss', value: 'shear_loss', sortable: true },
        { title: 'Max Shear Length', value: 'max_shear_length', sortable: true },
        { title: 'Control Roll', value: 'control_roll', sortable: true },

        { title: 'Desc', value: 'desc', sortable: true },
        {
          title: 'Updated By',
          value: 'updated_by',
          sortable: true
        },
        {
          title: 'Updated At',
          key: 'update_at',
          value: (row) => formatDate(row.update_at),
          sortable: true
        },
      ],
      localOrganizationStatus: localStorage.getItem('organizationStatus')
    };
  },

  computed: {
    ...mapState('auth', ['userInfo']),
    ...mapFields('product_type', [
      'table.options.q',
      'table.options.page',
      'table.options.itemsPerPage',
      'table.options.sortBy',
      'table.options.descending',
      'table.loading',
      'table.rows.items',
      'table.rows.total'
    ])
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
      (vm) => [vm.itemsPerPage, vm.sortBy, vm.descending],
      () => {
        this.getAll();
      }
    );
  },

  destroyed() {
    this.closeCreateEdit();
  },

  methods: {
    ...mapGetters('auth', ['getPermission']),
    ...mapActions('product_type', [
      'getAll',
      'createEditShow',
      'removeShow',
      'closeCreateEdit'
    ]),

    handleSearch() {
      this.getAll();
    },

    handleReset() {
      this.$refs["searchForm"].reset();
      this.handleSearch();
    },
    handleOpen() {
      this.$refs.tableRef.handleShow();
    },
    formatNumber(value) {
      if (value === null || value === undefined) return value;
      return value      //1.8 删除toLocaleString()
    },

    clickNewJobOnLocation(item) {
      this.showJobEdit4Customer({ job: null, loc: item });
    }
  }
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
