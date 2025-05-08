<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Semi Rework Complete"
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
            <td>{{ item.semi_code }}</td>
            <td>{{ item.rework_type }}</td>
            <td>{{ item.rework_due_date }}</td>
            <td>{{ item.area.code }}</td>
            <td>{{ item.defect_reason_code }}</td>
          </tr>
          </tbody>
        </v-table>
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
import {map} from "lodash";
import API from "../api";
import moment from "moment/moment";
import {formatCode} from "@/util/util";
import _ from "lodash"


const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  reworked_items: [],
});

const { reworked_items } = toRefs(data);

const formatDate = (res, key) => {
  if (res) {
    form.value[key] = moment(res).format("YYYY-MM-DD");
  }
}

function handleError(error) {
  if (error.response) {
      toast.error(error.response.data?.detail, { autoClose: 60000 })
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
  visible.value = false;
}

const handleComplete = async () => {
  loading.value = true;
  const params = { "ids": _.map(reworked_items.value, 'id') };
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
