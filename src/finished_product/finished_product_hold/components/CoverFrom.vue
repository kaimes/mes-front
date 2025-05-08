<template>
    <v-dialog v-model="visible" max-width="600" :close-on-back="false" persistent>
      <v-card title="Bar Cover">
        <v-card-title class="text-h6">
            Are you sure you want to perform the batch cover operation?
      </v-card-title>
        <v-form ref="editForm">
          <v-row align="center" v-for="(item, index) in form.items" :key="item.key">
          </v-row>
        </v-form>
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
import { getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs } from "vue";
import { toast } from "vue3-toastify";
import { v4 as uuidv4 } from "uuid";
import { reject } from "lodash";
import API from "../api";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableList = ref([]);
const tests = ref([]);
const loading = ref(false);

const data = reactive({
  form: {
    runout_code1: undefined,
    runout_code2: undefined,
    order_id: undefined,
    order_item_id: undefined,
    advice_id: undefined,
    rolling_id: undefined,
    cast_id: undefined,
    items: [
      {
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      },
    ],
  },
  rules: {
    hold_id: [
      (value) => {
        if (value && value.code) {
          return true;
        }
        return "Cover Reason is required.";
      },
    ],
  },
});

const { form, rules } = toRefs(data);

const handleShow = (data, runout_code1, runout_code2, order_id, order_item_id, advice_id, rolling_id, test_ids, cast_id) => {
  form.runout_code1 = runout_code1;
  form.runout_code2 = runout_code2;
  form.order_id = order_id;
  form.order_item_id = order_item_id;
  form.advice_id = advice_id;
  form.rolling_id = rolling_id;
  form.cast_id = cast_id;
  visible.value = true;
  tableList.value = data;
  tests.value = test_ids || [];
  
};

const handleAddItem = () => {
  const { items } = toRaw(form.value);
  form.value.items = [
    ...items,
    {
      key: uuidv4(),
      hold_id: undefined,
      comment: undefined,
    },
  ];
};

const handleRemoveItem = (item) => {
  const { items } = toRaw(form.value);
  form.value.items = reject(items, { key: item.key });
};

const handleClose = () => {
  visible.value = false;
  form.value = {
    items: [
      {
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      },
    ],
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  });
};

const handleSave = async () => {
  const { valid } = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  const test_ids = tests.value.map((item) => item.test_id);
  try {
    const response = await API.batchCover({
      finished_ids: tableList.value.map((item) => item.id),
      hold_list: Object.values(params.items).map((cur) => cur.hold_id?.id),
      test_ids: test_ids,
    },
    {
      runout_code1: form.runout_code1,
      runout_code2: form.runout_code2,
      order_id: form.order_id,
      advice_id: form.advice_id,
      rolling_id: form.rolling_id,
      cast_id: form.cast_id,
    });
    handleClose();
    emit("refresh");
    const total_count = response.data.total_count
    const success_count = response.data.success_count
    const failure_count = response.data.failure_count
    toast.success(`Cover Success: A total of ${total_count} data were processed. ${success_count} succeeded, ${failure_count} failed.`, {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || "Cove Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

defineExpose({
  handleShow,
});
</script>

<style lang="scss" scoped>
</style>
