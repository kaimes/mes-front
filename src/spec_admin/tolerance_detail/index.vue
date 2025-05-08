<template>
  <v-container class="page" fluid>
    <v-form ref="toleranceDetailForm" @submit.prevent="handleSave" @keydown.enter="handleSearch">
      <v-row align="center" class="gy-3">
        <v-col cols="12" sm="6" md="4" lg="1">
          <v-text-field v-model="form.code" density="default" variant="underlined"
                        placeholder="Code" bg-color="white" clearable :disabled="!save" label="Code" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <mill-code v-model="form.mill_id" hide-details :disabled="!save" @change="handleMillChange" />
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <v-text-field v-model="form.type" density="default" variant="underlined" placeholder="Type"
                        bg-color="white" clearable :disabled="!save" label="Type" hide-details></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="2">
          <v-text-field v-model="form.name" density="default" variant="underlined" placeholder="Name"
                        bg-color="white" clearable :disabled="!save" label="Name" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <v-text-field v-model="form.desc" density="default" variant="underlined" placeholder="Desc"
                        bg-color="white" clearable :disabled="!save" label="Desc" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="d-flex align-center justify-end  ga-2">
            <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
            <v-switch v-model="save" density="default" hide-details inset class="flex-shrink-0"></v-switch>
            <div class="ml-sm-6">
              <v-btn type="submit" :disabled="!save" :loading="loading" variant="flat" color="primary">
                {{ form.id ? "Update" : "Save" }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <div class="d-flex flex-column flex-sm-row align-center justify-space-between ga-4 mb-4">
        <v-responsive
            max-width="360"
            style="flex-grow: 1"
        >
          <v-text-field
              v-model="queryParams.q"
              @update:modelValue="handleSearch"
              variant="filled"
              single-line
              clearable
              density="comfortable"
              append-inner-icon="mdi-magnify"
              placeholder="Search By Bar Loc Code"
              hide-details
          ></v-text-field>
        </v-responsive>
        <v-btn
            class="text-none flex-shrink-0"
            color="primary"
            variant="flat"
            @click="handleEdit(undefined)"
            v-permission="`Create`"
        >
          New
        </v-btn>
      </div>
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
          item-value="id"
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
              v-permission="`Update`"
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
<script name="Inspector" setup>
import { useRoute, useRouter } from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs} from "vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import EditForm from "./components/editForm.vue";
import API from "./api";
import useCommonStore from "@/app/common";
import {formatDate} from "@/util/util";
import {toast} from "vue3-toastify";
import MillCode from "@/components/picker/MillCode.vue";
import ToleranceCode from "@/components/picker/ToleranceCode.vue";


const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "Mill", key: "mill", value: (item) => item.mill?.code || "--", sortable: false},
  {title: "Tolerance", key: "tolerance.code", sortable: true},
  {title: "Bar Loc Code", key: "bar_loc_code", sortable: true},
  {title: "Value Min", key: "value_min", sortable: true},
  {title: "Value Max", key: "value_max", sortable: true},
  {title: "Diff Actual Min", key: "diff_actual_min", sortable: true},
  {title: "Diff Actual Max", key: "diff_actual_max", sortable: true},
  {title: "Diff Percent Min", key: "diff_percent_min", sortable: true},
  {title: "Diff Percent Max", key: "diff_percent_max", sortable: true},
  // {title: "Diff Actual Min", key: "created_at", value: (item) => formatDate(item['created_at']), minWidth: 180, sortable: true},
]);
const tableList = ref([]);
const total = ref(0);
const save = ref(true);
const router = useRouter();

const data = reactive({
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  form: {
    id: undefined,
    mill_id: undefined,
    mill: undefined,
    code: undefined,
    type: undefined,
    name: undefined,
    desc: undefined,
  }
});

const {queryParams, form} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  const query = toRaw(form.value);
  
  if (query.id) {
    params["fields"] = ["tolerance_id"];
    params["ops"] = ["=="];
    params["values"] = [query.id];
    // delete params.tolerance_id;
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

const handleSave = async () => {
    // const { valid } = await proxy.$refs["finishedDetailForm"].validate();
    // if (!valid) {
    //     return;
    // }
    const params = toRaw(form.value);
    
    loading.value = true;
    API.save(params).then(res => {
        toast.success(params.id ? "Update Success" : "Create Success", {
            position: "bottom-center",
            delay: 2000,
            onClose: () => router.back()
        });
    }).catch(() => {
        toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
    }).finally(() => {
        loading.value = false;
    });
}

const getToleranceId = (id) => {
    API.getToleranceById(id).then(res => {
        const { status, data } = res
        if (status === 200) {
            save.value = false;

            form.value = data;

        } else {
            // TODO: 添加错误异常提示
        }
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

// 创建新数据
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
const handleMillChange = (data) => {
  form.value.mill = data;
}

if (route.query.id) {
  form.value.id = route.query.id;
  // handleEdit(form.value);
  getToleranceId(form.value.id);
  getData();
}
// form.value.id = 5;
// getToleranceId(form.value.id);
// getData();

</script>
<style lang="scss" scoped>
.w-360 {
  width: 360px;
}
.v-switch {
  min-width: 48px;
}
.v-btn {
  margin: 2px;
}
</style>
