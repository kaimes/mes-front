<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <v-text-field
              v-model="searchOptions.q"
              append-inner-icon="mdi-magnify"
              label="Search By Code"
              variant="underlined"
              bg-color="white"
              :hide-details="false"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="filterOptions.pilling_bogie"
              label="Pilling Bogie"
              code="finished_load_pilling_bogie"
              :hide-details="false"
              multiple
          />
        </v-col>
        <v-col cols="2">
          <OrderCode v-model="filterOptions.order_id" variant="underlined" :hide-details="false"
                     label="Order"></OrderCode>
        </v-col>

        <v-col cols="2">
          <OrderItemCode v-model="filterOptions.order_item_id" variant="underlined" :hide-details="false" label="Item"
                         :order_id="filterOptions.order_id"/>
        </v-col>
        <v-col cols="2">
          <RollingCode
              v-model="filterOptions.rolling_id"
              label="Rolling Code"
              variant="underlined"
              :hide-details="false"
              clearable
          />
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="filterOptions.finished_load_status"
              label="Load Status"
              code="finished_load_status"
              :hide-details="false"
              multiple
          />
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="filterOptions.transport_type"
              label="Transport Type"
              code="transport_type"
              :hide-details="false"
              multiple
          />
        </v-col>
        <v-col cols="2">
          <TransportCode
              v-model="filterOptions.transport_code"
              label="Transport No"
              @change="handleTransportCodeChange"
              :hint="getTransportHint(transport_length,transport_weight)"
              :hide-details="false"
          />
        </v-col>
        <v-col cols="2">
          <VueDatePicker @update:model-value="UpdateStartDate" :teleport="true" :enable-time-picker="false">
            <template #trigger>
              <v-text-field
                  v-model="searchOptions.start_date"
                  label="Start Date"
                  clearable
                  :hide-details="false"
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="2">
          <VueDatePicker @update:model-value="UpdateEndDate" :teleport="true" :enable-time-picker="false">
            <template #trigger>
              <v-text-field
                  v-model="searchOptions.end_date"
                  label="End Date"
                  clearable
                  :hide-details="false"
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="4">
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none"
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
                :loading="loading"
                v-permission="`Search`"
            >
              {{ $t("global.search") }}
            </v-btn>
            <v-spacer></v-spacer>
            <router-link to="/finished_product_load_detail">
              <v-btn
                  class="text-none"
                  color="primary"
                  variant="flat"
                  v-permission="`Create`"
              >
                {{ $t("global.new") }}
              </v-btn>
            </router-link>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <!-- <v-row align="center">
        <v-col cols="2"></v-col>
        <v-col cols="1">
          <v-text-field v-model="transport_weight" disabled density="default" variant="underlined"
                        placeholder="0" persistent-placeholder label="Max Weight(Tonnes)" :hide-details="false"
                        bg-color="white" clearable></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-text-field v-model="transport_length" disabled density="default" variant="underlined"
                        placeholder="0" persistent-placeholder label="Length(mm)" :hide-details="false"
                        bg-color="white" clearable></v-text-field>
        </v-col>
      </v-row> -->

    <v-card class="pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center ga-4">
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0 || selected.length > 1 ||selected.some(item => item.load_status === 'Tipped')"
            @click="handleMove"
            v-permission="`Move`"
        >
          {{ $t("load.button.move") }}
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0 || selected.some(item => item.load_status === 'Carry Out')"
            @click="handleCarryOut"
            v-permission="`Carry Out`"
        >
          {{ $t("load.button.carry_out") }}
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
      </div>
      <v-data-table-server
          fixed-header
          height="650"
          show-current-page
          :headers="headers"
          :items="serverItems"
          :items-length="total"
          :page="searchOptions.page"
          :items-per-page="searchOptions.itemsPerPage"
          :loading="loading"
          v-model="selected"
          show-select
          return-object
          item-value="id"
          @update:page="handleTableChangePage"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"
      >
        <template v-slot:item.cut_seq="{ item }">
          <span v-html="item.cut_seq"></span>
        </template>
        <template v-slot:item.rolling.rolling_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'RollingDetail', query: { id: item.rolling?.id } }">
            <span class="w-100 d-inline-block">{{ item.rolling?.rolling_code }}</span>
          </router-link>
        </template>
        <template v-slot:item.action="{ item }">
          <div class="d-flex align-center">
            <v-tooltip text="Consign" position="top">
              <template v-slot:activator="{ props }">
                <router-link v-bind="props"
                             :to="{ name: 'AdviceDetail', query: { load_id: item.id, transport_type: item.transport_type, transport_id: item.transport_id } }">
                  <v-btn :disabled="item.load_status == 'Carry Out'" variant="text" icon="mdi-bell-alert-outline"/>
                </router-link>
              </template>
            </v-tooltip>
            <v-tooltip text="Tip" position="top">
              <template v-slot:activator="{ props }">
                <v-btn @click="handleTip(item)" variant="text" icon="mdi-clock-edit-outline" v-bind="props"/>
              </template>
            </v-tooltip>
            <router-link
                class="text-decoration-none grey-darken-4 mr-2"
                :to="{ name: 'finishedProductLoadDetail', query: { load_id: item.id } }">
              <v-btn variant="text" icon="mdi-pencil" v-permission="`Detail`"/>
            </router-link>
            <v-dialog max-width="400" persistent>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="text" icon="mdi-delete" v-bind="activatorProps"/>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card prepend-icon="mdi-help-circle-outline" text="Deletion is irreversible"
                        title="Confirm to delete data?">
                  <template v-slot:actions>
                    <v-spacer></v-spacer>
                    <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="isActive.value = false">
                      Cancel
                    </v-btn>
                    <v-btn class="text-none" color="primary" variant="flat" @click="handleDelete(isActive, item)">
                      Confirm
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
        <template v-slot:item.order_item.order.order_code="{ item }">
        <span class="allocated-order-item">
          <router-link v-if="item.order_item" class=" align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'OrderItemTable', query : {order_code:item.order_item.order?.order_code}  }">
            <span class="d-inline-block">{{ item.order_item?.order?.order_code }}</span>
          </router-link>
          <span class="separator">-</span>
          <router-link v-if="item.order_item" class=" align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'OrderItemDetail',query : {id:item.order_item.id}  }">
            <span class="d-inline-block">{{ item.order_item?.line_item_code }}</span>
          </router-link>
        </span>
        </template>
        <template v-slot:item.reserved_order_item.line_item_code="{ item }">
          <span class="reserved-order-item">
            <router-link v-if="item.reserved_order_item" class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemTable', query: { order_code: item.reserved_order_item.order?.order_code } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.order?.order_code }}</span>
            </router-link>
            <span class="separator">-</span>
            <router-link v-if="item.reserved_order_item" class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemDetail', query: { id: item.reserved_order_item.id } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.line_item_code }}</span>
            </router-link>
          </span>
        </template>
      </v-data-table-server>
    </v-card>
    <MoveAction ref="moveFormRef" @refresh="handleSearch"/>
    <Tip ref="tipFormRef" @refresh="handleSearch"/>
    <CarryOut ref="carryOutFormRef" @refresh="handleSearch"/>

  </v-container>
</template>
<script name="FinishedProductLoadList" setup>
import DictCode from "@/components/picker/DictCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import TransportCode from "@/components/picker/TransportCode.vue";
import moment from "moment";
import printJS from "print-js";
import {getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs, watch, computed} from "vue";
import {toast} from "vue3-toastify";
import {formatDate} from "@/util/util";
import API from "./api";
import MoveAction from "./components/move.vue";
import Tip from "./components/tip.vue";
import CarryOut from "./components/carryOut.vue";
import {useI18n} from "vue-i18n";

const {proxy} = getCurrentInstance();
const {t} = useI18n();

const headers = computed(() => [
  { title: t("load.table.action"), key: "action", width: 300, fixed: true, sortable: false },
  { title: t("load.table.pilling_bogie"), key: "pilling_bogie" },
  { title: t("load.table.code"), key: "code" },
  { title: t("load.table.load_instruction_no"), key: "cut_seq_load_no" },
  { title: t("load.table.to_business_type"), key: "business_type" },
  { 
    title: t("load.table.rolling_code"),
    key: "rolling.rolling_code",
    value: (item) => item.rolling?.rolling_code || "--"
  },
  { title: t("load.table.cut_sequence"), key: "cut_seq", sortable: false },
  {
    title: t("load.table.order_item"),
    key: "order_item.order.order_code",
    value: (item) => {
      return `${item.order_item?.order?.order_code || ''}-${item.order_item?.line_item_code || ''}`;
    },
    minWidth: 180,
    sortable: true
  },
  { 
    title: t("load.table.mill_code"), 
    key: "mill.code", 
    value: (item) => item.mill?.code || "--" 
  },
  { 
    title: t("load.table.to_area"), 
    key: "area.code", 
    value: (item) => item.area?.code || "--" 
  },
  { title: t("load.table.transport_code"), key: "transport_code" },
  { title: t("load.table.transport_type"), key: "transport_type" },
  { title: t("load.table.dispatch_date"), key: "dispatch_date" },
  { title: t("load.table.stock_in_date"), key: "stock_in_date" },
  { title: t("load.table.piece_count"), key: "piece_count" },
  { title: t("load.table.weight"), key: "total_weight_ton" },
  { title: t("load.table.customer_code"), key: "customer_code" },
  { title: t("load.table.load_status"), key: "load_status" },
  { title: t("load.table.transport_status"), key: "transport.status" },
  { title: t("load.table.load_type"), key: "load_type" },
  { title: t("load.table.advice_num"), key: "advice_num" },
  { title: t("load.table.comment"), key: "comment" },
  {
    title: t("load.table.created_at"),
    key: "created_at",
    sortable: true,
    minWidth: 180
  },
  {
    title: t("load.table.created_by"),
    key: "created_by",
    sortable: true,
    minWidth: 180
  }
])

const printFields = computed(() => [
  { displayName: t("load.table.code"), field: "code" },
  { displayName: t("load.table.business_type"), field: "business_type" },
  { displayName: t("load.table.mill_code"), field: "mill_code" },
  { displayName: t("load.table.to_area"), field: "area_code" },
  { displayName: t("load.table.rolling_code"), field: "rolling_code" },
  { displayName: t("load.table.order_item"), field: "order_item" },
  { displayName: t("load.table.transport_code"), field: "transport_code" },
  { displayName: t("load.table.transport_type"), field: "transport_type" },
  { displayName: t("load.table.dispatch_date"), field: "dispatch_date" },
  { displayName: t("load.table.stock_in_date"), field: "stock_in_date" },
  { displayName: t("load.table.piece_count"), field: "piece_count" },
  { displayName: t("load.table.weight_ton"), field: "total_weight_ton" },
  { displayName: t("load.table.customer_code"), field: "customer_code" },
  { displayName: t("load.table.load_status"), field: "load_status" },
  { displayName: t("load.table.load_type"), field: "load_type" },
  { displayName: t("load.table.advice_num"), field: "advice_num" },
  { displayName: t("load.table.created_at"), field: "created_at" }
])

const data = reactive({
  serverItems: [],
  loading: false,
  totalItems: 0,
  transport_length: null,
  transport_weight: null,
  searchOptions: {
    q: null,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    pilling_bogie: [],
    sortBy: ["created_at", "pilling_bogie"],
    descending: [true,false],
    start_date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
    end_date: moment().add(1, 'days').format("YYYY-MM-DD"),
  },
  filterOptions: {
    transport_code: null,
    transport_type: null,
    finished_load_status: ['Created'],
    order_item_id: null,
    rolling_id: null,
    order_id: null,
  }
});
const selected = ref([]);
const isAdviceTipDisabled = ref(true)
const tableList = ref([]);
const total = ref(0);
const carryOutDialog = ref(false);


const {
  serverItems,
  loading,
  transport_length,
  transport_weight,
  searchOptions,
  filterOptions,
} = toRefs(data);

const loadItems = () => {
  const params = {
    fields: [],
    ops: [],
    values: [],
    filter_type: null,
    page: searchOptions.value.page,
    itemsPerPage: searchOptions.value.itemsPerPage,
    sortBy: searchOptions.value.sortBy,
    descending: searchOptions.value.descending,
    start_date: searchOptions.value.start_date,
    end_date: searchOptions.value.end_date,
  };
  // Add search by query
  if (searchOptions.value.q) {
    params.fields.push("code");
    params.ops.push("like");
    params.values.push(`%${searchOptions.value.q}%`);
  }
  ;
  if (filterOptions.value.pilling_bogie && filterOptions.value.pilling_bogie.length > 0) {
    params.fields.push("pilling_bogie");
    params.ops.push("in");
    params.values.push(filterOptions.value.pilling_bogie);
  }
  ;

  // Default filter: Show only null load_status
  //if (!filterOptions.value.finished_load_status || filterOptions.value.finished_load_status.length === 0) {
  // params.fields.push("load_status");
  // params.ops.push("is_null");
  // params.values.push("")
  //} 
  // else if (filterOptions.value.finished_load_status.includes("")) {
  //   // Case 2: "All" selected, include null, Tipped, and Carry Out
  // } 
  if (filterOptions.value.transport_code) {
    params.fields.push("transport_code");
    params.ops.push("eq");
    params.values.push(filterOptions.value.transport_code);
  }
  ;
  if (filterOptions.value.transport_type && filterOptions.value.transport_type.length !== 0) {
    // Case 3: Specific filters selected
    params.fields.push("transport_type");
    params.ops.push("in");
    params.values.push(filterOptions.value.transport_type);
    params.filter_type = "and"
  }
  if (filterOptions.value.finished_load_status && filterOptions.value.finished_load_status.length !== 0) {
    // Case 3: Specific filters selected
    params.fields.push("load_status");
    params.ops.push("in");
    params.values.push(filterOptions.value.finished_load_status);
    params.filter_type = "and"
  }
  if (filterOptions.value.order_id) {
    params.fields.push("order_item.order_id");
    params.ops.push("eq");
    params.values.push(filterOptions.value.order_id);
  }
  if (filterOptions.value.order_item_id) {
    params.fields.push("order_item_id");
    params.ops.push("eq");
    params.values.push(filterOptions.value.order_item_id);
  }
  if (filterOptions.value.rolling_id) {
    params.fields.push("rolling_id");
    params.ops.push("eq");
    params.values.push(filterOptions.value.rolling_id);
  }


  loading.value = true;
  API.getAll(params)
      .then((res) => {
        if (res.status === 200) {
          total.value = res.data.total || 0;

          serverItems.value = res.data.items.map((item) => ({
            ...item,
            code: item?.code || "",
            business_type: item?.business_type || "",
            transport_code: item?.transport_code || "",
            transport_type: item?.transport_type || "",
            piece_count: item?.piece_count || "",
            total_weight_ton: item?.total_weight_ton || "",
            customer_code: item?.customer_code || "",
            load_status: item.cut_sequence?.length ? "Planned" : item.load_status,
            load_type: item?.load_type || "",
            advice_num: item?.advice_num || "",
            comment: item?.comment || "",
            mill_code: item.mill?.code || "",
            area_code: item.area?.code || "",
            rolling_code: item.rolling?.rolling_code || "",
            dispatch_date: formatDate(item["dispatch_date"]),
            stock_in_date: formatDate(item["stock_in_date"]),
            created_at: formatDate(item["created_at"]),
            cut_seq: item.cut_sequence?.length
                ? item.cut_sequence
                    .map((cs) => `${cs.saw_route}${String(cs.new_seq).padStart(3, '0')}`)
                    .sort((a, b) => {
                      const order = {E: 0, W: 1, S: 2}; // Define order priority
                      const letterA = a.charAt(0);
                      const letterB = b.charAt(0);
                      const numA = parseInt(a.substring(1), 10);
                      const numB = parseInt(b.substring(1), 10);

                      if (order[letterA] !== order[letterB]) {
                        return order[letterA] - order[letterB]; // Sort letters first
                      }
                      return numA - numB; // Sort numbers within each letter
                    })
                    .join("<br>") // Format as multi-line
                : "",
            order_item: item?.order_item?.line_item_code || "",
          }));
        } else {
          total.value = 0;
          serverItems.value = [];
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        total.value = 0;
        serverItems.value = [];
      })
      .finally(() => {
        loading.value = false;
        selected.value = [];
      });
}


const handlePrint = () => {
  printJS({
    printable: toRaw(serverItems.value),
    properties: printFields.value,
    type: "json",
    header: "Finished Product Load",
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

const handleTableChangePage = (page) => {
  searchOptions.value.page = page;
  loadItems();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  searchOptions.value.itemsPerPage = itemsPerPage;
  loadItems();
}

const handleTableChangeSortBy = (sortBy) => {
  searchOptions.value.sortBy = sortBy;
  loadItems();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

const handleSearch = () => {
  loadItems();
}

const handleDelete = (isActive, item) => {
  API.deleteById(item.id).then(() => {
    toast.success("Delete successfully", {
      position: "bottom-center"
    });
    loadItems();
  }).catch((error) => {
    handleError(error)
  }).finally(() => {
    isActive.value = false;
  });
}

const handleMove = () => {
  const items = toRaw(selected.value);

  proxy.$refs["moveFormRef"].handleShow(items);
}
const UpdateStartDate = (res) => {
  if (res) {
    searchOptions.value.start_date = moment(res).format("YYYY-MM-DD");
  }
}

const UpdateEndDate = (res) => {
  console.log(res);
  if (res) {
    searchOptions.value.end_date = moment(res).format("YYYY-MM-DD");
  }
}


// const handleTip = (isActive) => {
//   isActive.value = false;
//   const items = toRaw(selected.value);
//   const params = {
//     codes: items.map(item => item.code)
//   }
//   loading.value = true;
//   API.tip(params).then(() => {
//     toast.success("Tip Success", {
//       position: "bottom-center"
//     });
//     loadItems();
//   }).catch(() => {
//     toast.error("Tip Fail", {
//       position: "bottom-center"
//     }, { autoClose: 60000 });
//   });
// }

const handleError = (error) => {
  if (error.response) {
    toast.error(error.response?.data?.detail, {autoClose: 60000});
  }
  return false
}

// const handleTip = (item) => {
//   // const item = toRaw(selected.value);

//   proxy.$refs["tipFormRef"].handleShow(item);
// }

const handleTip = (item) => {
  API.getTip(item.id).then(res => {
    if (res.status === 200) {
      if (!!res.data) {
        proxy.$refs["tipFormRef"].handleShow(item);
      } else {
        proxy.$refs["tipFormRef"].handleShow(item, res.data);

      }
    } else {
      toast.error("Send Tip Fail", {autoClose: 60000});
    }
  }).catch((err) => {
    toast.error(err?.response?.data?.detail || "Consign Error.", {autoClose: 60000});
  })
}

const handleCarryOut = () => {
  const items = toRaw(selected.value);
  proxy.$refs["carryOutFormRef"].handleShow(items);
}

const handleTransportCodeChange = (item) => {
  searchOptions.value.transport_code = item.code;
  transport_length.value = item.length_mm;
  transport_weight.value = item.weight_kg;
}

const getTransportHint = (length, weight) => {
  return `Length:${length} Weight:${weight}`;
};

onMounted(() => {
  loadItems();
})

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
