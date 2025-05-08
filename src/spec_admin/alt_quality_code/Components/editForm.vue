<template>
    <FormDialog
        v-model="visible"
        :width="660"
        :title="form.id ? 'Update' : 'Add'"
        desc="Alternative Quality Code"
        :loading="loading"
        @close="handleClose"
        @save="handleSave"
    >
      <v-form ref="editForm">
        <v-row align="center">
        </v-row>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <v-row class="pt-6">
              <v-col cols="6">
                <QualityCode
                    v-model="form.quality_id"
                    :rules="rules.quality_id"
                    :quality="form.quality" 
                    item-title="code"            
                    density="default"
                    variant="underlined"
                    label="Quality Code"
                    bg-color="white"
                    required
                    clearable
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                    v-model="form.alt_quality_code"
                    :rules="rules.alt_quality_code"
                    density="default"
                    variant="underlined"
                    label="Alternate Quality Code"
                    bg-color="white"
                    required
                    clearable
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                    v-model="form.rank"
                    :items="[1, 2, 3, 4]"
                    :rules="rules.rank"
                    density="default"
                    variant="underlined"
                    label="Rank"
                    bg-color="white"
                    required
                    clearable
                />
            </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-form>
    </FormDialog>
  </template>
  <script setup>
  import {computed, getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch, onMounted} from "vue";
  import { toast } from "vue3-toastify";
  import {Decimal} from 'decimal.js';
  import FormDialog from "@/components/FormDialog.vue";
  import RunoutCode from "@/components/picker/RunoutCode.vue";
  import {greaterThan, isThanZero} from "@/util/util";
  import QualityCode from "@/components/picker/QualityCode.vue";
  import API from "../api";
 
  const visible = ref(false);
  const tab = ref("one");
  const loading = ref(false);
  const data = reactive({
    form: {
      id: undefined,
      quality_code: undefined,
      alt_quality_code: undefined,
      rank:undefined,
      quality_id:  undefined,
      quality: null,
    },
    rules: {
      quality_id: [
        value => {
          if (value) return true
          return 'Quality Code is required.'
        }
      ],
      alt_quality_code: [
        value => {
          if (value) return true
          return 'Alternate Quality Code is required.'
        }
      ],
      rank: [
        value => {
          if (value) return true
          return 'Rank is required.'
        }
      ],
    }
  });
  
  const { form, rules } = toRefs(data);
  const {proxy} = getCurrentInstance();
  const emit = defineEmits(['refresh']);
  
  function handleShow(data) {
    if (data) {
      form.value.id               = data.id;
      form.value.quality_id       = data.quality_id;
      form.value.alt_quality_code = data.alt_quality_code;
      form.value.rank             = data.rank;
      form.value.quality = data.quality;
    } else {
      form.value.id               = undefined;
      form.value.quality_id       = undefined;
      form.value.alt_quality_code = undefined;
      form.value.rank             = undefined;
      form.value.quality = null;
    }
    visible.value = true;
  }
  
  const handleClose = () => {
    visible.value = false;
    form.value = {
      "id": undefined,
      "quality_id": undefined,
      "alt_quality_code": undefined,
      "rank": undefined,
    };
    nextTick(() => {
      proxy.$refs["editForm"].resetValidation();
    })
  }
  
  const handleSave = async () => {
    const valid = await proxy.$refs.editForm.validate();
    if (!valid) {
      return;
    }
    loading.value = true;
    const { id, quality_id, alt_quality_code, rank, quality } = toRaw(form.value);
    const quality_code = quality?.code ?? null;
    const payload = { quality_id, quality_code, alt_quality_code, rank };

    try {
    // 4. Call the correct endpoint *once*
    if (id) {
      await API.update(id, payload);
    } else {
      await API.add(payload);
    }
      handleClose();
      emit("refresh");
      toast.success(id ? "Update Success" : "Create Success", {
        position: "bottom-center"
      });
    } catch (res) {
      toast.error(res?.response?.data?.detail || (id ? "Update Fail" : "Create Fail"), { autoClose: 60000 });
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
