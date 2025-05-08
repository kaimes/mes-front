<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col v-show="handleFieldShow('q')" cols="3">
          <v-text-field
              v-model="searchOptions.q"
              append-inner-icon="mdi-magnify"
              :label="$t('test_list.table.search_by_test_code')"
              variant="underlined"
              density="default"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col v-show="handleFieldShow('test_type')" cols="3">
          <v-select
              v-model="searchOptions.test_type"
              :items="types"
              item-title="title"
              item-value="value"
              :label="$t('test_list.table.type')"
              density="default"
              hide-details
          ></v-select>
        </v-col>
        <v-col v-show="handleFieldShow('cast_id')" cols="3">
          <CastCode
              v-model="searchOptions.cast_id"
              label="Cast Code"
              :hide-details="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('rolling_code')" cols="3">
          <RollingCode
              v-model="searchOptions.rolling_code"
              label="Rolling Code"
              :hide-details="true"
          />
        </v-col>
        <template v-if="defaultMillCode !== 'SRSM'">
          <v-col v-show="handleFieldShow('test_sample_code')" cols="3">
            <TestSampleCode
                v-model="searchOptions.test_sample_code"
                label="Test Sample Code"
                :hide-details="true"
            />
          </v-col>
        </template>
<!--        <v-col v-show="handleFieldShow('print_status_select')" cols="3">-->
<!--          <v-select-->
<!--              v-model="searchOptions.print_status_select"-->
<!--              :items="printStatusList"-->
<!--              item-title="title"-->
<!--              item-value="value"-->
<!--              label="Print Status"-->
<!--              density="default"-->
<!--              hide-details-->
<!--              clearable-->
<!--          ></v-select>-->
<!--        </v-col>-->
        <v-col v-show="handleFieldShow('pass_status')" cols="3">
          <dict-code
              v-model="searchOptions.pass_status"
              hide-details
              density="default"
              variant="underlined"
              :label="$t('test_list.table.result_status')"
              code="pass_status"
              clearable
          />
        </v-col>
        <v-col v-show="handleFieldShow('test_status')" cols="3">
          <dict-code
              v-model="searchOptions.test_status"
              hide-details
              variant="underlined"
              :label="$t('test_list.table.test_status')"
              bg-color="white"
              code="test_status"
              clearable
          />
        </v-col>
        <v-col v-show="handleFieldShow('standard')" cols="3">
          <dict-code
              v-model="searchOptions.standard"
              hide-details
              variant="underlined"
              :label="$t('test_list.table.standard')"
              bg-color="white"
              code="spec_standard"
              clearable
          />
        </v-col>
        <v-col v-show="handleFieldShow('filter_inspector')" cols="3">
          <inspector-code
              v-model="searchOptions.filter_inspector"
              label="Inspector"
              density="default"
              persistent-placeholder

              hide-details
          />
        </v-col>
        <v-col v-show="handleFieldShow('from_time')" cols="3">
          <VueDatePicker
              v-model="dateRange"
              @update:model-value="formatDateValue"
              position="left"
              :range="{ partialRange: false }"
              :teleport="true"
          >
            <template #trigger>
              <v-text-field
                  :model-value="searchOptions.from_time ? `${searchOptions.from_time}~${searchOptions.to_time}` : ''"
                  density="default"
                  :label="$t('test_list.table.time_range')"
                  bg-color="white"
                  placeholder="Please select date"
                  :hide-details="true"
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col>
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
            {{ $t('global.reset') }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                v-permission="`Search`"
            >
            {{ $t('global.search') }}
            </v-btn>
            <v-spacer/>
            <v-btn
                class="text-one"
                color="primary"
                variant="flat"
                @click="autopass"
                :loading="autoPassLoading"
                v-permission="`AutoPass`"
            >
            {{ $t('test_list.table.auto_pass') }}
            </v-btn>
            <v-btn
                variant="flat"
                class="text-none"
                color="primary"
                density="default"
                @click="handlePrint"
                v-permission="`Print`"
            >
            {{ $t('global.print') }}
            </v-btn>
            <router-link to="/test_edit">
              <v-btn
                  variant="flat"
                  class="text-none"
                  color="primary"
                  density="default"
                  v-permission="`Create`"
              >
              {{ $t('global.new') }}
              </v-btn>
            </router-link>
            <v-btn
                variant="text"
                icon="mdi-menu"
                size="sm"
                @click="handleOpen"
            />
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-2 pa-2" elevation="0" variant="outlined">
      <v-data-table-server
          v-model="selected"
          fixed-header
          fixed-footer
          height="700"
          min-height="700"
          :items-per-page="searchOptions.itemsPerPage"
          show-select
          return-object
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          v-model:sort-by="searchOptions.sortBy"
          :search="search"
          item-value="id"
          @update:options="handleTableChange"
      >
        <template v-slot:item.pass_status="{ item }">
          <template v-if="item.pass_status">
            <v-chip
                v-if="item.pass_status === 'P'"
                color="success"
                text="Pass"
                size="x-small"
            ></v-chip>
            <v-chip
                v-if="item.pass_status === 'F'"
                color="error"
                text="Fail"
                size="x-small"
            ></v-chip>
          </template>
        </template>
        <template v-slot:item.action="{ item }">
          <router-link
              :to="{ path: '/test_edit', query: { id: item.id, long_cast_code: item.cast?.long_cast_code, test_standard: item.spec?.standard === '1' ? 'BSEN' : (item.spec?.standard === '2' ? 'ASTM' : '') } }"
              v-permission="`Detail`">
            <v-btn
                variant="text"
                icon="mdi-pencil"
            />
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
                  v-permission="`Delete`"
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
                  {{ $t('global.cancel') }}
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleDelete(isActive, item)"
                  >
                  {{ $t('test_history.table.confirm') }}
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
    <div class="d-none">
      <div id="printArea">
        <template
            v-for="item in selected"
            :key="item.id"
        >
          <component :is="getPrintComponent(item.type)" :tableData="item"/>
        </template>
      </div>
    </div>
    <EditForm ref="editFormRef" @refresh="loadItems"/>
    <MesTable ref="tableRef" name="testList" v-model="headers"/>
  </v-container>
</template>
<script name="TestList" setup>
import {useRoute} from "vue-router";
import {computed, getCurrentInstance, nextTick, onMounted, reactive, ref, toRaw, toRefs} from "vue";
import moment from "moment";
import {cloneDeep} from "lodash";
import {useStore} from "vuex";
import {useCache} from "@/hooks/useCache";
import {formatDate} from "@/util/util";
import {getDictLabel} from "@/util/dict";
import printJS from "print-js";
import {toast} from "vue3-toastify";
import { useI18n } from "vue-i18n";
import useSearchFieldVisibility from "@/hooks/useSearchFieldVisibility";

import EditForm from "./components/editForm.vue";

import PrintCardTensile from "../components/PrintCardTensile.vue";
import PrintCardBend from "../components/PrintCardBend.vue";
import PrintCardCleanness from "../components/PrintCardCleanness.vue";
import PrintCardHardness from "../components/PrintCardHardness.vue";
import PrintCardImpact from "../components/PrintCardImpact.vue";
import PrintCardSulphur from "../components/PrintCardSulphur.vue";
import PrintCardResistivity from "../components/PrintCardResistivity.vue"
import PrintCardProductAnalysis from "../components/PrintCardProductAnalysis.vue"
import PrintCardDecarburisation from "../components/PrintCardDecarburisation.vue"
import PrintCardHydrogen from "../components/PrintCardHydrogen.vue"

import CastCode from "@/components/picker/CastCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import TestSampleCode from "@/components/picker/TestSampleCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import MesTable from "@/components/table/index.vue";
import InspectorCode from "@/components/picker/InspectorCode.vue";
import API from "./api";
import useFooterEvent from "@/hooks/useFooterEvent";
import { includes } from "xe-utils";

const {wsCache} = useCache("sessionStorage")

const selected = ref([]);
const { t } = useI18n()

// 搜索字段定义
const fields = ["q", "test_type", "cast_id", "rolling_code", "test_sample_code", "print_status_select", "pass_status", "test_status", "standard", "filter_inspector", "from_time"];
const searchFields = ref([...fields]);
const {handleFieldShow} = useSearchFieldVisibility(searchFields)
// 时间处理 start
const $startTime = moment().startOf('day').add(6, 'hours');
const $endTime = moment().add(1, 'day').startOf('day').add(6, 'hours');
const dateRange = ref([$startTime, $endTime]);
// 时间处理 end

const route = useRoute();
const store = useStore();
const {proxy} = getCurrentInstance();
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

const printStatusList = ref([
  {title: "Printed", value: "Printed"},
  {title: "Not Printed", value: "Not Printed"},
])

const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const headersDefinition = ref([
  {title: "global.action", key: "action", minWidth: 150, fixed: true, sortable: false, align: "center"},
  {title: "test_list.table.type", key: "type"},
  {title: "test_list.table.test_code", key: "test_code"},
  {title: "test_list.table.long_cast_code", key: "long_cast_code", value: (item) => item.cast?.long_cast_code || "--"},
  {title: "test_list.table.cast_code", key: "cast_code", value: (item) => item.cast?.cast_code || "--"},
  {title: "test_list.table.ref", key: "ref_code"},
  {title: "test_list.table.sample", key: "test_sample.test_sample_code", value: (item) => item.test_sample?.test_sample_code || "--"},
  {title: "test_list.table.runout", key: "runout.runout_code", value: (item) => item.runout?.runout_code || "--"},
  {title: "test_list.table.rolling", key: "rolling.rolling_code", value: (item) => item.rolling?.rolling_code || "--"},
  {title: "test_list.table.spec", key: "spec.spec_code", value: (item) => item.spec?.spec_code || "--"},
  {
    title: "test_list.table.standard",
    key: "spec.standard",
    value: (item) => {
      const mapping = {1: "BSEN", 2: "ASTM"};
      return mapping[item.spec?.standard] || "--";
    }
  },
  {title: "test_list.table.inspector_1", key: "inspector_1.code", value: (item) => item.inspector_1?.code || "--"},
  {title: "test_list.table.inspector_2", key: "inspector_2.code", value: (item) => item.inspector_2?.code || "--"},
  {title: "test_list.table.inspector_3", key: "inspector_3.code", value: (item) => item.inspector_3?.code || "--"},
  {title: "test_list.table.inspector_4", key: "inspector_4.code", value: (item) => item.inspector_4?.code || "--"},
  {title: "test_list.table.status", key: "status", value: (item) => getDictLabel("test_status", item.status),},
  {title: "test_list.table.print_status", key: "print_status"},
  {title: "test_list.table.tester_initials", key: "tester_initials"},
  {title: "test_list.table.result_status", key: "pass_status"},
  {title: "test_list.table.kg", key: "test_sample.runout.product_type.dim3"},
  {title: "test_list.table.tensile_loc", key: "tensile_object.orientation", sortable: false},
  {title: "test_list.table.yield", key: "tensile_object.yield_rp0_2", sortable: false},
  {title: "test_list.table.uts", key: "tensile_object.value_mpa", sortable: false},
  {title: "test_list.table.elongation_code", key: "tensile_object.elongation_code", sortable: false},
  {
    title: "test_list.table.elongation",
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
    title: "test_list.table.yield_ratio",
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

  {title: "test_list.table.impart_unit", key: "impact_object.impact_units", sortable: false},
  {title: "test_list.table.impart_temp", key: "impact_object.temp_c", sortable: false},
  {title: "test_list.table.temp_unit", key: "impact_object.temp_units", sortable: false},
  {
    title: "test_list.table.energy_1",
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
    title: "test_list.table.energy_2",
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
    title: "test_list.table.energy_3",
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
    title: "test_list.table.energy_average",
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
  {title: "test_list.table.bend_result", key: "bend_object.result_1", sortable: false},

  {
    title: "test_list.table.created_at",
    key: "created_at",
    sortable: true,
    value: (item) => formatDate(item.created_at),
    minWidth: 180
  },
  {
    title: "test_list.table.updated_at",
    key: "updated_at",
    sortable: true,
    value: (item) => formatDate(item.updated_at),
    minWidth: 180
  },
]);

const headers = computed(() => {
  return headersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const data = reactive({
  serverItems: [],
  loading: false,
  totalItems: 0,
  searchOptions: {
    q: undefined,
    test_type: undefined,
    cast_id: undefined,
    test_sample_code: undefined,
    print_status_select: 'Not Printed',
    test_status: undefined,
    standard: undefined,
    pass_status: undefined,
    from_time: $startTime.format("YYYY-MM-DD HH:mm:ss"),
    to_time: $endTime.format("YYYY-MM-DD HH:mm:ss"),
    fields: [],
    ops: [],
    values: [],
    page: 1,
    inspector: undefined,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
  search: '',
});

const {
  serverItems,
  loading,
  totalItems,
  searchOptions,
  search,
} = toRefs(data);

function getPrintComponent(type) {
  console.log("组件类型：" + type);

  switch (type) {
    case "tensile":
      return PrintCardTensile;
    case "bend":
      return PrintCardBend;
    case "cleanness":
      return PrintCardCleanness;
    case "hardness":
      return PrintCardHardness;
    case "impact":
      return PrintCardImpact;
    case "sulphur":
      return PrintCardSulphur;
    case "resistivity":
      return PrintCardResistivity;
    case "prodan":
      return null;
    case "hydrogen":
      return PrintCardHydrogen;
    case "decarburisation":
      return PrintCardDecarburisation;
    default:
      return null;
  }
}

function loadItems(type) {
  const $params = {};
  loading.value = true;
  const $searchOptions = cloneDeep({
    ...toRaw(searchOptions.value)
  });
  console.log("$searchOptions", $searchOptions)
  $searchOptions.fields = [];
  $searchOptions.ops = [];
  $searchOptions.values = [];
  $params["q"] = $searchOptions.q;
  if ($searchOptions.test_type) {
    $searchOptions.fields.push("type");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.test_type);
    $params["test_type"] = $searchOptions.test_type;
    delete $searchOptions.test_type;
  }
  if ($searchOptions.cast_id) {
    $searchOptions.fields.push("cast_id");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.cast_id);
    $params["cast_id"] = $searchOptions.cast_id;
    delete $searchOptions.cast_id;
  }
  if ($searchOptions.rolling_code) {
    $searchOptions.fields.push("rolling_id");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.rolling_code);
    $params["rolling_code"] = $searchOptions.rolling_code;
    delete $searchOptions.rolling_code;
  }
  if ($searchOptions.test_sample_code) {
    $searchOptions.fields.push("test_sample_id");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.test_sample_code);
    $params["test_sample_code"] = $searchOptions.test_sample_code;
    delete $searchOptions.test_sample_code;
  }

// if (print_status_select.value) {
//   $searchOptions.fields.push("print_status");
//   $searchOptions.ops.push("eq");
//   $searchOptions.values.push(print_status_select.value);
// }

  if ($searchOptions.test_status) {
    $searchOptions.fields.push("status");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.test_status);
    $params["test_status"] = $searchOptions.test_status;
    delete $searchOptions.test_status;
  }
  if ($searchOptions.standard) {
    $searchOptions.fields.push("standard");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.standard);
    $params["standard"] = $searchOptions.standard;
    delete $searchOptions.standard;
  }

  if ($searchOptions.filter_inspector) {
    $searchOptions.fields.push("inspector");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.filter_inspector);
    $params["filter_inspector"] = $searchOptions.filter_inspector;
    delete $searchOptions.filter_inspector;
  }

  if ($searchOptions.from_time) {
    $searchOptions.fields.push("created_at");
    $searchOptions.ops.push(">=");
    $searchOptions.values.push($searchOptions.from_time);
    $params["from_time"] = $searchOptions.from_time;
    delete $searchOptions.from_time;
  }

  if ($searchOptions.to_time) {
    $searchOptions.fields.push("created_at");
    $searchOptions.ops.push("<=");
    $searchOptions.values.push($searchOptions.to_time);
    $params["to_time"] = $searchOptions.to_time;
    delete $searchOptions.to_time;
  }

  if ($searchOptions.pass_status) {
    $searchOptions.fields.push("pass_status");
    $searchOptions.ops.push("eq");
    $searchOptions.values.push($searchOptions.pass_status);
    $params["pass_status"] = $searchOptions.pass_status;
  }
  console.log("$searchOptions", $params)
  if (type === "search") {
    // 用户点击搜索缓存查询条件
    wsCache.set("test_list_searchOptions", $params);
  }
  API.getAll({
    ...$searchOptions
  }).then(res => {
    totalItems.value = res.data.total || 0;
    serverItems.value = res.data.items || [];
  }).finally(() => {
    loading.value = false;
  });
}

const formatDateValue = (res) => {
  if (res && res.length === 2) {
    searchOptions.value.from_time = moment(res[0]).format("YYYY-MM-DD HH:mm:ss");
    searchOptions.value.to_time = moment(res[1]).format("YYYY-MM-DD HH:mm:ss");
  } else {
    searchOptions.value.from_time = undefined;
    searchOptions.value.to_time = undefined;
  }
}

function handleTableChange({page, itemsPerPage, sortBy, ...rest}, df) {
  if (searchOptions.value.page !== page || searchOptions.value.itemsPerPage !== itemsPerPage || sortBy.length > 0) {
    searchOptions.value.page = page;
    searchOptions.value.itemsPerPage = itemsPerPage;
    searchOptions.value.sortBy = sortBy;
    loadItems();
  }
}

const handleSearch = () => {
  loadItems("search");
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  nextTick(() => {
    // dateRange.value = [$startTime, $endTime];
    searchOptions.value.from_time = undefined;
    searchOptions.value.to_time = undefined;
    // searchOptions.value.print_status_select = 'Not Printed';
    wsCache.delete("test_list_searchOptions");
    loadItems();
  })
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

function handleError(error) {
  if (error.response) {
    toast.error(error.response.data?.detail, {autoClose: 60000})
  } else {
    console.log(error)
  }
  return false
}

function handleDelete(isActive, row) {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("delete test successfully.", {
      position: "bottom-center"
    })
    loadItems();
  }).catch(error => {
    handleError(error)
  });
}

const autoPassLoading = ref(false);
const autopass = () => {
  autoPassLoading.value = true;
  API.autopass()
      .then((info) => {
        toast.success(info?.data?.message || "Auto Pass Success", {
          position: "bottom-center"
        });
      })
      .catch(error => {
        toast.error(error?.response?.data?.detail || "Auto Pass Fail", {autoClose: 60000});
      })
      .finally(() => {
        autoPassLoading.value = false;
      });
};


const processItem = async (item) => {
  console.log(item);

  let spbendPromise = Promise.resolve(null);
  let data_in = {
    "dim1": item.rolling?.product_category?.dim1 || item.rolling?.rolling_dim1,
    "dim2": item.rolling?.product_category?.dim2 || item.rolling?.rolling_dim2,
    "product_code": item.rolling?.product_class?.code || item.rolling?.product_type,
  };
  if (item.type === 'bend') {
    let bend_data = {
      "spec_id": item.spec?.id,
      "product_type_id": item.rolling?.product_type_id
    }
    spbendPromise = API.getSpbend('/spbend/get_code_by_flange_spec', bend_data)
        .then(res => res.data.diameter_mm)
  }
  if (item.type === 'bend') {
    let bend_data = {
      "spec_id": item.spec?.id,
      "product_type_id": item.rolling?.product_type_id
    }
    spbendPromise = API.getSpbend('/spbend/get_code_by_flange_spec', bend_data)
        .then(res => res.data.diameter_mm)
  }

  let bloomPromise = item.cast?.id
      ? API.getSemiBloomTotal(`/semi/bloom/total/${item?.cast?.id}`).then(res => res.data.total_num)
      : Promise.resolve(0);

  let rollRefPromise = API.getRollRefCode('/product_size/roll_ref_code/print', data_in)
      .then(res => ({
        roll_ref_code: res.data.roll_ref_code,
        product_size_desc: res.data.product_size_desc
      }));

  let bloom, rollRefData, diameter_mm = null;

  if (item.type === "bend") {

    [bloom, rollRefData, diameter_mm] = await Promise.all([bloomPromise, rollRefPromise, spbendPromise]);
  } else {
    [bloom, rollRefData] = await Promise.all([bloomPromise, rollRefPromise]);
  }


  item.bloom = bloom;
  item.roll_ref = rollRefData.roll_ref_code;
  item.product_size_desc = rollRefData.product_size_desc;
  item.diameter_mm = diameter_mm;

  // console.log("data_in: " + JSON.stringify(data_in));

  // console.log(`更新 item ${item.id}:`, bloom, roll_ref);
};


function handlePrintChange() {
  const ids = selected.value.map(item => item.id);
  API.bulkUpdate({ids}).then(res => {
    selected.value = [];
    loadItems();
  });
}

function handlePrint() {
  // console.log("selected: " + JSON.stringify(selected.value));

  if (selected.value.length === 0) {
    toast.error("Please select at least one item", {autoClose: 60000});
    return;
  }
  printJS({
    printable: 'printArea', //打印区域
    type: 'html',
    targetStyles: ['*'],
    // portrait landscape
    style: '@page{size:A5 landscape;margin: 0mm;}',
    onPrintDialogClose: handlePrintChange
  });
}

// 进入页面根据ID获取数据详情
if (route.query.type) {
  searchOptions.value.print_status_select = "Not Printed";
  searchOptions.value.test_type = route.query.type;
}

onMounted(() => {
  const query = wsCache.get("test_list_searchOptions");
  if (query) {
    Object.keys(query).forEach(key => {
      searchOptions.value[`${key}`] = query[key];
    })
  }
  loadItems();
})

useFooterEvent('testList', {
  fields,
  column: headers,
  columnRef: headers,
  queryFields: searchFields,
  queryParams: searchOptions,
})
</script>
<style lang="scss" scoped>
</style>
