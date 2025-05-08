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
        <v-col cols="6" class="text-end">
          <router-link :to="{ path: '/mill/edit' }">
            <v-btn class="text-none" color="primary" variant="flat">New</v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          height="500"
          show-current-page
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
        <template v-slot:item.users="{ item }">
          <div class="d-flex justify-start ga-2 flex-wrap pt-2 pb-2">
            <v-chip v-for="item in item.dispatch_user" :key="item.id" size="small">
              {{ item.email }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <router-link :to="{ path: '/mill/edit', query: { id: item.id } }">
            <v-btn
                variant="text"
                icon="mdi-pencil"
                v-permission="`Detail`"
            />
          </router-link>
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  variant="text"
                  icon="mdi-delete"
                  v-bind="activatorProps"
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
<script name="MillList" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import EditForm from "./components/editForm.vue";
import API from "./api";

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", width: 150, sortable: false, align:"center"},
  {title: "Code", key: "code", width: 150,},
  {title: "Type", key: "type", width: 150,},
  {title: "Desc", key: "desc"},
  {title: "Users", key: "users"},
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  }
});

const {queryParams, form} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
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

const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.delete(row.id).then(() => {
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
