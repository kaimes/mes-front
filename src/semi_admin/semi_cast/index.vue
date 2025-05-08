<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
              v-model="queryParams.q"
              :label="$t('cast.hint')"
              clearable
              hide-details
          ></v-text-field>
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
        <v-col cols="6" class="text-end">
          <v-file-input
            ref="fileinput"
            @change="importFiles"
            style="display: none;"
            accept=".xls,.xlsx"
            multiple
          ></v-file-input>
          <v-btn color="primary" variant="flat" class="ml-2 text-none" @click="handleExport" :loading="exportLoading">{{ $t('cast.export') }}</v-btn>
          <v-btn color="primary" variant="flat" class="ml-2 text-none" @click="selectFile" :loading="importLoading" v-permission="`Import`">{{ $t('cast.import') }}</v-btn>
          <v-file-input
                ref="fileinputNew"  style="display: none;"
                accept=".xlsx,.csv"
                @change="importFilesNew"
              ></v-file-input>

              <v-btn
                color="primary"
                variant="flat"
                class="ml-2 text-none"
                @click="selectFileForImportNew"
                :loading="importNewLoading"
                v-permission="`Import`"
              >
              {{ $t('cast.import_new') }}
              </v-btn>
              <v-btn
                class="text-none ml-2"
                color="primary"
                variant="flat"
                multiple
                v-permission="`Create`"
                @click="generateCode"
              >
              {{ $t('global.new') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center">
        <v-spacer />
        <v-btn
            variant="text"
            icon="mdi-menu"
            @click="handleOpen"
        />
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
          <!-- <v-btn
              variant="text"
              icon="mdi-pencil"
              @click="handleEdit(item)"
          /> -->
          <router-link class="text-decoration-none grey-darken-4 mr-2" :to="{ name: 'CastChemicalDetail', query: { id: item.id } }">
            <v-icon small v-permission="`Detail`">mdi-pencil</v-icon>
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
                  :text="$t('cast.delete_prompt')"
                  :title="$t('cast.delete_title')"
              >
                <template v-slot:actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      class="text-none"
                      color="#e3e3e3"
                      variant="flat"
                      @click="isActive.value = false"
                  >
                  {{ $t('global.cancel') }}
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleDelete(isActive, item)"
                  >
                  {{ $t('cast.deelte_conform') }}
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
    <MesTable ref="tableRef" name="semi_cast_list"  v-model="tableHeaders" />
  </v-container>
</template>
<script name="SemiCastList" setup>
import {useRoute,useRouter} from "vue-router";
import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs, computed} from "vue";
import {toast} from "vue3-toastify";
import {formatDate, floatToFixed} from "@/util/util";
import EditForm from "./components/editForm.vue";
import { useStore } from "vuex";
import API from "./api";
import MesTable from "@/components/table/index.vue";
import { toLower } from "lodash";
import { el } from "date-fns/locale";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const importLoading = ref(false);
const fileinputNew = ref(null);
const importNewLoading = ref(false)
const selectFileForImportNew = () => {
  fileinputNew.value.click(); // 触发文件选择器
};
const isLoading = ref(false);
const castCode = ref('');
const generate = ref('');
const exportLoading = ref(false);
const store = useStore();
const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const tableHeadersDefinition = ref([
  {title: "global.action", key: "action", align: 'center', width: 140, minWidth: 140, sortable: false},
  {title: "cast.table.cast_code", key: "cast_code", fixed: true, width: 150, minWidth: 150},
  {title: "cast.table.long_cast_code", key: "long_cast_code", width: 180, minWidth: 180},
  {title: "cast.table.bos_cast_code", key: "bos_cast_code", width: 180, minWidth: 180},
  {title: "cast.table.generation_code", key: "generate_code"},
  {title: "cast.table.quality_code", key: "quality_code", width: 180, minWidth: 180},
  {title: "cast.table.c", key: "ch_c"},
  {title: "cast.table.si", key: "ch_si"},
  {title: "cast.table.mn", key: "ch_mn"},
  {title: "cast.table.p", key: "ch_p"},
  {title: "cast.table.s", key: "ch_s"},
  {title: "cast.table.cr", key: "ch_cr"},
  {title: "cast.table.mo", key: "ch_mo"},
  {title: "cast.table.ni", key: "ch_ni"},
  {title: "cast.table.al", key: "ch_al"},
  {title: "cast.table.b", key: "ch_b"},
  {title: "cast.table.co", key: "ch_co"},
  {title: "cast.table.cu", key: "ch_cu"},
  {title: "cast.table.nb", key: "ch_nb"},
  {title: "cast.table.sn", key: "ch_sn"},
  {title: "cast.table.ti", key: "ch_ti"},
  {title: "cast.table.v", key: "ch_v"},
  {title: "cast.table.n", key: "ch_n"},
  {title: "cast.table.ca", key: "ch_ca"},
  {title: "cast.table.solal", key: "ch_solal"},
  {title: "cast.table.h", key: "ch_h"},
  {title: "cast.table.as", key: "ch_as"},
  {title: "cast.table.bi", key: "ch_bi"},
  {title: "cast.table.ce", key: "ch_ce"},
  {title: "cast.table.o", key: "ch_o"},
  {title: "cast.table.pb", key: "ch_pb"},
  {title: "cast.table.sb", key: "ch_sb"},
  {title: "cast.table.w", key: "ch_w"},
  {title: "cast.table.zn", key: "ch_zn"},
  {title: "cast.table.zr", key: "ch_zr"},
  {title: "cast.table.te", key: "ch_te"},
  {title: "cast.table.rad", key: "ch_rad"},
  {title: "cast.table.insal", key: "ch_insal"},
  {title: "cast.table.n2", key: "ch_n2"},
  {title: "cast.table.created_at", key: "created_at", value: (item) => formatDate(item['created_at']), minWidth: 180},
  {title: "cast.table.updated_at", key: "updated_at", value: (item) => formatDate(item['updated_at']), minWidth: 180},
  
]);
const tableHeaders = computed(() => {
  return tableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
  zero_decimal_cast: ["o"],
  one_decimal_cast: ["h","zr"],
  two_decimal_cast: ["al","as","bi","c","ce","co","cr","cs","cu","insal","mn","mo","n","nb","ni","p","pb","s","sb","si","sn","solal","te","v","w","zn"],
  three_decimal_cast: ["rad","ti"],
  four_decimal_cast: ["b","ca"],
});


const {queryParams, zero_decimal_cast, one_decimal_cast, two_decimal_cast, three_decimal_cast, four_decimal_cast} = toRefs(data);


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

      if (res.data.items.length > 0) {
        res.data.items.forEach(item => {
          if (item.ch_h !== null) {
            item.ch_h  = item.ch_h * 10000;
          }
          if (item.ch_o !== null) {
            item.ch_o  = item.ch_o * 10000;
          }

          Object.keys(item).forEach(key => {
            if (key.startsWith('ch_') && item[key] !== null) {
              const suffix = key.substring(3);
              let precision = 2; // 默认精度为2

              if (zero_decimal_cast.value.includes(suffix)) {
                precision = 0;
              } else if (one_decimal_cast.value.includes(suffix)) {
                if (suffix === "zr" && item[key] < 0.1) {
                  precision = 3;
                } else {
                  precision = 1;
                }
              } else if (two_decimal_cast.value.includes(suffix)) {
                if (suffix === "n" && item[key] < 0.1) {
                  precision = 4;
                } else if (suffix !== "mn" && item[key] < 0.1) {
                  precision = 3;
                }
              } else if (three_decimal_cast.value.includes(suffix)) {
                if (suffix === "ti" && item[key] < 0.01) {
                  precision = 4;
                } else {
                  precision = 3;
                }
              } else if (four_decimal_cast.value.includes(suffix)) {
                precision = 4;
              }
              item[key] = floatToFixed(item[key], precision);
              item['precision_' + suffix] = precision;
            }
          });



        });
      }

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
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleDelete = (isActive, row) => {
  isActive.value = false;
  API.remove(row.id).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getData();
  });
}

// File import logic
const fileinput = ref(null);
const selectFile = () => {
  // Trigger file selection
  fileinput.value.click();
};

const importFiles = async (event) => {
  // 从 event.target.files 获取文件列表
  const files = event.target.files;
  
  // Debug: 检查是否正确获取到文件
  console.log("Selected files:", files);
  
  if (files && files.length > 0) {
    const formData = new FormData();
    
    // 将所有选中的文件添加到 FormData 中
    Array.from(files).forEach(file => {
      formData.append('files', file); // 'files' 是你后端期望的字段名
    });

    // Debug: 打印 FormData 的内容
    console.log("FormData contents:", formData);

    try {
      // 发送文件到后端接口

      importLoading.value = true;
      const response = await API.import(formData);
      importLoading.value = false;

      // Debug: 检查后端响应
      console.log('API Response:', response);

      // 成功后显示提示信息
      const importText = `Import Success Sum: ${response.data.success_sum}; Repeat Sum: ${response.data.repeat_sum}`;
      toast.success(importText, { position: 'bottom-center' });

      // 刷新数据
      getData();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error(`Error uploading files: ${error.response.data.detail}`, { autoClose: 60000 });
    }
  } else {
    // 如果没有文件被选中，显示错误提示
    toast.error('No files selected', { autoClose: 60000 });
  }
};
const importFilesNew = async (event) => {
  const file = event.target.files?.[0]; // 获取选中的文件
  if (!file) {
    toast.error("No file selected", { autoClose: 60000 });
    return;
  }

  const maxSize = 50 * 1024 * 1024; // 50MB 限制
  if (file.size > maxSize) {
    toast.info("The file size cannot exceed 50MB!", { position: "bottom-center" });
    return;
  }

  const formData = new FormData();
  formData.append('file', file); // 将文件添加到 FormData

  try {
    importNewLoading.value = true;
    const response = await API.importnew(formData); // 调用后端接口
    const importText = `Import Success Sum: ${response.data.add_cnt}; Update Sum: ${response.data.update_cnt}`;
    toast.success(importText, { position: "bottom-center" });
    getData(); // 刷新数据
  } catch (error) {
    console.error("Error uploading files:", error);
    toast.error(`Error uploading files: ${error.response?.data?.detail}`, { autoClose: 60000 });
  } finally {
    importNewLoading.value = false;
  }
};

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

const generateCode = async () => {
  try {
    isLoading.value = true;
    const params = {
    ...toRaw(queryParams.value)
    };
    const response = await API.createCode();
    if (response.data) {
      castCode.value = response.data.cast_code;
      generate.value = response.data.generate_code;
      router.push({ name: 'CastChemicalDetail', query: { cast_code: castCode.value, generate_code: generate.value } });
    } else {
      toast.error('Failed to generate cast code', { autoClose: 60000 });
    }
  } catch (error) {
    toast.error('An error occurred while generating cast code',error, { autoClose: 60000 });
  } finally {
    isLoading.value = false;
  }
};

const handleExport = async () => {
  try {
    exportLoading.value = true;
    const response = await API.export(queryParams.value);
    if (response) {
      toast.success('Export Success', { position: 'bottom-center' });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    toast.error(`Error exporting data: ${error.response.data.detail}`, { autoClose: 60000 });
  } finally {
    exportLoading.value = false;
  }
};

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
