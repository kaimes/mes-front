<template>
  <v-dialog
      v-model="visible"
      max-width="700"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Defective"
        prepend-icon="mdi-alert-circle-outline"
    >
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Defect</div>
      <div class="d-flex flex-wrap justify-start ga-2 pa-4">
        <v-chip v-for="(item, index) in form.codes" :key="index">
          {{ item }}
        </v-chip>
      </div>
      <div class="pa-4">
        <v-form ref="defectsRef">
          <v-row align="center">
            <v-col cols="6">
              <v-text-field v-model="form.defect_quantity" density="default" variant="underlined"
                            bg-color="white" clearable label="No. of bar" :rules="rules.defect_quantity"></v-text-field>
            </v-col>
            <v-col cols="6">
              <DefectsCode
                  v-model="form.defect_reason"
                  :hide-details="false"
                  density="default"
                  variant="underlined"
                  :rules="rules.defect_reason"
                  type="finished"
              ></DefectsCode>
            </v-col>
            <v-col cols="6">
              <v-select
                  v-model="form.downgraded"
                  clearable
                  label="Down Graded"
                  :items="['Yes', 'No']"
                  variant="underlined"
              ></v-select>
            </v-col>
            <v-col v-if="defaultMillCode !== 'SRSM'" cols="6">
              <v-text-field v-model="form.defective_length" density="default" variant="underlined"
                            bg-color="white" clearable label="Defective Length"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.comment" clearable label="Comment" variant="solo"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </div>
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
import {computed, getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
import {useStore} from "vuex";
import {toast} from "vue3-toastify";
import {map} from "lodash";
import DefectsCode from "./picker/DefectsCode.vue";
import API from "../api";

const store = useStore();

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);


const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const data = reactive({
  form: {
    defect_reason: undefined,
    comment: undefined,
    downgraded: undefined,
    defect_quantity: undefined,
    defective_length: undefined,
  },
  rules: {
    defect_reason: [
      value => {
        if (value) return true
        return 'Defect Reason is required.'
      }
    ],
    defect_quantity: [
      value => {
        if (form.value.quantity)
          if (value > form.value.quantity[0])
            return 'Defect Quantity must be less than Quantity.'
        return true;
      }
    ],
  }


});

const {form, rules} = toRefs(data);

const handleShow = (data) => {
  form.value.codes = map(data, (item) => item.code);
  form.value.quantity = map(data, (item) => item.quantity);
  form.value.defect_quantity = data[0]?.defect_quantity;
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    no_defects: undefined,
    defect_reason: undefined,
    comment: undefined,
  }
  nextTick(() => {
    proxy.$refs["defectsRef"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["defectsRef"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.defects(params);
    handleClose();
    emit("refresh");
    toast.success("Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error("Fail", { autoClose: 60000 });
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
