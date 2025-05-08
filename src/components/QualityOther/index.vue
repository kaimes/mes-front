<template>
  <div>
    <v-row align="center" justify="space-between">
      <v-col>
        <div class="text-subtitle-1">Other Elements</div>
      </v-col>
      <v-col class="text-end">
        <v-btn
            class="text-none ml-4 mr-4"
            color="primary"
            variant="flat"
            :disabled="disabled"
            @click="handleEdit(undefined)"
        >
          Add
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          show-current-page
          height="300"
          density="compact"
          items-per-page="10"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          item-value="id"
          @update:options="handleTableChange"
      >
        <template v-slot:item.action="{ item }">
          <v-btn
              variant="text"
              icon="mdi-pencil"
              size="small"
              :disabled="disabled"
              @click="handleEdit(item)"
          />
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  variant="text"
                  icon="mdi-delete"
                  size="small"
                  :disabled="disabled"
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
    <EditForm ref="editFormRef" @refresh="handleSearch" @change="handleAddItem" />
  </div>
</template>
<script name="OtherCode" setup>
import {useRoute} from "vue-router";
import {reject} from "lodash";
import {getCurrentInstance, reactive, ref, toRaw, toRefs, watch} from "vue";
import {toast} from "vue3-toastify";
import EditForm from "./components/editForm.vue";
import API from "./api";

const props = defineProps({
  id: {
    type: Number,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
  }
});

const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", width: 120, fixed: true, sortable: false, align:"center"},
  {title: "Code", key: "code"},
  {title: "Min", key: "min_value"},
  {title: "Max", key: "max_value"},
  {title: "Precision", key: "precision"},
  {title: "Element_Abbr", key: "element_abbr"},
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },

});

const {queryParams} = toRefs(data);

const handleAddItem = (item) => {
  const items = toRaw(tableList.value);
  tableList.value = [
    ...items,
    item,
  ];
};

const getData = () => {
  if (!props.id) {
    return;
  }
  const params = toRaw(queryParams.value);
  loading.value = true;
  params["fields"] = [`${props.type}_id`];
  params["ops"] = ["=="];
  params["values"] = [props.id];
  API.getAll(props.type, params).then(res => {
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
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

// 创建新数据
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data, {
    type: props.type,
    id: props.id,
  });
}

const handleDelete = (isActive, row) => {
  isActive.value = false;
  if (!props.id) {
    const items = toRaw(tableList.value);
    tableList.value = reject(items, { code: row.code });
    return;
  }
  API.remove(props.type, row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getData();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Copy Fail", { autoClose: 60000 });
  });
}

const getValue = () => {
  return toRaw(tableList.value);
}

watch(
    () => props.id,
    (value) => {
      if (value) {
        console.log("**********")
        getData();
      }
    }
)

defineExpose({
  getValue,
});
</script>
<style lang="scss" scoped>
</style>
