<template>
  <v-container class="rolling-content" fluid>
    <v-form ref="rollingForm" @submit.prevent="handleSave">
      <v-row align="center">
        <v-col cols="4">
          <RollingCode v-model="query.rollingCode" @change="handleChoose"></RollingCode>
        </v-col>
        <v-col class="d-none" cols="4">
          <VueDatePicker @update:model-value="handleformatDate">
            <template #trigger>
              <v-text-field
                  v-model="query.date"
                  label="Programmed Date"
                  placeholder="Please select date"
                  bg-color="white"
                  hide-details
                  clearable
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
      </v-row>
      <v-row class="mb-2" align="center">
        <v-col v-permission="'OpenRolling'" cols="2">
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none w-100"
                  color="primary"
                  variant="flat"
                  :disabled="!form.id || form.rolling_status === 'Complete'"
                  v-bind="activatorProps"
              >
              {{ $t('rolling.detail.open_rolling') }}
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                  prepend-icon="mdi-help-circle-outline"
                  text="Set rolling to Open status, send to FCC,etc"
                  title="Open rolling?"
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
                      @click="handleActionRolling(isActive, 'Open')"
                  >
                    {{ $t('global.confirm') }}
                  </v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
        <template v-if="form.rolling_status !== 'Complete'">
          <v-col v-permission="'CloseRolling'" cols="2">
            <v-dialog
                max-width="400"
                persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="text-none w-100"
                    color="primary"
                    variant="flat"
                    :disabled="!form.id || form.rolling_status === 'Complete'"
                    v-bind="activatorProps"
                >
                {{ $t('rolling.detail.close_rolling') }}
                </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card
                    prepend-icon="mdi-help-circle-outline"
                    title="Close Rolling?"
                >
                  <v-spacer></v-spacer>
                  <template v-slot:actions>
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
                        @click="handleActionRolling(isActive, 'Closed')"
                    >
                      {{ $t('global.confirm') }}
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
        </template>

        <v-col cols="2" v-permission="'CompleteRolling'">
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none w-100"
                  color="primary"
                  variant="flat"
                  :disabled="!form.id || form.rolling_status === 'Complete'"
                  v-bind="activatorProps"
              >
              {{ $t('rolling.detail.complete_rolling') }}
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                  prepend-icon="mdi-help-circle-outline"
                  title="Complete Rolling?"
              >
                <v-spacer></v-spacer>
                <template v-slot:actions>
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
                      @click="handleActionRolling(isActive, 'Complete')"
                  >
                    {{ $t('global.confirm') }}
                  </v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
        <v-col cols="2" v-permission="'PrintChargeList'">
          <v-btn
              class="text-none w-100"
              color="primary"
              variant="flat"
              :disabled="!form.id"
              @click="handleSemiChargePrint"
          >
          {{ $t('rolling.detail.print_charge_list') }}
          </v-btn>
        </v-col>
        <v-col cols="2" v-permission="'AllocateBlock'">
          <v-btn
          class="text-none w-100"
          color="primary"
          variant="flat"
          :loading="isLoading" 
          :disabled="!form.id || form.rolling_status === 'Complete' || isLoading" 
          @click="handleAllocateBlockAction"
        >
        {{ $t('rolling.detail.allocate_blocks') }}
        </v-btn>

        </v-col>
        <v-col cols="2" v-permission="'OrderGroupList'">
          <template v-if="!form.id || form.rolling_status === 'Complete'">
            <v-btn
                class="text-none w-100"
                color="primary"
                variant="flat"
                disabled
            >
            {{ $t('rolling.detail.order_group_list') }}
            </v-btn>
          </template>
          <template v-else>
            <router-link :to="{ name: 'OrderGroup', query: { code: form.rolling_code } }">
              <v-btn
                  class="text-none w-100"
                  color="primary"
                  variant="flat"
                  :disabled="!form.id || form.rolling_status === 'Complete'"
              >
              {{ $t('rolling.detail.order_group_list') }}
              </v-btn>
            </router-link>
          </template>
        </v-col>
        <v-col cols="2" v-permission="'OrderItemList'">
          <router-link :to="{ name: 'OrderItems', query: { code: form.rolling_code } }">
            <v-btn
                class="text-none w-100"
                color="primary"
                variant="flat"
                :disabled="!form.id || form.rolling_status === 'Complete'"
            >
            {{ $t('rolling.detail.order_item_list') }}
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
      <div class="panel border mb-4">
        <div v-permission="'Update'" class="panel-action">
          <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
          <v-switch
              v-model="save"
              density="default"
              hide-details
              inset
          ></v-switch>
          <div class="ml-14">
            <v-btn type="submit" :disabled="!save" :loading="loading" variant="flat" color="primary">
              {{ form.id ? "Update" : "Save" }}
            </v-btn>
          </div>
        </div>
        <v-row align="center" class="pt-4">
          <v-col cols="4">
            <ProductSizeCode 
              v-model="form.product_size_id" 
              :hide-details="false" 
              :label="$t('rolling.product_size_code')"
              :rules="rules.product_size_id"
              :disabled="!save"
              :product_size="form.product_size"  
              @change="handleProductSizeChange"
            />
          </v-col>
          
          <v-col cols="4">
            <v-text-field
                v-model="form.short_code"
                :rules="rules.short_code"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.detail.rolling_number')"
                :placeholder="$t('rolling.detail.rolling_number_placeholder')"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.rolling_code"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.detail.rolling_code')"
                :placeholder="$t('rolling.detail.rolling_code')"
                bg-color="white"
                readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <MillCode
                v-model="form.mill_id"
                :rules="rules.mill_id"
                :hide-details="false"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.detail.mill')"
                :placeholder="$t('rolling.detail.mill_placeholder')"
                bg-color="white"
                clearable
            ></MillCode>
          </v-col>

          <v-col cols="4">
            <v-text-field
                v-model="form.semi_size"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.table.semi_size')"
                :placeholder="$t('rolling.detail.semi_size_placeholder')"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.rolling_seq"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.table.rolling_seq')"
                bg-color="white"
                clearable
                maxlength="4"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
  
            <DictCode
                v-model="form.rolling_status"
                :rules="rules.rolling_status"
                code="rolling_status"
                :label="$t('rolling.table.rolling_status')"
                item-title="title"
                item-value="value"
                variant="underlined"
                density="default"
                :hide-details="false"
                :disabled="!save"
              />
          </v-col>
          <v-col cols="4">
            <v-select
                v-model="form.week_number"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.table.week_number')"
                :placeholder="$t('rolling.detail.week_number_placeholder')"
                bg-color="white"
                :items="generateWeekOptions()"
                clearable
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.year"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.table.year')"
                :placeholder="$t('rolling.detail.year_placeholder')"
                bg-color="white"
                clearable
                maxlength="4"
                @input="($event) => $event.target.value = $event.target.value.replace(/[^\d]/g, '')"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <VueDatePicker @update:model-value="formatProgrammedDate">
              <template #trigger>
                <v-text-field
                    v-model="form.programmed_start_date"
                    :label="$t('rolling.table.programmed_start_date')"
                    :rules="rules.programmed_start_date"
                    :disabled="!save"
                    color="#333"
                    density="default"
                    variant="underlined"
                    :placeholder="$t('rolling.detail.programmed_start_date_placeholder')"
                    bg-color="white"
                    required
                    clearable
                ></v-text-field>
              </template>
            </VueDatePicker>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.duration_minutes"
                :rules="rules.duration_minutes"
                :disabled="!save"
                :label="$t('rolling.table.duration_minutes')"
                type="number"
                color="#333"
                density="default"
                variant="underlined"
                :placeholder="$t('rolling.detail.duration_minutes_placeholder')"
                bg-color="white"
                required
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.programmed_tonnage"
                :rules="rules.programmed_tonnage"
                :disabled="!save"
                type="number"
                color="#333"
                :label="$t('rolling.table.programmed_tonnage')"
                density="default"
                variant="underlined"
                :placeholder="$t('rolling.detail.programmed_tonnage_placeholder')"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.rolling_time_total"
                :rules="rules.rolling_time_total"
                :disabled="!save"
                type="number"
                color="#333"
                :label="$t('rolling.detail.rolling_time_total')"
                density="default"
                variant="underlined"
                :placeholder="$t('rolling.detail.rolling_time_total_placeholder')"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <VueDatePicker @update:model-value="handleformatDateOpen">
              <template #trigger>
            <v-text-field
                v-model="form.open_time"
                density="default"
                variant="underlined"
                :disabled="!save"
                :label="$t('rolling.detail.open_time')"
                bg-color="white"
                clearable
                maxlength="4"
            ></v-text-field>
            </template>
            </VueDatePicker>
          </v-col>
          <v-col cols="4">
            <VueDatePicker @update:model-value="handleformatDateComplete">
              <template #trigger>
            <v-text-field
                v-model="form.complete_time"
                :disabled="!save"
                density="default"
                variant="underlined"
                :label="$t('rolling.detail.complete_time')"
                bg-color="white"
                clearable
                maxlength="4"
            ></v-text-field>
            </template>
            </VueDatePicker>
          </v-col>

          <v-col cols="4">
            <v-text-field
                v-model="form.comment"
                :disabled="!save"
                color="#333"
                :label="$t('rolling.table.comment')"
                density="default"
                variant="underlined"
                bg-color="white"
                rows="2"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="form.additional_minutes"
                density="default"
                variant="underlined"
                :disabled="!save"
                :label="$t('rolling.table.additional_minutes')"
                bg-color="white"
                clearable
                maxlength="4"
            ></v-text-field>
          </v-col>
          
        </v-row>
      </div>
    </v-form>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-row align="center" no-gutters>
            <v-col cols="1">
              <div class="text-subtitle-1 font-weight-bold">Order Items</div>
            </v-col>
            <v-col cols="1" class="text-end">
              <div class="text-subtitle-1 font-weight-bold">
                <strong>Total Tonnage:</strong> {{ form.ordered_tons }}
              </div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5" >
              <v-row align="center" no-gutters>
                
                <v-col cols="4">
                  <DictCode
                      v-model="form.completion_status"
                      :label="$t('rolling.detail.completion_status')"
                      code="completion_status"
                      :hide-details="true"
                      @click.stop
                      class="mr-4 mb-2"
                  />
                </v-col >
                    <v-col  cols="2">
                  
                  <v-text-field
                    v-model="form.dim3"
                    label="Kgm"
                    clearable
                    @keyup.enter="handleSearch(form.id)"
                    hide-details
                    @click.stop
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                <v-col class="text-end">
                  <v-row justify="end" align="center">
                    <v-col class="d-flex" cols="auto">
                      <v-btn
                        class="text-none"
                        color="#e3e3e3"
                        variant="flat"
                        @click.stop="handleReset"
                      >
                      {{ $t('global.reset') }}
                      </v-btn>
                    </v-col>
                    <v-col class="d-flex" cols="auto">
                      <v-btn
                        type="submit"
                        class="text-none"
                        color="primary"
                        variant="flat"
                        @click.stop="handleSearch(form.id)"
                      >
                      {{ $t('global.search') }}
                      </v-btn>
                    </v-col>
                    <v-col class="d-flex" cols="auto">
                      <v-btn
                        type="text"
                        class="text-none"
                        color="primary"
                        variant="flat"
                        @click.stop="handlePrint"
                      >
                      {{ $t('global.print') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table-server
              min-height="300"
              items-per-page="10"
              :page="queryParams.page"
              :headers="tableHeaders"
              :items="tableList"
              :items-length="total"
              :loading="loading"
              fixed-header
              show-current-page
              return-object
              @update:options="handleTableChange"
          >
            <template v-slot:item.status="{ item }">
              <div class="d-flex justify-center ga-2">
                <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                  {{ tag.name }}
                </v-chip>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <router-link class="text-decoration-none grey-darken-4 mr-2" :to="{ path: '/order_item/detail', query: { id: item.id } }">
                <v-icon size="small">mdi-file-document-outline</v-icon>
              </router-link>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
            </template>
          </v-data-table-server>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row class="my-4"></v-row>

    <v-expansion-panels v-model="panels" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-row align="center" no-gutters>
            <v-col cols="6">
              <div class="text-subtitle-1 font-weight-bold">Semi Monitoring</div>
            </v-col>
            <v-col cols="6" class="text-end pr-6">
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table-server
              min-height="300"
              items-per-page="10"
              :page="querySemiParams.page"
              :headers="tableSemiHeaders"
              :items="tableOrderList"
              :items-length="totalOrder"
              :loading="loadingOrder"
              fixed-header
              show-current-page
              return-object
              :sort-by="querySemiParams.sortBy"
              :desc="querySemiParams.descending"
              @update:options="handleOrderTableChange"
          >
            <template v-slot:item.status="{ item }">
              <div class="d-flex justify-center ga-2">
                <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                  {{ tag.name }}
                </v-chip>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon size="small">mdi-file-document-outline</v-icon>
            </template>
            <template v-slot:loadingOrder>
              <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
            </template>
          </v-data-table-server>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-row class="my-4"></v-row>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-row align="center" no-gutters>
            <v-col cols="6">
              <div class="text-subtitle-1 font-weight-bold">Cast Summary</div>
            </v-col>
            <v-col cols="6" class="text-end pr-6">
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table-server
              min-height="300"
              items-per-page="10"
              :page="queryCoverParams.page"
              :headers="tableCoverHeaders"
              :items="tableCoverList"
              :items-length="totalCover"
              :loading="loadingCover"
              fixed-header
              show-current-page
              return-object
              :sort-by="queryCoverParams.sortBy"
              :desc="queryCoverParams.descending"
              @update:options="handleCoverTableChange"
          >
            <template v-slot:item.cast_no="{ item }">
              <div class="d-flex ga-2">
                  <router-link :to="{ name: 'Covering Usage', query: { cast_id: item.cast_id, cast_code: item.cast_no, rolling_id: form.id, rolling_code: form.rolling_code} }">
                    {{ item.cast_no }}
                  </router-link>
              </div>
            </template>
            <template v-slot:item.no_runout="{ item }">
              <div class="d-flex ga-2">
                  <router-link :to="{ name: 'RunoutList', query: { cast_id: item.cast_id, cast_code: item.cast_no, rolling_id: form.id, rolling_code: form.rolling_code} }">
                    {{ item.no_runout }}
                  </router-link>
              </div>
            </template>
          </v-data-table-server>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row class="my-4"></v-row>
    <!-- <v-expansion-panels v-model="panels" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-row align="center" no-gutters>
            <v-col cols="6">
              <div class="text-subtitle-1 font-weight-bold">Semi Monitoring</div>
            </v-col>
            <v-col cols="6" class="text-end pr-6">
            </v-col>
          </v-row>
        </v-expansion-panel-title> 
        <v-expansion-panel-text>
          <v-data-table-server
              min-height="300"
              items-per-page="10"
              :page="queryCoverParams.page"
              :headers="tableCoverHeaders"
              :items="tableCoverList"
              :items-length="totalCover"
              :loading="loadingCover"
              fixed-header
              show-current-page
              return-object
              :sort-by="queryCoverParams.sortBy"
              :desc="queryCoverParams.descending"
              @update:options="handleOrderTableChange"
          >
            <template v-slot:item.status="{ item }">
              <div class="d-flex justify-center ga-2">
                <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                  {{ tag.name }}
                </v-chip>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon size="small">mdi-file-document-outline</v-icon>
            </template>
            <template v-slot:loadingOrder>
              <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
            </template>
          </v-data-table-server>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels> -->
  </v-container>
</template>
<script setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs, watch, onMounted, onUnmounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import printJS from "print-js";
import {toast} from "vue3-toastify";
import {useStore} from "vuex";
import moment from "moment";
import RollingCode from "@/components/picker/RollingCode.vue";
import ProductTypeCode from "@/components/picker/SectionCode.vue";
import ProductClassCode from "@/components/picker/ProductClassCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import API from "./api";
import OrderItemsAPI from "@/rolling/order_items/api";
import CutSeqPlanAPI from "@/rolling/cut_sequence_plan/api";
import useCommonStore from "@/app/common";
import DictCode from "@/components/picker/DictCode.vue";
import ProductClassRolling from "@/components/picker/ProductClassRolling.vue";
import ProductCategoryRolling from "@/components/picker/ProductCategoryRolling.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import ProductSizeCode from "@/components/picker/ProductSizeCode.vue";

import {formatDate} from "@/util/util";
import { fromUnixTime } from "date-fns";
import { id } from "date-fns/locale";
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const commonStore = useCommonStore();
const route = useRoute();
const store = useStore();
const router = useRouter();
const loading = ref(false);
const loadingOrder = ref(false);

const date = ref("Select Date");
const save = ref(true);

const {proxy} = getCurrentInstance();

const tableHeaders = ref([
  {title: "Action", key: "action", minWidth: 60, sortable: false, fixed: true, align: "center"},
  { title: "Order Number", key: "order.order_code", sortable: true },
  { title: "Line Item Number", key: "line_item_code", sortable: true },
  // { title: "Rolling Code", key: "rolling.rolling_code", sortable: true },
  { title: "Customer", key: "order.customer_short_name", sortable: true },
  { title: "Kgm", key: "product_dim3", sortable: true },
  { title: "Quality Code", key: "quality_code", sortable: true },
  { title: "Weight(Tonnes)", key: "tonnage", sortable: true},
  { title: "Length(mm)", key: "length_mm", sortable: true },
  { title: "Bars", key: "quantity", sortable: true,},
  { title: "Allocated Bars", key: "allocate_bars", sortable: false },
  { title: "Amended No. Bars", key: "amended_quantity", sortable: false },
  // { title: "Finished Bars", key: "finished_bars", sortable: false, },
  { title: "Completion Status", key: "completion_status", sortable: false },
  // { title: "Late Arrival", key: "late_arrival", sortable: true,},
  { title: "Despatched Bars", key: "despatched_bars", sortable: false},
  // { title: "Rolled Bars" , key: "rolling_bars", sortable: false},
  // { title: "Loaded Bars", key: "advice_bars", sortable: false },
  { title: "Advice Bars" , key: "advice_bars", sortable: false },
  { title: "Category", key: "order.order_category", sortable: true },
]);


const isLoading = ref(false);
const tableList = ref([]);
const total = ref(0);
const printFields = ref([
  { displayName: "Order No.", field: "order_code" },
  { displayName: "Item No.", field: "line_item_code" },
  { displayName: "Dim3", field: "product_dim3" },
  { displayName: "Balance Bars", field: "balance_bars" },
  { displayName: "Ordered Bars", field: "ordered_bars" },
  { displayName: "Rolled Bars" , field: "allocate_bars" },
  { displayName: "Returned", field: "returned_bars" },
  { displayName: "Reason For Rejection", field: "reason_for_rejection" },
  { displayName: "Length", field: "length_mm" },
  { displayName: "Weight", field: "tonnage" },
  { displayName: "Spec", field: "spec_code" },
  { displayName: "Customer", field: "customer_short_name" },
]);

const tableSemiHeaders = ref([
  {title: "Seq No.", key: "semi_charge_seq", sortable: true},
  {title: "Position", key: "semi_status", sortable: true},
  {title: "Quality Group", key: "cast.quality_code", sortable: true},
  {title: "Comment", key: "comment", sortable: true},
  {title: "Cast Code", key: "cast.cast_code", sortable: true},
  {title: "Sect Wght", key: "quality_code", sortable: true},
  {title: "Skelp Code", key: "skelp_code", sortable: true},
  {title: "Updated At", key: "updated_at", sortable: true},
  {title: "Semi Type", key: "semi_type", sortable: true},
  {title: "Semi Wght", key: "estimated_weight_kg", sortable: true,},  
  {title: "Min In", key: ""},
  {title: "Shift Number", key: "", sortable: true},
  {title: "Runout Nunber", key: "runout_code", sortable: true},
  {title: "Runout Lengths", key: "runout_length", sortable: true,},
]);

const tableOrderList = ref([]);
const totalOrder = ref(0);

const loadingCover = ref(false);
const tableCoverList = ref([]);
const totalCover = ref(0);
const tableCoverHeaders = ref([
  {title: "Cast No.", key: "semi_charge_seq", sortable: true},
  {title: "Cover Status", key: "semi_status", sortable: true},
  {title: "No. Runout", key: "cast.quality_code", sortable: true},
  {title: "No. Bars", key: "comment", sortable: true},
  {title: "No. Covered", key: "cast.cast_code", sortable: true},
  {title: "No. Waiting", key: "quality_code", sortable: true},
  {title: "No. Failed", key: "skelp_code", sortable: true},
]);

let timer = null;

const tableDataSaw = ref([]);
const tableDataSawLoading = ref(false);
const tableDataSawTotalTon = ref(0)

const formatTon = (value, dig) => {
  return value ? value.toFixed(dig) : '0';
}

const data = reactive({
  panel: [0, 1],
  queryParams: {
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true]
  },
  panels: [0, 1],
  panel_saw:[0,1],
  querySemiParams: {
      fields: [],
      ops: [],
      values: [],
      page: 1,
      itemsPerPage: 10,
      sortBy: ["semi_charge_seq"],
      descending: [false],
    },
  queryCoverParams: {
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  query: {
    rollingCode: undefined,
    date: undefined
  },
  form: {
    id: undefined,
    mill_id: "TBM",
    rolling_code: undefined,
    rolling_dim1: undefined,
    rolling_dim2: undefined,
    rolling_dim3: undefined,
    rolling_dim4: undefined,
    semi_size: undefined,
    rolling_status: undefined,
    short_code: undefined,
    product_class_code: undefined,
    product_category_code: undefined,
    rolling_plan_code: undefined,
    programmed_tonnage: undefined,
    programmed_start_date: undefined,
    duration_minutes: undefined,
    flex_form_data: undefined,
    open_time: undefined,
    complete_time: undefined,
    week_number: undefined,
    year: undefined,
    comment: undefined,

    product_class_id: undefined,
    product_category_id: undefined,
    product_class:undefined,
    product_category:undefined,
    dim3: undefined,
    rolling_seq: undefined,
    completion_status: undefined,
    product_size: undefined,
    product_size_id: undefined,
    product_size_code: undefined,
    rolling_time_total: undefined,
    ordered_tons: undefined,
    additional_minutes: undefined
  },
  rules: {
    mill_id: [
      value => {
        if (value) return true        
        return t('rolling.detail.mill_id_required')
      }
    ],
    product_size_id: [
      value => {
        if (value) return true
        return t('rolling.detail.product_size_id_required')
      }
    ],
    rolling_time_total: [
      value => {
        if (value) return true
        return t('rolling.detail.rolling_time_total_required')
      }
    ],
    product_class_code: [
      value => {
        if (value) return true
        return t('rolling.detail.product_class_code_required')
      }
    ],
    product_category_code: [
      value => {
        if (value) return true
        return t('rolling.detail.product_category_code_required')
      }
    ],
    rolling_code: [
      value => {
        if (value) return true
        return t('rolling.detail.rolling_code_required')
      },
    ],
    short_code: [
      value => {
        if (value) return true
        return t('rolling.detail.short_code_required')
      },
    ],
    rolling_dim1: [
      value => {
        if (value) return true
        return t('rolling.detail.rolling_dim1_required')
      },
    ],
    rolling_dim2: [
      value => {
        if (value) return true
        return t('rolling.detail.rolling_dim2_required')
      },
    ],
    rolling_dim3: [
      value => {
        if (value) return true
        return t('rolling.detail.rolling_dim3_required')
      },
    ],
    rolling_dim4: [
      value => {
        if (value) return true
        return t('rolling.detail.rolling_dim4_required')
      },
    ],
    semi_size: [
      value => {
        if (value) return true
        return t('rolling.detail.semi_size_required')
      },
    ],
    rolling_status: [
      value => {
        if (value) return true
        return t('rolling.detail.rolling_status_required')
      },
    ],
    programmed_start_date: [
      value => {
        if (value) return true
        return t('rolling.detail.programmed_start_date_required')
      },
    ],
    duration_minutes: [
      value => {
        if (value) return true
        return t('rolling.detail.duration_minutes_required')
      },
    ],
    programmed_tonnage: [
      value => {
        if (value) return true
        return t('rolling.detail.programmed_tonnage_required')
      },
    ],
  }
});

const {query, form, rules, queryParams, querySemiParams, queryCoverParams, search, panel, panels, panel_saw, panel_cast_summary} = toRefs(data);

const handleformatDate = (res) => {
  if (res) {
    query.value.date = moment(res).format("YYYY-MM-DD");
  }
}

const handleformatDateOpen = (res) => {
  if (res) {
    form.value.open_time = moment(res).format("YYYY-MM-DD");
  }
}

const handleformatDateComplete = (res) => {
  if (res) {
    form.value.complete_time = moment(res).format("YYYY-MM-DD");
  }
}

const formatProgrammedDate = (res) => {
  if (res) {
    form.value.programmed_start_date = moment(res).format("YYYY-MM-DD");
  }
}

// const handleProductCategoryCode = (item) => {

//   if (!item) {
//     form.value.product_category_id = undefined;
//     form.value.product_category_code = undefined;
//     return;
//   }

//   const product_category_code = item?.code.split("-");

//   form.value.product_category_id = item?.id;
//   form.value.product_category_code = item?.code;

//   form.value.rolling_dim1 = product_category_code[0];
//   form.value.rolling_dim2 = product_category_code[1];

// }

const handlePrint = () => {
  printJS({
    printable: toRaw(tableList.value),
    properties: printFields.value,
    type: "json",
    header: `
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;">
        <div style="flex: 0 0 100%; max-width: 100%; text-align: left;" >BALANCE OF PREVIOUS ROLLING</div>
      </div>
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;">
        <div style="flex: 0 0 100%; max-width: 100%; text-align: left;" >${form.value.rolling_code || ""}</div>
      </div>

    `,
    repeatTableHeader: false, // 打印json表头只显示在第一页
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}

const getDetailById = (id) => {
  API.getDetailById(id).then(res => {
    const {status, data} = res
    if (status === 200) {
      save.value = false;
      form.value = {
        id: data.id,
        mill_code: data.mill_code || "TBM",
        rolling_code: data.rolling_code,
        rolling_dim1: data.rolling_dim1,
        rolling_dim2: data.rolling_dim2,
        rolling_dim3: data.rolling_dim3,
        rolling_dim4: data.rolling_dim4,
        semi_size: data.semi_size,
        rolling_status: data.rolling_status,
        short_code: data.short_code,
        product_class_code: data.product_class_code,
        rolling_plan_code: data.rolling_plan_code,
        product_category_code: data.product_category_code,
        programmed_tonnage: data.programmed_tonnage,
        programmed_start_date: data.programmed_start_date ? moment(data.programmed_start_date).format("YYYY-MM-DD") : undefined,
        duration_minutes: data.duration_minutes,
        flex_form_data: data.flex_form_data,
        open_time: data.open_time ? moment(data.open_time).format("YYYY-MM-DD") : undefined,
        complete_time: data.complete_time ? moment(data.complete_time).format("YYYY-MM-DD") : undefined,
        week_number: data.week_number,
        year: data.year,
        comment: data.comment,
        product_class_id: data.product_class?.id,
        product_category_id: data.product_category?.id,
        product_class: data.product_class,
        product_category: data.product_category,
        rolling_seq: data.rolling_seq,
        product_size_id: data.product_size?.id,
        product_size: data.product_size,
        rolling_time_total: data.rolling_time_total,
        ordered_tons:data.ordered_tons,
        additional_minutes: data.additional_minutes,
      };
      handleSearch(id)
      if (form.value.id){
        handleOrderItem(form.value.id)
        handleCoverItem(form.value.id)
      }
      

      if (query.value.rollingCode !== data.rolling_code) {
        query.value.rollingCode = data.rolling_code;
      }
    } else {
      // TODO: 添加错误异常提示
    }
  });
}

const handleSearch = (id) => {
  const params = toRaw(queryParams.value);

  loading.value = true;
  if (form.value.dim3) {
    params.dim3 = form.value.dim3;
  } else {
    delete params.dim3;
  }
  if (id) {
    params.ops = ["eq"];
    params.fields = ["rolling_id"];
    params.values = [id];
  } else {
    params.ops = [];
    params.fields = [];
    params.values = [];
  }
  if (form.value.completion_status) {
    params.ops.push("eq");
    params.fields.push("completion_status");
    params.values.push(form.value.completion_status);
  }else{
    delete params.completion_status;
  }
  OrderItemsAPI.getAll(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      // tableList.value = res.data.items || [];   
      tableList.value = res.data.items.map(item => ({
        ...item,
        order_code: item?.order?.order_code || "",
        line_item_code: item?.line_item_code || "",
        rolling_code: item?.rolling?.rolling_code || "",
        customer_short_name: item?.order?.customer_short_name || "",
        order_category: item?.order?.order_category || "",
        product_dim3: item?.product_dim3 || "",
        quality_code: item?.quality_code || "",
        length_mm: item?.length_mm || "",
        quantity: item?.quantity || "",
        allocate_bars: item?.allocate_bars || 0,
        finished_bars: item?.finished_bars || 0,
        completion_status: item?.completion_status || "",
        late_arrival: item?.late_arrival || "",
        tonnage: item.tonnage,
        rolling_bars: item?.rolling_bars || 0,
        despatched_bars: item?.despatched_bars || 0,
        amended_quantity: item?.amended_quantity || 0,
        advice_bars: item?.advice_bars || 0,
        product_class_id: item.product_class?.id,
        product_category_id: item.product_category?.id,
        product_class: item.product_class,
        product_category: item.product_category,
        rolling_seq: item.rolling_seq,
        spec_code: item.spec?.code || "",
        rejected: item.rejection || "",
        reason_for_rejection: item.rejection_desc || "",
        ordered_bars: item?.quantity || 0,
        balance_bars: item?.quantity - item?.allocate_bars + item?.returned_bars || 0,
        returned_bars: item?.returned_bars || 0,

      }))
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handleReset = () => {
  form.value.dim3 = undefined;
  form.value.completion_status = undefined
  handleSearch(form.value.id);
}

const handleOrderItem = (id) => {
  const params = toRaw(querySemiParams.value);
  params.rolling_id = form.value.id; 

  loadingOrder.value = true;
  API.getSemiData(params).then(res => {
    if (res.status === 200) {
      totalOrder.value = res.data.total || 0;
      tableOrderList.value = (res.data.items || []).map(item => ({
        ...item,
        area_code: item.area?.code || '',
        curren_allocated_block: item.order_group?.group_code,
        length_mm: item.length_mm,
        width_mm: item.width_mm,
        estimated_weight_kg: item.estimated_weight_kg,
        group_charge_seq: item.order_group?.group_charge_seq,
        updated_at: formatDate(item.updated_at),
      }));
    } else {
      totalOrder.value = 0;
      tableOrderList.value = []
    }
  }).finally(() => {
    loadingOrder.value = false;
  });
}


const handleTableChange = ({page, itemsPerPage, sortBy}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryParams.value.sortBy = sortBy;
  }
  if (form.value.id) {
    handleSearch(form.value.id);
  }
}

const handleOrderTableChange = ({page, itemsPerPage, sortBy}) => {
  querySemiParams.value.page = page;
  querySemiParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    querySemiParams.value.sortBy = sortBy;
  }
  if (form.value.id) {
    handleOrderItem(form.value.id);
  }
}

const handleCoverItem = (id) => {
  const params = toRaw(queryCoverParams.value);
  params.rolling_id = form.value.id; 

  loadingOrder.value = true;
  API.getCoverData(params).then(res => {
    if (res.status === 200) {
      totalCover.value = res.data.total || 0;
      tableCoverList.value = (res.data.items || []).map(item => ({
        ...item,
        area_code: item.area?.code || '',
        curren_allocated_block: item.order_group?.group_code,
        length_mm: item.length_mm,
        width_mm: item.width_mm,
        estimated_weight_kg: item.estimated_weight_kg,
        group_charge_seq: item.order_group?.group_charge_seq,
        updated_at: formatDate(item.updated_at),
      }));
    } else {
      totalCover.value = 0;
      tableCoverList.value = []
    }
  }).finally(() => {
    loadingCover.value = false;
  });
}


const handleCoverTableChange = ({page, itemsPerPage, sortBy}) => {
  queryCoverParams.value.page = page;
  queryCoverParams.value.itemsPerPage = itemsPerPage;
  if (sortBy.length > 0) {
    queryCoverParams.value.sortBy = sortBy;
  }
  if (form.value.id) {
    handleCoverItem(form.value.id);
  }
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["rollingForm"].validate();
  if (!valid) {
    return;
  }
  const params = toRaw(form.value);
  
  loading.value = true;
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Save Fail", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

const handleChoose = (item) => {
  getDetailById(item?.id)
}

const resetForm = () => {
  proxy.$refs["rollingForm"].reset();
}

const resetValidation = () => {
  proxy.$refs["rollingForm"].resetValidation();
}

const handleSemiChargePrint = () => {
  router.push({path: "/semi_charge_list", query: {id: form.value.id}});
}


const handleAllocateBlockAction = () => {
  if (isLoading.value) return; // 防止重复点击

  const { id, rolling_code } = toRaw(form.value);

  if (!id) return; // 如果没有 ID，直接退出

  isLoading.value = true; // 开始加载

  API.allocateBlocks(id)
    .then((res) => {
      if (res.data === 1) {
        router.push({ path: "/order_group", query: { code: rolling_code } });
        return;
      }
      toast.warning("Please assign Rolling", {
        position: "bottom-center",
        onClose: () =>
          router.push({ path: "/order_group", query: { code: rolling_code } }),
      });
    })
    .catch((error) => {
      console.error("Error during allocateBlocks:", error);
      toast.error("Failed to allocate blocks.", { autoClose: 60000 });
    })
    .finally(() => {
      isLoading.value = false; // 加载完成后关闭加载
    });
};

// 事件业务处理
const handleActionRolling = (isActive, status) => {
  isActive.value = false;
  const {id} = toRaw(form.value);
  API.updateStatus(id, status).then(res => {
    toast.success(`${status} Success`, {
      position: "bottom-center",
    });
    getDetailById(id);
  }).catch(res => {
    toast.error(res?.response?.data?.detail || `${status} Fail`, { autoClose: 60000 });
  });
}

const generateWeekOptions = () => {
  let options = [];
  for (let i = 1; i <= 53; i++) {
    options.push({text: `${i}`, value: `${i}`});
  }
  return options;
};

// 进入页面根据ID获取数据详情
if (route.query.id) {
  getDetailById(route.query.id)
}

// const handleProductChange = (item) => {
//   form.value.product_class_id = item?.id;
//   form.value.product_class_code = item?.code;
// }

const handleProductSizeChange = (item) => {
  form.value.product_size_code = item?.code;
  console.log("item", item)
  const product_size_code = item?.code.split("-");
  if (product_size_code && product_size_code.length === 3) {
    form.value.rolling_dim1 = product_size_code[1];
    form.value.rolling_dim2 = product_size_code[2];
  }
}

watch(
    () => form,
    (value) => {
      const {product_size_code, short_code, rolling_code} = form.value;

      if (product_size_code && short_code) {
        const $rollingCode = `${product_size_code}-${short_code}`
        if ($rollingCode !== rolling_code) {
          form.value.rolling_code = $rollingCode;
        }
      }
    },
    {
      deep: true
    }
)

const getSawStatTable = () => {
  tableDataSawLoading.value = true;
  CutSeqPlanAPI.getAll({fields:['rolling_id'],ops:['eq'],values:[route.query?.id || -1 ], itemsPerPage:-1,page:1}).then(res => {
    if (res.status === 200) {
      tableDataSaw.value = [];

      const cut_saw_route = commonStore.dict?.cut_sequence_plan_saw_route || []
      tableDataSawTotalTon.value = 0
      cut_saw_route.forEach(route=>{
        const filteredItems = res.data.items.filter(item => item.saw_route === route.value);
        const ton = filteredItems.reduce((acc, item) => acc + (item?.weight || 0), 0)
        tableDataSawTotalTon.value += ton
        tableDataSaw.value.push({
          saw_route: route.value,
          saw_line: route.title,
          requested_group_tonnes: ton
        })
      })
    } else {
      tableDataSaw.value = []
    }
  }).finally(() => {
    tableDataSawLoading.value = false;
  });
}


onMounted(async () => {
  await commonStore.initDictData();
  getSawStatTable();
  if (form.value?.id){
    // timer = setInterval(() => {
    //   console.log('onMounted');
    //     handleSearch(form.value.id);
    // }, 10000)
  }
  
});

onUnmounted(() => {
  clearInterval(timer);
  console.log('onUnmounted');
});

</script>
<style lang="scss" scoped>
.rolling-content {
  .panel {
    position: relative;
    background-color: #ffffff;
    padding: 42px 16px 16px 16px;
    min-height: 400px;
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
.v-btn {
  padding: 0.5em 1em;
  min-width: 8em;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    min-width: 6em;
  }
}
</style>
