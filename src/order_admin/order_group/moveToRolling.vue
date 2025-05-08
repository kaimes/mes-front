<template>
    <v-dialog
        v-model="visible"
        max-width="700"
        :close-on-back="false"
        persistent
    >
      <v-card
          title="Order Group Move"
          prepend-icon="mdi-alert-circle-outline"
      >
        <v-divider></v-divider>
        <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Move</div>
        <div class="d-flex justify-start ga-2 pa-4">
          <!-- <v-chip v-for="(item, index) in form.codes" :key="index">
            {{ item }}
          </v-chip> -->
          <v-chip>
            {{ showForm.moveLabel }}
          </v-chip>
        </div>
        <div class="text-subtitle-1 font-weight-bold ml-4 mr-4">To</div>
        <div class="pa-4">
          <v-form ref="moveForm">
            <v-row align="center">
              <v-col cols="4">
                <v-select
                    v-model="form.rolling_id"
                    label="Rolling Code"
                    hide-details
                    variant="underlined"
                    bg-color="white"
                    :items="rollingOptions"
                    clearable
                ></v-select>
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
  import {map} from "lodash";
  import API from "./api";
  
  const {proxy} = getCurrentInstance();
  const emit = defineEmits(['refresh']);
  const visible = ref(false);
  const loading = ref(false);
  
  const data = reactive({
    form: {
      rolling_id: undefined,
      // is_generate_consi: false,
    },
    orderGroupId: undefined,
    showForm: {
      moveLabel: undefined,
      toLable: undefined
    },
    rollingOptions: [],
    rules: {
      rolling_id: [
        value => {
          if (value) return true
          return 'Rolling code is required.'
        }
      ],
    }
  });
  
  const { form, orderGroupId, showForm, rollingOptions, rules } = toRefs(data);
  
  const handleShow = (data, options=[]) => {
    showForm.value.moveLabel = data.formLabel.orderGroupLabel;
    orderGroupId.value = data.formValue.orderGroupId;
    rollingOptions.value = options;
    nextTick(() => {
      visible.value = true;
    })
  }
  
  const handleClose = () => {
    visible.value = false;
    form.value = {
      rolling_id: undefined,
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
      rolling_id: form.value.rolling_id
    });
    console.log('params值',params);
    try {
      await API.move(orderGroupId.value, params);
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
