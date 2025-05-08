<template>
  <v-container fluid class="content">
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col v-show="handleFieldShow('q')" cols="6">
          <v-text-field
              v-model="queryParams.q"
              placeholder="Search By Code, Spec Code, Runout Code, Cast No, Product Type, UUID"
              hide-details
              clearable
              variant="underlined"
          />
        </v-col>
        <v-col v-show="handleFieldShow('change_type')" cols="2">
          <dict-code
              v-model="queryParams.change_type"
              hide-details
              variant="underlined"
              label="Action"
              bg-color="white"
              code="finished_product_history_action"
              multiple
              chips
              clearable
              :str_sort="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('from_allocation_status')" cols="2">
          <DictCode
              v-model="queryParams.from_allocation_status"
              label="From Allocated Status"
              code="allocation_status"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('to_allocation_status')" cols="2">
          <DictCode
              v-model="queryParams.to_allocation_status"
              label="To Allocated Status"
              code="allocation_status"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('start_date')" cols="4">
          <VueDatePicker
              v-model="dateRange"
              @update:model-value="formatDateValue"
              position="left"
              :range="{ partialRange: false }"
              :teleport="true"
          >
            <template #trigger>
              <v-text-field
                  :model-value="queryParams.start_date ? `${queryParams.start_date}~${queryParams.end_date}` : ''"
                  density="default"
                  label="Time Range"
                  bg-color="white"
                  placeholder="Please select date"
                  :hide-details="true"
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
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
                variant="text"
                icon="mdi-menu"
                size="sm"
                @click="handleOpen"
            />
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center">
        <template v-if="queryParams.show_total_fields">
          <div v-show="queryParams.show_total_fields" class="d-flex align-center mr-4">
            <span class="text-subtitle-2 font-weight-regular mr-2">Total Weight: </span>
            <span class="text-subtitle-1 font-weight-bold">{{ total_weight }}</span>
          </div>
          <div v-show="queryParams.show_total_fields" class="d-flex align-center">
            <span class="text-subtitle-2 font-weight-regular mr-2">Total Bars: </span>
            <span class="text-subtitle-1 font-weight-bold">{{ total_bars }}</span>
          </div>
        </template>
      </div>
      <v-data-table-server
          height="650"
          min-height="300"
          :headers="headers"
          :items="items"
          :items-length="total"
          :loading="loading"
          item-value="id"
          fixed-header
          show-current-page
          @update:page="handleTableChangePage"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"

      >
        <template v-slot:[`item.uuid`]="{ item }">
          <v-tooltip location="bottom" max-width="300px" :text="item.uuid">
            <template v-slot:activator="{ props }">
              <a class="uuid-clickable" v-bind="props" @click="copyUUID(item.uuid)">
                {{ item.uuid.length > 8 ? item.uuid.substring(0, 8) + '...' : item.uuid }}
              </a>
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </v-card>
    <MesTable ref="tableRef" name="finishedProductHistory" v-model="headers"/>
  </v-container>
</template>

<script setup>
import {ref, reactive, toRaw, getCurrentInstance, computed} from 'vue';
import {cloneDeep} from "lodash";
import {toast} from "vue3-toastify";
import moment from "moment";

import DictCode from "@/components/picker/DictCode.vue";
import MesTable from "@/components/table/index.vue";
import Api from '@/finished_product/finished_product_history/api';
import {formatDate} from '@/util/util'
import useSearchFieldVisibility from "@/hooks/useSearchFieldVisibility";
import useFooterEvent from "@/hooks/useFooterEvent";
import { useI18n } from 'vue-i18n';

const {proxy} = getCurrentInstance();
const { t } = useI18n();
const loading = ref(false);
const items = ref([]);
const total = ref(0);
const total_weight = ref(0);
const total_bars = ref(0);
// 搜索字段定义
const fields = ["q", "change_type", "from_allocation_status", "to_allocation_status", "start_date"];
const searchFields = ref([...fields]);

const {handleFieldShow} = useSearchFieldVisibility(searchFields)
// 时间处理 start
const $startTime = moment().subtract(10, 'years').startOf('day').add(6, 'hours');
const $endTime = moment().add(1, 'days').startOf('day').add(6, 'hours');
const dateRange = ref([$startTime, $endTime]);

const queryParams = reactive({
  q: undefined,
  page: 1,
  itemsPerPage: 10,
  sortBy: ['created_at'],
  descending: [true],
  start_date: $startTime.format("YYYY-MM-DD HH:mm:ss"),
  end_date: $endTime.format("YYYY-MM-DD HH:mm:ss"),
  change_type: null,
  fields: [],
  ops: [],
  values: [],
  from_allocation_status: null,
  to_allocation_status: null,
  show_total_fields: false
});

const headers = computed(() => [
  { title: t("finished_product_history.table.action"), key: "change_type", sortable: true },
  {
    title: t("finished_product_history.table.when"),
    key: "created_at",
    value: (item) => formatDate(item["created_at"]),
    sortable: true,
    minWidth: 180
  },
  { title: t("finished_product_history.table.who"), key: "created_by", sortable: true },
  { title: t("finished_product_history.table.code"), key: "code", sortable: true, minWidth: 150 },
  { title: t("finished_product_history.table.cast_code"), key: "cast_no", sortable: true, minWidth: 120 },
  { title: t("finished_product_history.table.spec_code"), key: "spec_code", sortable: true },
  { title: t("finished_product_history.table.rolling_code"), key: "rolling_code", sortable: true, minWidth: 140 },
  { title: t("finished_product_history.table.product_type"), key: "product_type", sortable: true, minWidth: 120 },
  { title: t("finished_product_history.table.order_no"), key: "order_num", sortable: true },
  { title: t("finished_product_history.table.order_item_number"), key: "order_item_num", minWidth: 150, sortable: true },
  { title: t("finished_product_history.table.sawn_by"), key: "sawn_by", sortable: true },
  { title: t("finished_product_history.table.kg"), key: "kg", sortable: true },
  { title: t("finished_product_history.table.length"), key: "length_mm", sortable: true },
  { title: t("finished_product_history.table.pass_tests"), key: "pass_tests", sortable: true },
  { title: t("finished_product_history.table.location"), key: "location", sortable: true },
  { title: t("finished_product_history.table.multed_with"), key: "multed_with", sortable: true },
  { title: t("finished_product_history.table.runout_code"), key: "runout_code", sortable: true },
  { title: t("finished_product_history.table.onward"), key: "onward", sortable: true },
  { title: t("finished_product_history.table.bundle"), key: "bundle", sortable: true },
  { title: t("finished_product_history.table.alt_spec"), key: "alt_spec", sortable: true },

  { title: t("finished_product_history.table.area_code"), key: "area_code", sortable: true },
  { title: t("finished_product_history.table.site_code"), key: "site_code", sortable: true },
  { title: t("finished_product_history.table.site_type_code"), key: "site_type_code", minWidth: 150, sortable: true },
  { title: t("finished_product_history.table.stock_type"), key: "stock_type", sortable: true },
  { title: t("finished_product_history.table.rework_status"), key: "rework_status", minWidth: 150, sortable: true },
  { title: t("finished_product_history.table.rework_operator_initial"), key: "rework_initial", minWidth: 180, sortable: true },
  {
    title: t("finished_product_history.table.rework_due_date"),
    key: "rework_due_date",
    value: (item) => formatDate(item["rework_due_date"], "YYYY-MM-DD"),
    minWidth: 180,
    sortable: true
  },
  {
    title: t("finished_product_history.table.rework_finish_date"),
    key: "rework_finish_date",
    value: (item) => formatDate(item["rework_finish_date"], "YYYY-MM-DD"),
    minWidth: 180,
    sortable: true
  },
  {
    title: t("finished_product_history.table.from_allocation_status"),
    minWidth: 180,
    key: "from_allocation_status",
    value: (item) => {
      if (item.from_allocation_status === "allocate") {
        return t("common.allocation_status.prime")
      } else if (item.from_allocation_status === "free_stock") {
        return t("common.allocation_status.free")
      } else if (item.from_allocation_status === "scrap") {
        return t("common.allocation_status.scrap")
      }
      return item.from_allocation_status
    },
    sortable: true
  },
  {
    title: t("finished_product_history.table.to_allocation_status"),
    minWidth: 180,
    key: "allocation_status",
    value: (item) => {
      if (item.allocation_status === "allocate") {
        return t("common.allocation_status.prime")
      } else if (item.allocation_status === "free_stock") {
        return t("common.allocation_status.free")
      } else if (item.allocation_status === "scrap") {
        return t("common.allocation_status.scrap")
      }
      return item.allocation_status
    },
    sortable: true
  },
  { title: t("finished_product_history.table.exist_flag"), key: "exist_flag", sortable: true },
  { title: t("finished_product_history.table.mult_code"), key: "mult_code", sortable: true },
  { title: t("finished_product_history.table.status_change_reason"), key: "status_change_reason", minWidth: 150, sortable: true },
  { title: t("finished_product_history.table.defect_reason"), key: "defect_reason", sortable: true },
  { title: t("finished_product_history.table.waste_length"), key: "waste_length", sortable: true },
  { title: t("finished_product_history.table.quantity"), key: "quantity", sortable: true },
  { title: t("finished_product_history.table.comment"), key: "comment", sortable: true },
  { title: t("finished_product_history.table.reserve_status"), key: "reserve_status", sortable: true },
  { title: t("finished_product_history.table.status"), key: "status", sortable: true },
  { title: t("finished_product_history.table.advice_no"), key: "advice_no", sortable: true },
  { title: t("finished_product_history.table.uuid"), key: "uuid", sortable: true }
])

const getAll = async () => {
  loading.value = true;
  total_weight.value = 0;
  total_bars.value = 0;
  queryParams.show_total_fields = false;
  const params = cloneDeep({
    ...toRaw(queryParams)
  });

  params.fields = []
  params.ops = []
  params.values = []

  let is_within_30_days = isWithin30Days(queryParams.start_date, queryParams.end_date);
  if (params.change_type === 'allocate' && is_within_30_days) {
    params.show_total_fields = true;
    queryParams.show_total_fields = true;
  }

  if (!params.q && !params.change_type) {
    params.descending = [true]
  }


  try {
    // console.log(params);
    const response = await Api.getAll(params);
    items.value = response.data.items;
    total.value = response.data.total;
    total_weight.value = response.data.total_weight;
    total_bars.value = response.data.total_bars;
  } catch (error) {
    toast.error('Failed to get data', {autoClose: 60000});
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatDateValue = (res) => {
  if (res && res.length === 2) {
    queryParams.start_date = moment(res[0]).format("YYYY-MM-DD HH:mm:ss");
    queryParams.end_date = moment(res[1]).format("YYYY-MM-DD HH:mm:ss");
  } else {
    queryParams.start_date = undefined;
    queryParams.end_date = undefined;
  }
}

const isWithin30Days = (start_date, end_date) => {
  const start = new Date(start_date);
  const end = new Date(end_date);

  const diffTime = Math.abs(end - start);

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 30;
}

const handleSearch = () => {
  queryParams.page = 1;
  queryParams.descending = [false];
  getAll();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  queryParams.page = 1;
  queryParams.descending = [false];
  getAll();
}


const handleTableChangePage = (page) => {
  queryParams.page = page;
  getAll();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  queryParams.itemsPerPage = itemsPerPage;
  getAll();
}

const handleTableChangeSortBy = (sortBy) => {
  queryParams.sortBy = sortBy;
  getAll();
}
const copyUUID = (uuid) => {
  navigator.clipboard.writeText(uuid).then(() => {
    toast.success(`copy uuid ${uuid} successful`, {
      position: "bottom-center"
    });
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

useFooterEvent('finishedProductHistory', {
  fields,
  column: headers,
  columnRef: headers,
  queryFields: searchFields,
  queryParams: queryParams,
})

getAll();
</script>

<style scoped>

.uuid-clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}

.uuid-clickable:hover {
  opacity: 0.8;
}

.uuid-clickable:active {
  opacity: 0.6;
}
</style>
