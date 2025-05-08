<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch" >
      <v-row>
        <v-col cols="3">
          <product-type-code v-model="queryParams.product_type_id" @change="handleProductCodeChange($event, 'product_type_id')"/>
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
        <v-spacer />
        <v-col cols="3" class="text-end">
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
    <v-card class="mt-2 pa-4" elevation="0" variant="outlined">
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
<script name="AlternativeSemiSize" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import EditForm from "./components/editForm.vue";
import API from "./api";
import useCommonStore from "@/app/common";
import XEUtils from "xe-utils";
import {formatSpecCode} from "@/util/util";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "Rank_seq", key: "rank_seq", sortable: true},
  {title: "Mill Code", key: "mill.code"},
  {title: "Produce Type", key: "product_type.code", minWidth: 150, sortable: true},
  {title: "Width(mm)", key: "semi_size.width_mm", sortable: true},
  {title: "Thickness(mm)", key: "semi_size.thick_mm", sortable: true},
  {title: "Weight(kg)", key: "weight", sortable: true},
  {title: "Opt Length(mm)", key: "opt_length", sortable: true},
  {title: "Min Length(mm)", key: "min_length", sortable: true},
  {title: "Max Length(mm)", key: "max_length", sortable: true},
  {title: "Order Over Tol(mm)", key: "order_over_tol", sortable: true},
  {title: "Order Under Tol(mm)", key: "order_under_tol", sortable: true},
  {title: "Stock Over Tol(mm)", key: "stock_over_tol", sortable: true},
  {title: "Stock Under Tol(mm)", key: "stock_under_tol", sortable: true},
  {title: "Not To Sched.", key: "not_to_sched", sortable: true},
  {title: "Source", key: "source", sortable: true},
  {title: "Semi Length(mm)", key: "semi_length", sortable: true}
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
});

const {queryParams} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  if (queryParams.value.product_type_id) {
    params["fields"] = ["product_type_id"];
    params["ops"] = ["=="];
    params["values"] = [queryParams.value.product_type_id];
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

const handleProductCodeChange = (item, key) => {
  queryParams.value[`${key}`] = item?.id;
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
