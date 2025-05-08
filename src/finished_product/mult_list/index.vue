<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <RunoutCode
            v-model="runout_code"
            label="Runout Code"
            @change="handlePickRunoutCode"
          />
        </v-col>
        <v-col cols="2">
          <AdviceCode v-model="advice_id" variant="underlined" density="default" hide-details @change="handlePickAdviceCode"></AdviceCode>
        </v-col>
        <v-col cols="2">
          <Area
              v-model="area_code"
              label="Area"
              :hide-details="true"
              class="mt-4"
              :code="site_code"
          />
        </v-col>
        <v-col cols="4">
          <div class="d-flex ga-4 align-center pt-3 mt-3">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              {{ $t('global.reset') }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                v-permission="`Search`"
            >
              {{ $t('global.search') }}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="2" class="d-flex justify-end mt-3">
          <v-btn
            class="text-none "
            color="primary"
            variant="flat"
            :disabled="confirmBtnDisabled"
            @click="handleConfirm"
            v-permission="`Confirm`"
          >
          {{ $t('mult.button.confirm') }}
        </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-card-text>
        <v-data-table-server
          v-model="selectedItems"
          fixed-header
          height="650"
          show-select
          return-object
          show-current-page
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :page="searchOptions.page"
          :items-per-page="searchOptions.itemsPerPage"
          :loading="loading"
          @update:page="handleTableChangePage"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"
        >

          <template v-slot:item.runout.runout_code="{ item }">
            <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                          :to="{ name: 'RunoutDetail', query: { runout_id: item.runout?.id } }">
              <span class="w-100 d-inline-block">{{ item.runout?.runout_code }}</span>
            </router-link>
          </template>
          <template v-slot:item.area_code="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip size="small" v-if="false">
                En-Route
              </v-chip>
              <span v-else="true">
              {{ item.area?.code }}
            </span>
            </div>
          </template>
          <template v-slot:item.loads="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.loads" :key="tag.id" size="small">
                {{ tag.code }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.exist_flag="{ item }">
            <v-chip
              v-if="item.exist_flag !== null"
              size="small"
              :color="item.exist_flag == 'Y' ? 'primary' : 'green'"
            >
              {{ item.exist_flag == 'Y' ? "Waiting" : "Done" }}
            </v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <router-link
              class="text-decoration-none grey-darken-4 mr-2"
              :to="{ name: 'multDetail', query: { mult_id: item.id } }">
              <v-icon small>mdi-file-document-arrow-right</v-icon>
            </router-link>
          </template>
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script name="MultList" setup>
import { getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs, watch, computed } from "vue";
import { toast } from "vue3-toastify";
import API from "./api";
import { formatDate } from "@/util/util";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import LoadCode from "@/components/picker/LoadCode.vue";
import AdviceCode from "@/components/picker/AdviceCode.vue";
import Area from "@/finished_product/finished_product/components/picker/Area.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { proxy } = getCurrentInstance();

const data = reactive({
  selectedItems: [],
  serverItems: [],
  loading: false,
  totalItems: 0,
  searchOptions: {
    q: null,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  runout_id: null,
  runout_code: null,
  load_id: null,
  load_code: null,
  advice_id: null,
  advice_code: null,
  area_code: null,
  site_code: null,
});

const {
  selectedItems,
  serverItems,
  loading,
  totalItems,
  searchOptions,
  runout_id,
  runout_code,
  load_id,
  load_code,
  advice_id,
  advice_code,
  area_code,
  site_code,
} = toRefs(data);

const headers = computed(() => [
  { title: t('mult.table.action'), key: "action", minWidth: 130, fixed: true, sortable: false, align: "center" },
  { title: t('mult.table.code'), key: "code" },
  { title: t('mult.table.runout_code'), key: "runout.runout_code" },
  { title: t('mult.table.length'), key: "length_mm" },
  { title: t('mult.table.area_code'), key: "area_code" },
  { title: t('mult.table.load'), key: "loads", sortable: false },
  { title: t('mult.table.advice_no'), key: "advice[0].advice_code", sortable: false },
  { title: t('mult.table.mults'), key: "mult_code" },
  { title: t('mult.table.spec_code'), key: "spec.spec_code", value: (item) => item.spec?.spec_code || "--" },
  { title: t('mult.table.multed_at'), key: "mult_datetime", value: (item) => formatDate(item.mult_datetime) },
  { title: t('mult.table.multed_confirm_at'), key: "mult_confirm_datetime", value: (item) => formatDate(item.mult_confirm_datetime) },
  { title: t('mult.table.status'), key: "exist_flag" },
]);

const confirmBtnDisabled = computed(() => {
  return selectedItems.value.length === 0 || selectedItems.value.some(item => item.mult_type !== 'M' || item.exist_flag !== 'Y');
});

function loadItems() {
  const params = {
    ...toRaw(searchOptions.value)
  };
  params.fields = ["mult_type"];
  params.ops = ["eq"];
  params.values = ["M"];
  if (runout_id.value) {
    params.fields.push("runout_id");
    params.ops.push("eq");
    params.values.push(runout_id.value);
  }
  if (load_code.value) {
    params.load_id = load_code.value;
  }
  if (advice_id.value) {
    params.fields.push("advice_id");
    params.ops.push("eq");
    params.values.push(advice_id.value);
  }
  if (area_code.value) {
    params.area_code = area_code.value;
  }
  loading.value = true;
  API.getAll(params).then(res => {
    totalItems.value = res.data.total || 0;
    serverItems.value = res.data.items || [];
  }).finally(() => {
    loading.value = false;
  });
}

const handleTableChangePage = (page) => {
  searchOptions.value.page = page;
  loadItems();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  searchOptions.value.itemsPerPage = itemsPerPage;
  loadItems();
}

const handleTableChangeSortBy = (sortBy) => {
  searchOptions.value.sortBy = sortBy;
  loadItems();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  runout_id.value = null;
  runout_code.value = null;
  load_id.value = null;
  load_code.value = null;
  advice_id.value = null;
  advice_code.value = null;
  handleSearch();
}

const handleSearch = () => {
  selectedItems.value = [];
  if (!runout_code.value) {
    runout_id.value = null;
  }
  loadItems();
}

function handlePickRunoutCode(runout_item) {
  runout_id.value = runout_item?.id;
  runout_code.value = runout_item?.runout_code;
}

function handlePickLoadCode(item) {
  load_id.value = item.id;
  load_code.value = item.code;
}

function handlePickAdviceCode(item) {
  advice_id.value = item.id;
  advice_code.value = item.code;
}

function handleError(error) {
  if (error.response) {
    toast.error(error.response.data?.detail, { autoClose: 60000 });
  } else {
    console.log(error);
  }
  return false;
}

function handleConfirm() {
  if (selectedItems.value.length === 0) {
    toast.error("Please select one mult to confirm.", { autoClose: 60000 });
    return;
  }
  const params = {
    ids: [],
  };
  params.ids = selectedItems.value.map(item => item.id);
  return API.confirmMult(params).then((resp) => {
    toast.success("confirm mult successfully.", {
      position: "bottom-center"
    });
    loadItems();
  }).catch(error => {
    handleError(error);
  });
}

loadItems();
</script>
<style lang="scss" scoped>
.page {
  .section-field {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-input {
      flex: 1;
      flex-shrink: 0;
    }

    &-divider {
      width: 20px;
      height: 2px;
      background-color: #333;
      margin: 0 10px;
    }
  }
}
</style>
