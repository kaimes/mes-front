<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center" class="mb-2">
        <v-col cols="2">
          <LoadCode
              v-model="searchCode"
              label="Code"
              bg-color="white"
              clearable
              @change="handlePickLoadCode"
          />
        </v-col>
        <v-col cols="6">
          <div class="d-flex align-center ga-2">
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                v-permission="`Search`"
            >
              Search
            </v-btn>
            <v-btn variant="flat" class="text-none" color="primary" @click="handlePrint" v-permission="`Print`">
              Print
            </v-btn>
             <!-- tbm 走 router-link 逻辑 -->
            <router-link
              v-if="defaultMillCode === 'tbm'"
              :to="{
                name: 'AdviceDetail',
                query: {
                  ids: selected.length === 0 ? tableItems.map(item => item.id) : selected.map(item => item.id),
                  load_id: formData.id,
                  transport_type: formData.transport_type,
                  transport_id: formData.transport_id
                }
              }"
            >
              <v-btn class="text-none" color="primary" variant="flat" v-permission="`Create Consignment/Advice`">
                Create Consignment/Advice
              </v-btn>
            </router-link>

            <!-- srsm 走 click 方法 -->
            <v-btn
              v-else
              class="text-none"
              color="primary"
              variant="flat"
              v-permission="`Create Consignment/Advice`"
              @click="handleCreateAdvice"
            >
              Create Consignment/Advice
            </v-btn>
          </div>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-center justify-end">
            <div v-if="newOrEdit === 'new'" class="mt-6 mr-4">
              <v-checkbox :disabled="!hasOperate" v-model="isAutoCreateAdvice" label="Auto Generate Advice"></v-checkbox>
            </div>
            <span
                v-if="newOrEdit === 'edit'"
                class="text-subtitle-2 font-weight-regular mr-2">
              {{ hasOperate ? 'Save' : 'View' }}
            </span>
            <v-switch
                v-if="newOrEdit === 'edit'"
                v-model="hasOperate"
                class="mr-4"
                density="default"
                hide-details
                inset
            ></v-switch>
            <v-btn :disabled="!hasOperate" variant="flat" color="primary" @click="handleSave">
              {{ newOrEdit === 'edit' ? "Update" : "Save" }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <v-card variant="outlined">
      <v-card-text>
        <v-form ref="editForm">
          <v-row>
            <v-col cols="2">
              <v-text-field
                  v-model="formData.pilling_bogie"
                  :disabled="true"
                  variant="plain"
                  label="Pilling Bogie"
                  bg-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                  v-model="formData.code"
                  :disabled="true"
                  variant="plain"
                  label="Code"
                  bg-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <dict-code
                  v-model="formData.business_type"
                  :disabled="!hasOperate"
                  :hide-details="false"
                  bg-color="white"
                  density="default"
                  variant="underlined"
                  color="#333"
                  label="Business Type"
                  code="business_type"
              />
            </v-col>
            <v-col cols="2">
              <MillCode
                  v-model="formData.mill_id"
                  :disabled="!hasOperate"
                  label="Mill Code"
              />
            </v-col>
            <v-col cols="2">
              <AreaCode
                  v-model="formData.to_area_id"
                  :disabled="!hasOperate"
                  label="To Area"
                  :area="formData.to_area"
                  @change="handleItemChange($event, 'to_area_id')"
              />
            </v-col>
            <v-col cols="2">
              <SiteType type="finished" v-model="formData.destination" :disabled="!hasOperate" item-value="site_type_code" density="default"
                label="Destination"/>
            </v-col>
            <v-col cols="2">
              <RollingCode
                  v-model="formData.rolling_id"
                  :disabled="!hasOperate"
                  variant="underlined"
                  label="Rolling Code"
                  :hide-details="false"
              ></RollingCode>
            </v-col>
            <v-col cols="2">
              <OrderCode
                  v-model="formData.order_id"
                  :disabled="!hasOperate"
                  variant="underlined"
                  label="Order"
                  :order="formData.order"
                  :hide-details="false"
              ></OrderCode>
            </v-col>
            <v-col cols="2">
              <OrderItemCode
                  v-model="formData.order_item_id"
                  :disabled="!hasOperate"
                  variant="underlined"
                  label="Item"
                  :hide-details="false"
                  :order_item="formData.order_item"
                  :order_id="formData.order_id"
              ></OrderItemCode>
              
            </v-col>
            <v-col cols="2">
              <!-- <v-text-field
                  v-model="formData.transport_code"
                  :disabled="!hasOperate"
                  label="Transport Code"
                  bg-color="white"
                  hide-details
                  clearable
              ></v-text-field> -->
              <TransportCode
                v-model="formData.transport_id"
                :disabled="!hasOperate"
                label="Transport No"
                :transport="formData.transport"
                @change="handleItemChange($event, 'transport_id')"
            />
            </v-col>
            <v-col cols="2">
              <v-text-field
                  v-model="formData.transport_type"
                  :disabled="!hasOperate"
                  label="Transport Type"
                  bg-color="white"
                  hide-details
                  clearable
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <VueDatePicker
                  :disabled="!hasOperate"
                  v-model="pickShowData.dispatch_date"
                  :enable-time-picker="false"
                  :teleport="true"
                  position="left"
                  @update:model-value="handlePickDate($event, 'dispatch_date')"
              >
                <template #trigger>
                  <v-text-field
                      :disabled="!hasOperate"
                      v-model="formData.dispatch_date"
                      label="Dispatch Date"
                      density="default"
                      variant="underlined"
                      hide-details
                      clearable
                      readonly
                  ></v-text-field>
                </template>
              </VueDatePicker>
            </v-col>
            <v-col cols="2">
              <VueDatePicker
                  :disabled="!hasOperate"
                  v-model="pickShowData.stock_in_date"
                  :enable-time-picker="false"
                  :teleport="true"
                  position="left"
                  @update:model-value="handlePickDate($event, 'stock_in_date')"
              >
                <template #trigger>
                  <v-text-field
                      :disabled="!hasOperate"
                      v-model="formData.stock_in_date"
                      label="Stock In Date"
                      density="default"
                      variant="underlined"
                      hide-details
                      clearable
                      readonly
                  ></v-text-field>
                </template>
              </VueDatePicker>
            </v-col>
            <v-col cols="2">
              <v-text-field
                  v-model="formData.piece_count"
                  :disabled="!hasOperate"
                  label="Piece Count"
                  bg-color="white"
                  hide-details
                  clearable
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                  v-model="formData.total_weight_ton"
                  :disabled="!hasOperate"
                  label="Weight(ton)"
                  bg-color="white"
                  hide-details
                  clearable
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <div>
                <v-tooltip :text="formattedCutSequences" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <v-text-field
                        v-model="formattedCutSequences"
                        :disabled="true"
                        label="Cut Sequence Plan"
                        bg-color="white"
                        hide-details
                    ></v-text-field>
                    </div>
                  </template>
              </v-tooltip>
              </div>
              
            </v-col>
            <v-col cols="2">
              <v-text-field
                  v-model="formData.customer_code"
                  :disabled="!hasOperate"
                  label="Customer Code"
                  bg-color="white"
                  hide-details
                  clearable
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                  v-model="formData.created_at"
                  :disabled="true"
                  variant="plain"
                  label="Created At"
                  bg-color="white"
              ></v-text-field>
            </v-col>

          </v-row>
          <v-row>
            <v-col cols="8">
              <div class="text-subtitle-2 font-weight-regular	mb-2">comment</div>
              <v-textarea v-model="formData.comment" color="#333"
                          density="default" variant="outlined" placeholder="comment" :disabled="!hasOperate"
                          bg-color="white" clearable></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="mt-6" elevation="0" variant="outlined">
      <v-card-title>
        <v-row>
          <v-col cols="6">
            List Of Finished Product
          </v-col>
          <v-col cols="6" class="d-flex align-center justify-end ga-3 flex-wrap mb-4">

            <v-btn
                class="text-none"
                :disabled="selected.length === 0"
                variant="flat"
                color="primary"
                @click="handleMoveBar" 
                v-permission="`Move`">
                
              Move
            </v-btn>

            <v-btn
                class="text-none"
                :disabled="selected.length !== 1"
                variant="flat"
                color="primary"
                @click="handleSplitBar"
                v-permission="`Split`">
              Split
            </v-btn>

            <v-btn :disabled="!hasOperate" variant="flat" color="primary" @click="handleAddBar" v-permission="`Add`">
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <!-- <v-data-table
            fixed-header
            :headers="tableHeaders"
            :items="tableItems"
            :itemsPerPage="-1"
            density="default"

            :loading="tableLoading"
            v-model="selected"
            show-select
            return-object
        > -->
        <v-data-table-server
            :items-per-page="tableOptions.itemsPerPage"
            :page="tableOptions.page"
            :headers="tableHeaders"
            :items="tableItems"
            :items-length="tableTotal"
            :loading="tableLoading"
    
            fixed-header
            v-model="selected"
            show-select
            show-current-page
            return-object
            @update:options="handleTableChange"
        >
       
          <template v-slot:item.rework_type="{ item }">
            <div class="d-flex align-center justify-center c-clickable">
              <span v-html="item.rework_type"></span>
            </div>
          </template>

          <template v-slot:item.cut_sequence="{ item }">
            <span v-html="item.cut_sequence"></span>
          </template>

          <template v-slot:item.bars="{ item }">
            <span v-html="item.bars"></span>
          </template>

          <template v-slot:item.bundle="{ item }">
            <span v-html="item.bundle"></span>
          </template>

          <template v-slot:item.action="{ item }">
            <v-dialog max-width="400" persistent>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn :disabled="!hasOperate" variant="text" icon="mdi-delete" v-bind="activatorProps"/>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card prepend-icon="mdi-help-circle-outline" text="Deletion is irreversible"
                        title="Confirm to delete data?">
                  <template v-slot:actions>
                    <v-spacer></v-spacer>
                    <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="isActive.value = false">
                      Cancel
                    </v-btn>
                    <v-btn class="text-none" color="primary" variant="flat" @click="handleDeleteBar(isActive, item)">
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
      </v-card-text>
    </v-card>
    <AddBar :load_id="formData.id" ref="AddBarRef" @pick-bar="handlePickBar"/>
    <MoveAction ref="moveFormRef" @refresh="handleSearch"/>
    <Split ref="splitForm" @refresh="handleSearch"/>
  </v-container>
</template>
<script name="FinishedProductLoadDetail" setup>
import {computed, getCurrentInstance, reactive, ref, toRaw, toRefs, watch} from "vue";
import {useStore} from "vuex";
import {toast} from "vue3-toastify";
import {_, toLower} from "lodash";
import {useRoute, useRouter} from "vue-router";
import printJS from "print-js";
import {formatDate} from "@/util/util";
import API from "./api";
import LoadCode from "@/components/picker/LoadCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import AreaCode from "@/components/picker/AreaCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import AddBar from "./components/AddBar.vue";
import DictCode from "@/components/picker/DictCode.vue";
import MoveAction from "./components/moveBar.vue";
import Split from "./components/split.vue";
import TransportCode from "@/components/picker/TransportCode.vue";
import SiteType from "@/components/picker/SiteType.vue";

const store = useStore();
const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));
const {proxy} = getCurrentInstance();
const route = useRoute();
const selected = ref([]);
const router = useRouter();

const printFields = ref([
  {displayName: "Code", field: "code"},
  {displayName: "Length(mm)", field: "length_mm"},
  {displayName: "Order No.", field: "order_code"},
  {displayName: "Line Item No.", field: "order_item_code"},
  {displayName: "Spec Code", field: "spec_code"},
  {displayName: "Status", field: "status"},
  // {displayName: "Business Type", field: "stock_type"},
  {displayName: "Area Code", field: "area_code"},
]);

const data = reactive({
  curLoadID: null,
  searchCode: null,
  formData: {
    id: null,
    mill_id: null,
    mill: null,
    rolling_id: null,
    rolling:undefined,
    rolling_code:null,
    order_id: null,
    order: null,
    order_item_id: null,
    order_item: null,
    to_area_id: null,
    to_area: null,
    advice_id: null,
    business_type: null,
    transport_code: null,
    transport_type: null,
    transport_id: null,
    transport: null,
    dispatch_date: null,
    stock_in_date: null,
    piece_count: null,
    total_weight_ton: null,
    cut_sequences: [],
    customer_code: null,
    area_code: null,
    advice_code: null,
    comment: null,
    destination: null,
  },
  pickShowData: {
    dispatch_date: null,
    stock_in_date: null,
  },
  tableHeaders: [
    {title: "Action", key: "action", fixed: true, sortable: false},
    {title: "Code", key: "code", sortable: true},
    {title: "Cut Code", key: "cut_code", sortable: true},
    // {title: 'Cut Sequence', key: 'cut_sequence', sortable: false },
    {title: "Bar Quantity", key: "quantity", sortable: true},
    // {title: "Bundle", key: "bundle", value: (item) => item.bundle, sortable: false, minWidth: 160},
    {title: "Length(mm)", key: "length_mm"},
    {
      title: "Order No.",
      key: "order.order_code",
      value: (item) => item?.order?.order_code,
      sortable: true
    },
    {
      title: "Line Item No.",
      key: "order_item.line_item_code",
      value: (item) => item.order_item?.line_item_code,
      minWidth: 100,
      sortable: true
    },
    {title: "Customer NO.", key: "order.customer_code", value: (item) => item.order?.customer_code,},
    {title: "Customer Name", key: "order.customer_short_name", value: (item) => item.order?.customer_short_name,},
    {title: "Spec Code", key: "spec.spec_code", value: (item) => item.spec?.spec_code, sortable: true},
    {title: "Rework Status", key: "rework_type", sortable: true, minWidth: 160},
    {title: "Status", key: "status", sortable: false},
    
    {title: "Business Type", key: "stock_type", sortable: true},
    {
      title: "Area Code",
      key: "load.area.code",
      value: (item) => item.advice_code ? 'En-Route' : item.area?.code,
      sortable: true
    },
    {title: "Mult Code", key: "mult_code", sortable: true},
    {title: "Exist", key: "exist_flag", sortable: true},

  ],
  tableItems: [],
  tableTotal: 0,
  tableLoading: false,
  tableOptions: {
    q: null,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 100,
    sortBy: defaultMillCode.value == 'tbm' ? ["order_item.line_item_code"] : ["updated_at"],
    descending: [true],
  },
});

const {
  curLoadID,
  searchCode,
  formData,
  rules,
  pickShowData,
  tableHeaders,
  tableItems,
  tableTotal,
  tableLoading,
  tableOptions,
} = toRefs(data);
const newOrEdit = ref('new')
const hasOperate = ref(true)
const isAutoCreateAdvice = ref(false)
const tableOrderItemIDs = computed(() => {
  const orderItemIDs = new Set()
  tableItems.value.forEach((element) => {
    if (element?.order_item?.id) {
      orderItemIDs.add(element.order_item.id)
    }
  })
  return Array.from(orderItemIDs);
})
const tableOrderItemsShow = computed(() => {
  const orderItemsShow = new Set()
  tableItems.value.forEach((element) => {
    if (element?.order_item?.id) {
      orderItemsShow.add(String(element.order_item.order?.order_code) + "-" + String(element.order_item.line_item_code))
    }
  })
  const arrOrderItemsShow = Array.from(orderItemsShow)
  return arrOrderItemsShow.join(", ")
})

const loadTable = () => {
  tableLoading.value = true;
  const params = {
    ...toRaw(tableOptions.value),
    //fields: ["loads.finished_product_load_id"],
    //ops: ["eq"],
    //values: [formData.value.id],

  };
  if (formData.value.id) {
    params.load_id = formData.value.id
  }
  API.getFinishedProducts(params)
      .then((res) => {
        if (res.status === 200) {
          tableTotal.value = res.data.total || 0;
          const dataItems = res.data.items.filter(item => item.exist_flag == "Y") || [];
          tableItems.value = (dataItems || []).map((item) => {
            const cutSequence = item.cut_sequence
              ? item.cut_sequence
                  .sort((a, b) => {
                    const order = { E: 0, W: 1, S: 2 }; // Define order priority
                    const letterA = a.saw_route;
                    const letterB = b.saw_route;
                    const numA = parseInt(a.new_seq, 10);
                    const numB = parseInt(b.new_seq, 10);

                    if (order[letterA] !== order[letterB]) {
                      return order[letterA] - order[letterB]; // Sort letters first
                    }
                    return numA - numB; // Sort numbers within each letter
                  })
                  .map((cs) => `${cs.saw_route}${String(cs.new_seq).padStart(3, '0')}`)
                  .join("<br>")
              : "";

            const bars = item.cut_sequence
              ? item.cut_sequence
                  .map((cs) => `${cs.new_bars || 0}`)
                  .join("<br>")
              : "";

              // const bundle = item.cut_sequence
              // ? item.cut_sequence
              //     .map((cs) => {
              //       const barCount = cs.new_bars || 0;
              //       let bundleText = ""; // Default for zero bars
              //       if (barCount > 0) {
              //         const bundles = Math.floor(barCount / 10); // Full bundles of 10
              //         const remainder = barCount % 10; // Remainder
              //         if (bundles > 0 && remainder > 0) {
              //           // Full bundles with remainder added to the last bundle
              //           bundleText = `${bundles - 1 > 0 ? `${bundles - 1}x10 ,` : ""}1x${10 + remainder}`;
              //         } else if (bundles > 0) {
              //           // Perfectly divisible by 10
              //           bundleText = `${bundles}x10`;
              //         } else {
              //           // Less than 10 bars
              //           bundleText = `1x${barCount}`;
              //         }
              //       }
              //       return bundleText;
              //     })
              //     .join("<br>")
              // : "";

            return {
              ...item,
              code: item.code || "",
              cut_code: item.cut_code || "",
              length_mm: item.length_mm || "",
              order_code: item?.order_item?.order?.order_code || "",
              order_item_code: item?.order_item?.line_item_code || "",
              spec_code: item?.spec?.spec_code || "",
              status: item?.status || "",
              stock_type: item?.stock_type || "",
              area_code: item?.area?.code || "",
              rolling_code: item?.rolling?.rolling_code || "",
              cut_sequence: cutSequence,
              bars: bars,
              // bundle: bundle,
            };
          });

          if (route.query.print === "yes") {
            route.query.print = "no";
            handlePrint();
          }
        } else {
          tableTotal.value = 0;
          tableItems.value = [];
        }
      })
      .finally(() => {
        tableLoading.value = false;
      });


};

const loadData = () => {
  if (!curLoadID.value) {
    return false;
  }

  API.getById(curLoadID.value).then(res => {
    const respData = res.data;
    for (const key in respData) {
      if (key.includes("_date") && respData[key]) {
        respData[key] = formatDate(respData[key], 'YYYY-MM-DD');
      }
    }
    respData["created_at"] = formatDate(respData["created_at"], 'YYYY-MM-DD HH:mm:ss')
    formData.value = respData;

    formData.value.order_id = respData.order_item?.order?.id;
    formData.value.order = respData.order_item?.order;

    formData.value.order_item_id = respData.order_item?.id;
    formData.value.order_item = respData.order_item;
    
    searchCode.value = respData.code;
  }).then(res => {
    loadTable();
  }).catch((error) => {
    handleError(error)
  })
}

const handlePickLoadCode = (item) => {
  searchCode.value = item.code;
}

const searchData = () => {

  if (!searchCode.value) {
    return false;
  }
  API.getByCode(searchCode.value).then(res => {
    const respData = res.data;
    for (const key in respData) {
      if (key.includes("_date") && respData[key]) {
        respData[key] = formatDate(respData[key], 'YYYY-MM-DD');
      }
    }
    formData.value = respData;

    formData.value.order_id = respData.order_item?.order?.id;
    formData.value.order = respData.order_item?.order;

    formData.value.order_item_id = respData.order_item?.id;
    formData.value.order_item = respData.order_item;
    
    
  }).then(res => {
    loadTable();
  }).catch((error) => {
    handleError(error)
  })
}

const handlePrint = () => {
  printJS({
    printable: toRaw(tableItems.value),
    properties: printFields.value,
    type: "json",
    header: `
        <p style="text-align: center">Finished Product Load Detail</p>
        <div style="display: flex; flex-wrap: wrap;flex: 1 1 auto;margin-bottom: 12px">
            <div style="flex: 0 0 25%;max-width: 25%">Code: ${formData.value.code || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Business Type: ${formData.value.business_type || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Mill Code: ${formData.value.mill?.code || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">To Area: ${formData.value.to_area?.code || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Rolling Code: ${formData.value.rolling?.rolling_code || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Transport Code: ${formData.value.transport?.code || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Transport Type: ${formData.value.transport_type || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Dispatch Date: ${formData.value.dispatch_date || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Stock In Date: ${formData.value.stock_in_date || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Piece Count: ${formData.value.piece_count || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Weight(ton): ${formData.value.total_weight_ton || ""}</div>
            <div style="flex: 0 0 25%;max-width: 25%">Customer Code: ${formData.value.customer_code || ""}</div>
        </div>
    `,
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

const handleCreateAdvice = () => {
  let ids = [];
  let items = []
  if (selected.value.length === 0) {
    // hasOperate.value = false;
    items = toRaw(tableItems.value);
  } else {
    items = toRaw(selected.value);
  }
  ids = items.map(item => item.id);

  if (ids.length === 0) {
    toast.warning("No available finished products", {
      position: "bottom-center"
    })
    return false;
  }
  const params = {
    "finished_ids": ids,
    "load_id": formData.value.id,
    "transport_type": formData.value.transport_type,
    "transport_id": formData.value.transport_id
  }
  API.createAdvice(params).then((resp) => {
      toast.success("Create Successfully", {
        position: "bottom-center",
        onClose: () => router.push({
          name: "AdviceList"
        })
      });
    }).catch(error => {
      handleError(error)
    })

}

const createAdviceDisabled = computed(() => {
  // 如果 selected 有选中的记录
  if (selected.value.length > 0) {
    return !selected.value.every(item => item.order_id === selected.value[0].order_id) &&
        !selected.value.every(item => item.allocation_status === selected.value[0].allocation_status) ||
        selected.value.some(item => item.order_item_id == null);  // 判断选中记录中的 order_item_id
  }

  // 如果没有选中的记录，检查 tableItems
  return tableItems.value.length === 0 ||
      tableItems.value.some(item => item.order_item_id == null);  // 判断 tableItems 中的 order_item_id
});

const handleError = (error) => {
  if (error.response) {
    toast.error(error.response.data?.detail, { autoClose: 60000 })
  } else {
    console.log(error)
  }
  return false
}

const handlePickDate = (date, field) => {
  formData.value[field] = formatDate(date, "YYYY-MM-DD");
}

const handleItemChange = (item, key) => {
  formData.value[`${key}`] = item?.id;
}

const handleSearch = () => {

  searchData();
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  if (tableItems.value.length === 0) {
    toast.error("Please add at least one finished product", { autoClose: 60000 })
    return false;
  }
  if (isAutoCreateAdvice.value) {
    if (tableOrderItemIDs.value.length === 0) {
      toast.error("Can't create advice automatically without any order item", { autoClose: 60000 })
      return false;
    }
  }
  hasOperate.value = false;
  formData.value['bind_finished_product_ids'] = _.map(tableItems.value, item => item.id);
  formData.value['is_create_advice'] = isAutoCreateAdvice.value;
  formData.value['create_advice_order_item_ids'] = tableOrderItemIDs;
  API.save(formData.value).then((resp) => {
    toast.success((formData.value.id ? "Updated" : "Saved") + " Successfully", {
      position: "bottom-center"
    });
  }).catch(error => {
    handleError(error)
    hasOperate.value = true;
  })
}

const handleAddBar = () => {
  proxy.$refs["AddBarRef"].handleShow({
    load_id: curLoadID.value,
  });
}
const handleMoveBar = () => {
  const items = toRaw(selected.value);
  proxy.$refs["moveFormRef"].handleShow(items);
  selected.value = [];
}

const handleCreateLoad = () => {
  const items = toRaw(selected.value);
  API.getMaxID().then(res => {
    const maxID = res.data.id
    proxy.$refs["createLoadRef"].handleShow(items, maxID);
  })

}
const handleSplitBar = () => {
  const items = toRaw(selected.value);

  // 检查是否有 quantity 小于1 的数据项
  const hasZeroQuantity = items.some(item => item.qualified_quantity < 1);

  if (hasZeroQuantity) {
    toast.error("Split is not supported when Bars No. < 1", { autoClose: 60000 });
    return;
  }

  // 如果没有 quantity 为 0 的数据项，则执行 Split 操作
  proxy.$refs["splitForm"].handleShow(items);
  selected.value = [];

}

const handlePickBar = (arr) => {
  const ids = _.map(tableItems.value, 'id');
  const $arr = _.filter(arr, (o) => !_.includes(ids, o.id));
  if ($arr.length > 0) {
    tableItems.value.push(...$arr);
  }
}

const handleDeleteBar = (isActive, item) => {
  let deleteIndex = tableItems.value.findIndex(elem => elem.id === item.id)
  if (deleteIndex !== -1) {
    tableItems.value.splice(deleteIndex, 1);
  }
  isActive.value = false;
}

const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  tableOptions.value.page = page;
  tableOptions.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    tableOptions.value.sortBy = sortBy;
  }
  handleSearch()
}

if (route.query.load_id) {
  curLoadID.value = route.query.load_id;
  newOrEdit.value = 'edit';
  hasOperate.value = false;
}
loadData();


watch(
  () => defaultMillCode.value,
  (value) => {
    if (value) {
      formData.value.destination = value == 'srsm' ? 'Redbourn': null
    }
  },
  {
    immediate: true,
    // deep: true
  }
)

// 定义 computed 属性
const formattedCutSequences = computed(() => {
  let displayArray = formData.value.cut_sequences.map(item => {
    let load_no_format = String(item.new_seq).padStart(3, '0');
    return `${item.saw_route}${load_no_format}`;
  });
  // 将数组元素拼接成字符串
  return displayArray.join(', ');
});


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
