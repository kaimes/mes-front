<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row>
        <v-col cols="2">
          <VueDatePicker @update:model-value="UpdateStartDate" :teleport="true" :enable-time-picker="false">
            <template #trigger>
              <v-text-field
                      v-model="queryParams.start_date"
                      label="Start Datetime"
                      readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="2">
          <VueDatePicker @update:model-value="UpdateEndDate" :teleport="true" :enable-time-picker="false">
            <template #trigger>
              <v-text-field
                    v-model="queryParams.end_date"
                    label="End Datetime"
                    readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none ml-4"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            Reset
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 my-1"
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
          height="630"
          show-current-page
          min-height="300"
          :headers="tableHeaders"
          :items="paginatedTableList"
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
import {formatDate} from "@/util/util";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Rolling Code", key: "rolling_code", value: (item) => item.rolling_code, sortable: false},
  { 
    title: "Start Datetime", 
    key: "start_datetime",  
    value: (item) => formatDate(item.start_datetime),
    sortable: false
  },
  { 
    title: "End Datetime", 
    key: "end_datetime",  
    value: (item) => formatDate(item.end_datetime),
    sortable: false
  },
  {title: "Runout From", key: "runout_from", sortable: false},
  {title: "Runout To ", key: "runout_to", sortable: false},
  {title: "No. Bars Rolled", key: "no_bars_rolled", sortable: false},
]);

const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    q: null,
    page: 1,
    itemsPerPage: 10,
    descending: [true],
    start_date: moment().subtract(10, 'years').format("YYYY-MM-DD"),
    end_date: moment().add(1, 'days').format("YYYY-MM-DD"),
  },
});

const {queryParams} = toRefs(data);
const UpdateStartDate = (res) => {
  if (res) {
    queryParams.value.start_date = moment(res).format("YYYY-MM-DD");
  }
}

const UpdateEndDate = (res) => {
  if (res) {
    queryParams.value.end_date = moment(res).format("YYYY-MM-DD");
  }
}
const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  console.log('Query Params:', params); // 添加调试信息
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
  console.log('Table Change:', {page, itemsPerPage, sortBy}); // 添加调试信息
};

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
};

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
};

const paginatedTableList = computed(() => {
  const start = (queryParams.value.page - 1) * queryParams.value.itemsPerPage;
  const end = start + queryParams.value.itemsPerPage;
  const paginatedList = tableList.value.slice(start, end);
  return paginatedList;
});

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
