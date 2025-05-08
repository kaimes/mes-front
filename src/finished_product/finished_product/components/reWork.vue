<template>  
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Finished Product Rework"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">List of Selected</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <v-chip v-for="(item, index) in form.codes" :key="index">
          {{ item }}
        </v-chip>
      </div>
      <div class="pa-4 border ma-4">
        <v-form ref="moveForm">
          <v-row>
            <v-col cols="6">
              <TreeDictCode variant="underlined" :hide-details="false" :code="`rework_type#${toLower(form.defaultMillCode)}`" placeholder="Rework"
                            v-model="form.rework_type"
                            :rules="rules.rework_type"/>
            </v-col>
            <v-col cols="3" class="mt-2">
              <v-checkbox
                  v-model="showArea"
                  label="Move"
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <AreaCode
                  v-model="form.area_id"
                  v-if="showArea"
                  @change="handleItemChange($event, 'area_id')"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" v-if="isPatch">
              <DefectReason
                  v-model="form.defect_reason_id"
                  label="Defect Reason"
                  variant="underlined"
                  bg-color="white"
                  clearable
                  placeholder="Please select Defect Reason"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea v-model="form.rework_comment" density="default" variant="underlined"
                          placeholder="Remarks" bg-color="white" clearable
                          label="Remarks"></v-textarea>

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
import {computed, getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {toast} from "vue3-toastify";
import {map, toLower} from "lodash";
import AreaCode from "@/components/picker/AreaCode.vue";
import API from "../api";
import moment from "moment/moment";
import TreeDictCode from "@/components/picker/TreeDictCode.vue";
import DefectReason from "@/components/picker/DefectReason.vue";
import useCommonStore from "@/app/common";
import {join} from "lodash/array";

const {proxy} = getCurrentInstance();
const commonStore = useCommonStore();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const showArea = ref(false);


const findReworkTypeItems = (value) => {
  if (commonStore.dict?.['rework_type']) {
    const items = commonStore.dict['rework_type'].find(item => item.value === value)?.children;
    if (items) {
      return items.map(item => item.value);
    }
  }
  return [];
}

const PATCHING = computed(() => {
  return findReworkTypeItems('PATCHING');
})

const STRAIGHTENING = computed(() => {
  return findReworkTypeItems('STRAIGHTENING');
})

const isPatch = computed(() => {
  return form.value.rework_type.some(item => PATCHING.value.includes(item));
})


const data = reactive({
  form: {
    codes: [],
    ids: [],
    rework_type: [],
    area_id: undefined,
    rework_comment: undefined,
    defect_reason_id: undefined,
    defaultMillCode: undefined,
  },
  rules: {
    rework_type: [
      value => {
        if (value.length) return true
        return 'Rework type is required.'
      },
      value => {
        const intersection = value.filter(v => PATCHING.value.includes(v.value));
        if (intersection.length > 1) {
          return 'Only one PATCHING can be selected.'
        }
        const intersection2 = value.filter(v => STRAIGHTENING.value.includes(v.value));
        if (intersection2.length > 1) {
          return 'Only one STRAIGHTENING can be selected.'
        }
        return true
      }
    ],
  },
});

const {
  form,
  rules,
} = toRefs(data);


const findItemByValue = (its, value) => {
  for (const it of its) {
    if (it.value === value) {
      return it;
    }
    if (it.children) {
      const found = findItemByValue(it.children, value);
      if (found) {
        return found;
      }
    }
  }
  return null;
};


const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

const handleShow = (data, defaultMillCode) => {
  // 处理数组
  form.value.ids = map(data, (item) => item.id);
  form.value.codes = map(data, (item) => item.code);
  form.value.defaultMillCode = defaultMillCode;
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    codes: [],
    ids: [],
    rework_type: [],
    area_id: undefined,
    rework_comment: undefined,
    defect_reason_id: undefined,
  };
  showArea.value = false;
  isPatch.value = false;
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
  if (!params.defect_reason_id) {
    delete params.defect_reason_id;
  }
  if (params.rework_type.length) {
    params.rework_type = params.rework_type.join(",");
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
  form.value[`${key}`] = item?.id;
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
