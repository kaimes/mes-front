<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <test-sample-code v-model="queryParams.test_sample_id" hide-details />
        </v-col>
        <v-col cols="3">
          <runout-code v-model="queryParams.runout_id" />
        </v-col>
        <v-col cols="3">
          <cast-code v-model="queryParams.cast_id" />
        </v-col>
        <v-col cols="3">
          <spec-code v-model="queryParams.spec_id" />
        </v-col>
        <v-col cols="3">
          <DictCode
            v-model="queryParams.source"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.source')"
            :code="`test_sample_source#${defaultMillCode}`"
            hide-details
            bg-color="white"
            multiple
        />
        </v-col>
        <v-col cols="3">
          <DictCode
              v-model="queryParams.status"
              variant="underlined"
              density="default"
              code="test_sample_status"
              :label="$t('test_sample.table.status')"
              hide-details
              multiple
          />
        </v-col>
        <v-col cols="3">
          <DictCode
              v-model="queryParams.standard"
              code="result_standard"
              :label="$t('test_sample.table.standard')"
              item-title="title"
              item-value="value"
              density="default"
          />
        </v-col>
        <v-col cols="3">
          <inspector-code
              v-model="queryParams.inspector_id"
              label="Inspector"
              density="default"
              persistent-placeholder

              hide-details
          />
        </v-col>
        <v-col cols="3">
          <VueDatePicker @update:model-value="UpdateStartDate" :teleport="true" :enable-time-picker="false"
                         class="mt-6">
            <template #trigger>
              <v-text-field
                  v-model="queryParams.start_date"
                  :label="$t('test_sample.table.start_date')"
                  readonly
                  clearable
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>

        <v-col cols="3">
          <VueDatePicker @update:model-value="UpdateEndDate" :teleport="true" :enable-time-picker="false" class="mt-6">
            <template #trigger>
              <v-text-field
                  v-model="queryParams.end_date"
                  :label="$t('test_sample.table.end_date')"
                  readonly
                  clearable
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
        <v-col cols="3">
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
            class="text-none ml-4"
            color="primary"
            variant="flat"
            :loading="loading"  style="margin-right: 16px;"
            v-permission="`Search`"
          >
          {{ $t('global.search') }}
          </v-btn>
        </v-col>
        <v-col cols="3" class="text-end">
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="handleEditNew"
              v-permission="`Create`"
          >
          {{ $t('global.new') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center ga-2">
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0"
            @click="handleCut"
            v-permission="`Cut`"
        >
        {{ $t('test_sample.table.cut') }}
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0"
            @click="handleReserve"
        >
        {{ $t('test_sample.table.receive') }}
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handlePrint"
            v-permission="`Print`"
        >
        {{ $t('global.print') }}
        </v-btn>
        <v-spacer />
        <v-btn
            variant="text"
            icon="mdi-menu"
            @click="handleOpen"
        />
      </div>
      <v-data-table-server
        fixed-header
        height="650"
        show-current-page
        min-height="300"
        v-model:items-per-page="queryParams.itemsPerPage"
        v-model:page="queryParams.page"
        v-model:sort-by="queryParams.sortBy"
        v-model:sort-desc="queryParams.descending"
        item-selectable="selectable"
        :headers="tableHeaders"
        :items="tableList"
        :items-length="total"
        :loading="loading"
        @update:options="handleTableChange"
        v-model="selected"
        show-select
      >
        <template v-slot:item.data-table-select="{ internalItem, isSelected, toggleSelect }">
          <v-checkbox-btn
            :model-value="isSelected(internalItem)"
            @update:model-value="toggleSelect(internalItem)"
          ></v-checkbox-btn>
        </template>
        <template v-slot:item.action="{ item }">

          <v-btn-group density="compact" variant="outlined" divided>
            <v-btn size="x-small" @click="go_test_result_page('/test_list', item)" v-permission="`Test`">{{ $t('test_sample.table.test') }}</v-btn>
            <v-btn size="x-small" @click="go_test_result_page('/test_result_tensile', item)" v-permission="`Tensile`">{{ $t('test_sample.table.tensile') }}</v-btn>
            <v-btn size="x-small" @click="go_test_result_page('/test_result_impact', item)" v-permission="`Impact`">{{ $t('test_sample.table.impact') }}</v-btn>
            <v-btn size="x-small" @click="go_test_result_page('/test_result_chemical', item)" v-permission="`Chemical`">{{ $t('test_sample.table.chemical') }}</v-btn>
            <v-btn size="x-small" @click="go_test_result_page('/test_result_tensile_thickness', item)" v-permission="`Through Thickness`">{{ $t('test_sample.table.through_thickness') }}</v-btn>
            <v-btn icon="mdi-pencil" @click="handleEdit(item)" v-permission="`Detail`"/>
            <v-dialog max-width="400" persistent >
              <template v-slot:activator="{ props: activatorProps }" >
                <v-btn icon="mdi-delete" v-bind="activatorProps" v-permission="`Delete`"/>
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
          </v-btn-group>

        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <EditForm ref="editFormRef" @refresh="handleSearch" />
    <MesTable ref="tableRef" name="test_sample"  v-model="tableHeaders" />
  </v-container>
</template>
<script name="TestSample" setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { getCurrentInstance, inject, reactive, ref, toRaw, toRefs ,computed,watch} from "vue";
import { toLower} from "lodash";
import TestSampleCode from "../../components/picker/TestSampleCode.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import InspectorCode from "@/components/picker/InspectorCode.vue";
import useCommonStore from "@/app/common";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import {formatDate} from "@/util/util";
import EditForm from "./components/editForm.vue";
import API from "./api";
import router from "../../router";
import MesTable from "@/components/table/index.vue";
import printJS from "print-js";
import moment from "moment";
import { includes } from "xe-utils";

const store = useStore();
const { t } = useI18n()
const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));


const commonStore = useCommonStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", fixed: true, sortable: false, align:"center"},
  
  { title: "test_sample.table.test_sample_code", key: "test_sample_code" },
  { title: "test_sample.table.test_sample_part", key: "test_sample_part" },
  { title: "test_sample.table.ref_code", key: "ref_code" },
  {
    title: "test_sample.table.mill_code",
    key: "mill.code",
    value: (item) => item.mill?.code || "--",
  },
  {
    title: "test_sample.table.spec_code",
    key: "spec.spec_code",
    value: (item) => item.spec?.spec_code || "--",
  },
  { title: "test_sample.table.short_name", key: "spec_name",
  value: (item) => item.spec?.short_name || "--",
 },
  {
    title: "test_sample.table.rolling_code",
    key: "rolling_code",
    value: (item) => item.runout?.rolling?.rolling_code || "--",
  },
  {
    title: "test_sample.table.cast_code",
    key: "cast.cast_code",
    value: (item) => item.runout?.cast?.cast_code || "--",
  },
  {
    title: "test_sample.table.runout_code",
    key: "runout.runout_code",
    value: (item) => item.runout?.runout_code || "--",
  },
  { title: "test_sample.table.finished_product",
    key: "finished_product.code", 
    value: (item) => item.finished_product?.code || "--", },
  {
    title: "test_sample.table.area_code",
    key: "area.code",
    value: (item) => item.area?.code || "--",
  },

  { title: "test_sample.table.size", key: "size_mm" },
  { title: "test_sample.table.reason", key: "reason_code" },
  { title: "test_sample.table.comment", key: "comment" },
  { title: "test_sample.table.status", key: "status" },
  { title: "test_sample.table.product_name", key: "product_name" },
  // {
  //   title: "ProductCode",
  //   key: "ProductName",
  //   value: (item) => item.runout?.product_type?.code || "--",
  // },
  { title: "test_sample.table.sample_thickness", key: "sample_thickness" },
  { title: "test_sample.table.sample_info", key: "sample_info" },
  { title: "test_sample.table.retest", key: "retest" },
  { title: "test_sample.table.orientation", key: "orientation" },
  { title: "test_sample.table.standard", key: "standard" },
  { title: "test_sample.table.inspector", key: "inspector.code",value: (item) => item.inspector?.code || "--", },
  { title: "test_sample.table.inspector_longname", key: "inspector.name",value: (item) => item.inspector?.name || "--", },
  // { title: "SpecDetails", key: "spec_details" },
  // { title: "SpecDesc", key: "spec_desc" },
  { title: "test_sample.table.source", key: "source" }, 
  {
    title: "test_sample.table.created_at",
    key: "created_at",
    sortable: true,
    value: (item) => formatDate(item.created_at),
    minWidth: 180
  },
]);
const printFields = [
  {displayName: "Test Sample Code", field: "test_sample_code"},
  {displayName: "Ref Code", field: "ref_code"},
  {displayName: "Test Sample Part", field: "test_sample_part"},
  {displayName: "Mill Code", field: "mill_code"},
  {displayName: "Spec Code", field: "spec_code"},
  {displayName: "Short Name", field: "spec_name"},
  {displayName: "Rolling Code", field: "rolling_code"},
  {displayName: "Cast Code", field: "cast_code"},
  {displayName: "Runout Code", field: "runout_code"},
  {displayName: "Finished Product", field: "finished_product_code"},
  {displayName: "Area Code", field: "area_code"},
  { displayName: "Size", field: "size_mm" },
  { displayName: "Reason", field: "reason_code" },
  { displayName: "Comment", field: "comment" },
  {displayName: "Status", field: "status"},
  {displayName: "Product Name", field: "product_name"},
  { displayName: "Sample Thickness", field: "sample_thickness" },
  { displayName: "Sample Info", field: "sample_info" },
  { displayName: "Retest", field: "retest" },
  { displayName: "Orientation", field: "orientation" },
  { displayName: "Standard", field: "standard" },
  { displayName: "Inspector", field: "inspector" },
  { displayName: "Inspector Longname", field: "inspector_longname" },
  { displayName: "Source", field: "source" },
  { displayName: "Created At", field: "created_at" },
];
const tableList = ref([]);
const total = ref(0);
const selected = ref([]);

const tableHeaders = computed(() => {
  return tableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const handleCut = () => {
  const list = toRaw(selected.value);

  loading.value = true;
  API.cut({ list })
    .then(() => {
      toast.success("Cut Success", {
        position: "bottom-center",
      });
      getData();
    })
    .catch((res) => {
      toast.error(res?.response?.data?.detail || "Cut Fail", { autoClose: 60000 });
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleReserve = () => {
  const list = toRaw(selected.value);

  loading.value = true;
  API.reserve({ list })
    .then(() => {
      toast.success("Receive Success", {
        position: "bottom-center",
      });
      getData();
    })
    .catch((res) => {
      toast.error(res?.response?.data?.detail || "Fail", { autoClose: 60000 });
    })
    .finally(() => {
      loading.value = false;
    });
};

const data = reactive({
  queryParams: {
    test_sample_id: null,
    runout_id: null,
    spec_id: null,
    cast_id: null,
    source: [],
    status: ['A', 'C', 'T', 'R'],
    standard: null,
    inspector_id: null,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
    start_date: moment().subtract(2, 'weeks').format("YYYY-MM-DD"),
    end_date: moment().add(1, 'days').format("YYYY-MM-DD"),
  },
});

const { queryParams } = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value),
  };
  let fields = [];
  let ops = [];
  let values = [];
  let filter_type = undefined;
  if (params.source.length>0) {
    if (params.source.includes('PCC')) {
      fields.push("source");
      ops.push("is_null");
      values.push(true);
      fields.push("source");
      ops.push("in");
      values.push(params.source);
      filter_type='custom'
      delete params.source;

    }else{
      fields.push("source");
      ops.push("in");
      values.push(params.source);
      delete params.source;
    }
  }
  if (params.test_sample_id) {
    fields.push("id");
    ops.push("eq");
    values.push(params.test_sample_id);
    delete params.test_sample_id;
  }
  if (params.runout_id) {
    fields.push("runout_id");
    ops.push("eq");
    values.push(params.runout_id);
    delete params.runout_id;
  }
  if (params.spec_id) {
    fields.push("spec_id");
    ops.push("eq");
    values.push(params.spec_id);
    delete params.spec_id;
  }
  if (params.cast_id) {
    fields.push("cast_id");
    ops.push("eq");
    values.push(params.cast_id);
    delete params.cast_id;
  }
  if (params.status.length >0) {
    fields.push("status");
    ops.push("in");
    values.push(params.status);
    delete params.status;
  }
  if (params.standard) {
    fields.push("standard");
    ops.push("eq");
    values.push(params.standard);
    delete params.standard;
  }
  if (params.inspector_id) {
    fields.push("inspector_id");
    ops.push("eq");
    values.push(params.inspector_id);
    delete params.inspector_id;
  }
  params["fields"] = fields;
  params["ops"] = ops;
  params["values"] = values;
  params["filter_type"] = filter_type;

  loading.value = true;
  API.getAll(params)
    .then((res) => {
      total.value = res.data.total || 0;
      tableList.value = (res.data.items || []).map(item => ({
        ...item,
        selectable: item.status !== "A"
      }));
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleTableChange = ({ page, itemsPerPage }) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
};
const go_test_result_page = (path, item) => {
  commonStore.setTestSample(item);
  router.push({
    path: path,
    query: { test_sample_id: item.id, test_sample_code: item.test_sample_code },
  });
};

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
};

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  selected.value = [];
  handleSearch();
};

const handlePrint = () => {
  const printData = tableList.value.map(it => {
    return {
      test_sample_code: it.test_sample_code || "",
      ref_code: it.ref_code || "",
      test_sample_part: it.test_sample_part || "",
      mill_code: it.mill?.code || "",
      spec_code: it.spec?.spec_code || "",
      spec_name: it.spec?.short_name || "",
      rolling_code: it.runout?.rolling?.rolling_code || "",
      cast_code: it.runout?.cast?.cast_code || "",
      runout_code: it.runout?.runout_code || "",
      finished_product_code: it.finished_product?.code || "",
      area_code: it.area?.code || "",
      status: it.status || "",
      size_mm: it.size_mm || "",
      reason_code: it.reason_code || "",
      comment: it.comment || "",
      product_name: it.product_name || "",
      product_type_code: it.runout?.product_type?.code || "",
      sample_thickness: it?.sample_thickness || "",
      sample_info: it?.sample_info || "",
      retest: it?.retest || "",
      orientation: it?.orientation || "",
      standard: it?.standard || "",
      inspector: it?.inspector || "",
      inspector_longname: it?.inspector_longname || "",
      spec_details: it?.spec_details || "",
      spec_desc: it?.spec_desc || "",
      source: it?.source || "",
      created_at: formatDate(it.created_at),
    };
  });
  // 处理筛选出来的字段
  const $titles = tableHeaders.value.map(item => item.title);
  const properties = printFields.filter((item) => $titles.includes(item.displayName));
  printJS({
    printable: printData,
    properties,
    type: "json",
    header: "Test Sample",
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

// 创建新数据
const handleEditNew = () => {
  proxy.$refs["editFormRef"].handleShow(false);
};


const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
};

const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id)
    .then(() => {
      toast.success("Delete Success", {
        position: "bottom-center",
      });
      getData();
    })
    .catch((res) => {
      toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
    });
};
const UpdateStartDate=(res) => {
      if (res) {
        queryParams.value.start_date = moment(res).format("YYYY-MM-DD");
      } else {
        queryParams.value.start_date = null;
      }
    };
const UpdateEndDate= (res) => {
      if (res) {
        queryParams.value.end_date = moment(res).format("YYYY-MM-DD");
      } else {
        queryParams.value.end_date = null;
      }
    };
watch(defaultMillCode, (newValue) => {
  if (newValue==='srsm'){
    data.queryParams.source=[];
  } else {
    data.queryParams.source=['TE13-Allocate','TD17-Reserve','TF84-Part-Sawn'];
  }
},{immediate: true});
getData();
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
