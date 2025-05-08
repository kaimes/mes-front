<template>
    <v-dialog
        v-model="visible"
        max-width="700"
        :close-on-back="false"
        persistent
    >
      <v-card
          title="Import File From FTP"
          prepend-icon="mdi-alert-circle-outline"
      >
        <div class="pa-6">
          <v-form ref="importFileForm">
            <v-row align="center">
              <v-col cols="12">
                <v-text-field
                    v-model="form.remote_file_path"
                    label="FTP Remote File Path"
                    variant="underlined"
                    bg-color="white"
                    :rules="rules.remote_file_path"
                    clearable
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
  import {map} from "lodash";
  import API from "./api";
  
  const {proxy} = getCurrentInstance();
  const emit = defineEmits(['refresh']);
  const visible = ref(false);
  const loading = ref(false);
  
  const data = reactive({
    form: {
      remote_file_path: undefined,
      // is_generate_consi: false,
    },
    showForm: {
      moveLabel: undefined,
      toLable: undefined
    },
    rollingOptions: [],
    rules: {
      remote_file_path: [
        // 校验是否为一个linux文件路径地址
        value => {
          if (!value) return "Please enter a linux file path"; 
          if (typeof value === 'string' && value.startsWith('/') && !value.includes('\\')) return true;
          else {
            return "Please enter a valid linux file path";
          }
          // if (!value) return "Please enter a linux file path";
          
        }
      ],
    }
  });
  
  const { form, showForm, rollingOptions, rules } = toRefs(data);
  
  const handleShow = () => {
    nextTick(() => {
      visible.value = true;
    })
  }
  
  const handleClose = () => {
    visible.value = false;
    form.value = {
      remote_file_path: undefined,
    };
    nextTick(() => {
      proxy.$refs["importFileForm"].resetValidation();
    })
  }
  
  const handleSave = async () => {
    const {valid} = await proxy.$refs["importFileForm"].validate();
    if (!valid) {
      return;
    }
    loading.value = true;
    
    const params = toRaw({
      ...form.value,
    });
    console.log('params值',params);
    try {
      await API.importFileFromFTP(params);
      handleClose();
      emit("refresh");
      toast.success("Import FTP file to MES Success.", {
        position: "bottom-center"
      });
    } catch (res) {
      toast.error("Import FTP file to MES Failed!", { autoClose: 60000 });
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
