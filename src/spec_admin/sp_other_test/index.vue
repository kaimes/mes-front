<template>
    <v-container fluid>
  
      <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
        <v-row align="center">
          <v-col cols="3">
            <spec-code v-model="table.options.spec_id" />
          </v-col>
          <v-col cols="3">
            <div class="d-flex ga-4 align-center">
              <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
                Reset
              </v-btn>
              <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="table.loading">
                Search
              </v-btn>
            </div>
          </v-col>
  
        </v-row>
      </v-form>
      <v-card class="pa-4" elevation="0" variant="outlined">
        <v-data-table-server fixed-header height="650" show-current-page :headers="headers" :items="table.rows.items"
          :items-length="table.rows.total || 0" v-model:page="table.options.page"
          v-model:items-per-page="table.options.itemsPerPage" v-model:sort-by="table.options.sortBy"
          v-model:sort-desc="table.options.descending" :loading="table.loading" loading-text="Loading... Please wait">
          <template v-slot:[`item.action`]="{ item }">
          </template>
        </v-data-table-server>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import {useRoute, useRouter} from "vue-router";
  import API from './api.js';
  import SpecCode from "@/components/picker/SpecCode.vue";
  import useCommonStore from "@/app/common";

  const commonStore = useCommonStore();
  
  const route = useRoute();
  
  const table = reactive({
    rows: {
      items: [],
      total: null,
    },
    options: {
      q: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: ["display_seq"],
      descending: [false],
      spec_id: commonStore.spec.id,
      spec_code: commonStore.spec.spec_code,
    },
  
    loading: false,
  });
  
  const headers = [
    { title: "Quality Code", value: "quality_code", sortable: true },
    { title: "Spec Code", key: "spec.spec_code", value: (item) => item.spec?.spec_code, sortable: true },
    { title: "Spec Version", key: "spec.version", value: (item) => item.spec?.version, sortable: false },
    { title: "Mill Code", key: "spec.mill.code", value: (item) => item.spec?.mill?.code, sortable: false },
    { title: "CD_Oper", value: "cd_oper", sortable: true },
    { title: "CD_VARI", value: "cd_vari", sortable: true },      
    { title: "VL_QL", value: "vl_ql", sortable: true },      
    { title: "VL_MIN", value: "vl_min", sortable: true },      
    { title: "VL_MAX", value: "vl_max", sortable: true },      
    { title: "VL_FIX", value: "vl_fix", sortable: true },      
    { title: "CD_UOM", value: "cd_uom", sortable: true },      
    { title: "NB_SEQ_OPER_VARI", value: "nb_seq_oper_vari", sortable: true },      
    { title: "ST_QC", value: "st_qc", sortable: true },      
    { title: "VL_MIN_ORIG", value: "vl_min_orig", sortable: true },      
    { title: "VL_MAX_ORIG", value: "vl_max_orig", sortable: true },      
    { title: "VL_FIX_ORIG", value: "vl_fix_orig", sortable: true },      
    { title: "CD_UOM_ORIG", value: "cd_uom_orig", sortable: true },      
    { title: "", value: "action", sortable: false, align: "end" },
  ];
  
  watch(
    () => table.options,
    () => {
      getAll();
    },
    { deep: true }
  );
  
  const getAll = async () => {
    table.loading = true;
    try {
      const response = await API.getAll(table.options);
      table.rows = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      table.loading = false;
    }
  };
  
  const handleSearch = () => {
    getAll();
  };
  
  const handleReset = () => {
    table.options.spec_id = undefined;
    getAll();
  };
  
  
  
  const handleItemChange = (item, key) => {
    table.options.spec_id = item?.id;
  }
  
  
  // Initial load
  onMounted(() => {
    if (route.query.spec_id) {
      table.options.spec_id = route.query.spec_id;
    }
    if (route.query.spec_code) {
      table.options.spec_code = route.query.spec_code;
    }
    getAll();
  });
  
  </script>
  <style>
  .code {
    display: block;
    max-width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .overflow_ellipsis_col {
    display: block;
    max-width: 500px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  </style>
