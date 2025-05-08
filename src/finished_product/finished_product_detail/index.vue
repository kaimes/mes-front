<template>
  <v-container class="detail-content" fluid>
    <div class="pb-4">
      <v-form ref="searchForm" @submit.prevent="handleSearch">
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="query.cut_code" label="Cut Code." variant="underlined"
                          placeholder="Please enter cut code." bg-color="white" hide-details clearable></v-text-field>
          </v-col>
          <v-col cols="3">
            <RollingCode v-model="query.rolling_no" item-value="rolling_no" density="default"></RollingCode>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="query.kg" label="KG" variant="underlined"
                          placeholder="Please enter KG" bg-color="white" hide-details clearable></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-btn class="text-none ml-4" color="#e3e3e3" variant="flat" @click="handleReset">
              Reset
            </v-btn>
            <v-btn type="submit" class="text-none ml-4 mr-4 my-1" color="primary" variant="flat" :loading="loading">
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <v-form ref="finishedDetailForm" @submit.prevent="handleSave">
      <div class="panel border">
        <div class="panel-action">
          <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
          <v-switch v-model="save" density="default" hide-details inset></v-switch>
          <div class="ml-4">
            <v-btn type="submit" :disabled="!save" :loading="loading" variant="flat" color="primary">
              {{ form.id ? "Update" : "Save" }}
            </v-btn>
          </div>
        </div>
        <v-row align="center" class="pt-4 mt-10">
          <v-col cols="2">
            <MillCode v-model="form.mill_id" :disabled="!save" :hide-details="false" :rules="rules.mill_id" />
          </v-col>
          <v-col cols="2">
            <DictCode v-model="form.type" :disabled="!save" density="default" variant="underlined" :hide-details="false"
                          placeholder="Type" label="Type" bg-color="white" code="finished_product_type" clearable :rules="rules.type"/>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.code" :disabled="!save" density="default" variant="underlined"
                          placeholder="Finished Product Code" label="Finished Product Code"
                          bg-color="white" clearable :rules="rules.code"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.cut_code" :disabled="!save" density="default" variant="underlined"
                          placeholder="Cut Code" label="Cut Code" bg-color="white" clearable :rules="rules.cut_code"></v-text-field>
          </v-col>
          <v-col cols="2">
            <RunoutCode v-model="form.runout_code" :disabled="!save" variant="underlined" :hide-details="false"
                       @change="handleRunoutChange($event, 'runout_id')" :rules="rules.runout_code"></RunoutCode>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.length_mm" :disabled="!!form.id" density="default" variant="underlined"
                          placeholder="Length(mm)" label="Length(mm)" bg-color="white" clearable :rules="rules.length_mm"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.orig_length_mm" :disabled="!!form.id" density="default" variant="underlined"
                          placeholder="Orig Length" label="Orig Length(mm)" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.defective_length" :disabled="!disabled" density="default" variant="underlined"
                       placeholder="Defective Length" label="Defective Length(mm)" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.quantity" :disabled="!save" density="default" variant="underlined"
                          placeholder="Quantity" label="Quantity" bg-color="white" clearable :rules="rules.quantity"></v-text-field>
          </v-col>
          <v-col cols="2">
            <ProductTypeCode
                v-model="form.product_type_code"
                :disabled="!save"
                variant="underlined"
                :hide-details="false"
                @change="handleItemChange($event, 'product_type_id')"
                :product_type_id="form.product_type_id"
                :rules="rules.product_type_code"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.estimated_weight_kg" :disabled="!save" density="default" variant="underlined"
                          placeholder="KG" label="Weight (kg)" bg-color="white" clearable :rules="rules.estimated_weight_kg"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.thickness_mm" :disabled="!save" density="default" variant="underlined"
                          placeholder="Thickness(mm)" label="Thickness(mm)" bg-color="white" clearable></v-text-field>
          </v-col>
          
          <v-col cols="2">
            <OrderCode v-model="form.order_code" :disabled="!save" variant="underlined" :hide-details="false"
                       @change="handleItemChange($event, 'order_id')"></OrderCode>
          </v-col>
          <v-col cols="2">
            <OrderItemCode v-model="form.order_item_code" :disabled="!save" variant="underlined" :hide-details="false"
                           @change="handleItemChange($event, 'order_item_id')"></OrderItemCode>
          </v-col>
          <v-col cols="2">
            <SpecCode label="Spec Code" v-model="form.spec_code" variant="underlined" :disabled="!save" density="default"
                      :hide-details="false" @change="handleItemChange($event, 'spec_id')"></SpecCode>
          </v-col>
          <v-col cols="2">
              <DictCode
                v-model="form.stock_type"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                :hide-details="false"
                label="Business Type"
                :code="`business_type#${defaultMillCode}`"
                :disabled="!save"
            />
          </v-col>
          

          <v-col cols="2">
            <v-text-field v-model="form.defect_quantity" disabled density="default" variant="underlined"
                          placeholder="No. Defects" label="No. Defects" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
           <v-text-field v-model="form.defect_reason.code" disabled density="default" variant="underlined"
                         placeholder="Defect Reason" label="Defect Code" bg-color="white" clearable>
                         </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.regrade_reason.code" disabled density="default" variant="underlined"
                          placeholder="Regrade Reason" label="Regrade Reason" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <RollingCode
              v-model="form.rolling_code"
              :disabled="!save"
              density="default"
              variant="underlined"
              :hide-details="false"
              @change="handleItemChange($event, 'rolling_id')"
            ></RollingCode>
          </v-col>
          <v-col cols="2">
              <v-text-field
                v-model="form.roll_ref_code"
                bg-color="white"
                disabled density="default"
                variant="underlined"
                color="#333"
                label="Roll Ref Code"
                :hideDetails="false"
              ></v-text-field>
          </v-col>
          <v-col cols="2">
            <CastCode label="Pri Cast No" v-model="form.cast_code" variant="underlined" :disabled="!save" :hide-details="false"
                      @change="handleItemChange($event, 'cast_id')"></CastCode>
          </v-col>
          <v-col cols="2">
            <CastCode label="Sec Cast No." v-model="form.sec_cast_id" variant="underlined" :disabled="!save" :hide-details="false"
                      @change="handleItemChange($event, 'sec_cast_id')"></CastCode>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.multed_with" type="number" color="#333" label="Mults"
                          :disabled="!save" density="default" variant="underlined" placeholder="Multed with"
                          bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.load.code" disabled density="default" variant="underlined"
                          placeholder="Load No." label="Load No." bg-color="white" clearable></v-text-field>
          </v-col>
           <v-col cols="2">
            <v-text-field v-model="form.load.load_status" disabled density="default" variant="underlined"
                          placeholder="Load Status" label="Load Status" bg-color="white" clearable></v-text-field>
          </v-col>
          <!-- <v-col cols="2">
            <v-text-field v-model="form.advice.advice_code" density="default" variant="underlined"
                          placeholder="KG" label="Advice No." bg-color="white" clearable></v-text-field>
          </v-col> -->
          <v-col cols="2">
            <DictCode
              v-model="form.status"
              :disabled="!save"
              density="default"
              variant="underlined"
              label="Status"
              code="finished_product_status"
              :hide-details="false"
              :rules="rules.status"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.alt_spec" type="number" color="#333" label="Alterative Spec"
                          :disabled="!save" density="default" variant="underlined" placeholder="Alt Spec"
                          bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.pass_tests" color="#333" label="Test Result"
                          :disabled="!save" density="default" variant="underlined" placeholder="PASS TESTS"
                          bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.area_code" color="#333" label="Area Code"
                          disabled density="default" variant="underlined" placeholder="Area Code"
                          bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.location" :disabled="!save" density="default" variant="underlined"
                          placeholder="Location" label="Location" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.quality_code" disabled density="default" variant="underlined"
                          placeholder="Quality Code" label="Quality Code" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.ship" :disabled="!save" density="default" variant="underlined"
                          placeholder="Ship Code" label="Ship Code" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.association" disabled density="default"
                          variant="underlined" placeholder="Parent Bundles Code" bg-color="white" label="Parent Bundles Code"
                          clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.created_at" disabled density="default" variant="underlined"
                          placeholder="Created Date & Time" label="Created Date & Time" bg-color="white" clearable></v-text-field>
          </v-col>
          
          <v-col cols="2">
            <v-text-field v-model="form.store_code" :disabled="!save" density="default" variant="underlined"
                          placeholder="Store" label="Store" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <DictCode code="cover_status" v-model="form.cover_status" disabled class="mb-4" label="Cover Status" placeholder="Cover Status"/>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.cover_date" disabled density="default" variant="underlined"
                          placeholder="Cover Date" label="Cover Date" bg-color="white" clearable></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.sawn_by" :disabled="!save" density="default" variant="underlined"
                          placeholder="Sawn By" label="Sawn By Shift" bg-color="white" clearable></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div class="panel border mt-4">
        <div class="text-subtitle-1 ml-4 mr-4 mb-2">Current Holds</div>
        <v-divider></v-divider>
        <v-data-table
            :headers="unHoldTableHeaders"
            :items="unHoldTableList"
            density="default"
            item-value="id"
        >
          <template #bottom>
            <!-- Leave this slot empty to hide pagination controls -->
          </template>
        </v-data-table>
      </div>

      <div class="panel border mt-4">
        <div class="text-subtitle-1 ml-4 mr-4 mb-2">Linked Tests</div>
        <v-divider></v-divider>

        
        <v-data-table-server
            min-height="300"
            :headers="LinkedTestsTableHeaders"
            :items="LinkedTestsTableList"
            :loading="LinkedTestsTableLoading"
             :items-length="total"
             @update:page="changeTablePage"
             @update:itemsPerPage="changeTableItemsPerPage"
            @update:sortBy="changeTableSortBy"
            item-value="id"
            fixed-header
            show-current-page
        ></v-data-table-server>
      </div>

      <div class="panel border mt-4">
        <div class="text-subtitle-1 ml-4 mr-4 mb-2">Required Tests</div>
        <v-divider></v-divider>
        <v-data-table
            :headers="RequiredTestTableHeaders"
            :items="RequiredTestTableList"
            density="default"
            item-value="id"
        >
          <template #bottom>
            <!-- Leave this slot empty to hide pagination controls -->
          </template>
        </v-data-table>
      </div>

    </v-form>
  </v-container>
</template>
<script setup>

import {getCurrentInstance, reactive, ref, toRaw, toRefs, watch, computed} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import RollingCode from "@/components/picker/RollingCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import {toast} from "vue3-toastify";
import API from "./api";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import BusinessType from "@/components/picker/BusinessType.vue";
import DictCode from "@/components/picker/DictCode.vue";
import TensileCard from "@/test_admin/test_list/components/tensileCard.vue";
import ProductSizeRollRefCode from "@/components/picker/ProductSizeRollRefCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import _, {toLower} from "lodash"
import {formatDate} from "@/util/util";
import App from "@/App.vue";

const store = useStore();

const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));


const {proxy} = getCurrentInstance();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);

const LinkedTestsTableHeaders = ref([
  { title: "Finished Product Code", key: "finished_product.code", sortable: false },
  { title: "Test Code", key: "test.test_code", sortable: false },
  { title: "Covered Weight KG", key: "covered_weight_kg", sortable: false },
  { title: "Covered Quantity", key: "covered_quantity", sortable: false },
  { title: "Cast", key: "finished_product.cast.cast_code", sortable: false },
  { title: "Type", key: "test.type", sortable: false },
  { title: "Temp", key: "temp", sortable: false },
  { title: "Temp Units", key: "temp_units", sortable: false },
  { title: "Nominated Time", key: "created_at", sortable: false },
  { title: "Test Result", key: "result", sortable: false },
]);

const LinkedTestsTableList = ref([]);
const LinkedTestsTableLoading = ref(false);
const total = ref(0)
const unHoldTableHeaders = ref([
  // { title: "Code", key: "finished_product_code", sortable: false },
  { title: "Hold Code", key: "code", sortable: false },
  { title: "Hold Type", key: "type", sortable: false },
  { title: "Comment", key: "comment", sortable: false },
]);

const unHoldTableList = ref([]);


const queryParams = reactive({
  q: undefined,
  page: 1,
  itemsPerPage: 10,
  sortBy: ['created_at'],
  descending: [true],
  fields: [],
  ops: [],
  values: [],
});



const changeTablePage = (page) => {
  queryParams.page = page;
  getTestCoverageId(route.query.id);
}

const changeTableItemsPerPage = (itemsPerPage) => {
  queryParams.itemsPerPage = itemsPerPage;
  getTestCoverageId(route.query.id);
}

const changeTableSortBy = (sortBy) => {
  if (sortBy.length === 0 ) {
    queryParams.sortBy = ['created_at'];
    queryParams.descending = [true];
  }else{
    queryParams.sortBy = sortBy;
  }
  getTestCoverageId(route.query.id);
}


const RequiredTestTableHeaders = ref([
  // { title: "Code", key: "finished_product_code", sortable: false },
  { title: "Finished Product Code", key: "finished_product.code", sortable: false },
  { title: "Requested Test Type", key: "requested_test_type", sortable: false },
  { title: "Requested Test Sub-Type", key: "requested_test_sub_type", sortable: false },
  { title: "Requested Test Desc", key: "requested_test_desc", sortable: false },
  { title: "Inspector", key: "inspector_id", sortable: false },
]);

const RequiredTestTableList = ref([]);

const TestBundleTableHeaders = ref([
  // { title: "Code", key: "finished_product_code", sortable: false },
  { title: "Finished Product Code", key: "finished_product.code", sortable: false },
  { title: "Nominated Code", key: "test_code", sortable: false },
  {
    title: "Nominated Test Date Time",
    key: "test_date",
    sortable: false,
    value: (item) => {
      if (!item.test_date || item.test_date.length !== 12) return "Invalid";
      const year = item.test_date.slice(0, 4);
      const month = item.test_date.slice(4, 6);
      const day = item.test_date.slice(6, 8);
      const hour = item.test_date.slice(8, 10);
      const minute = item.test_date.slice(10, 12);
      return `${year}/${month}/${day} ${hour}:${minute}`;
    },
  },
  { title: "Orphan Batch", key: "orphan_batch", sortable: false },
  { title: "Cast", key: "cast_id", sortable: false },
  { title: "Weight", key: "weight", sortable: false },
  { title: "Operation", key: "operation", sortable: false },
  { title: "Test Type", key: "test_type", sortable: false },
  { title: "Bundle Code", key: "bundle_code", sortable: false },
  { title: "Test Result", key: "result", sortable: false },
]);

const TestBundleTableList = ref([]);


const data = reactive({
  query: {
    cut_code: undefined,
    rolling_no: undefined,
    kg: undefined,
  },
  form: {
    id: undefined,
    type: defaultMillCode.value == 'tbm' ? 'piece' : defaultMillCode.value == 'srsm' ? 'bundlen' : undefined,
    code: undefined,
    cut_code: undefined,
    sawn_by: undefined,
    rolling_no: undefined,
    rolling_id: undefined,
    kg: undefined,
    length_mm: undefined,
    orig_length_mm: undefined,
    cast_no: undefined,
    cast_id: undefined,
    sec_cast_id: undefined,
    spec_code: undefined,
    spec_id: undefined,
    pass_tests: undefined,
    location: undefined,
    multed_with: undefined,
    runout_id: undefined,
    order_no: undefined,
    order_id: undefined,
    item_no: undefined,
    item_id: undefined,
    onward: undefined,
    bundle: undefined,
    alt_spec: undefined,
    stock_type: undefined,
    store_code: undefined,

    nominal_f1: undefined,
    actual_f1: undefined,
    nominal_f2: undefined,
    actual_f2: undefined,
    nominal_f3: undefined,
    actual_f3: undefined,
    nominal_f4: undefined,
    actual_f4: undefined,
    nominal_fh1: undefined,
    actual_fh1: undefined,
    nominal_fh2: undefined,
    actual_fh2: undefined,
    nominal_fh3: undefined,
    actual_fh3: undefined,
    nominal_fh4: undefined,
    actual_fh4: undefined,
    nominal_b1: undefined,
    actual_b1: undefined,
    nominal_b2: undefined,
    actual_b2: undefined,
    nominal_d: undefined,
    actual_d: undefined,
    nominal_weight: undefined,
    calculated_weight: undefined,
    difference: undefined,
    off_centre_web: undefined,
    flange_variation: undefined,
    information_to_banks: undefined,

    cast_code: undefined,
    sec_cast_code: undefined,
    runout_code: undefined,
    rolling_code: undefined,
    area_code: undefined,
    order_code: undefined,
    order_item_code: undefined,
    product_type_id:undefined,
    product_size_id:undefined,
    product_size:undefined,
    defect_reason: {
      code: undefined,
    },
    regrade_reason: {
      code: undefined,
    },
    load: {
      code: undefined,
      load_status: undefined,
    },
    advice: {
      advice_code: undefined,
    },

    downgraded: undefined,
    cover_status: undefined,
    estimated_weight_kg:undefined,
  },
  rules: {
    mill_id: [
      value => {
        if (value) return true
        return 'Mill is required.'
      }
    ],
    type: [
      value => {
        if (value) return true
        return 'Type is required.'
      }
    ],
    code: [
      value => {
        if (value) return true
        return 'Code is required.'
      }
    ],
    cut_code: [
      value => {
        if (value) return true
        return 'Cut Code is required.'
      }
    ],
    runout_code: [
      value => {
        if (value) return true
        return 'Runout Code is required.'
      }
    ],
    length_mm: [
      value => {
        if (value) return true
        return 'Length is required.'
      }
    ],
    quantity: [
      value => {
        if (value) return true
        return 'Quantity is required.'
      }
    ],
    estimated_weight_kg: [
      value => {
        if (value) return true
        return 'Weight is required.'
      }
    ],
    status: [
      value => {
        if (value) return true
        return 'Status is required.'
      }
    ],
    product_type_code: [
      value => {
        if (value) return true
        return 'Product Type is required.'
      }
    ],
  },
});

const {query, form, rules} = toRefs(data);


const handleSave = async () => {

  const {valid} = await proxy.$refs["finishedDetailForm"].validate();
  if (!valid) {
    return;
  }

  if (form.value.advice === null) {
    form.value.advice = { advice_code: undefined };
  }
  if (form.value.defect_reason === null) {
    form.value.defect_reason = { code: undefined };
  }
  if (form.value.regrade_reason === null) {
    form.value.regrade_reason = { code: undefined };
  }
  if (form.value.load === null) {
    form.value.load = {code: undefined,load_status: undefined};
  }
  if (form.value.defect_reason.code === '' ){
        form.value.defect_reason = undefined
      }
  delete form.value.order_code
  delete form.value.order_item_code
  delete form.value.advice
  delete form.value.association
  const params = toRaw(form.value);

  loading.value = true;
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  }).catch(() => {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
}

const handleSearch = () => {

  API.getBySearch(query.value).then(res => {
    const {status, data} = res

    if (status === 200) {
      save.value = false;

      if (data.cast) {
        data.cast_code = data.cast.cast_code
      }
      if (data.runout) {
        data.runout_code = data.runout.runout_code
      }
      if (data.rolling) {
        data.rolling_code = data.rolling.rolling_code
      }
      if (data.area) {
        data.area_code = data.area.code
      }
      if (data.spec) {
        data.spec_code = data.spec.spec_code
      }
      if (data.order) {
        data.order_code = data.order.order_code
      }
      if (data.order_item) {
        data.order_item_code = data.order_item.line_item_code
      }
      if (data.product_size) {
        data.product_size_id = data.product_size.id
      }

      if (data.created_at){
        data.created_at = formatDate(data.created_at)
      }
      if (data.cover_date){
        data.cover_date = formatDate(data.cover_date)
      }

      form.value = data;

      if (_.isEmpty( form.value.defect_reason)){
        form.value.defect_reason = {code: ''}
      }

      if (_.isEmpty( form.value.regrade_reason)){
        form.value.regrade_reason = {code: ''}
      }

      if (_.isEmpty( form.value.load)){
        form.value.load = {code: ''}
      }

      query.value.cut_code = data.cut_code
      query.value.rolling_no = data.rolling_code
      query.value.kg = data.kg

      // 检查 association 是否为数组且包含至少一个元素
      if (Array.isArray(form.value.association) && form.value.association.length > 0) {
        form.value.association = form.value.association.map(item => item.code);
      } else {
        form.value.association = [];
      }
    } else {

      // TODO: 添加错误异常提示
    }
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Search Empty", { autoClose: 60000 });
  });

}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item?.id;

  if (key =='product_type_id'){

    form.value.thickness_mm = item?.flange_thickness;
    form.value.estimated_weight_kg = item?.dim3;
  }
}

const handleRunoutChange = (item, key) => {
  if(item && item.id){
    form.value[`${key}`] = item?.id;

    form.value.rolling_code = item?.rolling?.rolling_code;
    form.value.rolling_id = item?.rolling_id;

    form.value.product_type_code = item?.product_type?.code;
    form.value.product_type_id = item?.product_type_id;

    form.value.thickness_mm = item?.product_type?.flange_thickness;
    form.value.estimated_weight_kg = item?.product_type?.dim3;

    form.value.cast_code = item?.cast?.cast_code;
    form.value.cast_id = item?.cast_id;
    

    if (!route.query.id) {
       // 自动获取下一个code和cut_code
      API.getMaxCutCode(item.id).then(res => {
        if (res.status == 200 && res.data.cut_code && res.data.runout_code){
          form.value.cut_code = res.data.cut_code;
          form.value.code = res.data.runout_code + res.data.cut_code;
        }else{
          form.value.cut_code = undefined;
          form.value.code = undefined;
        }

      });
      
    }
   
  
  }
}
const getTestCoverageId = (id) => {
  const params = toRaw(queryParams)
  LinkedTestsTableLoading.value = true;
  params.fields.push('finished_product_id')
  params.ops.push('eq')
  params.values.push(id)

  API.getTestCoverageId(params).then(res => {
    const {status, data} = res
    if (status === 200) {
      total.value = data.total

      LinkedTestsTableList.value = data.items.map(item => {
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
      // TODO: 添加错误异常提示
    }
  }).finally(() => {
    LinkedTestsTableLoading.value = false;
  });
}

const getRequiredTests = (id) => {
  const params = {
    q: null,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [false],
  }
  params.fields.push('finished_product_id')
  params.ops.push('eq')
  params.values.push(id)
  
  API.getRequiredTests(params).then(res => {
    const { status, data } = res
    if (status === 200) {
      RequiredTestTableList.value = data.items || [];
    } else {
      // TODO: 添加错误异常提示
    }
  });
}

const getDetailById = (id) => {
  API.getDetailById(id).then(res => {

    const {status, data} = res
    if (status === 200) {
      save.value = false;

      if (data.cast) {
        data.cast_code = data.cast.cast_code
      }
      if (data.runout) {
        data.runout_code = data.runout.runout_code
      }
      if (data.rolling) {
        data.rolling_code = data.rolling.rolling_code
      }
      if (data.area) {
        data.area_code = data.area.code
      }
      if (data.spec) {
        data.spec_code = data.spec.spec_code
      }
      if (data.order) {
        data.order_code = data.order.order_code
      }
      if (data.order_item) {
        data.order_item_code = data.order_item.line_item_code
      }
      if (data.product_type) {
        data.product_type_code = data.product_type.code
      }
      if (data.defect_reason) {
        data.defect_reason.code = data.defect_reason.code + '-' + data.defect_reason.name
      }
      

      unHoldTableList.value = data.hold_reason || [];
      getTestCoverageId(id)
      getRequiredTests(id)

      // 确保 form.advice 不为 null
      if (!data.advice) {
        data.advice = { advice_code: undefined };
      }
      if (!data.defect_reason) {
        data.defect_reason = { code: undefined };
      }
      if (!data.regrade_reason) {
        data.regrade_reason = { code: undefined };
      }
      if (!data.load) {
        data.load = { code: undefined,load_status: undefined};
      }
      if (data.created_at){
        data.created_at = formatDate(data.created_at)
      }
      if (data.cover_date){
        data.cover_date = formatDate(data.cover_date)
      }
      form.value = data;

      query.value.cut_code = data.cut_code
      query.value.rolling_no = data.rolling_code
      query.value.kg = data.kg

      // 检查 association 是否为数组且包含至少一个元素
      if (Array.isArray(form.value.association) && form.value.association.length > 0) {
        form.value.association = form.value.association.map(item => item.code);
      } else {
        form.value.association = [];
      }
    } else {
      // TODO: 添加错误异常提示
    }
  });
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  getDetailById(route.query.id)
}else{
  form.value.status = 'created'
}

</script>
<style lang="scss" scoped>
.detail-content {
  .panel {
    position: relative;
    background-color: #ffffff;
    padding: 16px;
    min-height: 400px;
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
}
</style>
