<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row class="mb-2">
        <v-col cols="12" class="d-flex justify-end text-right">
          <div class="specsave">
            <div class="specsave-action d-flex align-center">
              <span class="text-subtitle-2 font-weight-regular mr-1">{{ control.saveFlag ? "Manually Specify Test" : "Auto" }}</span>
              <v-switch v-model="control.saveFlag" density="default" hide-details inset></v-switch>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-card class="pa-4" elevation="0" variant="outlined">
        <v-row align="center">
          <v-col cols="3" class="d-flex align-center" >
            <div>
              <v-radio-group v-model="searchOptions.selectedOption" :disabled="defaultMillCode == 'SRSM'">
              <v-radio
                  value="runout"
            
                  class="mr-2 mt-0 mt-4"
                  :hide-details="false"
              />
            </v-radio-group>
            </div>
            <RunoutCode
                v-model="searchOptions.runout_id1"
                label="Runout From"
                :error="!!runoutErrorMessage"
                :error-messages="runoutErrorMessage"
                :hide-details="false"
                @change="handlePickRunoutCode"
                :disabled="searchOptions.selectedOption !== 'runout'"
            />
          </v-col>

          <v-col cols="3">
            <RunoutCode
                v-model="searchOptions.runout_id2"
                label="Runout To"
                :error="!!runoutErrorMessage"
                :error-messages="runoutErrorMessage"
                :hide-details="false"
                @change="handlePickRunoutToCode"
                :disabled="searchOptions.selectedOption !== 'runout'"
            />
          </v-col>

          <v-col cols="3" class="d-flex align-center">
            <div>
              <v-radio-group v-model="searchOptions.selectedOption">
                <v-radio
                    value="order"

                    class="mr-2 mt-0 mt-4"
                />
              </v-radio-group>
            </div>
            <OrderCode
                v-model="searchOptions.order_id"
                label="By Order"
                variant="underlined"
                :hide-details="false"
                :disabled="searchOptions.selectedOption !== 'order'"
            />
          </v-col>

          <v-col cols="3" class="d-flex align-center">
            <OrderItemCode
                v-model="searchOptions.order_item_id"
                variant="underlined"
                label="By Order Item"
                :hide-details="false"
                :disabled="searchOptions.selectedOption !== 'order'"
                :order_id="searchOptions.order_id"
            />
          </v-col>

          <v-col cols="3" class="d-flex align-center">
            <div>
              <v-radio-group v-model="searchOptions.selectedOption">
                <v-radio
                    value="rolling"

                    class="mr-2 mt-0 mt-4"
                />
              </v-radio-group>
            </div>
            <RollingCode
                v-model="searchOptions.rolling_code"
                label="By Rolling"
                :hide-details="false"
                @change="handlePickRollingCode"
                :disabled="searchOptions.selectedOption !== 'rolling'"
            />
          </v-col>

          <v-col cols="3" class="d-flex align-center">
            <v-select
              v-model="searchOptions.dim3"
              :items="rolling_dim3"
              label="KGM"
              :disabled="searchOptions.selectedOption !== 'rolling' || !rolling_dim3"
            />  
          </v-col>
          <!-- <v-col cols="3" class="d-flex align-center">
            <div>
              <v-radio-group v-model="searchOptions.selectedOption">
                <v-radio
                    value="cast"
                    @change="handleCastSelect"
                    class="mr-2 mt-0 mt-4"
                />
              </v-radio-group>
            </div>
            <CastCode
                v-model="searchOptions.cast_code"
                label="By Cast"
                :hide-details="false"
                @change="handlePicCastCode"
                :disabled="searchOptions.selectedOption !== 'cast'"
            />
          </v-col> -->
          <v-col cols="3" class="d-flex align-center">
            <div>
              <v-radio-group v-model="searchOptions.selectedOption">
                <v-radio
                    value="advice"
      
                    class="mr-2 mt-0 mt-4"
                />
              </v-radio-group>
            </div>
            <AdviceCode
                v-model="advice_code"
                label="By Advice"
                :hide-details="false"
                @change="handlePickAdviceCode"
                :disabled="searchOptions.selectedOption !== 'advice'"
            />
          </v-col>

          <v-col cols="3">
            <div class="d-flex ga-4 align-center">
              <v-btn
                  class="text-none"
                  color="primary"
                  variant="flat"
                  @click="handleSearch"
              >
                {{ $t("global.search") }}
              </v-btn>
              <v-btn
                  class="text-none"
                  color="#e3e3e3"
                  variant="flat"
                  @click="handleReset"
              >
                {{ $t("global.reset") }}
              </v-btn>
            </div>
          </v-col>

          <v-spacer></v-spacer>
        </v-row>


      </v-card>
      <v-card class="mt-6 pa-4" elevation="0" variant="outlined" v-if="control.saveFlag">

      <div class="d-flex align-center mb-4 ga-4 justify-end">
        <v-btn class="text-none" variant="flat" color="primary"  v-if="defaultMillCode =='SRSM' " @click="handleRecommendTests">Recommend Tests</v-btn>

        <v-btn class="text-none" variant="flat" color="primary" @click="handleAddTestCode">
          ADD
        </v-btn>
      </div>
      <v-expansion-panels class="spec-panels" v-model="panel" multiple>
        <v-expansion-panel bg-color="white">
          <v-expansion-panel-title>
            <v-row align="center">
              <v-col cols="12">Manually Specify Test</v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div>
              <v-data-table
                  :headers="TestListTableHeaders"
                  :items="TestListTable"
                  density="default"
                  max-height="100"
                  item-value="id"
              >
              <template #bottom>
              </template>

              <template v-slot:item.test_code="{ item }">
                  <router-link :to="{ name: 'TestEditTable', query: { id: item.test_id } }">{{ item.test_code }}</router-link>
                </template>

              <template v-slot:item.action="{ item }">
                <v-dialog
                    max-width="400"
                    persistent
                >
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                        variant="text"
                        icon="mdi-delete"
                        v-bind="activatorProps"
                    />
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card
                        prepend-icon="mdi-help-circle-outline"
                        text="Deletion is irreversible"
                        title="Confirm to delete data?"
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
                            @click="handleDeleteTestCode(isActive, item)"
                        >
                          Confirm
                        </v-btn>
                      </template>
                    </v-card>
                  </template>
                </v-dialog>
              </template>
              </v-data-table>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>



        <v-expansion-panel bg-color="white">
          <v-expansion-panel-title>
            <v-row align="center">
              <v-col cols="12">Recommend Tests</v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="d-flex justify-end mb-4">
              <v-btn
                color="primary"
                variant="flat"
                class="text-none"
                :disabled="selectedRecommendTests.length === 0"
                @click="handleAddSelectedTests"
              >
                Add to Manually Specify Test
              </v-btn>
            </div>
            <div>
              <v-data-table
                v-model="selectedRecommendTests"
                :headers="TestRecommendTableHeaders"
                :items="TestRecommendListTable"
                density="default"
                max-height="100"
                item-value="test_id"
                show-select
              >
                <template #bottom>
                </template>
                <template v-slot:item.test_code="{ item }">
                  <router-link :to="{ name: 'TestEditTable', query: { id: item.test_id } }">{{ item.test_code }}</router-link>
                </template>
              </v-data-table>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>


      
    </v-card>
      <v-col cols="6">
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none mt-4"
                color="primary"
                variant="flat"
                @click="handleHold"
                v-permission="`Hold`"
            >
              {{ $t("batch_hold_and_cover.button.hold") }}
            </v-btn>
            <v-btn
                class="text-none mt-4"
                color="primary"
                variant="flat"
                @click="unHandleHold"
                v-permission="`Unhold`"
            >
            {{ $t("batch_hold_and_cover.button.unhold") }}
          </v-btn>
            <v-btn
                class="text-none mt-4"
                color="primary"
                variant="flat"
                @click="handCover"
                v-permission="`Cover`"
            >
            {{ $t("batch_hold_and_cover.button.cover") }}
          </v-btn>
            <v-dialog
                max-width="600"
                persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="text-none mt-4" color="primary" variant="flat" :loading="uncoverLoading" v-bind="activatorProps" v-permission="`UnCover`">
                  {{ $t("batch_hold_and_cover.button.uncover") }}
                </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card
                    prepend-icon="mdi-help-circle-outline"
                    text="Are you sure you want to perform the batch uncover operation?"
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
                        @click="uncover(isActive)"
                    >
                      Confirm
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </v-col>

    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-divider />

      <v-col cols="12" class="d-flex justify-end">
          <v-btn
          variant="text"
          icon="mdi-menu"
          @click="handleOpen"
          class="ml-2"
        />
      </v-col>

      <v-data-table-server
          v-model="selected"
          min-height="300"
          height="650"
          :items-per-page="queryParams.itemsPerPage"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          fixed-header
          show-current-page
          return-object
          @update:page="handleTableChangePage"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"
      >
      <template v-slot:item.code="{ item }">
        <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                    :to="{ name: 'finishedProductDetail', query: { id: item.id } }">
          <span class="w-100 d-inline-block">{{ item.code }}</span>
        </router-link>
      </template>
      <template v-slot:item.runout.runout_code="{ item }">
        <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                      :to="{ name: 'RunoutDetail', query: { runout_id: item.runout?.id, runout_code: item.runout?.runout_code } }">
          <span class="w-100 d-inline-block">{{ item.runout?.runout_code }}</span>
        </router-link>
      </template>
      <template v-slot:item.runout="{ item }">
        <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                      :to="{ name: 'RunoutDetail', query: { runout_id2: item.runout?.id } }">
          <span class="w-100 d-inline-block">{{ item.runout?.runout_code }}</span>
        </router-link>
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
        <template v-slot:item.load.code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'finishedProductLoadDetail', query: { load_id: item.load?.id } }">
            <span class="w-100 d-inline-block">{{ item.load?.code }}</span>
          </router-link>
        </template>
        <template v-slot:item.advice="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.advice" :key="tag.id" size="small" @click="unHandleHold">
              {{ tag.advice_code }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <div class="d-flex justify-center ga-2">

            <v-chip size="small" v-if="item.status">
              {{ item.status}}
            </v-chip>
            <span v-else>
            </span>
          </div>
        </template>

        <template v-slot:item.hold_reason="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small" @click="unHandleHold">
              {{ tag.name }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.rework_type="{ item }">
          <div class="justify-center c-clickable" @click="reworkConfirmAction(item)">
            <TreeDictCode variant="underlined" :hide-details="false" code="rework_type" placeholder=""
                          v-model="item.rework_type" :disabled="true"/>
          </div>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>

        <template v-slot:item.cover_msg="{ item }">
            <div class="d-flex justify-center ga-2">
            <v-tooltip v-if="item.cover_msg && item.cover_msg.length > 1" location="top">
                <template v-slot:activator="{ props }">
                    <div v-bind="props">
                    <v-chip size="small">{{ item.cover_msg[0] }}</v-chip>
                    <v-chip size="small">...</v-chip>
                    </div>
                </template>
                    <div v-for="(msg, index) in item.cover_msg" :key="index">
                    {{ msg }}
                    </div>
            </v-tooltip>
            <template v-else>
            <v-chip v-for="(msg, index) in item.cover_msg" :key="index">
            {{ msg }}
            </v-chip>
            </template>
            </div>
        </template>
      </v-data-table-server>
    </v-card>
    
    <AddTestCode ref="AddTestCodeRef" @change="handlePickTestCode"/>
    <HoldProduct ref="holdForm" @refresh="handleSearch"/>
    <UnHoldProduct ref="unHoldForm" @refresh="handleSearch"/>
    <Cover ref="CoverFrom" @refresh="handleSearch"/>
    <MesTable ref="tableRef" name="finished_product_hold"  v-model="tableHeaders" />
  </v-container>
</template>
<script setup>
import {useRoute} from "vue-router";
import {onMounted, getCurrentInstance, reactive, ref, toRaw, toRefs, watch, computed} from "vue";
import {toast} from "vue3-toastify";
import { v4 as uuidv4 } from "uuid";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import HoldProduct from "./components/holdProduct.vue";
import UnHoldProduct from "./components/unHoldProduct.vue";
import AdviceCode from "@/components/picker/AdviceCode.vue";
import Cover from "./components/CoverFrom.vue";
import DictCode from "@/components/picker/DictCode.vue";
import TestSampleApi from "@/test_admin/test_sample/api";
import API from "./api";
import _, {filter, includes, map,toLower} from "lodash";
import {formatDate} from '@/util/util';
import HoldReasonCode from "@/components/picker/HoldReasonCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import TestCode from "@/components/picker/multiple/TestCode.vue";
import AddTestCode from "./components/AddTestCode.vue";
import finishedApi from "@/finished_product/finished_product/api";
import CastCode from "@/components/picker/CastCode.vue";
import MesTable from "@/components/table/index.vue";
import TreeDictCode from "@/components/picker/TreeDictCode.vue";
import { useStore } from "vuex";

const store = useStore();
const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = computed(() => [
  {
    title: proxy.$t("batch_hold_and_cover.table.code"),
    key: "code",
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.runout_code"),
    key: "runout.runout_code",
    value: (item) => item.runout?.runout_code,
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.order_number"),
    key: "order_item.order.order_code",
    value: (item) => `${item.order_item?.order?.order_code || ''}-${item.order_item?.line_item_code || ''}`,
    minWidth: 180,
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.rolling_code"),
    key: "rolling.rolling_code",
    value: (item) => item.rolling?.rolling_code,
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.cast_code"),
    key: "cast.cast_code",
    value: (item) => item.cast?.cast_code,
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.advice"),
    key: "advice",
    sortable: false
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.hold_status"),
    key: "hold_reason",
    sortable: false
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.spec_code"),
    key: "spec.spec_code",
    value: (item) => item.spec?.spec_code,
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.t_result"),
    key: "overall_ten_result",
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.t_cover_by"),
    key: "t_runout_code",
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.c_result"),
    key: "overall_imp_result",
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.c_cover_by"),
    key: "c_runout_code",
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.cover_status"),
    key: "cover_status",
    sortable: true
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.cover_msg"),
    key: "cover_msg",
    sortable: false
  },
  {
    title: proxy.$t("batch_hold_and_cover.table.cover_date"),
    key: "cover_date",
    sortable: false
  }
]);

const printFields = computed(() => [
  { displayName: proxy.$t("batch_hold_and_cover.table.code"), field: "code" },
  { displayName: proxy.$t("batch_hold_and_cover.table.runout_code"), field: "runout_code" },
  { displayName: proxy.$t("batch_hold_and_cover.table.load"), field: "load_code" },
  { displayName: proxy.$t("batch_hold_and_cover.table.advice"), field: "advice_code" },
  { displayName: proxy.$t("batch_hold_and_cover.table.rework_status"), field: "rework_type" },
  { displayName: proxy.$t("batch_hold_and_cover.table.reserve_status"), field: "reserve_status" },
  { displayName: proxy.$t("batch_hold_and_cover.table.status"), field: "status" },
  { displayName: proxy.$t("batch_hold_and_cover.table.hold_reason"), field: "hold_reason" }
]);

const selected = ref([]);
const tableList = ref([]);
const total = ref(0);
const manually_test_check = ref(false);

const data = reactive({
  queryParams: {
    q: null,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
  control: {
    saveFlag: false,
  },
  searchOptions: {
    runout_id1: null,
    runout_id2: null,
    rolling_id: null,
    rolling_code: null,
    cast_id: null,
    cast_code: null,
    order_id: null,
    order_item_id: null,
    reserved_order_id: null,
    reserved_order_item_id: null,
    rework_status: [],
    allocation_status: [],
    load_status: null,
    advice_status: null,
    archieved_status: null,
    product_type_id: [],
    dim1: null,
    dim2: null,
    dim3: null,
    reserve_status: [],
    hold_reason_id:null,
    advice_id: null,
    product_class: null,
    product_category_id: null,
    product_category_code: null,
    site_type_code: null,
    site_code: null,
    stock_type: null,
    store_code: null,
    runoutSelected: false,
    orderSelected: false,
    orderItemSelected: false,
    adviceSelected: false,
    rollingSelected: false,
    castSelected: false,
    selectedOption: null,
  },
  rolling_code: null,
  runout_code1: null,
  runout_code2: null,
  area_code: null,
  cast_code: null,
  hold_reason_code: null,
  load_code: null,
  select_weight: null,
  max_length: null,
  advice_code: null,
  order_item_code: null,
  order_code: null,
  rolling_dim3: [],
  manually_test: null,
  panel: [0],
  test_code: [],
});

const {
  queryParams,
  searchOptions,
  runout_code1,
  runout_code2,
  rolling_code,
  order_code,
  order_item_code,
  area_code,
  cast_code,
  hold_reason_code,
  load_code,
  select_weight,
  max_length,
  advice_code,
  rolling_dim3,
  manually_test,
  panel,
  test_code,
  control,
} = toRefs(data);

const reworkDisabled = computed(() => {
  return selected.value.length === 0 || selected.value.some(item => item.rework_status === 'Rework');
});

const reworkCompleteDisabled = computed(() => {
  return selected.value.length !== 1 || selected.value.some(item => item.rework_status !== 'Rework');
});

const combineDisabled = computed(() => {
  if (selected.value.length !== 2) {
    return true;
  }

  const firstItem = selected.value[0];
  const firstLength = firstItem.length_mm;
  const firstOrderCode = firstItem.order_item?.order?.order_code;
  const firstLineItemCode = firstItem.order_item?.line_item_code;
  const firstRollingCode = firstItem.rolling?.rolling_code;
  return selected.value.some(item => {
    return (
      item.length_mm !== firstLength ||  
      item.rolling?.rolling_code !== firstRollingCode ||  
      item.order_item?.order?.order_code !== firstOrderCode ||  
      item.order_item?.line_item_code !== firstLineItemCode  
    );
  });
});

const getData = () => {
  tableList.value = [];
  const params = {
    ...toRaw(queryParams.value)
  };
  params.fields = [];
  params.ops = [];
  params.values = [];
  switch( searchOptions.value.selectedOption){
    case 'runout':
      if (searchOptions.value.runout_id1) {
        params.runout_id1 = searchOptions.value.runout_id1;
        params.finished_ids = tableList.value.map(item => item.id);
      }
      if (searchOptions.value.runout_id2) {
        params.runout_id2 = searchOptions.value.runout_id2;
      }
      break;
    case 'order':
      if (searchOptions.value.order_id) {
        params.fields.push("order_id");
        params.ops.push("eq");
        params.values.push(searchOptions.value.order_id);
      }
      if (searchOptions.value.order_item_id) {
        params.fields.push("order_item_id");
        params.ops.push("eq");
        params.values.push(searchOptions.value.order_item_id);
      }
      break
    case 'advice':     
      if (searchOptions.value.advice_id) {
        params.advice_id = searchOptions.value.advice_id;
      }
      break
    case 'rolling':
      if (searchOptions.value.rolling_id) {
        params.fields.push("rolling_id");
        params.ops.push("eq");
        params.values.push(searchOptions.value.rolling_id);
      }
      break
  }

  if (searchOptions.value.area_code) {
    params.area_code = searchOptions.value.area_code;
  }
  if (searchOptions.value.cast_id) {
    params.fields.push("cast_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.cast_id);
  }
  if (searchOptions.value.rework_status && searchOptions.value.rework_status.length > 0) {
    params.rework_type = JSON.stringify(searchOptions.value.rework_status)
  }

  if (searchOptions.value.reserve_status && searchOptions.value.reserve_status.length > 0) {
    params.fields.push("reserve_status");
    params.ops.push("in");
    params.values.push(JSON.stringify(searchOptions.value.reserve_status));
  }

  if (searchOptions.value.product_type_id && searchOptions.value.product_type_id.length > 0) {
    params.fields.push("product_type_id");
    params.ops.push("in");
    params.values.push(searchOptions.value.product_type_id);
  }


  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items.map(item => {
        return {
          ...item,
          runout_code: item.runout?.runout_code || "",
          area_code: item.area?.code || "",
          site_type_code: item.site_type?.site_type_code || "",
          site_code: item.site?.code || "",
          order_item_code: item.order_item?.order?.order_code || "",
          line_item_code: item.order_item?.line_item_code || "",
          product_type_code: item.product_type?.code || "",
          spec_code: item.spec?.spec_code || "",
          cast_code: item.cast?.cast_code || "",
          defect_reason_name: item.defect_reason?.name || "",
          load_code: item.load?.code || "",
          test_result: item.test_result || "",
          location: item.location || "",
          reserve_status: item.reserve_status || "",
          status: item.status || "",
          comment: item.comment || "",
          regrade_comment: item.regrade_comment || "",
          advice_code: item.advice?.advice_code || "",
          created_at: formatDate(item['created_at']),
          rework_type: item.rework_type ? item.rework_type.split(',') : [],
          regrade_reason_code: item.regrade_reason?.code || "",
          cover_msg: item.flex_form_data?.cover_msg || [],
          cover_date: formatDate(item.cover_date)
        }
      }) || [];
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

const runoutErrorMessage = computed(() => {
  if (searchOptions.value.runout_id1 && searchOptions.value.runout_id2) {
    return searchOptions.value.runout_id1 > searchOptions.value.runout_id2
      ? "Runout From should be less than Runout To"
      : "";
  }
  return "";
});


const handlePrint = () => {
  const selectedData = toRaw(selected.value);
  const printData = selectedData.map(it => {
    return {
      code: it.code ,
      cut_code: it.cut_code ,
      length_mm: it.length_mm || '',
      mult_code: it.mult_code || '',
      runout_code: it.runout?.runout_code || '',
      area_code: it.area?.code || '',
      site_code: it.site?.code || '',
      site_type_code: it.site_type?.code || '',
      allocated_order_item: `${it.order_item?.order?.order_code || ''}-${it.order_item?.line_item_code || ''}`,
      product_type_code: it.product_type?.code || '',
      spec_code: it.spec?.spec_code || '',
      cast_code: it.cast?.cast_code || '',
      hold_reason: (it?.hold_reason ||[]).map(tag => `${tag.code}-${tag.name}`).join(',') ,
      test_result: it.test_result || '',
      location: it.location || '',
      exist_flag: it.exist_flag || '',
      defect_reason_name: it.defect_reason?.name || '',
      load_code: it.load?.code || '',
      advice_code: it.advice?.advice_code || '',
      rework_type: it.rework_type || '',
      reserve_status: it.reserve_status || '',
      status: it.status || '',
      created_at: it.created_at,
      comment: it.comment || '',
      regrade_comment: it.regrade_comment || '',
      regrade_reason_code: it.regrade_reason?.code || '',
      cover_msg: it.flex_form_data?.cover_msg || [],
      cover_date: formatDate(it.cover_date)
    };
  });
  printJS({
    printable: printData,
    properties: printFields,
    type: "json",
    header: "Finished Product List",
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

const handleRunoutSelect = () => {
  if (!searchOptions.value.runoutSelected) {
    searchOptions.value.runout_id1 = null;
    searchOptions.value.runout_id2 = null;
    runout_code1.value = null;
    runout_code2.value = null;
  }
};

const handleOrderSearch = () => {
  if (!searchOptions.value.orderSelected) {
    searchOptions.value.order_id = null;
    searchOptions.value.order_item_id = null;
  }
}

const handleAdviceSelect = () => {
  if (!searchOptions.value.adviceSelected) {
    advice_code.value = null;
  }
};

const handleRollingSelect = () => {
  if (!searchOptions.value.rollingSelected) {
    searchOptions.value.rolling_code = null;
    searchOptions.value.dim3 = null;
    rolling_dim3.value = [];
  }
}

const handleCastSelect = () => {
  if (!searchOptions.value.castSelected) {
    searchOptions.value.cast_code = null;
  }
}

function handlePickRunoutCode(runout_item) {
  searchOptions.value.runout_id1 = runout_item?.id;
  runout_code1.value = runout_item?.runout_code;
}

function handlePickOrderItem(order_id_item) {
  searchOptions.value.order_item_id = order_id_item?.id;
  order_item_code.value = order_id_item?.order_item_code;
}


function handlePickRunoutToCode(runout_item) {
  searchOptions.value.runout_id2 = runout_item?.id;
  runout_code2.value = runout_item?.runout_code;
}

function handlePickRollingCode(rolling_item) {
  searchOptions.value.rolling_id = rolling_item?.id;
  rolling_code.value = rolling_item?.rolling_code;
  rolling_dim3.value = [rolling_item?.rolling_dim3] || [];
}
function handlePicCastCode(cast_item) {
  searchOptions.value.cast_id = cast_item?.id;
  rolling_code.value = cast_item?.cast_code;
}

function handlePickAdviceCode(advice_id_item) {
  searchOptions.value.advice_id = advice_id_item?.id;
  cast_code.value = advice_id_item?.code;
}



function handleProductWeightLengthChange() {
  const data = toRaw(selected.value); 
  max_length.value = Math.max(...map(data, (item) => item.length_mm));
  const total = data.map((item, index) => ({
    ...item,
    calulated_weight: (Number(item.length_mm || 0) * Number(item.quantity || 0) * Number(item.product_type?.dim3 || 0)) / 1000
  }));
  select_weight.value = total.reduce((accumulator, item) => {
    const CalulatedWeight = item.calulated_weight;
    return typeof CalulatedWeight === 'number' && !isNaN(CalulatedWeight) ? accumulator + CalulatedWeight : accumulator;
  }, 0);
}

const handleSearch = () => {
  selected.value = [];
  if (!runout_code1.value) {
    searchOptions.value.runout_id1 = null;
  }
  if (!runout_code2.value) {
    searchOptions.value.runout_id2 = null;
  }
  if (!hold_reason_code.value) {
    searchOptions.value.hold_reason_id = null;
  }
  if (!advice_code.value) {
    searchOptions.value.advice_id = null;
  }
  if (!load_code.value) {
    searchOptions.value.load_id = null;
  }
  if (!searchOptions.value.product_category_id) {
    searchOptions.value.product_category_code = null;
  }
  if (runout_code1.value && !runout_code2.value) {
    toast.error("Runout To is required when Runout From is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code2.value && !runout_code1.value) {
    toast.error("Runout From is required when Runout To is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code1.value > runout_code2.value) {
    toast.error("Runout From should be less than Runout To", { autoClose: 60000 });
    return; 
  }
  getData();
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

const handleReset = () => {
  searchOptions.value.rework_status = [];
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

const handleTableChangePage = (page) => {
  queryParams.value.page = page;
  getData();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleTableChangeSortBy = (sortBy) => {
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  getData();
}

// 创建新数据
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleHold = () => {
  const items = toRaw(selected.value);
  if (runout_code1.value && !runout_code2.value) {
    toast.error("Runout To is required when Runout From is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code2.value && !runout_code1.value) {
    toast.error("Runout From is required when Runout To is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code1.value > runout_code2.value) {
    toast.error("Runout From should be less than Runout To", { autoClose: 60000 });
    return; 
  }
  if (searchOptions.value.order_id && !searchOptions.value.order_item_id) {
    toast.error("Order item is a required field", { autoClose: 60000 });
    return;
  }
  proxy.$refs["holdForm"].handleShow(
    items, 
    runout_code1.value, 
    runout_code2.value, 
    searchOptions.value.order_id,
    advice_code.value,
    searchOptions.value.rolling_code,
    searchOptions.value.order_item_id,
    searchOptions.value.dim3,
  );
}

const cover_data = reactive({
  form: {
    runout_code1: undefined,
    runout_code2: undefined,
    order_id: undefined,
    advice_id: undefined,
    rolling_id: undefined,
    cast_id: undefined,
    items: [
      {
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      },
    ],
  }
});

const { form } = toRefs(cover_data);


const handCover = () => {
  const items = toRaw(selected.value);
  if (runout_code1.value && !runout_code2.value) {
    toast.error("Runout To is required when Runout From is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code2.value && !runout_code1.value) {
    toast.error("Runout From is required when Runout To is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code1.value > runout_code2.value) {
    toast.error("Runout From should be less than Runout To", { autoClose: 60000 });
    return; 
  }
  const test_ids = toRaw(TestListTable.value)
  
  proxy.$refs["CoverFrom"].handleShow(
    items, 
    runout_code1.value, 
    runout_code2.value, 
    searchOptions.value.order_id,
    searchOptions.value.order_item_id,
    advice_code.value,
    searchOptions.value.rolling_code,
    test_ids,
  );
}


const handleHoldAll = () => {
  const items = toRaw(selected.value);
  proxy.$refs["holdForm"].handleShow(items, "all");
}

const unHandleHold = () => {
  // if (!arr) {
  //   const items = toRaw(selected.value);
  //   console.log('===========dada========item=====', items)
  //   proxy.$refs["unHoldForm"].handleShow(
  //     items, 
  //     id,
  //     runout_code1.value, 
  //     runout_code2.value, 
  //     searchOptions.value.order_id,
  //     advice_code.value,
  //     searchOptions.value.rolling_code
  // );
  // } else {
  //   proxy.$refs["unHoldForm"].handleShow(
  //     [arr],
  //     id,
  //     runout_code1.value, 
  //     runout_code2.value, 
  //     searchOptions.value.order_id,
  //     advice_code.value,
  //     searchOptions.value.rolling_code
  //   );
  // }
  const items = toRaw(selected.value);
  if (runout_code1.value && !runout_code2.value) {
    toast.error("Runout To is required when Runout From is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code2.value && !runout_code1.value) {
    toast.error("Runout From is required when Runout To is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code1.value > runout_code2.value) {
    toast.error("Runout From should be less than Runout To", { autoClose: 60000 });
    return; 
  }
  proxy.$refs["unHoldForm"].handleShow(
    items, 
    runout_code1.value, 
    runout_code2.value, 
    searchOptions.value.order_id,
    advice_code.value,
    searchOptions.value.rolling_code
  );
}

const multAction = () => {
  const items = toRaw(selected.value);
  proxy.$refs["multRef"].handleShow(items);
}

const handleReWork = () => {
  const items = toRaw(selected.value);
  if (items.some(item => item.rework_status == "Rework")) {
    toast.error("Please select the item that has not been reworked", { autoClose: 60000 });
    return;
  }
  proxy.$refs["reWorkRef"].handleShow(items);
}



const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getData();
  }).catch(() => {
    toast.error("Delete Fail", { autoClose: 60000 });
  });
}

const handleDisabled = computed(() => {
  // 根据选中的记录设置禁用条件
  return selected.value.length === 0 || 
         selected.value.some(item => item.advice_id != null) || 
         selected.value.every(item => item.order != selected.value[0].order) ||
         selected.value.some(item => item.order_item_id == null);
});

onMounted(() => {
  if (route.query.area_id) {
    searchOptions.value.area_id = route.query.area_id
    runout_code1.value = route.query.area_code
  }
  // getData();
})
const TestListParams = reactive({
  runout_id: null,
})

const TestListTable = ref([])
const TestListTotal = ref(0)
const TestListLoading = ref(false)
const selectedRecommendTests = ref([])
const TestRecommendListTable = ref([])

const TestListTableHeaders = [
  {title: "Action", key: "action", width: 50, sortable: false, fixed: true},
  {title: "TestSampleCode", key: "test_sample_code", sortable: false},
  {title: "TestCode", key: "test_code", sortable: false},
  {title: "TestRefCode", key: "test_ref_code", sortable: false},
  {title: "Test Type", key: "test_type", sortable: false},
  {title: "Tensile Loc", key:"orientation", sortable: false},
  {title: "Standard", key: "standard", sortable: false},
  {title: "UTS(MPa)", key: "value_mpa", sortable: false},
  {title: "Yield", key: "yield_tt0_5", sortable: false},
  {title: "Elongation A200", key: "elongation_a200", sortable: false},
  {title: "Impact Temp", key: "temp_c", sortable: false},
  {title: "Temp Unit", key: "temp_units", sortable: false},
  {title: "Energy 1", key: "energy_1_j", sortable: false},
  {title: "Energy 2", key: "energy_2_j", sortable: false},
  {title: "Energy 3", key: "energy_3_j", sortable: false},
  {title: "Bend Result", key: "result_1", sortable: false},
];
const TestRecommendTableHeaders = [
  {title: "TestSampleCode", key: "test_sample_code", sortable: false},
  {title: "TestCode", key: "test_code", sortable: false},
  {title: "TestRefCode", key: "test_ref_code", sortable: false},
  {title: "Test Type", key: "test_type", sortable: false},
  {title: "Tensile Loc", key:"orientation", sortable: false},
  {title: "Standard", key: "standard", sortable: false},
  {title: "UTS(MPa)", key: "value_mpa", sortable: false},
  {title: "Yield", key: "yield_tt0_5", sortable: false},
  {title: "Elongation A200", key: "elongation_a200", sortable: false},
  {title: "Impact Temp", key: "temp_c", sortable: false},
  {title: "Temp Unit", key: "temp_units", sortable: false},
  {title: "Energy 1", key: "energy_1_j", sortable: false},
  {title: "Energy 2", key: "energy_2_j", sortable: false},
  {title: "Energy 3", key: "energy_3_j", sortable: false},
  {title: "Bend Result", key: "result_1", sortable: false},
];
const handleAddTestCode = () => {
  proxy.$refs["AddTestCodeRef"].handleShow({
  }, TestListTable.value);
  panel.value = [0]
}

const handlePickTestCode = (arr) => {
  const ids = map(TestListTable.value, "test_id");
  
  const $arr = filter(arr, item => !includes(ids, item.test_id));
  
  if ($arr.length > 0) {
    TestListTable.value.push(...$arr.map(item => item));
  }
}

const handleDeleteTestCode = (isActive, item) => {
  
  let deleteIndex = TestListTable.value.findIndex(elem => elem.id === item.id)
  if (deleteIndex !== -1) {
    TestListTable.value.splice(deleteIndex, 1);
    
  }
  isActive.value = false;
}

const uncoverLoading = ref(false);
const uncover = async (isActive) => {
  isActive.value = false;
  uncoverLoading.value = true;

  const items = toRaw(selected.value);
  if (runout_code1.value && !runout_code2.value) {
    toast.error("Runout To is required when Runout From is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code2.value && !runout_code1.value) {
    toast.error("Runout From is required when Runout To is selected", { autoClose: 60000 });
    return;
  }
  if (runout_code1.value > runout_code2.value) {
    toast.error("Runout From should be less than Runout To", { autoClose: 60000 });
    return; 
  }
  try {
    const response = await API.batchUnCover({
      finished_ids: selected.value.map((item) => item.id),
      // hold_list: Object.values(params.items).map((cur) => cur.hold_id?.id),
      hold_list: [{
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      }]
    },
    {
      "runout_code1": runout_code1.value, 
      "runout_code2": runout_code2.value, 
      "order_id": searchOptions.value.order_id,
      "advice_id": advice_code.value,
      "rolling_id": searchOptions.value.rolling_code,
      "cast_id": searchOptions.value.cast_id
    });
    handleSearch()
    const total_count = response.data.totalc_count
    const success_count = response.data.success_count
    const failure_count = response.data.failure_count

    toast.success(`UnCove Success: A total of ${total_count} data were processed. ${success_count} succeeded, ${failure_count} failed.`, {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || "UnCove Fail", { autoClose: 60000 });
  } finally {
    uncoverLoading.value = false;
  }
};


const handleRecommendTests = () => {
  let params = {}
  switch(searchOptions.value.selectedOption){
    case 'runout':
      if (searchOptions.value.runout_id1) {
        params.runout_id1 = searchOptions.value.runout_id1;
      }
      if (searchOptions.value.runout_id2) {
        params.runout_id2 = searchOptions.value.runout_id2;
      }
      break;
    case 'order':
      if (searchOptions.value.order_id) {
        params.order_id = searchOptions.value.order_id;
      }
      if (searchOptions.value.order_item_id) {
        params.order_item_id = searchOptions.value.order_item_id;
      }
      break
    case 'advice':     
      if (searchOptions.value.advice_id) {
        params.advice_id = searchOptions.value.advice_id;
      }
      break
    case 'rolling':
      if (searchOptions.value.rolling_id) {
        params.rolling_id = searchOptions.value.rolling_id;
      }
      break
  }
  if (Object.keys(params).length == 0) {
    toast.error("Please select a By Option", { autoClose: 60000 });
    return 
  }
  API.recommendTests(params).then((res) => {
    TestRecommendListTable.value = res.data.items
    panel.value = [0,1]
    toast.success(`Successfully Get ${res.data.items.length} test items`, {
      position: "bottom-center"
    }, {autoClose: 6000});
  }).catch((err) => {
    toast.error(err?.response?.data?.detail || "Recommend Tests Fail", { autoClose: 60000 });
  })
}

const handleAddSelectedTests = () => {
  if (selectedRecommendTests.value.length === 0) {
    toast.error("Please select the test items to add", { autoClose: 60000 });
    return;
  }

  const existingIds = new Set(TestListTable.value.map(item => item.test_id));
  const newTests = selectedRecommendTests.value
    .map(testId => TestRecommendListTable.value.find(item => item.test_id === testId))
    .filter(item => item && !existingIds.has(item.test_id));

  if (newTests.length > 0) {
    TestListTable.value.push(...newTests);
    toast.success(`Successfully added ${newTests.length} test items To Manually Specify Tests`, {
      position: "bottom-center"
    }, {autoClose: 6000});
  } else {
    toast.info("The selected test items already exist", { autoClose: 60000 });
  }
  TestRecommendListTable.value = TestRecommendListTable.value.filter(item => !newTests.includes(item));
  
  selectedRecommendTests.value = []; 
}

watch(
  () => selected.value,
  (value) => {    
    if (value.length > 0) {
      handleProductWeightLengthChange()
    }else{
      select_weight.value = null;
      max_length.value = null;
    }
  },
  {
    // once: true,
    immediate: true,
    deep: true,
  }
)
</script>
<style lang="scss" scoped>

.c-clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}

.c-clickable:hover {
  opacity: 0.8;
}

.c-clickable:active {
  opacity: 0.6;
}
</style>
