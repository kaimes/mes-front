<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center" class="align-items">
        <v-col cols="4">
          <v-text-field
              v-model="queryParams.q"
              class="text-none mt-2"
              density="default"
              :label="$t('semi_load.search_by_semi_load_code_wagon_consignment_code')"
              :hide-details="false"
          ></v-text-field>
        </v-col>
        <v-col cols="2">         
          <DictCode
              v-model="queryParams.location"
              bg-color="white"
              density="compact"
              color="#333"
              :label="$t('semi_load.position')"
              code="semi_load_location"
          />
        </v-col>
        <v-col cols="2">         
          <DictCode
              v-model="queryParams.status"
              bg-color="white"
              density="compact"
              color="#333"
              :label="$t('semi_load.status')"
              code="semi_load_status"
          />
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none ml-4"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            {{$t('global.reset')}}
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 my-1"
              color="primary"
              variant="flat"
              :loading="loading"
          >
            {{$t('global.search')}}
          </v-btn>
        </v-col>
        <v-spacer />
        <v-col cols="12" md="auto" class="d-flex flex-wrap ga-2 justify-md-end mt-2 mt-md-0 ">
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="handleDispatch"
          >
            {{$t('semi_load.dispatch')}}
          </v-btn>

          <div class="d-flex flex-wrap ga-2 justify-end">
            <v-btn
              class="text-none flex-shrink-0"
              color="primary"
              variant="flat"
              @click="handleTip"
              v-permission="`Tip`"
            >
              {{$t('semi_load.tip')}}
            </v-btn>
      
            <v-dialog max-width="400" persistent>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn 
                  type="submit" 
                  class="text-none flex-shrink-0"
                  color="primary" 
                  variant="flat" 
                  :loading="loading" 
                  v-bind="activatorProps" 
                  v-permission="`Receive`"
                >
                  {{$t('semi_load.receive')}}
                </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card
                    prepend-icon="mdi-help-circle-outline"
                    text="Receive this record"
                    :title="$t('semi_load.receive_button.do_you_confirm')"
                >
                  <template v-slot:text>
                    <v-row>
                      <v-col cols="12">
                        <v-checkbox 
                          v-model="form.is_overwrite" 
                          :label="$t('semi_load.receive_button.overwrite_receive_this_record')"
                          hide-details>
                        </v-checkbox>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="text-none"
                        color="#e3e3e3"
                        variant="flat"
                        @click="cancelReceving(isActive)"
                    >
                      {{$t('global.cancel')}}
                    </v-btn>
                    <v-btn
                        class="text-none"
                        color="primary"
                        variant="flat"
                        @click="confirmReceiving(isActive)"
                    >
                      {{$t('global.confirm')}}
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </div>
          </v-col>
          <v-spacer/>
          <v-col cols="12" md="auto" class="d-flex flex-wrap ga-2 justify-md-end mt-2 mt-md-0 ">
          <div>
            <router-link
                class="text-decoration-none grey-darken-4"
                :to="{ name: 'SemiLoadDetail' }">
              <v-btn
                  class="text-none"
                  color="primary"
                  variant="flat"
                  v-permission="`Create`"
              >
                {{$t('global.new')}}
              </v-btn>
            </router-link>
          </div>
          </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          height="650"
          fixed-header
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
          show-select 
          v-model="selectedItems"
      >
 
        <template v-slot:item.action="{ item }">

          <router-link
            class="text-decoration-none grey-darken-4 mr-2"
            :to="{ name: 'SemiLoadDetail', query: { id: item.id } }">
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
                  :text="$t('semi_load.delete_button.deletion_is_irreversible')"
                  :title="$t('semi_load.delete_button.confirm_to_delete_data')"
              >
                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="text-none"
                      color="#e3e3e3"
                      variant="flat"
                      @click="isActive.value = false"
                  >
                    {{$t('global.cancel')}}
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleDelete(isActive, item)"
                  >
                    {{$t('global.confirm')}}
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
    <TipSemi ref="TipSemiRef"  @refresh="(e)=>handleSearch(e, true)" />

  </v-container>
</template>
<script name="SpecImpact" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs, computed} from "vue";
import {toast} from "vue3-toastify";
import EditForm from "./components/editForm.vue";
import API from "./api";
import {formatDate} from '@/util/util';
import TipSemi from "../semi_load_detail/components/tip.vue";
import DictCode from "@/components/picker/DictCode.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n()


const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", sortable: true, fixed: true, width: 140},
  {title: "semi_load.table.wagon", key: "vehicle_code"},
  {title: "semi_load.table.no_semis", key: "semi_count"},
  {title: "semi_load.table.weight", key: "total_weight_ton"},
  {title: "semi_load.table.supplier", key: "supplier_code"},
  {title: "semi_load.table.to_site", key: "mill.code"},
  {title: "semi_load.table.status", key: "status"},
  {title: "semi_load.table.position", key: "location"},
  {title: "semi_load.table.created_at", key: "created_at", sortable: true, value: (item) => formatDate(item['created_at'])},
  {title: "semi_load.table.semi_load", key: "semi_load_code"},

  
]);
const tableHeaders = computed(() => {
    return tableHeadersDefinition.value.map(header => ({
      ...header,
      title: header.title.includes('.') ? t(header.title) : header.title
    }));
  });
const tableList = ref([]);
const total = ref(0);

const selectedItems = ref([]);

const data = reactive({
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
    location: "DESPATCHED",
    status: undefined,
  },
  form: {
    semi_load_code: undefined,
    vehicle_code: undefined,
    semi_count: undefined,
    total_weight_ton: undefined,
    supplier_code: undefined,
    status: undefined,
    is_overwrite: false,
  },
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

const handleSearch = (_,flag=false) => {
  // Handle tip 和 receive 操作后清空选中项，flag 为true时清空
  if(flag){
    selectedItems.value = [];
  }
  queryParams.value.page = 1;
  getData();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
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

const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const cancelReceving = (isActive) => {
  isActive.value = false; 
  form.value.is_overwrite = false
}

const confirmReceiving = (isActive) => {
  if (selectedItems.value.length <= 0){
    toast.error("Please select at least one Semi Load!", { autoClose: 60000 });
    return;
  }

  let params ={
    "ids":[],
    "is_overwrite": form.value.is_overwrite
  }

  for (let item in selectedItems.value){
    const received_value = tableList.value.find(tl => tl.id === selectedItems.value[item] && tl.status === 'received');
    if (received_value){
      toast.error("Semi Load already received!", { autoClose: 60000 });
      return;
    }

    params.ids.push(selectedItems.value[item])
  }

  API.confirmReceiving(params).then(res => {
    if(res.status === 200){
      toast.success("Confirm Receiving Success", {
        position: "bottom-center",
        delay: 2000,
        
      });
      handleSearch(null, true);
    }else{
      toast.error("Confirm Receiving Fail", { autoClose: 60000 });
    }
  }).catch((err) => {
    toast.error(err?.response?.data?.detail || "Confirm Receiving Fail.", { autoClose: 60000 });
  }).finally(() => {
    isActive.value = false;
    loading.value = false;
    form.value.is_overwrite = false
  });
}

const handleTip = async (item) => {

  if (selectedItems.value.length <= 0){
    toast.error("Please select at least one Semi Load!", { autoClose: 60000 }
    )
    return;
  }

  let values = []

  for (let item in selectedItems.value){
    const received_value = tableList.value.find(tl => tl.id === selectedItems.value[item]);
    if (received_value.status === 'received'){
      toast.error("Semi Load already received!", { autoClose: 60000 })
      return;
    }

    values.push(received_value)
  }

  let cast = []
  let semi_load_ids = []
  for (let key in selectedItems.value) {
    semi_load_ids.push(selectedItems.value[key])
  }
  await API.castQualityCompare(semi_load_ids).then(res => {
    if (res.status === 200) {
      cast = res.data;
    } else {
      toast.error("Cast quality compare Fail.", { autoClose: 60000 });
    }
  }).catch((err) => {
    toast.error(err?.response?.data?.detail || "Cast quality compare Fail.", { autoClose: 60000 });
  })

  proxy.$refs["TipSemiRef"].handleShow(values, item, cast);
}

const handleDispatch = () => {
  if (selectedItems.value.length <= 0) {
    toast.error("Please select at least one Semi Load!", { autoClose: 60000 });
    return;
  }

  const params = {
    ids: [...selectedItems.value],
    is_overwrite: form.value.is_overwrite,
  };

  loading.value = true;
  API.dispatch(params)
    .then((res) => {
      if (res.status === 200) {
        toast.success("Dispatch Success", { position: "bottom-center", delay: 2000 });
        // clear selection & refresh
        selectedItems.value = [];
        handleSearch(null, true);
      } else {
        toast.error("Dispatch failed", { autoClose: 60000 });
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.detail || "Dispatch failed", { autoClose: 60000 });
    })
    .finally(() => {
      loading.value = false;
      form.value.is_overwrite = false;
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

  .align-items {
    display: flex;
    align-items: center;
  }
}
</style>
