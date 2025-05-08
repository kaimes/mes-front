<template>
  <v-dialog v-model="visible" max-width="800" :close-on-back="false" persistent>
    <v-card :title="Title(data.handle_type)">
      <div class="text-subtitle-2 ml-4 mr-4 mb-2">List of selected</div>
      <div class="pa-4 border rounded ml-4 mr-4">
        <v-data-table
            fixed-header
            :headers="tableHeaders"
            :items="tableList"
            density="default"
            height="200"
            item-value="id"
        >
          <template #bottom>
            <!-- Leave this slot empty to hide pagination controls -->
          </template>
        </v-data-table>
      </div>
      <v-col cols="6">
        <v-radio-group v-model="data.handle_type" inline hide-details>
          <v-radio label="Retrieve" value="retrieve">
            <template v-slot:label>
              <span class="text-subtitle-1 text-black font-weight-medium">Retrieve</span>
            </template>
          </v-radio>
          <v-radio label="Return" value="return">
            <template v-slot:label>
              <span class="text-subtitle-1 text-black font-weight-medium">Return</span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>

      <template v-if="data.handle_type === 'retrieve'">
        <v-col cols="24">
          <v-textarea v-model="data.form.comment" label="" color="#333"
                      density="default" variant="solo" placeholder="Remarks"
                      bg-color="white">

          </v-textarea>
        </v-col>
      </template>

      <template v-if="data.handle_type === 'return'">
         <v-form  class="justify-start ga-2 pa-4">
          <v-row align="center">
            <v-col cols="4">
              <DictCode
                v-model="form.stock_type"
                bg-color="white"
                density="compact"
                variant="outlined"
                color="#333"
                label="Business Type"
                :code="`business_type#${defaultMillCode}`"
            />
            </v-col>
            <v-col cols="4">
              <Status
                v-model="form.status"
                bg-color="white"
                density="compact"
                variant="outlined"
                color="#333"
                label="Status"
                code="finished_product_status"
            />
            </v-col>
            <v-col cols="4">
              <Location v-model="form.area_id" :area="area" label="Location" :rules="rules.area_id"  />
            </v-col>
          </v-row>
           <v-row>
             <v-col>
               <v-checkbox v-model="form.is_generate_new" label="Generate New Code" density="comfortable" hide-details  :disabled="tableList.length > 1"></v-checkbox>
             </v-col>
           </v-row>
          <v-row v-if="form.is_generate_new">
            <v-col cols="4">
              <v-text-field v-model="form.code" density="default" variant="underlined" :rules="rules.code"
                            placeholder="New Code " label="New Code" bg-color="white" clearable ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="form.length_mm" density="default" variant="underlined"
                            placeholder="length" label="Length" bg-color="white" clearable ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field v-model="form.estimated_weight_kg" density="default" variant="underlined"
                            placeholder="weight" label="Weight" bg-color="white" clearable ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field v-model="form.quantity" density="default" variant="underlined"
                            placeholder="quantity" label="Quantity" bg-color="white" clearable ></v-text-field>
            </v-col>

            <v-col cols="4">
              <AdviceCode
                  v-model="form.advice_id"
              >

              </AdviceCode>
            </v-col>
          </v-row>
         </v-form>
      </template>

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
import {computed, getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {toast} from "vue3-toastify";
import {useStore} from "vuex";
import {toLower} from "lodash";
import {v4 as uuidv4} from "uuid";
import API from "../api";
import AdviceCode from "@/components/picker/AdviceCode.vue";
import { tr } from "date-fns/locale";
import DictCode from "@/components/picker/DictCode.vue";
import Status from "@/components/picker/DictCode.vue";
import Location from "../../../components/picker/Location.vue";
import { map } from "jquery";


const {proxy} = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableHeaders = ref([
  {title: "Code", key: "code", sortable: false, minWidth: 150},
  {title: "Order Number", key: "order.order_code", value: (item) => item?.order?.order_code, sortable: false},
  {title: "Customer", key: "order.customer_short_name", value: (item) => item?.order?.customer_short_name, sortable: false},
  {title: "Quality Code", key: "order_item.quality_code", value: (item) => item?.order_item?.quality_code, sortable: false},
  {
    title: "Line Item Number",
    key: "order_item.line_item_code",
    value: (item) => item?.order_item?.line_item_code,
    minWidth: 120,
    sortable: false
  },
  {title: "ProductType Code", key: "product_type.code", value: (item) => item.product_type?.code, sortable: true,},
  {title: "Length_mm", key: "length_mm", sortable: false},
  {title: "Weight", key: "estimated_weight_kg", sortable: false},
]);
const tableList = ref([]);
const loading = ref(false);

const store = useStore();
const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));


const data = reactive({
  handle_type: "retrieve",
  area: undefined,
  form: {
    comment: undefined,
    is_generate_new: false,
    code: undefined,
    length_mm: undefined,
    estimated_weight_kg: undefined,
    quantity: undefined,
    advice_id: undefined,
    stock_type: undefined,
    status: undefined,
    area_id: undefined
  },
  rules: {
    code: [
      (value) => {
        if (value) return true;
        return "Code is required.";
      },
    ],
    area_id: [
      (value) => {
        if (value) return true;
        return "Area is required.";
      },
    ]
  },
});

const {area, form, rules} = toRefs(data);

const handleShow = (data) => {
  if (data.length === 1) {
    form.value.stock_type = data[0].stock_type;
    form.value.area_id = data[0].area?.id;
    form.value.status = data[0].status;
    area.value = data[0].area;
  }
  visible.value = true;
  tableList.value = data;
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
  loading.value = true;
  const params = toRaw(form.value);
  try {
    if (data.handle_type === "retrieve") {
      await API.updateRetrieve({
        finished_ids: tableList.value.map((item) => item.id),
        comment: params.comment,
      });
    } else {
      if (tableList.value.length > 1) {
        toast.error("Only one item can be returned at a time", { autoClose: 60000 });
        return;
      }
      await API.updateReturn({
        id: tableList.value.map((item) => item.id)[0],
        quantity: params.quantity,
        length_mm: params.length_mm,
        estimated_weight_kg: params.estimated_weight_kg,
        advice_id: params.advice_id,
        is_generate_new: params.is_generate_new,
        code: params.code,
        stock_type: params.stock_type,
        status: params.status,
        area_id: params.area_id
      });
    }
    handleClose();
    emit("refresh");
    toast.success("Success ", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error("Fail " +(res?.response?.data?.detail  || '', { autoClose: 60000 }), {
      position: "bottom-center",
    });
  } finally {
    loading.value = false;
  }
};

defineExpose({
  handleShow,
});


function Title(str) {
  if (!str) return ''; // 处理空字符串
  return str.charAt(0).toUpperCase() + str.slice(1);
}

watch(
  () => tableList.value,
  (newValue) => {

    if (newValue.length === 1) {
      form.value.length_mm = newValue[0]?.length_mm || ''; 
      form.value.estimated_weight_kg = newValue[0]?.estimated_weight_kg || ''; 
      form.value.quantity = newValue[0]?.order_item?.quantity || '';
      
    }
  },
  { immediate: true } 
);
</script>
<style lang="scss" scoped>
</style>
