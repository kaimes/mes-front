<template>
    <FormDialog
        v-model="visible"
        :width="460"
        :title="form.id ? 'Update' : 'Add'"
        desc="Semi Cast List"
        :loading="loading"
        @close="handleClose"
        @save="handleSave"
    >
      <v-form ref="editForm">
        <v-row align="center">
          <v-col cols="6">
            <v-text-field
                v-model="form.cast_code"
                :rules="rules.cast_code"
                label="Cast Code"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
                v-model="form.bos_cast_code"
                label="Bos Cast Code"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
                v-model="form.quality_code"
                label="Quality Code"
                clearable
            ></v-text-field>
          </v-col>
          
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_c"
                label="C"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_c')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_si"
                label="Si"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_si')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_mn"
                label="Mn"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_mn')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_p"
                label="P"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_p')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_s"
                label="S"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_s')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_s_p"
                label="S+P"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_s_p')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_cr"
                label="Cr"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_cr')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_mo"
                label="Mo"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_mo')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_ni"
                label="Ni"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_ni')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_al"
                label="Al"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_al')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_b"
                label="B"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_b')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_co"
                label="Co"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_co')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_cu"
                label="Cu"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_cu')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_nb"
                label="Nb"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_nb')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_sn"
                label="Sn"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_sn')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_ti"
                label="Ti"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_ti')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_v"
                label="V"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_v')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_n"
                label="N"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_n')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_ca"
                label="Ca"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_ca')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_solal"
                label="Soluble Aluminium"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_solal')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_h"
                label="H"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_h')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_o"
                label="O"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_o')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_as"
                label="As"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_as')"
                clearable
            ></v-number-input>
          </v-col>
          
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_bi"
                label="Bi"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_bi')"
                clearable
            ></v-number-input>
          </v-col>
          
          
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_ce"
                label="Ce"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_ce')"
                clearable
            ></v-number-input>
          </v-col>
          
          
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_pb"
                label="Pb"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_pb')"
                clearable
            ></v-number-input>
          </v-col>
          
          
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_sb"
                label="Sb"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_sb')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_w"
                label="W"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_sb')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_zn"
                label="Zn"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_zn')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_zr"
                label="Zr"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_zr')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_te"
                label="Te"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_te')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_rad"
                label="Rad"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_rad')"
                clearable
            ></v-number-input>
          </v-col>
          <v-col cols="6">
            <v-number-input
                v-model="form.ch_insal"
                label="Insal"
                :min="0"
                :max="1"
                class="no-input-control"
                variant="underlined"
                @blur="handleBlur('ch_insal')"
                clearable
            ></v-number-input>
          </v-col>
        </v-row>
      </v-form>
    </FormDialog>
  </template>
  <script setup>
  import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs} from "vue";
  import {toast} from "vue3-toastify";
  import { VNumberInput } from 'vuetify/labs/VNumberInput'
  import FormDialog from "@/components/FormDialog.vue";
  import API from "../api";
  
  const visible = ref(false);
  const loading = ref(false);
  const data = reactive({
    form: {
      id: undefined,
      cast_code: undefined,
      bos_cast_code: undefined,
      quality_code: undefined,
      ch_c: undefined,
      ch_si: undefined,
      ch_mn: undefined,
      ch_p: undefined,
      ch_s: undefined,
      ch_s_p: undefined,
      ch_cr: undefined,
      ch_mo: undefined,
      ch_ni: undefined,
      ch_al: undefined,
      ch_b: undefined,
      ch_co: undefined,
      ch_cu: undefined,
      ch_nb: undefined,
      ch_sn: undefined,
      ch_ti: undefined,
      ch_v: undefined,
      ch_n: undefined,
      ch_ca: undefined,
      ch_o: undefined,
      ch_h: undefined,
      ch_as: undefined,
      ch_bi: undefined,
      ch_ce: undefined,
      ch_pb: undefined,
      ch_sb: undefined,
      ch_w: undefined,
      ch_zn: undefined,
      ch_zr: undefined,
      ch_solal: undefined,
      ch_te: undefined,
      ch_rad: undefined,
      ch_insal: undefined
    },
    rules: {
      cast_code: [
        value => {
          if (value) return true
          return 'Cast Code is required.'
        }
      ],
    }
  });
  
  const { form, rules } = toRefs(data);
  const {proxy} = getCurrentInstance();
  const emit = defineEmits(['refresh']);
  const snackbar = inject('snackbar');
  
  const handleSpecCodeChange = (data) => {
    form.value.short_name = data.short_name;
  }
  
  const handleShow = (data) => {
    if (data) {
      const params = toRaw(data);
      form.value = {
        ...params,
      };
    }
    visible.value = true;
  }
  
  const handleClose = () => {
    visible.value = false;
    form.value = {
      id: undefined,
      cast_code: undefined,
      bos_cast_code: undefined,
      quality_code: undefined,
      ch_c: undefined,
      ch_si: undefined,
      ch_mn: undefined,
      ch_p: undefined,
      ch_s: undefined,
      ch_s_p: undefined,
      ch_cr: undefined,
      ch_mo: undefined,
      ch_ni: undefined,
      ch_al: undefined,
      ch_b: undefined,
      ch_co: undefined,
      ch_cu: undefined,
      ch_nb: undefined,
      ch_sn: undefined,
      ch_ti: undefined,
      ch_v: undefined,
      ch_n: undefined,
      ch_ca: undefined,
      ch_o: undefined,
      ch_h: undefined,
      ch_as: undefined,
      ch_bi: undefined,
      ch_ce: undefined,
      ch_pb: undefined,
      ch_sb: undefined,
      ch_w: undefined,
      ch_zn: undefined,
      ch_zr: undefined,
      ch_solal: undefined,
      ch_te: undefined,
      ch_rad: undefined,
      ch_insal: undefined
    };
    nextTick(() => {
      proxy.$refs["editForm"].resetValidation();
    })
  }
  
  
  const handleBlur = (field) => {
    const value = form.value[field];
  
    if (!value) {
      form.value[field] = undefined;
    } else {
      form.value[field] = parseFloat(value).toFixed(4);
    }
  }
  
  const handleSave = async () => {
    const {valid} = await proxy.$refs["editForm"].validate();
    if (!valid) {
      return;
    }
    loading.value = true;
    const params = toRaw(form.value);
    try {
      await API.add(params);
      handleClose();
      emit("refresh");
      toast.success(params.id ? "Update Success" : "Create Success", {
        position: "bottom-center"
      });
    } catch (res) {
      toast.error(params.id ? "Update Fail: " + res?.response?.data?.detail : "Create Fail: " + res?.response?.data?.detail, { autoClose: 60000 });
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
