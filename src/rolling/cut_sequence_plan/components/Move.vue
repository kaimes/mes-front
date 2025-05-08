<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Move"
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
              <DictCode
                  v-model="form.saw_route"
                  :rules="rules.saw_route"
                  label="Saw Line"
                  code="cut_sequence_plan_saw_route"
                  :hide-details="false"
              />
            </v-col>
            <v-col cols="6">
              <!-- <v-text-field
                  v-model="form.new_seq"
                  label="New Seq"
                  density="default"
              ></v-text-field> -->
              <v-autocomplete
                v-model="form.move_to_id"
                label="New Seq"
                :items="newSeqOptions"
                item-title="title"
                item-value="value"
                clearable
                search
              ></v-autocomplete>
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
import API from "../api";
import moment from "moment/moment";
import DictCode from "@/components/picker/DictCode.vue";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const showArea = ref(false);

const data = reactive({
  form: {
    codes: [],
    ids: [],
    saw_route: undefined,
    move_to_id: undefined 
  },
  rules: {
    saw_route: [
      value => {
        if (value) return true
        return 'Saw Line is required.'
      }
    ],
  },
  newSeqOptionsMap: {},
  newSeqOptions: []
});

const {
  form,
  rules,
  newSeqOptionsMap,
  newSeqOptions
} = toRefs(data);

const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

const handleShow = (data, tableData) => {
  // 将tableData中数据按key分组，存储到newSeqOptions中
  // 遍历对象
  for (const key in tableData) {
    let options = [];
    // 获取当前key对应的数组
    const arr = tableData[key];
    // 遍历数组，将每个对象的id存储到newSeqOptions中
    arr.forEach((item) => {
      options.push({
        title: formatSawSeq(item, 'new_seq'),
        value: item.id
      });
    });
    newSeqOptionsMap.value[key] = options;
  }
  // 处理数组
  form.value.ids = map(data, (item) => item.id);
  form.value.codes = map(data, (item) => formatSawSeq(item, 'new_seq'));
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    codes: [],
    ids: [],
    saw_route: undefined,
    move_to_id: undefined
  };
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
  try {
    await API.move(params);
    handleClose();
    emit("refresh");
    toast.success("Move Success", {
      position: "bottom-center"
    });
  } catch (error) {
    toast.error(error?.response?.data?.detail  || "Move Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
  console.log(form.value[`${key}`])
}

const formatSawSeq = (item, key) => {
  return `${item.saw_route}` + item[key].toString().padStart(3, '0');
};


watch(() => form.value.saw_route, (newValue) => {
  form.value.move_to_id = undefined;
  if (newValue) {
    newSeqOptions.value = newSeqOptionsMap.value[newValue];
  } else {
    newSeqOptions.value = [];
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
