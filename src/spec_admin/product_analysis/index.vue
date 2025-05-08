<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <spec-code v-model="queryParams.spec_code" @change="handleSpecChange($event, 'beforeCode')" />
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
        <v-col cols="3"></v-col>
        <v-col cols="4">
          <div class="d-flex align-center	" v-permission="`Copy To`">
            <v-dialog
                max-width="600"
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
                    title="Are you sure to copy product analysis requirements?"
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
          <router-link v-permission="`Create`" :to="{ path: '/product_analysis/detail' }">
            <v-btn
                class="text-none ml-4 mt-2"
                color="primary"
                variant="flat"
                
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
          <router-link v-permission="`Detail`" :to="{ path: '/product_analysis/detail', query: { id: item.id } }">
            <v-btn
                variant="text"
                icon="mdi-pencil"
                
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
<script name="ProductAnalysis" setup>
import {useRoute} from "vue-router";
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import EditForm from "./components/editForm.vue";
import API from "./api";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import XEUtils from "xe-utils";
import {formatSpecCode, floatToFixed} from "@/util/util";

const commonStore = useCommonStore();
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const tableHeaders = ref([
  {title: "Action", key: "action", fixed: true, sortable: false, align:"center", minWidth: 130, align: "center"},
  {title: "Mill Code", key: "mill.code"},
  {title: "Spec Code", key: "spec_code", value: (item) => formatSpecCode(item.spec)},
  {title: "Spec Version", key: "spec.version"},
  {title: "Version Status", key: "spec.version_status"},
  {title: "Thickness From", key: "thick_from"},
  {title: "Thickness To", key: "thick_to"},
  {title: "Sample Location", key: "location"},
  {title: "Type", key: "type"},
  {title: "C Min", key: "main_el_min_val_c"},
  {title: "C Max", key: "main_el_max_val_c"},
  {title: "C Prec.", key: "precision_c"},
  {title: "Si Min", key: "main_el_min_val_si"},
  {title: "Si Max", key: "main_el_max_val_si"},
  {title: "Si Prec.", key: "precision_si"},
  {title: "Mn Min", key: "main_el_min_val_mn"},
  {title: "Mn Max", key: "main_el_max_val_mn"},
  {title: "Mn Prec.", key: "precision_mn"},
  {title: "P Min", key: "main_el_min_val_p"},
  {title: "P Max", key: "main_el_max_val_p"},
  {title: "P Prec.", key: "precision_p"},
  {title: "S Min", key: "main_el_min_val_s"},
  {title: "S max", key: "main_el_max_val_s"},
  {title: "S Prec.", key: "precision_s"},
  {title: "S&P Min", key: "main_el_min_val_sp"},
  {title: "S&P Max", key: "main_el_max_val_sp"},
  {title: "S&P Prec.", key: "precision_sp"},
  {title: "Cr Min", key: "main_el_min_val_cr"},
  {title: "Cr Max", key: "main_el_max_val_cr"},
  {title: "Cr Prec.", key: "precision_cr"},
  {title: "Mo Min", key: "main_el_min_val_mo"},
  {title: "Mo Max", key: "main_el_max_val_mo"},
  {title: "Mo Prec.", key: "precision_mo"},
  {title: "Ni Min", key: "main_el_min_val_ni"},
  {title: "Ni Max", key: "main_el_max_val_ni"},
  {title: "Ni Prec.", key: "precision_ni"},
  {title: "Al Min", key: "main_el_min_val_al"},
  {title: "Al Max", key: "main_el_max_val_al"},
  {title: "Al Prec.", key: "precision_al"},
  {title: "B Min", key: "main_el_min_val_b"},
  {title: "B Max", key: "main_el_max_val_b"},
  {title: "B Prec.", key: "precision_b"},
  {title: "Co Min", key: "main_el_min_val_co"},
  {title: "Co Max", key: "main_el_max_val_co"},
  {title: "Co Prec.", key: "precision_co"},
  {title: "Cu Min", key: "main_el_min_val_cu"},
  {title: "Cu Max", key: "main_el_max_val_cu"},
  {title: "Cu Prec.", key: "precision_cu"},
  {title: "Nb Min", key: "main_el_min_val_nb"},
  {title: "Nb Max", key: "main_el_max_val_nb"},
  {title: "Nb Prec.", key: "precision_nb"},
  {title: "Sn Min", key: "main_el_min_val_sn"},
  {title: "Sn Max", key: "main_el_max_val_sn"},
  {title: "Sn Prec.", key: "precision_sn"},
  {title: "Ti Min", key: "main_el_min_val_ti"},
  {title: "Ti Max", key: "main_el_max_val_ti"},
  {title: "Ti Prec.", key: "precision_ti"},
  {title: "V Min", key: "main_el_min_val_v"},
  {title: "V Max", key: "main_el_max_val_v"},
  {title: "V Prec.", key: "precision_v"},
  {title: "N Min", key: "main_el_min_val_n"},
  {title: "N Max", key: "main_el_max_val_n"},
  {title: "N Prec.", key: "precision_n"},
  {title: "Ca Min", key: "main_el_min_val_ca"},
  {title: "Ca Max", key: "main_el_max_val_ca"},
  {title: "Ca Prec.", key: "precision_ca"},
  {title: "SOL AL Min", key: "main_el_min_val_sol_al"},
  {title: "SOL AL Max", key: "main_el_max_val_sol_al"},
  {title: "SOL AL Prec.", key: "precision_sol_al"},
  {title: "H Min", key: "main_el_min_val_h"},
  {title: "H Max", key: "main_el_max_val_h"},
  {title: "H Prec.", key: "precision_h"},

  {title: "AS Min", key: "main_el_min_val_as"},
  {title: "AS Max", key: "main_el_max_val_as"},
  {title: "AS Prec.", key: "precision_as"},
  {title: "Bi Min", key: "main_el_min_val_bi"},
  {title: "Bi Max", key: "main_el_max_val_bi"},
  {title: "Bi Prec.", key: "precision_bi"},
  {title: "Ce Min", key: "main_el_min_val_ce"},
  {title: "Ce Max", key: "main_el_max_val_ce"},
  {title: "Ce Prec.", key: "precision_ce"},
  {title: "O Min", key: "main_el_min_val_o"},
  {title: "O Max", key: "main_el_max_val_o"},
  {title: "O Prec.", key: "precision_o"},
  {title: "Pb Min", key: "main_el_min_val_pb"},
  {title: "Pb Max", key: "main_el_max_val_pb"},
  {title: "Pb Prec.", key: "precision_pb"},
  {title: "Sb Min", key: "main_el_min_val_sb"},
  {title: "Sb Max", key: "main_el_max_val_sb"},
  {title: "Sb Prec.", key: "precision_sb"},
  {title: "W Min", key: "main_el_min_val_w"},
  {title: "W Max", key: "main_el_max_val_w"},
  {title: "W Prec.", key: "precision_w"},
  {title: "Zn Min", key: "main_el_min_val_zn"},
  {title: "Zn Max", key: "main_el_max_val_zn"},
  {title: "Zn Prec.", key: "precision_zn"},
  {title: "Zr Min", key: "main_el_min_val_zr"},
  {title: "Zr Max", key: "main_el_max_val_zr"},
  {title: "Zr Prec.", key: "precision_zr"},
  {title: "Te Min", key: "main_el_min_val_te"},
  {title: "Te Max", key: "main_el_max_val_te"},
  {title: "Te Prec.", key: "precision_te"},
  {title: "Rad Min", key: "main_el_min_val_rad"},
  {title: "Rad Max", key: "main_el_max_val_rad"},
  {title: "Rad Prec.", key: "precision_rad"},
  {title: "Insal Min", key: "main_el_min_val_insal"},
  {title: "Insal Max", key: "main_el_max_val_insal"},
  {title: "Insal Prec.", key: "precision_insal"},
  {title: "N2 Min", key: "main_el_min_val_n2"},
  {title: "N2 Max", key: "main_el_max_val_n2"},
  {title: "N2 Prec.", key: "precision_n2"},
 
  {title: "Other Element Num", key: "other_element_numer"},
  {title: "Min", key: "other_el_min_val_1"},
  {title: "Max", key: "other_el_max_val_1"},
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    spec_code: commonStore.spec.id,
    summary_name: undefined,
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
  if (params.spec_code) {
    params["fields"] = ["spec_id"];
    params["ops"] = ["=="];
    params["values"] = [params.spec_code];
    delete params.spec_code;
  }
  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];

      res.data.items.forEach((item1, index) => {
        chemical_list.value.forEach((chemical, index) => {
          if(item1[`precision_${chemical}`]){
            item1[`main_el_min_val_${chemical}`] = floatToFixed(item1[`main_el_min_val_${chemical}`],item1[`precision_${chemical}`])
            item1[`main_el_max_val_${chemical}`] = floatToFixed(item1[`main_el_max_val_${chemical}`],item1[`precision_${chemical}`])
          }
          
        })
      })


      tableList.value = res.data.items.map((item, index) => ({
        ...item,
        other_element_numer: res.data.other_element_num?.[index] || 0
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
