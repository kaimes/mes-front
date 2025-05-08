<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <spec-code v-model="queryParams.spec_code" @change="handleSpecChange($event, 'beforeCode')" />
        </v-col>
        <v-col cols="3">
          <dict-code
                v-model="queryParams.type"
                hide-details
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Type"
                placeholder="Type"
                code="main_element_type"
                persistent-placeholder
            />
        </v-col>
        <v-col cols="3">
          <v-btn
              class="text-none ml-4"
              color="#e3e3e3"
              variant="flat"
              @click="handleReset"
          >
            Reset
          </v-btn>
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 my-1"
              color="primary"
              variant="flat"
              :loading="loading"
          >
            Search
          </v-btn>
        </v-col>
        <v-col cols="4">
          <div class="d-flex align-center	" v-permission="`Copy To`">
            <v-dialog
                max-width="680"
                persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <div>
                  <v-btn
                      class="text-none mr-4 mt-2"
                      color="primary"
                      variant="flat"
                      :disabled="!form.beforeCode || !form.afterCode"
                      v-bind="activatorProps"
                  >
                    Copy To
                  </v-btn>
                  <v-tooltip :disabled="form.beforeCode && form.afterCode" activator="parent" location="bottom">
                    Please Select a Destination Spec Code
                  </v-tooltip>
                </div>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card
                    prepend-icon="mdi-help-circle-outline"
                    title="Are you sure to copy main element analysis requirements?"
                    :text="`Copy ${form.beforeCode} to ${form.afterCode}`"
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
                        @click="handleCopy(isActive)"
                    >
                      Confirm
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
            <spec-code v-model="form.afterId" :store="false" @change="handleSpecChange($event, 'afterCode')" />
          </div>
        </v-col>
        <v-spacer />
        <v-col cols="3" class="text-end">
          <router-link v-permission="`Create`" :to="{ path: '/main_element_analysis/detail' }">
            <v-btn
                class="text-none ml-4 mt-2"
                color="primary"
                variant="flat"
                v-permission="`Create`"
            >
              New
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-3 pa-4" elevation="0" variant="outlined">
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
          <router-link :to="{ path: '/main_element_analysis/detail', query: { id: item.id } }">
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
<script name="MainElementAnalysis" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import EditForm from "./components/editForm.vue";
import API from "./api";
import XEUtils from "xe-utils";
import {formatSpecCode,floatToFixed} from "@/util/util";
import DictCode from "@/components/picker/DictCode.vue";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align:"center"},
  {title: "Mill Code", key: "mill.code"},
  {title: "Spec Code", key: "spec.spec_code", value: (item) => formatSpecCode(item.spec)},
  {title: "Spec Version", key: "spec.version"},
  {title: "Version Status", key: "spec.version_status"},
  {title: "Thickness From", key: "thick_from"},
  {title: "Thickness To", key: "thick_to"},
  {title: "Sample Location", key: "location"},
  {title: "Type", key: "type"},
  {title: "C Min", key: "main_el_min_value_c"},
  {title: "C Max", key: "main_el_max_value_c"},
  {title: "C Prec.", key: "precision_c"},
  {title: "C Uom", key: "uom_c"},
  {title: "Si Min", key: "main_el_min_value_si"},
  {title: "Si Max", key: "main_el_max_value_si"},
  {title: "Si Prec.", key: "precision_si"},
  {title: "Si Uom", key: "uom_si"},
  {title: "Mn Min", key: "main_el_min_value_mn"},
  {title: "Mn Max", key: "main_el_max_value_mn"},
  {title: "Mn Prec.", key: "precision_mn"},
  {title: "Mn Uom", key: "uom_mn"},
  {title: "P Min", key: "main_el_min_value_p"},
  {title: "P Max", key: "main_el_max_value_p"},
  {title: "P Prec.", key: "precision_p"},
  {title: "P Uom", key: "uom_p"},
  {title: "S Min", key: "main_el_min_value_s"},
  {title: "S max", key: "main_el_max_value_s"},
  {title: "S Prec.", key: "precision_s"},
  {title: "S Uom", key: "uom_s"},
  {title: "Cr Min", key: "main_el_min_value_cr"},
  {title: "Cr Max", key: "main_el_max_value_cr"},
  {title: "Cr Prec.", key: "precision_cr"},
  {title: "Cr Uom", key: "uom_cr"},
  {title: "Mo Min", key: "main_el_min_value_mo"},
  {title: "Mo Max", key: "main_el_max_value_mo"},
  {title: "Mo Prec.", key: "precision_mo"},
  {title: "Mo Uom", key: "uom_mo"},
  {title: "Ni Min", key: "main_el_min_value_ni"},
  {title: "Ni Max", key: "main_el_max_value_ni"},
  {title: "Ni Prec.", key: "precision_ni"},
  {title: "Ni Uom", key: "uom_ni"},
  {title: "Al Min", key: "main_el_min_value_al"},
  {title: "Al Max", key: "main_el_max_value_al"},
  {title: "Al Prec.", key: "precision_al"},
  {title: "Al Uom", key: "uom_al"},
  {title: "B Min", key: "main_el_min_value_b"},
  {title: "B Max", key: "main_el_max_value_b"},
  {title: "B Prec.", key: "precision_b"},
  {title: "B Uom", key: "uom_b"},
  {title: "Co Min", key: "main_el_min_value_co"},
  {title: "Co Max", key: "main_el_max_value_co"},
  {title: "Co Prec.", key: "precision_co"},
  {title: "Co Uom", key: "uom_co"},
  {title: "Cu Min", key: "main_el_min_value_cu"},
  {title: "Cu Max", key: "main_el_max_value_cu"},
  {title: "Cu Prec.", key: "precision_cu"},
  {title: "Cu Uom", key: "uom_cu"},
  {title: "Nb Min", key: "main_el_min_value_nb"},
  {title: "Nb Max", key: "main_el_max_value_nb"},
  {title: "Nb Prec.", key: "precision_nb"},
  {title: "Nb Uom", key: "uom_nb"},
  {title: "Sn Min", key: "main_el_min_value_sn"},
  {title: "Sn Max", key: "main_el_max_value_sn"},
  {title: "Sn Prec.", key: "precision_sn"},
  {title: "Sn Uom", key: "uom_sn"},
  {title: "Ti Min", key: "main_el_min_value_ti"},
  {title: "Ti Max", key: "main_el_max_value_ti"},
  {title: "Ti Prec.", key: "precision_ti"},
  {title: "Ti Uom", key: "uom_ti"},
  {title: "V Min", key: "main_el_min_value_v"},
  {title: "V Max", key: "main_el_max_value_v"},
  {title: "V Prec.", key: "precision_v"},
  {title: "V Uom", key: "uom_v"},
  {title: "N Min", key: "main_el_min_value_n"},
  {title: "N Max", key: "main_el_max_value_n"},
  {title: "N Prec.", key: "precision_n"},
  {title: "N Uom", key: "uom_n"},
  {title: "Ca Min", key: "main_el_min_value_ca"},
  {title: "Ca Max", key: "main_el_max_value_ca"},
  {title: "Ca Prec.", key: "precision_ca"},
  {title: "Ca Uom", key: "uom_ca"},
  {title: "SOL AL Min", key: "main_el_min_value_sal"},
  {title: "SOL AL Max", key: "main_el_max_value_sal"},
  {title: "SOL AL Prec.", key: "precision_sal"},
  {title: "SOL AL Uom", key: "uom_sal"},
  {title: "H Min", key: "main_el_min_value_h"},
  {title: "H Max", key: "main_el_max_value_h"},
  {title: "H Prec.", key: "precision_h"},
  {title: "H Uom", key: "uom_h"},
  {title: "As Min", key: "main_el_min_value_as"},
  {title: "As Max", key: "main_el_max_value_as"},
  {title: "As Prec.", key: "precision_as"},
  {title: "As Uom", key: "uom_as"},
  {title: "Bi Min", key: "main_el_min_value_bi"},
  {title: "Bi Max", key: "main_el_max_value_bi"},
  {title: "Bi Prec.", key: "precision_bi"},
  {title: "Bi Uom", key: "uom_bi"},
  {title: "Ce Min", key: "main_el_min_value_ce"},
  {title: "Ce Max", key: "main_el_max_value_ce"},
  {title: "Ce Prec.", key: "precision_ce"},
  {title: "Ce Uom", key: "uom_ce"},
  {title: "O Min", key: "main_el_min_value_o"},
  {title: "O Max", key: "main_el_max_value_o"},
  {title: "O Prec.", key: "precision_o"},
  {title: "O Uom", key: "uom_o"},
  {title: "Pb Min", key: "main_el_min_value_pb"},
  {title: "Pb Max", key: "main_el_max_value_pb"},
  {title: "Pb Prec.", key: "precision_pb"},
  {title: "Pb Uom", key: "uom_pb"},
  {title: "Sb Min", key: "main_el_min_value_sb"},
  {title: "Sb Max", key: "main_el_max_value_sb"},
  {title: "Sb Prec.", key: "precision_sb"},
  {title: "Sb Uom", key: "uom_sb"},
  {title: "W Min", key: "main_el_min_value_w"},
  {title: "W Max", key: "main_el_max_value_w"},
  {title: "W Prec.", key: "precision_w"},
  {title: "W Uom", key: "uom_w"},
  {title: "Zn Min", key: "main_el_min_value_zn"},
  {title: "Zn Max", key: "main_el_max_value_zn"},
  {title: "Zn Prec.", key: "precision_zn"},
  {title: "Zn Uom", key: "uom_zn"},
  {title: "Zr Min", key: "main_el_min_value_zr"},
  {title: "Zr Max", key: "main_el_max_value_zr"},
  {title: "Zr Prec.", key: "precision_zr"},
  {title: "Zr Uom", key: "uom_zr"},
  {title: "Te Min", key: "main_el_min_value_te"},
  {title: "Te Max", key: "main_el_max_value_te"},
  {title: "Te Prec.", key: "precision_te"},
  {title: "Te Uom", key: "uom_te"},
  {title: "Rad Min", key: "main_el_min_value_rad"},
  {title: "Rad Max", key: "main_el_max_value_rad"},
  {title: "Rad Prec.", key: "precision_rad"},
  {title: "Rad Uom", key: "uom_rad"},
  {title: "Insal Min", key: "main_el_min_value_insal"},
  {title: "Insal Max", key: "main_el_max_value_insal"},
  {title: "Insal Prec.", key: "precision_insal"},
  {title: "Insal Uom", key: "uom_insal"},
  {title: "N2 Min", key: "main_el_min_value_n2"},
  {title: "N2 Max", key: "main_el_max_value_n2"},
  {title: "N2 Prec.", key: "precision_n2"},
  {title: "N2 Uom", key: "uom_n2"},

  {title: "Other Element Num", key: "other_element_numer"},
  {title: "Min", key: "other_el_min_value_1"},
  {title: "Max", key: "other_el_max_value_1"},
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    spec_code: commonStore.spec.id,
    type: "Main",
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
  chemical_list : ['c', 'si','mn', 'p','s', 'cr','mo', 'ni', 'al', 'b', 'co', 'cu', 'nb','sn', 'ti', 'v', 'ca', 'n', 'h','sal','sp', 'as', 'bi', 'ce', 'o', 'pb','sb', 'w', 'zn', 'zr', 'te', 'rad', 'insal', 'n2']
});

const {queryParams, form, chemical_list} = toRefs(data);

const getData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  params["fields"] = [];
  params["ops"] = [];
  params["values"] = [];
  if (params.spec_code) {
    params["fields"].push("spec_id");
    params["ops"].push("eq");
    params["values"].push(params.spec_code);
    delete params.spec_code;
  }
  if (params.type) {
    params["fields"].push("type")
    params["ops"].push("eq")
    params["values"].push(params.type)
    delete params.type
  }
  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
      
      res.data.items.forEach((item1, index) => {
        chemical_list.value.forEach((chemical, index) => {
          if(item1[`precision_${chemical}`]){
            item1[`main_el_min_value_${chemical}`] = floatToFixed(item1[`main_el_min_value_${chemical}`],item1[`precision_${chemical}`])
            item1[`main_el_max_value_${chemical}`] = floatToFixed(item1[`main_el_max_value_${chemical}`],item1[`precision_${chemical}`])

          }
          
        })
      })
      
      
      tableList.value = res.data.items.map((item, index) => ({
        ...item,
        other_element_numer: res.data.other_element_num?.[index] || 0,
      }));
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
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleSpecChange = (spec, key) => {
  form.value[`${key}`] = spec.spec_code;
}

const handleCopy = (isActive) => {
  isActive.value = false;
  API.copyTo(form.value.beforeCode, form.value.afterCode).then(res => {
    toast.success("Copy Success", {
      position: "bottom-center"
    });
    handleSearch();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Copy Fail", { autoClose: 60000 });
  })
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
