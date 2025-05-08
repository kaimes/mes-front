<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        :title="$t('semi.rework_button.semi_rework')"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">{{$t('semi.rework_button.list_of_selected')}}</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <template v-for="item in reworking_items" :key="item.id">
          <v-chip v-if="item.rework_status === 'Rework'" color="primary">
            {{ item.semi_code }}
          </v-chip>
          <v-chip v-else-if="item.rework_status === 'Complete'" color="green">
            {{ item.semi_code }}
          </v-chip>
          <v-chip v-else>
            {{ item.semi_code }}
          </v-chip>
        </template>
      </div>
      <div class="pa-4 border ma-4">
        <v-form ref="moveForm">
          <v-row>
            <v-col cols="6">
              <DictCode
                v-model="form.rework_type"
                :rules="rules.rework_type"
                :label="$t('semi.rework_button.rework')"
                code="semi_rework_type"
                :hide-details = "false"
              />
            </v-col>
            <v-col cols="6" class="pt-5">
              <v-checkbox
                v-model="showArea"
                :label="$t('semi.rework_button.show_area')"
              ></v-checkbox>
            </v-col>
            <v-col cols="6" class="pt-5">
              <DefectReason
                    :label="$t('semi.rework_button.defect_reason')"
                    v-model="form.defect_reason_id"
                    variant="underlined"
                    density="comfortable"
                    :hide-details="false"
                    type="semi"
                />
            </v-col>
            <v-col cols="6">
              <AreaCode
                  v-model="form.area_id"
                  v-if="showArea"
                  :area="showAreaData"
                  @change="handleItemChange($event, 'area_id')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="form.rework_comment" density="default" variant="underlined"
                              placeholder="Remarks" bg-color="white" clearable 
                              :label="$t('semi.rework_button.remarks')"></v-textarea>

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
import API from "../api";
import moment from "moment/moment";
import DictCode from "@/components/picker/DictCode.vue";
import DefectReason from "@/components/picker/DefectReason.vue";


const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const showArea = ref(false);
const showAreaData = ref({});
const reworking_items = ref([]);

const data = reactive({
  form: {
    ids: [],
    rework_type: undefined,
    area_id: undefined,
    rework_comment: undefined,
    defect_reason_id: undefined,
  },
  rules: {
    rework_type: [
      value => {
        if (value) return true
        return 'Rework type is required.'
      }
    ],
  },
});

const {
  form,
  rules,
} = toRefs(data);

const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

const handleShow = (data) => {
  // 处理数组
  reworking_items.value = data;
  form.value.ids = map(data, (item) => item.id);
  if (reworking_items.value.length === 1) {
    form.value.rework_type = reworking_items.value[0].rework_type;
    form.value.area_id = reworking_items.value[0].area_id;
    if (form.value.area_id) {
      showAreaData.value = reworking_items.value[0].area || {};
      showArea.value = true;
    }
    form.value.defect_reason_id = reworking_items.value[0].defect_reason_id;
    form.value.rework_comment = reworking_items.value[0].rework_comment;
  }
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    ids: [],
    rework_type: undefined,
    area_id: undefined,
  };
  showArea.value = false;
  showAreaData.value = {};
  nextTick(() => {
    proxy.$refs["moveForm"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["moveForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  if (!params.area_id) {
    delete params.area_id;
  }
  try {
    await API.rework(params);
    handleClose();
    emit("refresh");
    toast.success("Rework Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error("Rework Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
  console.log(form.value[`${key}`])
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
