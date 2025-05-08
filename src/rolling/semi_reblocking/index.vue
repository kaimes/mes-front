<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <RollingCode v-model="queryParams.rolling_id" :rolling="currentRolling" @change="handleItemChange($event, 'rolling_id')"></RollingCode>
        </v-col>
        <v-col cols="3">
              <v-select 
                v-model="queryParams.order_group_id"
                label="Order Group No"
                class="text-none mt-5"
                :items="orderGroupOptions"
                @update:model-value="handleGroupCodeChange"
              ></v-select>
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
        <v-col cols="3">         
          <v-chip color="green" >
            Last Charge: {{ lastChargeTime }}
          </v-chip>
        </v-col>
       
      </v-row>
    </v-form>
    <v-card class="mt-0 pa-1" elevation="0" variant="outlined">
        <div class="panel mt-4">
        <v-dialog
            max-width="400"
            persistent
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                class="text-none ml-2 mr-2"
                color="primary"
                variant="flat"
                :disabled="!selected.length"
                v-bind="activatorProps"
            >
              Lift Off
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
                    @click="handleUnblock(isActive)"
                >
                  Confirm
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <v-data-table-server
          fixed-header
          height="650"
          show-current-page
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :page="queryParams.page"
          :loading="loading"
          @update:page="handleTableChangePage"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"
          v-model="selected"
          show-select
      >
        <template v-slot:item.data-table-select="{ internalItem, isSelected, toggleSelect }">
          <v-checkbox-btn
            :model-value="isSelected(internalItem)"
            @update:model-value="toggleSelect(internalItem)"
          ></v-checkbox-btn>
        </template>
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:item.comment="row">
          <div class="d-flex align-center" >
            <v-tooltip :text="row.item.comment">
              <template v-slot:activator="{ props }">
                <div class="comment-text" v-bind="props">{{ row.item.comment }}</div>
              </template>
            </v-tooltip>
            <v-btn
                variant="text"
                icon="mdi-pencil"
                size="small"
                @click="handleUpdateComment(row.item)"
                v-permission="`UpdateComment`"
            />
          </div>
        </template>
        <template v-slot:item.action="row">
          <v-btn variant="text" icon="mdi-printer"></v-btn>
        </template>
        <!-- <template v-slot:item.order_group.product_type.dim3="row">
          <div class="d-flex align-center">
            <div class="comment-text">{{ row.item.order_group?.product_type?.dim3 }}</div>
            <v-btn variant="text" icon="mdi-pencil" size="small" @click="handleSemiBlock(row.item)"></v-btn>
          </div>
        </template> -->
        <template v-slot:item.order_group.group_code="row">
          <div class="d-flex align-center">
            <div class="comment-text">{{ row.item.order_group?.group_code }}</div>
            <v-btn variant="text" icon="mdi-pencil" size="small" @click="handleSemiBlock(row.item)" v-permission="`Semi Block`"></v-btn>
          </div>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
    <CommentForm ref="commentForm"  @refresh="handleSearch" />
    <BlockForm ref="blockForm"  @refresh="handleSearch" />
  </v-container>
</template>
<script setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import moment from "moment/moment";
import RollingCode from "@/components/picker/RollingCode.vue";
import CommentForm from "./components/commentForm.vue";
import BlockForm from "./components/blockForm.vue";
import API from "./api";
import { toast } from "vue3-toastify";
import {filter, includes} from "lodash";

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  { title: 'Furnace Seq', value: 'furnace_sequence_number',sortable: true },
  { title: 'Position', value: 'location', sortable: true },
  { title: 'Order Group No', value: 'order_group.group_code', sortable: true },
  { title: 'KGM', value: 'order_group.product_type.dim3', sortable: true },
  { title: 'Quality Code', value: 'quality_code', sortable: true },
  { title: 'Comment', value: 'comment', sortable: true },
  { title: 'Code', value: 'semi_code',  sortable: true },
  { title: 'Type', value: 'semi_type', sortable: true },
  { title: 'Weight(kg)', value: 'weight', sortable: true },
  { title: 'Length(mm)', value: 'length_mm', sortable: true },
  { title: 'Width(mm)', value: 'width_mm', sortable: true }, 
  {title: "Runout Nunber", key: "runout_code", sortable: true},
  {title: "Runout Lengths", key: "runout_length", sortable: false},
  
 
]);

const currentRolling = ref()
const lastChargeTime = ref()
const selected = ref([]);
const tableList = ref([]);
const total = ref(0);


const data = reactive({
  queryParams: {
    rolling_id: undefined,
    rolling_code: undefined,
    order_group_id: undefined,
    page: 1,
    itemsPerPage: 50,
    sortBy: ["furnace_sequence_number"],
    descending: [false],
  },
  orderGroupOptions: [],
});

const {queryParams,orderGroupOptions} = toRefs(data);

const formatDate = (res) => {
  if (res && res.length === 2) {
    const startDate = moment(res[0]).format("YYYY-MM-DD");
    const endDate = moment(res[1]).format("YYYY-MM-DD");
    queryParams.value.date = `${startDate}~${endDate}`;
  }
}

const getData = () => {
  const params = {
    ...toRaw(queryParams.value),
  };
  let fields = [];
  let ops = [];
  let values = [];

  if (params.rolling_id) {
    fields.push("rolling_id");
    ops.push("eq");
    values.push(params.rolling_id);
    delete params.rolling_id;
  }
  if (params.order_group_id) {
    fields.push("order_group_id");
    ops.push("eq");
    values.push(params.order_group_id);
    delete params.order_group_id;
  }

  params["fields"] = fields;
  params["ops"] = ops;
  params["values"] = values;

  params.semi_reblocking= true

  loading.value = true;
  API.getAll(params)
    .then((res) => {
      total.value = res.data.total || 0;
      tableList.value = res.data.items;
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleTableChangePage = (page) => {
  queryParams.value.page = page;
  getData();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleTableChangeSortBy = (sortBy) => {
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
  selected.value = [];
}

const handleUpdateComment = (row) => {
  
  proxy.$refs["commentForm"].handleShow(row);
}

const handleSemiBlock = (row) => {
  proxy.$refs["blockForm"].handleShow(row);
}
const handleUnblock = (isActive) => {
  isActive.value = false;
  const $selectedArr = toRaw(selected.value);
  const semiList = filter(toRaw(tableList.value), (item) => includes($selectedArr, item.id));

  const payload = semiList.map((item) => {
    const { id,location} = item;
    const params = { id, location};
    return params;
  });
  for (const pay of payload) {
    console.log(pay)
    if (pay.location!=="FURN") {
        toast.error('Position not allowed. Only FURN', { autoClose: 60000 }
    );
        return; 
    }
  }
  API.unblockAction(payload)
    .then((res) => {
      selected.value = [];
      handleSearch();
      const d = res.data;
      if (d[0]) {
        toast.success(d[1], { position: "bottom-center" });
      } else {
        toast.error("Error," + d[1], { autoClose: 60000 }
    );
      }
    })
    .catch((error) => {
      console.error("API call failed:", error);
      toast.error("Error:" + error.message, { autoClose: 60000 }
    );
    });
};

const handleItemChange = (item, key) => {

  queryParams.value[`${key}`] = item?.id;
  console.log(queryParams.value[`${key}`])
  // 获取一个rolling的groupcode 列表
  if (!queryParams.value.rolling_id) {
    orderGroupOptions.value = [];
    return
  }
  if (item.id){
    API.requestCommonGet(`/order_group/options?rolling_id=${item.id}`).then(res => {
      if (res.status == 200 && res.data) {
        console.log("<><><><>",item.id)
        orderGroupOptions.value = res.data.options;
      }
    }).catch((res) => {
      toast.error("Get order group options failed.", { autoClose: 60000 });
    })
  }
}

const getMaxTime = () => {
  API.requestCommonGet("/semi_move_history/max_time").then(response => {
    if (response.data)
    lastChargeTime.value = response.data.data
  })
}
const getRolling = () => {
  API.requestCommonGet("/rolling/semi_reblocking/get_rolling").then(response => {
    if (response.data) {
      currentRolling.value = response.data;
      queryParams.value.rolling_id = response.data.id;
      getData();
    }
  });
};
   
// 进入页面根据ID获取数据详情
// if (route.query.id) {
//   queryParams.value.rolling_id = parseInt(route.query.id);
//   getData();
// }
getRolling();
getMaxTime();
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
  .comment-text {
    width: 60px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
