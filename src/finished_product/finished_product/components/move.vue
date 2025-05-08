<template>
  <v-dialog
      v-model="visible"
      max-width="700"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Finished Product Move"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Move</div>
      <div class="d-flex flex-wrap justify-start ga-2 pa-4">
        <v-chip v-for="(item, index) in codemsg" :key="index">
          {{ item }}
        </v-chip>
      </div>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4">To</div>
      <div class="pa-4">
        <v-form ref="moveForm">
          <v-row align="center">
            <v-col cols="5">
              <Location v-model="form.area_code" label="Area" :rules="rules.area_code"  context="finished_product"/>
            </v-col>
            <v-col cols="3" class="mt-2">
              <v-checkbox
                  v-model="form.is_status_type"
                  label="Advanced ..."
                  v-if="defaultMillCode !== 'srsm'"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="3.5" v-if="defaultMillCode !== 'srsm'">
              <DictCode
                v-model="form.stock_type"
                bg-color="white"
                density="compact"
                variant="outlined"
                color="#333"
                label="Business Type"
                :code="`business_type#${defaultMillCode}`"
                v-if="form.is_status_type"
            />
            </v-col>
            <v-col cols="3.5" v-if="defaultMillCode !== 'srsm'">
              <Status
                v-model="form.status"
                bg-color="white"
                density="compact"
                variant="outlined"
                color="#333"
                label="Status"
                code="finished_product_status"
                v-if="form.is_status_type"
            />
            </v-col>
          </v-row>
          <!-- <v-row align="center">
            <v-col cols="6">
              <v-checkbox v-model="form.is_generate_consi" label="Generate Advice No." density="comfortable" hide-details></v-checkbox>
            </v-col>
          </v-row> -->
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
import {computed, getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {useStore} from "vuex";
import {toast} from "vue3-toastify";
import {map, toLower} from "lodash";
import StockType from "./picker/StockType.vue";
// import SiteType from "./picker/SiteType.vue";
// import Site from "./picker/Site.vue";
// import Area from "./picker/Area.vue";
import BusinessType from "../../../components/picker/BusinessType.vue";
import DictCode from "@/components/picker/DictCode.vue";
import Status from "@/components/picker/DictCode.vue";
import Location from "../../../components/picker/Location.vue";
import API from "../api";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);

const store = useStore();

const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));

const data = reactive({
  form: {
    codes: [],
    stock_type: 'internal',
    // site_type_code: undefined,
    // site_code: undefined,
    area_code: undefined,
    // is_generate_consi: false,
    status: undefined,
    is_status_type: false,
  },
  codemsg: undefined,
  rules: {
    stock_type: [
      value => {
        if (value) return true
        return 'Stock type is required.'
      }
    ],
    // site_type_code: [
    //   value => {
    //     if (value) return true
    //     return 'Location 1 is required.'
    //   }
    // ],
    // site_code: [
    //   value => {
    //     if (value) return true
    //     return 'Location 2 is required.'
    //   }
    // ],
    area_code: [
      value => {
        if (value) return true
        return 'Location 3 is required.'
      }
    ],
    status: [
      value => {
        if (value) return true
        return 'status is required.'
      }
    ],
  }
});

const { form, rules, codemsg } = toRefs(data);

const handleShow = (data) => {

  // 处理数组
  // form.value.codes = map(data, (item) => item.code);
  // codemsg.value = data.map(item =>  `${item.code}(${item.stock_type || ''}, ${item.area?.code || ''})`);
  
  codemsg.value = data.map(item => {
  const stockType = item.stock_type ? item.stock_type : '';
  const areaCode = item.area?.code ? item.area.code : '';
  const status = item.status ? item.status : '';
  
  // 如果两者都为空，可以返回空字符串，否则返回带有字段的内容
  if (!stockType && !areaCode && !status) return `${item.code}`;  // 如果两者为空，则只显示 code
  if (!stockType) {
    if (!areaCode) return `${item.code}(${status})`;  
    if (!status) return `${item.code}(${areaCode})`;  
    return `${item.code}(${areaCode}, ${status})`;   
  }
  if (!areaCode) {
    if (!status) return `${item.code}(${stockType})`; 
    return `${item.code}(${stockType}, ${status})`; 
  }
  if (!status) return `${item.code}(${stockType}, ${areaCode})`;
  return `${item.code}(${stockType}, ${areaCode}, ${status})`;
});
  form.value.codes = map(data, (item) => item.code);

  if (data.length === 1) {    
    form.value.stock_type = data[0]?.stock_type;
    form.value.area_code = data[0]?.area?.id;
    form.value.status = data[0]?.status;
  }
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    codes: [],
    stock_type: undefined,
    // site_type_code: undefined,
    // site_code: undefined,
    area_code: undefined,
    // is_generate_consi: false,
    status: undefined,
    is_status_type: false,
  };
  nextTick(() => {
    proxy.$refs["moveForm"].resetValidation();
  })
}

// const handleAreaChange = (item) => {
//   if (!form.value.site_code && !form.value.site_type_code) {
//     API.getSiteByArea(item).then((res) => {
//       const {site_code, site_type_code } = res.data;
//       if (site_code && site_type_code) {
//         form.value.site_code = site_code;
//         form.value.site_type_code = site_type_code;
//       }
//     });
//   }
// }

const handleSave = async () => {
  const {valid} = await proxy.$refs["moveForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.move(params);
    handleClose();
    emit("refresh");
    toast.success("Move Success", {
      position: "bottom-center"
    });
  } catch (res) {
    // toast.error("Move Fail", {
    //   position: "bottom-center"
    // }, { autoClose: 60000 });
    toast.error(`Move Fail: ${res.response?.data?.detail?.msg}`, { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
