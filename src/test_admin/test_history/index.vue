<template>
  <v-container fluid class="content">
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <v-text-field v-model="queryParams.q"
                        :placeholder="$t('test_history.table.search_by_section_size_code')"
                        single-line hide-details clearable variant="underlined"
                        @keyup.enter="handleSearch"
          />
        </v-col>
        <v-col cols="2">
          <dict-code
              v-model="queryParams.action_type"
              hide-details
              variant="underlined"
              :label="$t('global.action')"
              bg-color="white"
              code="test_history_action_type"
              multiple
              chips
              clearable
          />
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="queryParams.test_type"
              :label="$t('test_history.table.test_type')"
              code="test_history_test_type"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col cols="2">
          <VueDatePicker
              @update:model-value="formatDateValue"
              position="left"
              :range="{ partialRange: false }"
              :enable-time-picker="false"
              :teleport="true"
          >
            <template #trigger>
              <v-text-field
                  v-model="queryParams.start_date"
                  :model-value="queryParams.start_date ? `${queryParams.start_date}~${queryParams.end_date}` : ''"
                  :label="$t('test_history.table.date_range')"
                  hide-details
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
            >
            {{ $t('global.search') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center">
        <v-spacer/>
        <v-btn
            variant="text"
            icon="mdi-menu"
            size="sm"
            @click="handleOpen"
        />
      </div>
      <v-data-table-server
          fexid-header
          height="650"
          min-height="300"
          :headers="headers"
          :items="items"
          :items-length="total"
          :loading="loading"
          item-value="id"
          fixed-header
          show-current-page
          @update:page="handleTableChangePage"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"

      >
        <template v-slot:[`item.confirm`]="{ item }">
          <v-btn
              v-if="!item.confirm_at"
              type="submit"
              class="text-none"
              color="primary"
              variant="flat"
              :loading="loading"
              @click="confirmTest(item)"
          >
          {{ $t('test_history.table.confirm') }}
          </v-btn>
        </template>
        <template v-slot:[`item.uuid`]="{ item }">
          <v-tooltip location="bottom" max-width="300px" :text="item.uuid">
            <template v-slot:activator="{ props }">
              <a class="uuid-clickable" v-bind="props" @click="copyUUID(item.uuid)">
                {{ item.uuid.length > 8 ? item.uuid.substring(0, 8) + '...' : item.uuid }}
              </a>
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </v-card>
    <MesTable ref="tableRef" name="test_history"  v-model="headers" />
  </v-container>
</template>

<script setup>
import {ref, onMounted, reactive, toRaw, getCurrentInstance, computed} from 'vue';
import Api from '@/test_admin/test_history/api';
import {formatDate} from '@/util/util';
import {toast} from "vue3-toastify";
import moment from "moment";
import DictCode from "@/components/picker/DictCode.vue";
import MesTable from "@/components/table/index.vue";
import { useI18n } from "vue-i18n";


const { t } = useI18n()

const {proxy} = getCurrentInstance();

const loading = ref(false);
const items = ref([]);
const total = ref(0);
const headersDefinition = ref([
  {title: 'test_history.table.confirm', key: 'confirm', sortable: false},
  {title: 'global.action', key: 'action_type', sortable: true},
  {
    title: 'test_history.table.when',
    key: 'created_at',
    value: (item) => formatDate(item['created_at']),
    sortable: true,
    minWidth: 180
  },

  {title: 'test_history.table.test_id', key: 'test_id', sortable: true},
  {title: 'test_history.table.test_type', key: 'test_type', sortable: true},
  {title: 'test_history.table.created_by', key: 'created_by', sortable: true},
  {title: 'test_history.table.created_date', key: 'created_date', sortable: true},
  {title: 'test_history.table.testing_machine', key: 'testing_machine', sortable: true},
  {title: 'test_history.table.section_size_code', key: 'section_size_code', sortable: true},
  {title: 'test_history.table.semi', key: 'semi', sortable: true},
  {title: 'test_history.table.kgm', key: 'kgm', sortable: true},
  {title: 'test_history.table.impact_temp_c', key: 'temp_c', sortable: true},
  {title: 'test_history.table.impact_temp_f', key: 'temp_f', sortable: true},
  {title: 'test_history.table.impact_temp_units', key: 'temp_units', sortable: true},
  {title: 'test_history.table.impact_energy_1_j', key: 'energy_1_j', sortable: true},
  {title: 'test_history.table.impact_energy_2_j', key: 'energy_2_j', sortable: true},
  {title: 'test_history.table.impact_energy_3_j', key: 'energy_3_j', sortable: true},
  {title: 'test_history.table.impact_energy_average_j', key: 'energy_average_j', sortable: true},
  {title: 'test_history.table.impact_energy_1_f', key: 'energy_1_f', sortable: true},
  {title: 'test_history.table.impact_energy_2_f', key: 'energy_2_f', sortable: true},
  {title: 'test_history.table.impact_energy_3_f', key: 'energy_3_f', sortable: true},
  {title: 'test_history.table.impact_energy_average_f', key: 'energy_average_f', sortable: true},
  {title: 'test_history.table.impact_shear_1', key: 'shear_1', sortable: true},
  {title: 'test_history.table.impact_shear_2', key: 'shear_2', sortable: true},
  {title: 'test_history.table.impact_shear_3', key: 'shear_3', sortable: true},
  {title: 'test_history.table.impact_shear_average', key: 'shear_average', sortable: true},
  {title: 'test_history.table.impact_impact_units', key: 'impact_units', sortable: true},
  {title: 'test_history.table.impact_energy_units', key: 'energy_units', sortable: true},
  
  {title: 'test_history.table.r1_temp_c', key: 'r1_temp_c', sortable: true},
  {title: 'test_history.table.r1_temp_f', key: 'r1_temp_f', sortable: true},
  {title: 'test_history.table.r1_energy_1_j', key: 'r1_energy_1_j', sortable: true},
  {title: 'test_history.table.r1_energy_2_j', key: 'r1_energy_2_j', sortable: true},
  {title: 'test_history.table.r1_energy_3_j', key: 'r1_energy_3_j', sortable: true},
  {title: 'test_history.table.r1_energy_average_j', key: 'r1_energy_average_j', sortable: true},
  {title: 'test_history.table.r1_energy_1_f', key: 'r1_energy_1_f', sortable: true},
  {title: 'test_history.table.r1_energy_2_f', key: 'r1_energy_2_f', sortable: true},
  {title: 'test_history.table.r1_energy_3_f', key: 'r1_energy_3_f', sortable: true},
  {title: 'test_history.table.r1_energy_average_f', key: 'r1_energy_average_f', sortable: true},
  {title: 'test_history.table.r1_shear_1', key: 'r1_shear_1', sortable: true},
  {title: 'test_history.table.r1_shear_2', key: 'r1_shear_2', sortable: true},
  {title: 'test_history.table.r1_shear_3', key: 'r1_shear_3', sortable: true},
  {title: 'test_history.table.r1_shear_average', key: 'r1_shear_average', sortable: true},
  {title: 'test_history.table.r1_temp_units', key: 'r1_temp_units', sortable: true},
  {title: 'test_history.table.r1_impact_units', key: 'r1_impact_units', sortable: true},
  {title: 'test_history.table.r1_energy_units', key: 'r1_energy_units', sortable: true},
  {title: 'test_history.table.heat_treated_by', key: 'heat_treated_by', sortable: true},
  {title: 'test_history.table.tested_by', key: 'tested_by', sortable: true},
  {title: 'test_history.table.result_1', key: 'result_1', sortable: true},
  {title: 'test_history.table.result_2', key: 'result_2', sortable: true},
  {title: 'test_history.table.type', key: 'type', sortable: true},
  {title: 'test_history.table.k_number', key: 'k_number', sortable: true},
  {title: 'test_history.table.k_value', key: 'k_value', sortable: true},
  {title: 'test_history.table.bhn_min_max', key: 'bhn_min_max', sortable: true},
  {title: 'test_history.table.ball_size_mm', key: 'ball_size_mm', sortable: true},
  {title: 'test_history.table.load_kg', key: 'load_kg', sortable: true},
  {title: 'test_history.table.hardness_1', key: 'hardness_1', sortable: true},
  {title: 'test_history.table.hardness_2', key: 'hardness_2', sortable: true},
  {title: 'test_history.table.hardness_3', key: 'hardness_3', sortable: true},
  {title: 'test_history.table.hardness_4', key: 'hardness_4', sortable: true},
  {title: 'test_history.table.hardness_5', key: 'hardness_5', sortable: true},
  {title: 'test_history.table.hardness_av', key: 'hardness_av', sortable: true},
  {title: 'test_history.table.decarburisation_min', key: 'decarburisation_min', sortable: true},
  {title: 'test_history.table.decarburisation_max', key: 'decarburisation_max', sortable: true},
  {title: 'test_history.table.decarburisation', key: 'decarburisation', sortable: true},
  {title: 'test_history.table.spec_test', key: 'spec_test', sortable: true},
  {title: 'test_history.table.rail_grade', key: 'rail_grade', sortable: true},
  {title: 'test_history.table.max_test', key: 'max_test', sortable: true},
  {title: 'test_history.table.max_resistivity', key: 'max_resistivity', sortable: true},
  {title: 'test_history.table.temperature', key: 'temperature', sortable: true},
  {title: 'test_history.table.temp', key: 'temp', sortable: true},
  {title: 'test_history.table.distance', key: 'distance', sortable: true},
  {title: 'test_history.table.volt', key: 'volt', sortable: true},
  {title: 'test_history.table.current', key: 'current', sortable: true},
  {title: 'test_history.table.resistivity', key: 'resistivity', sortable: true},
  {title: 'test_history.table.humidity', key: 'humidity', sortable: true},
  {title: 'test_history.table.sulphur_rail_grade', key: 'sulphur_rail_grade', sortable: true},
  {title: 'test_history.table.tested_thickness', key: 'tested_thickness', sortable: true},
  {title: 'test_history.table.tested_width', key: 'tested_width', sortable: true},
  {title: 'test_history.table.tested_diameter', key: 'tested_diameter', sortable: true},
  {title: 'test_history.table.yield_tt0_5', key: 'yield_tt0_5', sortable: true},
  {title: 'test_history.table.yield_high', key: 'yield_high', sortable: true},
  {title: 'test_history.table.yield_rp0_2', key: 'yield_rp0_2', sortable: true},
  {title: 'test_history.table.yield_low', key: 'yield_low', sortable: true},
  {title: 'test_history.table.elongation_code', key: 'elongation_code', sortable: true},
  {title: 'test_history.table.elongation_a565', key: 'elongation_a565', sortable: true},
  {title: 'test_history.table.elongation_a200', key: 'elongation_a200', sortable: true},
  {title: 'test_history.table.elongation_a50', key: 'elongation_a50', sortable: true},
  {title: 'test_history.table.elongation_8', key: 'elongation_8', sortable: true},
  {title: 'test_history.table.elongation_2', key: 'elongation_2', sortable: true},
  {title: 'test_history.table.elongation_a80', key: 'elongation_a80', sortable: true},
  {title: 'test_history.table.r1_tested_thickness', key: 'r1_tested_thickness', sortable: true},
  {title: 'test_history.table.r1_tested_width', key: 'r1_tested_width', sortable: true},
  {title: 'test_history.table.r1_tested_diameter', key: 'r1_tested_diameter', sortable: true},
  {title: 'test_history.table.r1_yield_tt0_5', key: 'r1_yield_tt0_5', sortable: true},
  {title: 'test_history.table.r1_yield_high', key: 'r1_yield_high', sortable: true},
  {title: 'test_history.table.r1_yield_rp0_2', key: 'r1_yield_rp0_2', sortable: true},
  {title: 'test_history.table.r1_yield_low', key: 'r1_yield_low', sortable: true},
  {title: 'test_history.table.r1_elongation_code', key: 'r1_elongation_code', sortable: true},
  {title: 'test_history.table.r1_elongation_a565', key: 'r1_elongation_a565', sortable: true},
  {title: 'test_history.table.r1_elongation_a200', key: 'r1_elongation_a200', sortable: true},
  {title: 'test_history.table.r1_elongation_a50', key: 'r1_elongation_a50', sortable: true},
  {title: 'test_history.table.r1_elongation_8', key: 'r1_elongation_8', sortable: true},
  {title: 'test_history.table.r1_elongation_2', key: 'r1_elongation_2', sortable: true},
  {title: 'test_history.table.r1_elongation_a80', key: 'r1_elongation_a80', sortable: true},
  {title: 'test_history.table.r2_tested_thickness', key: 'r2_tested_thickness', sortable: true},
  {title: 'test_history.table.r2_tested_width', key: 'r2_tested_width', sortable: true},
  {title: 'test_history.table.r2_tested_diameter', key: 'r2_tested_diameter', sortable: true},
  {title: 'test_history.table.r2_yield_tt0_5', key: 'r2_yield_tt0_5', sortable: true},
  {title: 'test_history.table.r2_yield_high', key: 'r2_yield_high', sortable: true},
  {title: 'test_history.table.r2_yield_rp0_2', key: 'r2_yield_rp0_2', sortable: true},
  {title: 'test_history.table.r2_yield_low', key: 'r2_yield_low', sortable: true},
  {title: 'test_history.table.r2_elongation_code', key: 'r2_elongation_code', sortable: true},
  {title: 'test_history.table.r2_elongation_a565', key: 'r2_elongation_a565', sortable: true},
  {title: 'test_history.table.r2_elongation_a200', key: 'r2_elongation_a200', sortable: true},
  {title: 'test_history.table.r2_elongation_a50', key: 'r2_elongation_a50', sortable: true},
  {title: 'test_history.table.r2_elongation_8', key: 'r2_elongation_8', sortable: true},
  {title: 'test_history.table.r2_elongation_2', key: 'r2_elongation_2', sortable: true},
  {title: 'test_history.table.r2_elongation_a80', key: 'r2_elongation_a80', sortable: true},
  {title: 'test_history.table.tensile_uts_mpa', key: 'tensile_uts_mpa', sortable: true},
  {title: 'test_history.table.r1_tensile_uts_mpa', key: 'r1_tensile_uts_mpa', sortable: true},
  {title: 'test_history.table.r2_tensile_uts_mpa', key: 'r2_tensile_uts_mpa', sortable: true},
  {title: 'test_history.table.result_c', key: 'result_c', sortable: true},
  {title: 'test_history.table.result_si', key: 'result_si', sortable: true},
  {title: 'test_history.table.result_mn', key: 'result_mn', sortable: true},
  {title: 'test_history.table.result_p', key: 'result_p', sortable: true},
  {title: 'test_history.table.result_s', key: 'result_s', sortable: true},
  {title: 'test_history.table.result_cr', key: 'result_cr', sortable: true},
  {title: 'test_history.table.result_mo', key: 'result_mo', sortable: true},
  {title: 'test_history.table.result_ni', key: 'result_ni', sortable: true},
  {title: 'test_history.table.result_al', key: 'result_al', sortable: true},
  {title: 'test_history.table.result_b', key: 'result_b', sortable: true},
  {title: 'test_history.table.result_co', key: 'result_co', sortable: true},
  {title: 'test_history.table.result_cu', key: 'result_cu', sortable: true},
  {title: 'test_history.table.result_nb', key: 'result_nb', sortable: true},
  {title: 'test_history.table.result_sn', key: 'result_sn', sortable: true},
  {title: 'test_history.table.result_ti', key: 'result_ti', sortable: true},
  {title: 'test_history.table.result_v', key: 'result_v', sortable: true},
  {title: 'test_history.table.result_ca', key: 'result_ca', sortable: true},
  {title: 'test_history.table.result_n2', key: 'result_n2', sortable: true},
  {title: 'test_history.table.result_o', key: 'result_o', sortable: true},
  {title: 'test_history.table.result_h', key: 'result_h', sortable: true},
  {title: 'test_history.table.result_sal', key: 'result_sal', sortable: true},
  {title: 'test_history.table.result_as', key: 'result_as', sortable: true},
  {title: 'test_history.table.result_bi', key: 'result_bi', sortable: true},
  {title: 'test_history.table.result_ce', key: 'result_ce', sortable: true},

  {title: 'test_history.table.result_pb', key: 'result_pb', sortable: true},
  {title: 'test_history.table.result_sb', key: 'result_sb', sortable: true},
  {title: 'test_history.table.result_w', key: 'result_w', sortable: true},
  {title: 'test_history.table.result_zn', key: 'result_zn', sortable: true},
  {title: 'test_history.table.result_zr', key: 'result_zr', sortable: true},
  {title: 'test_history.table.uuid', key: 'uuid', sortable: true},
  {title: 'test_history.table.confirm_at', key: 'confirm_at', value: (row) => formatDate(row.confirm_at), sortable: true},
  {title: 'test_history.table.confirm_by', key: 'confirm_by', sortable: true},
  {title: 'test_history.table.created_at', key: 'created_at', value: (row) => formatDate(row.created_at), sortable: true},
  {title: 'test_history.table.created_by', key: 'created_by', sortable: true},
  {title: 'test_history.table.update_name', key: 'update_name', sortable: true},
  {title: 'test_history.table.updated_at', key: 'updated_at', value: (row) => formatDate(row.updated_at), sortable: true},
  {title: 'test_history.table.update_by', key: 'update_by', sortable: true},

]);

const headers = computed(() => {
  return headersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});


const queryParams = reactive({
  q: undefined,
  page: 1,
  itemsPerPage: 10,
  sortBy: ['created_at'],
  descending: [true],
  start_date: moment().subtract(10, 'years').format("YYYY-MM-DD"),
  end_date: moment().add(1, 'days').format("YYYY-MM-DD"),
  action_type: null,
  fields: [],
  ops: [],
  values: [],
  test_type: []
});

const formatDateValue = (res) => {
  if (res && res.length === 2) {
    queryParams.start_date = moment(res[0]).format("YYYY-MM-DD");
    queryParams.end_date = moment(res[1]).format("YYYY-MM-DD");
  } else {
    queryParams.start_date = undefined;
    queryParams.end_date = undefined;
  }
}



const getAll = async () => {
  loading.value = true;
  const params = {
    ...toRaw(queryParams)
  };

  params.fields = []
  params.ops = []
  params.values = []

  if (params.q === undefined && (params.action_type == null || params.action_type.length <= 0)) {
    params.descending = [true]
  }

  if (params.action_type && params.action_type.length > 0) {
    const action_type = params.action_type;
    delete params.action_type;
    params.fields = ["action_type"]
    params.ops = ["in"]
    params.values = [action_type];
  }

  if (params.test_type && params.test_type.length > 0) {
    params.fields.push("test_type");
    params.ops.push("in");
    params.values.push(params.test_type);
    delete params.test_type;
  }


  try {
    // console.log(params);
    const response = await Api.getAll(params);
    items.value = response.data.items;
    total.value = response.data.total;
  } catch (error) {
    toast.error('Failed to get data', {autoClose: 60000});
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  queryParams.page = 1;
  queryParams.descending = [false];
  getAll();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  queryParams.start_date = undefined;
  queryParams.end_date = undefined;
  handleSearch();
}

const confirmTest = async (test) => {
  try {
    await Api.confirm(test.id); // 假设confirm函数需要测试的ID
    toast.success('Test confirmed successfully', {autoClose: 60000});
    getAll(); // 刷新数据
  } catch (error) {
    toast.error('Failed to confirm test', {autoClose: 60000});
    console.error(error);
  }
};

const handleTableChangePage = (page) => {
  queryParams.page = page;
  getAll();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  queryParams.itemsPerPage = itemsPerPage;
  getAll();
}

const handleTableChangeSortBy = (sortBy) => {
  queryParams.sortBy = sortBy;
  getAll();
}
const copyUUID = (uuid) => {
  navigator.clipboard.writeText(uuid).then(() => {
    toast.success(`copy uuid ${uuid} successful`, {
      position: "bottom-center"
    });
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}
getAll();
</script>

<style scoped>

.uuid-clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}

.uuid-clickable:hover {
  opacity: 0.8;
}

.uuid-clickable:active {
  opacity: 0.6;
}
</style>
