<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col v-show="handleFieldShow('advice_code')" cols="2">
          <v-text-field
              v-model="search.advice_code"
              append-inner-icon="mdi-magnify"
              label="Search By Advice No."
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('store')" cols="2">
          <Store v-model="search.store" variant="underlined" density="default" hide-details></Store>
        </v-col>
        <v-col v-show="handleFieldShow('business_type')" cols="2">
          <DictCode
              v-model="search.business_type"
              :code="`business_type#${defaultMillCode}`"
              label="Business Type"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              hide-details
          />
        </v-col>
        <v-col v-show="handleFieldShow('advice_type')" cols="2">
          <DictCode
              v-model="search.advice_type"
              :code="`advice_type`"
              label="Advice Type"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              hide-details
          />
        </v-col>
        <v-col v-show="handleFieldShow('mult_done')" cols="2">
          <DictCode
              v-model="search.mult_done"
              code="advice_mult_done"
              label="Mult Done"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              hide-details
          />
        </v-col>
        <v-col v-show="handleFieldShow('destination')" cols="2">
          <SiteType type="finished" v-model="search.destination" item-value="site_type_code" density="default"
            label="Destination"/>
        </v-col>
        <v-col v-show="handleFieldShow('ship')" cols="2">
          <v-text-field v-model="search.ship" label="Vessel" variant="underlined" density="default" hide-details clearable></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('port')" cols="2">
          <v-text-field v-model="search.port" label="Port" variant="underlined" density="default" hide-details clearable></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('to_area_id')" cols="2">
          <AreaCode
              v-model="search.to_area_id"
              :area="search.to_area"
              label="Location"
              @change="handleSearchItemChange($event, 'to_area_id')"
          />
        </v-col>
        <v-col v-show="handleFieldShow('customer')" cols="2">
          <v-text-field v-model="search.customer" label="Customer" variant="underlined" density="default" hide-details clearable></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('status')" cols="2">
          <DictCode
              v-model="search.status"
              code="advice_status"
              label="Status"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              hide-details
          />
        </v-col>
        <v-col v-show="handleFieldShow('held')" cols="2">
          <DictCode
              v-model="search.held"
              code="advice_held"
              label="Held"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              hide-details
          />
        </v-col>
        <v-col v-show="handleFieldShow('start_date_from')" cols="4">
          <VueDatePicker
              v-model="dateRange"
              @update:model-value="formatDateValue"
              position="left"
              :range="{ partialRange: false }"
              :teleport="true"
          >
            <template #trigger>
              <v-text-field
                  :model-value="search.start_date_from ? `${search.start_date_from}~${search.start_date_to}` : ''"
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
          <div class="d-flex ga-4 align-center justify-end">
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
              {{ $t('global.reset') }}
            </v-btn>
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading" v-permission="`Search`">
              {{ $t('global.search') }}
            </v-btn>
            <v-spacer />
            <router-link
              class="text-decoration-none grey-darken-4"
              :to="{ name: 'AdviceDetail' }">
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                v-permission="`Create`"
            >
              {{ $t('global.new') }}
            </v-btn>
        </router-link>
          </div>
        </v-col>
      </v-row>
      
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <div class="d-flex ga-4 align-center mb-4">
        <v-dialog
            max-width="400"
            persistent
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading" v-bind="activatorProps" :disabled="selected.length === 0" v-permission="`Cancel`">
              {{ $t('advice.button.cancel') }}
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card
                prepend-icon="mdi-help-circle-outline"
                text="Cancel is irreversible"
                title="Do you confirm?"
            >
              <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="text-none"
                    color="#e3e3e3"
                    variant="flat"
                    @click="isActive.value = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                    class="text-none"
                    color="primary"
                    variant="flat"
                    @click="UpdateCancel(isActive)"
                >
                  Confirm
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog
            max-width="400"
            persistent
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading" v-bind="activatorProps" :disabled="selected.length === 0 || selected.some(item => item.status !== 'cancelled')" v-permission="`Deload`">
              {{ $t('advice.button.deload') }}
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card
                prepend-icon="mdi-help-circle-outline"
                text="Deload is irreversible"
                title="Do you confirm?"
            >
              <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="text-none"
                    color="#e3e3e3"
                    variant="flat"
                    @click="isActive.value = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                    class="text-none"
                    color="primary"
                    variant="flat"
                    @click="UpdateDeload(isActive)"
                >
                  Confirm
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handleReturn"
            :disabled="selected.length === 0"
            v-permission="`Return`"
        >
          {{ $t('advice.button.back_to_mill') }}
        </v-btn>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handleTip"
            :disabled="handleTipDisabled"
            v-permission="`Tip`"
        >
          {{ $t('advice.button.tip') }}
        </v-btn>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handleSplit"
            :disabled="selected.length === 0 || selected.length > 1"
            v-permission="`Split`"
        >
          {{ $t('advice.button.split') }}
        </v-btn>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handleMove"
            :disabled="handleMoveDisabled"
            v-permission="`Move`"
        >
          {{ $t('advice.button.move') }}
        </v-btn>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handleReplaced"
            :disabled="selected.length === 0 || selected.length > 1"
            v-permission="`Replaced`"
        >
          {{ $t('advice.button.replace') }}
        </v-btn>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handlePrint(selected[0])"
            :disabled="selected.length === 0 || selected.length > 1"
            v-permission="`Print`"
        >
          {{ $t('global.print') }}
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
        height="650" min-height="300" items-per-page="10" :page="search.page"
        :headers="tableHeaders" :items="tableList" :items-length="total" :loading="loading" fixed-header
        show-current-page return-object @update:options="handleTableChange"  v-model="selected" show-select item-value="id">
        <template v-slot:item.status="{ item }">
          <div class="d-flex justify-left ga-2">
            <v-chip v-if="item.status !== null" size="small">
              <!-- {{ item.status }} -->
              {{ adviceStatusMap[item.status] || item.status }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.held="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="(tag, index) in item.held" :key="index" size="small" color="red" class="font-weight-bold">
              {{ tag }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.finished_product_load.code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                      :to="{ name: 'finishedProductLoadDetail', query: { load_id: item.load_id } }">
            <span class="d-inline-block">{{ item.load?.code }}</span>
            <!-- <v-icon class="mdi mdi-file-document-arrow-right"></v-icon> -->
          </router-link>
        </template>
        <template v-slot:item.hold_reason="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
              {{ tag }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.cover="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="(tag, index) in item.cover.slice(0, 3)" :key="tag.id" size="small" class="font-weight-bold" :style="{ color: 'black', backgroundColor: 'yellow'}">
              {{ tag }}
            </v-chip>
            <v-chip v-if="item.cover.length > 3" size="small" class="font-weight-bold" :style="{ color: 'black', backgroundColor: 'yellow'}">
              ...
            </v-chip>
          </div>
        </template>
        <template v-slot:item.rework="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.rework" :key="tag.id" size="small">
              {{ tag }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.advice_code="{ item }">
          <div class="d-flex justify-center ga-2">
            <!-- {{ get_prefix_for_business_type(item.business_type) + item.advice_code }} -->
            {{ item.advice_code }}
          </div>
        </template>

        <!-- 显示映射后的 business_type -->
        <template v-slot:item.business_type="{ item }">
          {{ adviceBusinessTypeMap[item.business_type] || item.business_type }}
        </template>

        <!-- 显示映射后的 type -->
        <template v-slot:item.type="{ item }">
          {{ adviceTypeMap[item.type] || item.type }}
        </template>

        <!-- 显示映射后的 mult_done -->
        <template v-slot:item.mult_done="{ item }">
          {{ adviceMultDoneMap[item.mult_done] || item.mult_done }}
        </template>

        <!-- 显示映射后的 own_state -->
        <template v-slot:item.own_state="{ item }">
          {{ adviceOwnStateMap[item.own_state] || item.own_state }}
        </template>
        <template v-slot:item.action="{ item }">
          <router-link class="text-decoration-none grey-darken-4 mr-2" :to="{ name: 'AdviceDetail', query: { id: item.id } }">
            <v-icon small v-permission="`Detail`">mdi-pencil</v-icon>
          </router-link>
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  variant="text"
                  icon="mdi-delete"
                  v-bind="activatorProps"
                  :disabled="item.status === 'unload'"
              />
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
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <MoveAction ref="moveFormRef" @refresh="handleSearch" />
    <SplitAction ref="splitRef" @refresh="handleSearch" />
    <Tip ref="tipFormRef" @refresh="handleSearch" />
    <Return ref="ReturnRef" @refresh="handleSearch" />
    <Replaced ref="replacedRef" @refresh="handleSearch" />
    <MesTable ref="tableRef" name="adviceList"  v-model="tableHeaders" />
  </v-container>
</template>
<script setup>
import { useRoute } from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs, computed, nextTick} from "vue";
import {useStore} from "vuex";
import {cloneDeep, map, toLower} from "lodash";
import { toast } from "vue3-toastify";
import {formatDate} from "@/util/util";
import moment from "moment/moment";
import useSearchFieldVisibility from "@/hooks/useSearchFieldVisibility";
import AdviceCode from "@/components/picker/AdviceCode.vue";
import SplitAction from "./components/split.vue";
import MoveAction from "./components/move.vue";
import Tip from "./components/tip.vue";
import Return from "./components/Return.vue";
import AreaCode from "@/components/picker/AreaCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import Replaced from "./components/replaced.vue";
import Store from "./components/picker/Store.vue";
import MesTable from "@/components/table/index.vue";
import SiteType from "@/components/picker/SiteType.vue";
import API from "./api";
import printJS from "print-js";
import useFooterEvent from "@/hooks/useFooterEvent";
import { useI18n } from "vue-i18n";

const store = useStore();
const { t } = useI18n();

const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));

// 搜索字段定义
const fields = ["advice_code", "store", "business_type", "advice_type", "mult_done", "destination", "ship", "port", "to_area_id", "customer", "status", "held", "start_date_from"];
const searchFields = ref([...fields]);

const {handleFieldShow} = useSearchFieldVisibility(searchFields)
// 时间处理 start
const $startTime = moment().startOf('day').add(6, 'hours');
const $endTime = moment().add(1, 'day').startOf('day').add(6, 'hours');
const dateRange = ref([$startTime, $endTime]);

const route = useRoute();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableHeaders = computed(() => [
  { title: t("advice.table.action"), key: "action", minWidth: 120, fixed: true, sortable: false, align: "center" },
  { title: t("advice.table.advice_no"), key: "advice_code", sortable: true },
  { title: t("advice.table.business_type"), key: "business_type", sortable: true },
  { title: t("advice.table.advice_type"), key: "type", sortable: true },
  { title: t("advice.table.no_products"), key: "no_products", sortable: false },
  { title: t("advice.table.total_weight"), key: "total_weight", sortable: false },
  { title: t("advice.table.length"), key: "max_length", sortable: false },
  { title: t("advice.table.location"), key: "area.code", sortable: true, value: (item) => item.to_area?.code },
  { title: t("advice.table.vessel"), key: "ship", sortable: true },
  { title: t("advice.table.own_state"), key: "own_state", sortable: true },
  { title: t("advice.table.held"), key: "held", sortable: false },
  { title: t("advice.table.hold_status"), key: "hold_reason", sortable: false },
  { title: t("advice.table.cover"), key: "cover", sortable: false },
  { title: t("advice.table.rework"), key: "rework", sortable: false },
  { title: t("advice.table.mult_done"), key: "mult_done", sortable: false },
  { title: t("advice.table.wagon"), key: "transport.code", sortable: true },
  { title: t("advice.table.store"), key: "store", sortable: true },
  { title: t("advice.table.load_code"), key: "finished_product_load.code", value: (item) => item.load?.code, sortable: true },
  { title: t("advice.table.customer"), key: "customer", sortable: true },
  { title: t("advice.table.status"), key: "status", sortable: true },
  { title: t("advice.table.comment"), key: "comment", sortable: true },
  {
    title: t("advice.table.created_at"),
    key: "created_at",
    sortable: true,
    value: (item) => formatDate(item.created_at),
    minWidth: 180
  },
  {
    title: t("advice.table.created_by"),
    key: "created_by",
    sortable: true,
    minWidth: 180
  }
]);
const tableList = ref([]);
const selected = ref([]);
const total = ref(0);
// const isAdviceTipDisabled = ref(true)

// &fields[]=created_at&ops[]=>=&values[]=2024-11-13&fields[]=created_at&ops[]=<=&values[]=2024-11-14
const data = reactive({
  search: {
    q:undefined,
    start_date_from: undefined,
    start_date_to: undefined,
    store: undefined,
    business_type: undefined,
    ship: undefined,
    port: undefined,
    to_area_id: undefined,
    to_area: undefined,
    destination: undefined,
    mult_done: undefined,
    customer: undefined,
    status: "enroute",
    held: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
    fields: [],
    ops: [],
    values: [],
    advice_type: undefined,
    advice_code: undefined
  },
});

const { search, date} = toRefs(data);

const getData = () => {
  const params = cloneDeep({
    ...toRaw(search.value)
  });
  loading.value = true;
  params.fields = [];
  params.ops = [];
  params.values = [];
  params.filter_type = undefined
  // if (params.start_date_from && params.start_date_to) {
  //   params.fields.push("created_at", "created_at")
  //   params.ops.push(">=", "<=")
  //   params.values.push(params.start_date_from, params.start_date_to)
  // }
  if (params.advice_code){
    params.fields.push("advice_code")
    params.ops.push("like")
    params.values.push(`%${params.advice_code}%`)
  }
  if (params.store){
    params.fields.push("store")
    params.ops.push("like")
    params.values.push(`%${params.store}%`)
  }
  if (params.ship){
    params.fields.push("ship")
    params.ops.push("like")
    params.values.push(`%${params.ship}%`)
    delete params.ship
  }
  if (params.port){
    params.fields.push("port")
    params.ops.push("like")
    params.values.push(`%${params.port}%`)
  }
  if (params.to_area_id){
    params.fields.push("to_area_id")
    params.ops.push("eq")
    params.values.push(params.to_area_id)
  }
  if (params.destination){
    params.fields.push("destination")
    params.ops.push("like")
    params.values.push(`%${params.destination}%`)
  }
  if (params.customer){
    params.fields.push("customer")
    params.ops.push("like")
    params.values.push(`%${params.customer}%`)
  }
  if (params.business_type){
    params.fields.push("business_type")
    params.ops.push("eq")
    params.values.push(params.business_type)
  }
  if (params.status){
    params.fields.push("status")
    params.ops.push("eq")
    params.values.push(params.status)
  }
  if (params.advice_type){
    params.fields.push("type")
    params.ops.push("eq")
    params.values.push(params.advice_type)
  }
  if (params.fields.length > 1){
    params.filter_type = 'and'
  }
  
  
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
    selected.value = [];
  });
}

const adviceMultDoneMap = {
  waiting: "Waiting",
  done: "Done",
  na: "NA",
};
const adviceBusinessTypeMap = {
  bws: "BWS",
  roster: "Roster",
  internal: "Internal",
  scrap: "Scrap",
  service_center: "Service Center",
};
const adviceTypeMap = {
  transfer: "Transfer",
  scrap: "Scrap",
  mult: "Mult",
  rework: "Rework",
};
const adviceStatusMap = {
  enroute: "EnRoute",
  tipped: "Tipped",
  cancelled: "Cancelled",
  unload: "Unload",
  deload: "Deload",
  return: "Return"
};
const adviceOwnStateMap = {
  store: "Store",
  mill: "Mill",
};
const handleSearch = () => {
  getData();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

const handleReturn = ()=>{
  proxy.$refs['ReturnRef'].handleShow(toRaw(selected.value))
}


const handleTableChange = ({ page, itemsPerPage, sortBy }) => {
  search.value.page = page;
  search.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    search.value.sortBy = sortBy;
  }else{
    search.value.sortBy = ["created_at"];
    search.value.descending = [true];
  }
  // getData();
  handleSearch();
}



const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    handleSearch();
  }).catch(() => {
    toast.error("Delete Fail", { autoClose: 60000 });
  });
}

const handleSplit = () => {
  const item = toRaw(selected.value[0]);
  proxy.$refs["splitRef"].handleShow(item.id,defaultMillCode.value);
}

const handleReplaced = () => {
  const item = toRaw(selected.value[0]);
  proxy.$refs["replacedRef"].handleShow(item);
}

const handleClose = () => {
  visible.value = false;
  search.value = {
    q:undefined,
    start_date_from: undefined,
    start_date_to: undefined,
    store: undefined,
    ship: undefined,
    port: undefined,
    to_area_id: undefined,
    to_area: undefined,
    customer: undefined,
    status: undefined,
    held: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  };
  nextTick(() => {
    proxy.$refs["searchForm"].resetValidation();
  })
}

const formatDateValue = (res) => {
  if (res && res.length === 2) {
    search.value.start_date_from = moment(res[0]).format("YYYY-MM-DD HH:mm:ss");
    search.value.start_date_to = moment(res[1]).format("YYYY-MM-DD HH:mm:ss");
  } else {
    search.value.start_date_from = undefined;
    search.value.start_date_to = undefined;
  }
}

const UpdateCancel = (isActive) => {
  isActive.value = false;
  const params = toRaw(selected.value);
  const ids = params.map(item => item.id);
    if (ids.length === 0) {
      toast.warning("Please Choose Advice List", {
        position: "bottom-center"
      });
      return;
    }
    loading.value = true;
    API.cancelUpdate({"item_ids": ids}).then(res => {
      if (res.status === 200) {
        toast.success("Cancel Success", {
          position: "bottom-center"
        });
        getData();
      } else {
        toast.error("Cancel Fail", { autoClose: 60000 });
      }
    })
}


const UpdateDeload = (isActive) => {
  isActive.value = false;
  const params = toRaw(selected.value);
  const ids = params.map(item => item.id);
    if (ids.length === 0) {
      toast.warning("Please Choose Advice List", {
        position: "bottom-center"
      });
      return;
    }
    loading.value = true;
    API.deloadUpdate({"item_ids": ids}).then(res => {
      if (res.status === 200) {
        toast.success("Cancel Success", {
          position: "bottom-center"
        });
        getData();
      } else {
        toast.error("Cancel Fail", { autoClose: 60000 });
      }
    })
}

const handleMove = () => {
  const items = toRaw(selected.value[0]);
  proxy.$refs["moveFormRef"].handleShow(items);
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

const handleTip = () => {
  const item = toRaw(selected.value);
  const ids = item.map(item => item.id);

  API.getTip({"advice_ids": ids}).then(res => {
    if (res.status === 200) {
      if(res.data != true){
        proxy.$refs["tipFormRef"].handleShow(item, res.data);
      }else {
        proxy.$refs["tipFormRef"].handleShow(item);

      }
    } else {
      toast.error("Send Tip Fail", { autoClose: 60000 });
    }
  })
}

const handleSearchItemChange = (item, key) => {
  search.value[`${key}`] = item?.id;
}


const handleTipDisabled = computed(() => {
  let allSameBusinessType = true;
  if(selected.value.length > 0){
    const firstBusinessType = selected.value[0].business_type;
    allSameBusinessType = selected.value.every(item => item.business_type === firstBusinessType);
  }

  // 根据选中的记录设置禁用条件
  return selected.value.length == 0 || selected.value.some(item => item.status === 'unload') || !allSameBusinessType
  || (selected.value.some(item => item.held === 'Q' ? item.business_type !== 'internal' && item.business_type !== 'roster': false)) 
  || selected.value.some(item => 
    item.business_type === 'roster' && 
    item.finished_products && 
    item.finished_products.every(f => !(f.exist_flag === 'Y' || f.exist_flag === null) && !(f.rework_type === 'Complete' || f.rework_type === null))
  );
});

const handleMoveDisabled = computed(() => {
  // 根据选中的记录设置禁用条件
  return selected.value.length == 0 || selected.value.length > 1
});

const UpdateStartDate = (res) => {
  if (res) {
    search.value.start_date_from = moment(res).format("YYYY-MM-DD");
  }
}

const UpdateEndDate = (res) => {
  if (res) {
    search.value.start_date_to = moment(res).format("YYYY-MM-DD");
  }
}

function get_prefix_for_business_type(business_type) {
  
  if (business_type == "bws") {
    return "T";
  } else if (business_type == "service_center") {
    return "T";
  } else if (business_type == "roster") {
    return "C";
  } else if (business_type == "scrap") {
    return "S";
  } else if (business_type == "internal") {
    return "";  // No prefix for Internal
  } else {
    return "";
  }
}

// 获取属性值，简化处理逻辑
function getFieldValue(object, path, defaultValue = "") {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), object) || defaultValue;
}

// 转换函数
function transformItem(item) {
  return {
    ...item,
    finished_code: getFieldValue(item, "runout.runout_code") + getFieldValue(item, "cut_code"),
    product_type_code: getFieldValue(item, "product_type.code"),
    cast_code: getFieldValue(item, "cast.cast_code"),
    length_mm: getFieldValue(item, "length_mm"),
    status: getFieldValue(item, "status"),
    quality_code: getFieldValue(item, "quality_code"),
    cut_into: getFieldValue(item, "cut_into", ""),
    order_code: getFieldValue(item, "order.order_code", "").slice(-6),
    order_item_code: getFieldValue(item, "order_item.line_item_code", "").slice(-4),
    cut_codes: getFieldValue(item, "cut_codes"),
    comment: getFieldValue(item, "comment"),
    weight: getFieldValue(item, "estimated_weight_kg", 0),
    rolling_code: getFieldValue(item, "rolling.rolling_code"),
    quantity: getFieldValue(item, "quantity", 0),
    m: "",
    c: "",
    s: "",
    cust_itm_mrk: "",
  };
}

const printFields = ref([
  // {displayName: "Code", field: "code"}, runout code + cut code
  {displayName: "Bar No", field: "finished_code"},
  {displayName: "Product Type", field: "product_type_code"},
  {displayName: "Cast No", field: "cast_code"},
  {displayName: "Order Number", field: "order_code", sortable: false},
  {displayName: "Line Item Number", field: "order_item_code", sortable: false},
  {displayName: "Length(mm)", field: "length_mm", sortable: false},
  {displayName: "Status", field: "status", sortable: false},
]);

const printBusinessFields = ref([
  {displayName: "Order No.", field: "order_code"},
  {displayName: "Item No.", field: "order_item_code"},
  {displayName: "PCS", field: "quantity", sortable: false},
  {displayName: "Length(mm)", field: "length_mm", sortable: false},
  {displayName: "Section", field: "product_type_code"},
  {displayName: "QUAL", field: "quality_code"},
  {displayName: "ROLL", field: "rolling_code"},
  {displayName: "ITM/MRK", field: "cust_itm_mrk"},
]);

const handlePrint = (item) => {
  const items = item.finished_products.map(transformItem);
  const filteredTableList = items.filter(item => item.exist_flag === 'Y' || item.exist_flag === null);
  const total_no_bars = filteredTableList.length || 0;
  const total_weight = filteredTableList.reduce((acc, item) => acc + item.estimated_weight_kg / 1000, 0);

  
  const mergedData = [];
  const grouped = {};

  // const mergeFields = mergeFieldsMap[business_type] || mergeFieldsMap.default;
  const mergeFields = ["order", "order_item_id", "quantity", "length_mm", "product_type_id", "quality_code", 'rolling_id', 'cust_item_mrk'];

  // 遍历过滤后的表格数据
  filteredTableList.forEach(item => {
      const key = mergeFields.map(field => item[field]).join("-"); // 生成唯一标识符
      
      
      if (grouped[key]) {
          // 如果已经存在相同 key 的项，则合并数据
          grouped[key].cut_codes += "," + item.cut_codes;
          grouped[key].quantity += item.quantity;
          // if (business_type === 'internal'){
          //   grouped[key].cut_into += item.cut_into;
          //   // grouped[key].weight += item.estimated_weight_kg;
          // }
      } else {
          // 如果是第一次遇到该 key，则加入新项
          grouped[key] = { ...item };
      }
  });

  // 将合并后的数据转回数组
  for (const key in grouped) {
    // 排序 cut_codes 字符串，按逗号分隔
    const sortedCutCodes = grouped[key].cut_codes.split(",").sort().join(", ");
    grouped[key].cut_codes = sortedCutCodes;
    grouped[key].cust_itm_mrk = grouped[key].runout?.runout_code + "  " + grouped[key].cut_codes;
    mergedData.push(grouped[key]);
  }

  const created_at = formatDate(item.created_at, "YYYY-MM-DD")

  if (item.business_type == 'internal') {
    const currentDate = formatDate(new Date(), 'YYYY-MM-DD');
    const currentTime = formatDate(new Date(), 'HH:mm:ss');
    printJS({
      printable: toRaw(mergedData),  // 打印表格数据
      properties: printBusinessFields.value,  // 打印字段
      type: "json",
      header: `
        <div style="display: flex; align-items: center; text-align: center;">
          <hr style="flex-grow: 1; border: none; border-top: 2px dashed black;">
          <span style="padding: 0 10px; font-weight: bold; white-space: nowrap;">INTERNAL NOTE</span>
          <hr style="flex-grow: 1; border: none; border-top: 2px dashed black;">
        </div>
        
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;" >ADVICE NO: ${item.advice_code || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">BRITISH STEEL LIMITED</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">CREATED: ${created_at || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">LACKENBY WORKS</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">PRINTED: ${currentDate || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">MIDDLESBROUGH</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%;"></div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">TS6 7RP</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 36%; max-width: 36%;">CUSTOMER: ${item.customer || ''}</div>
          <div style="flex: 0 0 36%; max-width: 36%;">DESTINATION: ${item.destination || ''}</div>
          <div style="flex: 0 0 25%; max-width: 28%; text-align: left;"><hr style="border: 1px dashed #000;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">CONSIGNEE: ${item.consignee || ''}</div>
        </div>
        <div style="position: absolute; bottom: 0; width: 100%; text-align: center; font-weight: bold;">
          TOTAL   ${total_no_bars || "0"} BARS &nbsp;&nbsp;
          TOTAL CALC WEIGHT   ${total_weight ? total_weight.toFixed(3) : 0 || "0"} TONNES &nbsp;
          
          <hr style="border: 1px dashed #000;">
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 100%; max-width: 100%; text-align: left">COMMENTS: ${item.comment || ''}</div>
          </div>
        </div>
        <hr style="border: 1px dashed #000;">
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%; text-align: center">CUSTOMER ORDER NO: ${item.order?.customer_po_number || ""}</div>
        </div>
      `,
      repeatTableHeader: true,  // 在每一页上重复表头
      gridHeaderStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-weight: bold; font-size: 10px;',  // 表格头样式
      gridStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-size: 10px;',  // 表格体样式
      headerStyle: 'text-align:center; color:#000; width:100%; border:1px solid #000;',
      scanStyles: false,
      style: '@page { size: auto; margin: 0cm 1cm 0cm 1cm; }', // 页面边距样式
    });
  } else if (item.business_type == 'scrap') {
    const currentDate = formatDate(new Date(), 'YYYY-MM-DD');
    const currentTime = formatDate(new Date(), 'HH:mm:ss');
    printJS({
      printable: toRaw(mergedData),  // 打印表格数据
      properties: printBusinessFields.value,  // 打印字段
      type: "json",
      header: `
        <div style="display: flex; align-items: center; text-align: center;">
          <hr style="flex-grow: 1; border: none; border-top: 2px dashed black;">
          <span style="padding: 0 10px; font-weight: bold; white-space: nowrap;">SCRAP NOTE</span>
          <hr style="flex-grow: 1; border: none; border-top: 2px dashed black;">
        </div>
        
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;" >ADVICE NO: ${item.advice_code || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">BRITISH STEEL LIMITED</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">CREATED: ${created_at || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">LACKENBY WORKS</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">PRINTED: ${currentDate || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">MIDDLESBROUGH</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%;"></div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">TS6 7RP</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%;">CUSTOMER: ${item.customer || ''}</div>
          <div style="flex: 0 0 25%; max-width: 28%; text-align: left;"><hr style="border: 1px dashed #000;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">CONSIGNEE: ${item.consignee || ''}</div>
        </div>
        <div style="position: absolute; bottom: 0; width: 100%; text-align: center; font-weight: bold;">
          TOTAL   ${total_no_bars || "0"} BARS &nbsp;&nbsp;
          TOTAL CALC WEIGHT   ${total_weight ? total_weight.toFixed(3) : 0 || "0"} TONNES &nbsp;
          
          <hr style="border: 1px dashed #000;">
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 100%; max-width: 100%; text-align: left">COMMENTS: ${item.comment || ''}</div>
          </div>
        </div>
        <hr style="border: 1px dashed #000;">
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%; text-align: center">CUSTOMER ORDER NO: ${item.order?.customer_po_number || ""}</div>
        </div>
      `,
      repeatTableHeader: true,  // 在每一页上重复表头
      gridHeaderStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-weight: bold; font-size: 10px;',  // 表格头样式
      gridStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-size: 10px;',  // 表格体样式
      headerStyle: 'text-align:center; color:#000; width:100%; border:1px solid #000;',
      scanStyles: false,
      style: '@page { size: auto; margin: 0cm 1cm 0cm 1cm; }', // 页面边距样式
    });
  } else if (item.business_type === 'bws' || item.business_type === 'roster'){
    const currentDate = formatDate(new Date(), 'YYYY-MM-DD');
    const currentTime = formatDate(new Date(), 'HH:mm:ss');
    printJS({
      printable: toRaw(mergedData),  // 打印表格数据
      properties: printBusinessFields.value,  // 打印字段
      type: "json",
      header: `
        <div style="display: flex; align-items: center; text-align: center;">
          <hr style="flex-grow: 1; border: none; border-top: 2px dashed black;">
          <span style="padding: 0 10px; font-weight: bold; white-space: nowrap;">DESPATCH NOTE</span>
          <hr style="flex-grow: 1; border: none; border-top: 2px dashed black;">
        </div>
        
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;" >ADVICE NO: ${item.advice_code || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">BRITISH STEEL LIMITED</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">CREATED: ${created_at || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">LACKENBY WORKS</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">PRINTED: ${currentDate || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">MIDDLESBROUGH</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%;"></div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">TS6 7RP</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%;">CUSTOMER: ${item.customer || ''}</div>
          <div style="flex: 0 0 25%; max-width: 28%; text-align: left;"><hr style="border: 1px dashed #000;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">PORT: ${item.port || ''}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">SHIP: ${item.ship || ''}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">HAULIER: ${item.haulier || ''}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">CONSIGNEE: ${item.consignee || ''}</div>
        </div>

        <div style="position: absolute; bottom: 0; width: 100%; text-align: center; font-weight: bold;">
          TOTAL   ${total_no_bars || "0"} BARS &nbsp;&nbsp;
          TOTAL CALC WEIGHT   ${total_weight ? total_weight.toFixed(3) : 0 || "0"} TONNES &nbsp;
          <hr style="border: 1px dashed #000;">
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 15%; max-width: 15%;">COMMENTS</div>
            <div style="flex: 0 0 2%; max-width: 2%;">:</div>
            <div style="flex: 0 0 78%; max-width: 78%; text-align: left">${item.comment || ''}</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 15%; max-width: 15%;">GEN MARKS</div>
            <div style="flex: 0 0 2%; max-width: 2%;">:</div>
            <div style="flex: 0 0 78%; max-width: 78%; text-align: left">
            ${item.order?.order_remarks?.map(remark => `<div style="margin-bottom: 2px; font-size: 10px;">${remark.text}</div>`).join('') || ''}
            </div>
          </div>
        </div>
        <hr style="border: 1px dashed #000;">
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%; text-align: center">CUSTOMER ORDER NO: ${item.order?.customer_po_number || ""}</div>
        </div>
      `,
      repeatTableHeader: true,  // 在每一页上重复表头
      gridHeaderStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-weight: bold; font-size: 10px;',  // 表格头样式
      gridStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-size: 10px;',  // 表格体样式
      headerStyle: 'text-align:center; color:#000; width:100%; border:1px solid #000;',
      scanStyles: false,
      style: '@page { size: auto; margin: 0cm 1cm 0cm 1cm; }', // 页面边距样式
    });
  }else {
    printJS({
      printable: toRaw(filteredTableList),
      properties: printFields.value,
      type: "json",
      header: `
        <p style="text-align: center">Advice Detail</p>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">Advice No: ${item.advice_code || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Advice Type: ${item.type || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">Location: ${item.to_area?.code || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Customer: ${item.customer || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">Transport Type: ${item.transport_type || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Transport No: ${item.transport?.code || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">HLR: ${item.haulier || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Date: ${created_at || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">Destination: ${item.destination || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Ship: ${item.ship || ""}</div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">Comment: ${item.comment || ""}</div>
        </div>
    `,
      repeatTableHeader: false,
      gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px; font-size: 10px;', // 表格头样式
      gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px; font-size: 10px;', // 表哥体样式
      headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
      scanStyles: false,
      style: '@page{size:landscape;margin: 0cm;}' // 表格样式
    });
  }

}

// const computedAdviceCode = computed((item) => {
//   console.log("item===>", item);
  
//   let prefix = "";
//   if (item.business_type){
//     prefix = get_prefix_for_business_type(form.value.business_type);
//   }
  
//   return prefix + form.value.advice_code;
// });

getData();

useFooterEvent('adviceList', {
  fields,
  column: tableHeaders,
  columnRef: tableHeaders,
  queryFields: searchFields,
  queryParams: search,
})
</script>
<style lang="scss" scoped></style>
