<template>
  <FormDialog
    v-model="visible"
    :width="550"
    :title="form.id ? 'Update' : 'Add'"
    desc="Product Size Details"
    :loading="loading"
    @close="handleClose"
    @save="handleSave"
    v-if="visible"
  >
    <v-form ref="editForm" v-if="visible">
      <v-row>
        <v-col cols="6">
          <MillCode
            v-model="form.mill_id"
            :mill="form.mill"
            :rules="rules.mill_id"
            :hide-details="false"
            :disabled="!isEditMode"
            @change="handleMillChange($event, 'mill_code')"
          />
        </v-col>


        <v-col cols="6">
          <v-text-field
            v-model="form.code"
            density="default"
            variant="underlined"
            label="Code"
            bg-color="white"
            :disabled="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.type"
            density="default"
            variant="underlined"
            label="Type"
            bg-color="white"
            :disabled="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.desc"
            density="default"
            variant="underlined"
            label="Desc"
            bg-color="white"
            :disabled="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.dim1"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            label="Dim1"
            bg-color="white"
            :disabled="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.dim2"
            density="default"
            variant="underlined"
            label="Dim2"
            bg-color="white"
            :disabled="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.product_code"
            density="default"
            variant="underlined"
            label="Product Code"
            bg-color="white"
            :disabled="!isEditMode"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.roll_ref_code"
            density="default"
            variant="underlined"
            label="Roll Ref Code"
            bg-color="white"
            :disabled="!isEditMode"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
            <ProductClassRolling v-model="form.product_class_id" :hide-details="false" :disabled="!isEditMode" @change="handleProductChange($event)"/>
          </v-col>
          <v-col cols="6">
            <ProductCategoryRolling
                v-model="form.product_category_id"
                :hide-details="false"
                label="Section Type"
                :disabled="!isEditMode"
                @change="handleProductCategoryCode($event)"
            ></ProductCategoryRolling>
          </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import API from "../api";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import useCommonStore from "@/app/common";
import MillCode from "@/components/picker/MillCode.vue";
import specApi from "@/spec_admin/spec/api";
import ProductClassRolling from "@/components/picker/ProductClassRolling.vue";
import ProductCategoryRolling from "@/components/picker/ProductCategoryRolling.vue";

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const isEditMode = ref(false);

const data = reactive({
  form: {
    id: undefined,
    mill_id: undefined,
    mill_code: undefined,
    mill: undefined,
    area_id: undefined,
    area: undefined,
    comment: undefined,
    status: undefined,
    cut_code: undefined,
    source: undefined,
    reason_code: undefined,
    updated_at: undefined,
    created_at: undefined,
    created_by: undefined,
    updated_by: undefined,
    product_class_id: undefined,
    product_category_id: undefined,
    product_class: undefined,
    product_category: undefined,
    product_class_code: undefined,
    product_category_code: undefined,
  },
  rules: {
    mill_id: [
      (value) => {
        if (value) return true;
        return "Mill is required.";
      },
    ],
  },
  inspectorOptions: [],
});

const {form, rules, inspectorOptions} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(["refresh"]);

const handleShow = (data) => {
  visible.value = true;
  isEditMode.value = !!data;
  if (data) {
    form.value = {
      id: data.id,
      mill_id: data.mill?.id,
      mill_code: data.mill?.code,
      mill: data.mill,
      code: data.code,
      type: data.type,
      desc: data.desc,
      dim1: data.dim1,
      dim2: data.dim2,
      product_code: data.product_code,
      roll_ref_code: data.roll_ref_code,
      product_class_id: data.product_class_id,
      product_category_id: data.product_category_id,
      product_class: data.product_class,
      product_category: data.product_category,
      product_class_code: data.product_class?.code,
      product_category_code: data.product_category?.code,
      updated_at: data.updated_at,
      updated_by: data.updated_by,
    };
  } else {
    form.value = {
      id: undefined,
      mill_id: undefined,
      mill_code: undefined,
      mill: undefined,
      code: undefined,
      type: undefined,
      desc: undefined,
      dim1: undefined,
      dim2: undefined,
      product_code: undefined,
      roll_ref_code: undefined,
      updated_at: undefined,
      updated_by: undefined,
      product_class_id: undefined,
      product_category_id: undefined,
      product_class: undefined,
      product_category: undefined,
      product_class_code: undefined,
      product_category_code: undefined,
    };
    isEditMode.value = true;
  }
};

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    mill_id: undefined,
    mill_code: undefined,
    mill: undefined,
    code: undefined,
    type: undefined,
    desc: undefined,
    dim1: undefined,
    dim2: undefined,
    product_code: undefined,
    roll_ref_code: undefined,
    product_class_id: undefined,
    product_category_id: undefined,
    product_class: undefined,
    product_category: undefined,
    product_class_code: undefined,
    product_category_code: undefined,
    updated_at: undefined,
    updated_by: undefined,
  };
};

const handleMillChange = (mill) => {

     if (mill){
       console.log('form.value.mill_code:', form.value.mill_code, 'Type:', typeof form.value.mill_code);
     form.value.mill_code = mill.code.split('-')[0];
   }};

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
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 500,
    });
  } catch (res) {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

const getinspectorSelect = () => {
  return specApi.getInspectorSelect()
      .then((res) => {
        const {status, data} = res;
        if (status === 200) {
          inspectorOptions.value = (data.options || []).map(item => ({
            ...item,
            desc: `${item.code}-${item.name}`
          }));
        } else {
          inspectorOptions.value = [];
        }
      });
};

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
};


const handleProductChange = (item) => {
  form.value.product_class_id = item?.id;
  form.value.product_class_code = item?.code;
}

const handleProductCategoryCode = (item) => {
  form.value.product_category_id = item?.id;
  form.value.product_category_code = item?.code;
}



defineExpose({
  handleShow,
});

getinspectorSelect();

watch(
    () => form,
    (value) => {

      const {product_class_code, product_category_code,code} = form.value;

      if (product_class_code && product_category_code) {
        const $product_size_code = `${product_class_code}-${product_category_code}`
        if ($product_size_code !== code) {
          form.value.code = $product_size_code;
        }
      }
    },
    {
      deep: true
    }
)
</script>

<style scoped>
</style>
