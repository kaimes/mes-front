<template>
  <FormDialog
      v-model="visible"
      :width="1000"
      :title="form.id ? 'Update' : 'Add'"
      desc="Manual Semi End Use"
      :loading="loading"
      :show-force="true"
      @close="handleClose"
      @save="handleSave"
      @forceSave="handleForceSave"
      v-if="visible"
  >


    <v-form ref="editForm">
      <v-row>
        <v-col cols="4">
          <cast-code v-model="form.cast_id" :hide-details="false" :cast="form.cast" :rules="rules.cast_code" label="Cast Number" />
        </v-col>
        <v-col cols="4">
          <product-category-code v-model="form.product_category_id" :hide-details="false" :product_category="form.product_category" 
              :rules="rules.product_category_code" label="Section Size"
              @change="handleProductCategoryChange" />
        </v-col>
        <v-col cols="4">
          <MillCode v-model="form.mill_id" :hide-details="false" :rules="rules.mill_id" :default-mill="true" :mill="form.mill" />
        </v-col>
       </v-row>

       <template v-if="!form.id">

        <div class="d-flex flex-column">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-plus"
          @click="handleAddItem"
          class="mb-3 align-self-end"
        >
          Add
        </v-btn>
      </div>
     
      <div v-for="(item, index) in form.items" class="mult" :key="item.key" >
        <div class="mult-content pa-4 border rounded flex-grow-1">
          <v-row>
          <v-col cols="2">
            <WeightPickCode v-model="item.weight_min" 
               label="Weight Min" 
               :desc="false"
               :product_category_id="form.product_category_id"
               append-inner-icon=""
               prepend-inner-icon=""
               @change="handleWeightChange($event, item, 'weight_min')"
               item-value="dim3"
               :rules="[
                value => isThanZero(value) || 'Weight Min is required.',
                value => !greaterThan(value, item.weight_max) || 'weight min must be smaller than weight max'
              ]"
            />
          </v-col>

          <v-col cols="2">
            <WeightPickCode v-model="item.weight_max" 
               label="Weight Max" persistent-placeholder 
               :desc="true"
               :product_category_id="form.product_category_id"
               append-inner-icon=""
               prepend-inner-icon=""
               @change="handleWeightChange($event,item, 'weight_max')"
              item-value="dim3"
              :rules="[
                value => isThanZero(value) || 'Weight Max is required.',
                value => !greaterThan(item.weight_min, value) || 'weight max must be greater than weight min'
              ]"
            />
          </v-col>
          

          <v-col cols="3" class="d-flex align-center gap-2">
            <v-text-field
                v-model="item.flange_min"
                class="no-input-control "
                density="default"
                variant="underlined"
                label="Flange Min"
                bg-color="white"
                disabled
            />
            <v-text-field
                v-model="item.flange_max"
                class="no-input-control"
                density="default"
                variant="underlined"
                label="Flange Max"
                bg-color="white"
                disabled
            />
          </v-col>

          <v-col cols="3">
            <spec-code  v-model="item.spec_id"  :store="false" :hide-details="false" :spec="item.spec" :rules="rules.spec_code" @change="handleSpecCodeChange($event, item)" :disabled="!!form.id"  append-inner-icon=""/>
          </v-col>

          <v-col cols="2">
            <v-text-field
                v-model="item.short_name"
                variant="underlined"
                label="Short Name"
                bg-color="white"
                disabled
            ></v-text-field>
          </v-col>

          </v-row>
        </div>
        <div class="mult-action d-flex ga-2 align-center ml-2">
          <template v-if="form.items.length > 1">
            <v-btn density="comfortable" variant="outlined" icon="mdi-minus" @click="handleRemoveItem(item)"></v-btn>
          </template>
          
          <v-btn density="comfortable" variant="outlined" icon="mdi-dock-window" @click="handleCopyItem(item)"></v-btn>
        </div> 
     </div>
    </template>

    <template v-else>
      <v-row>
          <v-col cols="2">
            <WeightPickCode v-model="form.weight_min" :rules="rules.weight_min"  
            label="Weight Min"  :desc="false" 
            :product_category_id="form.product_category_id"
            append-inner-icon=""
            prepend-inner-icon=""
            @change="handleWeightChange($event,null, 'weight_min')"
            item-value="dim3"
            :product_type="product_type_min"
            />
          </v-col>

          <v-col cols="2">
            <WeightPickCode v-model="form.weight_max" :rules="rules.weight_max"  
            label="Weight Max"  :desc="true"
            :product_category_id="form.product_category_id"
            append-inner-icon=""
            prepend-inner-icon=""
            @change="handleWeightChange($event,null, 'weight_max')" 
            :product_type="product_type_max"
            item-value="dim3"/>
          </v-col>
          

          <v-col cols="3" class="d-flex align-center gap-2">
            <v-text-field
                v-model="form.flange_min"
                class="no-input-control "
                density="default"
                variant="underlined"
                label="Flang Min"
                bg-color="white"
                disabled
            />

            
            <v-text-field
                v-model="form.flange_max"
                class="no-input-control"
                density="default"
                variant="underlined"
                label="Flang Max"
                bg-color="white"
                disabled
            />
          </v-col>

          <v-col cols="3">
            <spec-code  v-model="form.spec_id"  :store="false" :hide-details="false" :spec="form.spec" :rules="rules.spec_code"  append-inner-icon=""/>
          </v-col>

          <v-col cols="2">
            <v-text-field
                v-model="form.short_name"
                variant="underlined"
                label="Short Name"
                bg-color="white"
                disabled
            ></v-text-field>
          </v-col>

          </v-row>

    </template>


  </v-form>
  </FormDialog>
</template>
<script setup>
import {v4 as uuidv4} from 'uuid';
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {reject} from "lodash";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import FormDialog from "@/components/FormDialog.vue";
import {toast} from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import ProductCategoryCode from "@/components/picker/ProductCategoryCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
import WeightPickCode from "./WeightPickCode.vue";


const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);

const product_type_min = reactive({dim3: undefined});
const product_type_max = reactive({dim3: undefined});

const data = reactive({
  form: {
    id: undefined,
    cast_id: undefined,
    cast: undefined,
    product_category_id: undefined,
    product_category: undefined,
    mill_id: undefined,
    mill: undefined,

    weight_min: undefined,
    weight_max: undefined,
    flange_min: undefined,
    flange_max: undefined,
    spec_id: undefined,
    short_name: undefined,
    spec: undefined,
 
    items: [{
      weight_min: undefined,
      weight_max: undefined,
      short_name: undefined,
      key: uuidv4(),
      spec: undefined,
      flange_min: undefined,
      flange_max: undefined,
      spec_id: undefined,
    }]
  },
  rules: {
    weight_min: [
      value => {
        if (isThanZero(value)) return true
        return 'Weight Min is required.'
      },
      value => {
        if (greaterThan(value, form.value.weight_max)) {
          return 'weight min must be smaller than weight max'
        }
        return true
      }
    ],
    weight_max: [
      value => {
        if (isThanZero(value)) return true
        return 'Weight Max is required.'
      },
      value => {
        if (greaterThan(form.value.weight_min, value)) {
          return 'weight max to must be greater than weight min'
        }
        return true
      }
    ],
    spec_code: [
      value => {
        if (value) return true
        return 'Spec Code is required.'
      }
    ],
    cast_code: [
      value => {
        if (value) return true
        return 'Cast Number is required.'
      }
    ],
    product_category_code: [
      value => {
        if (value) return true
        return 'Section Size is required.'
      }
    ],
    mill_id: [
      value => {
        if (value) return true
        return 'Mill Code is required.'
      }
    ]
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleSpecCodeChange = (data, item) => {
  item.short_name = data?.short_name;
  item.spec = data;
}

const handleShow = (data) => {
  if (data) {
    form.value = {
      id: data.id,
      spec_id: data.spec_id,
      spec: data.spec,
      cast_id: data.cast_id,
      cast: data.cast,
      product_category_id: data.product_category_id,
      product_category: data.product_category,
      mill_id: data.mill_id,
      mill: data.mill,
      weight_min: data.weight_min,
      weight_max: data.weight_max,
      spec_code: data.spec_code,
      short_name: data.spec.short_name,
      items:[],
    };

    product_type_min.dim3 = data.weight_min;
    product_type_max.dim3 = data.weight_max;

  }
  form.force = false
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    spec_id: undefined,
    spec: undefined,
    cast_id: undefined,
    cast: undefined,
    product_category_id: undefined,
    product_category: undefined,
    mill_id: undefined,
    mill: undefined,
    weight_min: undefined,
    weight_max: undefined,
    spec_code: undefined,
    short_name: undefined,
    items:[
      {
        weight_min: undefined,
        weight_max: undefined,
        short_name: undefined,
        key: uuidv4(),
        spec: undefined,
        flange_min: undefined,
        flange_max: undefined,
        spec_id: undefined,
      }
    ],
  };
  // nextTick(() => {
  //   proxy.$refs["editForm"].resetValidation();
  // })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  // delete params.spec;
  if (!params.id) {
    delete params.spec;
  }
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
    });
  } catch (res) {
    window.res = res.response
    toast.error(res?.response?.data?.detail || res?.response?.data?.data?.tip|| params.id ? "Update Fail," + res?.response?.data?.detail : "Create Fail," + res?.response?.data?.detail, {
      autoClose: 60000,
      style: {
        width: 'max-content'
      }
    });
  } finally {
    loading.value = false;
  }
}

const handleForceSave = async () => {
  form.value.force = true
  await handleSave()
}

const handleAddItem = () => {
  form.value.items.push({
    key: uuidv4(),
    weight_min: undefined,
    weight_max: undefined,
    short_name: undefined,
    spec: undefined,
    flange_min: undefined,
    flange_max: undefined,
    spec_id: undefined,
  })
}

const handleRemoveItem = (item) => {
  const { items } = toRaw(form.value);
  form.value.items = reject(items, {key: item.key});
}

const handleCopyItem = (item) => {
  form.value.items.push({
    weight_min: item.weight_min,
    weight_max: item.weight_max,
    spec_id: item.spec_id,  // 重置 spec_id
    spec: item.spec,     // 重置 spec
    short_name: item.short_name, // 重置 short_name
    flange_min: item.flange_min,  // 重置 flange_min
    flange_max: item.flange_max,   // 重置 flange_max
    key: uuidv4(),
  })
}

const handleWeightChange = (event, item, type) => {
  if (type === 'weight_min') {
    console.log("event",event)
    if (item){
      item.flange_min = event?.flange_thickness;
    }else {
      form.value.flange_min = event?.flange_thickness;
    }

  } else if (type === 'weight_max') {
    if (item){
      item.flange_max = event?.flange_thickness;
    }else {
      form.value.flange_max = event?.flange_thickness;
    }
    
  }else{
    console.log("event",event, type)
  }
}

const handleProductCategoryChange = (event) => {
  form.value.items.forEach(item => {
    item.weight_min =undefined;
    item.weight_max = undefined;
    item.flange_min = undefined;
    item.flange_max = undefined;
  })
  form.value.weight_min = undefined;
  form.value.weight_max = undefined;
  form.value.flange_min = undefined;
  form.value.flange_max = undefined;
}

defineExpose({
  handleShow,
});

</script>
<style scoped>

.mult {
  display: flex;
  padding: 0 12px;
  margin-bottom: 12px;
  width: 100%;
  &-content {
    padding: 6px;
    min-width: 0;
  }
  &-action {
    padding-left: 6px;
    flex-shrink: 0; 
  }
}


</style>
