<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row>
        <v-col cols="2">
          <RollingCode
              v-model="pickerShow.rolling_code"
              label="Search By Rolling"
              :hide-details="false"
              @change="handlePickRollingCode"
          />
        </v-col>
        <v-col cols="2">
          <CastCode
              v-model="pickerShow.cast_code"
              label="Search By Cast"
              :hide-details="false"
              @change="handlePickCastCode"
          />
        </v-col>
        <v-col cols="2">
          <RunoutCode
              v-model="pickerShow.runout_code"
              label="Search By Runout"
              :hide-details="false"
              @change="handlePickRunoutCode"
          />
        </v-col>
        <v-col cols="6">
          <div class="d-flex ga-4 align-center pt-3">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              {{ $t("global.reset") }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                v-permission="`Search`"
            >
              {{ $t("global.search") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="text-none"
              color="primary"
              density="default"
              variant="flat"
              @click="handleEdit(undefined)"
              v-permission="`Create`"
          >
            {{ $t("global.new") }}
          </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="pa-4" elevation="0" variant="outlined">
      <v-data-table-server
        fixed-header
        height="650"
        :items-per-page="queryParams.itemsPerPage"
        :page="queryParams.page"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        item-value="id"
        @update:page="handleTableChangePage"
        @update:itemsPerPage="handleTableChangeItemsPerChange"
        @update:sortBy="handleTableChangeSortBy"
      >
        <template v-slot:item.runout_code="{ item }">
          <router-link
            class="text-decoration-none grey-darken-4"
            :to="{ name: 'RunoutDetail', query: { runout_id: item.id, runout_code: item.runout_code } }"
          >
            {{ item.runout_code }}
            <v-icon class="mdi mdi-file-document-arrow-right"></v-icon>
          </router-link>
        </template>
        <template v-slot:item.rolling.rolling_code="{ item }">
          <router-link
            class="text-decoration-none grey-darken-4"
            :to="{ name: 'RollingDetail', query: { id: item.rolling_id } }"
          >
            {{ item.rolling?.rolling_code }}
          </router-link>
        </template>
        <template v-slot:item.cast_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                        :to="{ name: 'CastChemicalDetail', query: { id: item.cast?.id } }">
            <span class="w-100 d-inline-block">{{ item.cast?.cast_code }}</span>
          </router-link>
        </template>
        <template v-slot:item.semi.semi_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                        :to="{ name: 'SemiDetailTable', query: { id: item.semi?.id } }">
            <span class="w-100 d-inline-block">{{ item.semi?.semi_code }}</span>
          </router-link>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn variant="text" icon="mdi-pencil" @click="handleEdit(item)" v-permission="`Detail`"/>
          <v-dialog max-width="400" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn variant="text" icon="mdi-delete" v-bind="activatorProps" v-permission="`Delete`"/>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card prepend-icon="mdi-help-circle-outline" text="Deletion is irreversible"
                title="Confirm to delete data?">
                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="isActive.value = false">
                    {{ $t("global.cancel") }}
                  </v-btn>
                  <v-btn class="text-none" color="primary" variant="flat" @click="handleDelete(isActive, item)">
                    {{ $t("global.confirm") }}
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
<script name="RunoutList" setup>
import {useRoute, useRouter} from "vue-router";
import {computed, getCurrentInstance, inject, onMounted, reactive, ref, toRaw, toRefs, watch} from "vue";
import { toast } from "vue3-toastify";
import {formatDate} from "@/util/util";
import API from "./api";
import RollingCode from "@/components/picker/RollingCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const {proxy} = getCurrentInstance();

const data = reactive({
  serverItems: [],
  loading: false,
  totalItems: 0,
  queryParams: {
    q: null,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
  searchOptions: {
    rolling_id: null,
    cast_id: null,
    id: null,
  },
  pickerShow: {
    rolling_code: null,
    cast_code: null,
    runout_code: null,
  }
});

const { serverItems, loading, totalItems, queryParams, searchOptions, pickerShow } = toRefs(data);
const headers = computed(() => [
  { title: t('runout.table.action'), key: "action", width: 130, fixed: true, sortable: false, align: "center" },
  { title: t("runout.table.runout_no"), key: "runout_code" },
  { title: t("runout.table.rolling_no"), key: "rolling.rolling_code", value: (item) => item.rolling?.rolling_code || "--" },
  { title: t("runout.table.cast_no"), key: "cast.cast_code", value: (item) => item.cast?.cast_code || "--" },
  { title: t("runout.table.semi_no"), key: "semi.semi_code", value: (item) => item.semi?.semi_code || "--" },
  { title: t("runout.table.furnace_seq_no"), key: "furnace_sequence_number" },
  { title: t("runout.table.shift_no"), key: "shift_code" },
  { title: t("runout.table.defect"), key: "scrap_defect_reason_code" },
  {
    title: t("runout.table.created_at"),
    key: "created_at",
    sortable: true,
    value: (item) => formatDate(item.created_at),
    minWidth: 180
  },
]);
function getData() {
  const params = {
    ...toRaw(queryParams.value)
  };
  params.fields = [];
  params.ops = [];
  params.values = [];

  if (searchOptions.value.rolling_id) {
    params.fields.push("rolling_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.rolling_id);
  }
  if (searchOptions.value.cast_id) {
    params.fields.push("cast_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.cast_id);
  }
  if (searchOptions.value.id) {
    params.fields.push("id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.id);
  }

  loading.value = true;
  API.getAll(params).then(res => {
    totalItems.value = res.data.total || 0;
    serverItems.value = res.data.items || [];
  }).finally(() => {
    loading.value = false;
  });
}

const handlePickRollingCode = (item) => {
  searchOptions.value.rolling_id = item?.id;
}

const handlePickCastCode = (item) => {
  searchOptions.value.cast_id = item?.id;
}

const handlePickRunoutCode = (item) => {
  searchOptions.value.id = item?.id;
}

const handleTableChangePage = (page) => {
  queryParams.value.page = page;
  getData();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleTableChangeSortBy = (sortBy) => {
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  getData();
}

function handleEdit(data) {
  let runout_id = null;
  if (data && data.id) {
    runout_id = data.id;
  }
  router.push({ path: "/runout_detail",  query: { runout_id: runout_id , runout_code: data?.runout_code} });
}

function handleError(error) {
  if (error.response) {
      toast.error(error.response.data?.detail, { autoClose: 60000 })
    } else {
      console.log(error)
    }
    return false
}

function handleDelete(isActive, row) {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("delete runout successfully.", {
        position: "bottom-center"
    })
    getData();
  }).catch(error => {
    handleError(error)
  });
}

const handleSearch = () => {
  getData();
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  searchOptions.value.rolling_id = null;
  searchOptions.value.cast_id = null;
  searchOptions.value.runout_id = null;
  handleSearch();
}

if (route.query.cast_id && route.query.cast_code) {
  searchOptions.value.cast_id = route.query.cast_id;
  pickerShow.value.cast_code = route.query.cast_code;
}

if (route.query.rolling_id && route.query.rolling_code) {
  searchOptions.value.rolling_id = route.query.rolling_id;
  pickerShow.value.rolling_code = route.query.rolling_code;
}

onMounted(() => {
  getData();
})

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
