<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <v-text-field
            v-model="queryParams.code"
            label="Job No"
            density="default"
            variant="underlined"
            :hide-details="true"
          />
        </v-col>
        <v-col cols="2">
          <dict-code
                v-model="queryParams.state"
                :hide-details="true"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="State"
                placeholder="State"
                code="test_job_state"
            />
        </v-col>
        <v-col cols="2">
          <v-text-field
              v-model="queryParams.investigator"
              label="Investigator"
              density="default"
              variant="underlined"
              :hide-details="true"
          />
        </v-col>
        <v-col cols="2">
          <VueDatePicker
                v-model="queryParams.start_date"
                :enable-time-picker="false"
                :teleport="true"
                position="left"
                @update:model-value="handlePickDate($event, 'start_date')"
            >
              <template #trigger>
                <v-text-field
                    v-model="queryParams.start_date"
                    label="Start Date"
                    density="default"
                    variant="underlined"
                    :hide-details="true"
                    clearable
                    readonly
                ></v-text-field>
              </template>
            </VueDatePicker>
        </v-col>
        <v-col cols="2">
          <VueDatePicker
                v-model="queryParams.end_date"
                :enable-time-picker="false"
                :teleport="true"
                position="left"
                @update:model-value="handlePickDate($event, 'end_date')"
            >
              <template #trigger>
                <v-text-field
                    v-model="queryParams.end_date"
                    label="End Date"
                    density="default"
                    variant="underlined"
                    :hide-details="true"
                    clearable
                    readonly
                ></v-text-field>
              </template>
            </VueDatePicker>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-items-center ga-2">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              Reset
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
            >
              Search
            </v-btn>
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                :disabled="!(selected.length === 1)"
                @click="handlePrint"
            >
              Print Job Sheet
            </v-btn>
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="3" class="text-end">
          <router-link v-permission="`Create`" :to="{ path: '/test_mljc/detail' }">
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                v-permission="`Create`"
            >
              New
            </v-btn>
          </router-link>
        </v-col>
        
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          v-model="selected"
          fixed-header
          show-current-page
          show-select
          return-object
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          item-value="id"
          @update:options="handleTableChange"
      >
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>

        <template v-slot:item.state="{ item}">
          {{ testJobState[item.state] || item.state }}
        </template>

        <template v-slot:item.job_category="{ item}">
          {{ testJobJobCategory[item.job_category] || item.job_category }}
        </template>

        <template v-slot:item.action="{ item }">
          <!-- <v-btn-group density="compact" variant="outlined" divided>
            <v-btn size="x-small" @click="go_test_result_page('/test_result_tensile', item)" v-permission="`Decarburization`">Decarburization</v-btn>
            <v-btn size="x-small" @click="go_test_result_page('/test_result_impact', item)" v-permission="`Sulphur Print`">Sulphur Print</v-btn>
            <v-btn size="x-small" @click="go_test_result_page('/test_result_chemical', item)" v-permission="`Cleanness`">Cleanness</v-btn>
            <router-link :to="{ path: '/test_jominy/detail', query: { id: item.id } }">
              <v-btn
                  variant="text"
                  icon="mdi-pencil"
                  v-permission="`Detail`"
                  @click="$router.push({ path: '/test_mljc/detail', query: { id: item.id } })"
              />
            </router-link>
            
          </v-btn-group> -->
          <v-btn
                  variant="text"
                  icon="mdi-pencil"
                  v-permission="`Detail`"
                  @click="$router.push({ path: '/test_mljc/detail', query: { id: item.id } })"
              />
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
                      Cancel
                    </v-btn>
                    <v-btn
                        class="text-none"
                        color="primary"
                        variant="flat"
                        @click="handleDelete(isActive, item)"
                    >
                      Confirm
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
    <vue3-html2pdf
        ref="html2Pdf"
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="true"
        :paginate-elements-by-height="800"
        filename="job_card"
        :pdf-quality="1"
        :manual-pagination="true"
        pdf-format="a5"
        pdf-orientation="landscape"
        pdf-content-width="100%"
    >
      <template #pdf-content>
        <PrintCard :job="selected[0] || {}" />
      </template>
    </vue3-html2pdf>
  </v-container>
</template>
<script name="MainElementAnalysis" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
// 不要去除 否则会出现编译异常
import jsPDF from 'jspdf'
import Vue3Html2pdf from 'vue3-html2pdf'
import useCommonStore from "@/app/common";
import DictCode from "@/components/picker/DictCode.vue";
import moment from "moment";
import router from "@/router";
import {formatDate} from "@/util/util";
import PrintCard from "./print_card.vue";
import API from "./api";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const castLoading = ref(false);

const testJobState = {
  O: "O-Ongoing",
  C: "C-Completed",
}

const testJobJobCategory = {
  R: "R-Regular",
  O: "O-Other",
}

const tableHeaders = ref([
  {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "Job No.", key: "code"},
  {title: "Investigator", key: "investigator"},
  {title: "State", key: "state"},
  {title: "Cast", key: "cast"},
  {title: "Customer", key: "customer"},
  {title: "Initiated Date", key: "initiated_date", value: (item) => formatDate(item.initiated_date, "YYYY-MM-DD")},
  {title: "Completed Date", key: "completed_date", value: (item) => formatDate(item.completed_date, "YYYY-MM-DD")},
  {title: "Quality", key: "quality"},
  {title: "Grade", key: "grade"},
  {title: "Size", key: "size"},
  {title: "Investigation", key: "investigation"},
  {title: "Job Category", key: "job_category"},
  
]);
const tableList = ref([{'investigator': 1}]);
const total = ref(0);

const selected = ref([]);

const data = reactive({
  queryParams: {
    code: undefined,
    state: undefined,
    investigator: undefined,
    start_date: undefined,
    end_date: moment().format("YYYY-MM-DD"),
    page: 1,
    itemsPerPage: 10,
    sortBy: ["code"],
    descending: [true],
  },
});

const {queryParams, form} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  params["fields"] = []
  params["ops"] = []
  params["values"] = []
  if (params.code) {
    params["fields"].push("code");
    params["ops"].push("like");
    params["values"].push(`%${params.code}%`); 
  }
  if (params.state) {
    params["fields"].push("state");
    params["ops"].push("eq");
    params["values"].push(params.state); 
  }
  if (params.investigator) {
    params["fields"].push("investigator");
    params["ops"].push("eq");
    params["values"].push(`${params.investigator}`); 
  }
  if(params.start_date && params.end_date) {
    params["fields"].push("created_at");
    params["ops"].push(">=");
    params["values"].push(params.start_date); 

    params["fields"].push("created_at");
    params["ops"].push("<=");
    params["values"].push(params.end_date); 
  }
  if (params.fields.length > 1){
    params.filter_type = 'and'
  }

  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
    } else {
      total.value = 0;
      tableList.value = [];
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
  getData();
}

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

// 创建新数据
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
}

const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getData();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
  });
}

const UpdateStartDate = (res) => {
  if (res) {
    queryParams.start_date = moment(res).format("YYYY-MM-DD");
  }
}

const go_test_result_page = (path, item) => {
  commonStore.setTestSample(item);
  router.push({
    path: path,
    query: { test_sample_id: item.id, test_sample_code: item.test_sample_code },
  });
};

const handlePickDate = (date, field) => {
  queryParams.value[field] = formatDate(date, "YYYY-MM-DD");
}

const handlePrint = () => {
  proxy.$refs["html2Pdf"].generatePdf()
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
