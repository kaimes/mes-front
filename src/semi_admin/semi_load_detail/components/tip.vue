<template>
  <v-dialog
      v-model="visible"
      max-width="650"
      :close-on-back="false"
      persistent
  >
    <v-card
        :title="$t('semi_load.tip_button.load_tip')"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">{{$t('semi_load.tip_button.list_of_selected')}}</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <v-chip v-for="item in form.code">
          {{ item }}
        </v-chip>
       
      </div>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">{{$t('semi_load.tip_button.cast_code')}}</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <router-link class="d-flex align-center text-decoration-none grey-darken-4" 
            v-for="item in casts"
            :to="{ name: 'CastChemicalDetail', query: { id: item.cast_id } }"
            tag="a" target="_blank"
            :style="{ color: item.isable_tip ? 'green' : 'red' }"
          >
          <v-chip>{{ item.cast_code }}</v-chip>
        </router-link>
      </div>
      <div class="pa-4 border ma-4">
        <v-form ref="TipSemiRef">
          <v-row>
            <v-col cols="6">
              
              <AreaCode v-model="form.area_id" type="semi" :label="$t('semi_load.tip_button.location')" :rules="rules.area_code" @change="handleItemChange($event, 'area_id')" />
            </v-col>
            <col cols="6">
              <v-checkbox 
                v-if="showWarningTips"
                v-model="isForceTip" 
                :label="$t('semi_load.tip_button.risky_confirm_know_the_risks')" 
                class="ml-4 mr-4 mt-4 warning" 
                hide-details>
              </v-checkbox>
            </col>
          </v-row>
          <v-row>
            <col cols="6">
              <v-checkbox 
                v-model="form.is_overwrite" 
                :label="$t('semi_load.tip_button.overwrite')"
                class="ml-1 mr-4 mt-4" 
                hide-details>
              </v-checkbox>
            </col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="form.comment" density="default" variant="underlined"
                              placeholder="Comments" bg-color="white" clearable 
                              :label="$t('semi_load.tip_button.comments')"></v-textarea>

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
          {{$t('global.cancel')}}
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :loading="loading"
            @click="handleSave"
            :disabled="isConfirmDisabled"
        >
          {{$t('global.confirm')}}
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
import DictCode from "@/components/picker/DictCode.vue";
import { RouterLink } from "vue-router";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh', 'getData']);
const visible = ref(false);
const loading = ref(false);
const showArea = ref(false);
const isConfirmDisabled = ref(true);
const showWarningTips = ref(false);
const isForceTip = ref(false);

const data = reactive({
  form: {
    id: [],
    code: [],
    area_id: undefined,
    is_overwrite: false,
    comment: undefined
  },
  area:undefined,
  casts: [],
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
  casts
} = toRefs(data);

const message = ref('');


const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

const handleShow = (data, msg, castData) => {
  casts.value = castData;
  // 获取castData中的isable_tip
  const isableTipList = castData.map(item => item.isable_tip);
  // 如果所有的isable_tip都为true，则可以tip，取消confirm禁用状态
  if (isableTipList.every(Boolean)) {
    isConfirmDisabled.value = false;
    showWarningTips.value = false;
  } else {
    isConfirmDisabled.value = true;
    showWarningTips.value = true;
  }

  for (let key in data){

    form.value.id.push(data[key].id)
    form.value.code.push(data[key].vehicle_code)
    
  }

  if (data.length == 1){
    form.value.area_id = data[0]?.area?.code;
    area.value = data[0]?.area;
  }

  
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
    id: [],
    code: [],
    area_id: undefined,
    is_overwrite: false,
    comment: undefined
  };
  showArea.value = false;
  showWarningTips.value = false;
  isForceTip.value = false;
  nextTick(() => {
    proxy.$refs["TipSemiRef"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["TipSemiRef"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = {
    ids: form.value.id,
    to_area_id: form.value.area_id,
    is_overwrite: form.value.is_overwrite,
    comment: form.value.comment
  }
  
  
  try {
    await API.tipSemi(params);
    handleClose();
    emit("refresh");
    toast.success("Tip Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(`Tip Fail: ${res.response?.data?.detail}`, { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item?.id;
}


watch(() => showArea.value, (val) => {
  if (!val) {
    form.value.area_id = undefined; 
  }
})

watch(isForceTip, (val) => {
  if (val) {
    isConfirmDisabled.value = false;
  } else {
    isConfirmDisabled.value = true;
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
.warning {
  color: red;
  font-weight: bold;
}

// a {
//   color: inherit;
//   text-decoration: none;

//   &:visited {
//     color: inherit;
//   }

//   &:hover {
//     color: inherit;
//   }

//   &:active {
//     color: inherit;
//   }
// }
</style>
