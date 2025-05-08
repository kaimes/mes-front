<template>
  <v-container id="test-card" class="test-card" fluid>
    <vue3-html2pdf
        ref="html2Pdf"
        :show-layout="true"
        :float-layout="false"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="800"
        filename="pdfName"
        :pdf-quality="1"
        :manual-pagination="true"
        pdf-format="a5"
        pdf-orientation="landscape"
        pdf-content-width="100%"
    >
      <template #pdf-content>
        <div class="panel border mb-4">
          <v-form ref="testForm" @submit.prevent="handleSave">
            <div class="panel-action">
              <div v-if="form.id" class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-regular mr-2">{{ $t('test_list.detail.test_result') }}:</span>
                <v-chip
                    :color="form.pass_status === 'P' ? 'success' : form.pass_status === 'F' ? 'error' : 'grey'"
                >{{  form.pass_status === 'P'? 'Pass' : form.pass_status === 'F'? 'Fail' : '-' }}</v-chip>
              </div>
              <v-spacer />
              <div class="d-flex align-center" data-html2canvas-ignore="true">
                <v-switch
                    v-model="save"
                    density="default"
                    hide-details
                    inset
                ></v-switch>
                <div class="d-flex align-center ga-2 ml-14">
                  <template v-if="form.id">
                    <v-btn variant="flat" color="primary" @click="handlePrint">
                      {{ $t('global.print') }}
                    </v-btn>
                  </template>
                  <v-dialog
                      max-width="400"
                      persistent
                  >
                    <template v-slot:activator="{ props: activatorProps }">
                      <template v-if="form.id">
                        <v-btn v-bind="activatorProps" :disabled="!save" :loading="loading" variant="flat" color="primary">
                          {{ $t('test_list.table.update') }}
                        </v-btn>
                      </template>
                      <template v-else>
                        <v-btn type="submit" :disabled="!save" :loading="loading" variant="flat" color="primary">
                          {{ $t('test_list.table.save') }}
                        </v-btn>
                      </template>

                    </template>
                    <template v-slot:default="{ isActive }">
                      <v-card
                          prepend-icon="mdi-help-circle-outline"
                          text="The check digit should be filled in the updated data, if it is not filled in, then the data after the check digit will not be updated, only the data with the correct check digit will be updated."
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
                              @click="handleSave(isActive)"
                          >
                            Confirm
                          </v-btn>
                        </template>
                      </v-card>
                    </template>
                  </v-dialog>

                </div>
              </div>
            </div>
            <v-row align="center">
              <v-col cols="3">
                <v-text-field
                    type="number"
                    v-model="form.test_code"
                    :label="$t('test_list.detail.test_code')"
                    density="comfortable"
                    variant="underlined"
                    :rules="rules.test_code"
                    persistent-placeholder
                    bg-color="white"
                    clearable
                    :readonly="defaultMillCode === 'SRSM'"
                    :disabled="!!form.id"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                    v-model="form.ref_code"
                    density="comfortable"
                    variant="underlined"
                    :label="$t('test_list.detail.test_ref')"
                    persistent-placeholder
                    bg-color="white"
                    clearable
                    :disabled="!save"
                />
              </v-col>
              <v-col cols="3">
                <test-sample-code v-model="form.test_sample_id" :test_sample="form.test_sample" :rules="rules.test_sample_id" density="comfortable"
                                  persistent-placeholder :hide-details="false" :disabled="!save" @change="handleTestSampleChange"/>
              </v-col>
              <v-col cols="3">
                <mill-code v-model="form.mill_id" placeholder="" density="comfortable" persistent-placeholder :hide-details="false" />
              </v-col>
              <v-col cols="3">
                <rolling-code
                    v-model="form.rolling_id"
                    :rolling="form.rolling"
                    :hide-details="false"
                    persistent-placeholder
                    density="comfortable"
                    placeholder=""
                    :disabled="!save"
                ></rolling-code>
              </v-col>
              <v-col cols="3">
                <spec-code
                  v-model="form.spec_id"
                  :spec="form.spec"
                  density="comfortable"
                  :rules="rules.spec_code"
                  persistent-placeholder
                  :hide-details="false"
                 :disabled="!save"
                  @change="handleSpecChange"
                />
              </v-col>
              <v-col cols="3">
                <cast-code v-model="form.cast_id" :cast="form.cast" density="comfortable" persistent-placeholder :hide-details="false"
                           :disabled="!save"/>
              </v-col>

              <v-col cols="3">
                <v-text-field
                    v-model="long_cast_code"
                    :label="$t('test_list.detail.long_cast_code')"
                    density="comfortable"
                    :disabled="true"
                    persistent-placeholder
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <dict-code
                    v-model="form.status"
                    :hide-details="false"
                    variant="underlined"
                    :label="$t('test_list.detail.status')"
                    bg-color="white"
                    code="test_status"
                    density="comfortable"
                    disabled
                />
              </v-col>
              <v-col cols="3">
                <v-select
                    v-model="form.print_status"
                    :label="$t('test_list.detail.print_status')"
                    density="comfortable"
                    variant="underlined"
                    name="print_status"
                    persistent-placeholder
                    bg-color="white"
                    clearable
                    disabled
                    :items="['Printed', 'Not Printed']"
                />
              </v-col>
              <!--          <v-col cols="3">-->
              <!--            <v-text-field-->
              <!--                type="number"-->
              <!--                v-model="form.micro_structure"-->
              <!--                density="comfortable"-->
              <!--                variant="underlined"-->
              <!--                label="Micro Structure"-->
              <!--                persistent-placeholder-->
              <!--                bg-color="white"-->
              <!--                clearable-->
              <!--                :disabled="!save"-->
              <!--            />-->
              <!--          </v-col>-->
              <v-col cols="3">
                <inspector-code
                    v-model="form.inspector_id_1"
                    :inspector="form.inspector_1"
                    label="Inspector 1"
                    density="comfortable"
                    persistent-placeholder
                    :hide-details="false"
                    :disabled="!save"
                />
              </v-col>
              <v-col cols="3">
                <inspector-code
                    v-model="form.inspector_id_2"
                    :inspector="form.inspector_2"
                    label="Inspector 2"
                    density="comfortable"
                    persistent-placeholder
                    :hide-details="false"
                    :disabled="!save"
                />
              </v-col>
              <v-col cols="3">
                <inspector-code
                    v-model="form.inspector_id_3"
                    :inspector="form.inspector_3"
                    label="Inspector 3"
                    density="comfortable"
                    persistent-placeholder
                    :hide-details="false"
                    :disabled="!save"
                />
              </v-col>
              <v-col cols="3">
                <inspector-code
                    v-model="form.inspector_id_4"
                    :inspector="form.inspector_4"
                    label="Inspector 4"
                    density="comfortable"
                    persistent-placeholder
                    :hide-details="false"
                    :disabled="!save"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="test_standard"
                              density="comfortable" variant="underlined" :label="$t('test_list.detail.test_standard')" persistent-placeholder
                              bg-color="white" clearable :disabled="true"
                              persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-select
                    v-model="form.type"
                    :items="types"
                    :rules="rules.type"
                    item-title="title"
                    item-value="value"
                    :label="$t('test_list.detail.type')"
                    density="comfortable"
                    :disabled="!!form.id"
                    persistent-placeholder
                ></v-select>
              </v-col>
          <v-col cols="3">
            <test-job-code v-model="form.test_job_id" :test_job="form.test_job" density="comfortable"
                              persistent-placeholder :hide-details="false" :disabled="!save" @change="handleItemChange($event, 'test_job_id')"/>
          </v-col>

              <template v-if="form.id">
                <v-col cols="3">
                  <v-textarea
                      v-model="form.update_reason"
                      :label="$t('test_list.detail.update_reason')"
                      density="comfortable"
                      :disabled="!save"
                      :rules="rules.update_reason"
                      persistent-placeholder
                      rows="1"
                  ></v-textarea>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                      v-model="form.update_name"
                      :label="$t('test_list.detail.updater')"
                      density="comfortable"
                      :disabled="!save"
                      persistent-placeholder
                      :rules="rules.updater"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                      :model-value="$filters.formatDate(form.updated_at)"
                      :label="$t('test_list.detail.updated_at')"
                      density="comfortable"
                      :disabled="true"
                      persistent-placeholder
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                      :model-value="$filters.formatDate(form.created_at)"
                      :label="$t('test_list.detail.created_at')"
                      density="comfortable"
                      :disabled="true"
                      persistent-placeholder
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
              <v-text-field
                  v-model="form.tester_initials"
                  :label="$t('test_list.detail.tester')"
                  density="comfortable"
                  :disabled="!save"
                  persistent-placeholder

              ></v-text-field>
            </v-col>
            <v-col cols="9">
              <v-text-field
                  v-model="form.comment"
                  :label="$t('test_list.detail.comment')"
                  density="comfortable"
                  :disabled="!save"
                  persistent-placeholder

              ></v-text-field>
            </v-col>
          </template>
            </v-row>
          </v-form>
        </div>
        <div class="html2pdf__page-break"/>
        <template v-if="form.type === 'cleanness'">
          <CleannessSpecCard class="mb-3" ref="cleanness" v-model="sub_spec_in"/>
          <CleannessCard ref="cleanness" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'coverage'">
          <CoverageCard ref="coverage" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'sulphur'">
          <SulphurSpecCard class="mb-3" ref="sulphur" v-model="sub_spec_in"/>
          <SulphurCard ref="sulphur" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'hardness'">
          <HardnessCard ref="hardness" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'tensile'">
          <TensileSpecCard class="mb-3" ref="tensile" v-model="sub_spec_in"/>
          <TensileCard ref="tensile" v-model="form.sub_test_in" :disabled="!save" :spec_id="form.spec_id" :test_sample_id="form.test_sample_id" @update:validationStatus="handleChangeAutoPass"/>
        </template>
        <template v-if="form.type === 'bend'">
          <BendCard ref="bend" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'impact'">
          <ImpactSpecCard class="mb-3" ref="impact" v-model="sub_spec_in"/>
          <ImpactCard ref="impact" v-model="form.sub_test_in" :disabled="!save" :test_standard="test_standard"   :spec_id="form.spec_id" :test_sample_id="form.test_sample_id" @update:validationStatus="handleChangeAutoPass"/>
        </template>
        <template v-if="form.type === 'decarburisation'">
          <DecarburisationSpecCard class="mb-3" ref="decarburisation" v-model="sub_spec_in"/>
          <DecarburisationCard ref="decarburisation" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'hydrogen'">
          <HydrogenCard ref="hydrogen" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'prodan'">
          <ProdanCard ref="prodan" v-model="form.sub_test_in" :disabled="!save"/>
        </template>
        <template v-if="form.type === 'resistivity'">
          <ResistivitySpecCard class="mb-3" ref="resistivity" v-model="sub_spec_in"/>
          <ResistivityCard ref="resistivity" v-model="form.sub_test_in" :disabled="!save" :runout_id="form.runout_id"/>
        </template>
        <template v-if="form.id">
          <div class="html2pdf__page-break"/>
          <CoveredProduct :id="form.id"/>
        </template>
      </template>
    </vue3-html2pdf>
  </v-container>
</template>
<script setup>
import {computed, getCurrentInstance, reactive, ref, toRaw, toRefs, unref, onMounted, watch} from "vue";
import {toast} from "vue3-toastify";
import {useRoute, useRouter} from "vue-router";
import { useStore } from 'vuex'
import jsPDF from 'jspdf'
import Vue3Html2pdf from 'vue3-html2pdf'
import TestSampleCode from "@/components/picker/TestSampleCode.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import InspectorCode from "@/components/picker/InspectorCode.vue";
import CleannessCard from "./components/cleannessCard.vue";
import CoverageCard from "./components/coverageCard.vue";
import SulphurCard from "./components/sulphurCard.vue";
import HardnessCard from "./components/hardnessCard.vue";
import TensileCard from "./components/tensileCard.vue";
import BendCard from "./components/bendCard.vue";
import ImpactCard from "./components/impactCard.vue";
import DecarburisationCard from "./components/decarburisationCard.vue";
import HydrogenCard from "./components/hydrogenCard.vue";
import ProdanCard from "./components/prodanCard.vue";
import ResistivityCard from "./components/resistivityCard.vue";
import CoveredProduct from "./components/coveredProduct.vue";
import API from "./api";
import { useI18n } from "vue-i18n";
import RunoutApi from "@/finished_product/runout_detail/api.js";
import {formatDate} from "@/util/util";
import DictCode from "@/components/picker/DictCode.vue";
import TestJobCode from "@/components/picker/TestJobCode.vue";
import CleannessSpecCard from "./components/cleannessSpecCard.vue";
import SulphurSpecCard from "./components/sulphurSpecCard.vue";
import DecarburisationSpecCard from "./components/decarburisationSpecCard.vue";
import TensileSpecCard from "./components/tensileSpecCard.vue";
import ImpactSpecCard from "./components/impactSpecCard.vue";
import ResistivitySpecCard from "./components/resistivitySpecCard.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n()
const store = useStore();
const loading = ref(false);
const save = ref(true);
const validateTypes = unref(['tensile', 'bend', 'impact']);

// [cleanness, sulphur, coverage, hardness, tensile, decarburisation, bend, hydrogen, impact, prodan, resistivity]
const types = ref([
  {title: "Impact", value: "impact"},
  {title: "Tensile", value: "tensile"},
  {title: "Bend", value: "bend"},
  {title: "Cleanness", value: "cleanness"},
  {title: "Decarburisation", value: "decarburisation"},
  {title: "Hardness", value: "hardness"},
  {title: "Hydrogen", value: "hydrogen"},
  {title: "Product Analysis", value: "prodan"},
  {title: "Resistivity", value: "resistivity"},
  {title: "Sulphur", value: "sulphur"},
]);

const {proxy} = getCurrentInstance();

const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const long_cast_code = ref(route.query.long_cast_code)

const test_standard = ref(route.query.test_standard)

const data = reactive({
  form: {
    id: undefined,
    test_code: undefined,
    ref_code: undefined,
    mill_id: undefined,
    test_sample_id: undefined,
    test_sample: {},
    runout_id: undefined,
    runout: {},
    rolling_id: undefined,
    rolling: {},
    spec_id: undefined,
    spec: {},
    status: "A",
    print_status: "Not Printed",
    type: undefined,
    micro_structure: undefined,
    search_vector: undefined,
    cast_id: undefined,
    cast: {},
    check_digit_0: undefined,
    check_digit_1: undefined,
    check_digit_2: undefined,
    inspector_id_1: undefined,
    inspector_id_2: undefined,
    inspector_id_3: undefined,
    inspector_id_4: undefined,
    inspector_1: {},
    inspector_2: {},
    inspector_3: {},
    inspector_4: {},
    update_name: undefined,
    update_reason: undefined,
    pass_status: undefined,
    sub_test_in: {},
    test_job_id: undefined,
    test_job: undefined,
    tester_initials:undefined,
    comment:undefined,
  },
  sub_spec_in:{},
  rules: {
    test_sample_id: [
      value => {
        if (value) return true
        return 'Test Sample Code is required.'
      }
    ],
    test_code: [
      value => {
        if (defaultMillCode.value === "SRSM") {
          return true;
        }
        if (!value) return 'Test Code is required.'
        if (defaultMillCode.value !== "TBM" && !value.match(/^\d{6}$/)) return 'Test Code must be a fixed 6-digit number'
        return true
      }
    ],
    spec_code: [
      value => {
        if (value) return true
        return 'Spec Code is required.'
      }
    ],
    type: [
      value => {
        if (value) return true
        return 'Type is required.'
      }
    ],

    update_reason: [
      value => {
        if (value) return true
        return 'Update Reason is required.'
      }
    ],

    updater: [
      value => {
        if (value) return true
        return 'Updater is required.'
      }
    ],
  },
  specTemp: {
    "flange_thickness": undefined,
    "spec_id": undefined,
  },
});

const {form, specTemp, rules, sub_spec_in} = toRefs(data);
const handleChange = async (selectedTestSample) => {
  console.log('Selected Test Sample:', selectedTestSample);
  // 假设你需要根据 selectedTestSample 获取 runout_id
  try {
    const response = await RunoutApi.getById(selectedTestSample.runout_id);
    form.value.runout_id = response.data.id;
  } catch (error) {
    console.error('获取 runout_id 失败:', error);
  }
}
const handleSave = async (isActive) => {
  if (isActive) {
    isActive.value = false;
  }
  const {valid, ...rest} = await proxy.$refs["testForm"].validate();
  if (!valid) {
    return;
  }

  ["check_digit_1_1", "check_digit_2_2", "check_digit_3_3"].forEach((key) => {
    if (form.value.sub_test_in[key] === "") {
      form.value.sub_test_in[key] = null;
    }
  });


  // 校验是否是编辑
  if (form.value.id && validateTypes.includes(form.value.type)) {
    const isOk = await proxy.$refs[form.value.type].getData();
    if (!isOk) {
      return;
    }
  }
  const params = toRaw(form.value);
  loading.value = true;
  if (params.id) {
    params["status"] = "U";
  }
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  }).catch(err => {
    if (err.response.status !== 420){
      toast.error(params.id ? "Update Fail: "+err.response.data.detail : "Create Fail", { autoClose: 60000 });
    } else {
        toast.success(params.id ? "Update Success" : "Create Success", {
        position: "bottom-center",
        delay: 3000,
        onClose: () => router.back()
      });
      toast.error("Message Send Fail!" , { autoClose: 60000 });
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handlePrint = () => {
  proxy.$refs["html2Pdf"].generatePdf()
}

const getDetailById = (id) => {
  API.getDetail(id).then(res => {
    const {status, data} = res;
    if (status === 200) {
      const $data = {
        ...(data || {})
      }
      if ($data["test_sample_id"]) {
        $data["test_sample"] = {
          "id": $data["test_sample_id"],
          "test_sample_code": $data["test_sample_code"] || "",
        };
      }
      if ($data["cast_id"]) {
        $data["cast"] = {
          "id": $data["cast_id"],
          "cast_code": $data["cast_code"],
        };
      }
      if ($data["runout_id"]) {
        $data["runout"] = {
          "id": $data["runout_id"],
          "runout_code": $data["runout_code"] || "",
        };
      }
      if ($data["rolling_id"]) {
        $data["rolling"] = {
          "id": $data["rolling_id"],
          "rolling_code": $data["rolling_code"] || "",
        };
      }
      if ($data["spec_id"]) {
        $data["spec"] = {
          "id": $data["spec_id"],
          "spec_code": $data["spec_code"] || "",
        };
      }
      if ($data["inspector_id_1"]) {
        $data["inspector_1"] = {
          "id": $data["inspector_id_1"],
          "code": $data["inspector_code_1"] || "",
        };
      }
      if ($data["inspector_id_2"]) {
        $data["inspector_2"] = {
          "id": $data["inspector_id_2"],
          "code": $data["inspector_code_2"] || "",
        };
      }
      if ($data["inspector_id_3"]) {
        $data["inspector_3"] = {
          "id": $data["inspector_id_3"],
          "code": $data["inspector_code_3"] || "",
        };
      }
      if ($data["inspector_id_4"]) {
        $data["inspector_4"] = {
          "id": $data["inspector_id_4"],
          "code": $data["inspector_code_4"] || "",
        };
      }
      form.value = $data;
      if (form.value.type === 'resistivity') {
        handleChange(form.value.test_sample);
      }
    }
  });
}

const getTestSpec = () => {
  const params = {
    test_sample_id: form.value.test_sample_id,
    spec_id: form.value.spec_id,
    test_type: form.value.type,
  };
  API.getTestSpec(params).then(res => {
    const {status, data} = res;
    if (status === 200) {
      sub_spec_in.value = data;
    }
  }).catch(err => {
    toast.error(err?.response?.data?.detail || "Get Test Spec Fail", { autoClose: 60000 });
  });
// });
}

const getTestJobCode = () => {
  API.getByTestJobtId(route.query.test_job_id).then(res => {
    const {status, data} = res
    if (status === 200) {
      form.value.test_job_id = data.id;
      form.value.test_job = data;

    } else {
      // TODO: 添加错误异常提示
    }
  });
}

if (route.query.type) {
  form.value.type = route.query.type;
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  save.value = false;
  getDetailById(route.query.id)
}else if (route.query.test_job_id) {
  getTestJobCode()
}

const handleSetImpactTemp = () => {
  const $params = toRaw(specTemp.value);
  API.getSpecTemp($params).then(res => {
    const { temp_units, value } = res.data;
    if (temp_units) {
      if (temp_units === "C") {
        form.value.sub_test_in.temp_c = value;
      } else {
        form.value.sub_test_in.temp_f = value;
      }
    }
  });
}

const handleSpecChange = (spec) => {
  specTemp.value.spec_id = spec.id;
  handleSetImpactTemp();
}

const handleTestSampleChange = async (testSample) => {
  specTemp.value.flange_thickness = testSample?.runout?.product_type?.flange_thickness;
  try {
    const response = await RunoutApi.getById(testSample.runout_id);
    form.value.runout_id = response.data.id;
  } catch (error) {
    console.error('获取 runout_id 失败:', error);
    toast.error('Failed to get runout_id', { autoClose: 60000 });
  }
  handleSetImpactTemp();
}

const handleChangeAutoPass = (value) => {
  form.value.pass_status = value;
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
}

watch(
    () => form.value.spec_id,
    (value) => {
      if (value){
        if (form.value.type){
          getTestSpec()
        }
      }
    },
    {
      // once: true,
      immediate: true,
      deep: true,
    }
)

watch(
    () => form.value.type,
    (value) => {
      if (value){
        if (form.value.spec_id){
          getTestSpec()
        }
      }
    },
    {
      // once: true,
      immediate: true,
      deep: true,
    }
)

watch(
    () => form.value.test_sample_id,
    (value) => {
      if (value){
        if (form.value.spec_id && form.value.type){
          getTestSpec()
        }
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
.test-card {
  ::v-deep {
    .unset-all {
      all: inherit !important;
    }
    .panel {
      position: relative;
      background-color: #ffffff;
      padding: 4px 16px 16px 16px;
      border-radius: 12px;

      &-action {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        padding: 8px 0;
      }
    }
  }
}

</style>
<script setup lang="ts">
</script>
