<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <RollingCode v-model="queryParams.rolling_code" @change="handleItemChange($event, 'rolling_id')"></RollingCode>
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
        <v-col cols="6" class="text-end">
          <v-btn
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
              @click="handlePrint"
          >
            Print
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          show-current-page
          items-per-page="10"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :page="queryParams.page"
          :loading="loading"
          @update:options="handleTableChange"
      >

        <template v-slot:item.cast.cast_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                        :to="{ name: 'CastChemicalDetail', query: { id: item.cast?.id } }">
            <span class="w-100 d-inline-block">{{ item.cast?.cast_code }}</span>
          </router-link>
        </template>

        <template v-slot:item.rolling.rolling_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'RollingDetail', query: { id: item.rolling?.id } }">
            <span class="w-100 d-inline-block">{{ item.rolling?.rolling_code }}</span>
          </router-link>
        </template>

        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:item.action="row">
          <v-btn variant="text" icon="mdi-printer"></v-btn>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>
<script setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import moment from "moment/moment";
import printJS from "print-js";

import RollingCode from "@/components/picker/RollingCode.vue";
import API from "./api";
import XEUtils from "xe-utils";

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  { title: 'Cast No.', key: 'cast.cast_code', value: (item) => item.cast?.cast_code, sortable: false },
  { title: 'Semi No.', value: 'skelp_code', sortable: false },
  { title: 'Length(mm)', value: 'length_mm', sortable: true },
  { title: 'Width(mm)', value: 'width_mm', sortable: true },
  { title: 'Weight(kg)', value: 'estimated_weight_kg', sortable: true },
  { title: 'Current Allocated Rolling', key: 'rolling.rolling_code', value: (item) => item.rolling?.rolling_code, minWidth: 220, sortable: false },
  { title: 'Current Allocated Block', value: 'curren_allocated_block', minWidth: 220, sortable: false },
  { title: 'Area', value: 'area_code'},
  { title: 'Postion', value: 'location', sortable: false },
  { title: 'Order Group Seq', value: 'group_charge_seq', sortable: false },
  { title: 'Blocking Seq', value: 'semi_charge_seq', sortable: false },
]);
const printFields = ref([
  {displayName: "Cast No.", field: "cast_code"},
  {displayName: "Semi No.", field: "skelp_code"},
  {displayName: "Length(mm)", field: "length_mm"},
  {displayName: "Width(mm)", field: "width_mm"},
  {displayName: "Weight(kg)", field: "estimated_weight_kg"},
  {displayName: "Current Allocated Rolling", field: "curren_allocated_rolling"},
  {displayName: "Current Allocated Block", field: "curren_allocated_block"},
  {displayName: "Area", field: "area_code"},
  {displayName: "Postion", field: "location"},
  { displayName: 'Order Group Seq', field: 'group_charge_seq' },
  { displayName: 'Blocking Seq', field: 'semi_charge_seq' },
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    rolling_id: undefined,
    rolling_code: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  }
});

const {queryParams} = toRefs(data);

const formatDate = (res) => {
  if (res && res.length === 2) {
    const startDate = moment(res[0]).format("YYYY-MM-DD");
    const endDate = moment(res[1]).format("YYYY-MM-DD");
    queryParams.value.date = `${startDate}~${endDate}`;
  }
}

const getData = () => {
  const params = toRaw(queryParams.value);
  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      // 打印数据公用所以提前处理
      tableList.value = (res.data.items || []).map(item => ({
        ...item,
        area_code: item.area?.code || '',
        curren_allocated_block: item.order_group?.group_code,
        // curren_allocated_rolling: item.rolling?.rolling_code,
        // cast_code: item.cast?.cast_code,
        length_mm: item.length_mm,
        width_mm: item.width_mm,
        estimated_weight_kg: item.estimated_weight_kg,
        group_charge_seq: item.order_group?.group_charge_seq,
      }));
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  getData();
}

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  queryParams.value.date = [];
  handleSearch();
}

const handlePrint = () => {
  console.log('=-=-=-=-');
  console.log(toRaw(tableList.value));

  const print_value = (tableList.value || []).map(item => ({
    ...item,
    cast_code: item.cast?.cast_code,
    curren_allocated_rolling: item.rolling?.rolling_code,
  }));
  
  
  printJS({
    printable: toRaw(print_value),
    properties: printFields.value,
    type: "json",
    header: "Semi Charge List",
    repeatTableHeader: false, // 打印json表头只显示在第一页
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

const handleItemChange = (item, key) => {

  queryParams.value[`${key}`] = item?.id;
  console.log(queryParams.value[`${key}`])
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  queryParams.value.rolling_id = parseInt(route.query.id);
  getData();
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
