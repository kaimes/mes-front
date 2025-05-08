<template>
  <v-container class="page" fluid>
    <div class="text-subtitle-2">
      <v-row>
        <v-col cols="2" class="mt-6">
          Rolling Code: {{ orderGroup?.rolling?.rolling_code }}
        </v-col>
        <div class="panel-action mt-5 switch-container">
          <span class="text-subtitle-2 font-weight-regular mr-2">{{ blocked ? "Blocked" : "All" }}</span>
          <v-switch
              v-model="blocked"
              density="default"
              @change="handleBlockedChange"
              hide-details
              inset
          ></v-switch>
        </div>
        <v-col cols="2">
          <CastCode
              v-model="data.cast_id"
              label="Cast Code"
              :hide-details="true"
              @click="handlePickSearchCastCode()"
          />
        </v-col>
        <v-col cols="3">
          <AltSemiSizeCode
              v-model="alternative_semi_size_id"
              label="Semi Size"
              :hide-details="true"
              type="value"
              :order_group_id="route.query.id"
              multiple
              @change="handlePickSearchSemiSize"
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
              placeholder="Quality Code"
              v-model="data.queryParams.q"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable>
          </v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
              class="text-none ml-4 mr-4 mt-3"
              color="primary"
              variant="flat"
              :loading="loading"
              @click="handleSearch()"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="panel mt-4">
      <v-dialog
          max-width="400"
          persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              :disabled="selected.length === 0"
              v-bind="activatorProps"
              v-permission="`Block`"
          >
            Block
          </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card
              prepend-icon="mdi-help-circle-outline"
              title="Block this data?"
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
                  @click="handleActionBlock(isActive, 1)"
              >
                Confirm
              </v-btn>
            </template>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog
          max-width="400"
          persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
              class="text-none ml-4 mr-2"
              color="primary"
              variant="flat"
              :disabled="selected.length === 0"
              v-bind="activatorProps"
              v-permission="`Unblock`"
          >
            Unblock
          </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card
              prepend-icon="mdi-help-circle-outline"
              title="Unblock this data?"
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
                  @click="handleActionBlock(isActive, 2)"
              >
                Confirm
              </v-btn>
            </template>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog
          max-width="400"
          persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
              class="text-none ml-2 mr-2"
              color="primary"
              variant="flat"
              :disabled="selected.length === 0"
              v-bind="activatorProps"
              v-permission="`Reserve`"
          >
            Reserve
          </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card
              prepend-icon="mdi-help-circle-outline"
              title="Reserve this data?"
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
                  @click="handleActionReserve(isActive, 1)"
              >
                Confirm
              </v-btn>
            </template>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog
          max-width="400"
          persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
              class="text-none ml-2 mr-4"
              color="primary"
              variant="flat"
              :disabled="selected.length === 0"
              v-bind="activatorProps"
              v-permission="`Unreserve`"
          >
            Unreserve
          </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card
              prepend-icon="mdi-help-circle-outline"
              title="Unreserve this data?"
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
                  @click="handleActionReserve(isActive, 2)"
              >
                Confirm
              </v-btn>
            </template>
          </v-card>
        </template>
      </v-dialog>
      <v-btn
          class="text-none mr-4"
          color="primary"
          variant="flat"
          @click="handleReverse"
          v-permission="`Reverse Sequence`"
      >
        Reverse Sequence
      </v-btn>
      <v-btn
          class="text-none"
          color="primary"
          variant="flat"
          @click="handleBackRolling"
          v-permission="`Return to Rolling`"
      >
        Return to Rolling
      </v-btn>
      <v-spacer/>
      <div class="panel-action">
        <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
        <v-switch
            v-model="save"
            density="default"
            hide-details
            inset
        ></v-switch>
      </div>
      <v-btn @click="handleSave" class="text-none" :disabled="!save" variant="flat" color="primary">Save</v-btn>
    </div>
    <v-card class="mt-6" elevation="0" variant="outlined">
      <v-data-table-server
          v-model="selected"
          show-current-page
          :headers="tableHeaders"
          :items="blockList"
          :items-length="itemsLength"
          min-height="300"
          item-value="id"
          show-select

          @update:page="handleTableChange"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"
      >

        <template v-slot:item.cast.cast_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                        :to="{ name: 'CastChemicalDetail', query: { id: item.cast?.id } }">
            <span class="w-100 d-inline-block">{{ item.cast?.cast_code }}</span>
          </router-link>
        </template>

        <template v-slot:item.rolling.rolling_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'RollingDetail', query: { id: item.rolling?.id } }">
            <span class="w-100 d-inline-block">{{ item.rolling?.rolling_code }}</span>
          </router-link>
        </template>
        <template v-slot:item.block_quantity="row">
          <v-text-field
              v-model="row.item.block_quantity"
              type="number"
              :min="1"
              :max="row.item.quantity > 1 ? row.item.quantity - 1 : 0"
              :disabled="row.item.quantity <= 1"
              density="default"
              variant="underlined"
              placeholder="Block Qty"
              bg-color="white"
              :rules="[
                v => !v || (v >= 1 && v <= row.item.quantity - 1) || `1~${row.item.quantity - 1}`
              ]"
              hide-details="auto"
              clearable
              width="80px"
          ></v-text-field>
        </template>
        <template v-slot:item.semi_charge_seq="row">
          <v-text-field
              v-model="row.item.semi_charge_seq"
              density="default"
              variant="underlined"
              placeholder="Please enter number"
              bg-color="white"
              hide-details
              clearable
              width="80px"
          ></v-text-field>
        </template>
        <template v-slot:item.comment="row">
          <v-text-field
              v-model="row.item.comment"
              density="default"
              variant="underlined"
              placeholder="Comment"
              bg-color="white"
              hide-details
              clearable
              width="150px"
          ></v-text-field>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <v-card class="mt-6" elevation="0" variant="outlined">
      <v-expansion-panels v-model="tabs" multiple variant="accordion" bg-color="grey-lighten-2">
        <BlockTable
            v-model="orderGroup"
            :ids="queryParams.spec_ids"
            @change="handleSpecChange"
        />
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>
<script name="OrderGroupBlock" setup>
import {useRoute, useRouter} from "vue-router";
import {filter, includes} from "lodash";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs, watch} from "vue";
import API from "./api";
import BlockTable from "./orderBlockTable.vue";
import XEUtils from "xe-utils";
import SectionCode from "@/components/picker/SectionCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import { toast } from "vue3-toastify";
import CastCode from "@/components/picker/CastCode.vue";
import AltSemiSizeCode from "@/components/picker/AltSemiSizeCode.vue";

const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();
const first_load = ref(true)

const tableHeaders = ref([
  {title: 'Cast No.', key: 'cast.cast_code', value: (item) => item.cast?.cast_code ?? "--", sortable: true},
  {title: 'Suffix Code', key: 'skelp_code', sortable: true},
  {title: 'Quality Code', key:"quality_code", sortable: true},
  {title: 'Length(mm)', key: 'length_mm', sortable: true},
  {
    title: 'Weight(tons)',
    key: 'estimated_weight_kg',
    value: (item) => (item.estimated_weight_kg !== undefined ? (item.estimated_weight_kg / 1000).toFixed(3) : "--"),
    sortable: true
  },
  {title: 'Semi Size', key: 'dim1', value: (item) => `${String(item.dim1)}x${String(item.dim2)}` ?? "--", sortable: true},
  {
    title: 'Current Allocated Rolling',
    key: 'rolling.rolling_code',
    value: (item) => item.rolling?.rolling_code,
    sortable: true
  },
  {
    title: 'Current Allocated Block',
    key: 'order_group.group_code',
    value: (item) => {
      const dim3 = item.order_group?.product_type?.dim3;
      const groupCode = item.order_group?.group_code;
      return dim3 && groupCode ? `${dim3} (${groupCode})` : "--";
    },
    sortable: true
  },
  {
    title: 'Current Allocated Reserve',
    key: 'reserved_order_group.group_code',
    value: (item) => item.reserved_order_group?.group_code,
    sortable: false
  },
  {
    title: 'Area',
    key: 'area.code',
    value: (item) => item.area?.code,
    sortable: true
  },
  {
    title: 'Position',
    key: 'location',
    sortable: true
  },
  {
    title: 'UnBlock Qty',
    key: 'quantity',
    sortable: true,
    value: (item) => item.quantity - (item.block_quantity || 0)
  },
  {title: "Block Qty",key:"block_quantity",minWidth: 80,fixed: true,sortable: true},
  {title: "Block Sequences", key: "semi_charge_seq", minWidth: 80, fixed: true, sortable: true},
  {title: "Comment", key: "comment", minWidth: 150, fixed: true, sortable: true},
]);
const selected = ref([]);
const specCodes = ref([]);
const loading = ref(false);
const searching = ref(false);
const itemsLength = ref(0);
const rollNoList = ref([]);
const tabs = ref(['0']);
const blockList = ref([]);
const save = ref(false);
const blocked = ref(false);
const alternative_semi_size_id = ref(null);



const handlePickSearchCastCode = (item)=>{
  data.cast_id = item?.id;
}

const handleBlockedChange = (switchStatus) => {
  getData();
}

const handlePickSearchSemiSize = (item) => {
  data.semi_size = []
  item.forEach(it => {
    data.semi_size.push( `${it?.semi_size?.width_mm}x${it?.semi_size?.thick_mm}`);
  })
  after_semi_size_laod.value = true;
  if (first_load.value) {
    handleSearch()
    first_load.value = false
  }
}


const data = reactive({
  queryParams: {
    spec_ids: [],
    rolling_no: undefined,
    rolling_id: undefined,
    kg: undefined,
    section_type: undefined,
    order_group_id: undefined,
    reserved_order_group_id:undefined,
    cast_id: undefined,
    quality_code: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["semi_charge_seq"],
    descending: [false],
    q: undefined,
    display: undefined,
  },
  orderGroup: {
    order_spec_group: [],
  },
  semi_size:[]
});

const after_semi_size_laod = ref(false);
const {queryParams, orderGroup} = toRefs(data);



const handleBackRolling = () => {
  router.go(-1);
}

const handleReverse = () => {
  // const params = toRaw(queryParams.value);
  const params = {
    list: blockList.value.map(item => item.id),
    rolling_id: orderGroup.value?.rolling?.id
  };
  API.reverseOrderGroupBlock(params).then(res => {
    handleSearch();
    toast.success(`Reverse Success`, {
    position: "bottom-center",
  });
  }).catch(res => {
    toast.error(res?.response?.data?.detail || `Reverse Fail`, {
      autoClose: 60000
    });
  });
}

const getData = () => {
  // 确保在获取到semi size 数据后再加载table
  if (!after_semi_size_laod.value) {
    return;
  }

  if (blocked.value) {
    queryParams.value.rolling_id = orderGroup.value?.rolling_id
  } else {
    queryParams.value.rolling_id = null;
  }
  const params = toRaw(queryParams.value);
  params["fields"] = []
  params["ops"] = []
  params["values"] = []
  if (queryParams.value.cast_id) {
    params["fields"].push("cast_id")
    params["ops"].push("eq")
    params["values"].push(queryParams.value.cast_id)
  }
  if (data.semi_size.length){
    params["semi_size"] = data.semi_size
  }else{
    delete params["semi_size"]
  }

  params.order_group_id = route.query.id
  loading.value = true;
  API.getBlock(params).then(res => {
    const {total, items} = res.data;
    // 对获取到的每个数据项进行处理
    const processedItems = items.map(item => {
      const currentAllocatedRolling = item?.rolling?.rolling_code;
      const rollingCode = orderGroup.value?.rolling?.rolling_code;
      if (currentAllocatedRolling!== rollingCode) {        
        item.semi_charge_seq = null;
        // item.comment = null;
      }
      return item;
    });

    // 对 processedItems 进行排序，将 reserved_order_group.group_code 有数据的项排到最前面
    processedItems.sort((a, b) => {
      if (b.reserved_order_group?.group_code && !a.reserved_order_group?.group_code) {
        return 1;
      }
      if (a.reserved_order_group?.group_code && !b.reserved_order_group?.group_code) {
        return -1;
      }
      return 0;
    });
    blockList.value = processedItems || [];
    itemsLength.value = total || 0;
  }).finally(() => {
    loading.value = false;
  });
}

const handleTableChangeItemsPerChange =(itemsPerPage)=>{
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleTableChangeSortBy = (sortBy)=>{
  queryParams.value.sortBy = sortBy;
  getData();
}

const handleTableChange = (page) => {
  queryParams.value.page = page;
  getData();
}

const handleSearch = () => {
  queryParams.value.page = 1;
  queryParams.value.cast_id = data.cast_id; 
  getData();
}


const handleSpecChange = (ids) => {
  queryParams.value.spec_ids = ids;
  specCodes.value = ids;
  handleSearch();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  queryParams.value.spec_ids = specCodes.value;
  handleSearch();
}

const handleRollingCodeSearch = async (val) => {
  if (val && val.length > 1) {
    searching.value = true;
    try {
      const {status, data} = await API.getAll({
        q: val
      })
      if (status === 200) {
        rollNoList.value = data.items || [];
      } else {
        rollNoList.value = [];
      }
    } finally {
      searching.value = false;
    }
  }
}

// 保存数据
const handleSave = () => {
  // 获取有数据的
  const $data = filter(toRaw(blockList.value), (item) => !!item.semi_charge_seq|| !!item.comment);
  if ($data.length === 0) {
    toast.error("Please choose semi data", {autoClose: 60000});
    return;
  }
  const saveData = $data.map(({ id, site_id, area_id, comment, rolling_id, order_group_id, semi_charge_seq, semi_code, reserved_order_group_id, block_quantity}) => ({
    id,
    site_id,
    area_id,
    comment,
    rolling_id,
    order_group_id,
    semi_charge_seq,
    semi_code,
    reserved_order_group_id,
    block_quantity
  }));
  API.blockAction(saveData).then(res => {
    handleSearch();
    toast.success(`Block Save Success`, {
    position: "bottom-center",
  });
  }).catch(res => {
    toast.error(res?.response?.data?.detail || `Block Save Fail`, {
      autoClose: 60000
    });
  });
}

// block/unblock
const handleActionBlock = (isActive, type) => {
  isActive.value = false;
  const $selectedArr = toRaw(selected.value);
  const semiList = filter(toRaw(blockList.value), (item) => includes($selectedArr, item.id));

  console.log("selected", semiList);

  const payload = semiList.map((item) => {
    const { id, semi_charge_seq } = item;
    const params = { id, semi_charge_seq };
    if (type === 1) {
      const { rolling_id } = toRaw(orderGroup.value);
      params["rolling_id"] = rolling_id;
      params["order_group_id"] = parseInt(route.query.id);
    }
    return params;
  });

  // Select API based on type
  const apiCall = type === 1 ? API.blockAction(payload) : API.unblockAction(payload);

  apiCall
    .then((res) => {
      selected.value = [];
      handleSearch();
      const d = res.data;
      if (d[0]) {
        toast.success(d[1], { position: "bottom-center" });
      } else {
        toast.error("Error," + d[1],{ autoClose: 60000 });
      }
    })
    .catch((error) => {
      console.error("API call failed:", error);
      toast.error("Error:" + error.message, { autoClose: 60000 });
    });
};

const handleActionReserve = (isActive, type) => {
  isActive.value = false;
  const $selectedArr = toRaw(selected.value);
  const semiList = filter(toRaw(blockList.value), (item) => includes($selectedArr, item.id));

  console.log("selected", semiList);

  const payload = semiList.map((item) => {
    const { id, semi_charge_seq } = item;
    const params = { id, semi_charge_seq };
    if (type === 1) {
      const { rolling_id } = toRaw(orderGroup.value);
      params["rolling_id"] = rolling_id;
      params["reserved_order_group_id"] = parseInt(route.query.id);
    }
    return params;
  });

  // Select API based on type
  const apiCall = type === 1 ? API.reserveAction(payload) : API.unreserveAction(payload);

  apiCall
    .then((res) => {
      selected.value = [];
      handleSearch();
      const d = res.data;
      if (d) {
        toast.success(d, { position: "bottom-center" });
      } else {
        toast.error("Error," + d, { autoClose: 60000 });
      }
    })
    .catch((error) => {
      console.error("API call failed:", error);
      toast.error("Error:" + error.message, { autoClose: 60000 });
    });
};

const getOrderGroup = (id) => {
  API.getOrderGroupById(id).then(res => {
    const { data, status } = res;
    if (status === 200) {
      orderGroup.value = data || {};
      // 处理spec_id 携带到查询接口里面
      const specCodes = (orderGroup.value.order_spec_group || []).map(item => item.spec_id);
      queryParams.value.spec_ids = specCodes
      specCodes.value = specCodes;
      handleSearch();
    }
  })
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  getOrderGroup(route.query.id);
}

if (route.query.alternative_semi_size_id){
  alternative_semi_size_id.value = [parseInt(route.query.alternative_semi_size_id)]
}

watch(
    // alt semi size
    () =>  alternative_semi_size_id.value,
    (value) => {
      getOrderGroup(route.query.id);
    }
)

</script>
<style lang="scss" scoped>
.page {
  .panel {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-action {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 32px;
    }
  }

  .switch-container {
    display: flex;
    align-items: center;
    width: 100px;
  }

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
