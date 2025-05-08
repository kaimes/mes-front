<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
            <v-text-field
              v-model="queryParams.q"
              append-inner-icon="mdi-magnify"
              label="Search By Transport No."
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none ml-4"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            {{ $t("global.reset") }}
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 my-1"
              color="primary"
              variant="flat"
              :loading="loading"
              v-permission="`Search`"
          >
            {{ $t("global.search") }}
          </v-btn>
        </v-col>
        <v-spacer />
        <v-col cols="3" class="text-end">
          <v-btn
              class="text-none"
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
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center ga-4 mb-4">
        <v-dialog
            max-width="400"
            persistent
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading" v-bind="activatorProps" :disabled="selected.length === 0" v-permission="`Onload`">
              Transport
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card
                prepend-icon="mdi-help-circle-outline"
                text="Transport is irreversible"
                title="Do you confirm?"
            >
              <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="text-none"
                    color="#e3e3e3"
                    variant="flat"
                    @click="isActive.value = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                    class="text-none"
                    color="primary"
                    variant="flat"
                    @click="UpdateOnload(isActive)"
                >
                  Confirm
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog
            max-width="400"
            persistent
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading" v-bind="activatorProps" :disabled="selected.length === 0" v-permission="`Deload`">
              Available
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card
                prepend-icon="mdi-help-circle-outline"
                text="Available is irreversible"
                title="Do you confirm?"
            >
              <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="text-none"
                    color="#e3e3e3"
                    variant="flat"
                    @click="isActive.value = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                    class="text-none"
                    color="primary"
                    variant="flat"
                    @click="UpdateDeload(isActive)"
                >
                  Confirm
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <v-divider />
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
          v-model="selected" 
          show-select 
          return-object
          @update:options="handleTableChange"
      >
        <template v-slot:item.dim="row">
          {{ row.item.dim1 }} - {{ row.item.dim2 }}
        </template>
        <template v-slot:item.status="{ item }">
          <template v-if="item.status">
            <v-chip :color="item.status === 'Transport' ? 'red' : 'green'">
              {{ item.status }}
            </v-chip>
          </template>
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
                    Cancel
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
import TransportCode from "@/components/picker/TransportCode.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const commonStore = useCommonStore();
const route = useRoute();
const snackbar = inject('snackbar');
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableList = ref([]);
const total = ref(0);
const selected = ref([]);

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

const tableHeaders = computed(() => [
  {title: t('global.action'), key: "action", width: 130, fixed: true},
  {title: t('transport.table.mill_code'), key: "mill.code"},
  {title: t('transport.table.transport_no'), key: "code"},
  {title: t('transport.table.type'), key: "type"},
  {title: t('transport.table.length'), key: "length_mm"},
  {title: t('transport.table.weight'), key: "weight_kg"},
  {title: t('transport.table.status'), key: "status"},
]);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items.map(item => {
        return {
          ...item,
          length_mm: item.length_mm / 1000,
          weight_kg: item.weight_kg / 1000,
        }
      })
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
    selected.value = [];
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

const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
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

const handleSpecChange = (spec, key) => {
  form.value[`${key}`] = spec.spec_code;
}

const UpdateOnload = (isActive) => {
  isActive.value = false;
  const params = toRaw(selected.value);
  const ids = params.map(item => item.id);
  if (ids.length === 0) {
    toast.warning("Please Choose Transport List", {
      position: "bottom-center"
    });
    return;
  }
  loading.value = true;
  API.onLoad({"ids": ids}).then(res => {
    if (res.status === 200) {
      toast.success("Transport Success", {
        position: "bottom-center"
      });
      getData();
    } else {
      toast.error("Transport Fail", { autoClose: 60000 });
    }
  })
}

const UpdateDeload = (isActive) => {
  isActive.value = false;
  const params = toRaw(selected.value);
  const ids = params.map(item => item.id);
  if (ids.length === 0) {
    toast.warning("Please Choose Advice List", {
      position: "bottom-center"
    });
    return;
  }
  loading.value = true;
  API.deLoad({"ids": ids}).then(res => {
    if (res.status === 200) {
      toast.success("Available Success", {
        position: "bottom-center"
      });
      getData();
    } else {
      toast.error("Available Fail", { autoClose: 60000 });
    }
  })
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
