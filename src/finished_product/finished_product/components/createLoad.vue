<template>
  <v-dialog
      v-model="visible"
      max-width="60%"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Create Load"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Load Details</div>
      <div class="flex-wrap justify-start ga-2 pa-4">
        <v-row>
          <v-col cols="2">
            <v-text-field v-model="form.total_weight" disabled density="default" variant="underlined"
                          placeholder="Total Weight(Tonnes)" label="Total Weight(Tonnes)" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.max_length" disabled density="default" variant="underlined"
                          placeholder="Max Length(m)" label="Max Length(m)" bg-color="white" clearable></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <!-- <v-col cols="2">
            <dict-code
              v-model="form.transport_type"
              :hide-details="false"
              bg-color="white"
              density="default"
              variant="underlined"
              color="#333"
              label="Transport Type"
              code="transport_type"
          />
          </v-col> -->
          <v-col cols="3">
              <TransportCode
                  v-model="form.transport_id"
                  label="Transport No"
                  @change="handleItemChange($event, 'transport_id')"
              />
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.load_no" density="default" variant="underlined"
                          placeholder="Load No." label="Load No." bg-color="white" clearable disabled></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.comment" density="default" variant="underlined"
                          placeholder="Comment" label="Comment" bg-color="white" clearable></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.transport_length" density="default" variant="underlined"
                          placeholder="Transport Length(m)" label="Transport Length(m)" bg-color="white" clearable disabled></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="form.transport_weight" density="default" variant="underlined"
                          placeholder="Transport Weight(Tonnes)" label="Transport Weight(Tonnes)" bg-color="white" clearable disabled></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="pl-4 pr-4">
        <v-card class="mt-6" elevation="0" variant="outlined">
          <v-data-table
              :headers="tableHeaders"
              :items="tableList"
              density="default"
              max-height="100"
              :items-per-page="-1"
          >
            <template #bottom>
            </template>
          </v-data-table>
        </v-card>
        <v-row align="center">
          <v-col cols="6">
            <v-checkbox v-model="form.is_print" label="Print" density="comfortable" hide-details></v-checkbox>
            <v-checkbox v-model="form.is_carry_out" label="Auto Carry Out" density="comfortable" hide-details></v-checkbox>
            <v-checkbox v-model="form.is_generate_advice" label="Create Consignment" density="comfortable" hide-details v-if="defaultMillCode == 'srsm'"></v-checkbox>
          </v-col>
        </v-row>
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
            :disabled="isConfirmDisabled"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch, computed} from "vue";
import {toast} from "vue3-toastify";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {map, toLower} from "lodash";
import StockType from "./picker/StockType.vue";
import SiteType from "./picker/SiteType.vue";
import Site from "./picker/Site.vue";
import Area from "./picker/Area.vue";
import API from "../api";
import TransportCode from "./picker/TransportCode.vue";
import DictCode from "@/components/picker/DictCode.vue";

const store = useStore();
const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));
const router = useRouter();
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const tableHeaders = ref([
  // { title: "Action", key: "action", width: 200, fixed: true, sortable: false, align:"center" },
  { title: "Bundle No.", key: "code", sortable: true },
  { title: "No.of Bars", key: "quantity", sortable: true, minWidth: 200},
  { title: "Cal Weight(Tonnes)", key: "calulated_weight", sortable: true },
  { title: "Length(m)", key: "length_mm", sortable: true },
]);
const tableList = ref([]);
const selected = ref([]);
const total = ref(0);
const isGenerateAdviceDisabled = ref(true);
const isConfirmDisabled = ref(false);

const data = reactive({
  form: {
    total_weight: undefined,
    max_length: undefined,
    transport_type: undefined,
    transport_id: undefined,
    transport: undefined,
    load_no: undefined,
    cal_weight: undefined,
    length: undefined,
    comment: undefined,
    is_generate_load: true,
    is_generate_advice: false,
    is_print: false,
    is_carry_out:false,
    ids:[],
    transport_length: undefined,
    transport_weight: undefined,
  },
  rules: {
  }
});

const { form, rules, queryParams } = toRefs(data);

const handleShow = (data, maxID) => {
  form.value.load_no = String(maxID + 1);
  
  // 处理数组
  form.value.ids = map(data, (item) => item.id);
  form.value.max_length = Math.max(...map(data, (item) => item.length_mm / 1000));
  tableList.value = data || [];
  form.value.total_weight = tableList.value.reduce((accumulator, item) => {
  const estimated_weight_kg = item.estimated_weight_kg / 1000;
  return typeof estimated_weight_kg === 'number' && !isNaN(estimated_weight_kg) ? accumulator + estimated_weight_kg : accumulator;
  }, 0);

    // 判断是否禁用新增advice复选框
  isGenerateAdviceDisabled.value = data.some(item => 
      (item.order_item_id === null)
    // !(item.exist_flag === null || item.exist_flag === 'N') || 
    // !(item.rework_status === null || item.rework_status === 'Complete')
  );

  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    total_weight: undefined,
    max_length: undefined,
    transport_type: undefined,
    transport_id: undefined,
    transport: undefined,
    load_no: undefined,
    cal_weight: undefined,
    length: undefined,
    comment: undefined,
    is_generate_load: true,
    is_generate_advice: false,
    is_print: false,
    is_carry_out:false,
    transport_length: undefined,
    transport_weight: undefined,
  };
  nextTick(() => {
    // proxy.$refs["moveForm"].resetValidation();
  })
}

const handleSave = async () => {
  // const {valid} = await proxy.$refs["moveForm"].validate();
  // if (!valid) {
  //   return;
  // }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    const res = await API.createLoad(params);
    emit("refresh");
    handleClose();
    toast.success("Create Load Success", {
      position: "bottom-center",
      onClose: () => router.push({ path: "/finished_product_load_detail", query: { load_id: res.data?.id, print: params.is_print ? "yes" : "no" } }),
    });
  } catch (res) {
    toast.error(res.response.data?.detail ||"Create Load Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleItemChange = (item, key) => {
  if (key === "transport_id"){
    form.value[`${key}`] = item.id;
    form.value.transport = item;
  }else{
    form.value[`${key}`] = item.id;
  }
}

defineExpose({
  handleShow,
});

watch(
  () => form.value.transport_id,
  (value) => {
    if (value){
      form.value.transport_length = (form.value?.transport?.length_mm / 1000) || 0;
      form.value.transport_weight = (form.value?.transport?.weight_kg / 1000) || 0;
      if (form.value.transport_length < form.value.max_length || form.value.transport_weight < form.value.total_weight){
        isConfirmDisabled.value = true;
      }
    }else{
      form.value.transport_length = undefined;
      form.value.transport_weight = undefined;
      isConfirmDisabled.value = false;
    }
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss" scoped>
</style>
