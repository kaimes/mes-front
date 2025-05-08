<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Advice Tip"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">List of Selected</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <v-row>
          <v-col>
            <v-chip v-for="advice_code in form.advice_codes" :key="advice_code">
              {{ advice_code }}
            </v-chip>
          </v-col>
          <v-col>
            <v-chip v-if="message">
              {{message}}
            </v-chip>
          </v-col>
        </v-row>
      </div>
      <div class="pa-4 border ma-4">
        <v-form ref="tipFormRef">
          <v-row>
            <!-- <v-col cols="4">
              <dict-code
                v-model="form.business_type"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Business Type"
                code="business_type"
                disabled
            />
            </v-col> -->
            <v-col cols="4">
                <v-text-field v-model="form.business_type" density="default" variant="underlined" placeholder="Transport Type"
                    bg-color="white" clearable disabled label="Business Type"></v-text-field>
            </v-col>
            <v-col cols="6">
              <Location v-model="form.area_id" label="Location" :rules="rules.area_code"  />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="form.comment" density="default" variant="underlined"
                              placeholder="Comments" bg-color="white" clearable 
                              label="Comments"></v-textarea>

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
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {toast} from "vue3-toastify";
import {map} from "lodash";
import AreaCode from "@/components/picker/AreaCode.vue";
import Location from "@/components/picker/Location.vue";
import API from "../api";
import moment from "moment/moment";
// import DictCode from "@/components/picker/DictCode.vue";
import DictCode from "../../../components/picker/BusinessType.vue";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const showArea = ref(false);

const data = reactive({
  form: {
    id: undefined,
    advice_codes: [],
    area_id: undefined,
    comment: undefined,
    business_type: undefined,
    advice_ids: [],
  },
  area: undefined,
  rules: {
    area_code: [
      value => {
        if (value) return true
        return 'Location 3 is required.'
      }
    ],
  },
});

const {
  form,
  rules,
  area,
} = toRefs(data);

const message = ref('');

const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

const handleShow = (data, msg) => {
  // 处理数组
  // form.value.advice_code = data.advice_code;
  // form.value.area_id = data.to_area?.code;
  // area.value = data.to_area;
  // form.value.id = data.id;
  form.value.business_type = data[0].business_type;
  form.value.advice_codes = map(data, 'advice_code');
  form.value.advice_ids = map(data, 'id');
  
  if (msg){
    message.value = msg
  }else{
    message.value = ''
  }
  
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    advice_codes: [],
    area_id: undefined,
    comment: undefined,
    advice_ids: [],
  };
  showArea.value = false;
  nextTick(() => {
    proxy.$refs["tipFormRef"].resetValidation();
  })
}
const handleSendTip = async () => {
    try {
        const params = toRaw(form.value);
        const ids = params.advice_ids;
        console.log('Before params:', params.advice_ids);

        for (const id of ids) {
            try {
                const res = await API.sendtip(id,  { action: "C" });
                toast.success(`Send Advice Message Success for ID: ${id}`, {
                    position: "bottom-center",
                    delay: 2000,
                });
            } catch (res) {
                toast.error(`Send Advice Message Fail for ID: ${id}: ${res.response?.data?.detail}`, { autoClose: 60000 });
            }
        }
    } catch (res) {
        toast.error(`Send Advice Message Fail: ${res.response?.data?.detail}`, { autoClose: 60000 });
    } finally {
        loading.value = false;
    }
}
const handleSave = async () => {
  const {valid} = await proxy.$refs["tipFormRef"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  // const params = toRaw(form.value);
  // if(params.area_id === area?.value?.code){
  //   params.area_id = area?.value?.id;
  // }

  // if (!params.area_id) {
  //   delete params.area_id;
  // }
  const params = toRaw(form.value);
  try {
    await API.save(params);
    emit("refresh");
    toast.success("Tip Success", {
      position: "bottom-center"
    });
    await handleSendTip(params)
    handleClose();
  } catch (res) {
    toast.error(`Tip Fail: ${res.response?.data?.detail}`, { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
}

watch(() => showArea.value, (val) => {
  if (!val) {
    form.value.area_id = undefined; 
  }
})


defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
.re-work-card {
  overflow-y: visible !important;
}
</style>
