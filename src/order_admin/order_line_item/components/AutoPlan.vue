<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      min-height="430"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Auto Plan"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <v-card-text>
        <v-radio-group v-model="autoPlanType" inline class="mb-0 pb-0">
          <v-radio label="Road" value="road"></v-radio>
          <v-radio label="Load Instructions" value="load_instructions"></v-radio>
        </v-radio-group>
        <v-sheet v-if="autoPlanType === 'road'">
        </v-sheet>
        <v-sheet v-if="autoPlanType === 'load_instructions' && loadInstructionsStep === 1">
          <v-form ref="bundleMatrixForm">
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="loadInstructionsForm.cust_no"
                      :rules="loadInstructionsRules.cust_no"
                      label="Customer No."
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="loadInstructionsForm.add_no"
                      :rules="loadInstructionsRules.add_no"
                      label="Address Code"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="loadInstructionsForm.roll_ref"
                      :rules="loadInstructionsRules.roll_ref"
                      label="Rolling Reference"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="loadInstructionsForm.max_bar_length"
                      :rules="loadInstructionsRules.max_bar_length"
                      label="Bar Length(mm)"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="loadInstructionsForm.kg_per_metre"
                      :rules="loadInstructionsRules.kg_per_metre"
                      label="KG/M"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="loadInstructionsForm.spec_no"
                      :rules="loadInstructionsRules.spec_no"
                      label="Spec No"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="text-end">
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleSearchMatrix"
                  >
                    Search
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-sheet>
        <v-sheet v-if="autoPlanType === 'load_instructions' && loadInstructionsStep === 2">
          <v-table>
            <thead>
            <tr>
              <th class="text-left">
                Number Of Bars
              </th>
              <th class="text-left">
                Bundle Width
              </th>
              <th class="text-left">
                Bundle Height
              </th>
              <th class="text-left">
                Max Bundle Weight
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in bundleMatrix"
                :key="item.id"
            >
              <td>{{ item.num_bars }}</td>
              <td>{{ item.bars_wide }}</td>
              <td>{{ item.bars_high }}</td>
              <td>{{ item.max_bundle_weight }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </v-card-text>

      <v-card-actions v-if="autoPlanType === 'road' || (autoPlanType === 'load_instructions' && loadInstructionsStep === 2)">
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
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {toast} from "vue3-toastify";
import {map} from "lodash";
import API from "../api";


const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const autoPlanType =  ref('');
const loadInstructionsStep = ref(1)
const bundleMatrix = ref([])
const orderItem = ref({})

const data = reactive({
  loadInstructionsForm: {
    cust_no: null,
    add_no: null,
    roll_ref: null,
    max_bar_length: null,
    kg_per_metre: null,
    spec_no: null,
  },
  loadInstructionsRules: {
    cust_no: [
      value => {
        if (value) return true
        return 'Customer No is required.'
      }
    ],
    add_no: [
      value => {
        if (value) return true
        return 'Address Code is required.'
      }
    ],
    roll_ref: [
      value => {
        if (value) return true
        return 'Rolling Reference is required.'
      }
    ],
    max_bar_length: [
      value => {
        if (value) return true
        return 'Bar Length is required.'
      }
    ],
    kg_per_metre: [
      value => {
        if (value) return true
        return 'KG/M is required.'
      }
    ],
    spec_no: [
      value => {
        if (value) return true
        return 'Spec No is required.'
      }
    ],
  },
});

const {
  loadInstructionsForm,
  loadInstructionsRules,
} = toRefs(data);

watch(autoPlanType, (newType) => {
  if (newType === 'road') {
    loadInstructionsStep.value = 1;
  }
})

const handleError = (error) => {
  if (error.response) {
    toast.error(error.response.data?.detail, {
      autoClose: 60000
    });
  } else {
    console.log(error)
  }
  return false
}

const handleShow = (orderItemData) => {
  orderItem.value = orderItemData;
  nextTick(() => {
    visible.value = true;
  })
}

const handleSearchMatrix = async () => {
  const {valid} = await proxy.$refs["bundleMatrixForm"].validate();
  if (!valid) {
    return;
  }
  try {
    const res = await API.getBundleMatrix(loadInstructionsForm.value);
    bundleMatrix.value = [res.data]
  } catch (error) {
    handleError(error)
    return false;
  }
  proxy.$refs["bundleMatrixForm"].reset();
  loadInstructionsStep.value = 2;
}

const handleClose = () => {
  autoPlanType.value = '';
  loadInstructionsStep.value = 1;
  visible.value = false;
}

const handleSave = async () => {
  // console.log(orderItem.value.id)
  // console.log(autoPlanType.value)
  let bundleMatrixID = null
  if (bundleMatrix.value && bundleMatrix.value[0]) {
    bundleMatrixID = bundleMatrix.value[0].id;
  }
  API.auto_plan({
    "work_order_item_id": orderItem.value.id,
    "auto_plan_type": autoPlanType.value,
    "bundle_matrix_id": bundleMatrixID,
  }).then(res => {
    handleClose();
    emit("refresh");
    toast.success("Auto load plan successfully", {
      position: "bottom-center"
    })
    return true;
  }).catch((error) => {
    handleError(error)
  })

  // const {valid} = await proxy.$refs["moveForm"].validate();
  // if (!valid) {
  //   return;
  // }
  // loading.value = true;
  // const params = toRaw(form.value);
  // if (!params.area_id) {
  //   delete params.area_id;
  // }
  // try {
  //   await API.rework(params);
  //   handleClose();
  //   emit("refresh");
  //   toast.success("Rework Success", {
  //     position: "bottom-center"
  //   });
  // } catch (res) {
  //   toast.error("Rework Fail", {
  //     position: "bottom-center"
  //   }, { autoClose: 60000 });
  // } finally {
  //   loading.value = false;
  // }
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
