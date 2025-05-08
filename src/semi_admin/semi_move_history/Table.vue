<template>
  <v-container fluid>
    <v-row align="center" @keydown.enter="handleSearch">
      <v-col cols="3">
        <v-text-field
            v-model="queryParams.q"
            :label="$t('semi_history.search_by_semi_code_uuid_rolling_code_location')"
            variant="underlined"
            bg-color="white"
            hide-details
            clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <dict-code
            v-model="queryParams.change_type"
            hide-details
            variant="underlined"
            :label="$t('global.action')"
            placeholder="Select Action"
            bg-color="white"
            code="semi_history_action"
            multiple
            chips
            clearable
        />
      </v-col>
      <v-col cols="2">
        <VueDatePicker @update:model-value="UpdateStartDate" :teleport="true" :enable-time-picker="false" >
          <template #trigger>
            <v-text-field
                v-model="queryParams.start_date"
                :label="$t('semi_history.start_date')"
                hide-details
                readonly
            ></v-text-field>
          </template>
        </VueDatePicker>
      </v-col>
      <v-col cols="2">
        <VueDatePicker @update:model-value="UpdateEndDate" :teleport="true" :enable-time-picker="false">
          <template #trigger>
            <v-text-field
                v-model="queryParams.end_date"
                :label="$t('semi_history.end_date')"
                readonly
                hide-details
            ></v-text-field>
          </template>
        </VueDatePicker>
      </v-col>
      <v-col cols="2">
        <v-btn
            type="submit"
            class="text-none mt-4"
            color="primary"
            variant="flat"
            :loading="loading"
            @click="handleSearch"
        >
          {{ $t('global.search') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-2 pl-4 pr-4" elevation="0" variant="outlined">
      <div class="d-flex align-center">
        <v-spacer />
        <v-btn
            variant="text"
            icon="mdi-menu"
            @click="handleOpen"
        />
      </div>
      <v-data-table-server
          fixed-header
          height="650"
          min-height="300"
          :headers="headers"
          :items="items"
          :items-length="total"
          :loading="loading"
          @update:options="updateTable"
          item-value="id"
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
    <MesTable ref="tableRef" name="semi_move_history"  v-model="headers" />
  </v-container>
</template>

<script setup>
import {getCurrentInstance, onMounted, reactive, ref, toRaw, watch, computed} from 'vue';
import {formatDate} from '@/util/util';
import Api from "@/semi_admin/semi_move_history/api"
import {toast} from "vue3-toastify";
import moment from "moment";
import DictCode from "@/components/picker/DictCode.vue";
import MesTable from "@/components/table/index.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const {proxy} = getCurrentInstance();

const loading = ref(false);
const items = ref([]);
const total = ref(0);
const queryParams = reactive({
  q: undefined,
  page: 1,
  itemsPerPage: 10,
  sortBy: ['created_at'],
  descending: [true],
  start_date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
  end_date: moment().add(1, 'days').format("YYYY-MM-DD"),
  change_type: null,
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


const tableHeadersDefinition = ref([
  {title: 'semi_history.table.uuid', value: 'uuid', sortable: true},
  {title: 'semi_history.table.action', value: 'change_type', sortable: true},
  {title: 'semi_history.table.semi_code', value: 'code', sortable: true},
  {
    title: 'semi_history.table.created_at', key: 'created_at', sortable: true,
    value: (item) => formatDate(item['created_at']), minWidth: 180,
  },
  {title: 'semi_history.table.created_by', value: 'created_by', sortable: true},
  {title: 'semi_history.table.cast_no', value: 'cast_no', sortable: true},
  {title: 'semi_history.table.area_no', value: 'area_no', sortable: true},
  {title: 'semi_history.table.site_no', value: 'site_no', sortable: true},
  {title: 'semi_history.table.location', value: 'location', sortable: true},
  {title: 'semi_history.table.rolling_code', value: 'rolling_code', sortable: true},
  {title: 'semi_history.table.order_group_code', value: 'order_group_code', sortable: true},
  {title: 'semi_history.table.semi_charge_seq', value: 'semi_charge_seq', sortable: true},
  {title: 'semi_history.table.defect_qty', value: 'defect_quantity', sortable: true},
  {title: 'semi_history.table.semi_type', value: 'semi_type', sortable: true},
  {title: 'semi_history.table.skelp_code', value: 'skelp_code', sortable: true},
  //{title: 'Weight Flag', value: 'weight_flag', sortable: true},
  //{title: 'Furnace Seq', value: 'furnace_seq', sortable: true},
  //{title: 'Charge Time', value: 'charge_time', sortable: true},
  //{title: 'Charge Date', value: 'charge_date', sortable: true},
  {title: 'semi_history.table.comment', value: 'comment', sortable: true},
  //{title: 'Quantity', value: 'quantity', sortable: true},
  //{title: 'Charge Seq', value: 'charge_seq', sortable: true},
  //{title: 'Stock In Date', value: 'stock_in_date', sortable: true},
  {title: 'semi_history.table.semi_cut_seq', value: 'semi_cut_seq', sortable: true},
  //{title: 'Product Type', value: 'product_type', sortable: true},
  {title: 'semi_history.table.quality_code', value: 'quality_code', sortable: true},
  {title: 'semi_history.table.width', value: 'width_mm', sortable: true},
  {title: 'semi_history.table.length', value: 'length_mm', sortable: true},
  //{title: 'Orig Length (mm)', value: 'orig_length_mm', sortable: true},
  {title: 'semi_history.table.thickness', value: 'thickness_mm', sortable: true},
  {title: 'semi_history.table.estimated_weight', value: 'estimated_weight_kg', sortable: true},
  {title: 'semi_history.table.scarfed_status', value: 'scarfed_status', sortable: true},
  {title: 'semi_history.table.defect_reason', value: 'defect_reason', sortable: true},
  {title: 'semi_history.table.rework_comment', value: 'rework_comment', sortable: true},
  {title: 'semi_history.table.rework_type', value: 'rework_type', sortable: true},
]);
const headers = computed(() => {
    return tableHeadersDefinition.value.map(header => ({
      ...header,
      title: header.title.includes('.') ? t(header.title) : header.title
    }));
  });
const getAll = async () => {
  loading.value = true;
  const params = {
    ...toRaw(queryParams)
  };
  if (params.change_type) {
    const change_type = params.change_type;
    delete params.change_type;
    params.fields = ["change_type"]
    params.ops = [ "in" ]
    params.values = [ change_type ];
  }
  try {
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

const handleSearch = () => {
  queryParams.page = 1;
  getAll();
}


const updateTable = ({page,itemsPerPage,sortBy}) =>{
  queryParams.page = page;
  if (itemsPerPage !== queryParams.itemsPerPage){
    queryParams.page = 1;
  }
  queryParams.itemsPerPage = itemsPerPage;
  if (sortBy.length === 0) {
    queryParams.sortBy = ['created_at'];
    queryParams.descending = [true];
  }else{
    queryParams.sortBy = [sortBy[0].key];
    queryParams.descending = [sortBy[0].order === 'desc'];
  }
  getAll();
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
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
