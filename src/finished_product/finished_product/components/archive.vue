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
      <template>
        <v-col cols="24">
          <v-textarea v-model="data.form.comment" label="" color="#333"
                      density="default" variant="solo" placeholder="Remarks"
                      bg-color="white">

          </v-textarea>
        </v-col>
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
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs,} from "vue";
import {toast} from "vue3-toastify";
import {v4 as uuidv4} from "uuid";
import API from "../api";
import AdviceCode from "@/components/picker/AdviceCode.vue";


const {proxy} = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableHeaders = ref([
  {title: "Code", key: "code", sortable: false},
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
  {title: "Length", key: "length_mm", sortable: false},
  {title: "Weight", key: "kg", sortable: false},
]);
const tableList = ref([]);
const loading = ref(false);


const data = reactive({
  handle_type: "archieve",
  form: {
    comment: undefined,
    is_generate_new: false,

    code: undefined,
    length: undefined,
    kg: undefined,
    quantity: undefined,
    advice_id: undefined,
  },
  rules: {
    code: [
      (value) => {
        if (value) return true;
        return "Code is required.";
      },
    ],
  },
});

const {form, rules} = toRefs(data);

const handleShow = (data) => {
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
      await API.updateArchieve({
        finished_ids: tableList.value.map((item) => item.id),
        comment: params.comment,
      });
    handleClose();
    emit("refresh");
    toast.success("Success ", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail  || 'Save Error', { autoClose: 60000 });
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

</script>
<style lang="scss" scoped>
</style>
