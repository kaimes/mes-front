<template>
  <FormDialog
      v-model="visible"
      :width="660"
      :title="form.id ? 'Update' : 'Add'"
      desc="Alternative Semi Size"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="6">
          <product-type-code
              v-model="form.product_type_id"
              :product_type="form.product_type"
              :hide-details="false" />
        </v-col>
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :hide-details="false" />
        </v-col>
        <v-col cols="6">
          <SemiSizeWidthThick 
              v-model="form.semi_size_id" 
              :semi_size="form.semi_size"
              :hide-details="false" 
              @change="handleSemiSizeChange"
          />
        </v-col>
        <v-col cols="6">
          <SemiSizeDetailLength v-model="form.opt_length"  :hide-details="false"  :semi_size_id="form.semi_size_id"  @change="handleSemiSizeDetailChange"/>
        </v-col>
        
      </v-row>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-row class="pt-6">
            <v-col cols="6">
              <v-text-field
                  v-model="form.order_over_tol"
                  density="default"
                  variant="underlined"
                  label="Order Over Tol(mm)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.order_under_tol"
                  density="default"
                  variant="underlined"
                  label="Order Under Tol(mm)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.stock_over_tol"
                  density="default"
                  variant="underlined"
                  label="Stock Over Tol(mm)"
                  bg-color="white"
                  clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.stock_under_tol"
                  density="default"
                  variant="underlined"
                  label="Stock Under Tol(mm)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
          
            <v-col cols="6">
              <v-text-field
                  v-model="form.weight"
                  density="default"
                  variant="underlined"
                  label="Weight(kg)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.max_length"
                  density="default"
                  variant="underlined"
                  label="Max Length(mm)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.min_length"
                  density="default"
                  variant="underlined"
                  label="Min Length(mm)"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.not_to_sched"
                  density="default"
                  variant="underlined"
                  label="Not To Sched"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.source"
                  density="default"
                  variant="underlined"
                  label="Source"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.semi_length"
                  density="default"
                  variant="underlined"
                  label="Semi Length"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.rank_seq"
                  density="default"
                  variant="underlined"
                  label="Rank Seq"
                  bg-color="white"
                  clearable
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {computed, getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import { toast } from "vue3-toastify";
import {Decimal} from 'decimal.js';
import FormDialog from "@/components/FormDialog.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import SemiSizeWidthThick from "@/components/picker/SemiSizeWidthThick.vue";
import SemiSizeDetailLength from "@/components/picker/SemiSizeDetailLength.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";

const visible = ref(false);
const tab = ref("one");
const loading = ref(false);
const data = reactive({
  form: {
    "id": undefined,
    "mill_id": undefined,
    "mill": undefined,
    "product_type_id": undefined,
    "product_type": undefined,
    "semi_size_id"  : undefined,
    "semi_size": undefined,
    "semi_width": undefined,     // 由semi size 带入
    "thickness": undefined,      //    
    "opt_length": undefined,     // 
    "weight": undefined,         // 
    "order_over_tol": undefined,
    "order_under_tol": undefined,
    "stock_over_tol": undefined,
    "stock_under_tol": undefined,
    "max_length": undefined,
    "min_length": undefined,
    "not_to_sched": undefined,
    "source": undefined,
    "semi_length": undefined,
    "runout_id": undefined,
    "rank_seq": undefined,
  },
  rules: {
    product_type_code: [
      value => {
        if (value) return true
        return 'ProductType Code is required.'
      }
    ],
    thick_from: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness From is required.'
      },
      value => {
        if (greaterThan(value, form.value.thick_to)) {
          return 'thickness from must be smaller than thickness to'
        }
        return true
      }
    ],
    thick_to: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness To is required.'
      },
      value => {
        if (greaterThan(form.value.thick_from, value)) {
          return 'thickness to must be greater than thickness from'
        }
        return true
      }
    ],
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleSemiSizeChange =(item) =>{
  // form.value.load=item;
  form.value.semi_width=item.width_mm;
  form.value.thickness=item.thick_mm;
  form.value.opt_length=null;
}
const handleSemiSizeDetailChange =(item) =>{
  // form.value.load=item;
  form.value.opt_length=item.length_mm;
  form.value.weight=item.standard_weight_t;
  form.value.min_length=item.min_length_mm;
  form.value.max_length=item.max_length_mm;

}


const handleShow = (data) => {
  if (data) {
    const value = toRaw(data);
    form.value = { ...value };
  } 
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    "id": undefined,
    "product_type_id": undefined,
    "product_type": undefined,
    "semi_size_id"  : undefined,
    "semi_size": undefined,
    "semi_width": undefined,     // 由semi size 带入
    "thickness": undefined,      //    
    "opt_length": undefined,     // 
    "weight": undefined,         // 
    "order_over_tol": undefined,
    "order_under_tol": undefined,
    "stock_over_tol": undefined,
    "stock_under_tol": undefined,
    "max_length": undefined,
    "min_length": undefined,
    "not_to_sched": undefined,
    "source": undefined,
    "semi_length": undefined,
    "rank_seq": undefined,
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  delete params.product_type;
  delete params.mill;

  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
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
