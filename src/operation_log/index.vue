<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
              v-model="queryParams.q"
              label="Search By Request Modular, Request Path, Request Ip"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none ml-4"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            {{ $t("global.reset") }}
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 my-1"
              color="primary"
              variant="flat"
              :loading="loading"
          >
            {{ $t("global.search") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
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
          item-value="id"
          @update:options="handleTableChange"
      >
        <template v-slot:item.request_body="{ item }">
          <read-more more-str="read more" less-str="read less" :text="item.request_body" :max-chars="80" />
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>
<script name="OperationLog" setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs, computed} from "vue";
import {formatDate} from "@/util/util";
import ReadMore from "@/components/readMore/index.vue";
import API from "./api";
import {useI18n} from "vue-i18n";

const {proxy} = getCurrentInstance();
const loading = ref(false);
const total = ref(0);

const data = reactive({
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["request_modular"],
    descending: [false],
  }
});
const tableHeaders = computed(() => [
  {title: proxy.$t('operation_log.table.request_modular'), value: 'request_modular', sortable: true},
  {title: proxy.$t('operation_log.table.request_path'), value: 'request_path', sortable: true},
  {title: proxy.$t('operation_log.table.request_body'), value: 'request_body', sortable: true, minWidth: 200, maxWidth: 300},
  {title: proxy.$t('operation_log.table.request_method'), value: 'request_method', sortable: true},
  {title: proxy.$t('operation_log.table.request_msg'), value: 'request_msg', sortable: true},
  {title: proxy.$t('operation_log.table.request_ip'), value: 'request_ip', sortable: true},
  {title: proxy.$t('operation_log.table.response_json_result'), value: 'response_json_result', sortable: true},
  {title: proxy.$t('operation_log.table.response_code'), value: 'response_code', sortable: true},
  {title: proxy.$t('operation_log.table.response_status'), value: 'response_status', sortable: true},
  {
    title: proxy.$t('operation_log.table.updated_at'),
    key: 'updated_at',
    value: (row) => formatDate(row.updated_at),
    minWidth: 180,
    sortable: true
  },
  {
    title: proxy.$t('operation_log.table.created_at'),
    key: 'created_at',
    value: (row) => formatDate(row.created_at),
    minWidth: 180,
    sortable: true
  },
  {
    title: proxy.$t('operation_log.table.updated_by'),
    value: 'updated_by',
    sortable: true
  },
]);
const tableList = ref([]);
const {queryParams, form} = toRefs(data);

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
  handleSearch();
}
</script>
<style lang="scss" scoped></style>
