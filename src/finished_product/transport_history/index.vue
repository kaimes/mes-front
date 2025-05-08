<template>
  <v-container fluid class="content">
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field v-model="queryParams.q" append-icon="search"
                        placeholder="Search By Transport No."
                        single-line hide-details clearable variant="underlined"
                        @keyup.enter="handleSearch"
          />
        </v-col>
        <v-col cols="3">
          <dict-code
              v-model="queryParams.action"
              hide-details
              variant="underlined"
              label="Action"
              bg-color="white"
              code="transport_history_action"
              multiple
              chips
              clearable
          />
        </v-col>
        <v-col cols="3">
          <v-select
              v-model="queryParams.week_number"
              label="Week Number"
              hide-details
              variant="underlined"
              bg-color="white"
              :items="weeks"
              clearable
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none ml-4"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            {{ $t('global.reset') }}
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 my-1"
              color="primary"
              variant="flat"
              :loading="loading"
              v-permission="`Search`"
          >
            {{ $t('global.search') }}
          </v-btn>
        </v-col>
      </v-row>

    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          min-height="300"
          height="630"
          :headers="headers"
          :items="items"
          :items-length="total"
          :loading="loading"
          @update:options="changeTable"
          item-value="id"
          fixed-header
          show-current-page

      >
        <template v-slot:[`item.uuid`]="{ item }">
          <v-tooltip bottom max-width="300px" :text="item.uuid">
            <template v-slot:activator="{ props }">
              <a class="uuid-clickable" v-bind="props" @click="copyUUID(item.uuid)">
                {{ item.uuid.length > 8 ? item.uuid.substring(0, 8) + '...' : item.uuid }}
              </a>
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, toRaw, getCurrentInstance, computed } from 'vue';
import Utils from '@/util/index';
import { toast } from "vue3-toastify";
import moment from "moment";
import DictCode from "@/components/picker/DictCode.vue";
import Api from './api';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { proxy } = getCurrentInstance();
const loading = ref(false);
const items = ref([]);
const total = ref(0);
const weeks = ref(Utils.generateWeekOptions());
const queryParams = reactive({
  q: undefined,
  week_number: moment().week(),
  page: 1,
  itemsPerPage: 10,
  sortBy: ['created_at'],
  descending: [true],
  action: null,
  fields: [],
  ops: [],
  values: [],
});

const UpdateStartDate = (res) => {
  if (res) {
    queryParams.start_date = moment(res).format("YYYY-MM-DD");
  }
}

const UpdateEndDate = (res) => {
  if (res) {
    queryParams.end_date = moment(res).format("YYYY-MM-DD");
  }
}

const headers = computed(() => [
  { title: t('transport.table.action'), value: 'action', sortable: true },
  { title: t('transport.table.transport_no'), value: 'transport.code', sortable: true },
  { title: t('transport.table.week_number'), value: 'week_number', sortable: true, minWidth: 40 },
  { title: t('transport.table.status'), value: 'status', sortable: true },
]);

const getAll = async () => {
  loading.value = true;
  const params = {
    ...toRaw(queryParams)
  };

  if (params.action) {
    const action = params.action;
    delete params.action;
    params.fields.push("action");
    params.ops.push("in");
    params.values.push(action);
  }
  try {
    console.log(params);
    const response = await Api.getAll(params);
    items.value = response.data.items;
    total.value = response.data.total;
  } catch (error) {
    toast.error('Failed to get data', { autoClose: 60000 });
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  queryParams.page = 1;
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

const handleSearch = () => {
  queryParams.page = 1;
  getAll();
}

const changeTable = ({ page, itemsPerPage, sortBy }) => {
  queryParams.page = page;
  if (itemsPerPage !== queryParams.itemsPerPage) {
    queryParams.page = 1;
  }
  queryParams.itemsPerPage = itemsPerPage;
  if (sortBy.length === 0) {
    queryParams.sortBy = ['created_at'];
    queryParams.descending = [true];
  } else {
    queryParams.sortBy = sortBy;
  }
  getAll();
}

const copyUUID = (uuid) => {
  navigator.clipboard.writeText(uuid).then(() => {
    toast.success(`copy uuid ${uuid} successful`, {
      position: "bottom-center"
    });
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};
</script>
<style scoped>

.uuid-clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}

.uuid-clickable:hover {
  opacity: 0.8;
}

.uuid-clickable:active {
  opacity: 0.6;
}
</style>
