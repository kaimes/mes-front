<template>
  <FormDialog
    v-model="visible"
    :width="700"
    :title="form.id ? 'Update' : 'Add'"
    desc="Regrade Candidates"
    :loading="loading"
    @close="handleClose"
    @save="handleSave"
  >
    <v-form ref="editForm">
      <!-- 全局输入字段 -->
      <v-row class="pt-6">
        <v-col cols="6">
          <v-text-field
              v-model="form.t_result"
              density="default"
              variant="underlined"
              label="t_result"
              bg-color="white"
              :maxlength="1"
              :rules="[requiredNumber]"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.c_result"
              density="default"
              variant="underlined"
              label="c_result"
              bg-color="white"
              :maxlength="1"
              :rules="[requiredNumber]"
              required
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.comment"
            color="#333"
            label="Comment"
            :disabled="!save"
            density="default"
            variant="underlined"
            placeholder="Comment"
            bg-color="white"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Spec Code 列表 -->
      <div v-for="(spec, index) in form.specs" :key="index">
        <v-row align="center" class="pt-6">
          <v-col cols="10">
            <SpecCode
              label="Spec Code"
              v-model="spec.spec_code"
              variant="underlined"
              :disabled="!save"
              density="default"
              :hide-details="false"
              :rules="[() => isSpecCodeUnique(spec.spec_code, index)]"
              @change="handleSpecCodeChange($event, index)"
            ></SpecCode>
          </v-col>
          <v-col cols="2">
            <v-btn 
              v-if="form.specs.length > 1"
              @click="removeSpec(index)"
              icon="mdi-delete"
              variant="text"
              color="error"
            ></v-btn>
          </v-col>
        </v-row>
      </div>
    
      <v-row class="mt-2">
        <v-col cols="12">
          <v-btn @click="addSpec" prepend-icon="mdi-plus">Add Spec</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs } from "vue";
import { toast } from "vue3-toastify";
import FormDialog from "@/components/FormDialog.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import { greaterThan, isThanZero } from "@/util/util";
import API from "../api";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import { useRoute } from "vue-router";

// 新增的校验规则，确保输入是数字或为空
const requiredNumber = (value) => {
  // 处理输入值可能为字符串的情况
  if (typeof value === 'string') {
    value = parseInt(value, 10);
  }
  if (typeof value!== 'number' || isNaN(value)) {
    return 'Must be a number.';
  }
  const validNumbers = [3, 6, 7, 8, 9];
  if (!validNumbers.includes(value)) {
    return 'Value must be 3, 6, 7, 8, or 9.';
  }
  return true;
};

const commonStore = useCommonStore();
const visible = ref(false);
const tab = ref("one");
const loading = ref(false);
const route = useRoute();
const save = ref(true);
const data = reactive({
  form: {
    specs: [
      { 
        spec_code: undefined,
        spec_id: undefined
      }
    ],
    // 新增全局字段
    t_result: 9,  // 默认值为9
    c_result: 9,  // 默认值为9
    comment: undefined,
    id: undefined,
    code: undefined,
    cut_code: undefined,
    sawn_by: undefined,
    rolling_no: undefined,
    rolling_id: undefined,
    kg: undefined,
    length_mm: undefined,
    cast_no: undefined,
    cast_id: undefined,
    pass_tests: undefined,
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
    cover_end_use_id: undefined,
    order_item_code: undefined,
    product_type_id: undefined
  },
  rules: {
    repeat_num: [
      value => {
        if (value) return true;
        return 'Repeat Num is required.';
      },
      value => {
        if (isThanZero(value)) return true;
        return 'Repeat Num must be greater than 0.';
      },
      value => {
        if (greaterThan(value, 26)) {
          return 'Repeat Num must be less than 26.';
        }
        return true;
      }
    ]
  }
});
const { form, rules } = toRefs(data);
const { proxy } = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    const value = toRaw(data);
    // 如果已有数据，转换旧数据结构到新格式
    form.value = {
      ...value,
      t_result: value.t_result ?? 9,  // 默认值为9
      c_result: value.c_result ?? 9,  // 默认值为9
      comment: value.comment ?? undefined,
      specs: value.specs ? [...value.specs] : [{
        spec_code: value.spec_code,
        spec_id: value.spec_id
      }]
    };
  } else {
    form.value.specs = [{
      spec_code: undefined,
      spec_id: undefined
    }];
    form.value.t_result = 9;         // 默认值为9
    form.value.c_result = 9;         // 默认值为9
  }
  visible.value = true;
}

const handleSpecCodeChange = (item, index) => {
  form.value.specs[index].spec_id = item.id;
};

const addSpec = () => {
  form.value.specs.push({
    spec_code: '',
    spec_id: undefined
  });
};

const removeSpec = (index) => {
  form.value.specs.splice(index, 1);
};

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
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
    kg: undefined,
    length_mm: undefined,
    cast_no: undefined,
    cast_id: undefined,
    spec_code: undefined,
    spec_id: undefined,
    pass_tests: undefined,
    t_result: 9,                  // 默认值为9
    c_result: 9,                  // 默认值为9
    comment: undefined,
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
    cover_end_use_id: undefined,
    order_item_code: undefined,
    product_type_id: undefined
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}


const isSpecCodeUnique = (code, currentIndex) => {
  let duplicate = false;
  form.value.specs.forEach((spec, index) => {
    if (index!== currentIndex && spec.spec_code === code) {
      duplicate = true;
    }
  });
  return!duplicate || 'This spec already exists.';
};


const handleSave = async () => {
  const { valid } = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }

  // 确保 t_result 和 c_result 有值，否则设置为9
  if (form.value.t_result === null || form.value.t_result === undefined) {
    form.value.t_result = 9;
  }

  if (form.value.c_result === null || form.value.c_result === undefined) {
    form.value.c_result = 9;
  }

  loading.value = true;
  try {
      const requests = form.value.specs.map(spec => {
        const params = {
          runout_id: parseInt(route.query.runout_id),
          spec_id: spec.spec_id,
          tensile_score: Number(form.value.t_result) || 9,
          impact_score: Number(form.value.c_result) || 9,
          comment: form.value.comment
        };
        return form.value.id 
          ? API.updateTestImpact(form.value.id, params)
          : API.createTestImpact(params);
    });

    await Promise.all(requests);
    
    handleClose();
    emit("refresh");
    toast.success("Create/Update Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || "Create/Update Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleShow,
});
</script>

<style scoped>
/* 添加一些样式以区分字段 */
.v-text-field {
  margin-bottom: 8px;
}

/* 更改字段布局 */
.v-row {
  margin-bottom: 16px;
}
</style>
