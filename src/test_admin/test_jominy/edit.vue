<template>
  <v-container class="page" fluid>
    <div class="panel">
      <div class="panel-action">
        <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
        <v-switch
            v-model="save"
            density="default"
            hide-details
            inset
        ></v-switch>
        <div class="ml-14">
          <v-btn @click="handleSave" :disabled="!save" :loading="loading" variant="flat" color="primary">
            {{ form.id ? "UPDATE" : "SAVE" }}
          </v-btn>
        </div>
      </div>
    </div>
    <v-form ref="editForm">
      <div class="mb-4 border rounded pa-4">
        <v-row align="center">
          <v-col cols="2">
            <cast-code
              v-model="form.cast_id"
              :rules="rules.cast_id"
              :hide-details="false"
              :cast="form.cast"
              :disabled="!save"
            />
          </v-col>
          <v-col cols="2">
           <dict-code
              v-model="form.type"
              :rules="rules.type"
              :hide-details="false"
              bg-color="white"
              density="default"
              variant="underlined"
              color="#333"
              label="Type"
              placeholder="Type"
              code="test_jominy_type"
              :disabled="!save"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
                v-model="form.s_dst"
                @blur="handleBlur('s_dst')"
                density="default"
                variant="underlined"
                label="S-DST"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2" v-for="j in [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 25, 28, 30, 32, 35, 40, 45, 50]" :key="j">
            <v-text-field
              v-model="form[`j_${j.toString().replace('.', '_')}`]"
              @blur="handleBlur(`j_${j.toString().replace('.', '_')}`, 'init')"
              density="default"
              variant="underlined"
              :label="j"
              bg-color="white"
              :disabled="!save || !isFieldEnabled(`j_${j.toString().replace('.', '_')}`)"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
     
    </v-form>
  </v-container>
</template>
<script setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs, watch, computed} from "vue";
import {toast} from "vue3-toastify";
import {useRoute, useRouter} from "vue-router";
import OtherCode from "@/components/otherCode/index.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "./api";
import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import CastCode from "@/components/picker/CastCode.vue";

const route = useRoute();
const router = useRouter();

const commonStore = useCommonStore();
const loading = ref(false);
const save = ref(true);
const data = reactive({
  form: {
    id: undefined,
    cast_id: undefined,
    cast: undefined,
    type: undefined,
    s_dst: undefined,
    j_1: undefined,
    j_1_5: undefined,
    j_2: undefined,
    j_3: undefined,
    j_4: undefined,
    j_5: undefined,
    j_6: undefined,
    j_7: undefined,
    j_8: undefined,
    j_9: undefined,
    j_10: undefined,
    j_11: undefined,
    j_12: undefined,
    j_13: undefined,
    j_14: undefined,
    j_15: undefined,
    j_16: undefined,
    j_18: undefined,
    j_20: undefined,
    j_22: undefined,
    j_24: undefined,
    j_25: undefined,
    j_28: undefined,
    j_30: undefined,
    j_32: undefined,
    j_35: undefined,
    j_40: undefined,
    j_45: undefined,
    j_50: undefined,
  },
  rules: {
    cast_id: [
      value => {
        if (!value) {
          return "Cast Code is required.";
        }
        return true;
      }
    ],
    type: [
      value => {
        if (!value) {
          return "Type is required.";
        }
        return true;
      }
    ],
  },
});

const {form, rules} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.add(params);
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      duration: 2000,
      onClose: () => router.back()
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleBlur = (field, type = "double") => {
  console.log('field', field);
  
  let value = form.value[field];

  if (!value) {
    form.value[field] = undefined;
    return;
  }

  // 尝试转换数值
  let numValue = type === "double" ? parseFloat(value) : parseInt(value, 10);
  console.log('numValue', numValue);
  

  // 如果转换结果是 NaN，设为 undefined
  if (isNaN(numValue)) {
    form.value[field] = undefined;
  } else {
    form.value[field] = type === "double" ? numValue.toFixed(2) : numValue;
  }
};


const getDetailById = (id) => {
  API.getDetail(id).then(res => {
    const {status, data} = res;
    if (status === 200) {
      form.value = data || {};
    } 
  });
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  save.value = false;
  getDetailById(route.query.id)
}


// 监听 form.type 的变化
watch(
  () => form.value.type,
  (newType) => {
    const enabledFields = getEnabledFieldsByType(newType);
    console.log('enabledFields', enabledFields);
    

    // 设置输入框的可用性
    for (const field in form.value) {
      if (field.startsWith('j_')) {
        form.value[field] = enabledFields.includes(field) ? form.value[field] : undefined;
      }
    }
  }
);

// 根据 type 返回可以输入的字段数组
function getEnabledFieldsByType(type) {
  const typeFieldMap = {
    imperial: ['j_1', 'j_2', 'j_3', 'j_4', 'j_5', 'j_6', 'j_7', 'j_8', 'j_9', 'j_10', 'j_11', 'j_12', 'j_13', 'j_14', 'j_15', 'j_16', 'j_18', 'j_20', 'j_22', 'j_24', 'j_28', 'j_32'],
    metric: ['j_1_5', 'j_3', 'j_5', 'j_7', 'j_9', 'j_11', 'j_13', 'j_15', 'j_20', 'j_22', 'j_25', 'j_30', 'j_35', 'j_40', 'j_45', 'j_50'],
    caterpillar: ['j_1', 'j_2', 'j_3', 'j_4', 'j_5', 'j_6', 'j_7', 'j_8', 'j_9', 'j_10', 'j_11', 'j_12', 'j_13', 'j_14', 'j_15', 'j_16', 'j_18', 'j_20', 'j_22', 'j_24', 'j_28', 'j_32'],
  };

  return typeFieldMap[type] || [];
}

const enabledFields = computed(() => {
  return getEnabledFieldsByType(form.value.type);
});

function isFieldEnabled(field) {
  return enabledFields.value.includes(field);
}
</script>
<style lang="scss" scoped>
.panel {
  &-action {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
