<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
              v-model="queryParams.q"
              label="Search By Code, Type"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="d-flex ga-4 align-center">
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
          </div>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn variant="flat" color="primary" @click="handleEditNew()"
                 :disabled="localOrganizationStatus === 'Expired'" v-permission="`Create`">New</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4 pa-4" elevation="0" variant="outlined">
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
        <template v-slot:item.action="{ item }">
          <v-btn-group density="compact" variant="plain">
            <v-btn variant="text" icon="mdi-pencil" @click="handleEdit(item)" v-permission="`Detail`"/>
            <v-dialog max-width="400" persistent>
              <template v-slot:activator="{ props: activatorProps }">
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
          </v-btn-group>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <EditForm ref="editFormRef" @refresh="handleSearch" />
  </v-container>
</template>

<script name="ProductSize" setup>
import { useRoute } from "vue-router";
import { getCurrentInstance, reactive, ref, toRaw, toRefs, nextTick } from "vue";
import useCommonStore from "@/app/common";
import { toast } from "vue3-toastify";
import { formatDate } from "@/util/util";
import EditForm from "./components/editForm.vue";
import API from "./api";

const commonStore = useCommonStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  { title: "Action", key: "action", fixed: true, sortable: false, align: "center" },
  { title: "Code", key: "code" },
  {
    title: "Mill Code",
    key: "mill.code",
    value: (item) => item.mill?.code || "--",
  },
  {
    title: "Product Category",
    key: "product_category.code",
    value: (item) => item.product_category?.code || "--",
  },
  {
    title: "Product Class",
    key: "product_class.code",
    value: (item) => item.product_class?.code || "--",
  },
  { title: "Type", key: "type" },
  { title: "Desc", key: "desc" },
  { title: "Dim1", key: "dim1" },
  { title: "Dim2", key: "dim2" },
  { title: "Product Code", key: "product_code" },
  { title: "Roll Ref Code", key: "roll_ref_code" },
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    q: null,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
});

const { queryParams } = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value),
  };

  loading.value = true;
  API.getAll(params)
    .then((res) => {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
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
  queryParams.value.q = null;
  handleSearch();
};

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
