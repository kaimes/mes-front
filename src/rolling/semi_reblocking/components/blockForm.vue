<template>
  <v-dialog
      v-model="visible"
      max-width="700"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Semi Block"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <div class="pa-4">
        <v-form ref="editForm">
          <v-row align="center">
            <v-col cols="5">
              <RollingCode v-model="form.rolling_id" :rolling="form.rolling" @change="handleItemChange($event, 'rolling_id')"></RollingCode>
            </v-col>
            <v-col cols="4">
              <v-select 
                v-model="form.order_group_id"
                label="Order Group No"
                class="text-none mt-5"
                :items="orderGroupOptions"
                :rules="rules.order_group_id"
                @update:model-value="handleGroupCodeChange"
              ></v-select>
            </v-col>
            <v-col cols="3">         
              <v-text-field
                v-model="form.section_weight"
                :rules="rules.section_weight"
                label="KGM"
                class="text-none mt-5"
                disabled
              ></v-text-field>
            </v-col>
       
          </v-row>
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
import API from "../api";
import RollingCode from "@/components/picker/RollingCode.vue";


const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    rolling_id: undefined,
    rolling: undefined,
    order_group_id: undefined,
    section_weight: undefined
  },
  rules: {
    order_group_id: [
      value => {
        if (value) return true;
        return "Order Group No is required";
      }
    ],
    section_weight: [
      value => {
        if (value) return true;
        return "Section Weight is required";
      }
    ],
  },
  orderGroupOptions: [],
  sectionWeightMap: {}
});

const { form, rules, orderGroupOptions, sectionWeightMap } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  visible.value = true;
  console.log("show data===", data)
  if (data) {
    const params = toRaw(data);

    if (params.rolling_id) {
      API.requestCommonGet(`/order_group/options?rolling_id=${params.rolling_id}`).then(res => {
        if (res.status == 200 && res.data) {
          orderGroupOptions.value = res.data.options;
          sectionWeightMap.value = res.data.dim3;
        }
      }).catch((res) => {
        toast.error("Get order group options failed.", { autoClose: 60000 });
      })
    }
    form.value = {
      id: params.id,
      rolling_id: params.rolling_id,
      rolling: params.rolling,
      order_group_id: params.order_group_id,
      section_weight: params.order_group?.product_type?.dim3
    }
  }
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    semi_code:undefined,
    rolling_id: undefined,
    order_group_id: undefined,
    section_weight: undefined
  };
  orderGroupOptions.value = [];
  sectionWeightMap.value = {};
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
  try {
    await API.blockAction([params]);
    handleClose();
    emit("refresh");
    toast.success("Block Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error("Block Fail",{ autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleItemChange = (item, key) => {
  form.value.rolling_id = item?.id;
  if (!form.value.rolling_id) {
    form.value.order_group_id = undefined;
    form.value.section_weight = undefined;
    orderGroupOptions.value = [];
    sectionWeightMap.value = {};
    return
  }
  API.requestCommonGet(`/order_group/options?rolling_id=${form.value.rolling_id}`).then(res => {
    if (res.status == 200 && res.data) {
      orderGroupOptions.value = res.data.options;
      sectionWeightMap.value = res.data.dim3;
    }
  }).catch((res) => {
    toast.error("Get order group options failed.", { autoClose: 60000 });
  })
}

const handleGroupCodeChange = (item) => {
  form.value.section_weight = sectionWeightMap.value[item];
}

defineExpose({
  handleShow,
});

</script>
<style scoped>

</style>
