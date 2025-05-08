<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row>
        <v-col cols="3">
          <test-sample-code v-model="queryParams.test_sample_id" />
        </v-col>
        <v-col cols="3">
          <v-btn
            class="text-none ml-4"
            color="#e3e3e3"
            variant="flat"
            @click="handleReset"
          >
          {{ $t('global.reset') }}
          </v-btn>
          <v-btn
            type="submit"
            class="text-none ml-4 mr-4 my-1"
            color="primary"
            variant="flat"
            :loading="loading"
            v-permission="`Search`"
          >
          {{ $t('global.search') }}
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn
            class="text-none ml-4"
            color="primary"
            variant="flat"
            @click="handleEdit"
            v-permission="`Create`"
          >
          {{ $t('global.new') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
        fixed-header
        height="650"
        show-current-page
        min-height="300"
        v-model:items-per-page="queryParams.itemsPerPage"
        v-model:page="queryParams.page"
        v-model:sort-by="queryParams.sortBy"
        v-model:sort-desc="queryParams.descending"
        :headers="tableHeaders"
        :items="tableList"
        :items-length="total"
        :loading="loading"
        @update:options="handleTableChange"
      >
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn variant="text" icon="mdi-pencil" @click="handleEdit(item)"  v-permission="`Detail`"/>
          <v-dialog max-width="400" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn variant="text" icon="mdi-delete" v-bind="activatorProps" v-permission="`Delete`"/>
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
    <EditForm ref="editFormRef" @refresh="handleSearch" />
  </v-container>
</template>
<script name="TestResultTensile" setup>
import { useRoute, useRouter } from "vue-router";
import {formatDate} from "@/util/util";
import { getCurrentInstance, inject, reactive, ref, toRaw, toRefs, computed } from "vue";
import TestSampleCode from "../../components/picker/TestSampleCode.vue";
import useCommonStore from "@/app/common";
import EditForm from "./components/editForm.vue";
import API from "./api";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";


const { t } = useI18n()

const router = useRouter();
const commonStore = useCommonStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", fixed: true, sortable: false, align:"center",minWidth: "150px"},

  {
    title: "test_result_tensile.table.test_sample_code",
    key: "test.test_sample.table.test_sample_code",
    value: (item) => item.test?.test_sample?.test_sample_code || "--",
  },
  { title: "test_result_tensile.table.orientation", key: "orientation" },
  {
    title: "test_result_tensile.table.test_sample_part",
    key: "test.test_sample.test_sample_part",
    value: (item) => item.test?.test_sample?.test_sample_part || "--",
  },
  { title: "test_result_tensile.table.standard", key: "standard" },
  { title: "test_result_tensile.table.insp_code", key: "insp_code" },
  { title: "test_result_tensile.table.sample_shape", key: "sample_shape" },
  { title: "test_result_tensile.table.tested_thickness", key: "tested_thickness" },
  { title: "test_result_tensile.table.tested_width", key: "tested_width" },
  { title: "test_result_tensile.table.tested_diameter", key: "tested_diameter" },
  { title: "test_result_tensile.table.uts", key: "value_mpa" },
  { title: "test_result_tensile.table.yield_rt", key: "yield_tt0_5" },
  { title: "test_result_tensile.table.yield_high", key: "yield_high" },
  { title: "test_result_tensile.table.yield_rp", key: "yield_rp0_2" },
  { title: "test_result_tensile.table.yield_low", key: "yield_low" },
  { title: "test_result_tensile.table.elongation_code", key: "elongation_code" },
  { title: "test_result_tensile.table.elongation_a565", key: "elongation_a565" },
  { title: "test_result_tensile.table.elongation_a200", key: "elongation_a200" },
  { title: "test_result_tensile.table.elongation_a50", key: "elongation_a50" },
  { title: "test_result_tensile.table.elongation_8_in", key: "elongation_8" },
  { title: "test_result_tensile.table.elongation_2_in", key: "elongation_2" },
  { title: "test_result_tensile.table.elongation_a80", key: "elongation_a80" },
  {
    title: "test_result_tensile.table.created_at",
    key: "created_at",
    sortable: true,
    value: (item) => formatDate(item.created_at),
    minWidth: 180
  },

]);
const tableList = ref([]);
const total = ref(0);

const tableHeaders = computed(() => {
  return tableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const data = reactive({
  queryParams: {
    test_sample_id: null,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
});

const { queryParams } = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value),
  };

  if (params.test_sample_id) {
    params["fields"] = ["test.test_sample_id"];
    params["ops"] = ["=="];
    params["values"] = [params.test_sample_id];
    delete params.test_sample_id;
  }
  loading.value = true;
  API.getAll(params)
    .then((res) => {
      total.value = res.data.total || 0;
      tableList.value = res.data.items;
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

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
};

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
};

// 创建新数据
const handleEdit = (data) => {
  router.push({
    path: "/test_edit",
    query: {  
      type: "tensile",
      id: data.id  
    }
  });
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
let route_test_sample_id = route.query.test_sample_id;
if (route_test_sample_id) {
  data.queryParams.test_sample_id = parseInt(route_test_sample_id, 10);
}

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
