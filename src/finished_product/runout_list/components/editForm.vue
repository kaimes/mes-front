<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Runout Detail"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <v-text-field
              v-model="form.runout_code"
              :rules="rules.runout_code"
              density="default"
              variant="underlined"
              label="Runout No"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.product_code"
              :rules="rules.product_code"
              density="default"
              variant="underlined"
              label="Product No"
              bg-color="white"
              required
              clearable
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12">
          <v-text-field
              v-model="form.runout_desc"
              density="default"
              variant="underlined"
              label="Runout Desc"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <v-col cols="6">
          <v-text-field
              v-model="form.cast_code"
              density="default"
              variant="underlined"
              label="Cast No"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.furnace_sequence_number"
              density="default"
              variant="underlined"
              label="Furnace Seq No"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.concast_code"
              density="default"
              variant="underlined"
              label="Concast Code"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.cold_length_mm"
              density="default"
              variant="underlined"
              label="Cold Length MM"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.quality_code"
              density="default"
              variant="underlined"
              label="Quality Code"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <v-col cols="6">
          <v-text-field
              v-model="form.shift_code"
              density="default"
              variant="underlined"
              label="Shift No"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.nose_crop_length_mm"
              density="default"
              variant="underlined"
              label="Nose Crop Length MM"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.tail_crop_length_mm"
              density="default"
              variant="underlined"
              label="Tail Crop Length MM"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.cutting_loss_length_mm"
              density="default"
              variant="underlined"
              label="Cutting Loss Length MM"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.scrap_number"
              density="default"
              variant="underlined"
              label="Scrap No"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <v-col cols="6">
          <v-text-field
              v-model="form.scrap_defect_reason_code"
              density="default"
              variant="underlined"
              label="Defect"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.scrap_length_mm"
              density="default"
              variant="underlined"
              label="Scrap Length MM"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.runout_cutting_date"
              density="default"
              variant="underlined"
              label="Runout Cutting Date"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.cut_count"
              density="default"
              variant="underlined"
              label="Cut Count"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.estimated_cold_length_mm"
              density="default"
              variant="underlined"
              label="Estimated Cold Length MM"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.nose_crop_flag"
              density="default"
              variant="underlined"
              label="Nose Crop Flag"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.tail_crop_flag"
              density="default"
              variant="underlined"
              label="Tail Crop Flag"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
        <!-- <v-col cols="6">
          <v-text-field
              v-model="form.cut_composition_count"
              density="default"
              variant="underlined"
              label="Cut Composition Count"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col> -->
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import API from "../api";

const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    // rolling_id: undefined,
    runout_code: undefined,
    product_code: undefined,
    // semi_id: undefined,
    cast_code: undefined,
    concast_code: undefined,
    cold_length_mm: undefined,
    quality_code: undefined,
    shift_code: undefined,
    nose_crop_length_mm: undefined,
    tail_crop_length_mm: undefined,
    cutting_loss_length_mm: undefined,
    scrap_number: undefined,
    scrap_defect_reason_code: undefined,
    scrap_length_mm: undefined,
    runout_cutting_date: undefined,
    cut_count: undefined,
    estimated_cold_length_mm: undefined,
    nose_crop_flag: undefined,
    tail_crop_flag: undefined,
    cut_composition_count: undefined,
    runout_desc: undefined,
  },
  rules: {
    runout_code: [
      value => {
        if (value) return true
        return 'Runout Code is required.'
      }
    ],
    product_code: [
      value => {
        if (value) return true
        return 'Product Code is required.'
      }
    ],
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const snackbar = inject('snackbar');

const handleShow = (data) => {
  if (data) {
    form.value = {
      id: data.id,
      // rolling_id: data.rolling_id,
      runout_code: data.runout_code,
      product_code: data.product_code,
      // semi_id: data.semi_id,
      furnace_sequence_number: data.furnace_sequence_number,
      cast_code: data.cast_code,
      concast_code: data.concast_code,
      cold_length_mm: data.cold_length_mm,
      quality_code: data.quality_code,
      shift_code: data.shift_code,
      nose_crop_length_mm: data.nose_crop_length_mm,
      tail_crop_length_mm: data.tail_crop_length_mm,
      cutting_loss_length_mm: data.cutting_loss_length_mm,
      scrap_number: data.scrap_number,
      scrap_defect_reason_code: data.scrap_defect_reason_code,
      scrap_length_mm: data.scrap_length_mm,
      runout_cutting_date: data.runout_cutting_date,
      cut_count: data.cut_count,
      estimated_cold_length_mm: data.estimated_cold_length_mm,
      nose_crop_flag: data.nose_crop_flag,
      tail_crop_flag: data.tail_crop_flag,
      cut_composition_count: data.cut_composition_count,
      runout_desc: data.runout_desc,
    };
  }
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    // rolling_id: undefined,
    runout_code: undefined,
    product_code: undefined,
    // semi_id: undefined,
    cast_code: undefined,
    concast_code: undefined,
    cold_length_mm: undefined,
    quality_code: undefined,
    shift_code: undefined,
    nose_crop_length_mm: undefined,
    tail_crop_length_mm: undefined,
    cutting_loss_length_mm: undefined,
    scrap_number: undefined,
    scrap_defect_reason_code: undefined,
    scrap_length_mm: undefined,
    runout_cutting_date: undefined,
    cut_count: undefined,
    estimated_cold_length_mm: undefined,
    nose_crop_flag: undefined,
    tail_crop_flag: undefined,
    cut_composition_count: undefined,
    runout_desc: undefined,
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
    proxy.$refs["editForm"].reset();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    snackbar.showSnack({
      text: params.id ? "Update Success" : "Create Success",
    });
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>