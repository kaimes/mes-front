<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <MillCode
              v-model="queryParams.plant_id"
              label="Mill"
              :hide-details="true"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="queryParams.order_code"
              label="Order Number"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="queryParams.sap_order_code"
              label="Sap Order Number"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="queryParams.business_order_code"
              label="Business Order Number"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="queryParams.customer_short_name"
              label="Customer"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
<!--        <v-col cols="3">-->
<!--          <CustomerCode-->
<!--              v-model="queryParams.customer_id"-->
<!--              label="Customer"-->
<!--              :hide-details="true"-->
<!--          />-->
<!--        </v-col>-->
        <v-col cols="3">
          <DictCode
              v-model="queryParams.type_of_order"
              label="Order Type"
              code="type_of_order"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col cols="3">
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
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
              :loading="loading"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-2 pl-4 pr-4 pb-4" elevation="0" variant="outlined">
      <div class="d-flex align-center pt-2 pb-2">
        <v-spacer></v-spacer>
        <v-btn
            variant="text"
            icon="mdi-menu"
            size="small"
            @click="handleOpen"
        />
      </div>
      <v-divider />
      <v-data-table-server
          fixed-header
          height="650"
          show-current-page
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          @update:options="handleTableChange"
      >
        <template v-slot:item.action="{ item }">
          <router-link :to="{ path: '/order_item', query: { id: item.id } }">
            <v-btn
                variant="text"
                icon="mdi-pencil"
                v-permission="`Detail`"
            />
          </router-link>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <MesTable name="order_list" ref="tableRef" v-model="tableHeaders" />
  </v-container>
</template>
<script name="OrderItemList" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import MesTable from "@/components/table/index.vue";
import DictCode from "@/components/picker/DictCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import CustomerCode from "@/components/picker/CustomerCode.vue";
import API from "./api";

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {
    "title": "Action",
    "value": "action",
    "key": "action",
    "fixed": true,
    "sortable": false,
    "align": "center"
  },
  {
    title: "Mill Code",
    key: "mill.code",
    value: (item) => item.plant?.code || "--",
  }, {
    "title": "Order Number",
    "minWidth": 150,
    "key": "order_code",
    "value": "order_code",
    "sortable": true
  }, {
    "title": "Sap Order Number",
    "minWidth": 150,
    "key": "sap_order_code",
    "value": "sap_order_code",
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
  },
]);
const tableList = ref([]);
const total = ref(0);

const queryParams = reactive({
  q: undefined,
  customer_id:undefined,
  plant_id: undefined,
  order_code: undefined,
  sap_order_code: undefined,
  business_order_code: undefined,
  customer_short_name: undefined,
  type_of_order: [],
  page: 1,
  itemsPerPage: 10,
  sortBy: ["updated_at"],
  descending: [true],
});

const getData = () => {
  let fields = [];
  let ops = [];
  let values = [];

  if (queryParams.type_of_order && queryParams.type_of_order.length > 0) {
    fields.push("type_of_order");
    ops.push("in");
    values.push(queryParams.type_of_order);
  }
  if (queryParams.plant_id) {
    fields.push("plant_id");
    ops.push("eq");
    values.push(queryParams.plant_id);
  }
  if (queryParams.order_code) {
    fields.push("order_code");
    ops.push("like");
    values.push(`%${queryParams.order_code}%`);
  }
  if (queryParams.sap_order_code) {
    fields.push("sap_order_code");
    ops.push("like");
    values.push(`%${queryParams.sap_order_code}%`);
  }
  if (queryParams.business_order_code) {
    fields.push("business_order_code");
    ops.push("like");
    values.push(`%${queryParams.business_order_code}%`);
  }
  if (queryParams.customer_short_name) {
    fields.push("customer_short_name");
    ops.push("ilike");
    values.push(`%${queryParams.customer_short_name}%`);
  }
  // if (queryParams.customer) {
  //   fields.push("customer_id");
  //   ops.push("eq");
  //   values.push(queryParams.customer_id);
  // }
  loading.value = true;
  API.getAll({
    ...toRaw(queryParams),
    fields,
    ops,
    values
  }).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
    } else {
      total.value = 0;
      tableList.value = [];
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.page = page;
  queryParams.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.sortBy = sortBy;
  }
  getData();
}

const handleSearch = () => {
  queryParams.page = 1;
  getData();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

// 创建新数据
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getData();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
  });
}

const handleSpecChange = (spec, key) => {
  form.value[`${key}`] = spec.spec_code;
}
</script>
<style lang="scss" scoped>
.page {
  .section-field {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-input {
      flex: 1;
      flex-shrink: 0;
    }

    &-divider {
      width: 20px;
      height: 2px;
      background-color: #333;
      margin: 0 10px;
    }
  }
}
</style>
