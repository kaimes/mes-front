<template>
  <v-dialog
      v-model="visible"
      max-width="700"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Finished Product Load Move"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Move</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <v-chip v-for="(item, index) in form.codes" :key="index">
          {{ item }}
        </v-chip>
        <!-- <v-chip>
          {{ form.code }}
        </v-chip> -->
      </div>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4">To</div>
      <div class="pa-4">
        <v-form ref="moveForm">
          <v-row align="center">
            <!-- <v-col cols="4">
              <BusinessType
                v-model="form.business_type"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Business Type"
                code="business_type"
                disabled
            />
            </v-col> -->
            <v-col cols="4">
                <v-text-field v-model="form.business_type" density="default" variant="underlined" placeholder="Transport Type"
                    bg-color="white" clearable disabled label="Business Type"></v-text-field>
            </v-col>
            <v-col cols="4">
              <Location v-model="form.area_code" label="Location" :rules="rules.area_code"  />
            </v-col>
          </v-row>
          <!-- <v-row align="center">
            <v-col cols="6">
              <v-checkbox v-model="form.is_generate_consi" label="Generate Advice No." density="comfortable" hide-details></v-checkbox>
            </v-col>
          </v-row> -->
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
import StockType from "./picker/StockType.vue";
import Location from "../../../components/picker/Location.vue";
import BusinessType from "../../../components/picker/BusinessType.vue";
import API from "../api";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  form: {
    codes: [],
    business_type: undefined,
    area_code: undefined,
    // is_generate_consi: false,
  },
  rules: {
    area_code: [
      value => {
        if (value) return true
        return 'Location is required.'
      }
    ],
  }
});

const { form, rules } = toRefs(data);

const handleShow = (data) => {

  // 处理数组
  form.value.codes = map(data, (item) => item.code);
  // form.value.codes = data.advice_code;
  if (data.length === 1){
    form.value.business_type = data[0]?.business_type;
    form.value.area_code = data[0]?.area_code;
  }
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    codes: [],
    business_type: undefined,
    area_code: undefined,
  };
  nextTick(() => {
    proxy.$refs["moveForm"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["moveForm"].validate();
  console.log('valid',valid);
  if (!valid) {
    return;
  }
  console.log('form.value',form.value);
  loading.value = true;
  
  const params = toRaw({
    ...form.value,
    codes: form.value.codes.map(code => String(code)), 
    area_code: String(form.value.area_code),          
  });
  console.log('params值',params);
  try {
    await API.move(params);
    handleClose();
    emit("refresh");
    toast.success("Move Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error("Move Fail", { autoClose: 60000 });
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
