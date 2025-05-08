<template>
  <v-container class="content" fluid>
    <v-form ref="productForm" @submit.prevent="handleSave">
      <div class="panel border">
        <div class="panel-action">
          <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
          <v-switch
              v-model="save"
              density="default"
              hide-details
              inset
          ></v-switch>
          <div class="ml-14">
            <v-btn type="submit" :disabled="!save" :loading="loading" variant="flat" color="primary">
              {{ form.id ? "Update" : "Save" }}
            </v-btn>
          </div>
        </div>
        <v-row align="center" class="pt-4">
          <v-col cols="4">
            <v-text-field
                v-model="form.code"
                :rules="rules.code"
                :disabled="!save"
                label="Code"
                placeholder="Please enter the code"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.skelp_code"
                :disabled="!save"
                label="Suffix Code"
                placeholder="Please enter the suffix code"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.quality_code"
                :disabled="!save"
                label="Quality Code"
                placeholder="Please enter the quality code"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <RunoutCode v-model="form.runout_id" :hide-details="false" />
          </v-col>
          <v-col cols="4">
            <RollingCode
                v-model="form.product_category_code"
                :hide-details="false"
                density="default"
                variant="underlined"
            ></RollingCode>
          </v-col>
          <v-col cols="4">
            <CastCode
                v-model="form.cast_id"
                :hide-details="false"
                density="default"
                variant="underlined"
            ></CastCode>
          </v-col>
          <v-col cols="4">
            <AreaCode
                v-model="form.area_id"
                :hide-details="false"
                density="default"
                variant="underlined"
            ></AreaCode>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.location"
                :disabled="!save"
                label="Location"
                placeholder="Please enter the location"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <VueDatePicker @update:model-value="formatDate">
              <template #trigger>
                <v-text-field
                    v-model="form.stock_in_date"
                    label="Stock in Date"
                    :disabled="!save"
                    placeholder="Please enter the stock in date"
                    clearable
                    readonly
                ></v-text-field>
              </template>
            </VueDatePicker>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.semi_code_1"
                :disabled="!save"
                label="Semi Code"
                placeholder="Please enter the semi code"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.semi_cut_seq"
                :disabled="!save"
                label="Semi Cut Seq"
                placeholder="Please enter the semi cut seq"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.product_type"
                :disabled="!save"
                label="Product Type"
                placeholder="Please enter the product type"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.width_mm"
                :disabled="!save"
                type="number"
                color="#333"
                label="Width"
                placeholder="Please enter the width"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.length_mm"
                :disabled="!save"
                type="number"
                color="#333"
                label="Length"
                placeholder="Please enter the length"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.thickness_mm"
                :disabled="!save"
                type="number"
                color="#333"
                label="Thickness"
                placeholder="Please enter the thickness"
                clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-form>
  </v-container>
</template>
<script name="finishedProductEdit" setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {includes, last} from "lodash";
import { toast } from "vue3-toastify";
import {useStore} from "vuex";
import moment from "moment";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import AreaCode from "@/components/picker/AreaCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import API from "./api";


const route = useRoute();
const store = useStore();
const router = useRouter();
const loading = ref(false);
const save = ref(true);

const {proxy} = getCurrentInstance();

const data = reactive({
  form: {
    id: undefined,
    "code": undefined,
    "runout_id": undefined,
    "rolling_id": undefined,
    "area_id": undefined,
    "cast_id": undefined,
    "location": undefined,
    "stock_in_date": undefined,
    "skelp_code": undefined,
    "semi_cut_seq": undefined,
    "semi_code_1": undefined,
    "product_type": undefined,
    "quality_code": undefined,
    "width_mm": undefined,
    "length_mm": undefined,
    "thickness_mm": undefined,
  },
  rules: {
    code: [
      value => {
        if (value) return true
        return 'Code is required.'
      }
    ],
  }
});

const {form, rules} = toRefs(data);

const formatDate = (res) => {
  if (res) {
    form.value.stock_in_date = moment(res).format("YYYY-MM-DD");
  }
}

const getDetailById = (id) => {
  API.getDetailById(id).then(res => {
    const { status, data } = res
    if (status === 200) {
      save.value = false;
      form.value = {
        id: data.id,
        mill_code: data.mill_code || "TBM",
        rolling_code: data.rolling_code,
        rolling_dim1: data.rolling_dim1,
        rolling_dim2: data.rolling_dim2,
        rolling_dim3: data.rolling_dim3,
        rolling_dim4: data.rolling_dim4,
        short_code: data.short_code,
        product_class_code: data.product_class_code,
        rolling_plan_code: data.rolling_plan_code,
        product_category_code: data.product_category_code,
        programmed_tonnage: data.programmed_tonnage,
        programmed_start_date: data.programmed_start_date ? moment(data.programmed_start_date).format("YYYY-MM-DD") : undefined,
        duration_minutes: data.duration_minutes,
        flex_form_data: data.flex_form_data,
      };
    } else {
      // TODO: 添加错误异常提示
    }
  });
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["productForm"].validate();
  if (!valid) {
    return;
  }
  const params = toRaw(form.value);
  loading.value = true;
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  }).catch(() => {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

const handleChoose = (item) => {
  getDetailById(item.id)
}

const resetForm = () => {
  proxy.$refs["productForm"].reset();
}

const resetValidation = () => {
  proxy.$refs["productForm"].resetValidation();
}

if (route.query.id) {
  // getDetailById(route.query.id)
}
</script>
<style lang="scss" scoped>
.content {
  .panel {
    background-color: #ffffff;
    padding: 16px;
    min-height: 400px;
    border-radius: 12px;
    &-action {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
