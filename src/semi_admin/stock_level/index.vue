<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3" class="mt-4">
          <Site
              v-model="queryParams.site"
              :label="$t('semi_stock_level.site_code')"
              :hide-details="true"
          />
       </v-col>
        <v-col cols="3" class="mt-4">
          <Area
              v-model="queryParams.area_code"
              :label="$t('semi_stock_level.area_code')"
              :hide-details="true"
              :code="queryParams.site"
          />
        </v-col>
        <v-col cols="3">
          <CastCode
              v-model="queryParams.cast_code"
              :label="$t('semi_stock_level.cast_code')"
              :hide-details="true"
          />
        </v-col>
        <v-col cols="3" class="mt-4">
          <BarType
              v-model="queryParams.bartype"
              :label="$t('semi_stock_level.type')"
              :hide-details="true"
          />
        </v-col>
        <v-col cols="9">
          <v-btn
              class="text-none"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            {{$t('global.reset')}}
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
              :loading="loading"
              @click="handleSearch"
          >
            {{$t('global.search')}}
          </v-btn>
          <v-btn
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
              @click="handlePrint"
          >
            {{$t('global.print')}}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
        fixed-header
        height="650"
        show-current-page
        min-height="300"
        :headers="tableHeaders"
        :items="tableList"
        :loading="loading"
        item-value="id"
        v-model:page="queryParams.page"
        :items-length="total"
        :items-per-page="queryParams.itemsPerPage"
        @update:options="handleTableChange"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script name="SpecImpact" setup>
import { useRoute } from "vue-router";
import { getCurrentInstance, reactive, ref, toRaw, toRefs, onMounted, computed} from "vue";
import useCommonStore from "@/app/common";
import CastCode from "@/components/picker/CastCode.vue";
import API from "./api.js";
import Site from "./components/Site.vue";
import BarType from "./components/BarType.vue";
import printJS from "print-js";
import Area from "./components/AreaCode.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const commonStore = useCommonStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const loading = ref(false);

const formatToTons = (value) => {
  if (value !== null && value !== undefined) {
    // Round to two decimal places and remove trailing zeros
    return parseFloat((value / 1000).toFixed(2)).toString();
  }
  return '';
};

const tableHeadersDefinition = ref([
  { title: "semi_stock_level.table.cast_code", key: "cast_code", sortable: false },
  { title: "semi_stock_level.table.site", key: "site_code", sortable: false },
  { title: "semi_stock_level.table.area", key: "area_code", sortable: false },
  {
    title: "semi_stock_level.table.weight",
    key: "weight",
    sortable: false,
    value: (item) => formatToTons(item.weight)
  },
  {
    title: "semi_stock_level.table.weight_bloom",
    key: "weight_per_bloom",
    sortable: false,
    value: (item) => formatToTons(item.weight_per_bloom)
  },
  { title: "semi_stock_level.table.length", key: "length_mm", sortable: false },
  { title: "semi_stock_level.table.quantity", key: "quantity", sortable: false },
  { title: "semi_stock_level.table.good_blms", key: "good_blms", sortable: false },
  { title: "semi_stock_level.table.defect_blms", key: "defect_blms", sortable: false },
  { title: "semi_stock_level.table.type", key: "bartype", sortable: false },
  { title: "semi_stock_level.table.quality_code", key: "quality_code", sortable: false },
  { title: "semi_stock_level.table.semi_size", key: "semi_size", sortable: false }
]);

const printFields = ref([
  { displayName: "Cast Code", field: "cast_code" },
  { displayName: "Site", field: "site_code" },
  { displayName: "Area", field: "area_code" },
  { displayName: "Weight(tons)", field: "weight" },
  { displayName: "Good Blms", field: "good_blms" },
  { displayName: "Defect Blms", field: "defect_blms" },
  { displayName: "Length(mm)", field: "length_mm" },
  { displayName: "Weight/Bloom(Ton)", field: "weight_per_bloom" },
  { displayName: "Bartype", field: "bartype" },
  { displayName: "Quality Code", field: "quality_code" },
  { displayName: "Semi Size", field: "semi_size" },
]);
const tableHeaders = computed(() => {
    return tableHeadersDefinition.value.map(header => ({
      ...header,
      title: header.title.includes('.') ? t(header.title) : header.title
    }));
  });

const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    q: null,
    spec_code: commonStore.spec.id,
    to_area_id: null,
    site: null,
    cast_code: null,
    bartype: null,
    source: null,
    page: 1, 
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
});

const { queryParams, form } = toRefs(data);

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

onMounted(() => {
  getData();
});

const handlePrint = () => {
  const print_value = (tableList.value || []).map(item => ({
    ...item,
    site_code: item?.area?.site?.code || "",
    area_code: item?.area?.code || "",
    weight: formatToTons(item.weight),
    weight_per_bloom: formatToTons(item.weight_per_bloom)
  }));

  printJS({
    printable: toRaw(print_value),
    properties: printFields.value,
    type: "json",
    header: "Stock Level",
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表格体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
};

const handleSearch = () => {
  getData();
};

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
};

const handleTableChange = (options) => {
  queryParams.value.page = options.page;
  queryParams.value.itemsPerPage = options.itemsPerPage;
  queryParams.value.sortBy = options.sortBy;
  getData();
};
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
      }
}
}
</style>