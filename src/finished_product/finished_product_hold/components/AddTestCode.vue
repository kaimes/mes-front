<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Add Test Code"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
    >
      <div class="border ma-4 pa-4">
        <TestCode
            v-model="test_code"
            label="Test Code"
            :hide-details="false"
            @change="handleChange"
            item-title="testTitle"
        />
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
            :disabled="selections.length === 0"
            :loading="loading"
            @click="handleAddTestCode"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {map, findIndex} from "lodash";
import TestCode from "@/components/picker/multiple/TestCode.vue";
import {toast} from "vue3-toastify";
import API from "../api";


const {proxy} = getCurrentInstance();
const emit = defineEmits(['change']);
const visible = ref(false);
const loading = ref(false);
const selections = ref([]);

const data = reactive({
  test_code: [],
});

const {
  test_code,
} = toRefs(data);

const handleShow = (data, arr = []) => {
  selections.value = [...toRaw(arr)];
  // 处理数组
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    test_code.value = [];
    selections.value = [];
  })
}

const handleClear = (index) => {
  selections.value.splice(index, 1)
}



const handleAddTestCode = async () => {
  const items = toRaw(selections.value)
  const ids = items.map(item => item.id);
  
  const params = {
    "test_ids": ids
  }
  API.getTestResult(params).then(res => {
    emit('change', res.data.items);
    handleClose();
  }).catch(error => {
    toast.error(`${error.response.data.detail}`, {
      autoClose: 60000
    });
  })
  
}
const handleChange = (arr) => {
  selections.value = arr;
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
