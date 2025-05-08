<template>
    <v-container class="detail-content" fluid>
      <v-form ref="searchForm">
        <div class="panel mb-8">
          <div class="panel-action">
            <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
            <v-switch v-model="save" density="compact" hide-details inset></v-switch>
            <div class="ml-14">
              <v-btn :disabled="!save" :loading="loading" variant="flat" color="primary" @click="handleSave">
                {{ form.id ? "Update" : "Save" }}
              </v-btn>
            </div>
          </div>
        </div>
        <div class="panel border rounded mb-4">
          <v-row align="center">
            <v-col cols="3">
              <v-text-field v-model="form.name" color="#333" label="Customer Name" :disabled="!save" density="default"
                variant="underlined" placeholder="Customer Name" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="form.code" color="#333" label="Customer Code" :disabled="!save" density="default"
                variant="underlined" placeholder="Customer Code" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="form.customer_type" color="#333" label="Customer Type" :disabled="!save" density="default"
                variant="underlined" placeholder="Customer Type" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="form.group" color="#333" label="Customer Group" :disabled="!save" density="default"
                variant="underlined" placeholder="Customer Group" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="form.desc" color="#333" label="Customer Desc" :disabled="!save" density="default"
                variant="underlined" placeholder="Customer Desc" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="form.coh_code" color="#333" label="Coh Code" :disabled="!save" density="default"
                variant="underlined" placeholder="Coh Code" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
          </v-row>
        </div>
        <v-card title="Cust_Attr" class="mb-4 border rounded pa-4">
          <v-row v-for="(attr, index) in form.cust_attr" :key="index" align="center">
            <v-col cols="3">
              <v-text-field v-model="attr.code" color="#333" label="Code" :disabled="!save" density="default"
                variant="underlined" placeholder="Cust Attr Code" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="attr.value" color="#333" label="Value" :disabled="!save" density="default"
                variant="underlined" placeholder="Cust Attr Value" bg-color="white" clearable class="mt-4">
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, toRaw } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { toast } from "vue3-toastify";
  import API from "./api";
import { delay } from "xe-utils";
  
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const save = ref(true);
  
  const form = ref({
    id: undefined,
    code: undefined,
    customer_type: undefined,
    group: undefined,
    name: undefined,
    desc: undefined,
    coh_code: undefined,
    cust_attr: [],
  });
  
    form.value.cust_attr.push({
        code: undefined,
        value: undefined
    })

  
    const handleSave = async () => {
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.add(params);
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center"
    });
    setTimeout(() => {
      router.back();
    }, 2000); 
  } catch (res) {
    toast.error(params.id ? "Update Fail: " + res?.response?.data?.detail : "Create Fail: " + res?.response?.data?.detail, { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};
  
  const getDetailById = (id) => {
    return API.get(id).then(res => {
      const { status, data } = res;
      if (status === 200) {
        save.value = false;
        form.value = data;
      } else {
        toast.error('Error loading data.', { autoClose: 60000 });
      }
    });
  };
  
  if (route.query.id) {
    getDetailById(route.query.id);

  }
  </script>
  
  <style lang="scss" scoped>
  .detail-content {
    .panel {
      position: relative;
      background-color: #ffffff;
      padding: 16px;
  
      &-action {
        position: absolute;
        top: 10px;
        right: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        z-index: 1;
      }
    }
  }
  </style>
