<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <RollingCode
              v-model="queryParams.rolling_id"
              :rolling="rolling"
              label="Rolling Code"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          />
        </v-col>
        <v-col cols="3">
          <CastCode
              v-model="queryParams.cast_id"
              :cast="cast"
              label="Cast No"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable/>
        </v-col>
        <v-col cols="3">
          <RunoutCode
              v-model="queryParams.runout_id"
              :runout="runout"
              label="Runout Code"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          />
        </v-col>
        <v-col cols="3">
          <div class="d-flex ga-4 align-center">
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
            <v-btn
                v-if="defaultMillCode !== 'SRSM'"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loadCover"
                @click="handleCover"
                v-permission="`Run Covering`"
            >
              Cover
            </v-btn>
          </div>

        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4 pa-2 position-sticky" elevation="0" variant="outlined">
      <v-data-table-server
          min-height="300"
          :headers="headers"
          :items="items"
          :loading="loading"
          item-value="id"
          :items-length="totalItems"
          fixed-header
          v-model:model-value="selectItem"
          :items-per-page="curPerPage"
          :page="curPage"
          @update:page="handleTableChangePage"
          @update:items-per-page="handleTableChangeItemsPerChange"
          
      >
        <template v-slot:item.runout_code="{ item }">
          <router-link :to="{ name: 'RunoutDetail', query: { runout_id: item.runout_id , runout_code: item.runout_code} }">{{ item.runout_code }}</router-link>
        </template>


        <template v-slot:item.test_sample_flag="{ item }">
          <v-chip v-for="flag in item.test_sample_flag" :key="flag" size="small">
            {{ flag }}
          </v-chip>
        </template>

        <template v-slot:item.inspectors="{ item }">
          <v-chip v-for="flag in item.inspectors" :key="flag" size="small">
            {{ flag }}
          </v-chip>
        </template>


        <template v-slot:item.tensiles="{ item }">
          <v-data-table
              :headers="tensileHeaders"
              :items="item.tensiles"
              hide-default-footer
              hide-default-header
              hide-no-data
          >
            <template v-slot:item.kg="{ item }">
              <span v-if="item.type !== 'Y'">
                {{ (item.kg / 1000.0).toFixed(3) }}
              </span>
              <span v-else>
                <!-- ASTM: weight not shown -->
              </span>
            </template>
          </v-data-table>
        </template>

        <template v-slot:item.impacts="{ item }">
          <v-data-table
              :headers="impactHeaders"
              :items="item.impacts"
              hide-default-footer
              hide-default-header
              hide-no-data
          >
            <template v-slot:item.kg="{item}">
              {{ (item.kg/1000.0).toFixed(3) }}
            </template>
          </v-data-table>
        </template>

      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script setup>
import {reactive, ref, toRaw, onBeforeMount, computed} from 'vue';
import Api from "./api"
import {toast} from "vue3-toastify";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
import {useStore} from "vuex";
import { cloneDeep } from "lodash";
import { useI18n } from "vue-i18n";


const { t } = useI18n()

const route = useRoute();
const router = useRouter();
const store = useStore();

const loading = ref(false);
const loadCover = ref(false)
const items = ref([]); // 当前页显示的数据
const selectItem = ref([])
const curPage = ref(1);
const curPerPage = ref(10);
const totalItems = ref(0);
const sortBy = ref([]);

const defaultMillCode = computed(() => store.state.auth.defaultMillCode);
const queryParams = reactive({
  runout_id: undefined,
  rolling_id:undefined,
  cast_id:undefined,
});

const runout = ref(undefined)
const rolling = ref(undefined)
const cast = ref(undefined)

const headersDefinition = [
  { title: "test_covering_usage.table.runout_code", value: 'runout_code', sortable: false },
  { title: "test_covering_usage.table.test_sample_flag", value: 'test_sample_flag', sortable: false },
  { title: "test_covering_usage.table.flange_thickness", value: 'flange_thickness', sortable: false },
  { title: "test_covering_usage.table.web_thickness", value: 'web_thickness', sortable: false },
  { title: "test_covering_usage.table.inspectors", value: 'inspectors', sortable: false },
  { title: "test_covering_usage.table.bar_total", value: 'bar_total', sortable: false },
  { title: "test_covering_usage.table.bar_covered", value: 'bar_covered', sortable: false },
  { title: "test_covering_usage.table.tensiles", value: 'tensiles', sortable: false, minWidth: 210 },
  { title: "test_covering_usage.table.impacts", value: 'impacts', sortable: false, minWidth: 210 },

];

const headers = computed(() => {
  return headersDefinition.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});



const tensileHeadersDefinition = [
  { title: "test_covering_usage.table.source", value: 'source_type' },
  { title: "test_covering_usage.table.direction", value: 'unit' },
  { title: "test_covering_usage.table.standard", value: 'type' },
  { title: "test_covering_usage.table.weight", value: 'kg' },
];

const tensileHeaders = computed(() => {
  return tensileHeadersDefinition.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const impactHeadersDefinition = [
  { title: "test_covering_usage.table.unit", value: 'unit' },
  { title: "test_covering_usage.table.temp", value: 'type' },
  { title: "test_covering_usage.table.weight", value: 'kg' },
]

const impactHeaders = computed(() => {
  return impactHeadersDefinition.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});

const getAll = async () => {
  loading.value = true;
  let params = cloneDeep({
    ...toRaw(queryParams)
  });
  params.page = curPage.value;
  params.itemsPerPage = curPerPage.value;

  try {
    const response = await Api.getAll(params);
    let data = response.data.items
    totalItems.value = response.data.total

    data.forEach(item => {
      item.tensiles = item.tensiles.reduce((acc, item) => {
        let { source_type, standard, orientation, covered_weight_kg } = item;
        if (standard === '1' || standard === 'BSEN') {
          standard = 'Z'
        }else if(standard === '2' || standard === 'ASTM'){
          standard = 'Y'
        }else {
          standard = ''
        }
        const existingGroup = acc.find(group => group.type === standard && group.unit === orientation  && group.source_type == source_type);
        if (existingGroup) {
          existingGroup.kg += covered_weight_kg;
        } else {
          acc.push({  type: standard, kg: covered_weight_kg , unit: orientation , source_type: source_type});
        }
        return acc;
      }, []);
      item.impacts = item.impacts.reduce((acc, item) => {
        const { temp_c, covered_weight_kg, temp_units, temp_f } = item;
        const existingGroup = acc.find(group => group.type === temp_c && group.unit === temp_units);
        if (temp_units === 'F'){
         const existingGroup = acc.find(group => group.type === temp_f && group.unit === temp_units);
        }
        if (existingGroup) {
          existingGroup.kg += covered_weight_kg;
        } else {
          acc.push({ type: temp_c, kg: covered_weight_kg, unit: temp_units });
        }
        return acc;
      }, []);

    });
    items.value = data;
  } catch (error) {
    toast.error('Failed to get data',{ autoClose: 60000 });
    console.error("getAll",error);
  } finally {
    loading.value = false;
  }
};

const handleTableChangePage = (page) => {
  curPage.value = page;
  getAll();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  curPerPage.value = itemsPerPage;
  getAll();
}



const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

const handleSearch = () => {
  curPage.value = 1;
  getAll();
}

const handleCover = () => {
  if (!queryParams.rolling_id){
    toast.error('Please select a Rolling',{ autoClose: 60000 });
    return;
  }
  if (!queryParams.cast_id){
    toast.error('Please select a Runout',{ autoClose: 60000 });
    return;
  }
  loadCover.value = true
  Api.updateCover({rolling_id:queryParams.rolling_id,cast_id:queryParams.cast_id}).then((res) => {

    toast.success('Covering Success',{position: "bottom-center"});
    getAll();
  }).catch(() => {
    toast.error('Covering Fail',{ autoClose: 60000 });
  }).finally(() => {
    loadCover.value = false;
  });
}

onBeforeMount(() => {
  if (route.query.rolling_id){
    const rolling_id = parseInt(route.query.rolling_id);
    queryParams.rolling_id = rolling_id;
    rolling.value = {
      rolling_code: route.query.rolling_code,
      id: rolling_id
    }
  }
  if (route.query.cast_id){
    const cast_id = parseInt(route.query.cast_id);
    queryParams.cast_id = cast_id;
    cast.value = {
      cast_code: route.query.cast_code,
      id: cast_id
    }
  
  }
  getAll()
})

</script>

<style scoped>
</style>
