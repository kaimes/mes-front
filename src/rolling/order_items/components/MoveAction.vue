<template>
  <v-dialog
      v-model="visible"
      max-width="700"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Order item Move"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">
        Move
        <!-- <v-row class="d-flex justify-end">
            <span v-if="form.rolling_code && form.rolling_code.length > 0" class="ml-15" style="white-space: nowrap; font-weight: normal; font-size: 0.875rem;">
              ({{ form.rolling_code[0] }})
            </span>
        </v-row> -->
        <span v-if="form.rolling_code && form.rolling_code.length > 0" class="ml-15" style="white-space: nowrap; font-weight: normal; font-size: 0.875rem;">
          {{ form.rolling_code[0] != '' ? '('+form.rolling_code[0]+')' : '' }}
        </span> 
      </div>
      <div class="d-flex flex-wrap justify-start ga-2 pa-4">
        <v-chip v-for="(item, index) in form.order_number" :key="index">
          {{ item }}-{{ form.line_litem_number[index] }}
        </v-chip>
      </div>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4">To</div>
      <div class="pa-4">
        <v-form ref="moveForm">
          <v-row align="center">
            <v-col cols="5">
              <RollingCode
                v-model="form.new_rolling_code"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="RollingCode"
                @change="handleItemChange($event, 'rolling_id')"
                :error="isInvalid"
                :rules="rules.rolling_code_data"
                :hideDetails="false"
              />
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
            :disabled="isInvalid"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import {map} from "lodash";
import RollingCode from "@/components/picker/RollingCode.vue";
import API from "../api";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const isInvalid = ref(false);

const data = reactive({
  form: {
    ids: [],
    order_group_ids: [],
    order_number: [],
    line_litem_number: [],
    new_rolling_code: undefined,
    rolling_code_data: undefined,
    rolling_code: [],
  },
  codemsg: undefined,
  rules: {
    new_rolling_code: [
      value => {
        if (value) return true
        return 'Stock type is required.'
      }
    ],
    rolling_code_data: [
      (value) => {
        if (!value || form.value.rolling_code.length === 0) {
          return 'The RollingCode is empty, the move operation cannot be performed.';
        }
        const firstRollingCode = form.value.rolling_code[0];
        if (!form.value.rolling_code_data) {
          return 'The RollingCode is empty, the move operation cannot be performed.';
        }
        const newPrefix = getPrefix(form.value.rolling_code_data);
        const firstPrefix = getPrefix(firstRollingCode);

        if (newPrefix !== firstPrefix) {
          isInvalid.value = true;  
          return "The prefix of the new RollingCode must match the prefix of the selected RollingCode.";
        }
        isInvalid.value = false; 
        return true;
      }
    ],
  }
});

const { form, rules, codemsg } = toRefs(data);

const handleShow = (data) => {
  console.log('-=-=---=-');
  console.log(data);
  
  
  form.value.rolling_code = map(data, (item) => item.rolling_code) || [];
  form.value.order_number = map(data, (item) => item.order_code);
  form.value.line_litem_number = map(data, (item) => item.line_item_code);
  form.value.ids = map(data, (item) => item.id);
  form.value.order_group_ids = map(data, (item) => item.order_group_id);

  console.log(form.value.rolling_code);
  
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  isInvalid.value = false;
  form.value = {
    ids: [],
    new_rolling_code: undefined,
  };
  nextTick(() => {
    proxy.$refs["moveForm"].resetValidation();
  })
}

const handleItemChange = (item, key) => {
  form.value.rolling_code_data = item?.rolling_code;
}


const getPrefix = (rolling_code) => {
  const parts = rolling_code.split('-');
  return parts.slice(0, parts.length - 1).join('-');
};

const handleSave = async () => {
  const {valid} = await proxy.$refs["moveForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  console.log('params值', params);
  try {
    await API.move(params);
    handleClose();
    emit("refresh");
    toast.success("Move Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(`Move Fail: ${res.response?.data?.detail?.msg}`, { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
