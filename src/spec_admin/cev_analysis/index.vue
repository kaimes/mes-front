<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row>
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
          <div class="d-flex align-center	" v-permission="`Copy To`">
            <v-dialog
                max-width="560"
                persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <div>
                  <v-btn
                      class="text-none mr-4 mt-2"
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
                    title="Are you sure to copy CEV analysis requirements?"
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
            <spec-code v-model="form.afterId" :store="false" @change="handleSpecChange($event, 'afterCode')" />
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="3" class="text-end">
          <v-btn
              class="text-none ml-4 mt-2"
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
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          height="650"
          show-current-page
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          name-value="id"
          @update:options="handleTableChange"
      >
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
  </v-container>
</template>
<script name="SpecElongationDetails" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import EditForm from "./components/editForm.vue";
import API from "./api";
import XEUtils from "xe-utils";
import {formatSpecCode} from "@/util/util";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "Mill Code", key: "mill.code"},
  {title: "Spec Code", key: "spec_code", value: (item) => formatSpecCode(item.spec)},
  {title: "Spec Version", key: "spec.version"},
  {title: "Version Status", key: "spec.version_status"},
  {title: "Thickness From", key: "thick_from"},
  {title: "Thickness To", key: "thick_to"},
  {title: "CEV-Location", key: "cev_location"},
  {title: "CEV Formula", key: "cev_formula"},
  {title: "CEV Max Value", key: "cev_max_value"},
  {title: "PCM Location", key: "pcm_location"},
  {title: "PCM From", key: "pcm_formula"},
  {title: "PCM Max From", key: "pcm_max_value"},
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
  queryParams.value.date = [];
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
