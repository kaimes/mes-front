<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Finished Product Rework Complete"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <div>
        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              Code
            </th>
            <th class="text-left">
              Rework Type
            </th>
            <th class="text-left">
              Rework Date
            </th>
            <th class="text-left">
              Area
            </th>
            <th class="text-left">
              Defect Reason
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in reworked_items"
              :key="item.id"
          >
            <td>{{ item.code }}</td>
            <td>{{ item.rework_type }}</td>
            <td>{{ item.rework_due_date }}</td>
            <td>{{ item.area.code }}</td>
            <td>{{ item.defect_reason_code }}</td>
          </tr>
          </tbody>
        </v-table>
      </div>
      <div class="pa-4 border ma-4">
        <v-form ref="reWorkForm">
          <v-row>
            <v-col cols="6">
              <v-text-field
                  v-model="formData.rework_initial"
                  density="default"
                  variant="underlined"
                  label="Operator Initial"
                  :rules="rules.rework_initial"
                  :disabled="formData.rework_status === 'Complete'"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="formData.rework_complete_comment"
                  density="default"
                  variant="underlined"
                  label="Remarks"
                  :rules="rules.rework_remarks"
                  :disabled="formData.rework_status === 'Complete'"
              ></v-text-field>
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
            @click="handleComplete"
        >
          Complete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import _, {map} from "lodash";
import API from "../api";
import moment from "moment/moment";
import TreeDictCode from "@/components/picker/TreeDictCode.vue";
import {formatCode, hasAtLeastLetters} from "@/util/util";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  reworked_items: [],
  formData: {},
  rules: {
    rework_initial: [
      value => {
        if (!hasAtLeastLetters(value)) return 'The Operator Initial must consist of at least 2 letters.';
        return true;
      }
    ],
    rework_remarks:[
      value => {
        if (!value) return 'The Remarks is required.';
        return true;
      }

    ]
  }
});

const {reworked_items, formData, rules} = toRefs(data);

const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

function handleError(error) {
  if (error.response) {
    toast.error(error.response.data?.detail, {autoClose: 60000})
  } else {
    console.log(error)
  }
  return false
}

const handleShow = (data) => {
  // 处理数组
  for (const current_item of data) {
    if (current_item.defect_reason){
      current_item.defect_reason_code = JSON.parse(JSON.stringify(formatCode(current_item.defect_reason.code, current_item.defect_reason.name)));
    }
    if (!current_item.area) {
      current_item.area = { "code": "" };
    }
    if (!current_item.defect_reason) {
      current_item.defect_reason = { "code": "" };
    }
  }
  reworked_items.value = data;
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  proxy.$refs["reWorkForm"].reset();
  visible.value = false;
}

const handleComplete = async () => {
  const {valid} = await proxy.$refs["reWorkForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;

  const params = {
    "ids": _.map(reworked_items.value, 'id'),
    "rework_status": "Complete",
    "rework_initial": formData.value.rework_initial,
    "rework_complete_comment": formData.value.rework_complete_comment
  };

  try {
    await API.reworkConfirm(params);
    handleClose();
    emit("refresh");
    toast.success("Rework Complete Success", {
      position: "bottom-center"
    });
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
.re-work-card {
  overflow-y: visible !important;
}
</style>
