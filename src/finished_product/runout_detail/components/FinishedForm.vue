<template>
  <FormDialog
      v-model="visible"
      :width="700"
      :title="form.id ? 'Update' : 'Add'"
      desc="Finished Product"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">


      <v-row align="center" class="pt-6">

        <v-col cols="6">
          <RunoutCode v-model="form.runout_code" disabled variant="underlined" :hide-details="false"
                      @change="handleItemChange($event, 'runout_id')"></RunoutCode>
        </v-col>


        <v-col cols="6">
          <v-text-field
              type="number"
              v-model="form.repeat_num"
              :rules="rules.repeat_num"
              persistent-placeholder
              variant="underlined"
              label="Repeat Num"
              clearable
          ></v-text-field>
        </v-col>

        <v-divider></v-divider>
        <v-col cols="6">
          <v-text-field v-model="form.length_mm" :disabled="!save" density="default" variant="underlined"
                        placeholder="Length(mm)" label="Length(mm)" bg-color="white" clearable></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="form.estimated_weight_kg" :disabled="!save" density="default" variant="underlined"
                        placeholder="estimated_weight_kg" label="Weight (kg)" bg-color="white" clearable></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="form.quantity" type="number" color="#333" label="Quantity"
                        :disabled="!save" density="default" variant="underlined" placeholder="Quantity"
                        bg-color="white" clearable></v-text-field>
        </v-col>
        <v-col cols="6">
            <DictCode v-model="form.type" :disabled="!save" density="default" variant="underlined" :hide-details="false"
                          placeholder="Type" label="Type" bg-color="white" code="finished_product_type" clearable/>
        </v-col>
        <v-col cols="6">
            <DictCode
              v-model="form.status"
              :disabled="!save"
              density="default"
              variant="underlined"
              label="Status"
              code="finished_product_status"
              :hide-details="false"
            />
          </v-col>

        <v-col cols="6">
          <RollingCode v-model="form.rolling_code" :disabled="!save" density="default" variant="underlined"
                       :hide-details="false"
                       @change="handleItemChange($event, 'rolling_id')"></RollingCode>
        </v-col>

        <v-col cols="6">
          <CastCode label="Cast No" v-model="form.cast_code" variant="underlined" :disabled="!save"
                    :hide-details="false"
                    @change="handleItemChange($event, 'cast_id')"></CastCode>
        </v-col>

        <v-col cols="6">
          <ProductTypeCode v-model="form.product_type_id" :disabled="!save" variant="underlined"
                           :hide-details="false" />
        </v-col>

        <v-col cols="6">
          <SpecCode label="Spec Code" v-model="form.spec_code" variant="underlined" :disabled="!save"
                    density="default"
                    :hide-details="false" @change="handleItemChange($event, 'spec_id')"></SpecCode>
        </v-col>

        <v-col cols="6">
          <OrderCode v-model="form.order_code" :disabled="!save" variant="underlined" :hide-details="false"
                     @change="handleItemChange($event, 'order_id')"></OrderCode>
        </v-col>
        <v-col cols="6">
          <OrderItemCode v-model="form.order_item_code" :disabled="!save" variant="underlined" :hide-details="false"
                         :order_id="form.order_code"
                         @change="handleItemChange($event, 'order_item_id')"></OrderItemCode>
        </v-col>

        <v-col cols="6">
          <v-text-field v-model="form.sawn_by" :disabled="!save" density="default" variant="underlined"
                        placeholder="Sawn By" label="Sawn By" bg-color="white" clearable></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field v-model="form.pass_tests"  color="#333" label="Test Result"
                        :disabled="!save" density="default" variant="underlined" placeholder="PASS TESTS"
                        bg-color="white" clearable></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="form.location"  color="#333" label="Area Code"
                        :disabled="!save" density="default" variant="underlined" placeholder="Area Code"
                        bg-color="white" clearable></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="form.multed_with" type="number" color="#333" label="Mults"
                        :disabled="!save" density="default" variant="underlined" placeholder="Multed with"
                        bg-color="white" clearable></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field v-model="form.bundle" type="number" color="#333" :disabled="!save" density="default"
                        variant="underlined" placeholder="Bundle" bg-color="white" label="Number Of Bundle"
                        clearable></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="form.alt_spec" type="number" color="#333" label="Alterative Spec"
                        :disabled="!save" density="default" variant="underlined" placeholder="Alt Spec"
                        bg-color="white" clearable></v-text-field>
        </v-col>
      </v-row>


    </v-form>

  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "@/finished_product/finished_product/api";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import DictCode from "@/components/picker/DictCode.vue";

const commonStore = useCommonStore();
const visible = ref(false);
const tab = ref("one");
const loading = ref(false);


const save = ref(true)
const data = reactive({
  form: {
    id: undefined,
    code: undefined,
    cut_code: undefined,
    sawn_by: undefined,
    rolling_no: undefined,
    rolling_id: undefined,
    estimated_weight_kg: undefined,
    quantity: undefined,
    status: undefined,
    type: undefined,
    length_mm: undefined,
    cast_no: undefined,
    cast_id: undefined,
    spec_code: undefined,
    spec_id: undefined,
    pass_tests: undefined,
    location: undefined,
    multed_with: undefined,
    runout_id: undefined,
    order_no: undefined,
    order_id: undefined,
    item_no: undefined,
    item_id: undefined,
    onward: undefined,
    bundle: undefined,
    alt_spec: undefined,

    cast_code: undefined,
    runout_code: undefined,
    rolling_code: undefined,
    area_code: undefined,
    order_code: undefined,
    order_item_code: undefined,
    product_type_id: undefined
  },
  rules: {
    repeat_num: [
      value => {
        if (value) return true
        return 'Repeat Num is required.'
      },
      value => {
        if (isThanZero(value)) return true
        return 'Repeat Num must be greater than 0.'
      },
      value => {
        if (greaterThan(value, 26)) {
          return 'Repeat Num must be less than 26.'
        }
        return true
      }
    ],
  }
});

const {form, rules} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  console.log("show  ", data)
  if (data) {
    const value = toRaw(data);
    form.value = {...value};
  }
  visible.value = true;
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item?.id;
  console.log(form.value[`${key}`])
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    code: undefined,
    cut_code: undefined,
    sawn_by: undefined,
    rolling_no: undefined,
    rolling_id: undefined,
    estimated_weight_kg: undefined,
    quantity: undefined,
    status: undefined,
    type: undefined,
    length_mm: undefined,
    cast_no: undefined,
    cast_id: undefined,
    spec_code: undefined,
    spec_id: undefined,
    pass_tests: undefined,
    location: undefined,
    multed_with: undefined,
    runout_id: undefined,
    order_no: undefined,
    order_id: undefined,
    item_no: undefined,
    item_id: undefined,
    onward: undefined,
    bundle: undefined,
    alt_spec: undefined,

    cast_code: undefined,
    runout_code: undefined,
    rolling_code: undefined,
    area_code: undefined,
    order_code: undefined,
    order_item_code: undefined,
    product_type_id: undefined
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
  if (!params.id) {
    delete params.spec;
  }

  try {
    await API.createRepeat(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.data?.tip || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
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
