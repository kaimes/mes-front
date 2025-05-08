<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row>
        <v-col cols="3">
        <v-text-field
            v-model="queryParams.q"
            append-icon="search"
            label="Search By Code, Name"
            single-line
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="3">
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
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
              :loading="loading"
              v-permission="`Search`"
          >
            {{ $t("global.search") }}
          </v-btn>
        </v-col>
        <v-col cols="3"></v-col>
        <v-spacer />
        <v-col cols="3" class="text-end">
          <v-btn
              class="text-none ml-4"
              color="primary"
              variant="flat"
              @click="handleEdit(undefined)"
              v-permission="`Create`"
          >
            {{ $t("global.new") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          height="650"
          show-current-page
          min-height="300"
          items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          @update:options="handleTableChange"
      >
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
              variant="text"
              icon="mdi-pencil"
              @click="handleEdit(item)"
              v-permission="`Detail`"
          />
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
                    {{ $t("global.cancel") }}
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleDelete(isActive, item)"
                  >
                    Confirm
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
    <EditForm ref="editFormRef" @refresh="handleSearch" />
  </v-container>
</template>
<script name="BendTestDetails" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs, computed} from "vue";
import {toast} from "vue3-toastify";
import useCommonStore from "@/app/common";
import EditForm from "./components/editForm.vue";
import API from "./api";
import { useI18n } from "vue-i18n";

const commonStore = useCommonStore();
const route = useRoute();
const { t } = useI18n();
const snackbar = inject('snackbar');
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = computed(() => [
  { title: t("hold_reason.table.action"), key: "action", width: 130, fixed: true },
  { title: t("hold_reason.table.mill_code"), key: "mill.code" },
  { title: t("hold_reason.table.code"), key: "code" },
  { title: t("hold_reason.table.type"), key: "type" },
  { title: t("hold_reason.table.name"), key: "name" },
  { title: t("hold_reason.table.desc"), key: "desc" },
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    q: "",
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  form: {
    beforeCode: undefined,
    afterId: undefined,
    afterCode: undefined,
  },
});

const {queryParams, form} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handleTableChange = ({page, itemsPerPage}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleSearch = () => {
  queryParams.value.page = 1;
  getData();
}
const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

// 创建新数据
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success(
      "Delete Success",
      {
        position: "bottom-center"
      }
    );
    getData();
  });
}

const handleSpecChange = (spec, key) => {
  console.log("handleSpecChange", spec, key);
  
  form.value[`${key}`] = spec.spec_code;
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
