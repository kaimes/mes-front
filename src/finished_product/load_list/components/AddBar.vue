<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Select a finished product"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <div class="pa-4 border ma-4">
        <FinishedProductCode
            v-model="finished_product_code"
            label="Finished Product Code"
            :hide-details="false"
            multiple
            chips
            @change="handlePickFinishedProductCode"
        />
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
            :disabled="pickedFinishedProduct.length === 0"
            @click="handleAddBar"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import FinishedProductCode from "@/components/picker/multiple/FinishedProductCode.vue";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['pickBar']);
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  finished_product_code: [],
  pickedFinishedProduct: [],
});

const {
  finished_product_code,
  pickedFinishedProduct,
} = toRefs(data);

const handleShow = (data) => {

  // 处理数组
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    finished_product_code.value = [];
    pickedFinishedProduct.value = [];
  });
}

const handleAddBar = async () => {
  emit('pickBar', toRaw(pickedFinishedProduct.value));
  handleClose();
}

const handlePickFinishedProductCode = (item) => {
  pickedFinishedProduct.value = item;
}


defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
.re-work-card {
  overflow-y: visible !important;
}
</style>
