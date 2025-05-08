<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <CastCode v-model="table.filterOptions.cast_id" label="Cast Code"/>
        </v-col>
        <v-col cols="2">
          <DictCode v-model="table.filterOptions.rework_status" label="Rework Status" code="semi_rework_status_filter"/>
        </v-col>
        <v-col cols="2">
          <DictCode v-model="table.filterOptions.scrap" label="Scrap" code="semi_scrap"/>
        </v-col>
        <v-col cols="2">
          <SiteType type="semi" v-model="table.filterOptions.site_type_code" item-value="site_type_code"
                    density="default" label="Site Type"/>
        </v-col>
        <v-col cols="2">
          <Site type="semi" v-model="table.filterOptions.site_code" item-value="site_code" density="default"
                label="Site"/>
        </v-col>
        <v-col cols="2">
          <Area v-model="table.filterOptions.area_code" density="default" label="Area"
                :code="table.filterOptions.site_code"/>
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="table.filterOptions.filter_semi_type"
              density="default"
              multiple
              label="Semi Type"
              code="semi_type"
              placeholder="Please select"
              :disabled="table.semi_type_disabled"
          />
        </v-col>
        <v-col cols="2">
          <SemiSizeWidthThick
              v-model="table.filterOptions.width_thick"
              density="default"
              lable="Semi Size"
              placeholder="Filter by Width&Thick"
              @change="handleWidthThickPush"
          />
        </v-col>
        <v-col cols="2">
          <QualityCode v-model="table.filterOptions.quality_id" label="Quality Code"/>
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="table.filterOptions.status"
              label="Status"
              code="semi_status"
              density="default"
              placeholder="Select Status"
          />
        </v-col>
        <v-col cols="4" class="ml-auto">
          <div class="d-flex ga-4 align-left">
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
              {{ $t('global.reset') }}
            </v-btn>
            <v-btn type="submit" class="text-none" color="primary" variant="flat">
              {{ $t('global.search') }}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="5" class="ml-auto">
          <div class="d-flex ga-4 align-right">

            <v-spacer/>
            <div
            class="v-btn v-btn--flat v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated file-input-btn">
          <span class="v-btn__content text-none" data-no-activator="" v-permission="`Import`">{{ $t('semi.import_3rd_party_semi_and_cast') }}</span>
          <v-file-input
              ref="fileinput"
              v-model="file"
              @update:modelValue="importFiles"
              prepend-icon=""
              accept=".xlsx"
              hide-details
              variant="plain"
              density="compact"
          >
          </v-file-input>
        </div>

            <v-btn
              class="text-none" 
              color="primary"
              variant="flat"
              @click="goDetail(undefined)"
              v-permission="`Create`"
            >
            {{ $t('global.new') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4 pa-4" elevation="0" variant="outlined">
      <div class="d-flex flex-wrap ga-2 align-center mb-4">
        <v-dialog
            max-width="400"
            persistent
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn type="button" class="text-none" color="primary" variant="flat" :loading="loading"
                   v-bind="activatorProps" :disabled="isReturnButtonDisabled" v-permission="`Return`">
              Return
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card
                prepend-icon="mdi-help-circle-outline"
                :text="$t('semi.return.return_is_irreversible')"
                :title="$t('semi.return.do_you_confirm')"
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
                    @click="UpdateReturn(isActive)"
                >
                {{ $t('semi.confirm') }}
                </v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled=holdDisabled
            @click="handleSemiHold"
            v-permission="`Hold`"
        >
        {{ $t('semi.hold') }}
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled=unholdDisabled
            @click="handleSemiUnHold(undefined, undefined)"
            v-permission="`Unhold`"
        >
        {{ $t('semi.unhold') }}
        </v-btn>
        <v-btn variant="flat" color="primary text-none" @click="takeDialogByButton"
               :disabled="isMoveButtonDisabled" v-permission="`Move`">Move
        </v-btn>
        <div
            class="v-btn v-btn--flat v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated file-input-btn">
          <v-btn
              class="text-none px-0"
              color="primary"
              variant="flat"
              @click="handleExport"
              density="compact"
          >
            Export
          </v-btn>
        </div>
        <div
            class="v-btn v-btn--flat v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated file-input-btn">
          <span class="v-btn__content text-none" data-no-activator="">Import</span>
          <v-file-input
              ref="fileinputNew"
              v-model="fileNew"
              @update:modelValue="importFilesNew"
              prepend-icon=""
              accept=".xlsx,.csv"
              hide-details
              variant="plain"
              density="compact"
          >
          </v-file-input>
        </div>

          <v-btn class="text-none" color="primary" variant="flat" :disabled="reworkDisabled" @click="handleReWork"
                v-permission="`Rework`">
                {{ $t('semi.rework') }}
          </v-btn>
          <v-btn class="text-none" color="primary" variant="flat" :disabled="reworkCompleteDisabled"
                @click="handleReWorkComplete" v-permission="`ReworkComplete`">
                {{ $t('semi.rework_complete') }}
          </v-btn>
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              :disabled="defectDisabled"
              @click="handleDefects"
              v-permission="`Defect`"
          >
          {{ $t('semi.defect') }}
          </v-btn>
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              :disabled="isScrapButtonDisabled"
              @click="handleScrap"
              v-permission="`Scrap`"
          >
          {{ $t('semi.scrap') }}
          </v-btn>

          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="Print()"
              v-permission="`Print`"
          > {{ $t('global.print') }}
          </v-btn>
          <v-spacer/>
          <v-btn
              variant="text"
              icon="mdi-menu"
              @click="handleOpen"
          />
      </div>
      <v-data-table-server fixed-header height="650" show-current-page :headers="headers" :items="table.rows.items"
                           :items-length="table.rows.total || 0" item-value="id" show-select return-object
                           v-model="table.rows.selectedItems" v-model:page="table.options.page"
                           v-model:items-per-page="table.options.itemsPerPage" v-model:sort-by="table.options.sortBy"
                           v-model:sort-desc="table.options.descending" :footer-props="{
          'items-per-page-options': [5, 10, 20],
        }" :loading="table.loading" loading-text="Loading... Please wait">


        <template v-slot:item.cast.cast_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'CastChemicalDetail', query: { id: item.cast?.id } }">
            <span class="w-100 d-inline-block">{{ item.cast?.cast_code }}</span>
          </router-link>
        </template>

        <!-- <template v-slot:[`item.rolling`]="{ item }">
          <span class="table_action_icon">{{
            item.rolling?.rolling_code
          }}</span>
        </template> -->
        <template v-slot:item.rolling.rolling_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'RollingDetail', query: { id: item.rolling?.id } }">
            <span class="w-100 d-inline-block">{{ item.rolling?.rolling_code }}</span>
          </router-link>
        </template>

        <template v-slot:[`item.order_group`]="{ item }">
          <span class="table_action_icon">{{
              item.order_group?.semi_order_code
            }}</span>
        </template>

        <template v-slot:item.semi_load.semi_load_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'SemiLoadDetail', query: { id: item.semi_load?.id } }">
            <span class="w-100 d-inline-block">{{ item.semi_load?.semi_load_code }}</span>
          </router-link>
        </template>

        <template v-slot:[`item.site`]="{ item }">
          <span class="table_action_icon">{{ item.site?.code }}</span>
        </template>

        <template v-slot:[`item.length_mm`]="{ item }">
          <span class="table_action_icon">
            {{ item.length_mm != null ? item.length_mm : "" }}
          </span>
        </template>

        <template v-slot:[`item.width_mm`]="{ item }">
          <span class="table_action_icon">
            {{ item.width_mm != null ? item.width_mm : "" }}
          </span>
        </template>

        <template v-slot:[`item.estimated_weight_kg`]="{ item }">
          <span class="table_action_icon">
            {{
              item.estimated_weight_kg != null
                  ? item.estimated_weight_kg
                  : ""
            }}
          </span>
        </template>

        <template v-slot:item.rework_type="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-if="item.rework_type !== null" size="small">
              {{ item.rework_type }}
            </v-chip>
          </div>
        </template>

        <template v-slot:[`item.comment`]="{ item }">
          <span class="table_action_icon">{{ item.comment }}</span>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-btn variant="text" icon="mdi-pencil" @click="goDetail(item)" v-permission="`Detail`"/>
          <v-btn variant="text" icon="mdi-delete" @click="removeShow(item)" v-permission="`Delete`"/>
        </template>
        <template v-slot:item.semi_hold_reason="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.semi_hold_reason" :key="tag.id" size="small" @click="unHandleHold(tag.id, item)">
              {{ tag.name }}
            </v-chip>
          </div>
        </template>

      </v-data-table-server>
    </v-card>
    <Scrap ref="editFormRef" @refresh="handleSearch"/>
    <ReWork ref="reWorkRef" @refresh="handleSearch"/>
    <ReWorkConfirm ref="reWorkConfirmRef" @refresh="handleSearch"/>
    <Defects ref="defectsRef" @refresh="handleSearch"/>
    <HoldSemi ref="holdForm" @refresh="handleSearch"/>
    <UnHoldSemi ref="unholdForm" @refresh="handleSearch"/>
    <delete-dialog/>
    <MoveToSemi @refresh="handleSearch"/>
    <MoveToSemiBloom @refresh="handleSearch"/>
    <MesTable name="semi_list" ref="tableRef" v-model="headers"/>
  </v-container>
</template>

<script>
import DeleteDialog from "@/semi_admin/semi/DeleteDialog.vue";
import MoveToSemi from "@/semi_admin/semi/MoveToSemi.vue";
import MoveToSemiBloom from "@/semi_admin/semi/MoveToSemiBloom.vue";
import Site from "@/components/picker/Site.vue";
import SiteType from "@/components/picker/SiteType.vue";

import ReWork from "./components/reWork.vue";
import ReWorkConfirm from "./components/reWorkConfirm.vue";
import Defects from "./components/defectsBar.vue";
import HoldSemi from "./components/holdSemi.vue";
import UnHoldSemi from "./components/unholdSemi.vue";
import {mapState} from "pinia";
import {mapActions} from "pinia";
import {useSemiStore} from "./storePinia";
import {formatDate} from "@/util/util";
import {computed, ref, toRaw} from "vue";
import {toast} from "vue3-toastify";
import API from "./api";
import Scrap from "./components/scrap.vue";
import DictCode from "@/components/picker/DictCode.vue";
import Area from "./components/Area.vue";
import CastCode from "@/components/picker/CastCode.vue";
import MesTable from "@/components/table/index.vue";
import QualityCode from "@/components/picker/QualityCode.vue";
import SemiSizeWidthThick from "@/components/picker/SemiSizeWidthThick.vue";
import store from '@/store';
// import { useI18n } from "vue-i18n";
// const { t } = useI18n()
// File import logic
const fileinput = ref(null);

export default {
  name: "SemiTable",

  components: {
    MesTable,
    CastCode,
    DictCode,
    DeleteDialog,
    MoveToSemi,
    MoveToSemiBloom,
    ReWork,
    ReWorkConfirm,
    Defects,
    Scrap,
    HoldSemi,
    UnHoldSemi,
    SiteType,
    Site,
    Area,
    QualityCode,
    SemiSizeWidthThick,
  },
  data() {
    return {
      tableHeadersDefinition: [
        {
          title:"global.action",
          key: "action",
          minWidth: 150,
          sortable: false,
          align: "center",
          fixed: true,
          api: null,
          file: undefined,
          fileNew: undefined,
        },
        {
          title: "semi.table.long_semi_code",
          key: "long_semi_code",
          minWidth: 120,
          sortable: true,
        },
        {
          title: "semi.table.cast_code",
          key: "cast.cast_code",
          minWidth: 120,
          sortable: true,
        },
        {
          title: "semi.table.skelp_code",
          key: "skelp_code",
          minWidth: 150,
          sortable: true,
        },
        {
          title: "semi.table.generation_code",
          key: "generate_code",
          minWidth: 150,
          sortable: true,
        },
        {title: "semi.table.type", key: "semi_type", sortable: true},

        {title: "semi.table.quality_code", key: "cast.quality_code", value: (item) => item.cast?.quality_code, sortable: true},
        {title: "semi.table.quality", key: "quantity", sortable: true},
        {title: "semi.table.defect_qty", key: "defect_quantity", sortable: true},
        {title: "semi.table.scrap_qty", key: "scrap_quantity", sortable: true},
        {title: "semi.table.length", key: "length_mm", sortable: true},
        {title: "semi.table.width", key: "dim1", sortable: true},
        {title: "semi.table.thickness", key: "dim2", sortable: true},
        {title: "semi.table.weight", key: "estimated_weight_kg", sortable: true},
        {
          title: "semi.table.current_allocated_rolling",
          key: "rolling.rolling_code",
          minWidth: 180,
          sortable: true,
        },
        {
          title: "semi.table.current_allocated_block",
          minWidth: 180,
          key: "order_group.group_code",
          sortable: true,
        },
        {
          title: "semi.table.wagon_no",
          key: "semi_load.vehicle_code",
          sortable: true,
        },
        {
          title: "semi.table.area",
          key: "area.code",
          value: (item) => item.semi_status === "Transit" ? "Transit" : item.area?.code,
          sortable: true,
        },
        {
          title: "semi.table.status",
          key: "semi_status",
          sortable: true,
        },
        {
          title: "semi.table.position",
          key: "location",
          sortable: true,
        },
        {
          title: "semi.table.rework",
          key: "rework_type",
          sortable: true,
        },
        {
          title: "semi.table.defect",
          key: "defect_reason.name",
          value: (item) => item.defect_reason?.name,
          sortable: true,
        },
        {
          title: "semi.table.hold",
          key: "semi_hold_reason",
          sortable: true,
        },
        {
          title: "semi.table.hold_comment",
          key: "hold_comment",
          value: (item) => {
            if (!Array.isArray(item.semi_hold_reason)) {
              return '';
            }
            return item.semi_hold_reason.map(subItem => subItem.comment).join(',');
          },
          sortable: true,
        },
        {
          title: "semi.table.rework_comment",
          key: "rework_comment",
          sortable: true,
        },
        {
          title: "semi.table.comment",
          key: "comment",
          sortable: true,
        },
        {
          title: "semi.table.create_at",
          minWidth: 168,
          key: "created_at",
          value: (item) => formatDate(item.created_at),
          sortable: true,
        },
      ],
      query: {},
      localOrganizationStatus: localStorage.getItem("organizationStatus"),
      importLoading: false,
      loading: false,
      file: undefined
    };
  },
  computed: {
    ...mapState(useSemiStore, ["table", "dialogs"]),
    // 动态生成headers
    headers() {
      return this.tableHeadersDefinition.map(header => ({
        ...header,
        title: this.$t(header.title)
      }));
    },
    // 计算属性：是否禁用 Move 按钮
    isMoveButtonDisabled() {
      // 检查 `selectedItems` 是否为有效数组，避免 `undefined` 错误
      return (
          !Array.isArray(this.table.rows.selectedItems) ||
          this.table.rows.selectedItems.length === 0
      );
    },
    isReturnButtonDisabled() {
      // 检查 `selectedItems` 是否为有效数组，避免 `undefined` 错误
      return (
          !Array.isArray(this.table.rows.selectedItems) ||
          this.table.rows.selectedItems.length === 0 ||
          this.table.rows.selectedItems.some(
              (item) => item.semi_status === "Returned"
          )
      );
    },
    isScrapButtonDisabled() {
      return (
          !Array.isArray(this.table.rows.selectedItems) ||
          this.table.rows.selectedItems.length === 0 ||
          this.table.rows.selectedItems.length > 1
      );
    },
    reworkDisabled() {
      return (
          !Array.isArray(this.table.rows.selectedItems) ||
          this.table.rows.selectedItems.length === 0
      );
    },
    defectDisabled() {
      return (
          !Array.isArray(this.table.rows.selectedItems) ||
          this.table.rows.selectedItems.length !== 1
      );
    },
    reworkCompleteDisabled() {
      return (
          !Array.isArray(this.table.rows.selectedItems) || this.table.rows.selectedItems.length === 0 ||
          this.table.rows.selectedItems.some(
              (item) => item.rework_status !== "Rework"
          )
      );
    },
    holdDisabled() {
      return (
          !Array.isArray(this.table.rows.selectedItems) ||
          this.table.rows.selectedItems.length === 0
      );
    },
    unholdDisabled() {
      return (
          !Array.isArray(this.table.rows.selectedItems) ||
          this.table.rows.selectedItems.length === 0 ||
          this.table.rows.selectedItems.some(
              (item) => item.hold_status === 'hold'
          )
      );
    },
    millCode() {
      return store.state.auth.defaultMillCode;
    },
  },

  watch: {
    selectedValue(newValue) {
    },

    millCode(newValue) {
      this.initializeFilterSemiType();
    },
  },


  mounted() {
    this.initializeFilterSemiType();
    this.api = API;
    this.getCodeSemi();

    this.getAllNew({});

    this.$watch(
        (vm) => [vm.page],
        () => {
          this.getAllNew();
        }
    );

    this.$watch(
        (vm) => [
          vm.table.options.q,
          vm.table.options.page,
          vm.table.options.itemsPerPage,
          vm.table.options.sortBy,
          vm.table.options.descending,
        ],
        () => {
          this.getAllNew();
        }
    );
  },

  beforeUnmount() {
    this.$refs["searchForm"].reset();
    this.resetQuery();
  },

  methods: {
    ...mapActions(useSemiStore, [
      "getSemiColCodeById",
      "takeDialogByButton",
      "getAll",
      "resetQuery",
      "getAllNew",
      "removeShow",
      "editShow",
      "goDetail",
      "Print",
      "initializeFilterSemiType"
    ]),

    selectDefaultSemiType() {
      let current_mill_id = store.state.auth?.userInfo.current_mill_id;
      if (current_mill_id === 410) {
        this.table.filterOptions.filter_semi_type = ["Slab", "Bloom"];
      } else if (current_mill_id === 1) {
        this.table.filterOptions.filter_semi_type = ["BLM"];
      } else {
        this.table.filterOptions.filter_semi_type = [];
      }
    },

    handleOpen() {
      this.$refs.tableRef.handleShow();
    },
    getCodeSemi() {
      API.commenRequestGet("/area/item/codes/semi").then(reponse => {
        // console.log(reponse.data);
        this.table.semiCodes = reponse.data
      })
    },

    handleSearch() {
      if (this.table.filterOptions.site_type_code) {
        if (!this.table.filterOptions.site_code) {
          toast.error("Please Select Site", {autoClose: 60000});
          return;
        }
        if (Object.keys(this.table.filterOptions.area_code).length === 0) {
          toast.error("Please Select AreaCode", {autoClose: 60000});
          return;
        }
      }
      this.getAllNew();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      this.handleSearch();
    },

    handleReWork() {
      // const items = toRaw(selected.value);
      if (this.table.rows.selectedItems.some((item) => item.semi_status === "Transit")) {
        toast.error("Please select the item that has not been transit", {autoClose: 60000});
        return;
      }
      this.$refs["reWorkRef"].handleShow(this.table.rows.selectedItems);
    },

    handleReWorkComplete() {
      if (this.table.rows.selectedItems.some((item) => item.semi_status === "Transit")) {
        toast.error("Please select the item that has not been transit", {autoClose: 60000});
        return;
      }
      this.reworkConfirmAction(this.table.rows.selectedItems);
    },

    reworkConfirmAction(item) {
      this.$refs["reWorkConfirmRef"].handleShow(item);
    },
    async UpdateReturn(isActive) {
      isActive.value = false;
      const params = toRaw(this.table.rows.selectedItems);
      const ids = params?.map(item => item.id) || [];
      if (ids.length === 0) {
        toast.warning("Please Choose Transport List", {
          position: "bottom-center"
        });
        return;
      }
      this.loading = true;
      try {
        await API.returnSemi({"ids": ids});
        toast.success("Return Success", {
          position: "bottom-center"
        });
        this.getAllNew();
      } catch (res) {
        if (res?.response?.status === 400) {
          toast.error(res.response.data.detail || "Bad Request", {autoClose: 60000});
        } else {
          toast.error("Return Fail", {autoClose: 60000});
        }
      } finally {
        this.loading = false;
      }
    },

    importFiles(file) {
      const maxSize = 50 * 1024 * 1024;
      if (file && file.size > maxSize) {
        toast.info("The file size cannot exceed 50MB！", {position: "bottom-center"})
        return false
      }
      // 将所有选中的文件添加到 FormData 中
      const formData = new FormData();
      formData.append('file', file);


      this.importLoading = true;
      return API.import(formData).then((response) => {
        // 成功后显示提示信息
        const importText = `Import Success Sum: ${response.data.semi_add_cnt}; Update Sum: ${response.data.semi_update_cnt}；Import Success Cast: ${response.data.cast_add_cnt}; Update Sum: ${response.data.cast_update_cnt}`;
        toast.success(importText, {position: "bottom-center"});
        // 刷新数据
        this.getAllNew();
      }).catch((error) => {
        console.error("Error uploading files:", error);
        toast.error(`Error uploading files: ${error.response.data.detail}`, {autoClose: 60000});
      }).finally(() => {
        this.file = undefined
        this.importLoading = false;
      })
    },
    importFilesNew(file) {
      const maxSize = 50 * 1024 * 1024;
      if (file && file.size > maxSize) {
        toast.info("The file size cannot exceed 50MB！", {position: "bottom-center"});
        return false;
      }

      // 将所有选中的文件添加到 FormData 中
      const formData = new FormData();
      formData.append('file', file);


      this.importLoading = true;
      return API.importnew(formData).then((response) => {
        // 成功后显示提示信息
        const importText = `Import Success Sum: ${response.data.add_cnt}; Update Sum: ${response.data.update_cnt}`;
        toast.success(importText, {position: "bottom-center"});
        // 刷新数据
        this.getAllNew();
      }).catch((error) => {
        console.error("Error uploading files:", error);
        toast.error(`Error uploading files: ${error.response.data.detail}`, {autoClose: 60000});
      }).finally(() => {
        this.fileNew = undefined;
        this.importLoading = false;
      });
    },

    handleDefects() {
      const items = toRaw(this.table.rows.selectedItems);
      this.$refs["defectsRef"].handleShow(items);
    },
    handleSemiHold() {
      const items = toRaw(this.table.rows.selectedItems);
      this.$refs["holdForm"].handleShow(items);
    },
    // handleSemiUnHold() {
    //   const items = toRaw(this.table.rows.selectedItems);
    //   this.$refs["unholdForm"].handleShow(items);
    // },
    handleSemiUnHold(id, arr) {
      if (!arr) {
        const items = toRaw(this.table.rows.selectedItems);
        this.$refs["unholdForm"].handleShow(items, id);
      } else {
        this.$refs["unholdForm"].handleShow([arr], id);
      }
    },
    handleScrap() {
      const items = toRaw(this.table.rows.selectedItems);
      this.$refs["editFormRef"].handleShow(items);
    },
    handleWidthThickPush(item) {
      this.table.filterOptions.width = item.width_mm;
      this.table.filterOptions.thick = item.thick_mm;
    },

    handleExport() {
      // 复用store中的参数构造逻辑
      const params = {
        ...toRaw(this.table.options), // 包含分页、排序等基础参数
        fields: [],
        ops: [],
        values: [],
        filter_type: undefined,
        site: this.table.filterOptions.site_code,
        area_code: this.table.filterOptions.area_code,
        itemsPerPage: -1 // 导出全部数据
      };

      // 筛选条件处理（与store逻辑保持一致）
      if (this.table.filterOptions.scrap === 'Not Scrapped') {
        params.fields.push("semi_status");
        params.ops.push("!=");
        params.values.push('Scrapped');
        params.fields.push("semi_status");
        params.ops.push("is_null");
        params.values.push(true);
        params.filter_type = "custom";
      } else if (this.table.filterOptions.scrap === 'Scrapped') {
        params.fields.push("semi_status");
        params.ops.push("eq");
        params.values.push(this.table.filterOptions.scrap);
      }

      // 其他过滤条件处理（保持与store相同的逻辑）
      const filterMappings = [
        {field: 'rework_status', storeField: 'rework_type'},
        {field: 'cast_id', storeField: 'cast_id'},
        {field: 'quality_id', storeField: 'quality_id'},
        {field: 'status', storeField: 'semi_status'}
      ];

      filterMappings.forEach(({field, storeField}) => {
        if (this.table.filterOptions[field]) {
          params.fields.push(storeField);
          params.ops.push("eq");
          params.values.push(this.table.filterOptions[field]);
        }
      });

      if (this.table.filterOptions.filter_semi_type?.length) {
        params.fields.push("semi_type");
        params.ops.push("in");
        params.values.push(this.table.filterOptions.filter_semi_type);
      }

      if (this.table.filterOptions.width_thick) {
        params.fields.push("width_mm", "thickness_mm");
        params.ops.push("eq", "eq");
        params.values.push(
            this.table.filterOptions.width,
            this.table.filterOptions.thick
        );
      }

      // 调用导出接口
      this.exportData(params);
    },


    exportData(params) {
      this.loading = true;
      return this.api.export(params)
          .then((response) => {
            // 成功后显示提示信息
            toast.success("Export Success", {position: "bottom-center"});
          })
          .catch((error) => {
            console.error("Error exporting data:", error);
            toast.error(`Error exporting data: ${error.response.data.detail}`, {autoClose: 60000});
          })
          .finally(() => {
            this.loading = false;
          });
    },
  },
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
</style>
