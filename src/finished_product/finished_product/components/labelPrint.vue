<template>
  <v-dialog v-model="visible" max-width="650" :close-on-back="false" persistent>
    <v-card :title="Title(data.handle_type)">
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">List of Selected</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <v-chip v-for="item in tableList" :key="index">
          {{ item.code }}
        </v-chip>
      </div>
      <v-form ref="formRef">
      <v-col cols="12">
        <v-text-field
          v-model="form.printer"
          density="default"
          variant="underlined"
          label="Printer"
          bg-color="white"
          clearable
          hide-details="auto"
          @blur="handleInput('printer')"
          :rules="rules.printer"
        ></v-text-field>
      </v-col>
      
      <v-col cols="12">
        <v-text-field
          v-model="form.format"
          :density="default"
          variant="underlined"
          label="Format"
          bg-color="white"
          clearable
          hide-details="auto"
          @blur="handleInput('format')"
          :rules="rules.format"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="form.copies"
          density="default"
          variant="underlined"
          label="Copies"
          bg-color="white"
          clearable
          hide-details="auto"
          @blur="handleInput('copies')"
          :rules="rules.copies"
        ></v-text-field>
      </v-col>


      <v-col cols="12">
        <DictCode
          v-model="form.transaction_code"
          label="Function"
          bg-color="white"
          code="transaction_code"
          clearable
          hide-details="auto"
          :rules="rules.transaction_code"
        />
      </v-col>      
      
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
    </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs } from "vue";
import { toast } from "vue3-toastify";
import { v4 as uuidv4 } from "uuid";
import API from "../api";
import { format } from "date-fns";
import DictCode from "@/components/picker/DictCode.vue";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableList = ref([]);
const loading = ref(false);
const formRef = ref(null);

const data = reactive({
  handle_type: "Label Print",
  printer: '',
  format: '',
  copies: '',
  transaction_code: '',
  form: {},
  rules: {
    printer: [
      (value) => !!value || "Printer is required."
    ],
    format: [
      (value) => !!value || "Format is required."
    ],
    copies: [
      (value) => !!value || "Copies is required."
    ],
    transaction_code: [
      (value) => !!value || "Transaction Code is required."
    ]
  },
});

const { form, rules } = toRefs(data);

const handleShow = (data) => {
  visible.value = true;
  tableList.value = data;
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
  const { valid } = await formRef.value.validate(); 
  if (!valid) return; 
  loading.value = true;
  // console.log(tableList.value[0]);
  // console.log("other fields: " + form.value.printer + " " + form.value.format + " " + form.value.copies + " " + form.value.transaction_code);
  try {
    await API.LabelPrintPost({
      "finished_product_id": tableList.value[0].id,
      "printer": form.value.printer,
      "format": form.value.format,
      "copies": form.value.copies,
      "transaction_code": form.value.transaction_code
    });
    handleClose();
    emit("refresh");
    toast.success("Success ", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error("Fail " + (res?.response?.data?.detail || '', { autoClose: 60000 }), {
      position: "bottom-center",
    });
  } finally {
    loading.value = false;
  }
};

const handleInput = (field) => {
  switch (field) {
    case 'printer':
      form.value.printer = form.value.printer.padStart(2, '0').slice(0, 2);
      break;
    case 'format':
      form.value.format = form.value.format.padStart(8, '0').slice(0, 8);
      break;
    case 'copies':
      form.value.copies = form.value.copies.padStart(4, '0').slice(0, 4);
      break;
  }
};

defineExpose({
  handleShow,
});

function Title(str) {
  if (!str) return ''; // 处理空字符串
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style lang="scss" scoped>
</style>
