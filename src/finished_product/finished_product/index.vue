<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">
        <v-col v-show="handleFieldShow('runoutCode')" cols="2">
          <template v-if="defaultMillCode === 'SRSM'">
            <v-text-field v-model="searchOptions.code" density="default" hide-details variant="underlined"
                          placeholder="Bundle ID" bg-color="white" clearable label="Bundle ID"></v-text-field>
          </template>
          <template v-else>
            <RunoutCode
                v-model="searchOptions.runout_id"
                label="Runout Code"
                :hide-details="true"
            />
          </template>
        </v-col>
        <v-col v-show="handleFieldShow('siteType')" cols="2">
          <SiteType
              type="finished"
              v-model="searchOptions.site_type_code"
              item-value="site_type_code"
              density="default"
              label="Site Type"
              :hide-details="true"
          />

        </v-col>
        <v-col v-show="handleFieldShow('siteCode')" cols="2">
          <Site
              v-model="searchOptions.site_code"
              label="Site"
              :hide-details="true"
              :code="searchOptions.site_type_code"
          />
        </v-col>
        <v-col v-show="handleFieldShow('areaCode')" cols="2">
          <Area
              v-model="searchOptions.area_code"
              label="Area"
              :hide-details="true"
              :code="searchOptions.site_code"
          />
        </v-col>


        <v-col v-show="handleFieldShow('castCode')" cols="2">
          <CastCode
              v-model="searchOptions.cast_id"
              label="Cast Code"
              :hide-details="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('holdReason')" cols="2">
          <HoldReasonCode
              v-model="hold_reason_code"
              label="Hold Reason Code"
              :hide-details="true"
              @change="handlePickHoldReasonCode"
          />
        </v-col>
        <v-col v-show="handleFieldShow('businessType')" cols="2">
          <DictCode
              v-model="searchOptions.stock_type"
              label="Business Type"
              :code="`business_type#${toLower(defaultMillCode)}`"
              :hide-details="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('store')" cols="2">
          <StoreCode
              v-model="searchOptions.store_code"
              label="Store"
              :hide-details="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('reworkStatus')" cols="2">
          <TreeDictCode variant="underlined" :hide-details="true" :code="`rework_type#${toLower(defaultMillCode)}`" label="Rework Status"
                        v-model="searchOptions.rework_status" select-strategy="classic"
          />
        </v-col>
        <v-col v-show="handleFieldShow('allocateStatus')" cols="2">
          <DictCode
              v-model="searchOptions.allocation_status"
              label="Allocated Status"
              code="allocation_status"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('reserveStatus')" cols="2">
          <DictCode
              v-model="searchOptions.reserve_status"
              label="Reserve Status"
              code="reserve_status"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('loadStatus')" cols="2">
          <DictCode
              v-model="searchOptions.load_status"
              label="Load Status"
              code="load_status"
              :hide-details="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('adviceStatus')" cols="2">
          <DictCode
              v-model="searchOptions.advice_status"
              label="Advice Status"
              code="finished_advice_status"
              :hide-details="true"
          />
        </v-col>

        <v-col v-show="handleFieldShow('adviceCode')" cols="2">
          <AdviceCode
              v-model="advice_code"
              label="Advice Code"
              :hide-details="true"
              @change="handlePickAdviceCode"
          />
        </v-col>
        <v-col v-show="handleFieldShow('loadCode')" cols="2">
          <LoadCode
              v-model="load_code"
              label="Load Code"
              :hide-details="true"
              @change="handlePickLoadCode"
          />
        </v-col>
        <v-col v-show="handleFieldShow('productType')" cols="2">
          <ProductTypeCode v-model="searchOptions.product_type_id" variant="underlined" :hide-details="true"
                           label="Section Size"
                           placeholder="Please Select Section Size"
                           :multiple="true"
                           :product_class="searchOptions.product_class"
                           :product_category="searchOptions.product_category_code"/>
        </v-col>

        <v-col v-show="handleFieldShow('allocatedOrder')" cols="2">
          <OrderCode v-model="searchOptions.order_id" variant="underlined" :hide-details="true"
                     label="Allocated Order"></OrderCode>
        </v-col>

        <v-col v-show="handleFieldShow('allocatedItem')" cols="2">
          <OrderItemCode v-model="searchOptions.order_item_id" variant="underlined" :hide-details="true"
                         label="Allocated Item"
                         :order_id="searchOptions.order_id"/>
        </v-col>

        <v-col v-show="handleFieldShow('reservedOrder')" cols="2">
          <ReservedOrderCode v-model="searchOptions.reserved_order_id" variant="underlined" :hide-details="true"
                             label="Reserved Order"></ReservedOrderCode>
        </v-col>
        <v-col v-show="handleFieldShow('reservedOrderItem')" cols="2">
          <ReservedOrderItemCode v-model="searchOptions.reserved_order_item_id" variant="underlined"
                                 :hide-details="true" label="Reserved Order Item"
                                 :order_id="searchOptions.reserved_order_id"/>
        </v-col>
        <v-col v-show="handleFieldShow('exist')" cols="2">
          <DictCode
              v-model="searchOptions.exist_flag"
              label="Exist"
              code="exist_flag"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('status')" cols="2">
          <DictCode
              v-model="searchOptions.status"
              label="Status"
              code="finished_product_status"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>

        <v-col cols="2">
          <v-text-field
              type="number"
              v-model="searchOptions.length_mm_min"
              :rules="rules.length_mm_min"
              :min="0"
              class="no-input-control"
              variant="underlined"
              label="Length Min(mm)"
              clearable
              :hide-details="true"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
              type="number"
              v-model="searchOptions.length_mm_max"
              :rules="rules.length_mm_max"
              :min="0"
              class="no-input-control"
              variant="underlined"
              label="Length Max(mm)"
              clearable
              :hide-details="true"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <DictCode
              v-model="searchOptions.replenish_order"
              label="Replenish"
              code="exist_flag"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>
        <v-col v-show="handleFieldShow('status')" cols="2">
          <DictCode
              v-model="searchOptions.cover_status"
              label="Cover Status"
              code="cover_status"
              :hide-details="true"
              :multiple="true"
          />
        </v-col>

        <v-col cols="2">
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none mt-4"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              {{ $t("global.reset") }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none mt-4"
                color="primary"
                variant="flat"
                :loading="loading"
                v-permission="`Search`"
            >
              {{ $t("global.search") }}
            </v-btn>
          </div>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-row align="center">
        <v-col cols="2">
          <v-text-field v-model="select_weight" disabled density="default" variant="underlined"
                        placeholder="0" persistent-placeholder label="Select Weight(Tonnes)" :hide-details="true"
                        bg-color="white" clearable></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field v-model="max_length" disabled density="default" variant="underlined"
                        placeholder="0" persistent-placeholder label="Max Length(mm)" :hide-details="true"
                        bg-color="white" clearable></v-text-field>
        </v-col>
        <v-col cols="8" class="text-end">
          <router-link to="/finished_product_detail">
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                v-permission="`Create`"
            >
              {{ $t('global.new') }}
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <div class="d-flex align-center ga-2 flex-wrap mb-4">
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0"
            @click="handleMove"
            v-permission="`Move`"
        >
          Move
        </v-btn>
        <router-link :to="{ name: 'AdviceDetail', query: { ids: selected.map(item => item.id) } }">
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              v-permission="`Create Advice`"
          >
            Create Advice
          </v-btn>
        </router-link>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0"
            @click="handleHold"
            v-permission="`Hold`"
        >
          Hold
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0"
            @click="unHandleHold(undefined, undefined)"
            v-permission="`Unhold`"
        >
          Unhold
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="reworkDisabled"
            @click="handleReWork"
            v-permission="`Rework`"
        >
          Rework
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="reworkCompleteDisabled"
            @click="handleReWorkComplete"
            v-permission="`Rework Complete`"
        >
          Complete Rework
        </v-btn>
        <v-btn
            class="text-none"
            variant="flat"
            color="primary"
            @click="handleRebundle"
            :disabled="rebundleDisabled || selected.some(item => item.advice && item.advice.length > 0)"
            v-permission="`Rebundle`"
        >
          Rebundle
        </v-btn>
        <v-btn
            class="text-none"
            variant="flat"
            color="primary"
            :disabled="combineDisabled || selected.some(item => item.advice && item.advice.length > 0)"
            @click="handleCombine"
            v-permission="`Combine`"
        >
          Combine
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length !== 1 || selected.some(item => item.advice && item.advice.length > 0)"
            @click="handlSplit"
            v-permission="`Split`"
        >
          Split
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0 || selected.some(item => item.advice && item.advice.length > 0)"
            @click="handleAllocate"
            v-permission="`Allocate`"
        >
          Allocate
        </v-btn>
        <v-btn
            v-if="defaultMillCode !== 'SRSM'"
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0 || selected.some(item => item.advice && item.advice.length > 0)"
            @click="regradeAction"
            v-permission="`Regrade`"
        >
          Regrade
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length !== 1"
            @click="handleDefects"
            v-permission="`Defect`"
        >
          Defect
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0 || selected.some(item => item.load_id != null)"
            @click="handleCreateLoad"
            v-permission="`Create Load`"
        >
          Create Load
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length === 0"
            @click="handleRetrieve"
            v-permission="`Return`"
        >
          Return
        </v-btn>
        <v-btn
            v-if="defaultMillCode !== 'SRSM'"
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selected.length !== 1"
            @click="handleCut"
            v-permission="`Part-Sawn`"
        >
          Part-Sawn
        </v-btn>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handlePrint"
            v-permission="`Print`"
        >
          Print
        </v-btn>

        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="handleLabelPrint"
            :disabled="selected.length === 0 || selected.length > 1"
            v-permission="`Label Print`"
        >
          Label Print
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            @click="uncover"
            :disabled="selected.length === 0"
            :loading="uncoverLoading"
            v-permission="`Uncover`"
        >
          Uncover
        </v-btn>
        <v-spacer/>

        <v-btn
            variant="text"
            icon="mdi-menu"
            @click="handleOpen"
        />
      </div>
      <v-divider/>
      <v-data-table-server
          height="650"
          v-model="selected"
          min-height="300"
          :items-per-page="queryParams.itemsPerPage"
          :page="queryParams.page"
          :headers="tableHeaders"
          :items="tableList"
          :items-length="total"
          :loading="loading"
          fixed-header
          show-select
          show-current-page
          return-object
          @update:page="handleTableChangePage"
          @update:itemsPerPage="handleTableChangeItemsPerChange"
          @update:sortBy="handleTableChangeSortBy"
      >
        <template v-slot:item.runout.runout_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'RunoutDetail', query: { runout_id: item.runout?.id } }">
            <span class="w-100 d-inline-block">{{ item.runout?.runout_code }}</span>
          </router-link>
        </template>
        <template v-slot:item.cast.cast_code="{ item }">
          <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'CastChemicalDetail', query: { id: item.cast?.id } }">
            <span class="w-100 d-inline-block">{{ item.cast?.cast_code }}</span>
          </router-link>
        </template>

        <template v-slot:item.order_item.line_item_code="{ item }">
          <span v-if="item.order_item" class="allocated-order-item">
            <router-link class="align-center text-decoration-none grey-darken-4" :to="{ path: '/order_item', query : {id:item.order_id}  }">
              <span class="d-inline-block">{{ item.order_item?.order?.order_code }}</span>
            </router-link>
            <span class="separator">-</span>
            <router-link class=" align-center text-decoration-none grey-darken-4" :to="{ path: '/order_item/detail',query : {id:item.order_item?.id}  }">
              <span class="d-inline-block">{{ item.order_item?.line_item_code }}</span>
            </router-link>
          </span>
        </template>
        <template v-slot:item.reserved_order_item.line_item_code="{ item }">
          <span v-if="item.reserved_order_item" class="reserved-order-item">
            <router-link class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemTable', query: { order_code: item.reserved_order_item.order?.order_code } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.order?.order_code }}</span>
            </router-link>
            <span class="separator">-</span>
            <router-link class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemDetail', query: { id: item.reserved_order_item.id } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.line_item_code }}</span>
            </router-link>
          </span>
        </template>

        <template v-slot:item.status="{ item }">
          <div class="d-flex justify-center ga-2">

            <v-chip size="small" v-if="item.status">
              {{ item.status }}
            </v-chip>
            <span v-else>
            </span>
          </div>
        </template>
        <template v-slot:item.area.code="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip size="small" v-if="false">
              En-Route
            </v-chip>
            <span v-else="item.advice.true">
              {{ item.area?.code }}
            </span>
          </div>
        </template>
        <template v-slot:item.hold_reason="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small" @click="unHandleHold(tag.id, item)">
              {{ tag.name }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.hold_comment="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small" @click="unHandleHold(tag.id, item)">
              {{ tag.comment }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.advice="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.advice" :key="tag.id" size="small" :color="tag.status === 'enroute' ? 'green': 'grey'">
              {{ tag.advice_code }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.loads="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-chip v-for="tag in item.loads" :key="tag.id" size="small">
              {{ tag.code }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.rework_type="{ item }">
          <div class="justify-center">
            <TreeDictCode variant="underlined" :hide-details="false" code="rework_type" placeholder=""
                          v-model="item.rework_type" :disabled="true"/>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <router-link class="text-decoration-none grey-darken-4 mr-2"
                       :to="!(item.advice && item.advice.length > 0) ? { name: 'finishedProductDetail', query: { id: item.id } } : ''" :disabled="!(item.advice && item.advice.length > 0)">
            <v-icon size="small" v-permission="`Detail`" :disabled="item.advice && item.advice.length > 0">mdi-pencil</v-icon>
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
              />
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                  prepend-icon="mdi-help-circle-outline"
                  title="Confirm to delete data?"
              >
                <v-card-text>
                  <div>Deletion is irreversible</div>
                  <v-text-field v-model="deleteReason" label="Please enter the deletion reason"/>
                </v-card-text>
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
    <HoldProduct ref="holdForm" @refresh="handleSearch"/>
    <Split ref="splitForm" @refresh="handleSearch"/>
    <UnHoldProduct ref="unHoldForm" @refresh="handleSearch"/>
    <Allocate :headers="tableHeaders" ref="allocateForm" @refresh="handleSearch"/>
    <Rebundle ref="rebundleForm" @refresh="handleSearch"/>
    <MoveAction ref="moveFormRef" @refresh="handleSearch"/>
    <RegradeBar ref="regradeBarRef" @refresh="handleSearch"/>
    <ReWork ref="reWorkRef" @refresh="handleSearch"/>
    <ReWorkConfirm ref="reWorkConfirmRef" @refresh="handleSearch"/>
    <Defects ref="defectsRef" @refresh="handleSearch"/>
    <CreateLoad ref="createLoadRef" @refresh="handleSearch"/>
    <Return ref="retrieveRef" @refresh="handleSearch"/>
    <Combine ref="combineFrom" @refresh="handleSearch"/>
    <MesTable ref="tableRef" name="finishedProduct" v-model="tableHeaders"/>
    <partSawn ref="partSawnRef" @refresh="handleSearch"/>
    <LabelPrint ref="labelPrintRef" @refresh="handleSearch" :data="labelPrintData"/>
  </v-container>
</template>
<script setup>
import {useRoute} from "vue-router";
import {
  onMounted,
  getCurrentInstance,
  reactive,
  ref,
  toRaw,
  toRefs,
  watch,
  computed,
  onBeforeUnmount,
  unref
} from "vue";
import {toast} from "vue3-toastify";
import {useStore} from "vuex";
import {map, toLower} from "lodash";
import printJS from "print-js";
import {formatDate, greaterThan} from '@/util/util';
import TreeDictCode from "@/components/picker/TreeDictCode.vue";
import HoldReasonCode from "@/components/picker/HoldReasonCode.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import AreaCode from "@/components/picker/AreaCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import AdviceCode from "@/components/picker/AdviceCode.vue";
import LoadCode from "@/components/picker/LoadCode.vue";

import MesTable from "@/components/table/index.vue";
import SiteType from "@/components/picker/SiteType.vue";
// import Site from "@/finished_product/finished_product_stock_level/components/Site.vue";
import Site from "@/finished_product/finished_product/components/picker/Site.vue";
import Area from "@/finished_product/finished_product/components/picker/Area.vue"
import useFooterEvent from "@/hooks/useFooterEvent";
import useSearchFieldVisibility from '@/hooks/useSearchFieldVisibility'

import ReservedOrderCode from "./components/picker/ReservedOrderCode.vue";
import ReservedOrderItemCode from "./components/picker/ReservedOrderItemCode.vue";
import HoldProduct from "./components/holdProduct.vue";
import Split from "./components/split.vue";
import UnHoldProduct from "./components/unHoldProduct.vue";
import Allocate from "./components/allocate.vue";
import Rebundle from "./components/rebundle.vue"
import MoveAction from "./components/move.vue";
import RegradeBar from "./components/regradeBar.vue";
import ReWork from "./components/reWork.vue";
import ReWorkConfirm from "./components/reWorkConfirm.vue";
import Defects from "./components/defectsBar.vue";
import CreateLoad from "./components/createLoad.vue";
import Return from "./components/return.vue";
import Archive from "./components/archive.vue";
import Combine from "./components/combineLength.vue";
import partSawn from "./components/partSawn.vue"
import LabelPrint from "./components/labelPrint.vue"
import StoreCode from "./components/picker/StoreCode.vue";
import API from "./api";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useStore();

const fields = ["runoutCode", "siteType", "siteCode", "areaCode", "castCode", "holdReason", "businessType", "store", "reworkStatus", "allocateStatus", "reserveStatus", "loadStatus", "adviceStatus", "adviceCode", "loadCode", "productType", "allocatedOrder", "allocatedItem", "reservedOrder", "reservedOrderItem", "exist", "status"];

const defaultMillCode = computed(() => store.state.auth.defaultMillCode);


const labelPrintData = reactive([]);
const route = useRoute();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const searchFields = ref([...fields]);


const tableHeaders = computed(() => [
  { title: t('finished_product.table.action'), key: "action", minWidth: 120, fixed: true, sortable: false, align: "center" },
  { title: defaultMillCode.value === 'SRSM' ? t('finished_product.table.bundle_id') : t('finished_product.table.code'), key: "code", sortable: true, minWidth: 160 },
  { title: t('finished_product.table.producttype_code'), key: "product_type.code", value: (item) => item.product_type?.code, sortable: true, minWidth: 160 },
  { title: t('finished_product.table.cut_code'), key: "cut_code", sortable: true },
  { title: t('finished_product.table.length'), key: "length_mm", sortable: true },
  { title: t('finished_product.table.defective_length'), key: "defective_length", sortable: true },
  { title: t('finished_product.table.weight'), key: "estimated_weight_kg", sortable: true },
  { title: t('finished_product.table.mults'), key: "mult_code", sortable: true },
  { title: t('finished_product.table.runout_code'), key: "runout.runout_code", sortable: true },
  { title: t('finished_product.table.bussiness_type'), key: "stock_type", sortable: true },
  { title: t('finished_product.table.store'), key: "store_code", sortable: true },
  { title: t('finished_product.table.quantity'), key: "quantity", sortable: true },
  { title: t('finished_product.table.defective_piece'), key: "defect_quantity", sortable: true },
  { title: t('finished_product.table.area_code'), key: "area.code", sortable: true },
  { title: t('finished_product.table.allocated_order_item'), key: "order_item.line_item_code", value: (item) => `${item.order_item?.order?.order_code || ''}-${item.order_item?.line_item_code || ''}`, minWidth: 180, sortable: true },
  { title: t('finished_product.table.sap_order_item'), key: "order.sap_order_code", value: (item) => `${item.order?.sap_order_code || ''}-${item.order_item?.sap_line_item_code || ''}`, minWidth: 180, sortable: true },
  { title: t('finished_product.table.reserved_order_item'), key: "reserved_order_item.line_item_code", value: (item) => `${item.reserved_order_item?.order?.order_code || ''}-${item.reserved_order_item?.line_item_code || ''}`, minWidth: 180, sortable: true },
  { title: t('finished_product.table.allocated_status'), key: "allocation_status", value: (item) => {
    if (item.allocation_status === "allocate") {
      return t('finished_product.table.prime_stock');
    } else if (item.allocation_status === "free_stock") {
      return t('finished_product.table.free_stock');
    } else if (item.allocation_status === "scrap") {
      return t('finished_product.table.scrap');
    }
    return item.allocation_status; // 若不是上述三种情况，返回原状态
  } },
  { title: t('finished_product.table.allocated_customer_no'), key: "order_item.order.customer_code" },
  { title: t('finished_product.table.allocated_customer_name'), key: "order_item.order.customer_short_name" },
  { title: t('finished_product.table.reserved_customer_no'), key: "reserved_order_item.order.customer_code" },
  { title: t('finished_product.table.reserved_customer_name'), key: "reserved_order_item.order.customer_short_name" },
  { title: t('finished_product.table.spec_code'), key: "spec.spec_code", value: (item) => item.spec?.spec_code, sortable: true },
  { title: t('finished_product.table.short_name'), key: "spec.short_name", value: (item) => item.spec?.short_name, sortable: true },
  { title: t('finished_product.table.full_name'), key: "spec.full_name", value: (item) => item.spec?.full_name, sortable: true },
  { title: t('finished_product.table.cast_code'), key: "cast.cast_code", value: (item) => item.cast?.cast_code, sortable: true },
  { title: t('finished_product.table.rolling_code'), key: "rolling.rolling_code", value: (item) => item.rolling?.rolling_code, sortable: true },
  { title: t('finished_product.table.compliance'), key: "test_result", sortable: false },
  { title: t('finished_product.table.location'), key: "location", sortable: true },
  { title: t('finished_product.table.exist'), key: "exist_flag", sortable: true },
  { title: t('finished_product.table.sawn_by'), key: "sawn_by", sortable: true },
  { title: t('finished_product.table.defect'), key: "defect_reason.name", value: (item) => item.defect_reason?.name, sortable: true },
  { title: t('finished_product.table.load'), key: "loads", sortable: false },
  { title: t('finished_product.table.advice'), key: "advice", sortable: false },
  { title: t('finished_product.table.rework_status'), key: "rework_type", sortable: true, minWidth: 160 },
  { title: t('finished_product.table.reserve_status'), key: "reserve_status", sortable: true },
  { title: t('finished_product.table.status'), key: "status", sortable: true },
  { title: t('finished_product.table.rework_remarks'), key: "rework_complete_comment", sortable: false },
  { title: t('finished_product.table.created_at'), key: "created_at", sortable: true, minWidth: 180 },
  { title: t('finished_product.table.hold_status'), key: "hold_reason", sortable: false },
  { title: t('finished_product.table.hold_comment'), key: "hold_comment", sortable: false },
  { title: t('finished_product.table.comment'), key: "comment", value: (item) => item.comment, sortable: true },
  { title: t('finished_product.table.regrade_reason'), key: "regrade_reason.code", value: (item) => item.regrade_reason?.code, sortable: true },
  { title: t('finished_product.table.regrade_comment'), key: "regrade_comment", value: (item) => item.regrade_comment, sortable: true },
  { title: t('finished_product.table.cover_status'), key: "cover_status", sortable: true },
  { title: t('finished_product.table.cover_date'), key: "cover_date", sortable: true, value: (item) => formatDate(item.cover_date) },
  { title: t('finished_product.table.auto_pass'), key: "auto_pass", sortable: true },
]);


const printFields = [
  { displayName: t('finished_product.table.code'), field: "code" },
  { displayName: t('finished_product.table.cut_code'), field: "cut_code" },
  { displayName: t('finished_product.table.length_mm'), field: "length_mm" },
  { displayName: t('finished_product.table.mults'), field: "mult_code" },
  { displayName: t('finished_product.table.runout_code'), field: "runout_code" },
  { displayName: t('finished_product.table.business_type'), field: "stock_type" },
  { displayName: t('finished_product.table.area_code'), field: "area_code" },
  { displayName: t('finished_product.table.allocated_order_item'), field: "allocated_order_item" },
  { displayName: t('finished_product.table.product_type_code'), field: "product_type_code" },
  { displayName: t('finished_product.table.spec_code'), field: "spec_code" },
  { displayName: t('finished_product.table.cast_code'), field: "cast_code" },
  { displayName: t('finished_product.table.compliance'), field: "test_result" },
  { displayName: t('finished_product.table.location'), field: "location" },
  { displayName: t('finished_product.table.exist'), field: "exist_flag" },
  { displayName: t('finished_product.table.defect'), field: "defect_reason_name" },
  { displayName: t('finished_product.table.load'), field: "load_code" },
  { displayName: t('finished_product.table.advice'), field: "advice_code" },
  { displayName: t('finished_product.table.rework_status'), field: "rework_type" },
  { displayName: t('finished_product.table.reserve_status'), field: "reserve_status" },
  { displayName: t('finished_product.table.status'), field: "status" },
  { displayName: t('finished_product.table.created_at'), field: "created_at" },
  { displayName: t('finished_product.table.comment'), field: "comment" },
  { displayName: t('finished_product.table.regrade_comment'), field: "regrade_comment" },
  { displayName: t('finished_product.table.regrade_reason'), field: "regrade_reason_code" },
  { displayName: t('finished_product.table.hold_reason'), field: "hold_reason" },
];

const selected = ref([]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    q: null,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["created_at"],
    descending: [true],
  },
  searchOptions: {
    runout_id: null,
    exist_flag: ['Y'],
    code: null,
    order_id: null,
    order_item_id: null,
    reserved_order_id: null,
    reserved_order_item_id: null,
    rework_status: [],
    allocation_status: ['allocate','free_stock','scrap'],
    load_status: null,
    advice_status: null,
    archived_status: 'Current',
    product_type_id: [],
    dim1: null,
    dim2: null,
    reserve_status: [],
    hold_reason_id: null,
    advice_id: null,
    load_id: null,
    product_class: null,
    product_category_id: null,
    product_category_code: null,
    site_type_code: null,
    site_code: null,
    stock_type: null,
    store_code: null,
    status: ['created', 'returned'],
    cast_id: null,
    length_mm_min: null,
    length_mm_max: null,
    replenish_order: null,
  },
  area_code: null,
  cast_code: null,
  hold_reason_code: null,
  load_code: null,
  select_weight: null,
  max_length: null,
  advice_code: null,
  rules: {
    length_mm_min: [
      
      value => {
        if (searchOptions.value.length_mm_max && greaterThan(value, searchOptions.value.length_mm_max)) {
          return 'thickness from must be smaller than thickness to'
        }
        return true
      }
      
    ],
    length_mm_max: [
      
      value => {
        if (searchOptions.value.length_mm_min && greaterThan(searchOptions.value.length_mm_min, value)) {
          return 'thickness to must be greater than thickness from'
        }
        return true
      }
      
    ],
  }
});

const { handleFieldShow } = useSearchFieldVisibility(searchFields)

const {
  queryParams,
  searchOptions,
  area_code,
  cast_code,
  hold_reason_code,
  load_code,
  select_weight,
  max_length,
  advice_code,
  rules
} = toRefs(data);

const reworkDisabled = computed(() => {
  return selected.value.length === 0 || selected.value.some(item => item.rework_status === 'Rework') || selected.value.some(item => item.advice && item.advice.length > 0);
});

const reworkCompleteDisabled = computed(() => {
  return selected.value.some(item => item.rework_status !== 'Rework') || selected.value.some(item => item.advice && item.advice.length > 0) || selected.value.length === 0;
});

const combineDisabled = computed(() => {
  if (selected.value.length !== 2) {
    return true;
  }

  const firstItem = selected.value[0];
  const firstLength = firstItem.length_mm;
  const firstOrderCode = firstItem.order_item?.order?.order_code;
  const firstLineItemCode = firstItem.order_item?.line_item_code;
  const firstRollingCode = firstItem.rolling?.rolling_code;
  return selected.value.some(item => {
    return (
        item.length_mm !== firstLength ||
        item.rolling?.rolling_code !== firstRollingCode ||
        item.order_item?.order?.order_code !== firstOrderCode ||
        item.order_item?.line_item_code !== firstLineItemCode
    );
  });
});

const rebundleDisabled = computed(() => {
  if (selected.value.length === 0) {
    return true;
  }

  if (selected.value.status === "despatched") {
    return true
  }

  const firstItem = selected.value[0];
  const firstProductType = firstItem.product_type?.code
  return selected.value.some(item => {
    return (
        item.product_type?.code !== firstProductType
    );
  });
});

const getData = () => {

  const params = {
    ...toRaw(queryParams.value)
  };
  params.fields = [];
  params.ops = [];
  params.values = [];

  if (searchOptions.value.allocation_status && searchOptions.value.allocation_status.length > 0) {
    // params.allocation_status = searchOptions.value.allocation_status;
    params.fields.push("allocation_status");
    params.ops.push("in");
    params.values.push(JSON.stringify(searchOptions.value.allocation_status));
  }
  if (searchOptions.value.runout_id) {
    params.fields.push("runout_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.runout_id);
  }
  if (searchOptions.value.area_code) {
    params.area_code = searchOptions.value.area_code;
    // params.fields.push("area_id");
    // params.ops.push("eq");
    // params.values.push(searchOptions.value.area_code);
  }

  if (searchOptions.value.cast_id) {
    params.fields.push("cast_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.cast_id);
  }
  if (searchOptions.value.advice_id) {
    // params.fields.push("advice.advice_id");
    // params.ops.push("eq");
    // params.values.push(searchOptions.value.advice_id);
    params.advice_id = searchOptions.value.advice_id;
  }
  if (searchOptions.value.load_id) {
    params.load_id = searchOptions.value.load_id;
  }
  if (searchOptions.value.rework_status && searchOptions.value.rework_status.length > 0) {
    params.rework_type = JSON.stringify(searchOptions.value.rework_status)
  }

  if (searchOptions.value.reserve_status && searchOptions.value.reserve_status.length > 0) {
    params.fields.push("reserve_status");
    params.ops.push("in");
    params.values.push(JSON.stringify(searchOptions.value.reserve_status));
  }
  if (searchOptions.value.load_status) {
    params.load_status = searchOptions.value.load_status;
    // if (searchOptions.value.load_status === 'Loaded') {
    //   params.fields.push("finished_product.loads");
    //   params.ops.push("is_not_null");
    //   params.values.push(true);
    // } else if (searchOptions.value.load_status === 'Not Loaded') {
    //   params.fields.push("finished_product.loads");
    //   params.ops.push("is_null");
    //   params.values.push(true);
    // }
  }
  if (searchOptions.value.advice_status) {
    params.advice_status = searchOptions.value.advice_status;
    // if (searchOptions.value.advice_status === 'Adviced') {
    //   params.fields.push("advice_status");
    //   params.ops.push("eq");
    //   params.values.push(searchOptions.value.advice_status);
    // } else if (searchOptions.value.advice_status === 'Not Adviced') {
    //   params.fields.push("advice_status");
    //   params.ops.push("is_null");
    //   params.values.push(null);
    // }
  }
  if (searchOptions.value.code) {
    params.fields.push("code");
    params.ops.push("eq");
    params.values.push(searchOptions.value.code);
  }
  if (searchOptions.value.order_id) {
    params.fields.push("order_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.order_id);
  }

  if (searchOptions.value.order_item_id) {
    params.fields.push("order_item_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.order_item_id);
  }

  if (searchOptions.value.reserved_order_id) {
    params.reserved_order_id = searchOptions.value.reserved_order_id;
  }

  if (searchOptions.value.reserved_order_item_id) {
    params.fields.push("reserved_order_item_id");
    params.ops.push("eq");
    params.values.push(searchOptions.value.reserved_order_item_id);
  }
  if (searchOptions.value.stock_type) {
    params.fields.push("stock_type");
    params.ops.push("eq");
    params.values.push(searchOptions.value.stock_type);
  }
  if (searchOptions.value.store_code) {
    params.fields.push("store_code");
    params.ops.push("eq");
    params.values.push(searchOptions.value.store_code);
  }
  if (searchOptions.value.product_type_id && searchOptions.value.product_type_id.length > 0) {
    params.fields.push("product_type_id");
    params.ops.push("in");
    params.values.push(searchOptions.value.product_type_id);
  }

  if (searchOptions.value.exist_flag && searchOptions.value.exist_flag.length > 0) {
    params.fields.push("exist_flag");
    params.ops.push("in");
    params.values.push(searchOptions.value.exist_flag);
  }
  if (searchOptions.value.cover_status && searchOptions.value.cover_status.length > 0) {
    params.fields.push("cover_status");
    params.ops.push("in");
    params.values.push(searchOptions.value.cover_status);
  }
  // if (searchOptions.value.exist_flag && searchOptions.value.exist_flag.length > 0 && searchOptions.value.exist_flag.includes("")){
  //   params.fields.push("exist_flag");
  //   params.ops.push("is_null");
  //   params.values.push(null);
  // }

  if (searchOptions.value.status && searchOptions.value.status.length > 0) {
    params.fields.push("status");
    params.ops.push("in");
    params.values.push(JSON.stringify(searchOptions.value.status));
  }


  if (searchOptions.value.hold_reason_id) {
    params.hold_reason_id = searchOptions.value.hold_reason_id;
  }

  if (searchOptions.value.product_class) {
    params.product_class = searchOptions.value.product_class;
  }
  if (searchOptions.value.product_category_code) {
    params.product_category = searchOptions.value.product_category_code;
  }

  if (searchOptions.value.archived_status) {
    params.archived_status = searchOptions.value.archived_status;
  }

  if (searchOptions.value.length_mm_min) {
    params.fields.push("length_mm");
    params.ops.push(">=");
    params.values.push(searchOptions.value.length_mm_min);
  }
  if (searchOptions.value.length_mm_max) {
    params.fields.push("length_mm");
    params.ops.push("<=");
    params.values.push(searchOptions.value.length_mm_max);
  }
  
  if (searchOptions.value.replenish_order  && searchOptions.value.replenish_order.length > 0) {
    params.fields.push("order.replenish");
    params.ops.push("in");
    params.values.push(searchOptions.value.replenish_order);
  }

  loading.value = true;
  API.getAll(params).then(res => {
    if (res.status === 200) {
      console.log(res.data.items);
      total.value = res.data.total || 0;
      tableList.value = res.data.items.map(item => {
        return {
          ...item,
          runout_code: item.runout?.runout_code || "",
          area_code: item.area?.code || "",
          site_type_code: item.site_type?.site_type_code || "",
          site_code: item.site?.code || "",
          order_item_code: item.order_item?.order?.order_code || "",
          line_item_code: item.order_item?.line_item_code || "",
          product_type_code: item.product_type?.code || "",
          spec_code: item.spec?.spec_code || "",
          cast_code: item.cast?.cast_code || "",
          defect_reason_name: item.defect_reason?.name || "",
          load_code: item.load?.code || "",
          test_result: item.test_result || "",
          location: item.location || "",
          reserve_status: item.reserve_status || "",
          status: item.status || "",
          comment: item.comment || "",
          regrade_comment: item.regrade_comment || "",
          advice_code: item.advice?.advice_code || "",
          created_at: formatDate(item['created_at']),
          rework_type: item.rework_type ? item.rework_type.split(',') : [],
          regrade_reason_code: item.regrade_reason?.code || "",
        }
      }) || [];
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handlePrint = () => {
  const selectedData = toRaw(selected.value);
  const printData = selectedData.map(it => {
    return {
      code: it.code,
      cut_code: it.cut_code,
      length_mm: it.length_mm || '',
      mult_code: it.mult_code || '',
      runout_code: it.runout?.runout_code || '',
      area_code: it.area?.code || '',
      site_code: it.site?.code || '',
      site_type_code: it.site_type?.code || '',
      allocated_order_item: `${it.order_item?.order?.order_code || ''}-${it.order_item?.line_item_code || ''}`,
      sap_order_item: `${it.order?.sap_order_code || ''}-${it.order_item?.sap_line_item_code || ''}`,
      product_type_code: it.product_type?.code || '',
      spec_code: it.spec?.spec_code || '',
      cast_code: it.cast?.cast_code || '',
      hold_reason: (it?.hold_reason || []).map(tag => `${tag.code}-${tag.name}`).join(','),
      test_result: it.test_result || '',
      location: it.location || '',
      exist_flag: it.exist_flag || '',
      defect_reason_name: it.defect_reason?.name || '',
      load_code: it.load?.code || '',
      advice_code: it.advice?.advice_code || '',
      rework_type: it.rework_type || '',
      reserve_status: it.reserve_status || '',
      status: it.status || '',
      created_at: it.created_at,
      comment: it.comment || '',
      regrade_comment: it.regrade_comment || '',
      regrade_reason_code: it.regrade_reason?.code || '',
      stock_type: it.stock_type || '',
    };
  });
  // 处理筛选出来的字段
  const $titles = tableHeaders.value.map(item => item.title);
  const properties = printFields.filter((item) => $titles.includes(item.displayName));
  printJS({
    printable: printData,
    properties,
    type: "json",
    header: "Finished Product List",
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

function handlePickAreaCode(area_id_item) {
  searchOptions.value.area_id = area_id_item?.id;
  area_code.value = area_id_item?.code;
}

// function handlePickCastCode(cast_id_item) {
//   searchOptions.value.cast_id = cast_id_item?.id;
//   cast_code.value = cast_id_item?.code;
// }

function handlePickAdviceCode(advice_id_item) {
  searchOptions.value.advice_id = advice_id_item?.id;
  cast_code.value = advice_id_item?.code;
}

function handlePickHoldReasonCode(hold_reason_item) {
  hold_reason_code.value = hold_reason_item?.code;
  searchOptions.value.hold_reason_id = hold_reason_item?.id;
}

function handlePickLoadCode(load_item) {
  searchOptions.value.load_id = load_item?.id;
  load_code.value = load_item?.code;
}

function handlePickProductCategoryCode(item) {
  searchOptions.value.product_category_id = item?.id;
  searchOptions.value.product_category_code = item?.code;
}


function handleProductWeightLengthChange() {
  const data = toRaw(selected.value);
  max_length.value = Math.max(...map(data, (item) => item.length_mm));
  // const total = data.map((item, index) => ({
  //   ...item,
  //   calulated_weight: (Number(item.length_mm || 0) * Number(item.quantity || 0) * Number(item.product_type?.dim3 || 0)) / 1000
  // }));
  select_weight.value = parseFloat(data.reduce((accumulator, item) => {
    const CalulatedWeight = item.estimated_weight_kg / 1000;
    return typeof CalulatedWeight === 'number' && !isNaN(CalulatedWeight) ? accumulator + CalulatedWeight : accumulator;
  }, 0)).toFixed(3);
}

const handleSearch = () => {
  selected.value = [];

  if (!hold_reason_code.value) {
    searchOptions.value.hold_reason_id = null;
  }
  if (!advice_code.value) {
    searchOptions.value.advice_id = null;
  }
  if (!load_code.value) {
    searchOptions.value.load_id = null;
  }
  if (!searchOptions.value.product_category_id) {
    searchOptions.value.product_category_code = null;
  }
  if (searchOptions.value.site_type_code) {
    if (!searchOptions.value.site_code) {
      toast.error("Please Select Site", { autoClose: 60000 });
      return;
    }
    if (!searchOptions.value.area_code) {
      toast.error("Please Select AreaCode", { autoClose: 60000 });
      return;
    }
  }
  getData();
}

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

const handleReset = () => {
  searchOptions.value.rework_status = [];
  proxy.$refs["searchForm"].reset();
  handleSearch();
}

const handleTableChangePage = (page) => {
  queryParams.value.page = page;
  getData();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleTableChangeSortBy = (sortBy) => {
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  getData();
}

// 创建新数据
const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleHold = () => {
  const items = toRaw(selected.value);
  proxy.$refs["holdForm"].handleShow(items);
}

const handlSplit = () => {
  const items = toRaw(selected.value);

  // 检查是否有 quantity 小于1 的数据项
  const hasZeroQuantity = items.some(item => item.qualified_quantity < 1);

  if (hasZeroQuantity) {
    toast.error("Split is not supported when Bars No. < 1", { autoClose: 60000 });
    return;
  }

  // 如果没有 quantity 为 0 的数据项，则执行 Split 操作
  proxy.$refs["splitForm"].handleShow(items);
}

const unHandleHold = (id, arr) => {
  if (!arr) {
    const items = toRaw(selected.value);
    proxy.$refs["unHoldForm"].handleShow(items, id);
  } else {
    proxy.$refs["unHoldForm"].handleShow([arr], id);
  }

}

const multAction = () => {
  const items = toRaw(selected.value);
  proxy.$refs["multRef"].handleShow(items);
}

const handleReWork = () => {
  const items = toRaw(selected.value);
  if (items.some(item => item.rework_status == "Rework")) {
    toast.error("Please select the item that has not been reworked", { autoClose: 60000 });
    return;
  }
  proxy.$refs["reWorkRef"].handleShow(items, defaultMillCode.value);
}

const handleCombine = () => {
  const items = toRaw(selected.value);
  proxy.$refs["combineFrom"].handleShow(items);
}

const handleReWorkComplete = () => {
  const items = toRaw(selected.value);
  reworkConfirmAction(items);
}

const reworkConfirmAction = (items) => {
  proxy.$refs["reWorkConfirmRef"].handleShow(items);
}


const handleMove = () => {
  const items = toRaw(selected.value);
  proxy.$refs["moveFormRef"].handleShow(items);
}

const handleCreateLoad = () => {
  const items = toRaw(selected.value);
  API.getMaxID().then(res => {
    const maxID = res.data
    proxy.$refs["createLoadRef"].handleShow(items, maxID);
  })

}

const handleRetrieve = () => {
  proxy.$refs["retrieveRef"].handleShow(toRaw(selected.value));
}

const regradeAction = () => {
  const items = toRaw(selected.value);
  proxy.$refs["regradeBarRef"].handleShow(items);
}
const handleAllocate = () => {
  const items = toRaw(selected.value);
  proxy.$refs["allocateForm"].handleShow(items);
}

const handleRebundle = () => {
  const items = toRaw(selected.value);
  proxy.$refs["rebundleForm"].handleShow(items);
}

const handleDefects = () => {
  const items = toRaw(selected.value);
  proxy.$refs["defectsRef"].handleShow(items);
}
const handleCut = async () => {
  const items = toRaw(selected.value);
  proxy.$refs["partSawnRef"].handleShow(items);
}


const handleLabelPrint = () => {
  const items = toRaw(selected.value);
  proxy.$refs["labelPrintRef"].handleShow(items);

}

const uncoverLoading = ref(false);
const uncover = () => {
  uncoverLoading.value = true;
  const items = toRaw(selected.value);
  // 从 items 中提取 id 字段组成一个数组
  const idList = items.map(item => item.id);
  API.uncover(idList)
      .then(() => {
        toast.success("Uncover Success", {
          position: "bottom-center"
        });
      })
      .catch(error => {
        toast.error(error?.response?.data?.detail || "Uncover Fail", { autoClose: 60000 });
      })
      .finally(() => {
        uncoverLoading.value = false;
      });
};


// 定义一个响应式变量，用于存储删除原因
const deleteReason = ref("");
// 定义处理删除操作的函数
const handleDelete = (isActive, row) => {
  // 检查删除原因是否为空
  if (!deleteReason.value.trim()) {
    toast.error("Deleting data must have a reason!", { autoClose: 60000 });
    return;
  }
  // 关闭删除对话框
  isActive.value = false;

  // 调用 API 模块的 remove 方法，并传入删除原因
  API.remove(row.id, {remove_reason: deleteReason.value})
      .then(() => {
        toast.success("Delete Success", {position: "bottom-center"});
        getData();  // 重新加载数据
        deleteReason.value = ""; // 重置删除原因
      })
      .catch(() => {
        toast.error("Delete Fail", { autoClose: 60000 });
      });
};

const handleDisabled = computed(() => {
  // 根据选中的记录设置禁用条件
  return selected.value.length === 0 ||
      selected.value.every(item => item.order != selected.value[0].order) ||
      selected.value.some(item => item.order_item_id == null);
});

onMounted(() => {
  if (route.query.runout_id) {
    searchOptions.value.runout_id = route.query.runout_id
  }
  if (route.query.area_id) {
    searchOptions.value.area_id = route.query.area_id
  }
  getData();
})

watch(
    () => selected.value,
    (value) => {
      if (value.length > 0) {
        handleProductWeightLengthChange()
      } else {
        select_weight.value = null;
        max_length.value = null;
      }
    },
    {
      // once: true,
      immediate: true,
      deep: true,
    }
)


useFooterEvent('finishedProduct', {
  fields,
  column: tableHeaders,
  columnRef: tableHeaders,
  queryFields: searchFields,
  queryParams: searchOptions,
})
</script>
<style lang="scss" scoped>

.c-clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}

.c-clickable:hover {
  opacity: 0.8;
}

.c-clickable:active {
  opacity: 0.6;
}
</style>
