<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <RollingCode v-model="queryParams.rolling_no" item-value="rolling_code"></RollingCode>
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none my-1 ml-2"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            Reset
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-2 mr-4"
              color="primary"
              variant="flat"
              :loading="loading"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <div class="panel mt-4">
      <v-btn
          class="text-none mr-4"
          color="primary"
          variant="flat"
          @click="handleReverse"
          v-permission="`ReserveSequence`"
      >
        Reverse Sequence
      </v-btn>
      <v-btn
          class="text-none mr-4"
          color="primary"
          variant="flat"
          @click="handleBackRolling"
          v-permission="`ReturnToRolling`"
      >
        Return to Rolling
      </v-btn>
      <v-btn
          class="text-none mr-4"
          color="primary"
          variant="flat"
          :disabled="!queryParams.rolling_no"
          @click="handleM243Message"
          v-permission="`SendToPC`"
      >
        Send to PC
      </v-btn>
      <v-spacer />
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
    <div class="mt-6" elevation="0" variant="outlined">
      <template v-if="tableList.length > 0">
        <v-expansion-panels v-model="tabs" multiple :rounded="24" variant="accordion" bg-color="white">
          <Table v-for="(item, index) in tableList" :key="item.id" v-model="tableList[index]" :disabled="save" :rollingOptions="rollingOptions" @refresh="handleSearch" />
        </v-expansion-panels>
      </template>
      <template v-else>
        <v-empty-state
            icon="mdi-magnify"
            text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
            title="We couldn't find a match."
        ></v-empty-state>
      </template>
    </div>
  </v-container>
</template>
<script setup>
import {useRoute, useRouter} from "vue-router";
import { filter } from "lodash";
import { toast } from "vue3-toastify";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs} from "vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import API from "./api";
import Table from "./orderGroupTable.vue";

const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const searching = ref(false);
const rollNoList = ref([]);
const tabs = ref([]);
const tableList = ref([]);
const save = ref(false);
const rollingOptions = ref([]);

const data = reactive({
  queryParams: {
    rolling_no: undefined,
    kg: undefined,
    section_type: undefined,
  }
});

const {queryParams} = toRefs(data);

const handleBackRolling = () => {
  router.go(-1);
}

const handleReverse = () => {
  const params = toRaw(queryParams.value);
  loading.value = true;
  API.reverseOrderGroup(params).then(res => {
    if (res.status === 200 && res.data && res.data.length > 0) {
      tableList.value = res.data;
      tabs.value = res.data.map(item => item["id"]);
    } else {
      toast.error("Order Groups not found.", { autoClose: 60000 });
    }
  }).catch((res) => {
    toast.error("Order Groups not found.", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

const handleM243Message = () => {
  const params = toRaw(queryParams.value);
  let payload = {
        id: 243,
        type: 'srsmpc',
        msg: params.rolling_no ? params.rolling_no : ''
      }
  API.SendM243ToPC(payload).then(res => {
    let data = res.data;
    if (data.code == 400) {
      toast.error(data.data.tip, { autoClose: 60000 });
    } else {
      toast.success(`Send M243 Success`, {
        position: "bottom-center",
        delay: 1000
      });
      // 调用更新状态
      const updateParams = {
        rolling_code: params.rolling_no,
        rolling_status: 'Planning Complete'
      };
      API.updateRollingStatus(updateParams).then(updateRes => {
        toast.success(`Send M243 Success and Rolling Status updated to Planning Complete`, {
          position: "bottom-center",
          delay: 1000
        });
      }).catch(updateError => {
        toast.error(`Failed to update Rolling Status: ${updateError.response?.data?.detail || updateError.message}`, { autoClose: 60000 });
      });
    }
  }).catch(res => {
    toast.error(res?.response?.data?.detail || `Send M243 Fail`, { autoClose: 60000 });
  });
}

const getData = () => {
  const params = toRaw(queryParams.value);
  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200 && res.data && res.data.length > 0) {
      tableList.value = res.data;
      tabs.value = res.data.map(item => item["id"]);
    } else {
      toast.error("Order Groups not found.", { autoClose: 60000 });
    }
  }).catch((res) => {
    toast.error("Order Groups not found.", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}


const getProdDim1Dim2 = (rollingCode) => {
  const parts = rollingCode.split("-");
  if (parts.length > 2) {
    return parts.slice(0, -1).join("-"); // Remove the last part
  }
}

const getRollingOptions = () => {
  const rollingCode = queryParams.value.rolling_no;
  const prodDim1Dim2 = getProdDim1Dim2(rollingCode);
  API.getRollingOptions(prodDim1Dim2).then(res => {
    if (res.status == 200 && res.data && res.data.length > 0) {
      let validData = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i]['text'] !== rollingCode) {
          validData.push(res.data[i]);
        }
      }
      rollingOptions.value = validData;
    }
  }).catch((res) => {
    toast.error("Get rolling options failed.", { autoClose: 60000 });
  })
}

const handleSearch = () => {
  getData();
  getRollingOptions();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}
// 保存数据
const handleSave = () => {
  // 获取有数据的
  const $data = filter(toRaw(tableList.value), (item) => !!item.group_code || !!item.group_charge_seq);
  if ($data.length === 0) {
    toast.error("Please set Seq No. or No.", {position: 'bottom-center'}, { autoClose: 60000 })
    return;
  }
  API.batchUpdateOrderGroup($data.map(item => ({
    id: item.id,
    group_charge_seq: item.group_charge_seq,
    group_code: item.group_code,
    plan_tonnes: item.plan_tonnes === "" ? 0 : item.plan_tonnes,
    // requested_tonnes: item.requested_tonnes,
    galvanisation: item.galvanisation,
    alternative_semi_size_id: item.alternative_semi_size_id
  }))).then(res => {
    handleSearch();
    toast.success(`Order Group Save Success`, {
    position: "bottom-center",
  });
  }).catch(res => {
    toast.error(res?.response?.data?.detail || `Order Group Save Fail`, { autoClose: 60000 });
  });
}

// 进入页面根据ID获取数据详情
if (route.query.code) {
  queryParams.value.rolling_no = route.query.code;
  getData();
  getRollingOptions();
}
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
