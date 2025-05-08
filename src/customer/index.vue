<template>
    <v-container class="page" fluid>
      <v-form ref="searchForm" @submit.prevent="handleSearch">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="data.queryParams.q"
              label="Search"
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
          <v-spacer></v-spacer>
          <v-col cols="3" class="text-end">
            <router-link to="/customer/detail">
            <v-btn
                class="text-none ml-4 mr-0"
                color="primary"
                variant="flat"
                multiple
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
            fixed-header
            height="620"
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
          <template v-slot:item.action="{ item }">
            <router-link class="text-decoration-none grey-darken-4 mr-2" :to="{ name: 'CustomerDetail', query: { id: item.id } }">
              <v-icon small v-permission="`Detail`">mdi-pencil</v-icon>
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
    </v-container>
  </template>
  
  <script name="CustomerIndex" setup>
  import { useRoute } from "vue-router";
  import { getCurrentInstance, reactive, ref, toRaw, toRefs } from "vue";
  import { toast } from "vue3-toastify";
  import API from "./api";
  import useCommonStore from "@/app/common";
  
  const commonStore = useCommonStore();
  const route = useRoute();
  const { proxy } = getCurrentInstance();
  const loading = ref(false);
  const tableHeaders = ref([
    { title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align: "center" },
    { title: "Mill Code", key: "mill.code", sortable: true },
    { title: "Name", key: "name", sortable: true },
    { title: "Code", key: "code", sortable: true },
    { title: "Group", key: "group", sortable: true },
    { title: "Type", key: "customer_type", sortable: true },
    { title: "Desc", key: "desc", sortable: true },
    { title: "Coh Code", key:"coh_code", sortBy: true}
  ]);
  
  const tableList = ref([]);
  const total = ref(0);
  
  const data = reactive({
    queryParams: {
      q: null,
      page: 1,
      itemsPerPage: 10,
      sortBy: ["updated_at"],
      descending: [true],
    },
    form: {},
  });
  
  const { queryParams, form } = toRefs(data);
  
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
  };
  
  const handleTableChange = ({ page, itemsPerPage, sortBy }) => {
    queryParams.value.page = page;
    queryParams.value.itemsPerPage = itemsPerPage;
    if (sortBy.length > 0) {
      queryParams.value.sortBy = sortBy;
    }
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
