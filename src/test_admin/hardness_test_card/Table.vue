<template>
  <v-container class="detail-content" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row class="mb-2" align="center">
        <v-col cols="3">
          <SpecCode v-model="queryParams.id" :spec="spec"/>
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
          <div class="specsave">
            <div class="specsave-action">
              <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
              <v-switch v-model="save" density="compact" hide-details inset></v-switch>
              <div class="ml-14">
                <v-btn :disabled="!save" :loading="loading" variant="flat" color="primary"
                       @click="handleSave">
                  {{ form.id ? "Update" : "Save" }}
                </v-btn>
              </div>
              <div class="ml-14">
                <v-btn :disabled="!save" :loading="loading" variant="flat" type="submit" color="primary"
                       @click="handlePrint">
                  Print
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-expansion-panels class="spec-panels" v-model="panel" multiple>
        <v-expansion-panel>
          <v-expansion-panel-text clss="spec-panels-text">
            <v-row align="center">
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Test Code</div>
                <v-text-field v-model="form.test_code" density="compact" variant="underlined"
                              placeholder="Test Code" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Section</div>
                <v-text-field v-model="form.Section" density="compact" variant="underlined"
                              placeholder="Section" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">KG/M</div>
                <v-text-field v-model="form.kg_m" density="compact" variant="underlined"
                              placeholder="KG/M" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Test Ref</div>
                <v-text-field v-model="form.test_ref" density="compact" variant="underlined"
                              placeholder="Test Ref" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Bloom</div>
                <v-text-field v-model="form.bloom" density="compact" variant="underlined"
                              placeholder="Bloom" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Cast Number</div>
                <v-text-field v-model="form.cast_number" density="compact" variant="underlined"
                              placeholder="Cast Number" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Inspection Authority Code</div>
                <v-text-field v-model="form.inspection_authority_code" density="compact" variant="underlined"
                              placeholder="Inspection Authority Code" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Section Size Code</div>
                <v-text-field v-model="form.section_size_code" density="compact" variant="underlined"
                              placeholder="Section Size Code" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Spec</div>
                <v-text-field v-model="form.spec" density="compact" variant="underlined"
                              placeholder="Spec" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Tested</div>
                <v-text-field v-model="form.tested" density="compact" variant="underlined"
                              placeholder="Tested" bg-color="white" clearable disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Status</div>
                <v-text-field v-model="form.status" density="compact" variant="underlined"
                              placeholder="Status" bg-color="white" clearable disabled></v-text-field>
              </v-col>


            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-text clss="spec-panels-text">
            <v-row align="center">
              <v-col cols="4">
                <div class="text-subtitle-2 font-weight-regular	mb-2">BHN MIN/MAX</div>
                <v-text-field density="compact" variant="underlined" v-model="form.bhn_min_max"
                              placeholder="BHN MIN/MAX" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
               <v-col cols="4">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Ball Size(mm)</div>
                <v-text-field density="compact" variant="underlined" v-model="form.ball_size_mm"
                              placeholder="Ball Size" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
              <v-col cols="4">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Load KG</div>
                <v-text-field density="compact" variant="underlined" v-model="form.load_kg"
                              placeholder="Load KG" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        
        <v-expansion-panel>
          <v-expansion-panel-text clss="spec-panels-text">
            <v-row align="center">
              <v-col cols="2">
                <div class="text-subtitle-2 font-weight-regular	mb-2">1</div>
                <v-text-field v-model="form.hardness_1" density="compact" variant="underlined"
                              placeholder="1" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
              <v-col cols="2">
                <div class="text-subtitle-2 font-weight-regular	mb-2">2</div>
                <v-text-field v-model="form.hardness_2" density="compact" variant="underlined"
                              placeholder="2" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
              <v-col cols="2">
                <div class="text-subtitle-2 font-weight-regular	mb-2">3</div>
                <v-text-field v-model="form.hardness_3" density="compact" variant="underlined"
                              placeholder="3" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
              <v-col cols="2">
                <div class="text-subtitle-2 font-weight-regular	mb-2">4</div>
                <v-text-field v-model="form.hardness_4" density="compact" variant="underlined"
                              placeholder="4" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
              <v-col cols="2">
                <div class="text-subtitle-2 font-weight-regular	mb-2">5</div>
                <v-text-field v-model="form.hardness_5" density="compact" variant="underlined"
                              placeholder="5" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
              <v-col cols="2">
                <div class="text-subtitle-2 font-weight-regular	mb-2">AV</div>
                <v-text-field v-model="form.hardness_av" density="compact" variant="underlined"
                              placeholder="AV" bg-color="white" clearable :disabled="!save"></v-text-field>
              </v-col>
              
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
      <v-card width="200mm" max-height="500" class="overflow-y-auto d-none">
        <v-row>
          <v-col cols="9" ref="printArea" id="printArea">
            <v-card height="105mm" width="168mm">
              <PrintCardHardness 
                :tableData="form"
              />
            </v-card>
          </v-col>
          <v-col cols="3" class="print-work text-end">
            <v-btn
              class="text-none mt-4 mr-8"
              color="primary"
              variant="flat"
              @click="handlePrint"
            >
              Print
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
  </v-container>
</template>
<script setup>

import {getCurrentInstance, reactive, ref, toRaw, toRefs, watch, inject} from "vue";
import {useRoute, useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import API from "./api";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import specApi from "@/spec_admin/spec/api";
import {formatDate, validateSpecCode} from '@/util/util';
import VueJsBarcode from 'vue-jsbarcode';
import PrintCardHardness from "../components/PrintCardHardness.vue"



const commonStore = useCommonStore();
const snackbar = inject('snackbar');
const {proxy} = getCurrentInstance();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);

const data = reactive({
  selected: [],
  panel: [0, 1, 2],
  inspectorOptions: [],
  queryParams: {
    id: commonStore.spec.id,
  },
  spec: commonStore.spec,
  form: {
    id: undefined,
    test_code: undefined,
    section: undefined,
    section_size_code: undefined,
    test_ref: undefined,
    bloom: undefined,
    cast_number:undefined,
    inspection_authority_code: undefined,
    kg_m: undefined,
    spec: undefined,
    tested: undefined,
    status: undefined,

    bhn_min_max: undefined,
    ball_size_mm: undefined,
    load_kg: undefined,
    hardness_1: undefined,
    hardness_2: undefined,
    hardness_3: undefined,
    hardness_4: undefined,
    hardness_5: undefined,
    hardness_av: undefined,
    // retest_seq: undefined,
    // trans_code: undefined
  },
  rules: {}
});

const {selected, spec, form, rules, panel, inspectorOptions, query, queryParams} = toRefs(data);
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
    API.getDetailById(query.value.advice_code).then(res => {
        const { status, data } = res

        if (status === 200) {
            save.value = false;
            form.value = data;


        } else {
            // TODO: 添加错误异常提示
        }
    });

}

const getTestSulphurId = (id) => {
    API.getDetailById(id).then(res => {
        const { status, data } = res
        if (status === 200) {
          save.value = false;
          form.value = data;
          // form.value.load_kg = data.load_kg * 1000
          form.value.test_code = data.test.test_code
          form.value.section = data.test.section
          form.value.section_size_code = data.test.section_size_code
          form.value.test_ref = data.test.ref_code
          form.value.bloom = data.test.bloom
          form.value.cast_number = data.test.cast_number
          form.value.inspection_authority_code = data.test.inspection_authority_code
          form.value.kg_m = data.test.kg_m
          form.value.spec = data.test.spec.spec_code
          form.value.tested = data.test.tested
          form.value.status = data.test.status

        } else {
            // TODO: 添加错误异常提示
        }
    });
}


// 进入页面根据ID获取数据详情
route.query.id = 1
// data.query.trans_code = route.query.id
getTestSulphurId(route.query.id)
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
  .v-table.table-one .v-table__wrapper > table > tbody > tr:not(:last-child) > td, .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
    border-bottom: none;
  }
  .v-table > .v-table__wrapper > table > tbody > tr > td, .v-table > .v-table__wrapper > table > thead > tr > th, .v-table > .v-table__wrapper > table > tfoot > tr > td {
    height: 12px;
    padding: 0px 7px;
  }
}
.detail-content {
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
