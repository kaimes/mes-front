<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <!-- <v-col cols="3">
          <ProductClassCode v-model="product_class" :hide-details="true"/>
        </v-col>
        <v-col cols="3">
          <ProductCategoryCode v-model="product_type" :hide-details="true" label="Section Type"/>
        </v-col> -->

        <v-col cols="3">
          <ProductSizeCode 
            v-model="product_size" 
            :hide-details="true" 
            :label="$t('rolling.product_size_code')"
          />
        </v-col>
        <v-col cols="3">
          <dict-code
              v-model="rolling_status"
              hide-details
              variant="underlined"
              :label="$t('rolling.table.rolling_status')"
              bg-color="white"
              code="rolling_status"
              multiple
              clearable
          />
        </v-col>
        <v-col cols="3">
          <v-select
              v-model="week_number"
              :label="$t('rolling.table.week_number')"
              hide-details
              variant="underlined"
              bg-color="white"
              :items="generateWeekOptions()"
              clearable
          ></v-select>
        </v-col>

        <v-col cols="3">
          <VueDatePicker @update:model-value="UpdateStartDate" :teleport="true" :enable-time-picker="false"
                         class="mt-6">
            <template #trigger>
              <v-text-field
                  v-model="start_date"
                  :label="$t('rolling.start_date')"
                  readonly
                  clearable
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>

        <v-col cols="3">
          <VueDatePicker @update:model-value="UpdateEndDate" :teleport="true" :enable-time-picker="false" class="mt-6">
            <template #trigger>
              <v-text-field
                  v-model="end_date"
                  :label="$t('rolling.end_date')"
                  readonly
                  clearable
              ></v-text-field>
            </template>
          </VueDatePicker>
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
            >
            {{ $t('global.search') }}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="auto" class="ml-auto mr-4">
          <div class="d-flex align-center">
            <router-link :to="{ name: 'RollingDetail' }">
              <v-btn color="primary" variant="flat" :disabled="localOrganizationStatus === 'Expired'"
                     v-permission="`Create`">{{ $t('global.new') }}
              </v-btn>
            </router-link>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center ga-2 flex-wrap mb-4">
        <v-btn v-permission="'SendToPC'" :disabled="!this.tableSelected.length" class="text-none" color="primary" variant="flat" @click="SendM240ToPC">{{ $t('rolling.delete_from_pc') }}</v-btn>
        <v-btn v-permission="'SendToPC'" class="text-none" color="primary" variant="flat" @click="SendM005ToPC">{{ $t('rolling.send_to_pc') }}</v-btn>
        <v-btn v-permission="'Export'" class="text-none" color="primary" variant="flat" @click="exportRolling">{{ $t('rolling.export') }}</v-btn>
        <v-btn v-permission="'Export'" class="text-none" color="primary" variant="flat" @click="exportRolling('ftp')">{{ $t('rolling.export_to_ftp') }}</v-btn>
        <div v-permission="'Import'" class="v-btn v-btn--flat v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated file-input-btn">
          <span class="v-btn__content" data-no-activator="">{{ $t('rolling.import') }}</span>
          <v-file-input
              ref="fileinput"
              v-model="file"
              @update:modelValue="handleImportFile"
              prepend-icon=""
              accept=".xls,.xlsx"
              hide-details
              variant="plain"
              density="compact"
          >
          </v-file-input>
        </div>
        <v-btn v-permission="'Import'" color="primary" variant="flat" @click="handleImportRollingFromFTP">{{ $t('rolling.import_from_ftp') }}</v-btn>
        
        <v-spacer />
        <v-btn
            variant="text"
            icon="mdi-menu"
            @click="handleOpen"
        />
      </div>
      <v-data-table-server 
        fixed-header
        height="610"
        show-current-page 
        item-selectable="selectable"
        v-model="tableSelected"
        show-select
        :headers="headers" 
        :items="items" 
        :footer-props="{
          'items-per-page-options': [5, 10, 20]
        }" 
        :items-length="total || 0" v-model:page="page" v-model:items-per-page="itemsPerPage"
                           v-model:sort-by="sortBy" v-model:sort-desc.sync="descending" :loading="loading"
                           loading-text="Loading... Please wait">
        <template v-slot:[`item.code`]="{ item }">
          <v-tooltip location="bottom" max-width="500px" :text="item.code">
            <template v-slot:activator="{ props }">
                <span class="code" v-bind="props">
                  {{ item.code }}
                </span>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:item.rolling_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'RollingDetail', query: { id: item.id } }">
            <span class="w-100 d-inline-block">{{ item.rolling_code }}</span>
          </router-link>
        </template>
        <template v-slot:[`item.action`]="{ item }">
            <span class="d-flex align-center ga-2">
              <router-link class="text-decoration-none grey-darken-4 mr-2"
                           :to="{ name: 'RollingDetail', query: { id: item.id } }">
                <v-icon size="small" v-permission="`Detail`">mdi-pencil</v-icon>
              </router-link>
              <v-icon size="small" @click="removeShow(item)" v-permission="`Delete`">mdi-delete</v-icon>
            </span>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
  <delete-dialog/>
  <MesTable ref="tableRef" name="rolling_list"  v-model="headers" />
  <ImportFileDialog ref="importFile"/>
</template>

<script>
import { getCurrentInstance } from 'vue';
import {mapGetters} from 'vuex';
import {mapFields} from 'vuex-map-fields';
import moment from "moment";
import {mapActions, mapState} from 'vuex';
import DeleteDialog from '@/rolling/rolling_list/DeleteDialog.vue';
import {formatDate, getWeekRange, secondsToHms} from "@/util/util";
import DictCode from '@/components/picker/DictCode.vue';
import ProductClassCode from '@/components/picker/ProductClassCode.vue';
import ProductCategoryCode from '@/components/picker/ProductCategoryCode.vue';
import MesTable from "@/components/table/index.vue";
import {toast} from "vue3-toastify";
import RollingApi from "@/rolling/rolling_list/api";
import API from "./api";
import ImportFileDialog from "@/rolling/rolling_list/ImportFileDialog.vue";
import ProductSizeCode from "@/components/picker/ProductSizeCode.vue";


export default {
  name: 'RollingListTable',

  components: {
    MesTable,
    ProductCategoryCode,
    ProductClassCode,
    DictCode,
    DeleteDialog,
    ImportFileDialog,
    ProductSizeCode
  },
  data() {
    return {
      file: undefined,
      tableHeadersDefinition: [
        {title: "global.action", key: 'action', minWidth: 88, fixed: true, sortable: false, align: "center"},
        {title: "rolling.table.mill_code", key: "mill.code", value: (item) => item.mill?.code, sortable: true},
        {title: 'rolling.table.rolling_seq', key: 'rolling_seq', sortable: true},
        {title: 'rolling.table.rolling_code', key: 'rolling_code', sortable: true, minWidth: 200},
        {title: 'rolling.table.week_number', key: 'week_number', sortable: true, minWidth: 40},
        {title: 'rolling.table.year', key: 'year', sortable: true, minWidth: 40},
        {title: 'rolling.table.semi_size', minWidth: 120, key:'semi_size', sortable: true},
        {title: 'rolling.table.rolling_status', key: 'rolling_status', sortable: true},
        {title: 'rolling.table.comment', key: 'comment', sortable: true},
        {
          title: 'rolling.table.programmed_start_date',
          key: 'programmed_start_date',
          minWidth: 180,
          value: (item) => formatDate(item['programmed_start_date']),
          sortable: true
        },
        {
          title: 'rolling.table.duration_minutes',
          key: 'duration_minutes',
          sortable: false,
          minWidth: 180,
          value: (item) => secondsToHms(item['duration_minutes'])
        },
        {
          title: 'rolling.table.additional_minutes',
          key: 'additional_minutes',
          sortable: false,
          minWidth: 180,
          value: (item) => secondsToHms(item['additional_minutes'])
        },
        {title: 'rolling.table.programmed_tonnage', minWidth: 200, key: 'programmed_tonnage', sortable: false},
        {title: 'rolling.table.ordered_tons', key: 'ordered_tons', sortable: false},
        {
          title: 'rolling.table.updated_at',
          key: 'updated_at',
          minWidth: 180,
          value: (item) => formatDate(item['updated_at']),
          sortable: true
        },
        {
          title: 'rolling.table.created_at',
          key: 'created_at',
          minWidth: 180,
          value: (item) => formatDate(item['created_at']),
          sortable: true
        },
        {
          title: 'rolling.table.updated_by',
          key: 'updated_by',
          minWidth: 180,
          sortable: true
        }
      ],
      localOrganizationStatus: localStorage.getItem('organizationStatus') // organizationStatus取的是本地缓存的数据
    };
  },

  computed: {
    ...mapState('auth', ['userInfo']),
    headers() {
      return this.tableHeadersDefinition.map(header => ({
        ...header,
        title: this.$t(header.title)
      }));
    },
    ...mapFields('rolling_list', [
      'table.options.q',
      'table.options.page',
      'table.options.itemsPerPage',
      'table.options.sortBy',
      'table.options.descending',
      'table.loading',
      'table.rows.items',
      'table.rows.total',
      'table.rolling_status',
      'table.week_number',
      'table.options.start_date',
      'table.options.end_date',
      'table.product_class',
      'table.product_type',
      'table.product_size',
      'tableSelected'
    ]),
    ...mapState('auth', ['userInfo'])
  },

  mounted() {
    this.getAll({});

    this.$watch(
        (vm) => [vm.page],
        () => {
          this.getAll();
        }
    );

    this.$watch(
        (vm) => [vm.q, vm.itemsPerPage, vm.sortBy, vm.descending],
        () => {
          // this.page = 1;
          this.getAll();
        }
    );
  },
  destroyed() {
    this.closeCreateEdit();
  },
  methods: {
    ...mapGetters('auth', ['getPermission']),
    ...mapActions('rolling_list', [
      'getAll',
      'createEditShow',
      'removeShow',
      'closeCreateEdit',
      'import_file',
      'exportRolling'
    ]),

    handleImportRollingFromFTP () {
      // this.$refs["importFile"].handleShow();
      return RollingApi.importFileFromFTP().then((res) => {
        this.getAll();
        const import_text = "Import From FTP Created Sum: " + res.data.created_num + "; Updatede Sum:" + res.data.updated_num
        toast.success(import_text, {
          position: "bottom-center"
        });
      }).catch(res => {
          toast.error(res?.response?.data?.data?.tip || "Import From FTP Failed", { autoClose: 60000 })
      })
    },

    handleImportFile(file) {
      const maxSize = 50 * 1024 * 1024;
      if (file && file.size > maxSize) {
        toast.info("The file size cannot exceed 50MB！", {position: "bottom-center"})
        return false
      }

      const formData = new FormData();
      formData.append('file', file);
      return RollingApi.import(formData).then((res) => {
            this.getAll();
            const import_text = "Import Success Sum: " + res.data.success_sum + "; Repeat Sum:" + res.data.repeat_sum
            toast.success(import_text, {
              position: "bottom-center"
            });
          }
      ).catch(res => {
        toast.error(res?.response?.data?.data?.tip || "Import Fail", { autoClose: 60000 });
      }).finally(() => {
        console.log("this.$refs.fileinput", this.$refs.fileinput)
        this.file = undefined;
      })
    },
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      this.handleSearch();
    },
    clickNewJobOnLocation(item) {
      this.showJobEdit4Customer({job: null, loc: item});
    },
    selectFile() {
      this.$refs.fileinput.click();
    },

    SendM005ToPC() {
      let payload = {
        id: 5,
        type: 'srsmpc',
        msg: ''
      }
      API.SendM005ToPC(payload).then(res => {
        toast.success(`Send M005 Success`, {
          position: "bottom-center",
          delay: 2000
        });
        // +++ 批量状态更新调用 +++
        API.updateRollingStatusBatch().then(batchRes => {
          const successMsg = `M005发送成功,已更新${batchRes.data.updated_count}条记录状态`
          toast.success(successMsg, {
            position: "bottom-center",
            delay: 3000
          });
          // 刷新列表数据
          this.getAll(); 
        }).catch(batchError => {
          const errMsg = batchError.response?.data?.detail || "批量状态更新失败"
          toast.error(`M005成功但${errMsg}`, {
            autoClose: 8000
          });
        });
      }).catch(res => {
        toast.error(res?.response?.data?.detail || `Send M005 Fail`, { autoClose: 60000 });
      });
    },
    SendM240ToPC() {
      console.log('selec',this.tableSelected)

      API.SendM240ToPC({rolling_ids:this.tableSelected}).then(res => {
        toast.success(`Send M240 Success`, {
          position: "bottom-center",
          delay: 2000
        });
      }).catch(res => {
        toast.error(res?.response?.data?.detail || `Send M240 Fail`, { autoClose: 60000 });
      });
    },
    generateWeekOptions() {
      const weeks = moment().weeksInYear();
      let options = [];
      for (let i = 1; i <= weeks; i++) {
        const $value = getWeekRange(i);
        options.push({text: `${i}(${$value})`, value: i});
      }
      return options;
    },
    UpdateStartDate(res) {
      if (res) {
        this.start_date = moment(res).format("YYYY-MM-DD");
      } else {
        this.start_date = null;
      }
    },
    UpdateEndDate(res) {
      if (res) {
        this.end_date = moment(res).format("YYYY-MM-DD");
      } else {
        this.end_date = null;
      }
    },
    handleOpen() {
      this.$refs.tableRef.handleShow();
    }

  }
};
</script>
<style lang="scss" scoped>
.file-input-btn {
  position: relative;

  ::v-deep(.v-input) {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;

    .v-input__control {
      opacity: 0;
    }
  }
}

.code {
  display: block;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.overflow_ellipsis_col {
  display: block;
  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
