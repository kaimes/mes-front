<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Back to Mill"
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
            <v-col cols="12">
              <Location v-model="form.area_id" label="Location" :rules="rules.area_id"  />
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
import {map} from "lodash";
import AreaCode from "@/components/picker/AreaCode.vue";
import Location from "@/components/picker/Location.vue";
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
    ids: [],
    area_id: undefined,
  },
  rules: {
    area_id: [
      value => {
        if (value) return true
        return 'Area is required.'
      },
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
  form.value.ids = map(data, (item) => item.id);
  form.value.codes = map(data, (item) => item.advice_code);
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    ids: [],
    area_id: undefined,
  };
  nextTick(() => {
    proxy.$refs["moveForm"].resetValidation();
  })
}
const handleSendTip = async (params) => {
    try {
        const ids = params.ids;
        for (const id of ids) {
            try {
                const res = await API.sendtip(id,  { action: "D" });
                toast.success(`Send Advice Message Success for ID: ${id}`, {
                    position: "bottom-center",
                    delay: 2000,
                });
            } catch (res) {
                toast.error(`Send Advice D Message Fail for ID: ${id}: ${res.response?.data?.detail}`, { autoClose: 60000 });
            }
        }
    } catch (res) {
        toast.error(`Send Advice D Message Fail: ${res.response?.data?.detail}`, { autoClose: 60000 });
    } finally {
        loading.value = false;
    }
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["moveForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.return(params);
    emit("refresh");
    toast.success("Return Success", {
      position: "bottom-center"
    });
    await handleSendTip(toRaw(form.value))
    handleClose();
  } catch (res) {
    toast.error("Return Fail", { autoClose: 60000 });
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
