<template>
  <v-dialog
      v-model="visible"

      max-width="400"
      :close-on-back="false"
      persistent
  >
    <v-card
        :title="edit_type === 't_runout' ? 'Edit T-Cover-By' : 'Edit C-Cover-By'"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <v-form ref="editForm" >
        <v-row align="center" class="pt-6">

          <v-col cols="10" class="ml-8">
            <RunoutCode v-model="runout_code" variant="underlined" :hide-details="false"
                        @change="handleItemChange" :runout="runout" :pick-runout="runout_id"
                        :rules="rules.runout_code"></RunoutCode>
          </v-col>
        </v-row>


      </v-form>
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
import useCommonStore from "@/app/common";

import API from "@/finished_product/finished_product/api";
import RunoutCode from "@/components/picker/RunoutCode.vue";


const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);


const save = ref(true)
const runout_code = ref('')
const runout_id = ref(0)

const edit_type = ref(undefined)
const data = reactive({
  runout: {
    id: undefined,
    runout_code: undefined,
  },
  form: {
    id: undefined,
    t_runout: undefined,
    c_runout: undefined,
  },
  rules: {
    runout_code: [
      value => {
        if (value) return true
        return 'Runout is required.'
      },
    ],
  }
});

const {form, rules, runout} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data, type) => {
  console.log("show  ", data, type)
  if (data) {
    const value = toRaw(data);
    form.value = {...value};
  }
  edit_type.value = type;
  if (edit_type.value === 't_runout') {
    runout.value.id = form.value.t_runout;
    runout.value.runout_code = form.value.t_runout_code;
    runout_code.value = runout.value.runout_code;
    runout_id.value =  form.value?.runout_id;
  }
  if (edit_type.value === 'c_runout') {
    runout.value.id = form.value.c_runout;
    runout.value.runout_code = form.value.c_runout_code;
    runout_code.value  = runout.value.runout_code;
    runout_id.value =  form.value?.runout_id;
  }
  visible.value = true;
}

const handleItemChange = (item) => {
  form.value[edit_type.value] = item?.id;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    t_runout: undefined,
    c_runout: undefined
  };
  edit_type.value = undefined;
  runout.value = {}

  runout_id.value = 0;
  runout_code.value = '';
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
  let params = toRaw(form.value);
  if (edit_type.value === 't_runout') {
    params.t_override = "Manual";
    params.overall_ten_result = 9;
  }
  if (edit_type.value === 'c_runout') {
    params.c_override = "Manual";
    params.overall_imp_result = 9;
  }

  try {
    await API.update(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || "Update Fail", { autoClose: 60000 });
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
