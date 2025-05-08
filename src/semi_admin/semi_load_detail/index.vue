<template>
  <v-container class="semi-load-content" fluid>
    <v-form ref="semiLoadForm" @submit.prevent="handleSave">
      <v-row align="center">
        <v-col cols="6">
          <div class="d-flex ga-4 align-center">
            <v-btn  class="text-none" color="primary" variant="flat" :loading="loading" :disabled="form.status === 'received' || !form.id" @click.prevent="userStoremove">
              {{$t('semi_load_detail.move')}}
            </v-btn>
            <v-dialog
              max-width="400"
              persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="text-none" color="primary" variant="flat" :loading="loading" :disabled="form.status == 'received' || !form.id" v-bind="activatorProps">
                  {{$t('semi_load_detail.receive')}}
                </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card
                    prepend-icon="mdi-help-circle-outline"
                    :text="$t('semi_load_detail.receive_this_record')"
                    :title="$t('semi_load_detail.do_you_confirm')"
                >
                  <template v-slot:actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="text-none"
                        color="#e3e3e3"
                        variant="flat"
                        @click.prevent="isActive.value = false"
                    >
                      {{$t('global.cancel')}}
                    </v-btn>
                    <v-btn
                        class="text-none"
                        color="primary"
                        variant="flat"
                        @click.prevent="confirmReceiving(isActive)"
                    >
                      {{$t('global.confirm')}}
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
            <v-btn class="text-none" color="primary" variant="flat" :loading="loading" :disabled="form.status === 'received' || !form.id" @click.prevent="handleTip">
              {{$t('semi_load_detail.tip')}}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="d-flex align-center justify-end">
            <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? $t('semi_load_detail.save') : $t('semi_load_detail.view') }}</span>
            <v-switch v-model="save" density="default" hide-details inset></v-switch>
            <div class="ml-10">
              <v-btn type="submit" :disabled="!save" :loading="loading" variant="flat" color="primary">
                {{ form.id ? $t('semi_load_detail.update') : $t('semi_load_detail.save') }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-card class="pa-4 mt-3" elevation="0" variant="outlined">
        <v-row align="center">
          <v-col cols="4">
            <v-text-field
                v-model="form.vehicle_code"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.wagon')"
                placeholder="Please enter the wagon"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <SiteCode
                v-model="form.site_id"
                :disabled="!save"
                :hide-details="false"
                :area="form.site"
                :label="$t('semi_load_detail.to_site')"
                @change="handleItemChange($event, 'site_id')"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.supplier_code"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.supplier')"
                placeholder="Please enter the supplier"
                bg-color="white"
                clearable
                :rules="rules.supplier_code"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.total_weight_ton"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.total_weight')"
                placeholder="Please enter the total weight"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.semi_load_code"
                :disabled="!save"
                :rules="rules.load_code"
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.load_code')"
                placeholder="Please enter the load code"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.semi_count"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.no_semis')"
                placeholder="Please enter the No. Semis"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.status"
                disabled
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.status')"
                placeholder="Please enter the status"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.location"
                disabled
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.position')"
                placeholder="Please enter the Position"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.created_at"
                disabled
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.created_at')"
                placeholder="This is the time when the semi load is created."
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.updated_at"
                disabled
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.updated_at')"
                placeholder="This is the time when the semi load is updated."
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.order_number"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.order_no')"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.line_item_number"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('semi_load_detail.line_item_no')"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>

        </v-row>
      </v-card>
    </v-form>

    <v-card class="pa-2 mt-3" elevation="0" variant="outlined">
      <template v-slot:append>
        <div class="text-end">
          <v-btn :disabled="form.status === 'received' || !save" variant="flat" color="primary" prepend-icon="mdi-plus" @click="handleAddSemi" >
            <template v-slot:prepend>
              <v-icon color="white"></v-icon>
            </template>
            {{$t('semi_load_detail.table.add')}}
          </v-btn>
        </div>
      </template>
      <v-data-table-server
          fixed-header
          show-current-page
          min-height="300"
          :items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="popupStore.table.rows.items"
          :items-length="total"
          :loading="loading"
          @update:options="handleTableChange"
          item-value="id"
          show-select 
          return-object
          v-model="popupStore.table.rows.selectedItems"
     
      >
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-dialog max-width="400" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn variant="text" icon="mdi-delete" v-bind="activatorProps"/>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card prepend-icon="mdi-help-circle-outline" text="Deletion is irreversible"
                      title="Confirm to delete data?">
                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="isActive.value = false">
                    {{$t('global.cancel')}}
                  </v-btn>
                  <v-btn class="text-none" color="primary" variant="flat" @click="handleDeleteBar(isActive, item)">
                    {{ $t('global.confirm') }}
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
    <MoveToSemi @refresh="refreshData" />
    <AddSemi ref="AddSemiRef" @change="handlePickAddSemi"  />
    <TipSemi ref="TipSemiRef"  @refresh="refreshData" />
  </v-container>
</template>
<script setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import { toast } from "vue3-toastify";
import {useStore} from "vuex";
import _, { map, includes, filter } from "lodash";
import { useSemiStore } from '@/semi_admin/semi/storePinia.js';
import MoveToSemi from "@/semi_admin/semi/MoveToSemi.vue";
import {formatDate} from '@/util/util';
import SiteCode from "@/components/picker/SiteCode.vue";
import TipSemi from "./components/tip.vue";
import AddSemi from "./components/AddSemi.vue";
import API from "./api";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const popupStore = useSemiStore();

const route = useRoute();
const store = useStore();
const router = useRouter();
const loading = ref(false);
const date = ref("Select Date");
const save = ref(true);

const selectedItems = ref([]);

const totalWeight = ref(0)

const {proxy} = getCurrentInstance();

const data = reactive({
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  form: {
    id: undefined,
    vehicle_code: undefined,
    supplier_code: undefined,
    total_weight_ton: undefined,
    semi_load_code: undefined,
    semi_count: undefined,
    site_id: undefined,
    location: undefined,
    status: "created",
    updated_at: undefined,
    created_at: undefined,
    line_item_number: undefined,
    order_number: undefined,
    
  },
  rules: {
    load_code: [
      value => {
        if (value) return true
        return 'Load code is required.'
      }
    ],
    supplier_code: [
      value => {
        if (value) return true
        return 'Supplier code is required.'
      }
    ],
  },
  
});

const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", fixed: true, sortable: false},
  {title: "semi_load_detail.table.cast_no", key: "cast.cast_code"},
  {title: "semi_load_detail.table.semi_no", key: "semi_code"},
  {title: "semi_load_detail.table.type", key: "semi_type"},
  {title: "semi_load_detail.table.length", key: "length_mm"},
  {title: "semi_load_detail.table.width", key: "width_mm"},
  {title: "semi_load_detail.table.weight", key: "estimated_weight_kg"},

  {title: "semi_load_detail.table.area", key: "area.code"},
  {title: "semi_load_detail.table.created_at", key: "created_at",sortable: true, value: (item) => formatDate(item['created_at']),},
  
]);
const tableHeaders = computed(() => {
    return tableHeadersDefinition.value.map(header => ({
      ...header,
      title: header.title.includes('.') ? t(header.title) : header.title
    }));
  });
const tableList = ref([]);
const semiTableList = ref([]);
const total = ref(0);

const {queryParams, form, rules} = toRefs(data);


const getDetailById = (id) => {  
  API.getDetailById(id).then(res => {
    const { status, data } = res
    if (status === 200) {
      save.value = false;
      form.value = data
      form.value.created_at = formatDate(form.value.created_at)
      form.value.updated_at = formatDate(form.value.updated_at)
      // console.log(form.value.total_weight_ton);
    } else {
      // TODO: 添加错误异常提示
    }
  });
}

const handleSave = async () => {

  const { valid } = await proxy.$refs["semiLoadForm"].validate();
  if (!valid) {
      return;
  }
  

  const params = toRaw(form.value);
  loading.value = true;
  params['semi_ids'] = map(popupStore.table.rows.items, item => item.id);
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  }).catch(() => {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

const handleChoose = (item) => {
  getDetailById(item.id)
}

const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }

  if (route.query.id) {
    getData()
  }
}

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };


  params["fields"] = ["semi_load_id", "semi_type"]
  params["ops"] = ["eq", "!="]
  params["values"] = [route.query.id, "BLM"]
  

  loading.value = true;
  API.getSemiAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      // tableList.value = res.data.items || [];
      popupStore.table.rows.items = res.data.items || [];
    } else {
      total.value = 0;
      tableList.value = [];
    }
  }).finally(() => {
    loading.value = false;
  });
}

const getSemiIDs = (ids) => {
  const params = {
    ...toRaw(queryParams.value)
  };
  params.itemsPerPage = -1;

  params["fields"] = ["cast_id"];
  params["ops"] = ["in"];
  params["values"] = [ids];

  return API.getSemiAll(params).then(res => {
    if (res.status === 200) {
      return res.data.items || [];
    } else {
      return [];
    }
  }).catch(error => {
    toast.error(error?.response?.data?.detail || "Get semi IDs Fail.", {
      position: "bottom-center"
    });
    return [];
  });
};

const confirmReceiving = (isActive) => {
  isActive.value = false;

  if (form.value.status === 'received'){
    toast.error("This semi load has been received", { autoClose: 60000 });
    
    return;
  }

  let params ={
    "ids":[route.query.id]
  }
  API.confirmReceiving(params).then(res => {
    console.log(res)
    if(res.status === 200){
      toast.success("Confirm Receiving Success", {
        position: "bottom-center",
        delay: 2000,
        
      });
    }else{
      toast.error("Confirm Receiving Fail", { autoClose: 60000 });
    }
  }).catch((err) => {
    toast.error(err?.response?.data?.detail || "Confirm Receiving Fail.", { autoClose: 60000 });
  })
}

const userStoremove = () => {
  if (popupStore.table.rows.selectedItems.length === 0){
    toast.error("No semi records selected", { autoClose: 60000 });
    return false
  }
  popupStore.shouldExecuteGetAll = false;
  popupStore.takeDialogByButton();


  getData();
  

}

const handleAddSemi = () => {
  proxy.$refs["AddSemiRef"].handleShow({
    semi_load_id: form.value.id,
  });
}

const handlePickAddSemi = (arr) => {
  const ids = map(popupStore.table.rows.items, "id");
  const arrIds = map(arr, "id");
  getSemiIDs(arrIds).then(semi_items => {
    const $arr = filter(semi_items, item => !includes(ids, item.id));
    if ($arr.length > 0) {
      popupStore.table.rows.items.push(...$arr);
    }
  });

  // const $arr = filter(semi_items.value, item => !includes(ids, item.id));
  // if ($arr.length > 0) {
  //   popupStore.table.rows.items.push(...$arr);
  // }
}

const handleDeleteBar = (isActive, item) => {
  let deleteIndex = popupStore.table.rows.items.findIndex(elem=> elem.id === item.id)
  if (deleteIndex !== -1) {
    popupStore.table.rows.items.splice(deleteIndex, 1);
  }
  isActive.value = false;
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item?.id;
}


const handleTip = async (item) => {

  if (popupStore.table.rows.items.length <= 0){
    toast.error("No semi records!", { autoClose: 60000 });
    return;
  }

  let casts = []
  let semi_load_ids = [route.query.id]
  await API.castQualityCompare(semi_load_ids).then(res => {
    if (res.status === 200) {
      casts = res.data;
    } else {
      toast.error("Cast quality compare Fail.", { autoClose: 60000 });
    }
  }).catch((err) => {
    toast.error(err?.response?.data?.detail || "Cast quality compare Fail.", { autoClose: 60000 });
  })
  proxy.$refs["TipSemiRef"].handleShow([form.value], item, casts);
}


// const handleTotalWeight = () => {
//   console.log(popupStore.table.rows.items);
  
// }


const refreshData = () => {
  popupStore.table.rows.items = []
  popupStore.table.rows.selectedItems = []
  if (route.query.id) {
    getData()
    getDetailById(route.query.id)
  }
  
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  
  getDetailById(route.query.id)
  getData()
}

popupStore.table.rows.items = []
popupStore.table.rows.selectedItems = []

// handleTotalWeight();



</script>
<style lang="scss" scoped>
.semi-load-content {
  .panel {
    position: relative;
    background-color: #ffffff;
    padding: 42px 16px 16px 16px;
    min-height: 300px;
    border-radius: 12px;
    &-action {
      position: absolute;
      top: 10px;
      right: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 1;
    }
  }
}


</style>
