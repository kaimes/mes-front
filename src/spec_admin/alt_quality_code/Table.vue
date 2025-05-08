<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row>
        <v-col cols="2">
          <QualityCode
            v-model="quality_code"
            label="Search By Quality Code"
            :hide-details="true"
            @change="handlePickQualityCode"
          />
        </v-col>
        <v-col cols="3">
          <v-btn
            type="submit"
            class="text-none mt-4"
            color="primary"
            variant="flat"
            :loading="loading"
          >
            Search
          </v-btn>
        </v-col>


        <v-spacer />
        <v-col cols="3" class="text-end">
          <v-btn
            class="text-none ml-4"
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
          :items-per-page="10"
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
    <EditForm ref="editFormRef" @refresh="handleRefresh" />
  </v-container>
</template>

<script name="AltQualityCode" setup>
import {getCurrentInstance, ref, reactive, toRaw, toRefs } from "vue";
import { toast } from "vue3-toastify";
import API from "./api";
import {useRoute} from "vue-router";
import useCommonStore from "@/app/common";
import EditForm from "./Components/editForm.vue";
import XEUtils from "xe-utils";
import {formatSpecCode} from "@/util/util";
import QualityCode from "@/components/picker/QualityCode.vue";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();

const loading = ref(false);
const tableHeaders = ref([
  { title: "Quality Code", key: "quality.code", sortable: true },
  { title: "Alternative Quality Code", key: "alt_quality_code",  sortable: true},
  { title: "Rank", key: "rank", sortable: true },
  { title: "Action", key: "action", align: "center" },
]);

const tableList = ref([]);
const total = ref(0);


const data = reactive({
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ['updated_at'],
    descending: [true],
  },
  quality_code: null,
});

const { queryParams, quality_code } = toRefs(data);

const getData = () => {
  const params = { 
    ...toRaw(queryParams.value),
    fields: [],
    ops: [],
    values: [],
  };

  if (quality_code.value) {
    params.fields.push("quality.code");
    params.ops.push("==");
    params.values.push(quality_code.value);
  }
  loading.value = true;
  API.getAll(params)
    .then((res) => {
      if (res.status === 200) {
        total.value = res.data.total || 0;
        tableList.value = res.data.items || [];
      } else {
        total.value = 0;
        tableList.value = [];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

const handleProductCodeChange = (item, key) => {
  queryParams.value[`${key}`] = item?.id;
}
const handleCodeChange = (item, key) => {
  queryParams.value[`${key}`] = item?.quality_code;
}

const handleTableChange = ({ page, itemsPerPage, sortBy }) => {
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

const handleRefresh = () => {
  queryParams.value.page = 1;
  queryParams.value.sortBy = ['updated_at'];
  queryParams.value.descending = [true];
  getData();
};

const handlePickQualityCode = (qc) => {
    data.quality_code = qc?.code || null;
};

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
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
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
