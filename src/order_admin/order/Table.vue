<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col cols="6">
          <v-text-field
              v-model="table.options.q"
              label="Search By Order Number, Customer Short Name, Address Line 1, Address Line 2, Address Line 3"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <MillCode
              v-model="table.plant_id"
              label="Mill"
              :hide-details="true"
          />
        </v-col>
        <v-col cols="3">
          <DictCode
              v-model="table.type_of_order"
              label="Order Type"
              code="type_of_order"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col cols="2">
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
          :headers="tableHeaders"
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
        <template v-slot:top>
          <v-toolbar color="white" density="compact" flat>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                  variant="text"
                  icon="mdi-menu"
                  size="small"
                  @click="handleOpen"
              />
            </v-toolbar-items>
          </v-toolbar>
        </template>
        <template v-slot:[`item.action`]="{ item }">
            <span class="table_action_icon">
              <v-icon
                  @click="goDetail(item)"
                  icon="mdi-pencil"
              ></v-icon>
            </span>
        </template>
      </v-data-table-server>
    </v-card>
    <MesTable name="order_list" ref="tableRef" v-model="tableHeaders" />
  </v-container>
</template>
<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";

import DatePickerMenu from "@/components/DatePickerMenu.vue";
import DictCode from "@/components/picker/DictCode.vue";
import { useOrderStore } from "./storePinia";
import SpecCode from "@/components/picker/SpecCode.vue";
import MesTable from "@/components/table/index.vue";
import MillCode from "@/components/picker/MillCode.vue";


export default {
  name: "OrderTable",
  components: {
    MillCode,
    MesTable,
    SpecCode,
    DictCode,
    DatePickerMenu,
  },
  data() {
    return {
      scheduled_start_datetime: new Date().toISOString(),
      localOrganizationStatus: localStorage.getItem("organizationStatus"),
      tableHeaders: [{
        "title": "Action",
        "value": "action",
        "fixed": true,
        "sortable": false,
        "align": "center"
      },
      {
        title: "Mill Code",
        key: "mill.code",
        value: (item) => item.plant?.code || "--",
      },{
        "title": "Order Number",
        "minWidth": 150,
        "key": "order_code",
        "value": "order_code",
        "sortable": true
      }, {
        "title": "Order Type",
        "minWidth": 150,
        "key": "type_of_order",
        "sortable": true
      }, {
        "title": "Customer Short Name",
        "minWidth": 150,
        "key": "customer_short_name",
        "value": "customer_short_name",
        "sortable": true
      }, {
        "title": "Customer Po Number",
        "minWidth": 150,
        "key": "customer_po_number",
        "value": "customer_po_number",
        "sortable": true
      }, {
        "title": "Address Line 1",
        "minWidth": 150,
        "key": "address_line_1",
        "value": "address_line_1",
        "sortable": true
      }, {
        "title": "Address Line 2",
        "minWidth": 150,
        "key": "address_line_2",
        "value": "address_line_2",
        "sortable": true
      }, {
        "title": "Address Line 3",
        "minWidth": 150,
        "key": "address_line_3",
        "value": "address_line_3",
        "sortable": true
      }, {
        "title": "Address Line 4",
        "minWidth": 150,
        "key": "address_line_4",
        "value": "address_line_4",
        "sortable": true
      }, {
        "title": "Address Line 5",
        "minWidth": 150,
        "key": "address_line_5",
        "value": "address_line_5",
        "sortable": true
      }, {
        "title": "Create At",
        "key": "created_at",
        "minWidth": 180,
        "sortable": true
      }, {
        "title": "Order Export Type",
        "minWidth": 150,
        "key": "order_export_type",
        "value": "order_export_type",
        "sortable": true
      }, {
        "title": "Contract",
        "minWidth": 150,
        "key": "contract",
        "value": "contract",
        "sortable": true
      }, {
        "title": "Carriage Terms",
        "minWidth": 150,
        "key": "carriage_terms",
        "value": "carriage_terms",
        "sortable": true
      }, {
        "title": "Mode Of Delivery",
        "minWidth": 150,
        "key": "mode_of_delivery",
        "value": "mode_of_delivery",
        "sortable": true
      }, {
        "title": "Delivery Address ID",
        "minWidth": 150,
        "key": "delivery_address_id",
        "value": "delivery_address_id",
        "sortable": true
      }, {
        "title": "Order Category",
        "minWidth": 150,
        "key": "order_category",
        "value": "order_category",
        "sortable": true
      }, {
        "title": "Business Order Number",
        "minWidth": 150,
        "key": "business_order_code",
        "value": "business_order_code",
        "sortable": true
      }, {
        "title": "Customer Code",
        "minWidth": 150,
        "key": "customer_code",
        "value": "customer_code",
        "sortable": true
      }, {
        "title": "Customer Full Name",
        "minWidth": 150,
        "key": "customer_full_name",
        "value": "customer_full_name",
        "sortable": true
      }, {
        "title": "Customer Group",
        "minWidth": 150,
        "key": "customer_group",
        "value": "customer_group",
        "sortable": true
      }, {
        "title": "Section Order Category",
        "minWidth": 150,
        "key": "section_order_category",
        "value": "section_order_category",
        "sortable": true
      }, {
        "title": "Customer Credit Worthiness",
        "minWidth": 150,
        "key": "customer_credit_worthiness",
        "value": "customer_credit_worthiness",
        "sortable": true
      }, {
        "title": "Label Data",
        "minWidth": 150,
        "key": "label_data",
        "value": "label_data",
        "sortable": true
      }, {
        "title": "Delivery Note",
        "minWidth": 150,
        "key": "delivery_note",
        "value": "delivery_note",
        "sortable": true
      }, {
        "title": "Destination Country",
        "minWidth": 150,
        "key": "destination_country",
        "value": "destination_country",
        "sortable": true
      }, {
        "title": "Job Scheme Name",
        "minWidth": 150,
        "key": "job_scheme_name",
        "value": "job_scheme_name",
        "sortable": true
      }, {
        "title": "Transport Mode",
        "minWidth": 150,
        "key": "transport_mode",
        "value": "transport_mode",
        "sortable": true
      }, {
        "title": "Ship To Customer Number",
        "minWidth": 150,
        "key": "ship_to_customer_number",
        "value": "ship_to_customer_number",
        "sortable": true
      }, {
        "title": "Test Certificate Customer Number",
        "minWidth": 150,
        "key": "test_certificate_customer_number",
        "value": "test_certificate_customer_number",
        "sortable": true
      }, {
        "title": "Sales Division",
        "minWidth": 150,
        "key": "sales_division",
        "sortable": true
      }, {
        "title": "Distribution Channel",
        "minWidth": 150,
        "key": "distribution_channel",
        "value": "distribution_channel",
        "sortable": true
      }, {
        "title": "Sales Organization",
        "minWidth": 150,
        "key": "sales_organization",
        "value": "sales_organization",
        "sortable": true
      }, {
        "title": "Order Reason",
        "minWidth": 150,
        "key": "order_reason",
        "value": "order_reason",
        "sortable": true
      }, {
        "title": "Order Numberte",
        "minWidth": 150,
        "key": "order_note",
        "value": "order_note",
        "sortable": true
      }, {
        "title": "Incoterms Location",
        "minWidth": 150,
        "key": "incoterms_location",
        "value": "incoterms_location",
        "sortable": true
      }, {
        "title": "General Remark 1",
        "minWidth": 150,
        "key": "general_remark_1",
        "value": "general_remark_1",
        "sortable": true
      }, {
        "title": "General Remark 2",
        "minWidth": 150,
        "key": "general_remark_2",
        "value": "general_remark_2",
        "sortable": true
      }, {
        "title": "General Remark 3",
        "minWidth": 150,
        "key": "general_remark_3",
        "value": "general_remark_3",
        "sortable": true
      }, {
        "title": "General Remark 4",
        "minWidth": 150,
        "key": "general_remark_4",
        "value": "general_remark_4",
        "sortable": true
      }, {
        "title": "Copies Of Test Certificate",
        "minWidth": 150,
        "key": "copies_of_test_certificate",
        "value": "copies_of_test_certificate",
        "sortable": true
      }, {
        "title": "Outside Inspection Required Flag",
        "minWidth": 150,
        "key": "outside_inspection_required_flag",
        "value": "outside_inspection_required_flag",
        "sortable": true
      }, {
        "title": "Customer Code ZT",
        "minWidth": 150,
        "key": "customer_code_zt",
        "value": "customer_code_zt",
        "sortable": true
      }, {
        "title": "Customer Short Name ZT",
        "minWidth": 150,
        "key": "customer_short_name_zt",
        "value": "customer_short_name_zt",
        "sortable": true
      }, {
        "title": "Customer Full Name ZT",
        "minWidth": 150,
        "key": "customer_full_name_zt",
        "value": "customer_full_name_zt",
        "sortable": true
      }, {
        "title": "Address Line 1 ZT",
        "minWidth": 150,
        "key": "address_line_1_zt",
        "value": "address_line_1_zt",
        "sortable": true
      }, {
        "title": "Address Line 2 ZT",
        "minWidth": 150,
        "key": "address_line_2_zt",
        "value": "address_line_2_zt",
        "sortable": true
      }, {
        "title": "Address Line 3 ZT",
        "minWidth": 150,
        "key": "address_line_3_zt",
        "value": "address_line_3_zt",
        "sortable": true
      }, {
        "title": "Address Line 4 ZT",
        "minWidth": 150,
        "key": "address_line_4_zt",
        "value": "address_line_4_zt",
        "sortable": true
      }, {
        "title": "Address Line 5 ZT",
        "minWidth": 150,
        "key": "address_line_5_zt",
        "value": "address_line_5_zt",
        "sortable": true
      }]
    };
  },
  computed: {
    ...mapState(useOrderStore, ["table", "headers"]),
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
    ...mapActions(useOrderStore, [
      "getAll",
      // "removeShow",
      // "editShow",
      "goDetail",
    ]),
  },
};
</script>
