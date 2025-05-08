<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="SemiSize Detail"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <MillCode v-model="form.mill_id" :hide-details="false" :spec="form.mill" :rules="rules.mill_id" @change="handleMillChange" />
        </v-col>
        <v-col cols="6">
          <SemiSizeCode v-model="form.semi_size_id" :hide-details="false" :semi_size="form.semi_size" :rules="rules.semi_size_id" @change="handleSemiSizeChange" />
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.length_mm"
              density="default"
              label="Length(mm)"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.standard_weight_t"
              density="default"
              label="Standard Weight(t)"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.min_weight_t"
              density="default"
              label="Min Weight(t)"
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.max_weight_t"
              density="default"
              label="Max Weight(t) "
              bg-color="white"
              clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import FormDialog from "@/components/FormDialog.vue";
import API from "../api";
import MillCode from "@/components/picker/MillCode.vue";
import SemiSizeCode from "@/components/picker/SemiSizeCode.vue";
import useCommonStore from "@/app/common";
import {isThanZero} from "@/util/util";
import {toast} from "vue3-toastify";
const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  form: {
    id: undefined,
    mill_id: undefined,
    mill: {},
    semi_size_id: undefined,
    semi_size: {},
    length_mm: undefined,
    standard_weight_t: undefined,
    min_weight_t: undefined,
    max_weight_t: undefined,

  },
  rules: {
    // weight_min: [
    //   value => {
    //     if (isThanZero(value)) return true
    //     return 'Weight Min is required.'
    //   }
    // ],
    // weight_max: [
    //   value => {
    //     if (isThanZero(value)) return true
    //     return 'Weight Max is required.'
    //   }
    // ],
    semi_size_id: [
      value => {
        if (value) return true
        return 'Semi Size is required.'
      }
    ],
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    form.value = {
      id: data.id,
      mill_id: data.mill_id,
      mill: data.mill,
      semi_size_id: data.semi_size_id,
      semi_size: data.semi_size,
      length_mm: data.length_mm,
      standard_weight_t: data.standard_weight_t,
      min_weight_t: data.min_weight_t,
      max_weight_t: data.max_weight_t,
    };
  }
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    id: undefined,
    mill_id: undefined,
    mill: {},
    semi_size_id: undefined,
    semi_size: {},
    length_mm: undefined,
    standard_weight_t: undefined,
    min_weight_t: undefined,
    max_weight_t: undefined,
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}

const handleMillChange = (data) => {
  form.value.mill = data;
}

const handleSemiSizeChange = (data) => {
  form.value.semi_size = data;
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  if (!params.id) {
    delete params.mill;
  }
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
  } catch (res) {
    if (res.response.status === 400) {
      toast.error(res.response.data.detail || "Bad Request", { autoClose: 60000 });
    } else {
      toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
    }
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
