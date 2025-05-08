<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <spec-code v-model="queryParams.spec_code" @change="handleSpecChange($event, 'beforeCode')" />
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none ml-4"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            Reset
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 my-1"
              color="primary"
              variant="flat"
              :loading="loading"
          >
            Search
          </v-btn>
        </v-col>
        <v-col cols="3"></v-col>
        <v-col cols="4">
          <div class="d-flex align-center" v-permission="`Copy To`">
            <v-dialog
                max-width="500"
                persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <div>
                  <v-btn
                      class="text-none mr-4"
                      color="primary"
                      variant="flat"
                      :disabled="!form.beforeCode || !form.afterCode"
                      v-bind="activatorProps"
                  >
                    Copy To
                  </v-btn>
                  <v-tooltip :disabled="form.beforeCode && form.afterCode" activator="parent" location="bottom">
                    Please Select a Destination Spec Code
                  </v-tooltip>
                </div>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card
                    prepend-icon="mdi-help-circle-outline"
                    title="Are you sure to copy impact requirements?"
                    :text="`Copy ${form.beforeCode} to ${form.afterCode}`"
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
                        @click="handleCopy(isActive)"
                    >
                      Confirm
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
              <spec-code v-model="form.afterId" :store="false" :hide-details="false" @change="handleSpecChange($event, 'afterCode')" />
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="6" class="text-end">
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="handleEdit(undefined)"
              v-permission="`Create`"
          >
            New
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="pa-3" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          height="650"
          show-current-page
          min-height="300"
          :items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          item-value="id"
          @update:options="handleTableChange"
      >
        <template v-slot:top>
          <v-toolbar color="white" density="compact" flat>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                  variant="text"
                  icon="mdi-menu"
                  size="small"
                  @click="handleOpen"
              />
            </v-toolbar-items>
          </v-toolbar>
        </template>
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
              variant="text"
              icon="mdi-pencil"
              @click="handleEdit(item)"
              v-permission="`Detail`"
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
    <EditForm ref="editFormRef" @refresh="handleSearch" />
    <MesTable name="spec_impact" ref="tableRef" v-model="tableHeaders" />
  </v-container>
</template>
<script name="SpecImpact" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import MesTable from "@/components/table/index.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import EditForm from "./components/editForm.vue";
import useCommonStore from "@/app/common";
import {formatSpecCode} from "@/util/util";
import API from "./api";


const formatTemp = (sign, temp, unit) => {
  return (sign || "") + (temp || "") + (unit || "");
}

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "Mill Code", key: "mill.code"},
  {title: "Spec Code", key: "spec_code", value: (item) => formatSpecCode(item.spec), sortable: true},
  {title: "Spec Version", key: "spec.version"},
  {title: "Version Status", key: "spec.version_status"},
  {title: "Thickness From", key: "thick_from"},
  {title: "Thickness To", key: "thick_to"},
  {title: "Sample Location", key: "location"},

  {title: "10*10 Avg Min", key: "ave_value_1", minWidth: 120},
  {title: "10*10 Ind Min", key: "min_value_1", minWidth: 130},
  {title: "Temp", key: "temp_value_1" , value:(item)=> formatTemp(item.temp_sign_1, item.temp_value_1, item.temp_units)},
  {title: "10*7.5 Avg Min", key: "ave_value_2", minWidth: 130},
  {title: "10*7.5 Ind Min", key: "min_value_2", minWidth: 130},
  {title: "10*7.5 Temp", key: "temp_value_2", value: (item)=> formatTemp(item.temp_sign_2, item.temp_value_2, item.temp_units)},
  {title: "10*5 Avg Min", key: "ave_value_3", minWidth: 130},
  {title: "10*5 Ind Min", key: "min_value_3", minWidth: 130},
  {title: "10*5 Temp", key: "temp_value_3", value: (item)=> formatTemp(item.temp_sign_3, item.temp_value_3, item.temp_units)},
  {title: "Impact Energy Units", key: "impact_units"},
  {title: "Impact Temperature Units", key: "temp_units"},

  {title: "Sub-size Reduction - 7.5mm", key: "reduction_75", minWidth: 180},
  {title: "Sub-size Reduction - 5.0mm", key: "reduction_50", minWidth: 180},
  {title: "Sub-size Reduction - 2.5mm", key: "reduction_25", minWidth: 180},

  {title: "Info Temp 1", key: "info_temp_value_1", minWidth: 130},
  {title: "Info Temp 2", key: "info_temp_value_2", minWidth: 130},
  {title: "Info Temp 3", key: "info_temp_value_3", minWidth: 130},
  {title: "Heat code", key: "heat_code"},
  {title: "Spaeter-Type Certification", key: "spaeter_certs", minWidth: 180},
  {title: "Sequence", key: "sequence"},
  {title: "Notch", key: "notch"},
  {title: "Freq", key: "freq"},
  {title: "Impacts FIO", key: "fio"},
  {title: "Print Units", key: "pt"},
  {title: "Predicted Result Allowed", key: "pred"},
  {title: "TPSR Code", key: "tpsr"},
  {title: "L/X", key: "direction"},
  {title: "Crystallinity/shear", key: "crystallinity_shear"},
  {title: "Cry/shear avg %", key: "crystallinity_avg"},
  {title: "Cry/shear ind %", key: "crystallinity_ind"},
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    spec_code: commonStore.spec.id,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  form: {
    beforeCode: commonStore.spec.spec_code,
    afterId: undefined,
    afterCode: undefined,
  },
});

const {queryParams, form} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  if (params.spec_code) {
    params["fields"] = ["spec_id"];
    params["ops"] = ["=="];
    params["values"] = [params.spec_code];
    delete params.spec_code;
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

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
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

const handleSpecChange = (spec, key) => {
  form.value[`${key}`] = spec.spec_code;
}

const handleCopy = (isActive) => {
  isActive.value = false;
  API.copyTo(form.value.beforeCode, form.value.afterCode).then(res => {
    toast.success("Copy Success", {
      position: "bottom-center"
    });
    handleSearch();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Copy Fail", { autoClose: 60000 });
  })
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
