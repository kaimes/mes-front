<template>
  <v-container fluid class="content">
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <VueDatePicker
              v-model="dateRange"
              @update:model-value="formatDateValue"
              position="left"
              :range="{ partialRange: false }"
              :teleport="true"
          >
            <template #trigger>
              <v-text-field
                  :model-value="from_time ? `${from_time}~${to_time}` : ''"
                  density="default"
                  :label="$t('test_print_status.table.time_ransge')"
                  bg-color="white"
                  placeholder="Please select date"
                  :hide-details="true"
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="3">
          <v-select
              v-model="print_status_select"
              :items="printStatusList"
              item-title="title"
              item-value="value"
              :label="$t('test_print_status.table.print_status')"
              density="default"
              hide-details
              clearable
          ></v-select>
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
            <v-spacer />
            <v-btn
                variant="flat"
                class="text-none"
                color="primary"
                density="default"
                @click="handlePrintSummary"
            >
            {{ $t('test_print_status.table.print_summary') }}
            </v-btn>
            <v-btn
                variant="flat"
                class="text-none"
                color="primary"
                density="default"
                :loading="loading"
                :disabled="pdfLoading"
                @click="handlePrint(undefined)"
            >
            {{ $t('test_print_status.table.print_all') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fexid-header
          height="650"
          min-height="300"
          :headers="headers"
          :items="items"
          :loading="loading"
          item-value="type"
          fixed-header
          hide-default-footer
      >
        <template v-slot:item.title="{ item }">
          <router-link :to="{ path: '/test_list', query: { type: item.type } }">
            {{ item.title }}
          </router-link>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
              variant="flat"
              class="text-none"
              color="primary"
              density="default"
              :loading="loading"
              :disabled="pdfLoading || item.total === 0"
              @click="handlePrint(item.type)"
          >
          {{ $t('global.print') }}
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>
    <vue3-html2pdf
        ref="html2Pdf"
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="800"
        :filename="pdfName"
        :pdf-quality="1"
        :manual-pagination="true"
        pdf-format="a5"
        pdf-orientation="landscape"
        pdf-content-width="100%"
        @hasDownloaded="hasPrintDownloaded"
    >
      <template #pdf-content>
        <section
            v-for="item in prints"
            :key="item.id"
            class="html2pdf__page-break"
        >
          <component :is="getPrintComponent(item.type)" :tableData="item"/>
        </section>
      </template>
    </vue3-html2pdf>
    <v-dialog
        v-model="pdfLoading"
        max-width="340"
        persistent
    >
      <v-list
          class="py-2"
          color="primary"
          elevation="12"
          rounded="lg"
      >
        <v-list-item
            prepend-icon="$vuetify-outline"
            :title="`PDF file is being generated: ${currentBatch}/${allItems.length}`"
        >
          <template v-slot:prepend>
            <div class="pe-4">
              <v-icon color="primary" size="x-large"></v-icon>
            </div>
          </template>

          <template v-slot:append>
            <v-progress-circular
                color="primary"
                indeterminate="disable-shrink"
                size="16"
                width="2"
            ></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {ref, nextTick, getCurrentInstance, toRaw, computed} from 'vue';
import {filter, minBy, maxBy, upperCase, every, chunk, sortBy} from "lodash";
import {toast} from "vue3-toastify";
import { useI18n } from "vue-i18n";
import moment from "moment/moment";
// 不要去除 否则会出现编译异常
import jsPDF from 'jspdf'
import Vue3Html2pdf from 'vue3-html2pdf'
import PrintCardTensile from "@/test_admin/components/PrintCardTensile.vue";
import PrintCardBend from "@/test_admin/components/PrintCardBend.vue";
import PrintCardCleanness from "@/test_admin/components/PrintCardCleanness.vue";
import PrintCardHardness from "@/test_admin/components/PrintCardHardness.vue";
import PrintCardImpact from "@/test_admin/components/PrintCardImpact.vue";
import PrintCardSulphur from "@/test_admin/components/PrintCardSulphur.vue";
import PrintCardResistivity from "@/test_admin/components/PrintCardResistivity.vue";
import PrintCardHydrogen from "@/test_admin/components/PrintCardHydrogen.vue";
import PrintCardDecarburisation from "@/test_admin/components/PrintCardDecarburisation.vue";
import API from './api';

const {proxy} = getCurrentInstance();
const { t } = useI18n()
const loading = ref(false);
const pdfLoading = ref(false);
const print_status_select = ref('Not Printed')
const printStatusList = ref([
  {title: "Printed", value: "Printed"},
  {title: "Not Printed", value: "Not Printed"},
])

const dateRange = ref(undefined);
const from_time = ref()
const to_time = ref()
const items = ref([
  {
    type: "impact",
    title: upperCase("impact"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "tensile",
    title: upperCase("tensile"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "bend",
    title: upperCase("bend"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "cleanness",
    title: upperCase("cleanness"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "decarburisation",
    title: upperCase("decarburisation"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "hardness",
    title: upperCase("hardness"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "hydrogen",
    title: upperCase("hydrogen"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "prodan",
    title: upperCase("prodan"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "resistivity",
    title: upperCase("resistivity"),
    from: undefined,
    to: undefined,
    total: 0,
  },
  {
    type: "sulphur",
    title: upperCase("sulphur"),
    from: undefined,
    to: undefined,
    total: 0,
  },
]);
const prints = ref([]);
const printIds = ref([]);
const allItems = ref([]);
const currentBatch = ref(0);
const pdfName = ref(`test_print_status_${moment().format('YYYY-MM-DD HH:mm')}`);
const $types = ["impact", "tensile", "bend", "cleanness", "decarburisation", "hardness", "hydrogen", "prodan", "resistivity", "sulphur"];

const headersDefinition = ref([
  {title: 'test_print_status.table.test_type', key: 'title', sortable: false},
  {title: 'test_print_status.table.from', key: 'from', sortable: false},
  {title: 'test_print_status.table.to', key: 'to', sortable: false},
  {title: 'test_print_status.table.total', key: 'total', sortable: false},
  {title: "global.action", key: 'action', sortable: false},
]);

const headers = computed(() => {
  return headersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});


const dataGenerate = (type, arr) => {
  const $data = {
    type,
    title: upperCase(type),
    from: undefined,
    to: undefined,
    total: 0,
  };
  const $arr = filter(arr, (item) => item.type === type);
  if ($arr.length > 0) {
    $data.total = $arr.length;
    const $from = minBy($arr, 'test_code') || {};
    if ($from.id) {
      $data.from = $from["test_code"];
    }
    const $to = maxBy($arr, 'test_code');
    if ($to.id) {
      $data.to = $to["test_code"];
    }
  }
  return $data;
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  print_status_select.value = "Not Printed";
  handleSearch();
}

const handlePrintSummary = () => {
  proxy.$print("Test Print Status", toRaw(headers.value), toRaw(items.value));
}

const handleClearDate = () => {
  from_time.value = undefined;
  to_time.value = undefined;
}

const handleSearch = async () => {
  loading.value = true;
  try {
    const $query = {
      fields: [],
      ops: [],
      values: [],
    };
    if (from_time.value) {
      $query["from_time"] = from_time.value;
      $query["to_time"] = to_time.value;
    }
    if (print_status_select.value) {
      $query.fields.push("print_status");
      $query.ops.push("eq");
      $query.values.push(print_status_select.value);
    }
    const response = await API.getAll($query);
    const $data = response.data || [];
    if ($data.length > 0) {
      items.value = $types.map(type => dataGenerate(type, $data));
    }
  } catch (error) {
    toast.error(error?.response?.data?.detail || "Failed to get data", {autoClose: 60000});
  } finally {
    loading.value = false;
  }
};

const formatDateValue = (res) => {
  console.log("res", res)
  if (res && res.length === 2) {
    from_time.value = moment(res[0]).format("YYYY-MM-DD");
    to_time.value = moment(res[1]).format("YYYY-MM-DD");
  } else {
    from_time.value = undefined;
    to_time.value = undefined;
  }
}

function getPrintComponent(type) {
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

function handlePrintChange() {
  API.bulkUpdate({ids: printIds.value}).then(res => {
    prints.value = [];
    printIds.value = [];
    handleSearch();
  });
}

// 新增批次处理方法
function processNextBatch() {
  const $values = allItems.value[currentBatch.value];
  // 说明已经打印完全部的数据了
  if (!$values) {
    pdfLoading.value = false;
    toast.success("All data has been printed");
    nextTick(() => {
      currentBatch.value = 0;
    });
    handlePrintChange();
    return;
  }
  prints.value = $values;
  currentBatch.value += 1;
  nextTick(async () => {
    console.log("*******start")
    proxy.$refs["html2Pdf"].generatePdf()
  });
}

async function handlePrint(type) {
  pdfName.value = `test_print_status_${moment().format('YYYY-MM-DD HH:mm')}`;
  const $parmas = {
    fields: ["print_status"],
    ops: ["eq"],
    values: [print_status_select.value],
    page: 1,
    itemsPerPage: 999,
    sortBy: ["created_at"],
    descending: [true],
  };
  if (type) {
    $parmas.fields.push("type");
    $parmas.ops.push("eq");
    $parmas.values.push(type);
  }
  if (from_time.value) {
    $parmas.fields.push("created_at");
    $parmas.ops.push(">=");
    $parmas.values.push(from_time.value);
  }

  if (to_time.value) {
    $parmas.fields.push("created_at");
    $parmas.ops.push("<=");
    $parmas.values.push(to_time.value);
  }
  loading.value = true;
  try {
    const {data} = await API.getAllData($parmas);
    if (data.total === 0) {
      loading.value = false;
      toast.info("No print data available");
      return;
    }
    loading.value = false;
    // 缓存数据ID
    printIds.value = data.items.map(item => item.id);
    // 处理排序分组
    let $arr = [];
    if (!type) {
      $types.forEach(value => {
        const $typeArr = filter(data.items, (item) => item.type === value);
        if ($typeArr.length > 0) {
          const $typeOrderArr = sortBy($typeArr, 'test_code')
          $arr.push(...$typeOrderArr);
        }
      });
    } else {
      $arr = sortBy(data.items, 'test_code');
    }
    allItems.value = chunk($arr, 15);
    pdfLoading.value = true;
    processNextBatch()
  } catch (e) {
    toast.info("Loading Data Error");
    loading.value = false;
  }
}

const hasPrintDownloaded = (e) => {
  console.log("<<<<<<<<<<<<<<<<<下载", e)
  processNextBatch();
}

handleSearch();
</script>
