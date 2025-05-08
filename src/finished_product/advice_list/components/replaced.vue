<template>
  <v-dialog
      v-model="visible"
      max-width="800"
      :close-on-back="false"
      persistent
  >
    <v-card
        :title="`Despatches Feedback`"
        prepend-icon="mdi-alert-circle-outline"
    >
      <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="form.advice_code" density="default" variant="underlined" placeholder="Advice No."
                            bg-color="white" clearable label="Advice No." hide-details disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <!-- <v-text-field v-model="form.wagon_no" density="default" variant="underlined" placeholder="Wagon No."
                            bg-color="white" clearable label="Wagon No." hide-details></v-text-field> -->
            <TransportCode
                v-model="form.transport_id"
                label="Wagon No."
                @change="handleItemChange($event, 'transport_id')"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.calulated_weight" density="default" variant="underlined" placeholder="Calculated Weight"
                            bg-color="white" clearable label="Calculated Weight" hide-details></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.weighted_weight" density="default" variant="underlined" placeholder="Actual Weight"
                            bg-color="white" clearable label="Actual Weight" hide-details></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.calc_weight" density="default" variant="underlined" placeholder="Adjust Weight"
                            bg-color="white" clearable label="Adjust Weight" hide-details></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.created_at" density="default" variant="underlined" placeholder="Hour"
                            bg-color="white" clearable label="Hour" hide-details disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <VueDatePicker @update:model-value="formatDateSearch($event, 'move_date')" :teleport="true" :enable-time-picker="false">
              <template #trigger>
                <v-text-field
                    v-model="form.move_date"
                    label="Move Date"
                    hide-details
                    clearable
                    readonly
                ></v-text-field>
              </template>
            </VueDatePicker>
          </v-col>
          <v-col cols="3">
            <!-- <DictCode
              v-model="form.status"
              :code="`advice_status`"
              label="Status"
              item-title="title"
              item-value="value"
              variant="underlined"
              density="default"
              hide-details
              disabled
            /> -->
            <v-text-field v-model="form.status" density="default" variant="underlined" placeholder="Status"
                            bg-color="white" clearable label="Status" hide-details disabled></v-text-field>
          </v-col>
        </v-row>
        <v-divider class="mt-2 mb-2"></v-divider>
        <!-- <v-data-table
            v-model="selected"
            :headers="tableHeaders"
            :items="tableList"
            show-select
            density="default"
            max-height="100"
            item-value="id"
        >
          <template #bottom>
          </template>
        </v-data-table> -->
      </div>
      <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="replaced_cons" density="default" variant="underlined" placeholder="Replaced Cons"
                            bg-color="white" clearable label="Replaced Cons" hide-details disabled></v-text-field>
          </v-col>
        </v-row>
      </div>
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
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
    
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import {v4 as uuidv4} from 'uuid';
import {reject} from "lodash";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import TransportCode from "@/components/picker/TransportCode.vue";
import DictCode from "@/components/picker/DictCode.vue";

import API from "../api";
import moment from "moment/moment";
import {formatDate} from "@/util/util";

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

const data = reactive({
  form: {
    id: undefined,
    advice_code: undefined,
    transport_id: undefined,
    transport: undefined,
    calculated_weight: undefined,
    weighted_weight: undefined,
    calc_weight: undefined,
    created_at: undefined,
    move_date: undefined,
    status: undefined,
  },
  replaced_cons: undefined,
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
  }
});

const { form, rules, payload, queryParams, replaced_cons } = toRefs(data);


const getMaxId = () => {
  searching.value = true;
  API.getMaxID({'business_type': form.value.business_type}).then(res => {
    const { status, data } = res;
    if (status === 200) {    
      form.value.advice_code = String(data.advice_code);
    } else {
      payload.value = {};
      tableList.value = [];
    }
  }).finally(() => {
    searching.value = false;
  });
}

const handleShow = (item) => {
  visible.value = true;
  // form.value.id = id;
  form.value = JSON.parse(JSON.stringify(item));
  replaced_cons.value = item.advice_code;
  // formatDateSearch(item.created_at, 'created_at')
  form.value.created_at = item?.created_at ? formatDate(item?.created_at, 'YYYY-MM-DD') : '';
  // form.value.created_at = item?.created_at ? formatDate(item?.created_at, 'YYYY-MM-DD HH:mm:ss') : '';
  form.value.move_date = item?.load?.despatch_date ? formatDate(item?.load?.despatch_date, 'YYYY-MM-DD') : null;
  form.value.calculated_weight = item?.weighted_weight - item?.load?.total_weight_ton ? item?.weighted_weight && item?.load?.total_weight_ton : 0
  form.value.calc_weight = item?.load?.total_weight_ton - item?.load?.actual_weight ? item?.load?.total_weight_ton && item?.load?.actual_weight : 0
  getMaxId();
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    form.value = {
      id: undefined,
      wagon_no: undefined,
      calculated_weight: undefined,
      weighted_weight: undefined,
      calc_weight: undefined,
      created_at: undefined,
      move_date: undefined,
      status: undefined,
    };
    selected.value = [];
    tableList.value = [];
    payload.value = {};
    // proxy.$refs["adviceForm"].resetValidation();
  })
}

const handleSave = async () => {
  // const {valid} = await proxy.$refs["adviceForm"].validate();
  // if (!valid) {
  //   return;
  // }
  loading.value = true;
  const { id, ...rest } = toRaw(form.value);
  try {
    await API.replace(id, {
      ...rest,
    });
    handleClose();
    emit("refresh");
    toast.success("Replaced Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res.response?.data?.detail || "Replaced Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const formatDateSearch = (res, key) => {  
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

const handleItemChange = (item, key) => {
  // form.value.customer = item.customer_short_name
  form.value[`${key}`] = item.id;
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
