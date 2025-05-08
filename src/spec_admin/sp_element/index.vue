<template>
  <v-container fluid>

    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <SpecCode label="Spec Code" v-model="table.options.spec_code" variant="underlined" density="default"
            :hide-details="false" @change="handleItemChange($event, 'spec_id')"></SpecCode>
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
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server show-current-page :headers="headers" :items="table.rows.items"
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
import API from './api';
import SpecCode from "@/components/picker/SpecCode.vue";

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
    spec_id: undefined,
    spec_code: undefined,
  },

  loading: false,
});


const headers = [
  { title: "Display Seq", value: "display_seq", sortable: true },
  { title: "Spec Code", key: "spec.spec_code", value: (item) => item.spec?.spec_code, sortable: true },
  { title: "Spec Version", key: "spec.version", value: (item) => item.spec?.version, sortable: false },
  { title: "Mill Code", key: "spec.mill.code", value: (item) => item.spec?.mill?.code, sortable: false },
  { title: "Formula Code", key: "formula.formula_code", value: (item) => item.formula?.formula_code, sortable:false},
  { title: "NB Ext Spec", value: "nb_ext_spec", sortable: true },      
  { title: "Quality Code", value: "quality_code", sortable: true },
  { title: "CD Char", value: "cd_char", sortable:true},
  { title: "CD Param", value: "cd_param", sortable:true},
  { title: "DS Param", value: "ds_param", sortable:true},
  { title: "NM Param", value: "nm_param", sortable:true},
  { title: "VL Min", value: "vl_min", sortable:true},
  { title: "VL Max", value: "vl_max", sortable:true},
  { title: "VL Fix", value: "vl_fix", sortable:true},
  { title: "CD Uom", value: "cd_uom", sortable:true},
  { title: "TX Obs", value: "tx_obs", sortable:true},
  { title: "NB Grade Rev", value: "nb_grade_rev", sortable:true},
  { title: "Grade Type", value: "grade_type", sortable:true},
  { title: "CD Grade", value: "cd_grade", sortable:true},
  { title: "Created by", value: "created_by", sortable: true },
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
