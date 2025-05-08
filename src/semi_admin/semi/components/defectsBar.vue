<template>
  <v-dialog
    v-model="visible"
    max-width="700"
    :close-on-back="false"
    persistent
  >
    <v-card
      :title="$t('semi.defect_button.defective')"
      prepend-icon="mdi-alert-circle-outline"
    >
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">{{$t('semi.defect_button.defect')}}</div>
      <div class="d-flex flex-wrap justify-start ga-2 pa-4">
        <v-chip v-for="(item, index) in form.codes" :key="index">
          {{ item }}
        </v-chip>
      </div>
      <v-form ref="defectsRef">
        <v-row align="center">
          <v-col cols="5" offset="1">
            <v-text-field
              v-model="form.defect_quantity"
              density="compact"
              variant="underlined"
              bg-color="white"
              clearable
              :label="$t('semi.defect_button.no_pieces')"
              style="margin-top: 12px;"
              :rules="rules.defect_quantity"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <DefectsCode
              v-model="form.defect_reason"
              :hide-details="false"
              density="default"
              variant="underlined"
              :rules="rules.defect_reason"
              type="semi"
            ></DefectsCode>
          </v-col>
          <v-col cols="10" offset="1">
            <v-textarea v-model="form.comment" clearable :label="$t('semi.defect_button.comment')" variant="solo"></v-textarea>
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="text-none mr-4"
          color="#e3e3e3"
          variant="flat"
          @click="handleClose"
        >
          {{$t('global.cancel')}}
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          variant="flat"
          :loading="loading"
          @click="handleSave"
        >
          {{$t('global.confirm')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref, toRefs, toRaw } from "vue";
import { toast } from "vue3-toastify";
import { map } from "lodash";
import DefectsCode from "../../../finished_product/finished_product/components/picker/DefectsCode.vue";
import API from "../api";

const { proxy } = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);

// 初始数据状态
const initialData = {
  form: {
    codes: [],
    ids: [],
    no_defects: undefined,
    defect_reason: undefined,
    comment: undefined,
    defect_quantity: undefined,
  },
  rules: {
    defect_reason: [(v) => !!v || "Please select the defect reason"],
    defect_quantity: [
        value => {
          if (form.value.quantity)
            if (value > form.value.quantity[0]) {
              return "Defect quantity cannot be greater than the quantity";
            }
          return true;
        }
      ],
  },
};

const data = reactive({ ...initialData });

const { form, rules } = toRefs(data);

const handleShow = (data) => {
  
  form.value = {
    codes: map(data, (item) => item.semi_code),
    ids: map(data, (item) => item.id),
    no_defects: undefined,
    defect_reason: undefined,
    comment: undefined,
    defect_quantity: map(data, (item) => item.defect_quantity),
  };
  form.value.quantity = map(data, (item) => item.quantity)
  nextTick(() => {
    console.log('Setting visible to true');
    visible.value = true;
  });
};

const handleClose = () => {
  console.log('handleClose called');
  console.log('Rules before closing:', rules.value);
  visible.value = false;
  form.value = {
    ...initialData.form,
    defect_quantity: form.value.defect_quantity
  };
  nextTick(() => {
    console.log('Resetting validation');
    proxy.$refs["defectsRef"].resetValidation();
  });
};

const handleSave = async () => {
  console.log('handleSave called');
  console.log('Rules before saving:', rules.value);
  const { valid } = await proxy.$refs["defectsRef"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    console.log('Submitting params:', params);
    await API.defects(params);
    handleClose();
    emit("refresh");
    toast.success("Defect recorded successfully", {
      position: "bottom-center"
    });
  } catch (res) {
    const errorMessage = res?.response?.data?.detail || 
                        res?.message || 
                        "Failed to record defect";
    toast.error(`Error: ${errorMessage}`, {
      autoClose: 60000,
      position: "bottom-center"
    });
  } finally {
    loading.value = false;
  }
};

defineExpose({
  handleShow,
});
</script>

<style lang="scss" scoped>
</style>
