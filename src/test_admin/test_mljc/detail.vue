<template>
  <v-container class="detail-content" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col class="text-right">
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

    <v-form ref="jobDetailForm" @submit.prevent="handleSave">
      <div class="panel mt-4 mb-4 border">
        <v-row align="center" class="pt-4">
          <v-col cols="2">
            <v-text-field v-model="form.code" color="#333" density="default" variant="underlined"
                          placeholder="Job No." bg-color="white" clearable disabled label="Job No."
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.investigator" color="#333" density="default" variant="underlined"
                          placeholder="Investigator" bg-color="white" clearable :disabled="!save" label="Investigator"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <dict-code
                v-model="form.state"
                :disabled="!save"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="State"
                code="test_job_state"
            />
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.cast" color="#333" density="default" variant="underlined"
                          placeholder="Cast" bg-color="white" clearable :disabled="!save" label="Cast"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.customer" color="#333" density="default" variant="underlined"
                          placeholder="Customer" bg-color="white" clearable :disabled="!save" label="Customer"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <VueDatePicker
                :disabled="!save"
                v-model="form.initiated_date"
                :enable-time-picker="false"
                :teleport="true"
                position="left"
                @update:model-value="handlePickDate($event, 'initiated_date')"
            >
              <template #trigger>
                <v-text-field
                    :disabled="!save"
                    v-model="form.initiated_date"
                    label="Initiated Date"
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
                :disabled="!save"
                v-model="form.completed_date"
                :enable-time-picker="false"
                :teleport="true"
                position="left"
                @update:model-value="handlePickDate($event, 'completed_date')"
            >
              <template #trigger>
                <v-text-field
                    :disabled="!save"
                    v-model="form.completed_date"
                    label="Completed Date"
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
            <v-text-field v-model="form.quality" density="default" variant="underlined"
                          placeholder="Quality" bg-color="white" clearable
                          :disabled="!save" label="Quality"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.grade" density="default" variant="underlined"
                          placeholder="Grade"
                          bg-color="white" clearable :disabled="!save " label="Grade"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.product" density="default" variant="underlined"
                          placeholder="Product"
                          bg-color="white" clearable :disabled="!save " label="Product"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.size" density="default" variant="underlined"
                          placeholder="Size"
                          bg-color="white" clearable :disabled="!save " label="Size"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field v-model="form.investigation" density="default" variant="underlined"
                          placeholder="Investigation"
                          bg-color="white" clearable :disabled="!save " label="Investigation"
                          hide-details></v-text-field>
          </v-col>

          <v-col cols="2">
            <dict-code
                v-model="form.job_category"
                :disabled="!save"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Job Category"
                code="test_job_job_category"
            />
          </v-col>
        </v-row>
      </div>
      <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
        <div class="d-flex align-center mb-4 ga-4 justify-end">
          <router-link
              class="text-none"
              :to="{name: 'TestEditTable', query: {test_job_id: form.id}}"
              v-if="form.id"
              :disabled="!save"
          >
            <v-btn variant="flat" color="primary" :disabled="!save">
              New
            </v-btn>
          </router-link>
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
            <router-link
                :to="{ path: '/test_edit', query: { id: item.id, long_cast_code: item.cast?.long_cast_code, test_standard: item.spec?.standard === '1' ? 'BSEN' : (item.spec?.standard === '2' ? 'ASTM' : '') } }">
              <v-btn
                  variant="text"
                  icon="mdi-pencil"
              />
            </router-link>
          </template>

        </v-data-table-server>
      </v-card>
    </v-form>
    <!-- <AddBar :advice_id="form.id" ref="AddBarRef" @change="handlePickBar"/> -->
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
// import AddBar from "./components/AddBar.vue";
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
import { getDictLabel } from "@/util/dict";

const store = useStore();

const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));


const {proxy} = getCurrentInstance();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);

const tableHeaders = ref([
  // {title: "Action", key: "action", width: 50, sortable: false, fixed: true},
  {title: "Action", key: "action", minWidth: 150, fixed: true, sortable: false, align: "center"},
  {title: "Type", key: "type"},
  {title: "Test Code", key: "test_code"},
  {title: "Long Cast Code", key: "long_cast_code",  value: (item) => item.cast?.long_cast_code || "--"},
  {title: "Cast Code", key: "cast_code",  value: (item) => item.cast?.cast_code || "--"},
  {title: "Ref", key: "ref_code"},
  {title: "Sample", key: "test_sample.test_sample_code", value: (item) => item.test_sample?.test_sample_code || "--"},
  {title: "Runout", key: "runout.runout_code", value: (item) => item.runout?.runout_code || "--"},
  {title: "Rolling", key: "rolling.rolling_code", value: (item) => item.rolling?.rolling_code || "--"},
  {title: "Spec", key: "spec.spec_code", value: (item) => item.spec?.spec_code || "--"},
  {
    title: "Standard",
    key: "spec.standard",
    value: (item) => {
      const mapping = { 1: "BSEN", 2: "ASTM" };
      return mapping[item.spec?.standard] || "--";
    }
  },
  {title: "Inspector 1", key: "inspector_1.code", value: (item) => item.inspector_1?.code || "--"},
  {title: "Inspector 2", key: "inspector_2.code", value: (item) => item.inspector_2?.code || "--"},
  {title: "Inspector 3", key: "inspector_3.code", value: (item) => item.inspector_3?.code || "--"},
  {title: "Inspector 4", key: "inspector_4.code", value: (item) => item.inspector_4?.code || "--"},
  {title: "Status", key: "status", value: (item) => getDictLabel("test_status", item.status),},
  {title: "Print Status", key: "print_status"},
  {title: "Tester Initials", key: "tester_initials"},
  {title: "Result Status", key: "pass_status"},

  {title: "Tensile Loc", key: "tensile_object.orientation", sortable: false},
  {title: "Yield", key: "tensile_object.yield_rp0_2", sortable: false},
  {title: "UTS(MPa)", key: "tensile_object.value_mpa", sortable: false},
  {title: "Elongation Code", key: "tensile_object.elongation_code", sortable: false},
  {
  title: "Elongation",
  key: "elongation_data",
  value: (item) => {
    if (item.tensile_object?.elongation_code === 'X') {
      return item.tensile_object.elongation_a50;
    } else if (item.tensile_object?.elongation_code === 'Y') {
      return item.tensile_object.elongation_a200;
    } else if (item.tensile_object?.elongation_code === 'Z' || item.tensile_object?.elongation_code === '1') {
      return item.tensile_object?.elongation_a565;
    } else {
      return item.tensile_object?.elongation_a200;
    }
  },
  sortable: false
  },
  {
  title: "Yield/UTS Ratio", 
  key: "tensile_object.yield_uts_Ratio", 
  value: (item) => {
    if (item.yield_rp0_2 && item.value_mpa) {
      let yield_uts_Ratio = ((item.yield_rp0_2 / item.value_mpa) * 100).toFixed(2);
      yield_uts_Ratio = Math.round(Number(yield_uts_Ratio));
      return yield_uts_Ratio;
    }
  },
  sortable: false
  },

  {title: "Impact Unit", key: "impact_object.impact_units", sortable: false},
  {title: "Impact Temp", key: "impact_object.temp_c", sortable: false},
  {title: "Temp Unit", key: "impact_object.temp_units", sortable: false},
  {
  title: "Energy 1",
  key: "energy_1",
  value: (item) => {
    if (item.impact_object?.impact_units === 'J') {
      return item.impact_object.energy_1_j;
    } else if (item.impact_object?.impact_units === 'F') {
      return item.impact_object.energy_1_f;
    }
  },
  sortable: false
  },
  {
  title: "Energy 2",
  key: "energy_2",
  value: (item) => {
    if (item.impact_object?.impact_units === 'J') {
      return item.impact_object.energy_2_j;
    } else if (item.impact_object?.impact_units === 'F') {
      return item.impact_object.energy_2_f;
    }
  },
  sortable: false
  },
  {
  title: "Energy 3",
  key: "energy_3",
  value: (item) => {
    if (item.impact_object?.impact_units === 'J') {
      return item.impact_object.energy_3_j;
    } else if (item.impact_object?.impact_units === 'F') {
      return item.impact_object.energy_3_f;
    }
  },
  sortable: false
  },
  {
  title: "Energy Average",
  key: "energy_average",
  value: (item) => {
    if (item.impact_object?.impact_units === 'J') {
      return item.impact_object.energy_average_j;
    } else if (item.impact_object?.impact_units === 'F') {
      return item.impact_object.energy_average_f;
    }
  },
  sortable: false
  },
  {title: "Bend Result", key: "bend_object.result_1", sortable: false},

  {
    title: "Created At",
    key: "created_at",
    sortable: true,
    value: (item) => formatDate(item.created_at),
    minWidth: 180
  },
  {
    title: "Updated At",
    key: "updated_at",
    sortable: true,
    value: (item) => formatDate(item.updated_at),
    minWidth: 180
  },

]);

const tableList = ref([]);
const total = ref(0);

const printTableList = ref([]);

const data = reactive({
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    test_job_id: undefined,
    // advice_id: undefined,
    // advice: undefined,
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
    code: undefined,
    investigator: undefined,
    state: "O",
    cast_id: undefined,
    cast: undefined,
    customer: undefined,
    initiated_date: formatDate(new Date(), "YYYY-MM-DD"),
    completed_date: undefined,
    quality: undefined,
    grade: undefined,
    size: undefined,
    investigation: undefined,
    job_category: "R",
    product: undefined,

  },
  pickShowData: {
    created_at: null
  },
  rules: {
  }
});

const {query, form, rules, queryParams, pickShowData} = toRefs(data);


const handleSave = async () => {
  const {valid} = await proxy.$refs["jobDetailForm"].validate();
  if (!valid) {
    return;
  }
  const params = toRaw(form.value);

  // params.load_id = params.load?.id
  loading.value = true;
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.push({name: "MLJC Job List", query: {id: res.data?.id}})
      // onClose: () => {
      //   const id = res.data?.id;
      //   if (id) {
      //     // 使用 `router.replace` 替换当前页面并传递新的 `id`
      //     router.replace({ name: "MLJC Job List", query: { id } }).then(() => {
      //       form.value.id = id;
      //       getDetailByAdviceId()
      //     });
      //   }
      // }
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
  getDetailByJobId()

}

const getDetailByJobId = () => {
  API.getDetail(route.query.id).then(res => {
    const {status, data} = res

    if (status === 200) {
      save.value = false;
      form.value = data;
      form.value.initiated_date = data.initiated_date ? formatDate(data.initiated_date, "YYYY-MM-DD") : null;
      form.value.completed_date = data.completed_date ? formatDate(data.completed_date, "YYYY-MM-DD") : null;      
    } else {
      // TODO: 添加错误异常提示
    }
  });
}

const getTestList = () => {
  const params = toRaw(queryParams.value);
  loading.value = true;
  params.fields = [];
  params.ops = [];
  params.values = [];
  if (route.query.id){
    params.fields.push("test_job_id")
    params.ops.push("eq")
    params.values.push(route.query.id)
  }
  API.getTest(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
      console.log("tableList.value", tableList.value);
      
    } else {
      total.value = 0;
      tableList.value = []
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
  if (queryParams.value.id) {
    getTestList()
  }
}


const handlePickDate = (date, field) => {
  form.value[field] = formatDate(date, "YYYY-MM-DD");
}

const handleItemChange = (item, key) => {
  // form.value.customer = item.customer_short_name
  form.value[`${key}`] = item.id;
}



// 进入页面根据ID获取数据详情

if (route.query.id) {
  form.value.id = route.query.id;
  getDetailByJobId()
  getTestList()
} 

watch(() => form.value.state, (newVal) => {
  if (newVal && newVal === "C") {
    form.value.completed_date = formatDate(new Date(), "YYYY-MM-DD");
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
