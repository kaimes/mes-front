<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col cols="4">
          <OrderCascadeCode v-model="queryParams.order_code" variant="underlined" density="default" :hide-details="false"></OrderCascadeCode>
        </v-col>
        <v-col cols="2">
          <OrderItemCode v-model="queryParams.order_item_code" variant="underlined" density="default" :hide-details="false" :disabled="!queryParams.order_code" :order_id="queryParams.order_code" @change="handleItemChange"></OrderItemCode>
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="searchOptions.allocation_status"
              label="Allocated Status"
              code="allocation_status"
              :hide-details="false"
          />
        </v-col>
        <v-col cols="4" class="ml-auto">
          <div class="d-flex ga-4 align-center  justify-end">
            <v-checkbox
                v-model="queryParams.rework"
                label="Rework"
                color="orange"
                hide-details
            ></v-checkbox>
            <v-btn
                class="text-none ml-2"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              {{ $t("global.reset") }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :disabled="!payload.id"
                :loading="loading"
                v-permission="`Search`"
            >
              {{ $t("global.search") }}
            </v-btn>
          </div>

        </v-col>
      </v-row>
    </v-form>
    <v-card v-if="payload.id" class="pa-4" elevation="0" variant="outlined">
      <v-row align="center">
        <v-col cols="3">
          <div class="text-body-1">Inspection Code: {{ payload.inspector_code_1 }}</div>
        </v-col>
        <v-col cols="3">
          <div class="text-body-1">Spec Code: {{ payload.spec_code }} - {{ payload.spec_short_name }}</div>
        </v-col>
        <v-col cols="3">
          <div class="text-body-1">Customer: {{ payload.order.customer_code }} - {{ payload.order.customer_short_name }}</div>
        </v-col>
        <v-col cols="3">
          <div class="text-body-1">Order Length: {{ payload.length_mm }}</div>
        </v-col>
        <v-col cols="3">
          <div class="text-body-1">Qty Order: {{ payload.order.business_order_code }}</div>
        </v-col>
        <v-col cols="3">
          <div class="text-body-1">Qty Stock: {{ payload.stocked_quantity }}</div>
        </v-col>
        <v-col cols="3">
          <div class="text-body-1">Qty Roll: {{ payload.rolling_code }}</div>
        </v-col>
        <v-col cols="3">
          <div class="text-body-1">
            Section Size:
            <span v-if="payload.product_type">
              {{ payload.product_type.code }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center gap4 mb-4">
        <v-btn
            class="text-none mr-4"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0 || !payload.id"
            @click="handleReserve(undefined)"
            v-permission="`Reserve`"
        >
          {{ $t("order_reserve.button.reserve") }}
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handlePrint"
            v-permission="`Print`"
        >
          {{ $t("global.print") }}
        </v-btn>
        <v-spacer />
        <v-btn
            variant="text"
            icon="mdi-menu"
            @click="handleOpen"
        />
      </div>
      <v-divider />
      <v-data-table-server
          v-model="selected"
          fixed-header
          height="650"
          min-height="300"
          :items-per-page="queryParams.itemsPerPage"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          item-selectable="selectable"
          show-select
          show-current-page
          return-object
          :search="search"
          @update:options="handleTableChange"
      >
        <template v-slot:item.data-table-select="{ internalItem, isSelected, toggleSelect }">
          <template v-if="internalItem.value.selectable">
            <v-checkbox-btn
              :model-value="isSelected(internalItem)"
              :disabled="!internalItem.value.selectable"
              @update:model-value="toggleSelect(internalItem)"
            ></v-checkbox-btn>
          </template>
          <template v-else>
            <template v-if="(internalItem.value.t_result <= 7 || internalItem.value.c_result <= 7)">
              <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-checkbox-btn
                    v-bind="activatorProps"
                    readonly
                  ></v-checkbox-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card title="Reserve Bar and create a Test Sample?">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        class="text-none"
                        color="#e3e3e3"
                        variant="flat"
                        @click="isActive.value = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn class="text-none" color="primary" variant="flat" @click="handleCutReserve(isActive, internalItem.value)">
                        Confirm
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </template>
            <template v-else>
              <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-checkbox-btn
                    v-bind="activatorProps"
                    readonly
                  ></v-checkbox-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card title="Sorry" subtitle="You Cannot Reserve This Bar">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        class="text-none"
                        color="#e3e3e3"
                        variant="flat"
                        @click="isActive.value = false"
                      >
                        {{ $t("global.cancel") }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </template>
          </template>
        </template>
        <template v-slot:item.compliance="{ item }">
          <template v-if="item.t_result < 7 || item.c_result < 7">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-chip v-bind="activatorProps" color="red">
                  {{ item.t_result || 0 }}{{ item.c_result || 0 }}
                </v-chip>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card title="Sorry" subtitle="You Cannot Reserve This Bar">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="text-none"
                        color="#e3e3e3"
                        variant="flat"
                        @click="isActive.value = false"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
          <template v-else-if="item.t_result>= 8 && item.c_test >= 8">
            <v-chip @click="handleReserve(item)" color="success">
              {{ item.t_result || 0 }}{{ item.c_result || 0 }}
            </v-chip>
          </template>
          <template v-else>
            <v-chip @click="handleReserve(item)" color="orange">
              {{ item.t_result || 0 }}{{ item.c_result || 0 }}
            </v-chip>
          </template>
        </template>
        <template v-slot:item.c_result="{ item }">
            <v-chip :class="{
                'green': item.c_result > 7,
                'yellow': item.c_result === 3 || item.c_result === 7,
                'red': item.c_result < 7 && item.c_result !== 3
              }">
            {{ item.c_result || 0 }}
          </v-chip>
        </template>
        <template v-slot:item.t_result="{ item }">
           <v-chip :class="{
                'green': item.t_result > 7,
                'yellow': item.t_result === 3 || item.t_result === 7,
                'red': item.t_result < 7 && item.t_result !== 3
              }">
            {{ item.t_result || 0 }}
          </v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <router-link class="text-decoration-none grey-darken-4 mr-2" :to="{ name: 'finishedProductDetail', query: { id: item.id } }">
            <v-icon small>mdi-file-document-outline</v-icon>
          </router-link>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <OrderReserve ref="reserveForm" @refresh="handleSearch" />
    <MesTable ref="tableRef" name="order_reserve"  v-model="tableHeaders" />
  </v-container>
</template>
<script name="orderReserve" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs,} from "vue";
import printJS from "print-js";
import {head, isObject} from "lodash";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderCascadeCode from "@/components/picker/OrderCascadeCode.vue";
import {toast} from "vue3-toastify";
import MesTable from "@/components/table/index.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import {formatDate} from "@/util/util";
import DictCode from "@/components/picker/DictCode.vue";
import OrderReserve from "./components/reserve.vue";
import API from "./api";
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const { t } = useI18n()

const tableHeaders = computed(() => [
  { title: t("order_reserve.table.action"), key: "action", minWidth: 50, fixed: true, sortable: true, align:"center" },
  { title: t("order_reserve.table.code"), key: "code", sortable: true },
  { title: t("order_reserve.table.length"), key: "length_mm", sortable: true },
  { title: t("order_reserve.table.t_cover"), key: "t_result", minWidth: 110, sortable: false },
  { title: t("order_reserve.table.c_cover"), key: "c_result", minWidth: 110, sortable: false },
  { 
    title: t("order_reserve.table.producttype_code"),
    key: "product_type.code",
    value: (item) => item.product_type?.code,
    sortable: true,
    minWidth: 160
  },
  {
    title: t("order_reserve.table.reserved_order_item"),
    key: "reserved_order_item.line_item_code",
    value: (item) => {
      return `${item.reserved_order_item?.order?.order_code || ''}-${item.reserved_order_item?.line_item_code || ''}`;
    },
    minWidth: 180,
    sortable: true
  },
  { title: t("order_reserve.table.reserve_status"), key: "reserve_status", sortable: true },
  { title: t("order_reserve.table.allocation_status"), key: "allocation_status", sortable: true },
  {
    title: t("order_reserve.table.spec_code"),
    key: "spec.spec_code",
    value: (item) => `${item.spec?.spec_code || ''} - ${item.spec?.short_name || ''}`,
    sortable: false
  },
  { title: t("order_reserve.table.area_code"), key: "area.code", sortable: false },
  { title: t("order_reserve.table.is_real"), key: "is_real", sortable: true },
  { title: t("order_reserve.table.defect"), key: "defect", sortable: true },
  { title: t("order_reserve.table.rework_type"), key: "rework_type", sortable: true },
  { title: t("order_reserve.table.rework_status"), key: "rework_status", sortable: true },
  { title: t("order_reserve.table.created_at"), key: "created_at", sortable: true },
])
const selected = ref([]);
const tableList = ref([]);
const total = ref(0);
const isSearchTriggered = ref(false); // 引入标志

const data = reactive({
  queryParams: {
    q: null,
    rework: false,
    order_code: undefined,
    order_item_code: undefined,
    rollingId: undefined,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  searchOptions: {
    allocation_status: "free_stock",
  },
  payload: {
    id: undefined,
    runout_code: undefined,
    cut_code: undefined,
    multi_ref: undefined,
    spec_code: undefined,
    customer_code: undefined,
    length_mm: undefined,
    waste_length: undefined,
    line_item_code: undefined,
    order_item_id: undefined,
  },
});

const { queryParams, searchOptions, payload, search } = toRefs(data);

const getData = () => {
  const params = {
    /// 很诡异 只能先这样处理
    ...JSON.parse(JSON.stringify(queryParams.value)),
  };
  if (params.rework) {
    params["ops"] = ["=="];
  }
  if (params.rework) {
    params["fields"].push("rework_status");
    params["values"].push("Rework");
    delete params.rework;
  }
  if (params.rollingId) {
    params["fields"].push("rolling_id");
    params.ops.push("in");
    params["values"].push(params.rollingId);
    delete params.rollingId;
  }
  if (searchOptions.value.allocation_status) {
    params.fields.push("allocation_status");
    params.ops.push("eq");
    params.values.push(searchOptions.value.allocation_status);
  }
if (payload.value.spec_code) {
    params.speccode = payload.value.spec_code;
    params.order_item = payload.value.id;
    params.order_length = payload.value.length_mm;
}
  if (params.sortBy) {
    const sortBy = head(params.sortBy);
    if (isObject(sortBy)) {
      if (sortBy.key === "t_result") {
        params.sortBy = ["t_result"];
        params.descending = [sortBy.order === "asc"];
      }
      if (sortBy.key === "c_result") {
        params.sortBy = ["c_result"];
        params.descending = [sortBy.order === "asc"];
      }
    }
  }

  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = (res.data.items || []).map(item => ({
        ...item,
        spec_code: item?.spec?.spec_code || "",
        area_code: item?.area?.code || "",
        length: item.length || "",
        t_result: item.t_result || "",
        c_result: item.c_result || "",
        is_real: item.is_real || "",
        defect: item.defect || "",
        rework_type: item.rework_type || "",
        rework_status: item.rework_status || "",
        created_at: formatDate(item.created_at),
        // t/c_result 为3/7 可以cut
        selectable: (item.t_result > 7) && (item.c_result > 7)

      }));
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
    isSearchTriggered.value = false; // 重置标志
  });
}

const handleItemChange = (item) => {
  payload.value = {
    ...toRaw(item),
  };
}

const handleSearch = () => {
    if (!payload.value.product_type) {
    toast.error("No product type found for the current search.", { autoClose: 60000 });
    return;
  }

  selected.value = [];
  queryParams.value.sortBy = ["t_result"];
  queryParams.value.descending = [true];
  queryParams.value.fields = [];
  queryParams.value.ops = [];
  queryParams.value.values = [];

  // 构建查询字符串
  const productTypeQuery = `${payload.value?.product_type?.id}`;
 if (payload.value.product_type) {
    queryParams.value.fields.push("product_type_id");
    queryParams.value.ops.push("eq");
    queryParams.value.values.push(productTypeQuery);
  }

  isSearchTriggered.value = true; // 设置标志
  getData();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  payload.value = {};
  queryParams.value.ops = [];
  queryParams.value.fields = [];
  queryParams.value.values = [];
  queryParams.value.page = 1; // 重置页码
  queryParams.value.itemsPerPage = 10; // 重置每页数量
  queryParams.value.sortBy = ["updated_at"]; // 重置排序
  queryParams.value.descending = [true]; // 重置排序方向
  searchOptions.value.allocation_status = "free_stock"; // 重置 allocation_status
  tableList.value = []; // 清空当前展示数据
  total.value = 0; // 清空总数
}

const handleTableChange = ({ page, itemsPerPage, sortBy }) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy.map(sort => {
      if (sort.key === 't_result') {
        return 'CoverEndUse.tensile_score';
      }
      if (sort.key === 'c_result') {
        return 'CoverEndUse.impact_score';
      }
      return sort.key;
    });
    queryParams.value.descending = sortBy.map(sort => sort.order === 'desc');
  }
  if (isSearchTriggered.value || tableList.value.length > 0) {
    isSearchTriggered.value = false; // 避免无限递归
    getData();
  }
};

const handleReserve = (item) => {
  const items = item ? [toRaw(item)] : toRaw(selected.value);
  proxy.$refs["reserveForm"].handleShow(items, payload.value.id);
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

const handleCut = (isActive, row) => {
  isActive.value = false;
  API.createTestSample({
    finished_ids: [row.id]
  }).then(() => {
    toast.success("Cut successfully.", {
      position: "bottom-center"
    })
    getData();
  }).catch(error => {
    toast.error(error?.response?.data?.detail || "Cut Fail", { autoClose: 60000 });
  });
}

const handleCutReserve = (isActive, row) => {
  isActive.value = false;
  API.reserve({
    list: [row.id],
    order_item_id: payload.value.id
  }).then(() => {
    toast.success("Reserve successfully.", {
      position: "bottom-center"
    });
    return API.createTestSample({
      finished_ids: [row.id]
    });
  }).then(() => {
    toast.success("Cut successfully.", {
      position: "bottom-center"
    });
    getData();
  }).catch(error => {
    const errorMessage = error?.response?.data?.detail || "Operation Fail";

    // 特定错误处理
    if (errorMessage.includes("Sample is already requested")) {
      toast.warning("Skip: Sample is already requested", {
        position: "bottom-center",
        transition: toast.TRANSITIONS.ZOOM,
        icon: '⚠️'
      });
    } else {
      toast.error(errorMessage, { autoClose: 60000 });
    }
  });
}

const handlePrint = () => {
  printJS({
    printable: toRaw(tableList.value),
    properties: printFields.value,
    type: "json",
    header: "Order Reserve",
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

// getData();
</script>
<style lang="scss" scoped>
</style>

   <style lang="scss" scoped>
   .green {
     background-color: rgba(134, 198, 43, 0.97) !important;
     color: white !important;
   }

   .red {
     background-color: #f62626 !important;
     color: #ffffff !important;
   }
   .yellow {
     background-color: rgba(209, 108, 36, 0.87) !important;
     color: #ffffff !important;
   }
   </style>
