<template>
  <v-container class="page" fluid>
    <div class="text-subtitle-1 mb-4">Rolling No: {{ queryParams.rolling_no }}</div>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row>
        <v-col cols="4">
          <VueDatePicker @update:model-value="formatDate" range>
            <template #trigger>
              <v-text-field
                  v-model="queryParams.date"
                  label="Date Range"
                  density="default"
                  variant="underlined"
                  placeholder="Please select date"
                  bg-color="white"
                  hide-details
                  clearable
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="4">
          <v-text-field
              v-model="queryParams.section_code"
              label="Section Code(KGM)"
              density="default"
              variant="underlined"
              placeholder="Please enter section code"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn
              class="text-none mr-4"
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
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table
          fixed-header
          show-current-page
          height="400"
          items-per-page="10"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          @update:options="handleTableChange"
      >
        <template v-slot:item.rolling_no="row">
          {{ row.item.rolling_no }}
          <router-link :to="{ name: 'RollingDetail', query: { id: '123124' } }">
            <v-btn variant="text" icon="mdi-file-document-arrow-right"></v-btn>
          </router-link>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script setup>
import {parseQuery, useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import moment from "moment/moment";

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Section Code (KGM)", fixed: true, minWidth: 200, key: "section_code"},
  {title: "Rolling No.", minWidth: 150, key: "rolling_no"},
  {title: "Last Block", minWidth: 150, key: "last_block"},
  {title: "Outstanding Tons", minWidth: 180, key: "outstanding_tons"},
  {title: "Status", key: "status"},
  {title: "Forecast Start Date", minWidth: 200, key: "forecast_start_date"},
  {title: "Programmed Date", minWidth: 180, key: "programmed_date"},
  {title: "Duration", key: "duration"},
  {title: "Programmed Total Tons", minWidth: 220, key: "programmed_total_tons"},
  {title: "Ordered Total Tons", minWidth: 200, key: "order_total_tons"},
]);
const tableList = ref([
  {
    section_code: "DF3434",
    rolling_no: "No.1123",
    last_block: "213",
    outstanding_tons: 45,
    status: "FECC",
    forecast_start_date: "2024-12-12",
    programmed_date: "2024-12-22",
    duration: 34,
    programmed_total_tons: 56,
    order_total_tons: 66,
  }
]);
const total = ref(10);

const data = reactive({
  queryParams: {
    rolling_no: undefined,
    date: undefined,
    section_code: undefined,
    page: 1,
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
  setTimeout(() => {
    loading.value = false;
  }, 3000)
}

const handleTableChange = ({ page, itemsPerPage }) => {
  queryParams.value.page = page;
  queryParams.value.rows = itemsPerPage;
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

// 进入页面根据ID获取数据详情
if (route.query.code) {
  console.log("*****", route.query.code)
  queryParams.value.rolling_no = route.query.code;
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