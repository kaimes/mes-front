<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col v-show="handleFieldShow('plant_id')" cols="2">
          <MillCode
              v-model="searchOptions.plant_id"
              label="Mill"
              :hide-details="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('rolling_code')" cols="2">
          <RollingCode v-model="searchOptions.rolling_code"></RollingCode>
        </v-col>
        <v-col v-show="handleFieldShow('order_code')" cols="4">
          <OrderCascadeCode v-model="searchOptions.order_code" variant="underlined" density="default"
                            hide-details></OrderCascadeCode>
        </v-col>
        <v-col v-show="handleFieldShow('order_item_id')" cols="2">
          <OrderItemCode v-model="searchOptions.order_item_id" variant="underlined" :hide-details="true"
                         label="Order Item"
                         :order_id="searchOptions.order_code"/>
        </v-col>
        <v-col v-show="handleFieldShow('sap_line_item_code')" cols="2">
          <v-text-field
              v-model="searchOptions.sap_line_item_code"
              label="Sap Line item Number"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('business_order_code')" cols="2">
          <v-text-field
              v-model="searchOptions.business_order_code"
              label="Business Order Number"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('completion_status')" cols="2">
          <DictCode
              v-model="searchOptions.completion_status"
              label="Completion Status"
              code="completion_status"
              :hide-details="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('product_type_id')" cols="2">
          <ProductTypeCode v-model="searchOptions.product_type_id" variant="underlined" :hide-details="true"
                           label="Product Type"/>
        </v-col>
        <v-col v-show="handleFieldShow('dim3')" cols="2">
          <v-text-field
              v-model="searchOptions.dim3"
              label="KGM(Dim3)"
              hide-details
              clearable
          ></v-text-field>

        </v-col>
        <v-col v-show="handleFieldShow('start_date')" cols="2">
          <VueDatePicker
              @update:model-value="formatDateValue"
              position="left"
              :range="{ partialRange: false }"
              :enable-time-picker="false"
              :teleport="true"
          >
            <template #trigger>
              <v-text-field
                  :model-value="searchOptions.start_date ? `${searchOptions.start_date}~${searchOptions.end_date}` : ''"
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
        <v-col v-show="handleFieldShow('late_arrival')" cols="2">
          <v-text-field
              v-model="searchOptions.late_arrival"
              label="Late Arrival"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('amend_status')" cols="2">
          <DictCode
              v-model="searchOptions.amend_status"
              label="Amend Status"
              code="amend_status"
              :hide-details="true"
          />
        </v-col>
        <v-col>
          <div class="d-flex align-center ga-2 justify-end">
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
              {{ $t('global.reset') }}
            </v-btn>
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading">
              {{ $t('global.search') }}
            </v-btn>
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                @click="handlePrint"
                v-permission="`Print`"
            >
              {{ $t('global.print') }}
            </v-btn>
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                :disabled="isMoveDisabled"
                @click="handleMove"
                v-permission="`Move`"
            >
              Move Rolling
            </v-btn>
            <v-btn
                variant="text"
                icon="mdi-menu"
                size="sm"
                @click="handleOpen"
            />
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4 pa-3" elevation="0" variant="outlined">
      <v-data-table-server
          height="650"
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          v-model="selected"
          show-select
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          fixed-header
          item-value="id"
          show-current-page
          return-object
          @update:options="handleTableChange"
      >
        <template v-slot:item.rolling.rolling_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'RollingDetail', query: { id: item.rolling?.id } }">
            <span class="w-100 d-inline-block">{{ item.rolling?.rolling_code }}</span>
          </router-link>
        </template>

        <template v-slot:item.status="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
              {{ tag.name }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <!-- <v-btn
              variant="text"
              icon="mdi-pencil"
              @click="handleEdit(item)"
          /> -->
          <router-link class="text-decoration-none grey-darken-4 mr-2"
                       :to="{ path: '/order_item/detail', query: { id: item.id } }">
            <v-icon size="small">mdi-file-document-outline</v-icon>
          </router-link>


          <v-dialog
              max-width="400"
              persistent
          >
            <!-- <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  variant="text"
                  icon="mdi-delete"
                  v-bind="activatorProps"
              />
            </template> -->
            <template v-slot:default="{ isActive }">
              <v-card
                  prepend-icon="mdi-help-circle-outline"
                  text="Deletion is irreversible"
                  title="Confirm to delete data?"
              >
                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="text-none"
                      color="#e3e3e3"
                      variant="flat"
                      @click="isActive.value = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleDelete(isActive, item)"
                  >
                    Confirm
                  </v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <MesTable ref="tableRef" name="OrderItems" v-model="tableHeaders"/>
    <Move ref="moveFormRef" @refresh="handleSearch"/>
  </v-container>
</template>
<script setup>
import {useRoute} from "vue-router";
import {formatDate} from '@/util/util';
import {getCurrentInstance, reactive, ref, toRaw, toRefs, computed} from "vue";
import {toast} from "vue3-toastify";
import { useI18n } from "vue-i18n";
import moment from "moment/moment";
import {cloneDeep, isEmpty} from "lodash"
import RollingCode from "@/components/picker/RollingCode.vue";
import useSearchFieldVisibility from "@/hooks/useSearchFieldVisibility";
import OrderCascadeCode from "@/components/picker/OrderCascadeCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import MesTable from "@/components/table/index.vue";
import Move from "./components/MoveAction.vue";
import API from "./api";
import useFooterEvent from "@/hooks/useFooterEvent";

const route = useRoute();
const { t } = useI18n()
const {proxy} = getCurrentInstance();
const loading = ref(false);

// 搜索字段定义
const fields = ["plant_id", "rolling_code", "order_code", "order_item_id", "sap_line_item_code", "business_order_code", "completion_status", "product_type_id", "dim3", "start_date", "late_arrival", "amend_status"];
const searchFields = ref([...fields]);

const {handleFieldShow} = useSearchFieldVisibility(searchFields)

const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", minWidth: 60, sortable: false, fixed: true, align: "center"},
  {title: "order_items.table.group_code", key: "order_group.group_code", sortable: true},
  {title: "Mill Code", key: "plant.code", sortable: true},
  {title: "Order Number", key: "order.order_code", sortable: true},
  {title: "ERP Order", key: "order.sap_order_code", sortable: true},  // sap order
  {title: "Business Order Number", key: "order.business_order_code", minWidth: 150, sortable: true},
  {title: "Line Item Number", key: "line_item_code", sortable: true, minWidth: 150},
  {title: "Line Item Seq", key: "line_item_seq", minWidth: 150, sortable: true},
  {title: "Line Item Desc", key: "line_item_desc", minWidth: 150, sortable: true},
  {title: "Product Code", key: "product_code", sortable: true},
  {title: "Spec Code", key: "spec_code", sortable: true},
  {title: "Spec Short Name", key: "spec_short_name", minWidth: 150, sortable: true},
  {title: "Customer Spec Code", key: "customer_spec_code", minWidth: 150, sortable: true},
  {title: "Quality Code", key: "quality_code", sortable: true},
  {title: "Ordered Bars", key: "quantity", sortable: true,},
  {title: "Tip Bars", key: "advice_tip_bars", sortable: true,},
  {title: "Returned Bars", key: "returned_bars", sortable: true,},
  {title: "Stocked Quantity", key: "stocked_quantity", sortable: true,},
  {title: "Weight(kg)", key: "tonnage", sortable: true},
  {title: "Tonnage Tolerance Min Percent", key: "tonnage_tolerance_min_percent", minWidth: 180, sortable: true},
  {title: "Tonnage Tolerance Max Percent", key: "tonnage_tolerance_max_percent", minWidth: 180, sortable: true},
  {title: "Length(mm)", key: "length_mm", sortable: true},
  {title: "KGM(Dim1)", key: "product_dim1", sortable: true},
  {title: "KGM(Dim2)", key: "product_dim2", sortable: true},
  {title: "KGM(Dim3)", key: "product_dim3", sortable: true},
  {title: "KGM(Dim4)", key: "product_dim4", sortable: true},
  {title: "Dim Unit", key: "product_dim_unit", sortable: true},
  {title: "Outside Inspection Required", key: "outside_inspection_required", minWidth: 180, sortable: true},
  {title: "Transport Type", key: "transport_type", sortable: true},
  {title: "Destination Port", key: "destination_port", sortable: true},
  {title: "Loading Port", key: "loading_port", sortable: true},
  {title: "Clear Remark Type", key: "clear_remark_type", minWidth: 150, sortable: true},
  {title: "Clear Remark Sequence", key: "clear_remark_sequence", minWidth: 150, sortable: true},
  {title: "Clear Remark", key: "clear_remark", sortable: true},
  {title: "General Remark 1", key: "general_remark_1", minWidth: 150, sortable: true},
  {title: "General Remark 2", key: "general_remark_2", minWidth: 150, sortable: true},
  {title: "General Remark 3", key: "general_remark_3", minWidth: 150, sortable: true},
  {title: "General Remark 4", key: "general_remark_4", minWidth: 150, sortable: true},
  {title: "General Remark 1", key: "processing_remark_1", minWidth: 150, sortable: true},
  {title: "General Remark 2", key: "processing_remark_2", minWidth: 150, sortable: true},
  {title: "General Remark 3", key: "processing_remark_3", minWidth: 150, sortable: true},
  {title: "General Remark 4", key: "processing_remark_4", minWidth: 150, sortable: true},
  {title: "General Remark 5", key: "processing_remark_5", minWidth: 150, sortable: true},
  {title: "Delivery Date", key: "delivery_date", sortable: true},
  {title: "Caster", key: "caster", sortable: true},
  {title: "Surface Grade", key: "surface_grade", sortable: true},
  {title: "Coating Type", key: "coating_type", sortable: true},
  {title: "Cut Margin Min", key: "cut_margin_min", minWidth: 150, sortable: true},
  {title: "Cut Margin Max", key: "cut_margin_max", minWidth: 150, sortable: true},
  {title: "Color Code", key: "color_code", sortable: true},
  {title: "Carbon Min", key: "carbon_min", sortable: true},
  {title: "Carbon Max", key: "carbon_max", sortable: true},
  {title: "Manganese Range Min", key: "manganese_range_min", minWidth: 150, sortable: true},
  {title: "Manganese Range Max", key: "manganese_range_max", minWidth: 150, sortable: true},
  {title: "Secondary Length Min", key: "secondary_length_1_min", minWidth: 150, sortable: true},
  {title: "Secondary Length Max", key: "secondary_length_1_max", minWidth: 150, sortable: true},
  {title: "Section Width Min", key: "section_width_min", minWidth: 150, sortable: true},
  {title: "Section Width Max", key: "section_width_max", minWidth: 150, sortable: true},
  {title: "Section Width Max", key: "section_width_max", minWidth: 150, sortable: true},
  {title: "Section Thickness Min", key: "section_thickness_min", minWidth: 150, sortable: true},
  {title: "Section Thickness Max", key: "section_thickness_max", minWidth: 150, sortable: true},
  {title: "Inspector Code 1", key: "inspector_code_1", sortable: true},
  {title: "Inspector Code 2", key: "inspector_code_2", sortable: true},
  {title: "Inspector Code 3", key: "inspector_code_3", sortable: true},
  {title: "Label Data", key: "label_data", sortable: true},
  {title: "Search Vector", key: "search_vector", sortable: true},
  {title: "Product Form", key: "product_form", sortable: true},
  {title: "Product Form Type", key: "product_form_type", minWidth: 150, sortable: true},
  {title: "Rolling Code", key: "rolling.rolling_code", sortable: true},
  {title: "Rolling Date", key: "rolling.programmed_start_date", sortable: true},
  {title: "Customer", key: "order.customer_short_name", sortable: true},
  {title: "Category", key: "order.order_category", sortable: true},
  {title: "Allocated Bars", key: "allocate_bars", sortable: true},
  {title: "Quantity PC", key: "quantity_pc", sortable: true},
  {title: "Quantity Tonnage", key: "quantity_tonnage", sortable: true},
  {title: "length 1(MM)", key: "length_1_mm", sortable: true},
  {title: "length 2(MM)", key: "length_2_mm", sortable: true},
  {title: "length Feet", key: "length_feet", sortable: true},
  {title: "length Inch", key: "length_inch", sortable: true},
  {title: "Astm Dim1", key: "astm_dim1", sortable: true},
  {title: "Astm Dim2", key: "astm_dim2", sortable: true},
  {title: "Astm Dim3", key: "astm_dim3", sortable: true},
  {title: "Sales Order Unit", key: "sales_order_unit", minWidth: 150, sortable: true},
  {title: "Semi Width", key: "semi_width", sortable: true},
  {title: "Semi Thickness", key: "semi_thickness", sortable: true},
  {title: "Prime Type", key: "prime_type", sortable: true},
  {title: "Im Type", key: "im_type", sortable: true},
  {title: "Weight Per Pc", key: "weight_per_pc", sortable: true},
  {title: "Secondary Length Min", key: "secondary_length_2_min", minWidth: 150, sortable: true},
  {title: "Secondary Length Max", key: "secondary_length_2_max", minWidth: 150, sortable: true},
  {title: "Secondary Length Volume", key: "secondary_length_volume", minWidth: 150, sortable: true},
  {title: "Rejection", key: "rejection", sortable: true},
  {title: "Rejection Desc", key: "rejection_desc", sortable: true},
  {title: "Sap Line Item No", key: "sap_line_item_code", minWidth: 180, sortable: true},
  {title: "condition Record Per Unit", key: "condition_record_per_unit", minWidth: 180, sortable: true},
  {title: "General Remark", key: "general_remark_6", sortable: false},
  {title: "Marking Requirements", key: "marking_requirements", minWidth: 150, sortable: false},
  {title: "Amended Quantity", key: "amended_quantity", sortable: false},
  {title: "Qual Prefix", key: "qual_prefix", sortable: false},
  {title: "Qual Suffix", key: "qual_suffix", sortable: false},
  {title: "Shorts Min", key: "shorts_min", sortable: false},
  {title: "Shorts Max", key: "shorts_max", sortable: false},
  {title: "Cover Order Weight", key: "cover_order_weight", minWidth: 150, sortable: false},
  {title: "Cover Order No1", key: "cover_order_no1", minWidth: 150, sortable: false},
  {title: "Cover Order No2", key: "cover_order_no2", minWidth: 150, sortable: false},
  {title: "Cut Margin Unit", key: "cut_margin_unit", minWidth: 150, sortable: false},
  {title: "Consignment Code", key: "consignment_code", sortable: false},
  {title: "Mill Comment", key: "mill_comment", sortable: true},
  {title: "Lr Ind", key: "lr_ind", sortable: true},
  {title: "Voyage No", key: "v_voyage_no", sortable: true},
  {title: "Port Of Loading", key: "v_port_of_loading", minWidth: 120, sortable: true},
  {title: "Port Of Destination", key: "v_port_of_destination", minWidth: 150, sortable: true},
  {title: "Sr Voyage No", key: "sr_voyage_no", minWidth: 150, sortable: true},
  {title: "Sr Port Of Loading", key: "sr_port_of_loading", minWidth: 150, sortable: true},
  {title: "Sr Port Of Destination", key: "sr_port_of_destination", minWidth: 150, sortable: true},
  {title: "Sp Voyage No", key: "sp_voyage_no", minWidth: 150, sortable: true},
  {title: "Sp Port Of Loading", key: "sp_port_of_loading", minWidth: 150, sortable: true},
  {title: "Sp Port Of Destination", key: "sp_port_of_destination", minWidth: 150, sortable: true},
  {title: "Bws Store", key: "bws_store", sortable: true},
  {title: "Product Code Trans Code", key: "product_code_trans_code", minWidth: 150, sortable: true},
  {title: "Completion Status", key: "completion_status", sortable: false},
  {title: "Late Arrival", key: "late_arrival", sortable: true,},
  {title: "Despatched Bars", key: "despatched_bars", sortable: false},
  {title: "Loaded Bars", key: "advice_bars", sortable: false},
  {title: "Amend Status", key: "amend_status", sortable: false},
  {title: "Created at", key: "created_at", value: (item) => formatDate(item.created_at), sortable: true, minWidth: 150},
]);

const tableHeaders = computed(() => {
  return tableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const tableList = ref([]);
const selected = ref([])
const total = ref(0);

const data = reactive({
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true]
  },
  search: {
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
  rolling_no: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true]
  },
  tables: {
    order_code: undefined,
    rolling_code: undefined,
    plant_id: undefined
  },
  searchOptions: {
    dim3: undefined,
    completion_status: null,
    product_type_id: null,
    order_code: undefined,
    order_item_id: undefined,
    sap_order_code: undefined,
    business_order_code: undefined,
    sap_line_item_code: undefined,
    rolling_code: undefined,
    plant_id: undefined,
    late_arrival: null,
    amend_status: null,
    start_date: null,
    end_date: null,
  },
});

const {queryParams, search, tables, rolling_no, searchOptions} = toRefs(data);

const getData = () => {
  const params = cloneDeep({
    ...toRaw(queryParams.value)
  });
  console.log(params);
  loading.value = true;

  const searchOpts = toRaw(searchOptions.value); // 获取searchOptions

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


  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items.map(item => ({
        ...item,
        mill_code: item?.plant?.code || "",                // item?.order?.plant?.code会无法显示数据
        order_code: item?.order?.order_code || "",
        line_item_code: item?.line_item_code || "",
        rolling_code: item?.rolling?.rolling_code || "",
        customer_short_name: item?.order?.customer_short_name || "",
        order_category: item?.order?.order_category || "",
        product_dim3: item?.product_dim3 || "",
        quality_code: item?.quality_code || "",
        length_mm: item?.length_mm || "",
        quantity: item?.quantity || "",
        allocate_bars: item?.allocate_bars || 0,
        finished_bars: item?.finished_bars || 0,
        completion_status: item?.completion_status || "",
        // late_arrival: item?.late_arrival || "",
        tonnage: Math.round(item.tonnage * 1000),
        rolling_bars: item?.rolling_bars || 0,
        despatched_bars: item?.despatched_bars || 0,
        amended_quantity: item?.amended_quantity ? item?.amended_quantity : item?.quantity,
        advice_bars: item?.advice_bars || 0,
        advice_tip_bars: item?.advice_tip_bars || 0,
        returned_bars: item?.returned_bars || 0,
        mill_comment: item?.mill_comment || "",
        created_at: formatDate(item?.created_at) || "",
        late_arrival: item?.late_arrival || "",
      }))
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handleSearch = () => {
  queryParams.value.page = 1;
  selected.value = []
  getData();
}

const handleMove = () => {
  const items = toRaw(selected.value);
  proxy.$refs["moveFormRef"].handleShow(items);
}

const isMoveDisabled = computed(() => {
  if (selected.value.length === 0) return true;
  if (selected.value.length === 1) return false;
  const rollingCodes = selected.value.map(item => item.rolling?.rolling_code);
  return new Set(rollingCodes).size > 1;
});


const handleReset = () => {
  proxy.$refs["searchForm"].reset();

  searchOptions.value.late_arrival = null;
  searchOptions.value.completion_status = null;
  searchOptions.value.product_type_id = null;
  searchOptions.value.order_code = undefined;
  searchOptions.value.rolling_code = undefined;
  searchOptions.value.plant_id = undefined;
  selected.value = []

  getData();
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}


const handlePrint = () => {
  proxy.$print("Order Items", toRaw(tableHeaders.value), toRaw(tableList.value));
}

const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (!isEmpty(sortBy)) {
    queryParams.value.sortBy = sortBy;
  }
  getData();
}


const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.delete(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getData();
  }).catch(() => {
    toast.error("Delete Fail", {autoClose: 60000});
  });
}

const handleEdit = () => {

}

const getRollingCode = () => {
  const query = toRaw(rolling_no.value);
  const tables_no = toRaw(tables.value);
  query.q = tables_no.rolling_code;

  API.getRolling(query).then(res => {
    if (res.status === 200) {
      tables_no.rolling_code = res.data.items[0].id;
      handleSearch();
    }

  })
}

if (route.query.code) {
  data.tables.rolling_code = route.query.code;
  getRollingCode();

}

const formatDateValue = (res) => {
  if (res && res.length === 2) {
    searchOptions.value.start_date = moment(res[0]).format("YYYY-MM-DD");
    searchOptions.value.end_date = moment(res[1]).format("YYYY-MM-DD");
  } else {
    searchOptions.value.start_date = undefined;
    searchOptions.value.end_date = undefined;
  }
}

useFooterEvent('OrderItems', {
  fields,
  column: tableHeaders,
  columnRef: tableHeaders,
  queryFields: searchFields,
  queryParams: searchOptions,
})
</script>
<style lang="scss" scoped></style>
