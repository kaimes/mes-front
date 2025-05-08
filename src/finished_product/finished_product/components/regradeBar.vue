<template>
  <v-dialog
      v-model="visible"
      max-width="800"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Regrade Bar"
        prepend-icon="mdi-alert-circle-outline"
    >
      <div class="text-subtitle-2 ml-4 mr-4 mb-2">List of selected</div>
      <div class="pa-4 border rounded ml-4 mr-4">
        <v-data-table
            :headers="tableProductHeaders"
            :items="tableProductList"
            density="compact"
            fixed-header
            height="100"
            min-height="50"
            item-value="id"
        >
          <template #bottom>
          </template>
        </v-data-table>
      </div>
      <div class="text-subtitle-2 ml-4 mr-4 mb-2 mt-2">Alternative Specs</div>
      <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-row align="center">
          <v-col cols="4">
            <spec-code v-model="queryParams.spec_code" @change="changeSpec($event)"/>
          </v-col>
          <v-col cols="4">
            <RegradeReasonCode
                v-model="queryParams.regrade_reason"
                :hide-details="false"
                density="default"
                variant="underlined"
                style="margin-top: 21px;"
          ></RegradeReasonCode>
          </v-col>
          <v-col cols="4"> 
            <v-text-field
              v-model="queryParams.regrade_comment"
              density="default"
              variant="underlined"
              label="Regrade Comment"
              bg-color="white"
              style="margin-top: 21px;"
              clearable
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="4">
            <v-text-field
                v-model="queryParams.q"
                @update:model-value="getData"
                placeholder="Spec Code"
                bg-color="white"
                hide-details
                clearable
            ></v-text-field>
          </v-col> -->
        </v-row>
        <v-data-table-server
            v-model="selected"
            density="compact"
            items-per-page="10"
            item-value="spec_id"
            :page="queryParams.page"
            :headers="tableSpecHeaders"
            :items="tableSpecList"
            :items-length="total"
            :loading="loading"
            fixed-header
            height="240"
            show-current-page
            @click:row="handleChoose"
            @update:options="handleTableChange"
        >
          <template v-slot:item.radio="{ item }">
            <v-radio v-model="selected" readonly :true-value="item.spec_id" />
          </template>
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@3"></v-skeleton-loader>
          </template>
        </v-data-table-server>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="d-flex ga-2 align-center">
          <v-btn
              class="text-none"
              color="#e3e3e3"
              variant="flat"
              @click="handleClose"
          >
            Cancel
          </v-btn>
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              :loading="loading"
              @click="handleSave"
          >
            Confirm
          </v-btn>
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              v-permission="`Regrade Force Confirm`"
              :loading="loading"
              @click="handleForceSave"
          >
            Force Confirm
          </v-btn>
        </div>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import {reject, head, compact} from "lodash";
import API from "../api";
import SpecCode from "@/components/picker/SpecCode.vue";
import RegradeReasonCode from "@/components/picker/RegradeReasonCode.vue";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const tableProductHeaders = ref([
  {title: "Code", key: "code", sortable: false},
  {title: "Current Spec Code", key: "spec_code", value: (item) => item.spec?.spec_code, sortable: false},
  {title: "Short Code", key: "short_code", value: (item) => item.spec?.short_name, sortable: false},
  {title: "Compliance", key: "test_result", sortable: false},
]);
const tableSpecHeaders = ref([
  {title: "", key: "radio", sortable: false},
  {title: "Spec Code", key: "spec_code", value: (item) => item.spec?.spec_code, sortable: false},
  {title: "Short Code", key: "short_code",value: (item) => item.spec?.short_name, sortable: false},
  {title: "Compliance", key: "test_result", sortable: false},
]);
const runoutId = ref(undefined);
const tableProductList = ref([]);
const selected = ref(undefined);
const tableSpecList = ref([]);
const total = ref(0);
const loading = ref(false);

const data = reactive({
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    descending: [true],
    regrade_reason: undefined,
    regrade_comment: undefined,
    spec_code: undefined,
  },
});

const { queryParams } = toRefs(data);

const getData = () => {
  const params = toRaw(queryParams.value);
  const finalRunoutId = runoutId.value || "null";
  loading.value = true;
  API.getCoveringAll(finalRunoutId, params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableSpecList.value = res.data.items || [];
    } else {
      total.value = 0;
      tableSpecList.value = [];
    }
  }).catch(error => {
    toast.error(error?.response?.data?.detail || "Please select the finished product with the same runout.", { autoClose: 60000 });
    total.value = 0;
    tableSpecList.value = [];
  }).finally(() => {
    loading.value = false;
  });
}

const handleChoose = (event, row) => {
  const { spec_id } = row.item;
  const { tensile_score } = row.item;
  const { impact_score } = row.item;
  selected.value = spec_id;
  selected.t_result = tensile_score;
  selected.c_result = impact_score;
}

const handleTableChange = ({page, itemsPerPage}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleShow = (data) => {
  visible.value = true;
  tableProductList.value = data;
  runoutId.value = compact(data.map(item => item.runout_id)).join(',');
  queryParams.value.spec_code = undefined;
  queryParams.value.regrade_reason = undefined;
  queryParams.value.regrade_comment = undefined;
  queryParams.value.q = undefined;
  selected.value = undefined;
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    selected.value = undefined;
  });
}

const handleSave = async () => {
  if (!selected.value) {
    toast.warning("Please choose Spec", {
      position: "bottom-center"
    });
    return;
  }
  loading.value = true;
  try {
    console.log(selected)
    await API.regrade(tableProductList.value.map(item => ({
      id: item.id,
      spec_id: selected.value,
      t_result: selected.t_result,
      c_result : selected.c_result,
      regrade_reason:queryParams.value.regrade_reason,
      regrade_comment: queryParams.value.regrade_comment,
    })));
    handleClose();
    emit("refresh");
    toast.success("Regrade Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || "Regrade Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleForceSave = async () => {
  if (!selected.value) {
    toast.warning("Please choose Spec", {
      position: "bottom-center"
    });
    return;
  }
  loading.value = true;
  try {
    await API.forceRegrade(tableProductList.value.map(item => ({
      id: item.id,
      spec_id: selected.value,
      regrade_reason:queryParams.value.regrade_reason,
      regrade_comment: queryParams.value.regrade_comment,
    })));
    handleClose();
    emit("refresh");
    toast.success("Regrade Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || "Regrade Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const changeSpec =(item)=>{
  if (item?.id){
    tableSpecList.value = [{"spec": toRaw(item), "test_result": null, "spec_id":item.id}];
    total.value = 1;
  }else{
    queryParams.value.q = null
    tableSpecList.value= []
    getData()
  }
}
const changeReason =(item)=>{
  if (item?.id){
    tableSpecList.value = [{"spec": toRaw(item), "test_result": null, "spec_id":item.id}];
    total.value = 1;
  }else{
    queryParams.value.q = null
    tableSpecList.value= []
    getData()
  }
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
