<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field v-model="table.options.q" label="Search By Formula Code" variant="underlined" bg-color="white"
            hide-details clearable></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="d-flex ga-4 align-center">
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
              Reset
            </v-btn>
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading">
              Search
            </v-btn>
          </div>
        </v-col>

      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
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
import API from './api';

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
  },

  loading: false,
});

const headers = [
  { title: "Display Seq", value: "display_seq", sortable: true },
  { title: "NR Formula", value: "nr_formula", sortable: true },
  { title: "Formula Code", value: "formula_code", sortable: true },
  { title: "CD Unid Medida", value: "cd_unid_medida", sortable: true },
  { title: "TX Formula", value: "tx_formula", sortable: true },
  { title: "TX Observeacao", value: "tx_observeacao", sortable: true },
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
  table.options.q = undefined;
  getAll();
};


// Initial load
onMounted(() => {
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
