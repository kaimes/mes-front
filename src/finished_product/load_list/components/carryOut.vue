<template>
    <v-dialog
    v-model="visible"
    max-width="50%"
    :close-on-back="false"
    persistent
>
  <v-card
      title="Carry Out"
      prepend-icon="mdi-alert-circle-outline"
  >
    <v-divider></v-divider>
    <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Details</div>
    <div class="pl-4 pr-4">
      <v-card class="mt-6" elevation="0" variant="outlined">
        <v-data-table
            :headers="tableHeaders"
            :items="tableList"
            density="default"
            max-height="100"
        >
          <template #bottom>
          </template>
        </v-data-table>
      </v-card>
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
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import {useRoute, useRouter} from "vue-router";
import {map} from "lodash";
import API from "../api";

const router = useRouter();
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const tableHeaders = ref([
  { title: "Pilling Bogie", key: "pilling_bogie" },
  { title: "Code", key: "code" },
  { title: "To Business Type", key: "business_type" },
  { title: "Mill Code", key: "mill.code", value: (item) => item.mill?.code || "--" },
  { title: "To Area", key: "area.code", value: (item) => item.area?.code || "--" },
  { title: "Rolling Code", key: "rolling.rolling_code", value: (item) => item.rolling?.rolling_code || "--" },
  { title: "Transport Code", key: "transport_code" },
  { title: "Transport Type", key: "transport_type" },
  { title: "Dispatch Date", key: "dispatch_date" },
  { title: "Stock In Date", key: "stock_in_date" },
  { title: "Piece Count", key: "piece_count" },
  { title: "Weight(ton)", key: "total_weight_ton" },
  { title: "Customer Code", key: "customer_code" },
  { title: "Load Status", key: "load_status" },
  { title: "Load Type", key: "load_type" },
  { title: "Advice Num", key: "advice_num" },
  { title: "Comment", key: "comment" },
  {
    title: "Created At",
    key: "created_at",
    sortable: true,
    minWidth: 180
  },
]);
const tableList = ref([]);
const selected = ref([]);
const total = ref(0);
const isGenerateAdviceDisabled = ref(true);

const data = reactive({
form: {
  code: undefined,
  business_type: undefined,
  transport_code: undefined,
  transport_type: undefined,
  piece_count: undefined,
  total_weight_ton: undefined,
  customer_code: undefined,
  finished_load_status: undefined,
  load_type: undefined,
  advice_num: undefined,
  comment: undefined,
  mill_code: undefined,
  area_code: undefined,
  rolling_code: undefined,
  dispatch_date: undefined,
  stock_in_date: undefined,
  created_at: undefined,
  load_in:[]
},
rules: {
}
});

const { form, rules, queryParams } = toRefs(data);

const handleShow = (data, maxID) => {
form.value.load_in = map(data, (item) => item.id);
tableList.value = data || [];
tableList.value = data.map((item, index) => ({
      ...item,

      calulated_weight: Number(item.length_mm || 0) * Number(item.quantity || 0) * Number(item.product_type?.dim3 || 0)
    }));
isGenerateAdviceDisabled.value = data.some(item => 
    !(item.advice_id === null) ||
    (item.order_item_id === null)
);

nextTick(() => {
  visible.value = true;
})
}

const handleClose = () => {
visible.value = false;
form.value = {
  code: undefined,
  business_type: undefined,
  transport_code: undefined,
  transport_type: undefined,
  piece_count: undefined,
  total_weight_ton: undefined,
  customer_code: undefined,
  finished_load_status: undefined,
  load_type: undefined,
  advice_num: undefined,
  comment: undefined,
  mill_code: undefined,
  area_code: undefined,
  rolling_code: undefined,
  dispatch_date: undefined,
  stock_in_date: undefined,
  created_at: undefined,
};
nextTick(() => {
  // proxy.$refs["moveForm"].resetValidation();
})
}

const handleSave = async () => {
loading.value = true;
const params = toRaw(form.value);
try {
  const res = await API.updatecarry(params);
  emit("refresh");
  handleClose();
  toast.success("Carry Out Success", {
    position: "bottom-center",
  });
} catch (res) {
  toast.error("Carry Out Failed", { autoClose: 60000 });
} finally {
  loading.value = false;
}
};
const handleItemChange = (item, key) => {
form.value[`${key}`] = item.id;
}

defineExpose({
handleShow,
});
</script>
<style lang="scss" scoped>
</style>
