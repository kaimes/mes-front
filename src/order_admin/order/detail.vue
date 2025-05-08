<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <MillCode
              v-model="queryParams.plant_id"
              label="Mill"
              :hide-details="true"
          />
        </v-col>
        <v-col cols="2">
          <RollingCode v-model="queryParams.rolling_code"></RollingCode>
        </v-col>
        <v-col cols="4">
          <OrderCascadeCode v-model="queryParams.order_code" variant="underlined" density="default"
                            hide-details></OrderCascadeCode>
        </v-col>
        <v-col cols="2">
          <OrderItemCode v-model="queryParams.order_item_id" variant="underlined" :hide-details="true"
                         label="Order Item"
                         :order_id="queryParams.order_code"/>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="queryParams.sap_line_item_code"
              label="Sap Line item Number"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="queryParams.business_order_code"
              label="Business Order Number"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="queryParams.completion_status"
              label="Completion Status"
              code="completion_status"
              :hide-details="true"
          />
        </v-col>
        <v-col cols="2">
          <ProductTypeCode v-model="queryParams.product_type_id" variant="underlined" :hide-details="true"
                           label="Product Type"/>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="queryParams.dim3"
              label="KGM(Dim3)"
              hide-details
              clearable
          ></v-text-field>

        </v-col>
        <v-col cols="2">
          <VueDatePicker
              @update:model-value="formatDateValue"
              position="left"
              :range="{ partialRange: false }"
              :enable-time-picker="false"
              :teleport="true"
          >
            <template #trigger>
              <v-text-field
                  :model-value="queryParams.start_date ? `${queryParams.start_date}~${queryParams.end_date}` : ''"
                  density="default"
                  label="Date Range"
                  bg-color="white"
                  placeholder="Please select date"
                  :hide-details="true"
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="queryParams.late_arrival"
              label="Late Arrival"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="queryParams.amend_status"
              label="Amend Status"
              code="amend_status"
              :hide-details="true"
          />
        </v-col>
        <v-col>
          <div class="d-flex align-center ga-2 justify-end">
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
              Reset
            </v-btn>
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="orderItemLoading">
              Search
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table
          fixed-header
          show-current-page
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          :headers="orderItemHeaders"
          :items="orderItemList"
          :items-length="orderItemTotal"
          :loading="orderItemLoading"
          @update:options="handleTableChange"
      >
        <template v-slot:item.order_item_remarks="{ item }">
          <template v-for="remark in item.order_item_remarks" :key="remark.id">
            <v-tooltip :text="remark.text">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props">{{ remark.identifier }}</v-btn>
              </template>
            </v-tooltip>
          </template>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div  class="d-flex align-center">
            <router-link :to="{ path: '/order_item/detail', query: { id: item.id } }">
              <v-icon icon="mdi-pencil"></v-icon>
            </router-link>
            <v-btn @click="handleSendToPcc(item)" variant="text" icon="mdi-rocket" />
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table fixed-header :loading="orderItemLoading" :headers="orderRemarkHeaders" :items="orderRemarkList" density="default">
        <template #bottom>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script setup>
import {reactive, ref, toRaw, toRefs} from "vue";
import {useRoute} from "vue-router";
import {toast} from "vue3-toastify";
import API from "@/order_admin/order/api";
import OrderItem from "@/order_admin/order_line_item/api";
import RollingCode from "@/components/picker/RollingCode.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import OrderCascadeCode from "@/components/picker/OrderCascadeCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import moment from "moment";

const route = useRoute();
const orderItemLoading = ref(false);
const orderItemTotal = ref(0);
const orderItemList = ref([]);
const orderItemHeaders = ref([
  {
    "title": "Action",
    "value": "action",
    "minWidth": 60,
    "sortable": false,
    "fixed": "left"
  }, {
    "title": "Line Item Number ",
    "value": "line_item_code",
    "minWidth": 120,
    "sortable": true
  }, {
    "title": "Ordered Tonnes",
    "value": "weight_per_pc",
    "sortable": true,
    "minWidth": 120
  }, {
    "title": "Ordered Bars",
    "value": "quantity",
    "sortable": true,
    "minWidth": 120
  }, {
    "title": "Rolled Bars",
    "value": "cutted_bar",
    "sortable": true,
    "minWidth": 120
  }, {
    "title": "Adviced Bars",
    "value": "request_bar",
    "sortable": true,
    "minWidth": 120
  }, {
    "title": "Mill Code ",
    "value": "mill.code",
    "sortable": false,
    "align": "end"
  }, {
    "title": "Rolling Code Short",
    "minWidth": 120,
    "key": "rolling_code",
    "value": "rolling_code",
    "sortable": true
  }, {
    "title": "Spec Code",
    "minWidth": 120,
    "key": "spec_code",
    "value": "spec_code",
    "sortable": true
  }, {
    "title": "Product Dim1",
    "minWidth": 120,
    "key": "product_dim1",
    "value": "product_dim1",
    "sortable": true
  }, {
    "title": "Product Dim2",
    "minWidth": 120,
    "key": "product_dim2",
    "value": "product_dim2",
    "sortable": true
  }, {
    "title": "Product Dim3",
    "minWidth": 120,
    "key": "product_dim3",
    "value": "product_dim3",
    "sortable": true
  }, {
    "title": "Product Form",
    "minWidth": 120,
    "key": "product_form",
    "value": "product_form",
    "sortable": true
  }, {
    "title": "Product Form Type",
    "minWidth": 120,
    "key": "product_form_type",
    "value": "product_form_type",
    "sortable": true
  }, {
    "title": "Quality Code",
    "minWidth": 120,
    "key": "quality_code",
    "value": "quality_code",
    "sortable": true
  }, {
    "title": "Request Bar",
    "minWidth": 120,
    "key": "request_bar",
    "value": "request_bar",
    "sortable": true
  }, {
    "title": "Cutted Bar",
    "minWidth": 120,
    "key": "cutted_bar",
    "value": "cutted_bar",
    "sortable": true
  }, {
    "title": "Length (mm)",
    "minWidth": 120,
    "key": "length_mm",
    "value": "length_mm",
    "sortable": true
  }, {
    "title": "Quantity (PC)",
    "minWidth": 120,
    "key": "quantity",
    "value": "quantity",
    "sortable": true
  }, {
    "title": "Unit",
    "minWidth": 120,
    "key": "un",
    "value": "un",
    "sortable": true
  }, {
    "title": "Line Item Desc",
    "minWidth": 120,
    "key": "line_item_desc",
    "value": "line_item_desc",
    "sortable": true
  }, {
    "title": "Tonnage",
    "minWidth": 120,
    "key": "tonnage",
    "value": "tonnage",
    "sortable": true
  }, {
    "title": "Line Item Seq",
    "minWidth": 120,
    "key": "line_item_seq",
    "value": "line_item_seq",
    "sortable": true
  }, {
    "title": "Product Code",
    "minWidth": 120,
    "key": "product_code",
    "value": "product_code",
    "sortable": true
  }, {
    "title": "Customer Spec Code",
    "minWidth": 120,
    "key": "customer_spec_code",
    "value": "customer_spec_code",
    "sortable": true
  }, {
    "title": "Customer Material",
    "minWidth": 120,
    "key": "customer_material",
    "value": "customer_material",
    "sortable": true
  }, {
    "title": "Stocked Quantity",
    "minWidth": 120,
    "key": "stocked_quantity",
    "value": "stocked_quantity",
    "sortable": true
  }, {
    "title": "Tonnage Tolerance Min Percent",
    "minWidth": 120,
    "key": "tonnage_tolerance_min_percent",
    "value": "tonnage_tolerance_min_percent",
    "sortable": true
  }, {
    "title": "Tonnage Tolerance Max Percent",
    "minWidth": 120,
    "key": "tonnage_tolerance_max_percent",
    "value": "tonnage_tolerance_max_percent",
    "sortable": true
  }, {
    "title": "Product DIM 4",
    "minWidth": 120,
    "key": "product_dim4",
    "value": "product_dim4",
    "sortable": true
  }, {
    "title": "Product DIM Unit",
    "minWidth": 120,
    "key": "product_dim_unit",
    "value": "product_dim_unit",
    "sortable": true
  }, {
    "title": "Outside Inspection Required",
    "minWidth": 120,
    "key": "outside_inspection_required",
    "value": "outside_inspection_required",
    "sortable": true
  }, {
    "title": "Transport Type",
    "minWidth": 120,
    "key": "transport_type",
    "value": "transport_type",
    "sortable": true
  }, {
    "title": "Destination Port",
    "minWidth": 120,
    "key": "destination_port",
    "value": "destination_port",
    "sortable": true
  }, {
    "title": "Loading Port",
    "minWidth": 120,
    "key": "loading_port",
    "value": "loading_port",
    "sortable": true
  }, {
    "title": "Remarks",
    "minWidth": 120,
    "key": "order_item_remarks",
    "value": "order_item_remarks",
    "sortable": true
  }, {
    "title": "Clear Remark Type",
    "minWidth": 120,
    "key": "clear_remark_type",
    "value": "clear_remark_type",
    "sortable": true
  }, {
    "title": "Clear Remark Seq",
    "minWidth": 120,
    "key": "clear_remark_sequence",
    "value": "clear_remark_sequence",
    "sortable": true
  }, {
    "title": "Clear Remark",
    "minWidth": 120,
    "key": "clear_remark",
    "value": "clear_remark",
    "sortable": true
  }, {
    "title": "General Remark 1",
    "minWidth": 120,
    "key": "general_remark_1",
    "value": "general_remark_1",
    "sortable": true
  }, {
    "title": "General Remark 2",
    "minWidth": 120,
    "key": "general_remark_2",
    "value": "general_remark_2",
    "sortable": true
  }, {
    "title": "General Remark 3",
    "minWidth": 120,
    "key": "general_remark_3",
    "value": "general_remark_3",
    "sortable": true
  }, {
    "title": "General Remark 4",
    "minWidth": 120,
    "key": "general_remark_4",
    "value": "general_remark_4",
    "sortable": true
  }, {
    "title": "General Remark 5",
    "minWidth": 120,
    "key": "general_remark_5",
    "value": "general_remark_5",
    "sortable": true
  }, {
    "title": "Marking Requirements",
    "minWidth": 120,
    "key": "marking_requirements",
    "value": "marking_requirements",
    "sortable": true
  }, {
    "title": "Processing Remark 1",
    "minWidth": 120,
    "key": "processing_remark_1",
    "value": "processing_remark_1",
    "sortable": true
  }, {
    "title": "Processing Remark 2",
    "minWidth": 120,
    "key": "processing_remark_2",
    "value": "processing_remark_2",
    "sortable": true
  }, {
    "title": "Processing Remark 3",
    "minWidth": 120,
    "key": "processing_remark_3",
    "value": "processing_remark_3",
    "sortable": true
  }, {
    "title": "Processing Remark 4",
    "minWidth": 120,
    "key": "processing_remark_4",
    "value": "processing_remark_4",
    "sortable": true
  }, {
    "title": "Processing Remark 5",
    "minWidth": 120,
    "key": "processing_remark_5",
    "value": "processing_remark_5",
    "sortable": true
  }, {
    "title": "Delivery Date",
    "minWidth": 120,
    "key": "delivery_date",
    "sortable": true
  }, {
    "title": "Delivery Address ID",
    "minWidth": 120,
    "key": "delivery_address_id",
    "value": "delivery_address_id",
    "sortable": true
  }, {
    "title": "Caster",
    "minWidth": 120,
    "key": "caster",
    "value": "caster",
    "sortable": true
  }, {
    "title": "Surface Grade",
    "minWidth": 120,
    "key": "surface_grade",
    "value": "surface_grade",
    "sortable": true
  }, {
    "title": "Coating Type",
    "minWidth": 120,
    "key": "coating_type",
    "value": "coating_type",
    "sortable": true
  }, {
    "title": "Cut Margin Min",
    "minWidth": 120,
    "key": "cut_margin_min",
    "value": "cut_margin_min",
    "sortable": true
  }, {
    "title": "Cut Margin Max",
    "minWidth": 120,
    "key": "cut_margin_max",
    "value": "cut_margin_max",
    "sortable": true
  }, {
    "title": "Color Code",
    "minWidth": 120,
    "key": "color_code",
    "value": "color_code",
    "sortable": true
  }, {
    "title": "Carbon Min",
    "minWidth": 120,
    "key": "carbon_min",
    "value": "carbon_min",
    "sortable": true
  }, {
    "title": "Carbon Max",
    "minWidth": 120,
    "key": "carbon_max",
    "value": "carbon_max",
    "sortable": true
  }, {
    "title": "Manganese Range Min",
    "minWidth": 120,
    "key": "manganese_range_min",
    "value": "manganese_range_min",
    "sortable": true
  }, {
    "title": "Manganese Range Max",
    "minWidth": 120,
    "key": "manganese_range_max",
    "value": "manganese_range_max",
    "sortable": true
  }, {
    "title": "Secondary Length 1 Min",
    "minWidth": 120,
    "key": "secondary_length_1_min",
    "value": "secondary_length_1_min",
    "sortable": true
  }, {
    "title": "Secondary Length 1 Max",
    "minWidth": 120,
    "key": "secondary_length_1_max",
    "value": "secondary_length_1_max",
    "sortable": true
  }, {
    "title": "Section Width Min",
    "minWidth": 120,
    "key": "section_width_min",
    "value": "section_width_min",
    "sortable": true
  }, {
    "title": "Section Thickness Min",
    "minWidth": 120,
    "key": "section_thickness_min",
    "value": "section_thickness_min",
    "sortable": true
  }, {
    "title": "Section Width Max",
    "minWidth": 120,
    "key": "section_width_max",
    "value": "section_width_max",
    "sortable": true
  }, {
    "title": "Section Thickness Max",
    "minWidth": 120,
    "key": "section_thickness_max",
    "value": "section_thickness_max",
    "sortable": true
  }, {
    "title": "Inspector Code 1",
    "minWidth": 120,
    "key": "inspector_code_1",
    "value": "inspector_code_1",
    "sortable": true
  }, {
    "title": "Inspector Code 2",
    "minWidth": 120,
    "key": "inspector_code_2",
    "value": "inspector_code_2",
    "sortable": true
  }, {
    "title": "Inspector Code 3",
    "minWidth": 120,
    "key": "inspector_code_3",
    "value": "inspector_code_3",
    "sortable": true
  }, {
    "title": "Label Template ID",
    "minWidth": 120,
    "key": "label_template_id",
    "value": "label_template_id",
    "sortable": true
  }, {
    "title": "Label Data",
    "minWidth": 120,
    "key": "label_data",
    "value": "label_data",
    "sortable": true
  }, {
    "title": "Quantity (PC)",
    "minWidth": 120,
    "key": "quantity_pc",
    "value": "quantity_pc",
    "sortable": true
  }, {
    "title": "Quantity (Tonnage)",
    "minWidth": 120,
    "key": "quantity_tonnage",
    "value": "quantity_tonnage",
    "sortable": true
  }, {
    "title": "Length 1 (MM)",
    "minWidth": 120,
    "key": "length_1_mm",
    "value": "length_1_mm",
    "sortable": true
  }, {
    "title": "Length 2 (MM)",
    "minWidth": 120,
    "key": "length_2_mm",
    "value": "length_2_mm",
    "sortable": true
  }, {
    "title": "Length Feet",
    "minWidth": 120,
    "key": "length_feet",
    "value": "length_feet",
    "sortable": true
  }, {
    "title": "Length Inch",
    "minWidth": 120,
    "key": "length_inch",
    "value": "length_inch",
    "sortable": true
  }, {
    "title": "ASTM DIM1",
    "minWidth": 120,
    "key": "astm_dim1",
    "value": "astm_dim1",
    "sortable": true
  }, {
    "title": "ASTM DIM2",
    "minWidth": 120,
    "key": "astm_dim2",
    "value": "astm_dim2",
    "sortable": true
  }, {
    "title": "ASTM DIM3",
    "minWidth": 120,
    "key": "astm_dim3",
    "value": "astm_dim3",
    "sortable": true
  }, {
    "title": "Sales Order Unit",
    "minWidth": 120,
    "key": "sales_order_unit",
    "value": "sales_order_unit",
    "sortable": true
  }, {
    "title": "Semi Width",
    "minWidth": 120,
    "key": "semi_width",
    "value": "semi_width",
    "sortable": true
  }, {
    "title": "Semi Thickness",
    "minWidth": 120,
    "key": "semi_thickness",
    "value": "semi_thickness",
    "sortable": true
  }, {
    "title": "Prime Type",
    "minWidth": 120,
    "key": "prime_type",
    "value": "prime_type",
    "sortable": true
  }, {
    "title": "Imperial IND",
    "minWidth": 120,
    "key": "im_type",
    "value": "im_type",
    "sortable": true
  }, {
    "title": "Weight Per PC",
    "minWidth": 120,
    "key": "weight_per_pc",
    "value": "weight_per_pc",
    "sortable": true
  }, {
    "title": "Secondary Length 2 Min",
    "minWidth": 120,
    "key": "secondary_length_2_min",
    "value": "secondary_length_2_min",
    "sortable": true
  }, {
    "title": "Secondary Length 2 Max",
    "minWidth": 120,
    "key": "secondary_length_2_max",
    "value": "secondary_length_2_max",
    "sortable": true
  }, {
    "title": "Secondary Length Volume",
    "minWidth": 120,
    "key": "secondary_length_volume",
    "value": "secondary_length_volume",
    "sortable": true
  }, {
    "title": "Rejection",
    "minWidth": 120,
    "key": "rejection",
    "value": "rejection",
    "sortable": true
  }, {
    "title": "Rejection Desc",
    "minWidth": 120,
    "key": "rejection_desc",
    "value": "rejection_desc",
    "sortable": true
  }, {
    "title": "Sub Item No",
    "minWidth": 120,
    "key": "sub_item_no",
    "value": "sub_item_no",
    "sortable": true
  }, {
    "title": "Condition Record Per Unit",
    "minWidth": 120,
    "key": "condition_record_per_unit",
    "value": "condition_record_per_unit",
    "sortable": true
  }]);

const orderRemarkHeaders = ref([
  { title: 'Identifier', value: 'identifier', sortable: false, },
  { title: 'Type', value: 'type', sortable: false },
  { title: 'Text', value: 'text', sortable: false },
]);

const orderRemarkList = ref([]);

const data = reactive({
  params: {
    id: undefined,
  },
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_by"],
    descending: [false],
  },
});

const { params, queryParams } = toRefs(data);
const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  getOrderItemList();
}

const formatDateValue = (res) => {
  if (res && res.length === 2) {
    queryParams.value.start_date = moment(res[0]).format("YYYY-MM-DD");
    queryParams.value.end_date = moment(res[1]).format("YYYY-MM-DD");
  } else {
    queryParams.value.start_date = undefined;
    queryParams.value.end_date = undefined;
  }
}

const getOrderItemList = () => {
  const params = {};

  const searchOpts = toRaw(queryParams.value); // 获取searchOptions
  console.log("searchOpts", searchOpts)
  params.ops = [];
  params.fields = [];
  params.values = [];


  if (searchOpts.rolling_code) {
    params.ops = ["eq"];
    params.fields = ["rolling_id"];
    params.values = [searchOpts.rolling_code];
  }
  if (searchOpts.dim3) {
    params.ops.push("eq");
    params.fields.push("product_dim3");
    params.values.push(searchOpts.dim3);
  }
  if (searchOpts.order_code) {
    params.ops = ["eq"];
    params.fields = ["order_id"];
    params.values = [searchOpts.order_code];
  }

  if (searchOpts.order_item_id) {
    params.ops = ["eq"];
    params.fields = ["id"];
    params.values = [searchOpts.order_item_id];
  }
  if (searchOpts.late_arrival) {
    params.ops.push("eq");
    params.fields.push("late_arrival");
    params.values.push(searchOpts.late_arrival);
  }
  if (searchOpts.sap_order_code) {
    params.ops.push("like");
    params.fields.push("order.sap_order_code");
    params.values.push(`%${searchOpts.sap_order_code}%`);
  }
  if (searchOpts.business_order_code) {
    params.ops.push("like");
    params.fields.push("order.business_order_code");
    params.values.push(`%${searchOpts.business_order_code}%`);
  }
  if (searchOpts.sap_line_item_code) {
    params.ops.push("like");
    params.fields.push("sap_line_item_code");
    params.values.push(`%${searchOpts.sap_line_item_code}%`);
  }
  // 处理 mill
  if (searchOpts.plant_id) {
    params.ops.push("eq");
    params.fields.push("plant_id");
    params.values.push(searchOpts.plant_id);
  }
  // 处理completion_status
  if (searchOpts.completion_status) {
    params.ops.push("eq");
    params.fields.push("completion_status");
    params.values.push(searchOpts.completion_status);
  }
  // 处理amend_status
  if (searchOpts.amend_status) {
    params.ops.push("eq");
    params.fields.push("amend_status");
    params.values.push(searchOpts.amend_status);
  }
  // 处理product_type_id
  if (searchOpts.product_type_id) {
    params.ops.push("eq");
    params.fields.push("product_type_id");
    params.values.push(searchOpts.product_type_id);
  }
  if (searchOpts.start_date) {
    params.start_date = searchOpts.start_date;
  }
  if (searchOpts.end_date) {
    params.end_date = searchOpts.end_date;
  }

  orderItemLoading.value = true;
  API.getOrderItem(params).then(res => {
    if (res.status === 200) {
      orderItemTotal.value = res.data.total || 0;
      orderItemList.value = res.data.items || [];
    } else {
      orderItemTotal.value = 0;
      orderItemList.value = [];
    }
  }).finally(() => {
    orderItemLoading.value = false;
  });
}

const handleSearch = () => {
  queryParams.value.page = 1;
  getOrderItemList();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  queryParams.value.late_arrival = undefined;
  queryParams.value.completion_status = undefined;
  queryParams.value.product_type_id = undefined;
  queryParams.value.order_code = undefined;
  queryParams.value.rolling_code = undefined;
  queryParams.value.plant_id = undefined;
  getOrderItemList();
}

const getDetailById = (id) => {
  API.get(id).then(res => {
    const {status, data} = res
    if (status === 200) {
      params.value = data;
    } else {
      toast.error('Order is empty', { autoClose: 60000 });
    }
  });
}

const getOrderRemark = (id) => {
  API.getOrderRemark(id).then(res => {
    if (res.status === 200) {
      orderRemarkList.value = res.data || [];
    } else {
      orderRemarkList.value = [];
    }
  })
}

const handleSendToPcc = (item) => {
  if (item?.order?.type_of_order !== 87) {
    toast.error("failed, not 087 order", { autoClose: 60000 });
    return false;
  }
  return OrderItem.send_to_pcc(item.id, {}).then((res) => {
    toast.success("send is queued", {
      position: "bottom-center"
    });
  }).catch((error) => {
    toast.error(error?.response?.data?.detail || "Get Detail Error.", { autoClose: 60000 });
  });
}

const handleCodeChange = (res) => {
  getDetailById(res.id)
  getOrderRemark(res.id)
  queryParams.value.page = 1;
  queryParams.value.values = [res.id];
  getOrderItemList();
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  getDetailById(route.query.id)
  getOrderRemark(route.query.id)
  queryParams.value.page = 1;
  queryParams.value.order_item_id = route.query.id;
  getOrderItemList();
}

</script>
<style scoped>

</style>
