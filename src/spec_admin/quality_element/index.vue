<template>
    <v-container class="page" fluid>
      <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
        <v-row align="center">
          <v-col cols="3">
            <QualityCode v-model="queryParams.quality_id" label="Quality Code"  />

          </v-col>
          <v-col cols="3">
            <dict-code
                  v-model="queryParams.type"
                  hide-details
                  bg-color="white"
                  density="default"
                  variant="underlined"
                  color="#333"
                  label="Type"
                  placeholder="Type"
                  code="quality_element_type"
              />
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
          <v-col cols="3" class="text-end">
            <router-link  :to="{ path: '/quality_element/detail' }">
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
            item-value="id"
            @update:options="handleTableChange"
        >
          <template v-slot:item.dim="row">
            {{ row.item.dim1 }} - {{ row.item.dim2 }}
          </template>
          <template v-slot:item.action="{ item }">
            <router-link :to="{ path: '/quality_element/detail', query: { id: item.id } }">
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
  <script name="MainElementAnalysis" setup>
  import {useRoute} from "vue-router";
  import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
  import {toast} from "vue3-toastify";
  import SpecCode from "@/components/picker/SpecCode.vue";
  import QualityCode from "@/components/picker/QualityCode.vue";
  import useCommonStore from "@/app/common";
  import API from "./api";
  import {formatSpecCode} from "@/util/util";
  import DictCode from "@/components/picker/DictCode.vue";
  
  const commonStore = useCommonStore();
  const route = useRoute();
  const {proxy} = getCurrentInstance();
  const loading = ref(false);
  const tableHeaders = ref([
    {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
    {title: "Quality Code", key: "quality.code",value: (item) => item.quality?.code},
    {title: "Type", key: "type"},
    {title: "Is Active", key: "is_active"},
    {title: "Thick From", key: "thick_from"},
    {title: "Thick To", key: "thick_to"},
    {title: "Location", key: "location"},
    {title: "Carbon Min", key: "main_el_min_value_c"},
    {title: "Carbon Max", key: "main_el_max_value_c"},
    {title: "Sulphur Min", key: "main_el_min_value_s"},
    {title: "Sulphur max", key: "main_el_max_value_s"},
    {title: "Chrome Min", key: "main_el_min_value_cr"},
    {title: "Chrome Max", key: "main_el_max_value_cr"},
    {title: "Alumin Min", key: "main_el_min_value_al"},
    {title: "Alumin Max", key: "main_el_max_value_al"},
    {title: "Copper Min", key: "main_el_min_value_cu"},
    {title: "Copper Max", key: "main_el_max_value_cu"},
    {title: "Titanium Min", key: "main_el_min_value_ti"},
    {title: "Titanium Max", key: "main_el_max_value_ti"},
    {title: "Calcium Min", key: "main_el_min_value_ca"},
    {title: "Calcium Max", key: "main_el_max_value_ca"},
    {title: "Silicon Min", key: "main_el_min_value_si"},
    {title: "Silicon Max", key: "main_el_max_value_si"},
    {title: "Moly Min", key: "main_el_min_value_mo"},
    {title: "Moly Max", key: "main_el_max_value_mo"},
    {title: "Boron Min", key: "main_el_min_value_b"},
    {title: "Boron Max", key: "main_el_max_value_b"},
    {title: "Niobium Min", key: "main_el_min_value_nb"},
    {title: "Niobium Max", key: "main_el_max_value_nb"},
    {title: "Vanadium Min", key: "main_el_min_value_v"},
    {title: "Vanadium Max", key: "main_el_max_value_v"},
    {title: "SOL AL Min", minWidth: 130, key: "main_el_min_value_sol_al"},
    {title: "SOL AL Max", minWidth: 130, key: "main_el_max_value_sol_al"},
    {title: "Manganese Min", key: "main_el_min_value_mn"},
    {title: "Manganese Max", key: "main_el_max_value_mn"},
    {title: "S&P Min", key: "main_el_min_value_sp"},
    {title: "S&P Max", key: "main_el_max_value_sp"},
    {title: "Nickel Min", key: "main_el_min_value_ni"},
    {title: "Nickel Max", key: "main_el_max_value_ni"},
    {title: "Cobalt Min", key: "main_el_min_value_co"},
    {title: "Cobalt Max", key: "main_el_max_value_co"},
    {title: "Tin Min", key: "main_el_min_value_sn"},
    {title: "Tin Max", key: "main_el_max_value_sn"},
    {title: "Nitrogen Min", key: "main_el_min_value_n"},
    {title: "Nitrogen Max", key: "main_el_max_value_n"},
    {title: "Hydrogen Min", key: "main_el_min_value_h"},
    {title: "Hydrogen Max", key: "main_el_max_value_h"},
    {title: "Other Element Num", key: "other_element_numer"},
    {title: "Min", key: "other_el_min_value_1"},
    {title: "Max", key: "other_el_max_value_1"},
  ]);
  const tableList = ref([]);
  const total = ref(0);
  
  const data = reactive({
    queryParams: {
      type: undefined,
      code: undefined,
      page: 1,
      itemsPerPage: 10,
      sortBy: ["updated_at"],
      descending: [true],
      quality_id: undefined
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
    params["fields"] = [];
    params["ops"] = [];
    params["values"] = [];
    if (params.quality_id) {
      params["fields"].push("quality_id");
      params["ops"].push("eq");
      params["values"].push(params.quality_id);
      delete params.quality_id;
    }
    if (params.type) {
      params["fields"].push("type")
      params["ops"].push("eq")
      params["values"].push(params.type)
      delete params.type
    }
    loading.value = true;
    API.getAll(params).then(res => {
      console.log(res);
      
      if (res.status === 200) {
        total.value = res.data.total || 0;
        tableList.value = res.data.items || [];
        
        tableList.value = res.data.items.map((item, index) => ({
          ...item,
          other_element_numer: res.data.other_element_num?.[index] || 0
        }));
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
