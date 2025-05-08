<template>
  <v-dialog v-model="visible" max-width="800" :close-on-back="false" persistent>
    <v-card>
      <v-card-title class="d-flex justify-between align-center">
        <span>
          Split
        </span>
        <span v-if="selectedCode" class="flex-grow-1 text-center">
          Bundle No. {{ selectedCode }}
        </span>
        <span v-if="selectedQualifiedQuantity !== undefined" class="ml-auto">
         Bars No. {{ selectedQualifiedQuantity || 0 }}
        </span>
      </v-card-title>
      <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-form ref="editForm">
          <v-row
            v-for="(item, index) in form.split"
            align="center"
            :key="item.key"
          >
            <v-col cols="4">
              <v-text-field
                v-model="item.code"
                density="default"
                variant="underlined"
                label="Bundle No."
                bg-color="white"
                clearable
                :rules="rules.code"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="item.bars"
                density="default"
                variant="underlined"
                label="Bars No."
                bg-color="white"
                clearable
                type="number"
                :min="0"
                :max="selectedQuantity"
                :rules="rules.bars"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <template v-if="index + 1 === form.split.length">
                <v-btn
                  density="comfortable" variant="outlined" flat
                  icon="mdi-plus"
                  @click="handleAddItem"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  density="comfortable" variant="outlined" flat
                  icon="mdi-minus"
                  @click="handleRemoveItem(item)"
                ></v-btn>
              </template>
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
          Split
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRaw,
  toRefs,
} from "vue";
import { toast } from "vue3-toastify";
import { v4 as uuidv4 } from "uuid";
import { reject } from "lodash";
import API from "../api";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);

const tableList = ref([]);
const loading = ref(false);
// 获取所有的菜单路由(包含权限)
let menuTree = localStorage.getItem("menuButtonPermission");
menuTree = JSON.parse(menuTree);

const data = reactive({
  form: {
    id: '',
    split: [
      {
        key: uuidv4(),
        code: '',
        bars: '',
      },
    ],
  },
  rules: {
    bars: [
      (value) => {
        if (!value) return 'Bars No. is required.';
        if (!Number.isInteger(Number(value))) return 'Bars No. must be an integer.';
        if (Number(value) > selectedQuantity.value) return `Bars No. cannot exceed ${selectedQuantity.value}.`;
        if (Number(value) <= 0) return 'Bars No. must be greater than 0.';

        return true;
      },
    ],
    code: [
      (value) => {
        if (!value) return 'Bundle No. is required.';
        return true;
      },
    ],
  },
  selectedCode: '',
  selectedQuantity: '',
  selectedQualifiedQuantity: '',
});

const { form, rules, selectedCode, selectedQuantity, selectedQualifiedQuantity } = toRefs(data);

const handleShow = (data) => {
  // console.log("Selected data:", data);
  // console.log("Selected data:", data[0].code);
  // console.log("Selected data:", data[0].quantity);

  visible.value = true;
  tableList.value = data;
  form.value.id = data[0].id;
  form.value.split = [
    {
      key: uuidv4(),
      code: '',
      bars: '',
    },
  ];
  selectedCode.value = data[0].code;
  selectedQuantity.value = data[0].quantity;
  selectedQualifiedQuantity.value = data[0].qualified_quantity;
};

const handleAddItem = () => {
  const { split } = toRaw(form.value);
  form.value.split = [
    ...split,
    {
      key: uuidv4(),
      code: '',
      bars: '',
    },
  ];
};

const handleRemoveItem = (item) => {
  const { split } = toRaw(form.value);
  form.value.split = reject(split, { key: item.key });
};

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: '',
    split: [
      {
        key: uuidv4(),
        code: '',
        bars: '',
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

  // 计算所有 bars 的总和
  const totalBars = form.value.split.reduce((sum, item) => sum + parseInt(item.bars, 10), 0);

  if (totalBars > selectedQuantity.value) {
    toast.error("Total Bars No. cannot exceed the selected quantity.", { autoClose: 60000 });
    return;
  }

  const codes = form.value.split.map(item => item.code);
  const uniqueCodes = new Set(codes);
  if (uniqueCodes.size === 1 && codes[0] !== '' && form.value.split.length > 1) {
    toast.error("Bundle No. cannot be the same for all entries.", { autoClose: 60000 });
    return;
  }

  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.updateSplit({
      id: params.id,
      split: params.split.map(item => ({
        code: item.code,
        bars: parseInt(item.bars, 10),
      })),
    });
    handleClose();
    emit("refresh");
    toast.success("Split Success", {
      position: "bottom-center",
    });
  } catch (res) {
    const detail = res.response?.data?.detail || 'An error occurred';
    toast.error(`Split Fail:
    ${detail}`, { autoClose: 60000 });
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
