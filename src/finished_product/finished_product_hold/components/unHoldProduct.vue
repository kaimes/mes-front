<template>
  <v-dialog v-model="visible" max-width="800" :close-on-back="false" persistent>
    <v-card title="Bar Unhold">
      <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-form ref="editForm">
          <v-row
            v-for="(item, index) in form.items"
            align="center"
            :key="item.key"
          >
            <v-col cols="6">
              <HoldReasonCode
                v-model="item.hold_id"
                :rules="rules.hold_id"
                :hideDetails="false"
              />
            </v-col>
            <v-col cols="4">
              <template v-if="index + 1 === form.items.length">
                <v-btn
                  density="comfortable" variant="outlined" flat
                  icon="mdi-plus"
                  @click="handleAddItem"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  density="comfortable" variant="outlined" flat
                  icon="mdi-minus"
                  @click="handleRemoveItem(item)"
                ></v-btn>
              </template>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="text-none mr-4"
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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRaw,
  toRefs,
} from "vue";
import { toast } from "vue3-toastify";
import { v4 as uuidv4 } from "uuid";
import { reject } from "lodash";
import XEUtils from "xe-utils";
import HoldReasonCode from "@/components/picker/HoldReasonCode.vue";
import API from "../api";
import { fi } from "date-fns/locale";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableList = ref([]);
const loading = ref(false);
// 获取所有的菜单路由(包含权限)
let menuTree = localStorage.getItem("menuButtonPermission");
menuTree = JSON.parse(menuTree);
let filteredArrayCode = Object.values(menuTree).reduce(function (
  pre,
  cur,
  index
) {
  if (cur.name === "Hold Reason List") {
    
    return [...pre, cur.permission];
  } else {
    return pre;
  }
},
[]);

const data = reactive({
  form: {
    runout_code1: undefined,
    runout_code2: undefined,
    order_id: undefined,
    advice_id: undefined,
    rolling_id: undefined,
    items: [
      {
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      },
    ],
  },
  rules: {

    hold_id: [
      (value, item) => {
        // 获取所有的菜单路由(包含权限)
        if (value && value.code) {
          let parts = value.code.split("-");
          let code = parts[0]; // "K"

          let hold_code = 'hold-'+code

          if (filteredArrayCode.indexOf(hold_code) >= 0) {
            return true;
          }
          return "Not Authorized. Please contact IT.";
        }
        return "Hold Reason is required.";
      },
    ],

  },
});

const { form, rules } = toRefs(data);

const handleShow = (data, runout_code1, runout_code2, order_id, advice_id, rolling_id) => {
  form.runout_code1 = runout_code1
  form.runout_code2 = runout_code2
  form.order_id = order_id
  form.advice_id = advice_id
  form.rolling_id = rolling_id
  visible.value = true;
  tableList.value = data;
};

const handleAddItem = () => {
  const { items } = toRaw(form.value);
  form.value.items = [
    ...items,
    {
      key: uuidv4(),
      hold_id: undefined,
      comment: undefined,
    },
  ];
};

const handleRemoveItem = (item) => {
  const { items } = toRaw(form.value);
  form.value.items = reject(items, { key: item.key });
};
const handleClose = () => {
  visible.value = false;
  form.value = {
    items: [
      {
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      },
    ],
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  });
};

const handleSave = async () => {
  const { valid } = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    const response = await API.batchUnHold({
      finished_ids: tableList.value.map((item) => item.id),
      hold_list: Object.values(params.items).map((cur) => cur.hold_id.id)
  },
  {    
    runout_code1: form.runout_code1,
    runout_code2: form.runout_code2,
    order_id: form.order_id,
    advice_id: form.advice_id,
    rolling_id: form.rolling_id,
  });
    handleClose();
    emit("refresh");
    const lastResponseData = response.data[response.data.length - 1];
    const { total_count, success_count, failure_count } = lastResponseData;
    toast.success( `unHold successful! A total of ${total_count} records, with ${success_count} successful and ${failure_count} failed.`, {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error("Hold Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
