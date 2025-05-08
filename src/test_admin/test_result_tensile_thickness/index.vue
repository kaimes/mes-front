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
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
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
        <template v-slot:no-data>
          <div class="text-center pa-4 text-grey">
            {{ $t('test_result_through_thickness_tensile.table.desc_list') }}
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn variant="text" icon="mdi-pencil" @click="handleEdit(item)" v-permission="`Detail`"/>
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
                  {{ $t('test_result_through_thickness_tensile.table.confirm') }}
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
<script name="TestResultTensileThickness" setup>
import { useRoute } from "vue-router";
import { getCurrentInstance, inject, reactive, ref, toRaw, toRefs, computed } from "vue";
import TestSampleCode from "../../components/picker/TestSampleCode.vue";
import useCommonStore from "@/app/common";
import EditForm from "./components/editForm.vue";
import API from "./api";
import { toast } from "vue3-toastify";
import {formatDate} from "@/util/util";
import { useI18n } from "vue-i18n";


const { t } = useI18n()
const commonStore = useCommonStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", fixed: true, sortable: false, align:"center",minWidth: "150px"},
  {
    title: "test_result_through_thickness_tensile.table.test_sample_code",
    key: "test_sample.test_sample_code",
    value: (item) => item.test_sample?.test_sample_code || "--",
  },
  {
    title: "test_result_through_thickness_tensile.table.test_sample_part",
    key: "test_sample.test_sample_part",
    value: (item) => item.test_sample?.test_sample_part || "--",
  },
  { title: "test_result_through_thickness_tensile.table.ria_1", key: "reduction_in_area_1" },
  { title: "test_result_through_thickness_tensile.table.ria_2", key: "reduction_in_area_2" },
  { title: "test_result_through_thickness_tensile.table.ria_3", key: "reduction_in_area_3" },
  { title: "test_result_through_thickness_tensile.table.ria_average", key: "ria_average" },
  { title: "test_result_through_thickness_tensile.table.uts_1_mpa", key: "value_mpa_1" },
  { title: "test_result_through_thickness_tensile.table.uts_2_mpa", key: "value_mpa_2" },
  { title: "test_result_through_thickness_tensile.table.uts_3_mpa", key: "value_mpa_3" },
  // { title: "Yield Rt051(MPA)", key: "yield_rt0_5_1" },
  // { title: "Yield Rt052(MPA)", key: "yield_rt0_5_2" },
  // { title: "Yield Rt053(MPA)", key: "yield_rt0_5_3" },
  { title: "test_result_through_thickness_tensile.table.tested_diameter_1", key: "tested_diameter_1" },
  { title: "test_result_through_thickness_tensile.table.tested_diameter_2", key: "tested_diameter_2" },
  { title: "test_result_through_thickness_tensile.table.tested_diameter_3", key: "tested_diameter_3" },
  {
    title: "test_result_through_thickness_tensile.table.created_at",
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
    params["fields"] = ["test_sample_id"];
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
