<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <cast-code v-model="queryParams.cast_id" :cast="queryParams.cast" @change="handleItemChange($event, 'cast_id')" />
        </v-col>
        <v-col cols="3">
          <dict-code
                v-model="queryParams.type"
                hide-details
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                :label="$t('test_jominy.table.type')"
                placeholder="Type"
                code="test_jominy_type"
            />
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
              class="text-none ml-4 mr-4 my-1"
              color="primary"
              variant="flat"
              :loading="loading"
          >
          {{ $t('global.search') }}
          </v-btn>
        </v-col>
        
        <v-spacer />
        <v-col cols="3" class="text-end">
          <router-link v-permission="`Create`" :to="{ path: '/test_jominy/detail' }">
            <v-btn
                class="text-none ml-4"
                color="primary"
                variant="flat"
                v-permission="`Create`"
            >
            {{ $t('global.new') }}
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6" elevation="0" variant="outlined">
          <v-data-table
              :headers="castTableHeaders"
              :items="castTableList"
              density="default"
              max-height="100"
              :items-per-page="-1"
          >
            <template #bottom>
            </template>
            <template v-slot:no-data>
              <div class="text-center pa-4 text-grey">
                {{ $t('test_result_through_thickness_tensile.table.desc_list') }}
              </div>
            </template>
          </v-data-table>
        </v-card>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          show-current-page
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          item-value="id"
          @update:options="handleTableChange"
      >
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:no-data>
          <div class="text-center pa-4 text-grey">
            {{ $t('test_result_through_thickness_tensile.table.desc_list') }}
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <router-link :to="{ path: '/test_jominy/detail', query: { id: item.id } }">
            <v-btn
                variant="text"
                icon="mdi-pencil"
                v-permission="`Detail`"
            />
          </router-link>
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  variant="text"
                  icon="mdi-delete"
                  v-bind="activatorProps"
                  v-permission="`Delete`"
              />
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                  prepend-icon="mdi-help-circle-outline"
                  text="Deletion is irreversible"
                  title="Confirm to delete data?"
              >
                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="text-none"
                      color="#e3e3e3"
                      variant="flat"
                      @click="isActive.value = false"
                  >
                    {{ $t('global.Cancel') }}
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleDelete(isActive, item)"
                  >
                  {{ $t('test_history.table.confirm') }}
                  </v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>
<script name="MainElementAnalysis" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs, computed} from "vue";
import {toast} from "vue3-toastify";
import CastCode from "@/components/picker/CastCode.vue";
import useCommonStore from "@/app/common";
import API from "./api";
import DictCode from "@/components/picker/DictCode.vue";
import { useI18n } from "vue-i18n";


const { t } = useI18n()

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const castLoading = ref(false);

const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "test_jominy.table.mill_code", key: "mill.code"},
  {title: "test_jominy.table.cast_code", key: "cast.cast_code"},
  {title: "test_jominy.table.type", key: "type"},
  {title: "test_jominy.table.s_dst", key: "s_dst"},
  {title: "1", key: "j_1"},
  {title: "1.5", key: "j_1_5"},
  {title: "2", key: "j_2"},
  {title: "3", key: "j_3"},
  {title: "4", key: "j_4"},
  {title: "5", key: "j_5"},
  {title: "6", key: "j_6"},
  {title: "7", key: "j_7"},
  {title: "8", key: "j_8"},
  {title: "9", key: "j_9"},
  {title: "10", key: "j_10"},
  {title: "11", key: "j_11"},
  {title: "12", key: "j_12"},
  {title: "13", key: "j_13"},
  {title: "14", key: "j_14"},
  {title: "15", key: "j_15"},
  {title: "16", key: "j_16"},
  {title: "18", key: "j_18"},
  {title: "20", key: "j_20"},
  {title: "22", key: "j_22"},
  {title: "24", key: "j_24"},
  {title: "25", key: "j_25"},
  {title: "28", key: "j_28"},
  {title: "30", key: "j_30"},
  {title: "32", key: "j_32"},
  {title: "35", key: "j_35"},
  {title: "40", key: "j_40"},
  {title: "45", key: "j_45"},
  {title: "50", key: "j_50"},
]);
const tableList = ref([]);
const total = ref(0);
const tableHeaders = computed(() => {
  return tableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const castTableHeadersDefinition = ref([
  { title: "test_jominy.table.cast_code", key: "cast_code", fixed: true, width: 150, minWidth: 150 },
  // { title: "test_jominy.table.long_cast_code", key: "long_cast_code", width: 180, minWidth: 180 },
  // { title: "test_jominy.table.bos_cast_code", key: "bos_cast_code", width: 180, minWidth: 180 },
  // { title: "test_jominy.table.generation_code", key: "generate_code" },
  // { title: "test_jominy.table.quality_code", key: "quality.code", value: (item) => item.quality?.code, width: 180, minWidth: 180 },
  { title: "test_jominy.table.ch_c", key: "ch_c" },
  { title: "test_jominy.table.ch_si", key: "ch_si" },
  { title: "test_jominy.table.ch_mn", key: "ch_mn" },
  { title: "test_jominy.table.ch_p", key: "ch_p" },
  { title: "test_jominy.table.ch_s", key: "ch_s" },
  { title: "test_jominy.table.ch_cr", key: "ch_cr" },
  { title: "test_jominy.table.ch_mo", key: "ch_mo" },
  { title: "test_jominy.table.ch_ni", key: "ch_ni" },
  { title: "test_jominy.table.ch_al", key: "ch_al" },
  { title: "test_jominy.table.ch_b", key: "ch_b" },
  { title: "test_jominy.table.ch_co", key: "ch_co" },
  { title: "test_jominy.table.ch_cu", key: "ch_cu" },
  { title: "test_jominy.table.ch_nb", key: "ch_nb" },
  { title: "test_jominy.table.ch_sn", key: "ch_sn" },
  { title: "test_jominy.table.ch_ti", key: "ch_ti" },
  { title: "test_jominy.table.ch_v", key: "ch_v" },
  { title: "test_jominy.table.ch_n", key: "ch_n" },
  { title: "test_jominy.table.ch_ca", key: "ch_ca" },
  { title: "test_jominy.table.ch_solal", key: "ch_solal" },
  { title: "test_jominy.table.ch_h", key: "ch_h" },
  { title: "test_jominy.table.ch_as", key: "ch_as" },
  { title: "test_jominy.table.ch_bi", key: "ch_bi" },
  { title: "test_jominy.table.ch_ce", key: "ch_ce" },
  { title: "test_jominy.table.ch_o", key: "ch_o" },
  { title: "test_jominy.table.ch_pb", key: "ch_pb" },
  { title: "test_jominy.table.ch_sb", key: "ch_sb" },
  { title: "test_jominy.table.ch_w", key: "ch_w" },
  { title: "test_jominy.table.ch_zn", key: "ch_zn" },
  { title: "test_jominy.table.ch_zr", key: "ch_zr" },
  { title: "test_jominy.table.ch_te", key: "ch_te" },
  { title: "test_jominy.table.ch_rad", key: "ch_rad" },
  { title: "test_jominy.table.ch_insal", key: "ch_insal" },
  { title: "test_jominy.table.ch_n2", key: "ch_n2" },
]);
const castTableList = ref([]);
const castTotal = ref(0);

const castTableHeaders = computed(() => {
  return castTableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const data = reactive({
  queryParams: {
    cast_id: undefined,
    cast: undefined,
    type: undefined,
    code: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  form: {
    beforeCode: commonStore.spec.spec_code,
    afterId: undefined,
    afterCode: undefined,
  },
});

const {queryParams, form} = toRefs(data);

const getCastID = (id) => {
  const params = {
    // ...toRaw(queryParams.value)
  };
  params["fields"] = []
  params["ops"] = []
  params["values"] = []
  if (id) {
    params["fields"].push("id");
    params["ops"].push("eq");
    params["values"].push(id);
    
  }
  castLoading.value = true;
  API.getCastID(params).then(res => {
    if (res.status === 200) {
      castTotal.value = res.data.total || 0;
      castTableList.value = res.data.items || [];
    } else {
      castTotal.value = 0;
      castTableList.value = [];
    }
  }).finally(() => {
    castLoading.value = false;
  });
}

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  params["fields"] = []
  params["ops"] = []
  params["values"] = []
  if (params.cast_id) {
    params["fields"].push("cast_id");
    params["ops"].push("eq");
    params["values"].push(params.cast_id); 
  }
  if (params.type) {
    params["fields"].push("type");
    params["ops"].push("eq");
    params["values"].push(params.type); 
  }
  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
    } else {
      total.value = 0;
      tableList.value = [];
    }
  }).finally(() => {
    loading.value = false;
  });

  
  
}

const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  getData();
}

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
  const cast_id = queryParams.value.cast_id;
  if(cast_id) {
    getCastID(cast_id);
  }else{
    castTableList.value = [];
  }
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

// 创建新数据
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
}

const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getData();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
  });
}

getData();
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
