<template>
  <div class="panel border mt-4">
    <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.covered_products') }}</div>
    <v-data-table-server
        fixed-header
        show-current-page
        min-height="300"
        :items-per-page="10"
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
  </div>
</template>
<script setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs, computed} from "vue";
import API from "../api";
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  }
})

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeadersDefinition = ref([
  { title: "test_list.detail.finished_product_code", key: "finished_product.code", sortable: false },
  { title: "test_list.detail.test_code", key: "test.test_code", sortable: false },
  { title: "test_list.detail.covered_weight_kg", key: "covered_weight_kg", sortable: false },
  { title: "test_list.detail.covered_quantity", key: "covered_quantity", sortable: false },
  { title: "test_list.detail.cast", key: "finished_product.cast.cast_code", sortable: false },
  { title: "test_list.detail.type", key: "test.type", sortable: false },
  { title: "test_list.detail.temp", key: "temp", sortable: false },
  { title: "test_list.detail.nominated_time", key: "created_at", sortable: false },
  { title: "test_list.detail.test_result", key: "result", sortable: false },
]);
const tableList = ref([]);
const total = ref(0);

const tableHeaders = computed(() => {
  return tableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const data = reactive({
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
});

const {queryParams, form} = toRefs(data);

const getData = () => {
  if (!props.id) {
    return;
  }
  const params = {
    ...toRaw(queryParams.value)
  };
  params["fields"] = ["test_id"];
  params["ops"] = ["=="];
  params["values"] = [props.id];
  loading.value = true;
  API.getTestCoverageList(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = (res.data.items || []).map(item => {
        let result = "not passed";
        // Map result based on test type
        switch (item.test?.type) {
          case "tensile":
            result = item.finished_product?.t_result === 8 || item.finished_product?.t_result === 9 ? "pass" : "not passed";
            break;
          case "impact":
            result = item.finished_product?.c_result === 8 || item.finished_product?.c_result === 9 ? "pass" : "not passed";
            break;
          case "througth_thickness":
            result = item.finished_product?.tt_result === 8 || item.finished_product?.tt_result === 9 ? "pass" : "not passed";
            break;
          case "chemical":
            result = item.finished_product?.pa_result === 8 || item.finished_product?.pa_result === 9 ? "pass" : "not passed";
            break;
          case "bend":
            result = item.finished_product?.bend_result === 8 || item.finished_product?.bend_result === 9 ? "pass" : "not passed";
            break;
          default:
            result = "not applicable";
            break;
        }
        return {
          ...item,
          result,
        };
      });
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

getData();
</script>
<style lang="scss" scoped></style>
