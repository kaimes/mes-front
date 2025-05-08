<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row>
        <v-col cols="2">
          <VueDatePicker @update:model-value="UpdateStartDate" :teleport="true" :enable-time-picker="false">
            <template #trigger>
              <v-text-field
                      v-model="queryParams.delivery_date"
                      label="Delivery Date"
                      readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none mt-3"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            Reset
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 mt-3"
              color="primary"
              variant="flat"
              :loading="loading"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          show-current-page
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          item-value="id"
          @update:options="handleTableChange"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <EditForm ref="editFormRef" @refresh="handleSearch" />
  </v-container>
</template>
<script setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs, computed } from "vue";
import API from "./api";
import moment from "moment";
import useCommonStore from "@/app/common";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Line Item Desc", key: "line_item_desc", value: (item) => item.line_item_desc, sortable: false},
  {title: "Product Code", key: "product_code", sortable: false},
  {title: "Caster", key: "caster", sortable: false},
  {title: "Spec Code", key: "spec_code", sortable: false},
  { 
    title: "Delivery Date", 
    key: "delivery_date",  
    value: (item) => {
      const date = moment(item.delivery_date);
      return date.isValid() ? date.format("YYYY-MM-DD") : '';
    },
    sortable: false
  },
  {title: "Total Quantity Tonnage", key: "total_quantity_tonnage", sortable: false},
]);

const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    q: null,
    page: 1,
    itemsPerPage: 10,
    descending: [true],
    delivery_date: moment().format("YYYY-MM-DD"),
  },
});

const {queryParams} = toRefs(data);
const UpdateStartDate = (res) => {
  if (res) {
    queryParams.value.delivery_date = moment(res).format("YYYY-MM-DD");
  }
}

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  loading.value = true;
  API.getAll(params).then(res => {
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
};

const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  getData();
};

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
};

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
};

getData();
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
