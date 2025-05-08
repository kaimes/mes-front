<template>
  <v-dialog v-model="visible" max-width="700" :close-on-back="false" persistent>
    <v-card title="Combine" prepend-icon="mdi-alert-circle-outline">
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Combine</div>
      <div class="d-flex flex-wrap justify-start ga-2 pa-4">
        <v-chip v-for="(item, index) in form.codes" :key="index" @click="handleChipClick(item)">
          {{ item }}
        </v-chip>
      </div>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">To</div>
      <div class="pa-4">
        <v-form ref="combineFrom">
          <v-row align="center">
            <v-col cols="4">
              <v-text-field
                v-model="form.code"
                density="default"
                variant="underlined"
                bg-color="white"
                clearable
                label="New Bundle No."
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="text-none mr-4" color="#e3e3e3" variant="flat" @click="handleClose">
          Cancel
        </v-btn>
        <v-btn class="text-none" color="primary" variant="flat" :loading="loading" @click="handleSave">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs } from "vue";
import { toast } from "vue3-toastify";
import { map } from "lodash";
import API from "../api";
import { get } from "jquery";

const { proxy } = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  form: {
    id: undefined,
    codes: [],
    mill_id: undefined,
    code: undefined,
    runout_id: undefined,
    rolling_id: undefined,
    area_id: undefined,
    cast_id: undefined,
    sec_cast_id: undefined,
    location: undefined,
    stock_in_date: undefined,
    skelp_code: undefined,
    semi_cut_seq: undefined,
    semi_code_1: undefined,
    product_type_id: undefined,
    quality: undefined,
    quality_code: undefined,
    width_mm: undefined,
    kg: undefined,
    length_mm: undefined,
    thickness_mm: undefined,
    allocation_status: undefined,
    estimated_weight_kg: undefined,
    status: undefined,
    type: undefined,
    cut_code: undefined,
    spec_id: undefined,
  },
  rules: {
    code: [
      value => {
        if (!value) return 'No. is required.';
        if (!/\d/.test(value)) return 'Code must contain a number.';
        return true;
      }
    ],
    codes: [
      value => {
        if (value) return true;
        return 'Code is required.';
      }
    ],
  }
});

const { form, rules } = toRefs(data);

const handleShow = (data) => {
  form.value.codes = map(data, item => item.code);

  if (data && data.length > 0) {
    data.forEach(item => {
      if (item.quantity === null) {
        form.value.quality = 2;  
      }
    });
    data.sort((a, b) => b.quantity - a.quantity);
    const firstItem = data[0];
    const secondItem = data[1];
    form.value.runout_id = getCommonFieldValue(data, 'runout_id');
    form.value.rolling_id = getCommonFieldValue(data, 'rolling_id');
    form.value.area_id = getCommonFieldValue(data, 'area_id');
    form.value.mill_id = getCommonFieldValue(data, 'mill_id');
    form.value.status = getCommonFieldValue(data, 'status');
    form.value.location = getCommonFieldValue(data, 'location');
    form.value.stock_in_date = getCommonFieldValue(data, 'stock_in_date');
    form.value.skelp_code = getCommonFieldValue(data, 'skelp_code');
    form.value.semi_cut_seq = getCommonFieldValue(data, 'semi_cut_seq');
    form.value.semi_code_1 = getCommonFieldValue(data, 'semi_code_1');
    form.value.quality = getCommonFieldValue(data, 'quality');
    form.value.quality_code = getCommonFieldValue(data, 'quality_code');
    form.value.width_mm = getCommonFieldValue(data, 'width_mm');
    form.value.kg = getCommonFieldValue(data, 'kg');
    form.value.length_mm = getCommonFieldValue(data, 'length_mm');
    form.value.thickness_mm = getCommonFieldValue(data, 'thickness_mm');
    form.value.allocation_status = getCommonFieldValue(data, 'allocation_status');
    // form.value.allocated_order_item = getCommonFieldValue
    form.value.product_type_id = getCommonFieldValue(data, 'product_type_id');
    form.value.spec_id = getCommonFieldValue(data, 'spec_id');
    form.value.estimated_weight_kg = getCommonFieldValue(data, 'estimated_weight_kg');
    form.value.type = getCommonFieldValue(data, 'type');
    form.value.cut_code = firstItem.cut_code || '';
    if (firstItem.quantity === null && secondItem.quantity === null) {
      form.value.cast_id = firstItem.cast_id || undefined;
      form.value.sec_cast_id = secondItem.cast_id || undefined;
    } else if (firstItem.quantity !== secondItem.quantity) {
      form.value.cast_id = firstItem.cast_id || undefined;
      form.value.sec_cast_id = secondItem.cast_id || undefined;
    } else {
      form.value.cast_id = firstItem.cast_id || undefined;
      form.value.sec_cast_id = secondItem.cast_id || undefined;
    }
  }
  console.log("form.value", form.value.cast_id);

  nextTick(() => {
    visible.value = true;
  });
};

const getCommonFieldValue = (data, field) => {
  console.log("dadwadawdwta", data);
  const values = data.map(item => item[field]);
  const firstValue = values[0];
  return values.every(value => value === firstValue) ? firstValue : undefined;
};

const handleClose = () => {
  visible.value = false;
  form.value = { codes: [], code: undefined };
  nextTick(() => {
    proxy.$refs["combineFrom"].resetValidation();
  });
};

const handleSave = async () => {
  const params = toRaw(form.value);

  const isValid = proxy.$refs.combineFrom.validate();
  if (!isValid) return;

  loading.value = true;
  console.log("getCommonFieldwadwaddValue", params);

  try {
    await API.updateCombine(params);
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
    });
    handleClose();
    emit("refresh");

  } catch (error) {
    toast.error(params.id ? "Update Fail" : "Create Fail",{ autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

const handleChipClick = (item) => {
  form.value.code = item;
};

defineExpose({
  handleShow,
});
</script>

<style lang="scss" scoped>
</style>
