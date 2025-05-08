<template>
  <v-container class="detail-content" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row class="mb-2" align="center">
        <v-col cols="3">
          <SpecCode v-model="queryParams.id" :spec="spec" />
        </v-col>
        <v-col cols="2">
          <div class="d-flex ga-4 align-center">
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
              Reset
            </v-btn>
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading">
              Search
            </v-btn>
          </div>
        </v-col>
        <v-col cols="4">
        </v-col>
        <v-col cols="3">
          <div class="panel">
            <div class="panel-action">
              <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
              <v-switch v-model="save" density="compact" hide-details inset></v-switch>
              <div class="ml-14">
                <v-btn :disabled="!save" :loading="loading" variant="flat" color="primary" @click="handleSave">
                  {{ form.id ? "Update" : "Save" }}
                </v-btn>
              </div>
              <div class="ml-14">
                <v-btn :disabled="!save" :loading="loading" variant="flat" color="primary" @click="handlePrint">
                  Print
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>


      <div class="panel border">
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="form.test_code" color="#333" label="Test Code" :disabled="!save" density="default"
              variant="underlined" placeholder="Test Code" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.section" color="#333" label="Section" :disabled="!save" density="default"
              variant="underlined" placeholder="Section" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.section_size_code" color="#333" label="Section Size Code" :disabled="!save"
              density="default" variant="underlined" placeholder="Section Size Code" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.test_ref" color="#333" label="Test Ref" :disabled="!save" density="default"
              variant="underlined" placeholder="Test Ref" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.bloom" color="#333" label="Bloom" :disabled="!save" density="default"
              variant="underlined" placeholder="Bloom" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.cast_number" color="#333" label="Cast Number" :disabled="!save"
              density="default" variant="underlined" placeholder="Cast Number" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.inspection_authority_code" color="#333" label="Inspection Authority Code"
              :disabled="!save" density="default" variant="underlined" placeholder="Inspection Authority Code"
              bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.kg_m" color="#333" label="KG/M" :disabled="!save" density="default"
              variant="underlined" placeholder="KG/M" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.spec_code" color="#333" label="Spec" :disabled="!save" density="default"
              variant="underlined" placeholder="Spec" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.heat_treated" color="#333" label="Heat Treated" :disabled="!save" density="default"
              variant="underlined" placeholder="Heat Treated" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.tested" color="#333" label="Tested" :disabled="!save" density="default"
              variant="underlined" placeholder="Tested" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.m364" color="#333" label="M364" :disabled="!save" density="default"
              variant="underlined" placeholder="M364" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.diameter" color="#333" label="Diameter" :disabled="!save" density="default"
              variant="underlined" placeholder="Diameter" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.mandrel_size" color="#333" label="Mandrel Size" :disabled="!save" density="default"
              variant="underlined" placeholder="Mandrel Size" bg-color="white" clearable>
            </v-text-field>
          </v-col>
          <v-col cols="3">

            <v-select
                  label="Status"
                  v-model="form.status"
                  color="#333"
                  placeholder="Status"
                  bg-color="white"
                  item-title="title"
                  item-value="value"
                  :hide-details="false"
                  variant="underlined"
                  density="comfortable"
                  :items="['Created', 'Printed', 'Tested']"
              />
          </v-col>


        </v-row>
      </div>

      <v-card title="Test" class="panel-card">
        <div class="panel border">
          <v-row align="center">
            <v-col cols="4">
              <v-text-field v-model="form.test_number" color="#333" label="Test Number" :disabled="!save"
                density="default" variant="underlined" placeholder="Test Number" bg-color="white" clearable>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="form.check_digit_0" color="#333" label="Verification Number"
                :disabled="!save" density="default" variant="underlined" placeholder="Verification Number"
                bg-color="white" clearable>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                  label="Status"
                  v-model="form.result_1"
                  color="#333"
                  placeholder="Status"
                  bg-color="white"
                  item-title="title"
                  item-value="value"
                  :hide-details="false"
                  variant="underlined"
                  density="comfortable"
                  :items="['Pass', 'Fail', 'Void']"
              />

            </v-col>
          </v-row>
        </div>
      </v-card>



      <v-card title="Re Test" class="panel-card">
        <div class="panel border">

          <v-row align="center">
            <v-col cols="4">
              <v-text-field v-model="form.re_test_number" color="#333" label="Test Number" :disabled="!save"
                density="default" variant="underlined" placeholder="Test Number" bg-color="white" clearable>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="form.check_digit_1" color="#333" label="Verification Number"
                :disabled="!save" density="default" variant="underlined" placeholder="Verification Number"
                bg-color="white" clearable>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                  label="Status"
                  v-model="form.result_2"
                  color="#333"
                  placeholder="Status"
                  bg-color="white"
                  item-title="title"
                  item-value="value"
                  :hide-details="false"
                  variant="underlined"
                  density="comfortable"
                  :items="['Pass', 'Fail', 'Void']"
              />

            </v-col>
          </v-row>
        </div>
      </v-card>


    </v-form>
    

    <v-card width="200mm" max-height="500" class="overflow-y-auto d-none">
      <v-row>
        <v-col cols="9" ref="printArea" id="printArea">
          <v-card
            height="105mm"
            width="148mm"
          >
          <PrintCardBend
            :tableData="form"
          />
          </v-card>
        </v-col>
      </v-row>
    </v-card>

  </v-container>
</template>
<script setup>

import { getCurrentInstance, reactive, ref, toRaw, toRefs, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import API from "./api";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import specApi from "@/spec_admin/spec/api";
import { formatDate, validateSpecCode } from '@/util/util';
import PrintCardBend from "../components/PrintCardBend.vue";



const commonStore = useCommonStore();
const snackbar = inject('snackbar');
const { proxy } = getCurrentInstance();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);

const data = reactive({
  selected: [],
  panel: [0, 1],
  inspectorOptions: [],
  queryParams: {
    id: commonStore.spec.id,
  },
  query: {
    type: "Oxide",
    k_number: "K3",
    k_value: "20"
  },
  spec: commonStore.spec,
  form: {
    id: undefined,
    test_code: undefined,
    section: undefined,
    section_size_code: undefined,
    test_ref: undefined,
    bloom: undefined,
    cast_number: undefined,
    inspection_authority_code: undefined,
    kg_m: undefined,
    spec: undefined,
    spec_code: undefined,
    heat_treated: undefined,
    tested: undefined,
    m364: undefined,
    diameter: undefined,
    mandrel_size: undefined,
    status: undefined,

    test_number: "1",
    check_digit_0: undefined,
    result_1: undefined,

    re_test_number: "1",
    check_digit_1: undefined,
    result_2: undefined,

  },
  rules: {
  }
});

const { selected, spec, form, rules, panel, inspectorOptions, query, queryParams } = toRefs(data);
const barcodeValue = ref('1234567890');
function handlePrint() {

  let newstr = document.getElementById("printArea").innerHTML;
  let oldstr = document.body.innerHTML;
  document.body.innerHTML = newstr;
  window.print();
  document.body.innerHTML = oldstr;
  window.location.reload();
  return true;
}

const handleSave = async () => {
  // const { valid } = await proxy.$refs["finishedDetailForm"].validate();
  // if (!valid) {
  //     return;
  // }
  // const params = toRaw(queryParams.value);
  // const query_ = toRaw(query.value);
  const params = toRaw(form.value);

  loading.value = true;
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
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
  API.getDetailById(query.value.advice_code).then(res => {
    const { status, data } = res

    if (status === 200) {
      save.value = false;

      // queryParams.value.advice_code = data.advice_code

      // getfinished()

      form.value = data;


    } else {
      // TODO: 添加错误异常提示
    }
  });

}

const getBendTestCardId = (id) => {
  API.getDetailById(id).then(res => {
    const { status, data } = res
    if (status === 200) {

      save.value = false;
      form.value = data;
      form.value.test_code = data.test.test_code
      form.value.section = data.test.section
      form.value.section_size_code = data.test.section_size_code
      form.value.test_ref = data.test.test_ref
      form.value.bloom = data.test.bloom
      form.value.cast_number = data.cast.cast_code
      form.value.inspection_authority_code = data.test.spec.inspector.code
      form.value.kg_m = data.test.kg_m
      form.value.spec_code = data.test.spec.spec_code
      form.value.status = data.test.status
      form.value.test_number = '1'
      form.value.re_test_number = '1'
      

    } else {
      // TODO: 添加错误异常提示
    }
  });
}


// 进入页面根据ID获取数据详情
route.query.id = 1
// data.query.trans_code = route.query.id
getBendTestCardId(route.query.id)
// if (route.query.id) {
//     getTestCleannessId(route.query.id)
// }

watch(
  () => form,
  (value) => { },
  {
    deep: true
  }
)


</script>
<style lang="scss" scoped>
@media print {

  .v-table.table-one .v-table__wrapper>table>tbody>tr:not(:last-child)>td,
  .v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>th {
    border-bottom: none;
  }

  .v-table>.v-table__wrapper>table>tbody>tr>td,
  .v-table>.v-table__wrapper>table>thead>tr>th,
  .v-table>.v-table__wrapper>table>tfoot>tr>td {
    height: 12px;
    padding: 0px 7px;
  }
}

.detail-content {

  .panel {
    position: relative;
    background-color: #ffffff;
    padding: 16px;

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
  .panel-card{
    margin-top: 16px;
  }


  .v-table.table-one .v-table__wrapper>table>tbody>tr:not(:last-child)>td,
  .v-table .v-table__wrapper>table>tbody>tr:not(:last-child)>th {
    border-bottom: none;
  }

  .v-table>.v-table__wrapper>table>tbody>tr>td,
  .v-table>.v-table__wrapper>table>thead>tr>th,
  .v-table>.v-table__wrapper>table>tfoot>tr>td {
    height: 12px;
    padding: 0px 7px;
  }

  .print-work {
    background-color: #333;
  }
}
</style>
