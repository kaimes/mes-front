<template>
  <v-container class="page" fluid>
    <v-form ref="semi_sizeDetailForm" @submit.prevent="handleSave">
                <v-row align="center" >
                    <v-col cols="1">
                        <v-text-field v-model="form.code" density="default" variant="underlined"
                            placeholder="Code" bg-color="white" clearable :disabled="!save" label="Code" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-text-field v-model="form.semi_type" density="default" variant="underlined" placeholder="Type"
                            bg-color="white" clearable :disabled="!save" label="Type" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="form.width_mm" density="default" variant="underlined" placeholder="Width(mm)"
                            bg-color="white" clearable :disabled="!save" label="Width(mm)" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="form.thick_mm" density="default" variant="underlined" placeholder="Thick(mm)"
                            bg-color="white" clearable :disabled="!save" label="Thick(mm)" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="form.norm_suffix" density="default" variant="underlined" placeholder="Norm Suffix"
                            bg-color="white" clearable :disabled="!save" label="Norm Suffix" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="auto" class="ml-auto">
                      <div class="d-flex align-center flex-nowrap" style="gap: 8px;">
                        <div class="d-flex align-center text-nowrap" style="gap: 8px;">
                          <span class="text-subtitle-2 font-weight-regular">{{ save ? "Save" : "View" }}</span>
                          <v-switch 
                            v-model="save" 
                            density="compact" 
                            hide-details 
                            inset
                            class="mt-0"
                          ></v-switch>
                        </div>
                        <v-btn 
                          type="submit" 
                          :disabled="!save" 
                          :loading="loading" 
                          variant="flat" 
                          color="primary"
                          style="min-width: 88px;"
                        >
                          {{ form.id ? "Update" : "Save" }}
                        </v-btn>
                      </div>
                    </v-col>
                </v-row>

           <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
            <div class="d-flex align-center justify-space-between mb-4">
              <v-responsive
                  max-width="360"
              >
                <v-text-field
                    v-model="queryParams.q"
                    @update:modelValue="handleSearch"
                    variant="filled"
                    single-line
                    clearable
                    density="comfortable"
                    append-inner-icon="mdi-magnify"
                    placeholder="Search"
                    hide-details
                ></v-text-field>
              </v-responsive>
              <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                prepend-icon="mdi-plus"
                @click="handleEdit(undefined)"
                v-permission="`Create`"
                >
                <template v-slot:prepend>
                  <v-icon color="white"></v-icon>
                </template>
                Add
              </v-btn>
            </div>
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


        </v-form>
    
  </v-container>
</template>
<script name="Inspector" setup>
import { useRoute, useRouter } from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs} from "vue";

import EditForm from "./components/editForm.vue";
import API from "./api";
import useCommonStore from "@/app/common";
import {formatDate} from "@/util/util";
import {toast} from "vue3-toastify";
import SemiSizeCode from "@/components/picker/SemiSizeCode.vue";



const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  // {title: "Length", key: "length_mm", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "Action", key: "action", fixed: true, sortable: false, align:"center"},
  {title: "Length", key: "length_mm", sortable: true},
  {title: "Standard Weight(t)", key: "standard_weight_t", sortable: true},
  {title: "Min Weight(t)", key: "min_weight_t", sortable: true},
  {title: "Max Weight(t)", key: "max_weight_t", sortable: true},
 
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

  }
});

const {queryParams, form} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  const query = toRaw(form.value);
  
  if (query.id) {
    params["fields"] = ["semi_size_id"];
    params["ops"] = ["=="];
    params["values"] = [query.id];
    // delete params.semi_size_id;
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

const getSemiSizeId = (id) => {
    API.getSemiSizeById(id).then(res => {
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
  getSemiSizeId(form.value.id);
  getData();
}
// form.value.id = 5;
// getSemiSizeId(form.value.id);
// getData();

</script>
<style lang="scss" scoped>
.page {
    .panel {
        position: relative;
        background-color: #ffffff;
        padding: 42px 16px 16px 16px;
        border-radius: 12px;

        &-action {
            position: absolute;
            top: 10px;
            right: 12px;
            display: flex;
            flex-direction: row;
            align-items: center;
            z-index: 1;
        }
    }
}
</style>
