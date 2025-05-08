<template>
  <v-container class="detail-content" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row class="mb-2">
        <v-col cols="3">
          <RunoutCode
              v-model="queryParams.runout_code"
              label="Runout Code"
              @change="handlePickRunoutCode"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
              type="submit"
              class="text-none ml-4 mr-4 mt-4"
              color="primary"
              variant="flat"
              :loading="loading"
              v-permission="`Search`"
          >
            Search
          </v-btn>
          <v-btn
              class="text-none mt-4"
              color="primary"
              variant="flat"
              @click="handleToFinishedProduct"
              v-permission="`Finished Product`"
          >
            Finished Product
          </v-btn>
        </v-col>
        <v-col cols="5" class="text-right">
          <div class="specsave">
            <div class="specsave-action">
              <span class="text-subtitle-2 font-weight-regular mr-1">{{ control.saveFlag ? "Save" : "View" }}</span>
              <v-switch v-model="control.saveFlag" density="default" hide-details inset></v-switch>
              <div class="ml-4">
                <v-btn :disabled="!control.saveFlag" :loading="loading" variant="flat" color="primary"
                       @click="handleSave">
                  {{ formData.id ? "Update" : "Save" }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>

    <v-form v-model="valid">

      <v-expansion-panels class="spec-panels" v-model="panel" multiple>

        <v-expansion-panel bg-color="white">
          <v-expansion-panel-title>
            <v-row align="center" class="flex-nowrap">
              <v-col class="text-truncate">Finished Product List</v-col>
              <v-col cols="auto" class="d-flex gap-2 flex-wrap justify-end">
                <v-btn
                    color="primary" variant="flat" @click="updateCover($event)" :loading="coverLoading"
                    v-permission="`Cover` " class="my-1" size="small"> Cover
                </v-btn>

                <v-btn
                    color="primary" variant="flat" @click="NewFinishedFrom($event)" v-permission="`Create`" @click.stop
                    class="my-1 ml-4" size="small"> New
                </v-btn>
              </v-col>

              <v-btn
                  variant="text"
                  icon="mdi-menu"
                  @click.stop="handleOpen"
                  class="ml-2"
              />
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table-server
                fexid-header
                height="650"
                min-height="300"
                :headers="finishedListHeaders"
                :items="finishedListTable"
                item-value="id"
                :items-length="finishedListTotal"
                :loading="finishedListLoading"
                fixed-header
                show-current-page
                return-object
                @update:options="handleFinishedTableChange"
            >

              <template v-slot:item.code="{ item }">
                <router-link v-if="item.code" class="align-center text-decoration-none grey-darken-4"
                             :to="{ path: 'finished_product_detail', query: { id: item.id } }">
                  <span class="d-inline-block">{{ item.code }}</span>
                </router-link>
              </template>

              <template v-slot:item.advice="{ item }">
                <div class="d-flex justify-center ga-2">
                  <v-chip v-for="tag in item.advice" :key="tag.id" size="small">
                    {{ tag.advice_code }}
                  </v-chip>
                </div>
              </template>

              <template v-slot:item.order_item.line_item_code="{ item }">
                    <span class="reserved-order-item">
                      <router-link v-if="item.order_item" class="align-center text-decoration-none grey-darken-4"
                                   :to="{ name: 'OrderItemTable', query: { order_code: item.order_item.order?.order_code } }">
                        <span class="d-inline-block">{{ item.order_item?.order?.order_code }}</span>
                      </router-link>
                      <span class="separator">-</span>
                      <router-link v-if="item.order_item" class="align-center text-decoration-none grey-darken-4"
                                   :to="{ name: 'OrderItemDetail', query: { id: item.order_item.id } }">
                        <span class="d-inline-block">{{ item.order_item?.line_item_code }}</span>
                      </router-link>
                    </span>
              </template>

              <template v-slot:[`item.t_runout`]="{ item }">
                <div class="d-flex align-center gap-1">

                  <span style="background-color: purple;color:white;"
                        v-if="item.t_override === 'Manual' ">{{ item.t_runout_code }}</span>
                  <span v-else>{{ item.t_runout_code }}</span>
                  <v-btn
                      variant="text"
                      icon="mdi-pencil"
                      @click="editRunout(item, 't_runout')"
                  />
                </div>
              </template>

              <template v-slot:[`item.c_runout`]="{ item }">
                <div class="d-flex align-center gap-1">
                  <span style="background-color: purple;color:white;"
                        v-if="item.c_override === 'Manual'">{{ item.c_runout_code }} </span>
                  <span v-else>{{ item.c_runout_code }}</span>
                  <v-btn
                      variant="text"
                      icon="mdi-pencil"
                      @click="editRunout(item, 'c_runout')"
                  />
                </div>
              </template>

            </v-data-table-server>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel bg-color="white" title="General Info">

          <v-expansion-panel-text clss="spec-panels-text">
            <div class="panel">
              <div class="panel-action">
                <v-row>
                  <v-col cols="4" v-for="item in generalInfoList" :key="item">
                    <div class="text-subtitle-2 font-weight-regular	mb-2">{{ item.title }}</div>
                    <v-text-field
                        v-model="formData[item.key]"
                        :placeholder="item.title"
                        :disabled="!control.saveFlag"
                        density="default"
                        variant="underlined"
                        bg-color="white"
                        clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-subtitle-2 font-weight-regular	mb-2">Product Type</div>
                    <ProductTypeCode v-model="form.product_type_id" :disabled="!control.saveFlag" variant="underlined"
                                     :hide-details="false"
                                     :product_type="formData.product_type" label=""
                    />
                  </v-col>
                  <v-col cols="4" v-for="item in rollingInfoList" :key="item">
                    <div class="text-subtitle-2 font-weight-regular	mb-2">{{ item.title }}</div>
                    <template v-if="item.key==='rolling_code'">
                      <RollingCode
                          v-model="rollingInfoData.rolling_code"
                          label=""
                          placeholder="Rolling No."
                          bg-color="white"
                          :disabled="!control.saveFlag"
                          @change="handlePickRollingCode"
                      ></RollingCode>
                    </template>
                    <template v-else>
                      <v-text-field
                          v-model="rollingInfoData[item.key]"
                          :placeholder="item.title"
                          :disabled="disabled"
                          density="default"
                          variant="underlined"
                          bg-color="white"
                          clearable
                      ></v-text-field>
                    </template>
                  </v-col>


                </v-row>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel bg-color="white" title="Slab Dimensions">

          <v-expansion-panel-text clss="spec-panels-text">
            <div class="panel">
              <div class="panel-action">
                <v-row>
                  <v-col cols="4" v-for="item in slabDimensionsList" :key="item">
                    <div class="text-subtitle-2 font-weight-regular	mb-2">{{ item.title }}</div>
                    <template v-if="item.key==='semi_code'">
                      <SemiCode
                          v-model="slabDimensionsData.semi_code"
                          label=""
                          :disabled="!control.saveFlag"
                          @pick-semi-code="handlePickSemiCode"
                      ></SemiCode>
                    </template>
                    <template v-else>
                      <v-text-field
                          v-model="slabDimensionsData[item.key]"
                          :placeholder="item.title"
                          :disabled="true"
                          density="default"
                          variant="underlined"
                          disabled
                      ></v-text-field>
                    </template>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>


        <v-expansion-panel bg-color="white">
          <v-expansion-panel-title>
            <v-row align="center">
              <v-col cols="11">Alternative Suitable Spec</v-col>

            </v-row>

          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="button-container">
              <v-col cols="12" class="d-flex gap-2 flex-wrap justify-end">
                <v-btn color="primary" variant="flat" :loading="endUseLoading" @click="coverEndUse()"
                       v-permission="`Cover`" class="my-1" size="small"> Cover End Use
                </v-btn>


                <v-btn color="primary" variant="flat" @click="clearSpecs()" v-permission="`Clear`" class="my-1 ml-4"
                       size="small"> Clear
                </v-btn>


                <v-btn color="primary" variant="flat" @click="NewSpecFrom($event)" v-permission="`Create`"
                       class="my-1 ml-4" size="small"> New
                </v-btn>
              </v-col>
            </div>
            <div>
              <v-data-table-server min-height="300"
                                   :headers="specHeaders"
                                   :items="specTable" item-value="id"
                                   :items-length="specTotal"
                                   :loading="specLoading" fixed-header
                                   show-current-page
                                   return-object @update:options="handleSpecTableChange">

                <template v-slot:[`item.action`]="{ item }">

                  <div class="d-flex align-center gap-2">
                    <v-btn
                        variant="text"
                        icon="mdi-pencil"
                        @click="editShow(item)"
                    />
                    <v-btn
                        variant="text"
                        icon="mdi-delete"
                        @click="removeShow(item)"
                    />
                  </div>
                </template>
              </v-data-table-server>
            </div>

          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel bg-color="white">
          <v-expansion-panel-title>
            <v-row align="center">
              <v-col cols="12">Test</v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div>
              <v-data-table-server min-height="300"
                                   :headers="TestListTableHeaders" :items="TestListTable" item-value="id"
                                   :items-length="TestListTotal" :loading="TestListLoading" fixed-header
                                   show-current-page return-object @update:options="handleTestTableChange">

                <template v-slot:item.test_sample_code="{ item }">
                  <router-link :to="{ name: 'TestEditTable', query: { id: item.test_id } }">{{ item.test_sample_code }}</router-link>
                </template>

                <template v-slot:[`item.tensiles`]="{ item }">
                  <v-chip v-for="tensile in item.tensiles" :key="tensile.id" size="small">
                    {{ tensile.test_standard }}
                  </v-chip>
                </template>

                <template v-slot:[`item.impacts`]="{ item }">
                  <v-chip v-for="impact in item.impacts" :key="impact.id" size="small">
                    {{ impact.temp_c }}
                  </v-chip>
                </template>

              </v-data-table-server>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel bg-color="white" title="Dimension">

          <v-expansion-panel-text clss="spec-panels-text">
            <div class="panel">
              <div class="panel-action">
                <v-row align="center" class="pt-4">

                  <v-col cols="8">
                    <v-row>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_f1" type="number" color="#333" label="Nominal F1(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal F1(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_f1" type="number" color="#333" label="Actual F1(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual F1(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_f2" type="number" color="#333" label="Nominal F2(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal F2(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_f2" type="number" color="#333" label="Actual F2(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual F2(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_f3" type="number" color="#333" label="Nominal F3(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal F3(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_f3" type="number" color="#333" label="Actual F3(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual F3(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_f4" type="number" color="#333" label="Nominal F4(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal F4(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_f4" type="number" color="#333" label="Actual F4(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual F4(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_fh1" type="number" color="#333" label="Nominal FH1(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal FH1(mm)" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_fh1" type="number" color="#333" label="Actual FH1(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual FH1(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_fh2" type="number" color="#333" label="Nominal FH2(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal FH2(mm)" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_fh2" type="number" color="#333" label="Actual FH2(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual FH2(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_fh3" type="number" color="#333" label="Nominal FH3(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal FH3(mm)" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_fh3" type="number" color="#333" label="Actual FH3(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual FH3(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_fh4" type="number" color="#333" label="Nominal FH4(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal FH4(mm)" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_fh4" type="number" color="#333" label="Actual FH4(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual FH4(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_b1" type="number" color="#333" label="Nominal B1(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal B1(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_b1" type="number" color="#333" label="Actual B1(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual B1(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_b2" type="number" color="#333" label="Nominal B2(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal B2(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_b2" type="number" color="#333" label="Actual B2(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual B2(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.nominal_d" type="number" color="#333" label="Nominal D(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal D(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field v-model="form.actual_d" type="number" color="#333" label="Actual D(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Actual D(mm)"
                                      bg-color="white" clearable></v-text-field>
                      </v-col>


                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <v-img cover
                           src="/static/images/finished-product-detial.png"
                           style="border-radius:20px"></v-img>

                  </v-col>

                </v-row>
                <v-row align="center" class="pt-4">
                  <v-col cols="8">
                    <v-row>
                      <v-col cols="3">
                        <v-text-field v-model="form.nominal_weight" type="number" color="#333"
                                      label="Nominal Weight(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Nominal Weight(mm)" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field v-model="form.calculated_weight" type="number" color="#333"
                                      label="Calculated Weight(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Calculated Weight(mm)" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field v-model="form.difference" type="number" color="#333" label="Difference(mm)"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Difference(mm)" bg-color="white" clearable></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field v-model="form.off_centre_web" type="number" color="#333" label="Off Centre Web"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Off Centre Web" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field v-model="form.flange_variation" type="number" color="#333"
                                      label="Flange Variation"
                                      :disabled="!control.saveFlag" density="default" variant="underlined"
                                      placeholder="Flange Variation" bg-color="white"
                                      clearable></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>


                  <v-col cols="8">
                    <v-textarea v-model="form.information_to_banks" color="#333" label="Information to Banks"
                                :disabled="!control.saveFlag" density="default" variant="underlined"
                                placeholder="Please enter the information to banks"
                                bg-color="white" clearable></v-textarea>
                  </v-col>

                </v-row>

              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>


      </v-expansion-panels>
      <v-dialog v-model="confirmDeleteDialog" max-width="400">
        <v-card prepend-icon="mdi-help-circle-outline" text="Deletion is irreversible"
                title="Confirm to delete data?">
          <v-card-actions>
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="confirmDeleteDialog = false">Cancel</v-btn>
            <v-btn class="text-none" color="primary" variant="flat" @click="handleDeleteConfirm">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmClearDialog" max-width="400">
        <v-card prepend-icon="mdi-help-circle-outline" text="Deletion is irreversible"
                title="Confirm to delete data?">
          <v-card-actions>
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="confirmClearDialog = false">Cancel</v-btn>
            <v-btn class="text-none" color="primary" variant="flat" @click="handleClearConfirm">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>


    <FinishedForm ref="finishedNewRef" @refresh="refreshHandleFinisheTable"></FinishedForm>
    <RegradeForm ref="regradeCandidatesNewRef" @refresh="refreshHandleSpecTable"></RegradeForm>
    <DeleteSpec ref="deleteSpecRef" @refresh="refreshHandleSpecTable"></DeleteSpec>
    <FinishedEditRunout ref="finishedEditRunoutRef" @refresh="refreshHandleFinisheTable"></FinishedEditRunout>
    <MesTable ref="tableRef" name="runout_finished_product" v-model="finishedListHeaders"/>
  </v-container>
</template>
<script setup>
import {getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs, computed} from "vue";
import {useRoute} from "vue-router";
import {toast} from "vue3-toastify";
import API from "./api";
import router from "../../router";


import RollingCode from "@/components/picker/RollingCode.vue";
import SemiCode from "@/components/picker/SemiCode.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import FinishedProductApi from "@/finished_product/finished_product/api";
import FinishedForm from "./components/FinishedForm.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import RegradeForm from "./components/RegradeForm.vue";
import TestSampleApi from "@/test_admin/test_sample/api";
import FinishedEditRunout from "./components/FinishedEditRunout.vue";
import {event} from "jquery";
import store from "@/store";
import DictCode from "@/components/picker/DictCode.vue";
import MesTable from "@/components/table/index.vue";


const millId = computed(() => store.state.auth?.userInfo?.current_mill_id);

const defaultMillCode = computed(() => store.state.auth?.defaultMillCode);

const handleOpen = () => {
  proxy.$refs["tableRef"].handleShow();
}

const {proxy} = getCurrentInstance();
const route = useRoute();
const confirmDeleteDialog = ref(false);
const confirmClearDialog = ref(false);
const itemToDelete = ref(null);

const loading = ref(false);
const coverLoading = ref(false);
const endUseLoading = ref(false);
const data = reactive({
  queryParams: {
    runout_id: null,
    runout_code: null
  },
  control: {
    saveFlag: true,
    editFlag: false,
  },
  panel: [0, 1, 2, 3, 4, 5],
  formData: {
    id: null,
    rolling_id: null,
    semi_id: null,
    runout_code: null,
    furnace_sequence_number: null,
    shift_code: null,
    scrap_defect_reason_code: null,
  },
  generalInfoList: [
    {title: 'Runout No.', key: 'runout_code'},
    {title: 'Furnace Seq No.', key: 'furnace_sequence_number'},
    {title: 'Shift No.', key: 'shift_code'},
    {title: 'Defect', key: 'scrap_defect_reason_code'},
  ],
  slabDimensionsData: {
    semi_code: null,
    cast_code: null,
    estimated_weight_kg: null,
    length_mm: null,
    width_mm: null,
    thickness_mm: null,
  },
  slabDimensionsList: [
    {title: 'Semi No.', key: 'semi_code'},
    {title: 'Cast No.', key: 'cast_code'},
    {title: 'Weight(Tonnes)', key: 'estimated_weight_kg'},
    {title: 'Length(mm)', key: 'length_mm'},
    {title: 'Wdith(mm)', key: 'width_mm'},
    {title: 'Thickness(mm)', key: 'thickness_mm'},
  ],
  rollingInfoData: {
    rolling_code: null,
  },
  rollingInfoList: [
    {title: 'Rolling No.', key: 'rolling_code'},
  ],
  form: {

    nominal_f1: undefined,
    actual_f1: undefined,
    nominal_f2: undefined,
    actual_f2: undefined,
    nominal_f3: undefined,
    actual_f3: undefined,
    nominal_f4: undefined,
    actual_f4: undefined,
    nominal_fh1: undefined,
    actual_fh1: undefined,
    nominal_fh2: undefined,
    actual_fh2: undefined,
    nominal_fh3: undefined,
    actual_fh3: undefined,
    nominal_fh4: undefined,
    actual_fh4: undefined,
    nominal_b1: undefined,
    actual_b1: undefined,
    nominal_b2: undefined,
    actual_b2: undefined,
    nominal_d: undefined,
    actual_d: undefined,
    nominal_weight: undefined,
    calculated_weight: undefined,
    difference: undefined,
    off_centre_web: undefined,
    flange_variation: undefined,
    information_to_banks: undefined,
    product_type_id: undefined

  },

})

const {
  queryParams,
  control,
  panel,
  formData,
  generalInfoList,
  slabDimensionsData,
  slabDimensionsList,
  rollingInfoData,
  rollingInfoList,
  form
} = toRefs(data)

function handleError(error) {
  if (error.response) {
    toast.error(error.response.data?.detail, {
      position: "bottom-center",
      autoClose: 60000
    })
  } else {
    console.log(error)
  }
  return false
}

function handleSearch(event) {
  loading.value = true
  API.getById(queryParams.value.runout_id).then(resp => {
    formData.value = resp.data;
    slabDimensionsData.value = resp.data.semi || [];
    slabDimensionsData.value.cast_code = resp.data.semi?.cast?.cast_code || [];
    rollingInfoData.value = resp.data.rolling || [];
    for (const key in form.value) {
      form.value[key] = resp.data[key]
    }
    loading.value = false
    return false;
  }).catch(error => {
    loading.value = false
    handleError(error)
  });
  getFinishedList();
}

function handleToFinishedProduct(event) {
  router.push({
    path: "/finished_product",
    query: {runout_id: formData.value.id, runout_code: formData.value.runout_code}
  });
}

function handlePickSemiCode(semi_item) {
  formData.value.semi_id = semi_item.id
  slabDimensionsData.value = semi_item || [];
  slabDimensionsData.value.cast_code = semi_item.cast?.cast_code || null;
}

function handlePickRollingCode(rolling_item) {
  formData.value.rolling_id = rolling_item?.id
}

function handlePickRunoutCode(runout_item) {
  queryParams.value.runout_id = runout_item?.id
  queryParams.value.runout_code = runout_item?.runout_code
  handleSearch();
}

function handleSave(event) {
  const payload = {}
  generalInfoList.value.forEach(item => {
    if (item.key === 'runout_code') {
      if (!formData.value['id']) {
        payload[item.key] = formData.value[item.key]
      }
    } else {
      payload[item.key] = formData.value[item.key]
    }
  })
  payload.id = formData.value.id
  payload.rolling_id = formData.value.rolling_id
  payload.semi_id = formData.value.semi_id
  for (const key in form.value) {
    payload[key] = form.value[key]
  }
  payload.cast_id = slabDimensionsData.value.cast_id


  return API.add(payload).then((resp) => {
    if (!resp.data || !resp.data.id) {
      toast.error("error: save failed. Please try again.", {
        position: "bottom-center",
        autoClose: 60000
      })
      return false
    }

    formData.value.id = resp.data.id
    control.saveFlag = false
    toast.success("runout saved successfully.", {
      position: "bottom-center",
      onClose: () => router.back()
    })
  }).catch(error => {
    handleError(error)
  })
}

function getData() {
  if (!route.query.runout_id) {
    return
  }
  loading.value = true
  API.getById(route.query.runout_id).then(resp => {
    formData.value = resp.data;
    slabDimensionsData.value = resp.data.semi || [];
    slabDimensionsData.value.cast_code = resp.data.semi?.cast?.cast_code || [];
    slabDimensionsData.value.cast_id = resp.data.semi?.cast?.id || null;
    rollingInfoData.value = resp.data.rolling || [];

    for (const key in form.value) {
      form.value[key] = resp.data[key]
    }

    loading.value = false
    return false;
  }).catch(error => {
    loading.value = false
    console.log(error);
  });
}

onMounted(() => {
  if (route.query.runout_id) {
    control.value.saveFlag = false;
    queryParams.value.runout_id = route.query.runout_id
    queryParams.value.runout_code = route.query.runout_code
  }
  getData();
  getFinishedList();
})


const finishedListParams = reactive({
  q: "",
  page: 1,
  itemsPerPage: 10,
  sortBy: ['code'],
  descending: [false],
})

const finishedListTable = ref([])
const finishedListTotal = ref(0)
const finishedListLoading = ref(false)
const finishedListHeaders = ref([
  {title: defaultMillCode.value==='SRSM'?"Bundle ID":"Code", key: "code", sortable: true, minWidth: 160},
  {
    title: "ProductType Code",
    key: "product_type.code",
    value: (item) => item.product_type?.code,
    sortable: true,
    minWidth: 160
  },
  {title: "T-Result", key: "overall_ten_result", sortable: true},
  {title: "T-Cover-By", key: "t_runout", sortable: true},
  {title: "C-Result", key: "overall_imp_result", sortable: true},
  {title: "C-Cover-By", key: "c_runout", sortable: true},
  {title: "Cut Code", key: "cut_code", sortable: true},
  {title: "Length(mm)", key: "length_mm", sortable: true},
  {title: "Defective Length(mm)", key: "defective_length", sortable: true},
  {title: "Weight(kg)", key: "estimated_weight_kg", sortable: true},
  {title: "Mults", key: "mult_code", sortable: true},
  {title: "Runout Code", key: "runout.runout_code", sortable: true},
  {title: "Business Type", key: "stock_type", sortable: true},
  {title: "Store", key: "store_code", sortable: true},
  {title: "Quantity", key: "quantity", sortable: true},
  {title: "Defective Pieces", key: "defect_quantity", sortable: true},
  {title: "Area Code", key: "area.code", sortable: true},
  {
    title: "Allocated Order Item", key: "order_item.line_item_code",
    value: (item) => {
      return `${item.order_item?.order?.order_code || ''}-${item.order_item?.line_item_code || ''}`;
    }, minWidth: 180, sortable: true
  },
  {
    title: "Reserved Order Item", key: "reserved_order_item.line_item_code",
    value: (item) => {
      return `${item.reserved_order_item?.order?.order_code || ''}-${item.reserved_order_item?.line_item_code || ''}`;
    }, minWidth: 180, sortable: true
  },
  {title: "Allocated Status", key: "allocation_status"},
  {title: "Allocated Customer NO.", key: "order_item.order.customer_code"},
  {title: "Allocated Customer Name", key: "order_item.order.customer_short_name"},
  {title: "Reserved Customer NO.", key: "reserved_order_item.order.customer_code"},
  {title: "Reserved Customer Name", key: "reserved_order_item.order.customer_short_name"},
  {title: "Spec Code", key: "spec.spec_code", value: (item) => item.spec?.spec_code, sortable: true},
  {title: "Spec Short Name", key: "spec.short_name", value: (item) => item.spec?.short_name, sortable: true},
  {title: "Cast Code", key: "cast.cast_code", value: (item) => item.cast?.cast_code, sortable: true},
  {title: "Rolling Code", key: "rolling.rolling_code", value: (item) => item.rolling?.rolling_code, sortable: true},
  {title: "Compliance", key: "test_result", sortable: false},
  {title: "Location", key: "location", sortable: true},
  {title: "Exist", key: "exist_flag", sortable: true},
  {title: "Sawn By", key: "sawn_by", sortable: true},
  {title: "Defect", key: "defect_reason.name", value: (item) => item.defect_reason?.name, sortable: true},
  {title: "Load", key: "loads", sortable: false},
  {title: "Advice", key: "advice", sortable: false,},
  {title: "Rework Status", key: "rework_type", sortable: true, minWidth: 160},
  {title: "Reserve Status", key: "reserve_status", sortable: true},
  {title: "Status", key: "status", sortable: true},
  {title: "Rework Remarks", key: "rework_complete_comment", sortable: false},
  {
    title: "Created At",
    key: "created_at",
    sortable: true,
    minWidth: 180
  },
  {title: "Reserved", key: "reserve_status", sortable: true},
  {title: "Hold Status", key: "hold_reason", sortable: false},
  {title: "Hold Comment", key: "hold_comment", sortable: false},
  {title: "Comment", key: "comment", value: (item) => item.comment, sortable: true},
  {title: "Regrade Reason", key: "regrade_reason.code", value: (item) => item.regrade_reason?.code, sortable: true},
  {title: "Regrade Comment", key: "regrade_comment", value: (item) => item.regrade_comment, sortable: true},
  {title: "Cover Status", key: "cover_status", sortable: true},
  {title: "Inspector", key: "inspector", value: (item) => {
      // Decision: Use insp_code from test_tensile if available, else from test_impact.
      if (!item.spec) return "";
      const specInspectors = [item.spec.inspector_1,item.spec.inspector_2,item.spec.inspector_3,item.spec.inspector_4,].filter(ins => ins); // remove null/undefined
      // Try to get an inspector from test_tensile first, then test_impact.
      let test_insp = "";
      if (item.test_tensile && item.test_tensile.length > 0 && item.test_tensile[0].insp_code) {
        test_insp = item.test_tensile[0].insp_code;
      } else if (item.test_impact && item.test_impact.length > 0 && item.test_impact[0].insp_code) {
        test_insp = item.test_impact[0].insp_code;
      }
      // Only display inspector if it matches one of the spec inspector values.
      return test_insp && specInspectors.includes(test_insp) ? test_insp : "";
  }}
])

const handleFinishedTableChange = ({page, itemsPerPage, sortBy}) => {
  finishedListParams.page = page;
  if (itemsPerPage !== finishedListParams.itemsPerPage) {
    finishedListParams.page = 1;
  }
  finishedListParams.itemsPerPage = itemsPerPage;
  if (sortBy.length === 0) {
    finishedListParams.sortBy = ['code'];
    finishedListParams.descending = [false];
  } else {
    finishedListParams.sortBy = sortBy;
  }

  getFinishedList();
}

const editRunout = (item, type) => {
  proxy.$refs["finishedEditRunoutRef"].handleShow(item, type);
}

const updateCover = (event) => {
  if (event) {
    event.stopPropagation();
  }
  coverLoading.value = true;
  const runout_id = route.query.runout_id || queryParams.value.runout_id

  return FinishedProductApi.updateCovering({id: runout_id}).then((resp) => {
    toast.success('Covering Success', {
      position: "bottom-center"
    });
    refreshHandleFinisheTable();
  }).catch(error => {
    toast.error(error?.response?.data?.detail || 'Failed to update Covering', {
      position: "bottom-center",
      autoClose: 60000
    });
    console.error(error);
  }).finally(() => {
    coverLoading.value = false;
  });
}


const TestListParams = reactive({
  runout_id: null,
})

const TestListTable = ref([])
const TestListTotal = ref(0)
const TestListLoading = ref(false)

const TestListTableHeaders = [
  {title: "TestSampleCode", key: "test_sample_code", sortable: false},
  {title: "TestCode", key: "test_code", sortable: false},
  {title: "TestRefCode", key: "test_ref_code", sortable: false},
  {title: "Test Type", key: "test_type", sortable: false},
  {title: "Tensile Loc", key: "orientation", sortable: false},
  {title: "Standard", key: "standard", sortable: false},
  {title: "Impact Unit", key: "impact_units", sortable: false},
  {title: "Yield", key: "yield_rp0_2", sortable: false},
  {title: "UTS(MPa)", key: "value_mpa", sortable: false},
  {title: "Elongation", key: "elongation_data", sortable: false},
  {title: "Elongation Code", key: "elongation_code", sortable: false},
  {title: "Yield/UTS Ratio", key: "yield_uts_Ratio", sortable: false},
  {title: "Impact Temp", key: "temp_c", sortable: false},
  {title: "Temp Unit", key: "temp_units", sortable: false},
  {title: "Energy 1", key: "energy_1", sortable: false},
  {title: "Energy 2", key: "energy_2", sortable: false},
  {title: "Energy 3", key: "energy_3", sortable: false},
  {title: "Energy Average", key: "energy_average", sortable: false },
  {title: "Bend Result", key: "result_1", sortable: false},
];
const handleTestTableChange = ({page, itemsPerPage, sortBy}) => {
  TestListParams.page = page;
  if (itemsPerPage !== TestListParams.itemsPerPage) {
    TestListParams.page = 1;
  }
  TestListParams.itemsPerPage = itemsPerPage;
  if (sortBy.length === 0) {
    TestListParams.sortBy = ['created_at'];
    TestListParams.descending = [true];
  } else {
    TestListParams.sortBy = sortBy;
  }
  getTestSampleList();
}

const getTestSampleList = async () => {
  TestListLoading.value = true;
  const params = {
    ...toRaw(TestListParams)
  };

  const runout_id = route.query.runout_id || queryParams.value.runout_id
  params.runout_id = runout_id

  try {
    if (runout_id) {
      const response = await TestSampleApi.getTestResult(params);
      console.log(response.data)
      TestListTable.value = response.data.items.map(item => {
        const energy_average = item.impact_units === 'f' ? item.energy_average_f : item.energy_average_j;
        let energy_1, energy_2, energy_3, yield_uts_Ratio;
        if (item.impact_units === 'f') {
          energy_1 = item.energy_1_f;
          energy_2 = item.energy_2_f;
          energy_3 = item.energy_3_f;
        } else {
          energy_1 = item.energy_1_j;
          energy_2 = item.energy_2_j;
          energy_3 = item.energy_3_j;
        }

        let elongation_data = item.elongation_a200; 
        if (item.elongation_code === 'X') {
          elongation_data = item.elongation_a50;  
        } else if (item.elongation_code === 'Y') {
          elongation_data = item.elongation_a200; 
        } else if (item.elongation_code === 'Z') {
          elongation_data = item.elongation_a565; 
        }
        if (item.yield_rp0_2 && item.value_mpa){
          yield_uts_Ratio = ((item.yield_rp0_2 / item.value_mpa) * 100).toFixed(2);
          yield_uts_Ratio = Math.round(yield_uts_Ratio);

        }
        return { ...item, energy_average, elongation_data, energy_1, energy_2, energy_3, yield_uts_Ratio }; 
      });
      TestListTotal.value = response.data.total;
    }
  } catch (error) {
    toast.error('Failed to get Test Sample Data', {
      autoClose: 60000  // 添加此参数
    });
    console.error(error);
  } finally {
    TestListLoading.value = false;
  }
};


const specParams = reactive({
  q: "",
  page: 1,
  itemsPerPage: 10,
  sortBy: ['created_at'],
  descending: [true],
})

const specTable = ref([])
const specTotal = ref(0)
const specLoading = ref(false)
const specHeaders = [
  {
    title: 'Action',
    value: "action",
    sortable: false,
    align: 'center',
    width: 100,
    fixed: true
  },
  {
    title: 'Spec Code',
    key: "spec.spec_code",
    value: (item) => item.spec?.spec_code || "-",
    sortable: true
  },
  {
    title: "Short Code",
    key: "spec.short_name",
    value: (item) => item.spec?.short_name || "-",
    sortable: true
  },
  {
    title: "Compliance",
    key: "test_result",
    value: (item) => item.test_result || "00",
    sortable: false
  },
  {
    title: "Comment",
    key: "comment",
    value: (item) => item.comment,
    sortable: false
  }
]

const handleSpecTableChange = ({page, itemsPerPage, sortBy}) => {
  specParams.page = page;
  if (itemsPerPage !== specParams.itemsPerPage) {
    specParams.page = 1;
  }
  specParams.itemsPerPage = itemsPerPage;
  if (sortBy.length === 0) {
    specParams.sortBy = ['cut_code'];
    specParams.descending = [true];
  } else {
    specParams.sortBy = sortBy[0].key;
    specParams.descending = [sortBy[0].order === 'desc'];
  }
  specParams.sortBy = sortBy;
  getSpecList();
}

const getSpecList = async () => {
  specLoading.value = true;
  const params = {
    ...toRaw(specParams)
  };

  const runout_id = route.query.runout_id || queryParams.value.runout_id

  try {
    if (runout_id) {
      const response = await API.getCoveringAll(runout_id, params);
      specTable.value = response.data.items;
      specTotal.value = response.data.total;
    }
  } catch (error) {
    toast.error('Failed to get FinishedProduct data', {
      autoClose: 60000
    });
    console.error(error);
  } finally {
    specLoading.value = false;
  }
};

const getFinishedList = async () => {
  finishedListLoading.value = true;
  const params = {
    ...toRaw(finishedListParams)
  };
  params.fields = []
  params.ops = []
  params.values = []

  const runout_id = queryParams.value.runout_id || route.query.runout_id
  if (runout_id) {
    params.fields = ['runout_id']
    params.ops = ['eq']
    params.values = [runout_id]
  }
  params.fields.push('exist_flag')
  params.ops.push('eq')
  params.values.push('Y')

  try {
    const response = await FinishedProductApi.getAll(params);
    finishedListTable.value = response.data.items;
    finishedListTotal.value = response.data.total;
  } catch (error) {
    toast.error('Failed to get FinishedProduct data', {
      autoClose: 60000
    });
    console.error(error);
  } finally {
    finishedListLoading.value = false;
  }
};

const NewFinishedFrom = (event) => {
  let data = {
    runout_id: parseInt(route.query.runout_id), runout_code: route.query.runout_code,
    cast_code: formData.value?.cast?.cast_code, cast_id: formData.value?.cast?.id,
    rolling_id: formData.value?.rolling?.id, rolling_code: formData.value?.rolling?.rolling_code,
    product_type_id: formData.value?.product_type_id,

  }
  proxy.$refs["finishedNewRef"].handleShow(data);
  if (event) {
    event.stopPropagation();
  }
}

const editShow = (item) => {
  proxy.$refs["regradeCandidatesNewRef"].handleShow({
    runout_id: parseInt(route.query.runout_id),
    runout_code: route.query.runout_code,
    spec_code: item.spec?.spec_code,
    id: item.id,
    spec_id: item.spec?.id,
    t_result: item.t_result,
    c_result: item.c_result,
    comment: item.comment,
  });
  if (event) {
    event.stopPropagation();
  }
  refreshHandleSpecTable();
}

const removeShow = (item) => {
  itemToDelete.value = item;
  confirmDeleteDialog.value = true;
}

const handleDeleteConfirm = () => {
  if (itemToDelete.value) {
    API.delete(itemToDelete.value.id)
        .then(() => {
          toast.success("Delete Success", {
            position: "bottom-center"
          });
          refreshHandleSpecTable();
        })
        .catch(error => {
          toast.error(error?.response?.data?.detail || "Delete Fail", {
            position: "bottom-center",
            autoClose: 60000
          });
        });
  }
  confirmDeleteDialog.value = false;
};

const clearSpecs = () => {
  confirmClearDialog.value = true;
}

const handleClearConfirm = () => {
  API.delete_all(route.query.runout_id)
      .then(() => {
        toast.success("Clear Success", {
          position: "bottom-center"
        });
        refreshHandleSpecTable();
      })
      .catch(error => {
        toast.error(error?.response?.data?.detail || "Delete Fail", {
          position: "bottom-center",
          autoClose: 60000
        })
      });
  confirmClearDialog.value = false;
};

const coverEndUse = () => {
  endUseLoading.value = true
  API.cover_runout(route.query.runout_id)
      .then(() => {
        toast.success("Cover Success", {
          position: "bottom-center"
        });
        refreshHandleSpecTable();
      })
      .catch(error => {
        toast.error(error?.response?.data?.detail || "Cover Fail", {
          position: "bottom-center",
          autoClose: 60000
        })
      }).finally(() => {
        endUseLoading.value = false;
      });
};

const refreshHandleFinisheTable = () => {
  getFinishedList();
}

const NewSpecFrom = (event) => {
  proxy.$refs["regradeCandidatesNewRef"].handleShow({
    runout_id: parseInt(route.query.runout_id),
    runout_code: route.query.runout_code
  });
  if (event) {
    event.stopPropagation();
  }
  refreshHandleSpecTable();
}

const refreshHandleSpecTable = () => {
  getSpecList();
}

</script>
<style lang="scss" scoped>
.v-expansion-panel {
  background-color: #f2f2f7;
  border-radius: 20px;
}


.detail-content {
  .specsave {
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

  .button-container {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

