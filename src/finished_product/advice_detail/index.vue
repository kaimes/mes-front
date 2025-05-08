<template>
  <v-container class="detail-content" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <AdviceCode v-model="queryParams.advice_id" variant="underlined" density="default" :advice="queryParams.advice"></AdviceCode>
        </v-col>
        <v-col cols="4">
          <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
            Reset
          </v-btn>
          <v-btn type="submit" class="text-none ml-4 mr-4" color="primary" variant="flat" :loading="loading">
            Search
          </v-btn>
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="handlePrint(form.business_type)"
              :disabled="!form.id"
          >
            Print
          </v-btn>
          <v-btn
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
              @click="handleLablePrint"
              :disabled="!form.id"
          >
            Label Print
          </v-btn>
        </v-col>

        <v-col cols="2" class="text-right">
          <v-label style="font-size: 40px; font-weight: bold; color: orange;">{{ form.business_type }}</v-label>
        </v-col>

        <v-col cols="4" class="text-right">
          <div class="specsave">
            <div class="specsave-action">
              <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
              <v-switch v-model="save" density="default" hide-details inset></v-switch>
              <div class="ml-14">
                <v-btn type="button" :loading="loading" :disabled="!save" variant="flat" color="primary"
                       @click="handleSave">
                  {{ form.id ? "Update" : "Save" }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <v-form ref="adviceDetailForm" @submit.prevent="handleSave">
      <div class="panel mt-4 mb-4 border">
        <v-row align="center" class="pt-4">
          <v-col cols="2">
            <dict-code
                v-model="form.business_type"
                :disabled="!save"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Business Type"
                :code="`business_type#${defaultMillCode == 'tbm' || defaultMillCode == 'srsm' ? defaultMillCode : 'default'}`"
                :rules="rules.business_type"
            />
          </v-col>

          <!-- <v-col cols="2">
            <dict-code
                v-model="form.type"
                :disabled="!save || form.type === 'BWS' || form.type === 'Roster'"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Advice Type"
                code="advice_type"
            />
          </v-col> -->

          <v-col cols="2">
            <dict-code
                v-model="form.type"
                :disabled="!save || form.business_type === 'scrap' || form.business_type === 'bws' || form.business_type === 'roster' || form.business_type === 'service_center'"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Advice Type"
                code="advice_type"
            />
          </v-col>

          <!-- <v-col cols="2">
            <v-text-field v-model="form.destination" color="#333" density="default"
                          variant="underlined" placeholder="Destination" bg-color="white" clearable :disabled="!save"
                          label="Destination" hide-details></v-text-field>
          </v-col> -->
          <v-col cols="2">
          <SiteType type="finished" v-model="form.destination" :disabled="!save" item-value="site_type_code" density="default"
            label="Destination"/>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.consignee" color="#333" density="default" variant="underlined"
                          placeholder="Consignee" bg-color="white" clearable :disabled="!save" label="Consignee"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <AreaCode
                key="toArea"
                v-model="form.to_area_id"
                :disabled="!save || form.business_type === 'internal'"
                :area="form.to_area"
                label="Location"
                @change="handleItemChange($event, 'to_area_id')"
            />
          </v-col>

          <!-- <v-col cols="2">
            <AreaCode
                key="currArea"
                v-model="form.curr_area_id"
                :disabled="!save || form.business_type === 'internal'"
                :area="form.curr_area"
                label="Current Location"
                @change="handleItemChange($event, 'curr_area_id')"
            />
          </v-col> -->

          <v-col cols="2">
            <OrderCode
                v-model="form.order_id"
                :disabled="!save || form.business_type === 'internal'"
                :order="form.order"
                variant="underlined"
                @change="handleOrderItemChange($event, 'order_id')"
                :rules="rules.order_id"
            />
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.customer" density="default" variant="underlined"
                          placeholder="Customer" bg-color="white" clearable
                          :disabled="!save || form.business_type === 'internal'" label="Customer"
                          hide-details></v-text-field>
          </v-col>
          <!-- <v-col cols="2">
              <OrderItemCode v-model="form.order_item_id" :disabled="!save" variant="underlined"
                          :order_id="form.order_id" :rules="rules.order_item_id"
                          @change="handleItemChange($event, 'order_item_id')"></OrderItemCode>
          </v-col> -->

          <v-col cols="2" v-show="form.id">
            <AdviceCode v-model="form.advice_code" variant="underlined" density="default" disabled
                        hide-details ></AdviceCode>
          </v-col>
          <v-col cols="2">
            <LoadCode
                v-model="form.load_id"
                label="Load Code"
                variant="underlined"
                density="default"
                :load="form.load"
                @change="handleItemChange($event, 'load_id')"
                :disabled="!save || form.business_type === 'internal'"
            />
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.transport_type" density="default" variant="underlined"
                          placeholder="Transport Type"
                          bg-color="white" clearable :disabled="!save " label="Transport Type"
                          hide-details></v-text-field>
          </v-col>

          <!-- <v-col cols="2">
              <v-text-field v-model="form.transport_id" color="#333" density="default"
                  variant="underlined" placeholder="Transport No" bg-color="white" required clearable :disabled="!save" label="Transport No" hide-details></v-text-field>
          </v-col> -->
          <v-col cols="2">
            <TransportCode
                v-model="form.transport_id"
                :disabled="!save"
                label="Transport No"
                :transport="form.transport"
                @change="handleItemChange($event, 'transport_id')"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.haulier" color="#333" density="default" variant="underlined"
                          placeholder="HLR" bg-color="white" clearable
                          :disabled="!save || form.business_type === 'internal'" label="HLR"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <VueDatePicker
                disabled
                v-model="pickShowData.created_at"
                :enable-time-picker="false"
                :teleport="true"
                position="left"
                @update:model-value="handlePickDate($event, 'created_at')"
            >
              <template #trigger>
                <v-text-field
                    disabled
                    v-model="pickShowData.created_at"
                    label="Date"
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
            <v-text-field v-model="form.ship" color="#333" density="default"
                          variant="underlined" placeholder="Ship" bg-color="white" clearable
                          :disabled="!save || form.business_type === 'internal'"
                          label="Ship" hide-details></v-text-field>
          </v-col>
          <v-col cols="2">
            <DictCode
                v-model="form.own_state"
                code="own_state"
                label="Own State"
                item-title="title"
                item-value="value"
                variant="underlined"
                density="default"
                hide-details
                :disabled="!save || form.business_type === 'internal'"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.store" color="#333" density="default" variant="underlined"
                          placeholder="Store" bg-color="white" clearable
                          :disabled="!save  || form.business_type === 'internal'" label="Store"
                          hide-details></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.stocktaker" color="#333" density="default" variant="underlined"
                          placeholder="S/TAKER" bg-color="white" clearable
                          :disabled="!save || form.business_type === 'internal'" label="S/TAKER"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.port" color="#333" density="default" variant="underlined"
                          placeholder="Port" bg-color="white" clearable
                          :disabled="!save" label="Port"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <ShiftCode
                v-model="form.shift_id"
                :disabled="!save"
                label="Shift Code"
                @change="handleItemChange($event, 'shift_id')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <div class="text-subtitle-2 font-weight-regular	mb-2">comment</div>
            <v-textarea v-model="form.comment" color="#333"
                        density="default" variant="outlined" placeholder="comment" :disabled="!save"
                        bg-color="white" clearable></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <!-- 增加一个复选框，叫tip load -->
          <v-col cols="2" class="pt-8">
            <v-checkbox :disabled="!save" label="Tip Load"></v-checkbox>
          </v-col>
        </v-row>
      </div>

      <v-row class="mb-2" align="center">
        <v-col cols="1">
          Total No Bars
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="form.total_no_bars" type="number" color="#333" density="default"
                        variant="underlined" placeholder="Total No Bars" bg-color="white"
                        hide-details
                        clearable disabled></v-text-field>
        </v-col>

        <v-col cols="1">
          Total Weight
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="form.total_weight" type="number" color="#333" density="default"
                        variant="underlined" placeholder="Total Weight" bg-color="white"
                        hide-details
                        clearable disabled></v-text-field>
        </v-col>

        <v-col cols="1">
          Length
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="form.max_length" type="number" color="#333" density="default"
                        variant="underlined" placeholder="Length" bg-color="white"
                        hide-details
                        clearable disabled></v-text-field>
        </v-col>
        <v-col cols="1">
          Actual Weight
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="form.weighted_weight" type="text" color="#333" density="default"
                        variant="underlined" placeholder="Actual Weight" bg-color="white"
                        hide-details :disabled="!save"></v-text-field>
        </v-col>
      </v-row>
      <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
        <div class="d-flex align-center mb-4 ga-4 justify-end">
          <v-btn variant="flat" color="primary" @click="handleAddBar" :disabled="!save">
            ADD
          </v-btn>
        </div>
        <v-divider/>
        <v-data-table-server
            min-height="300"
            :items-per-page="queryParams.itemsPerPage"
            :page="queryParams.page"
            :headers="tableHeaders"
            :items="tableList"
            :items-length="total"
            :loading="loading"
            fixed-header
            show-current-page
            return-object
            @update:options="handleTableChange"
        >
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
                    :disabled="!save"
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
                        @click="handleDeleteBar(isActive, item)"
                    >
                      Confirm
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </template>

        </v-data-table-server>
      </v-card>

      <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
        <v-divider/>
        <v-data-table-server
            min-height="300"
            :items-per-page="queryParams.itemsPerPage"
            :page="queryParams.page"
            :headers="orderItemHeaders"
            :items="orderItemList"
            :items-length="orderItemTotal"
            :loading="loading"
            fixed-header
            show-current-page
            return-object
            @update:options="handleOrderItemTableChange"
        >
          <template v-slot:item.action="{ item }">
            <v-dialog
                max-width="400"
                persistent
            >
              <template v-slot:activator="{ item }">
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
                        @click="handleDeleteOrderItem(isActive, item)"
                    >
                      Confirm
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </template>
        </v-data-table-server>
      </v-card>
    </v-form>
    <AddBar :advice_id="form.id" ref="AddBarRef" @change="handlePickBar"/>
  </v-container>
</template>
<script setup>

import {getCurrentInstance, reactive, ref, toRaw, toRefs, watch} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import {toast} from "vue3-toastify";
import API from "./api";
import XEUtils from "xe-utils";
import AdviceCode from "@/components/picker/AdviceCode.vue";
import LoadCode from "@/components/picker/LoadCode.vue";
import AddBar from "./components/AddBar.vue";
import printJS from "print-js";
import _, {filter, includes, map,toLower} from "lodash";
import {formatDate} from "@/util/util";
import AreaCode from "@/components/picker/AreaCode.vue";
import TransportCode from "@/components/picker/TransportCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import SiteType from "@/components/picker/SiteType.vue";
import ShiftCode from "@/components/picker/ShiftCode.vue";
import { computed } from "vue";
import { error } from "jquery";

const store = useStore();

const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));


const {proxy} = getCurrentInstance();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);

const tableHeaders = ref([
  {title: "Action", key: "action", width: 50, sortable: false, fixed: true},
  {title: "Bar No", key: "code", sortable: false},
  {title: "Product Type", key: "product_type.code", sortable: false},
  {title: "Cast No", key: "cast.cast_code", sortable: false},
  {title: "Mults", key: "mult_code", sortable: false},
  {title: "Order Number", key: "order_code", sortable: false},
  {title: "Line Item Number", key: "order_item_code", sortable: false},
  {title: "Length(mm)", key: "length_mm", sortable: false},
  {title: "Weight", key: "estimated_weight_kg", sortable: false},
  {title: "Status", key: "status", sortable: false},
  // {title: "Exist Flag", key: "exist_flag", sortable: false},
  // {title: "Quality", key: "quality_code", sortable: false},

]);

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

const orderItemHeaders = ref([
  {title: "Action", key: " ", width: 50, sortable: false, fixed: true},
  {title: "Order Number", key: "order_code", sortable: false},
  {title: "Line Item Number", key: "order_item_code", sortable: false},
  {title: "Total Weight(Tonnes)", key: "total_weight", sortable: false},
  {title: "Max Length", key: "max_length", sortable: false},
]);

const orderItemTotal = ref(0);
const orderItemList = ref([]);

const tableList = ref([]);
const total = ref(0);

const printTableList = ref([]);

const data = reactive({
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    advice_id: undefined,
    advice: undefined,
    // load_id: undefined,
    // sortBy: ["updated_at"],
    // descending: [true],
  },
  query: {
    store_no: undefined,
    owner: undefined,
    advice_no: undefined,
    vessel: undefined,
    order_no: undefined,
    item_no: undefined,
  },
  form: {
    id: undefined,
    type: 'transfer',
    business_type: undefined,
    to_area_id: undefined,
    to_area: undefined,
    curr_area_id: undefined,
    curr_area: undefined,
    advice_code: undefined,
    customer: undefined,
    transport_type: undefined,
    transport_id: undefined,
    transport: undefined,
    haulier: undefined,
    destination: undefined,
    ship: undefined,
    total_no_bars: undefined,
    total_weight: undefined,
    max_length: undefined,
    weighted_weight: undefined,
    load_id: undefined,
    load: undefined,
    order_id: undefined,
    order: undefined,
    // order_item_id: undefined,
    // order_item: undefined,
    own_state: undefined,
    stocktaker: undefined,
    consignee: undefined,
    comment: undefined,
    is_load_status: false,

    shift_id: undefined,
    shift: undefined,
    port: undefined,


  },
  pickShowData: {
    created_at: null
  },
  rules: {
    order_id: [
      value => {
        if(form.value.business_type === 'bws' || form.value.business_type === 'roster'){
          if (value) return true
          return 'Order is required.'
        }
        return true
      }
    ],
    business_type: [
      value => {
        if (value) return true
        return 'Business Type is required.'
      }
    ],
  }
});

const {query, form, rules, queryParams, pickShowData} = toRefs(data);


const handleSave = async () => {
  const {valid} = await proxy.$refs["adviceDetailForm"].validate();
  if (!valid) {
    return;
  }
  if (tableList.value.length === 0) {
    toast.error("Please add at least one finished product", { autoClose: 60000 })
    return false;
  }
  form.value['finished_ids'] = _.map(tableList.value, item => item.id);
  const params = toRaw(form.value);

  // params.load_id = params.load?.id
  loading.value = true;
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      // onClose: () => router.push({name: "AdviceDetail", query: {id: res.data?.id}})
      onClose: () => {
        const id = res.data?.id;
        if (id) {
          // 使用 `router.replace` 替换当前页面并传递新的 `id`
          router.replace({ name: "AdviceDetail", query: { id } }).then(() => {
            form.value.id = id;
            getDetailByAdviceId()
          });
        }
      }
    });
  }).catch(error => {
    toast.error(params.id ? `Update Fail: ${error.response.data.detail}` : `Create Fail: ${error.response.data.detail}`, { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
}
const handleLablePrint = async () => {
  const {valid} = await proxy.$refs["adviceDetailForm"].validate();
  if (!valid) {
    return;
  }
  const params = toRaw(form.value);

  loading.value = true;
  API.printLabel(params).then(res => {
    toast.success("Success" , {
      position: "bottom-center",
      delay: 2000,
    });
  }).catch(error => {
    toast.error('Fail:Manual', { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}
const handlePrint = (business_type) => {
  const filteredTableList = printTableList.value.filter(item => item.exist_flag === 'Y' || item.exist_flag === null);
  const total_no_bars = filteredTableList.length || 0;
  const total_weight = filteredTableList.reduce((acc, item) => acc + item.estimated_weight_kg / 1000, 0);

  
  const mergedData = [];
  const grouped = {};

  // 定义不同 `business_type` 需要检查的一致性字段
  // const mergeFieldsMap = {
  //   internal: ["order", "order_item_id", "quantity", "length_mm", "product_type_id", "quality_code", 'rolling_id', 'cust_item_mrk'], 
  //   bws: ["runout_id", "order_item_id", "quantity", "length_mm", "product_type_id", "quality_code", "m", 'c', 's', 'rolling_id', 'cust_item_mrk'], 
  //   roster: ["runout_id", "order_item_id", "quantity", "length_mm", "product_type_id", "quality_code", "m", 'c', 's', 'rolling_id', 'cust_item_mrk'], 
  //   default: [],
  // };

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

  if (business_type == 'internal') {
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
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;" >ADVICE NO: ${form.value.advice_code || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">BRITISH STEEL LIMITED</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">CREATED: ${pickShowData.value.created_at || ""}</div>
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
          <div style="flex: 0 0 36%; max-width: 36%;">CUSTOMER: ${form.value.customer || ''}</div>
          <div style="flex: 0 0 36%; max-width: 36%;">DESTINATION: ${form.value.destination || ''}</div>
          <div style="flex: 0 0 25%; max-width: 28%; text-align: left;"><hr style="border: 1px dashed #000;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">CONSIGNEE: ${form.value.consignee || ''}</div>
        </div>
        <div style="position: absolute; bottom: 0; width: 100%; text-align: center; font-weight: bold;">
          TOTAL   ${total_no_bars || "0"} BARS &nbsp;&nbsp;
          TOTAL CALC WEIGHT   ${total_weight ? total_weight.toFixed(3) : 0 || "0"} TONNES &nbsp;
          
          <hr style="border: 1px dashed #000;">
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 100%; max-width: 100%; text-align: left">COMMENTS: ${form.value.comment || ''}</div>
          </div>
        </div>
        <hr style="border: 1px dashed #000;">
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%; text-align: center">CUSTOMER ORDER NO: ${form.value.order?.customer_po_number || ""}</div>
        </div>
      `,
      repeatTableHeader: true,  // 在每一页上重复表头
      gridHeaderStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-weight: bold; font-size: 10px;',  // 表格头样式
      gridStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-size: 10px;',  // 表格体样式
      headerStyle: 'text-align:center; color:#000; width:100%; border:1px solid #000;',
      scanStyles: false,
      style: '@page { size: auto; margin: 0cm 1cm 0cm 1cm; }', // 页面边距样式
    });
  } else if (business_type == 'scrap') {
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
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;" >ADVICE NO: ${form.value.advice_code || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">BRITISH STEEL LIMITED</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">CREATED: ${pickShowData.value.created_at || ""}</div>
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
          <div style="flex: 0 0 72%; max-width: 72%;">CUSTOMER: ${form.value.customer || ''}</div>
          <div style="flex: 0 0 25%; max-width: 28%; text-align: left;"><hr style="border: 1px dashed #000;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">CONSIGNEE: ${form.value.consignee || ''}</div>
        </div>
        <div style="position: absolute; bottom: 0; width: 100%; text-align: center; font-weight: bold;">
          TOTAL   ${total_no_bars || "0"} BARS &nbsp;&nbsp;
          TOTAL CALC WEIGHT   ${total_weight ? total_weight.toFixed(3) : 0 || "0"} TONNES &nbsp;
          
          <hr style="border: 1px dashed #000;">
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 100%; max-width: 100%; text-align: left">COMMENTS: ${form.value.comment || ''}</div>
          </div>
        </div>
        <hr style="border: 1px dashed #000;">
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%; text-align: center">CUSTOMER ORDER NO: ${form.value.order?.customer_po_number || ""}</div>
        </div>
      `,
      repeatTableHeader: true,  // 在每一页上重复表头
      gridHeaderStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-weight: bold; font-size: 10px;',  // 表格头样式
      gridStyle: 'border: 1px solid #909399; text-align:center; padding: 5px; font-size: 10px;',  // 表格体样式
      headerStyle: 'text-align:center; color:#000; width:100%; border:1px solid #000;',
      scanStyles: false,
      style: '@page { size: auto; margin: 0cm 1cm 0cm 1cm; }', // 页面边距样式
    });
  } else if (business_type === 'bws' || business_type === 'roster'){
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
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;" >ADVICE NO: ${form.value.advice_code || ""}</div>
          <div style="flex: 0 0 3%; max-width: 3%; text-align: center;"> | </div>
          <div style="flex: 0 0 25%; max-width: 25%; text-align: left;">BRITISH STEEL LIMITED</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 72%; max-width: 72%; text-align: left;">CREATED: ${pickShowData.value.created_at || ""}</div>
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
          <div style="flex: 0 0 72%; max-width: 72%;">CUSTOMER: ${form.value.customer || ''}</div>
          <div style="flex: 0 0 25%; max-width: 28%; text-align: left;"><hr style="border: 1px dashed #000;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">PORT: ${form.value.port || ''}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">SHIP: ${form.value.ship || ''}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">HAULIER: ${form.value.haulier || ''}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">CONSIGNEE: ${form.value.consignee || ''}</div>
        </div>

        <div style="position: absolute; bottom: 0; width: 100%; text-align: center; font-weight: bold;">
          TOTAL   ${total_no_bars || "0"} BARS &nbsp;&nbsp;
          TOTAL CALC WEIGHT   ${total_weight ? total_weight.toFixed(3) : 0 || "0"} TONNES &nbsp;
          <hr style="border: 1px dashed #000;">
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 15%; max-width: 15%;">COMMENTS</div>
            <div style="flex: 0 0 2%; max-width: 2%;">:</div>
            <div style="flex: 0 0 78%; max-width: 78%; text-align: left">${form.value.comment || ''}</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
            <div style="flex: 0 0 15%; max-width: 15%;">GEN MARKS</div>
            <div style="flex: 0 0 2%; max-width: 2%;">:</div>
            <div style="flex: 0 0 78%; max-width: 78%; text-align: left">
            ${form.value.order?.order_remarks?.map(remark => `<div style="margin-bottom: 2px; font-size: 10px;">${remark.text}</div>`).join('') || ''}
            </div>
          </div>
        </div>
        <hr style="border: 1px dashed #000;">
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 2px; font-size: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%; text-align: center">CUSTOMER ORDER NO: ${form.value.order?.customer_po_number || ""}</div>
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
          <div style="flex: 0 0 48%;max-width: 48%">Advice No: ${form.value.advice_code || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Advice Type: ${form.value.type || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">Location: ${form.value.to_area?.code || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Customer: ${form.value.customer || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">Transport Type: ${form.value.transport_type || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Transport No: ${form.value.transport?.code || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">HLR: ${form.value.haulier || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Date: ${pickShowData.value.created_at || ""}</div>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 48%;max-width: 48%">Destination: ${form.value.destination || ""}</div>
          <div style="flex: 0 0 48%;max-width: 48%">Ship: ${form.value.ship || ""}</div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 12px;">
          <div style="flex: 0 0 100%; max-width: 100%;">Comment: ${form.value.comment || ""}</div>
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

const handleDelete = (isActive, row) => {

  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getDetailByAdviceId(row.advice_id);
  }).catch(() => {
    toast.error("Delete Fail", { autoClose: 60000 });
  });
}


const handleSearch = () => {
  API.getDetailById(queryParams.value.advice_id).then(res => {
    const {status, data} = res

    if (status === 200) {
      save.value = false;

      // queryParams.value.advice_id = form.value.id
      // queryParams.value.load_id = data.load_id

      getfinished()

      getOrderItems()

      // if (data.order) {
      //     data.order_id = data.order.order_code
      // }
      // if (data.order_item) {
      //     data.order_item_id = data.order_item.line_item_code
      // }
      // console.log("data", data);
      
      form.value = data;
      // if (form.value.type == null) {
      //   form.value.type = 'transfer'
      // }
      // form.value.location = data.to_area?.code;
      // form.value.order_id = data.order?.order_code;
      // form.value.order_item_id = data.order_item?.line_item_code;


    } else {
      // TODO: 添加错误异常提示
    }
  });

}

const getDetailByAdviceId = () => {
  API.getDetailById(route.query.id).then(res => {
    const {status, data} = res

    if (status === 200) {
      save.value = false;

      queryParams.value.advice_id = data.id
      queryParams.value.advice = data


      getfinished()

      getOrderItems()

      form.value = data;

      // if (form.value.type == null) {
      //   form.value.type = 'transfer'
      // }
      // form.value.location = data.to_area?.code;
      // form.value.order_id = data.order;
      // form.value.order_item_id = data.order_item;
      pickShowData.value.created_at = formatDate(data.created_at, "YYYY-MM-DD");


    } else {
      // TODO: 添加错误异常提示
    }
  });
}

const getLoadCode = () => {
  API.getByLoadId(route.query.load_id).then(res => {
    const {status, data} = res
    if (status === 200) {
      // save.value = false;
      form.value.load_id = data.id;
      form.value.load = data;
      // form.value = data;
      pickShowData.value.created_at = formatDate(data.created_at, "YYYY-MM-DD");

    } else {
      // TODO: 添加错误异常提示
    }
  });
}

const getTransportCode = () => {
  API.getByTransportId(route.query.transport_id).then(res => {
    const {status, data} = res
    if (status === 200) {
      form.value.transport_id = data.id;
      form.value.transport = data;

    } else {
      // TODO: 添加错误异常提示
    }
  });
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

// // 使用map函数处理数据
// tableList.value = res.data.map(transformItem);


const getfinished = () => {
  API.getFinishedProduct(queryParams.value).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      // tableList.value = res.data.items || [];
      // tableList.value = res.data.items.map((item, index) => ({
        
      //   ...item,
      //   finished_code: item.runout?.runout_code + item.cut_code || "",
      //   product_type_code: item?.product_type?.code || "",
      //   //   kg: item.kg || "",
      //   cast_code: item?.cast?.cast_code || "",
      //   // order_item_code: item?.order_item?.order?.order_code || "",
      //   // line_item_code: item?.order_item?.line_item_code || "",
      //   length_mm: item.length_mm || "",
      //   status: item.status || "",
      //   quality_code: item?.quality_code || "",
      //   cut_into: item?.cut_into || 0,
      //   order_code: item?.order?.order_code?.slice(-6) || "",
      //   order_item_code: item?.order_item?.line_item_code?.slice(-4) || "",
      //   cut_codes: item?.cut_codes || "",
      //   comment: item?.comment || "",
      //   weight: item?.estimated_weight_kg || 0,
      //   to_area_code: item?.to_area?.code || "",
      //   rolling_code: item?.rolling?.rolling_code || "",
      //   quantity: item?.quantity || 0,
      //   m: "",
      //   c: "",
      //   s: "",
      //   cust_itm_mrk: "",

      // }));
      
      tableList.value = res.data.items.map(transformItem);
      printGetFinished()

    } else {
      total.value = 0;
      tableList.value = []
    }

  }).finally(() => {
    loading.value = false;
  });
}

const printGetFinished = () => {
  const newQueryParams = {
    ...queryParams.value,
    page: 1,
    itemsPerPage: null,
  }
  API.getFinishedProduct(newQueryParams).then(res => {
    if (res.status === 200) {
      printTableList.value = res.data.items.map(transformItem);

    } else {
      printTableList.value = []
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
  if (queryParams.value.advice_id) {
    getfinished()
  }
}

const handleAddBar = () => {
  proxy.$refs["AddBarRef"].handleShow({
    advice_id: form.value.id,
    order_id: form.value.order_id,
    business_type: form.value.business_type,
  }, tableList.value);
}

const handlePickBar = (arr) => {
  const ids = map(tableList.value, "id");
  const $arr = filter(arr, item => !includes(ids, item.id));
  if ($arr.length > 0) {
    tableList.value.push(...$arr.map(transformItem));
  }
}

const handleDeleteBar = (isActive, item) => {
  let deleteIndex = tableList.value.findIndex(elem => elem.id === item.id)
  if (deleteIndex !== -1) {
    tableList.value.splice(deleteIndex, 1);
  }
  isActive.value = false;
}

const handleAdviceBarsWeightChange = () => {

  form.value.total_no_bars = tableList.value.length || 0;
  form.value.total_weight = parseFloat(tableList.value.reduce((accumulator, item) => {
    const estimated_weight_kg = item.estimated_weight_kg;
    return typeof estimated_weight_kg === 'number' && !isNaN(estimated_weight_kg) ? accumulator + estimated_weight_kg / 1000 : accumulator;
  }, 0)).toFixed(3);

  form.value.max_length = tableList.value.reduce((accumulator, item) => {
    const length_mm = item.length_mm;
    return typeof length_mm === 'number' && !isNaN(length_mm) ? Math.max(accumulator, length_mm) : accumulator;
  }, 0);

  const orderItems = tableList.value.map(item => item);
  const order_id = orderItems.length > 0 ? orderItems[0]?.order?.id : undefined;
  // form.value.order_id = form.value.business_type == 'bws' || form.value.business_type == 'roster' ? order_id : form.value.order_id;
  form.value.order_id = order_id;

  form.value.order = orderItems.length > 0 ? orderItems[0]?.order : null;
  const customer = orderItems.length > 0 ? orderItems[0]?.order?.customer_short_name : undefined;
  // form.value.customer = form.value.business_type == 'bws' || form.value.business_type == 'roster' ? customer : form.value.customer;
  form.value.customer = customer;
  // 根据每条finished prodcut的order_id判断业务类型
  const multd = tableList.value.some((item) => item.exist_flag == "N" && item.mult_type == 'M');
  const reworked = tableList.value.some((item) => item.rework_status != 'Complete' && item.rework_status != null);

  if (multd) {
    // form.value.business_type = 'Internal';
    form.value.type = 'mult';
    form.destination = 'Cold Saw';
  } else if (reworked) {
    // form.value.business_type = 'Internal';
    form.value.type = 'rework';
    form.destination = 'rework';
  }
}

const getOrderItems = () => {
  API.getOrderItem({
    ...queryParams.value,
    page: queryParams.value.page,
    itemsPerPage: queryParams.value.itemsPerPage
  }).then(res => {
    if (res.status === 200) {
      orderItemTotal.value = res.data.total || 0;
      orderItemList.value = res.data.items.map(item => ({
        ...item,
        order_item_code: item.line_item_code?.slice(-4) || "",
        order_code: item.order?.order_code?.slice(-6) || "",
      }));
    } else {
      orderItemTotal.value = 0;
      orderItemList.value = [];
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handleOrderItemTableChange = ({page, itemsPerPage}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (queryParams.value.advice_id) {
    getOrderItems();
  }
}

const handlePickDate = (date, field) => {
  pickShowData.value[field] = formatDate(date, "YYYY-MM-DD");
}

const handleItemChange = (item, key) => {
  // form.value.customer = item.customer_short_name
  form.value[`${key}`] = item.id;
}

const handleOrderItemChange = (item, key) => {
  const customer = item.customer_short_name
  // form.value.customer = form.value.business_type == 'bws' || form.value.business_type == 'roster' ? customer : form.value.customer;
  form.value.customer = customer;
  form.value[`${key}`] = item.id;
  form.value.order = item;
}

function handlePickLoadCode(item) {
  form.value.load = item;
  form.value.load_code = item.code;
}

const getFinishedByIds = (ids) => {
  // 将数组中的字符串转换为数字
  ids = ids.map(Number);
  API.getFinishedProductByIds({"item_ids": ids}).then(res => {
    if (res.status === 200) {
      tableList.value = res.data.map(transformItem);
    } else {
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

function get_prefix_for_business_type(business_type) {
  const prefixes = {
    bws: "T",
    service_center: "T",
    roster: "C",
    scrap: "S",
    internal: "",  // No prefix for Internal
  };
  return prefixes[business_type] || "";
}

// const computedAdviceCode = computed(() => {
//   let prefix = "";
//   let new_advice_code = "";
//   console.log('defaultMillCode.value: '+defaultMillCode.value);
//   if (defaultMillCode.value === "tbm"){
//     if (form.value.business_type) {
//       prefix = get_prefix_for_business_type(form.value.business_type);
//     }
//     console.log('advice_code======>', form.value.advice_code.slice(1));
    
//     new_advice_code = prefix + form.value.advice_code.slice(1);
//   }else {
//     new_advice_code = form.value.advice_code;
//   }
//   console.log('new_advice_code: '+new_advice_code);
  
//   return new_advice_code
// });

// 进入页面根据ID获取数据详情

if (route.query.id) {
  form.value.id = route.query.id;
  getDetailByAdviceId()
} else if (route.query.load_id && route.query.ids) {
  getLoadCode()
  getFinishedByIds(route.query.ids)
  form.value.transport_type = route.query.transport_type
  if (route.query.transport_id){
    getTransportCode()
  }
  // form.value.transport_id = route.query.transport_id
  form.value.is_load_status = true
} else if (route.query.load_id) {
  getLoadCode()
  form.value.transport_type = route.query.transport_type
  if (route.query.transport_id){
    getTransportCode()
  }
} else if (route.query.ids){
  getFinishedByIds(route.query.ids)
}
watch(
    () => tableList.value,
    (value) => {
      if (value.length > 0) {
        handleAdviceBarsWeightChange()
      } else {
        form.value.total_no_bars = 0;
        form.value.total_weight = 0;
      }
    },
    {
      // once: true,
      immediate: true,
      deep: true,
    }
)

watch(
  () => form.value.business_type,
  (value) => {
    if (defaultMillCode === 'tbm'){
       let prefix = get_prefix_for_business_type(value);
      let adviceCode = form.value.advice_code || "";

      // 先检查当前 advice_code 是否已有正确的前缀
      const currentPrefix = adviceCode.charAt(0);
      const validPrefixes = ["T", "C", "S"]; // 所有可能的前缀
      const hasValidPrefix = validPrefixes.includes(currentPrefix);

      if (prefix) {
        // 如果 advice_code 已有前缀，且前缀与当前业务类型匹配，则不修改
        if (hasValidPrefix) {
          form.value.advice_code = prefix + adviceCode.slice(1);
        } else {
          // 没有前缀，则直接加上前缀
          form.value.advice_code = prefix + adviceCode;
        }
      } else {
        // 无前缀情况（例如 `internal` 类型）
        if (hasValidPrefix) {
          form.value.advice_code = adviceCode.slice(1); // 去掉前缀
        }
      }
    }
   
    if (value === 'bws' || value === 'roster') {
      // 确保 tableList.value 有数据，避免访问 undefined
      if (tableList.value.length > 0) {
        // 检查是否有 order_id 为空的项
        if (tableList.value.some(item => !item.order_id)) {
          form.value.business_type = null;
          toast.warning('Each selected item must have an order.', {
            position: "bottom-center"
          });
          return;
        }

        // 检查 order_id 是否一致，exist_flag 和 rework_type 是否符合要求
        if (
          !tableList.value.every(item => item.order_id === tableList.value[0].order_id) ||
          tableList.value.some(item => item.exist_flag !== 'Y' && item.exist_flag !== null) || 
          tableList.value.some(item => item.rework_type !== 'Complete' && item.rework_type !== null)
        ) {
          form.value.business_type = null;
          toast.warning('The current finished product orders are inconsistent. Please select a new one.', {
            position: "bottom-center"
          });
        }
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
);


watch(
    () => form.value.type,
    (value) => {
      if (value === 'rework') {
        form.value.destination = 'Rework';
        // form.value.to_area_id = 1425;
      } else if (value === 'mult') {
        form.value.destination = 'Cold Saw';
        // form.value.to_area_id = 1425;
      }
    },
    {
      immediate: true,
    }
);


watch(() => form.value.business_type, (newValue) => {
  if (newValue === 'bws') {
    // console.log('newValue: '+newValue);
    form.value.haulier = '045';
    // form.value.customer = '';
    form.value.type = null;

  } else if (newValue === 'internal') {
    // form.value.customer = 'freestock';
    form.value.haulier = null;
  }
});

</script>
<style lang="scss" scoped>
.detail-content {
  .panel {
    position: relative;
    background-color: #ffffff;
    padding: 42px 16px 16px 16px;
    min-height: 200px;
    border-radius: 12px;

    &-action {
      position: absolute;
      top: 10px;
      right: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 1;
    }
  }

  .specsave {
    position: relative;
    background-color: #ffffff;
    padding: 42px 16px 16px 16px;
    border-radius: 12px;

    &-action {
      position: absolute;
      top: 10px;
      right: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 1;
    }
  }

  .button-container {
    display: flex;
    justify-content: flex-end;
  }
}


</style>
