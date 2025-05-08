<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
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
<script name="TestResultImpact" setup>
import { useRoute, useRouter } from "vue-router";
import {formatDate} from "@/util/util";
import { toast } from "vue3-toastify";
import { getCurrentInstance, inject, reactive, ref, toRaw, toRefs, computed } from "vue";
import TestSampleCode from "../../components/picker/TestSampleCode.vue";
import useCommonStore from "@/app/common";
import EditForm from "./components/editForm.vue";
import API from "./api";
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const router = useRouter();
const commonStore = useCommonStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {
    title: "test_result_impact.table.test_sample_code",
    key: "test.test_sample.test_sample_code",
    minWidth: 150,
    value: (item) => item.test?.test_sample?.test_sample_code || "--",
  },
  { title: "test_result_impact.table.orientation", key: "orientation" },
  {
    title: "test_result_impact.table.test_sample_part",
    key: "test.test_sample.test_sample_part",
    minWidth: 150,
    value: (item) => item.test?.test_sample?.test_sample_part || "--",
  },
  { title: "test_result_impact.table.standard", key: "standard" },
  { title: "test_result_impact.table.temperature_units", minWidth: 150, key: "temp_units" },
  { title: "test_result_impact.table.impact_units", key: "impact_units" },
  { title: "test_result_impact.table.insp_code", key: "insp_code" },
  { title: "test_result_impact.table.size_code", key: "size_code" },
  { title: "test_result_impact.table.retest_no", key: "retest_seq" },
  { title: "test_result_impact.table.impact_temp_c", minWidth: 150, key: "temp_c" },
  { title: "test_result_impact.table.impact_temp_f", minWidth: 150, key: "temp_f" },
  { title: "test_result_impact.table.impact_energy_1_j", minWidth: 150, key: "energy_1_j" },
  { title: "test_result_impact.table.impact_energy_2_j", minWidth: 150, key: "energy_2_j" },
  { title: "test_result_impact.table.impact_energy_3_j", minWidth: 150, key: "energy_3_j" },
  { title: "test_result_impact.table.impact_energy_average_j", minWidth: 150, key: "energy_average_j" },
  {
    title: "test_result_impact.table.impact_energy_1_f",
    minWidth: 150,
    key: "energy_1_f",
    value: (item) => item.standard != 'BSEN' ? item.energy_1_f : "--"
  },
  {
    title: "test_result_impact.table.impact_energy_2_f",
    minWidth: 150,
    key: "energy_2_f",
    value: (item) => item.standard != 'BSEN' ? item.energy_2_f : "--"
  },
  {
    title: "test_result_impact.table.impact_energy_3_f",
    minWidth: 150,
    key: "energy_3_f",
    value: (item) => item.standard != 'BSEN' ? item.energy_3_f : "--"
  },
  {
    title: "test_result_impact.table.impact_energy_average_f",
    minWidth: 150,
    key: "energy_average_f",
    value: (item) => item.standard != 'BSEN' ? item.energy_average_f : "--"
  },
  { title: "test_result_impact.table.impact_shear_1", minWidth: 150, key: "shear_1" },
  { title: "test_result_impact.table.impact_shear_2", minWidth: 150, key: "shear_2" },
  { title: "test_result_impact.table.impact_shear_3", minWidth: 150, key: "shear_3" },
  { title: "test_result_impact.table.impact_shear_average", minWidth: 150, key: "shear_average" },
  {
    title: "test_result_impact.table.created_at",
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
      console.log('res',res.data.items);

      res.data.items.forEach(item => {
        // 在这里处理每个 item
        console.log('item', item);
        if (item.impact_units =='J'){
          item.impact_units = 'J - Joules'
        }else if (item.impact_units =='F'){
          item.impact_units = 'F - Ftlbs'
        }
        
      });
      
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
      type: "impact"  
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
