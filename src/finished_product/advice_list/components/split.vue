<template>
  <v-dialog
      v-model="visible"
      max-width="800"
      :close-on-back="false"
      persistent
  >
    <v-card
        :title="`Split ${payload.advice_code}`"
        prepend-icon="mdi-alert-circle-outline"
    >
      <div class="pa-4 border rounded ml-4 mr-4">
        <v-row align="center">
          <v-col cols="4">
            <div class="text-body-1">Order: {{ payload?.order?.order_code }}</div>
          </v-col>
          <v-col cols="6">
            <div class="text-body-1">Customer: {{ payload?.order?.customer_short_name }}</div>
          </v-col>
          
        </v-row>
        <v-divider class="mt-2 mb-2"></v-divider>
        <v-data-table
            v-model="selected"
            :headers="tableHeaders"
            :items="tableList"
            show-select
            density="default"
            max-height="100"
            item-value="id"
            return-object
        >
          <template #bottom>
          </template>
        </v-data-table>
      </div>
      <!-- <div class="text-subtitle-2 ml-4 mr-4 mb-2 mt-2">New Advice</div> -->
      <!-- <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-form ref="adviceForm">
          <v-row align="center">
            <v-col cols="6">
              <OrderCode v-model="form.order_id" label="Order Number" density="default" :hide-details="false" :rules="rules.order_id"></OrderCode>
            </v-col>
            <v-col cols="6">
              <OrderItemCode v-model="form.order_item_id" label="Line Number" :order_id="form.order_id" density="default" :hide-details="false" :rules="rules.order_item_id" :disabled="!form.order_id"></OrderItemCode>
            </v-col>
          </v-row>
        </v-form>
      </div> -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-row align="center">
          <v-col cols="1"></v-col>
          <v-col cols="6">
            <DictCode
              v-model="form.business_type"
              :code="`business_type#${defaultMillCode}`"
              label="Business Type"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              hide-details
          />
          </v-col>
      </v-row>
        

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
            :disabled="selected.length === 0"
            @click="handleSave"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {toast} from "vue3-toastify";
import {v4 as uuidv4} from 'uuid';
import {reject} from "lodash";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import API from "../api";
import DictCode from "@/components/picker/DictCode.vue";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const tableHeaders = ref([
  {title: "Bar-Bundle List", key: "code", sortable: false},
  {title: "Spec Code", key: "spec.spec_code", sortable: false},
  // {title: "Risk", key: "risk", sortable: false},
  {title: "Location", key: "location", sortable: false},
]);
const selected = ref([]);
const tableList = ref([]);
const loading = ref(false);
const searching = ref(false);

const defaultMillCode = ref();

const data = reactive({
  form: {
    id: undefined,
    order_id: undefined,
    order_item_id: undefined,
    load_id: undefined,
    business_type: undefined,
  },
  payload: {},
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
    finish_product: true,
  },
  rules: {
    order_id: [
      value => {
        if (value) return true
        return 'Order Number is required.'
      }
    ],
    order_item_id: [
      value => {
        if (value) return true
        return 'Order Line Number is required.'
      }
    ],
  }
});

const { form, rules, payload, queryParams } = toRefs(data);

const getSplitData = () => {
  const params = toRaw(queryParams.value);
  searching.value = true;
  API.getSplitData(form.value.id, params).then(res => {
    const { status, data } = res;
    if (status === 200) {
      payload.value = data.advice;
      form.value.order_id = data.advice?.order_id;
      form.value.order_item_id = data.advice?.order_item_id;
      form.value.load_id = data.advice?.load_id;
      form.value.business_type = data.advice?.business_type;
      tableList.value = data.finished_product;
    } else {
      payload.value = {};
      tableList.value = [];
    }
  }).finally(() => {
    searching.value = false;
  });
}

const handleShow = (id, millCode) => {

  defaultMillCode.value = millCode;

  visible.value = true;
  form.value.id = id;
  getSplitData();
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    form.value = {
      id: undefined,
      order_id: undefined,
      order_item_id: undefined,
      business_type: undefined,
    };
    selected.value = [];
    tableList.value = [];
    payload.value = {};
    // proxy.$refs["adviceForm"].resetValidation();
  })
}

const handleSendTip = async (id, action) => {
  try {
    await API.sendtip(id, { action });
    toast.success(`Send Advice Message Success for ID: ${id}`, {
      position: "bottom-center",
      delay: 2000,
    });
  } catch (res) {
    toast.error(`Send Advice Message Fail for ID: ${id}: ${res.response?.data?.detail}`, { autoClose: 60000 });
  }
};

const handleSave = async () => {
  const items = toRaw(selected.value);
  const ids = items.map(item => item.id);
  if (ids.length === 0) {
    toast.warning("Please Choose Bar-Bundle List", {
      position: "bottom-center"
    });
    return;
  }
  // const {valid} = await proxy.$refs["adviceForm"].validate();
  // if (!valid) {
  //   return;
  // }
  loading.value = true;
  const { id, ...rest } = toRaw(form.value);
  try {
    const response = await API.splitAction(id, {
      ...rest,
      "finished_ids": ids,
    });
    console.log('API.splitAction response:', response);

    if (response && response.data && response.data.id) {
      const returnedId = response.data.id;
      console.log('Returned ID:', returnedId);

      // 第一次调用 handleSendTip
      try {
        await handleSendTip(id, "A");
      } catch (error) {
        // console.error('Error in handleSendTip with id:', id, 'action: A', error);
        toast.error(`Send Advice A Message Fail for ID: ${id}: ${error.response?.data?.detail}`, { autoClose: 60000 });
      }

      // 第二次调用 handleSendTip
      try {
        await handleSendTip(returnedId, "C");
      } catch (error) {
        // console.error('Error in handleSendTip with id:', returnedId, 'action: C', error);
        toast.error(`Send Advice C Message Fail for ID: ${returnedId}: ${error.response?.data?.detail}`, { autoClose: 60000 });
      }

      handleClose();
      emit("refresh");
      toast.success("Split Success", {
        position: "bottom-center"
      });
    } else {
      // console.error('Response data does not contain id:', response.data);
      toast.error("Split Fail: Response data does not contain id", { autoClose: 60000 });
    }
  } catch (res) {
    toast.error(res?.response?.data?.detail || "Split Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

watch(
    () => selected.value,
    (value) => {
      // if (value.length > 0) {
        if (form.value.business_type === 'bws' || form.value.business_type === 'roster'){
          if (
              value.length > 0 && 
              !value.every(item => item.order_id === tableList.value[0].order_id) ||
              value.some(item => item.exist_flag !== 'Y' && item.exist_flag !== null) || 
              value.some(item => item.rework_type !== 'Complete' && item.rework_type !== null)
            ) {
            form.value.business_type = null;
            toast.warning('The current finished product orders are inconsistent. Please select a new one', {
              position: "bottom-center"
            });
          }
        }
      // }
    },
    {
      // once: true,
      immediate: true,
      deep: true,
    }
)

watch(
    () => form.value.business_type,
    (value) => {
      if (value === 'bws' || value === 'roster') {
        
        // 确保 tableList.value 有数据，避免访问 undefined
        if (
            selected.value.length > 0 && 
            !selected.value.every(item => item.order_id === selected.value[0].order_id) ||
            selected.value.some(item => item.exist_flag !== 'Y' && item.exist_flag !== null) || 
            selected.value.some(item => item.rework_type !== 'Complete' && item.rework_type !== null)
          ) {
          form.value.business_type = null;
          toast.warning('The current finished product orders are inconsistent. Please select a new one',{
            position: "bottom-center"
          });
        }
      }
    },
    {
      immediate: true,
      deep: true
    }
);

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
