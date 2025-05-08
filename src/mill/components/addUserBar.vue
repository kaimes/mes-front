<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Add User"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
    >
      <div class="border ma-4 pa-4">
        <UserCode
            v-model="selections"
            label="User Code"
            :hide-details="false"
            :skip="true"
            @change="handleChange"
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
            :disabled="selections.length === 0"
            :loading="loading"
            @click="handleAddBar"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, ref, toRaw} from "vue";
import UserCode from "@/components/picker/multiple/UserCode.vue";
import {map} from "lodash";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['change']);
const visible = ref(false);
const loading = ref(false);
const selections = ref([]);
const arr = ref([]);

const handleShow = (arr = []) => {
  const $arr = toRaw(arr);
  const ids = map($arr, "id");

  selections.value = [...ids];
  arr.value = [...$arr];
  // 处理数组
  nextTick(() => {
    visible.value = true;
  })
}

const handleChange = (data) => {
  arr.value = [...toRaw(data)];
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    selections.value = [];
    arr.value = [];
  })
}


const handleAddBar = async () => {
  const items = toRaw(arr.value)
  emit('change', items);
  handleClose();
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
