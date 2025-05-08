<template>
  <v-dialog v-model="visible" max-width="400" :close-on-back="false" persistent>
    <v-card title="Reserve Bar?" prepend-icon="mdi-update">
      <template v-if="needForce">
        <v-divider></v-divider>
        <div class="text-subtitle-1 pl-4 pt-4 font-weight-bold">
          It Requires Tensile Test
        </div>
        <div class="pl-2">
          <v-checkbox v-model="form.isForce" label="Cut Sample" hide-details></v-checkbox>
        </div>
        <v-divider></v-divider>
      </template>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="d-flex ga-2">
          <v-btn
              class="text-none"
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
          <template v-if="needForce">
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                :disabled="!form.isForce"
                :loading="loadingForce"
                @click="handleSave"
            >
              Force Upgrade
            </v-btn>
          </template>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {
  getCurrentInstance,
  reactive,
  ref,
  toRaw,
  toRefs,
} from "vue";
import { toast } from "vue3-toastify";
import API from "../api";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);

const tableList = ref([]);

const loadingForce = ref(false);
const loading = ref(false);
const needForce = ref(false);

const data = reactive({
  form: {
    list: [],
    order_item_id: undefined,
    isForce: false,
  },
});

const { form } = toRefs(data);

const handleShow = (data, id) => {
  console.log("id", id)
  form.value.order_item_id = id;
  form.value.list = data.map(item => item.id);
  needForce.value = data.filter(item => item.t_test < 8 || item.c_test < 8).length > 0;
  visible.value = true;
};

const handleClose = () => {
  visible.value = false;
  form.value = {
    list: [],
    isForce: false,
  };
};

const handleSave = async () => {
  const { list, isForce, order_item_id } = toRaw(form.value);
  if (isForce) {
    loadingForce.value = true;
  } else {
    loading.value = true;
  }
  try {
    await API.reserve({ list, order_item_id });
    handleClose();
    emit("refresh");
    toast.success("Reserve Success", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error("Reserve Fail", { autoClose: 60000 });
  } finally {
    if (isForce) {
      loadingForce.value = false;
    } else {
      loading.value = false;
    }
  }
};

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
