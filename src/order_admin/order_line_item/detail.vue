<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm" @submit.prevent="getFinishedData" @keyup.enter="getFinishedData">
      <v-row align="center">
        <v-col cols="3">
          <RunoutCode
              v-model="queryParams.runout_id"
              label="Runout Code"
              hide-details
          />
        </v-col>
        <v-col cols="3">
          <order-code
              label="Order Number"
              v-model="form.order_id"
              :order="form.order"
              hide-details
              :disabled="!save"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="form.line_item_code"
              :rules="rules.line_item_code"
              :disabled="!save"
              density="default"
              variant="underlined"
              label="Line Item Number"
              hide-details
              placeholder="Please enter the line item number."
              bg-color="white"
              :readonly="!!form.id"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              Reset
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
            >
              Search
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <div class="d-flex align-center mt-2">
        <div class="d-flex ga-4 align-center">
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="handleAutoLoadPlan"
          >
            Auto Load Plan
          </v-btn>
          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="handleBack"
          >
            Return to Order Item
          </v-btn>

          <v-btn
              class="text-none"
              color="primary"
              variant="flat"
              @click="handlePrintMillSheet"
              v-show="defaultMillCode == 'SRSM'"
          >
          Print Mill Sheet
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex align-center ga-4">
          <span class="text-subtitle-2 font-weight-regular">{{ save ? "Save" : "View" }}</span>
          <v-switch
              v-model="save"
              density="default"
              hide-details
              inset
          ></v-switch>
          <v-btn @click="handleSave" class="text-none" :loading="saving" :disabled="!save" variant="flat"
                 color="primary">Update
          </v-btn>
        </div>
      </div>
      <v-card class="mb-4 pa-4" elevation="0" variant="outlined">
        <v-row align="center">
          <v-col cols="3">
            <RollingCode
                v-model="rollingCodeShow"
                label="Rolling No."
                placeholder="Rolling No."
                bg-color="white"
                :disabled="!save"
                :hide-details="false"
                @change="handlePickRollingCode"
            ></RollingCode>
          </v-col>
          <v-col cols="3">
            <SpecCode
                v-model="specCodeShow"
                :disabled="!save"
                @change="handlePickSpec"
                :hide-details="false"
            ></SpecCode>
          </v-col>

          <v-col>
            <ProductTypeCode v-model="form.product_type_id" :disabled="!save" variant="underlined" :hide-details="false"
                             :product_type="form.product_type"/>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="2">
            <v-text-field
                v-model="form.amended_quantity"
                :rules="rules.amended_quantity"
                :disabled="!save"
                density="default"
                variant="underlined"
                label="Amended Quality"
                placeholder="Please enter the Amended Quality."
                bg-color="white"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                v-model="form.arrival_status"
                :rules="rules.arrival_status"
                :disabled="!save"
                density="default"
                variant="underlined"
                label="Arrival_status"
                placeholder="Please enter the Arrival_status."
                bg-color="white"
            ></v-text-field>
          </v-col>
          
          <v-col cols="8">
            <v-text-field
                v-model="form.mill_comment"
                :rules="rules.mill_comment"
                :disabled="!save"
                density="default"
                variant="underlined"
                label="Mill Comment"
                placeholder="Please enter the Mill Comment."
                bg-color="white"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
    </v-form>

    <v-card class="mt-4 mb-4 pa-4" elevation="0" variant="outlined">
      <v-form ref="editForm" @submit.prevent>
        <v-row align="center" :gutter="12">
          <v-col cols="2">
            <span>Product Code: {{ form.product_code }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product Dim 1: {{ form.product_dim1 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product Dim 2: {{ form.product_dim2 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Rolling Code: {{ form.rolling_code }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product Dim 3: {{ form.product_dim3 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Order Quantity: {{ form.quantity }}</span>
          </v-col>

          <v-divider></v-divider>


          <v-col cols="2">
            <span>Mill Code: {{ form.mill_code }}</span>
          </v-col>
          <v-col cols="2">
            <span>Spec Code: {{ form.spec?.spec_code }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product Form: {{ form.product_form }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product Form Type: {{ form.product_form_type }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product Quality Type: {{ form.quality_code }}</span>
          </v-col>
          <v-col cols="2">
            <span>Length(mm): {{ form.length_mm }}</span>
          </v-col>
          <v-col cols="2">
            <span>Customer Spec Code: {{ form.customer_spec_code }}</span>
          </v-col>
          <v-col cols="2">
            <span>Customer Material: {{ form.customer_material }}</span>
          </v-col>
          <v-col cols="2">
            <span>Stocked Quantity: {{ form.stocked_quantity }}</span>
          </v-col>
          <v-col cols="2">
            <span>Tonnage Tolerance Min Percent: {{ form.tonnage_tolerance_min_percent }}</span>
          </v-col>
          <v-col cols="2">
            <span>Tonnage Tolerance Max Percent: {{ form.tonnage_tolerance_max_percent }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product DIM 4: {{ form.product_dim4 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Product DIM Unit: {{ form.product_dim_unit }}</span>
          </v-col>
          <v-col cols="2">
            <span>Outside Inspection Required: {{ form.outside_inspection_required }}</span>
          </v-col>
          <v-col cols="2">
            <span>Transport Type: {{ form.transport_type }}</span>
          </v-col>
          <v-col cols="2">
            <span>Destination Port: {{ form.destination_port }}</span>
          </v-col>
          <v-col cols="2">
            <span>Loading Port: {{ form.loading_port }}</span>
          </v-col>
          <v-col cols="2">
            <span>Clear Remark Type: {{ form.clear_remark_type }}</span>
          </v-col>
          <v-col cols="2">
            <span>Clear Remark Seq: {{ form.clear_remark_sequence }}</span>
          </v-col>
          <v-col cols="2">
            <span>Clear Remark: {{ form.clear_remark }}</span>
          </v-col>
          <v-col cols="2">
            <span>Remark Code 1: {{ form.remark_code_1 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Remark Code 2: {{ form.remark_code_2 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Remark Code 3: {{ form.remark_code_3 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Remark Code 4: {{ form.remark_code_4 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Remark Code 5: {{ form.remark_code_5 }}</span>
          </v-col>
          <v-col cols="2">
            <span>General Remark 1: {{ form.general_remark_1 }}</span>
          </v-col>
          <v-col cols="2">
            <span>General Remark 2: {{ form.general_remark_2 }}</span>
          </v-col>
          <v-col cols="2">
            <span>General Remark 3: {{ form.general_remark_3 }}</span>
          </v-col>
          <v-col cols="2">
            <span>General Remark 4: {{ form.general_remark_4 }}</span>
          </v-col>
          <v-col cols="2">
            <span>General Remark 5: {{ form.general_remark_5 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Processing Remark 1: {{ form.processing_remark_1 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Processing Remark 2: {{ form.processing_remark_2 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Processing Remark 3: {{ form.processing_remark_3 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Processing Remark 4: {{ form.processing_remark_4 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Processing Remark 5: {{ form.processing_remark_5 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Delivery Date: {{ form.delivery_date }}</span>
          </v-col>
          <v-col cols="2">
            <span>Caster: {{ form.caster }}</span>
          </v-col>
          <v-col cols="2">
            <span>Surface Grade: {{ form.surface_grade }}</span>
          </v-col>
          <v-col cols="2">
            <span>Coating Type: {{ form.coating_type }}</span>
          </v-col>
          <v-col cols="2">
            <span>Cut Margin Min: {{ form.cut_margin_min }}</span>
          </v-col>
          <v-col cols="2">
            <span>Cut Margin Max: {{ form.cut_margin_max }}</span>
          </v-col>
          <v-col cols="2">
            <span>Cut Margin Unit: {{ form.cut_margin_unit }}</span>
          </v-col>
          <v-col cols="2">
            <span>Colour Code: {{ form.color_code }}</span>
          </v-col>
          <v-col cols="2">
            <span>Carbon Min: {{ form.carbon_min }}</span>
          </v-col>
          <v-col cols="2">
            <span>Carbon Max: {{ form.carbon_max }}</span>
          </v-col>
          <v-col cols="2">
            <span>Manganese Range Min: {{ form.manganese_range_min }}</span>
          </v-col>
          <v-col cols="2">
            <span>Manganese Range Max: {{ form.manganese_range_max }}</span>
          </v-col>
          <v-col cols="2">
            <span>Secondary Length 1 Min: {{ form.secondary_length_1_min }}</span>
          </v-col>
          <v-col cols="2">
            <span>Secondary Length 1 Max: {{ form.secondary_length_1_max }}</span>
          </v-col>
          <v-col cols="2">
            <span>Section Thickness Min: {{ form.section_thickness_min }}</span>
          </v-col>
          <v-col cols="2">
            <span>Section Thickness Max: {{ form.section_thickness_max }}</span>
          </v-col>
          <v-col cols="2">
            <span>Section Section Min: {{ form.section_width_min }}</span>
          </v-col>
          <v-col cols="2">
            <span>Section Section Max: {{ form.section_width_max }}</span>
          </v-col>
          <v-col cols="2">
            <span>Inspector Code 1: {{ form.inspector_code_1 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Inspector Code 2: {{ form.inspector_code_2 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Inspector Code 3: {{ form.inspector_code_3 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Label Template ID: {{ form.label_template_id }}</span>
          </v-col>
          <v-col cols="2">
            <span>Label Data: {{ form.label_data }}</span>
          </v-col>
          <v-col cols="2">
            <span>Quality (PC): {{ form.quantity_pc }}</span>
          </v-col>
          <v-col cols="2">
            <span>Quality (Tonnage): {{ form.quantity_tonnage }}</span>
          </v-col>
          <v-col cols="2">
            <span>Length 1 (MM): {{ form.length_1_mm }}</span>
          </v-col>
          <v-col cols="2">
            <span>Length 2 (MM): {{ form.length_2_mm }}</span>
          </v-col>
          <v-col cols="2">
            <span>Length Feet: {{ form.length_feet }}</span>
          </v-col>
          <v-col cols="2">
            <span>Length Inch: {{ form.length_inch }}</span>
          </v-col>
          <v-col cols="2">
            <span>ASTM DIM1: {{ form.astm_dim1 }}</span>
          </v-col>
          <v-col cols="2">
            <span>ASTM DIM2: {{ form.astm_dim2 }}</span>
          </v-col>
          <v-col cols="2">
            <span>ASTM DIM3: {{ form.astm_dim3 }}</span>
          </v-col>
          <v-col cols="2">
            <span>Sales Order Unit: {{ form.sales_order_unit }}</span>
          </v-col>
          <v-col cols="2">
            <span>Semi Width: {{ form.semi_width }}</span>
          </v-col>
          <v-col cols="2">
            <span>Semi Thickness: {{ form.semi_thickness }}</span>
          </v-col>
          <v-col cols="2">
            <span>Prime Type: {{ form.prime_type }}</span>
          </v-col>
          <v-col cols="2">
            <span>IM Type: {{ form.im_type }}</span>
          </v-col>
          <v-col cols="2">
            <span>Weight Per PC: {{ form.weight_per_pc }}</span>
          </v-col>
          <v-col cols="2">
            <span>Remark Group: {{ form.remark_group }}</span>
          </v-col>
          <v-col cols="2">
            <span>Remark Category Group: {{ form.remark_category_group }}</span>
          </v-col>
          <v-col cols="2">
            <span>Secondary Length 2 Min: {{ form.secondary_length_2_min }}</span>
          </v-col>
          <v-col cols="2">
            <span>Secondary Length 2 Max: {{ form.secondary_length_2_max }}</span>
          </v-col>
          <v-col cols="2">
            <span>Secondary Length Volume: {{ form.secondary_length_volume }}</span>
          </v-col>
          <v-col cols="2">
            <span>Rejection: {{ form.rejection }}</span>
          </v-col>
          <v-col cols="2">
            <span>Rejection Desc: {{ form.rejection_desc }}</span>
          </v-col>
          <v-col cols="2">
            <span>Sub Item No: {{ form.sub_item_no }}</span>
          </v-col>
          <v-col cols="2">
            <span>Condition Record Per Unit: {{ form.condition_record_per_unit }}</span>
          </v-col>
          <v-col cols="12">
            <span>Remark: {{ form.remark }}</span>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-expansion-panels v-model="tabs" elevation="0" multiple bg-color="white" variant="accordion">
      <!-- <v-expansion-panel value="0" color="grey-lighten-2" expand :rounded="24" readonly>
        <v-expansion-panel-title>
          <v-col cols="2">
            Planned Load List
          </v-col>
          <v-col cols="10" class="text-end">
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                @click="handleCreateLoad"
            >
              Create New Load
            </v-btn>
          </v-col>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table-server
              min-height="300"
              fixed-header
              return-object
              :headers="loadTableHeaders"
              :items="loadTableItems"
              :loading="loadTableLoading"
          >
          <template v-slot:item.cut_seq>
            E001
          </template>
            <template v-slot:item.action="{ item }">
              <div class="d-flex align-center">
                <router-link
                    class="text-decoration-none grey-darken-4 mr-2"
                    :to="{ name: 'finishedProductLoadDetail', query: { load_id: item.id } }">
                  <v-btn variant="text" icon="mdi-pencil"/>
                </router-link>
                <v-dialog max-width="400" persistent>
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn variant="text" icon="mdi-delete" v-bind="activatorProps"/>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card prepend-icon="mdi-help-circle-outline" text="Deletion is irreversible"
                            title="Confirm to delete data?">
                      <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="isActive.value = false">
                          Cancel
                        </v-btn>
                        <v-btn class="text-none" color="primary" variant="flat"
                               @click="handleDeleteLoad(isActive, item)">
                          Confirm
                        </v-btn>
                      </template>
                    </v-card>
                  </template>
                </v-dialog>
              </div>
            </template>
            <template v-slot:item.load_weight="{ item }">
              {{ calculateLoadWeight(item.finished_products) }}
            </template>
            <template v-slot:item.bundle_size="{ item }">
              <span v-if="item.piece_count !== null && item.bundle_size">{{ item.piece_count }} * {{ item.bundle_size }}</span>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
            </template>
            <template v-slot:bottom></template>
          </v-data-table-server>
        </v-expansion-panel-text>
      </v-expansion-panel> -->


      <v-expansion-panel value="0" color="grey-lighten-2" expand :rounded="24" v-if="defaultMillCode == 'SRSM'">
        <v-expansion-panel-title>
          <v-col cols="2">
            Spec Summary
          </v-col>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <br />
          <v-row >
            <v-col cols="2" class="font-weight-medium mb-1">Inspection:</v-col>
            <v-col cols="10" class="text-center">
              {{ SpecSummary.insp_list.join(', ')  }}
            </v-col>
          </v-row>
          <v-divider class="mb-4"></v-divider>

          <v-row >
            <v-col cols="12" class="font-weight-medium mb-1">Cast</v-col>
            
            <v-col cols="2">C Min: {{ SpecSummary.spmainel.main_el_min_value_c }}</v-col>
            <v-col cols="2">C Max: {{ SpecSummary.spmainel.main_el_max_value_c }}</v-col>
            <v-col cols="2">SI Min: {{ SpecSummary.spmainel.main_el_min_value_si }}</v-col>
            <v-col cols="2">SI Max: {{ SpecSummary.spmainel.main_el_max_value_si }}</v-col>
            <v-col cols="2">Mn Min: {{ SpecSummary.spmainel.main_el_min_value_mn }}</v-col>
            <v-col cols="2">Mn Max: {{ SpecSummary.spmainel.main_el_max_value_mn }}</v-col>
            <v-col cols="2">P Min: {{ SpecSummary.spmainel.main_el_min_value_p }}</v-col>
            <v-col cols="2">P Max: {{ SpecSummary.spmainel.main_el_max_value_p }}</v-col>
            <v-col cols="2">S Min: {{ SpecSummary.spmainel.main_el_min_value_s }}</v-col>
            <v-col cols="2">S Max: {{ SpecSummary.spmainel.main_el_max_value_s }}</v-col>
            <v-col cols="2">CR Min: {{ SpecSummary.spmainel.main_el_min_value_ce }}</v-col>
            <v-col cols="2">CR Max: {{ SpecSummary.spmainel.main_el_max_value_ce }}</v-col>
            <v-col cols="2">MO Min: {{ SpecSummary.spmainel.main_el_min_value_mo }}</v-col>
            <v-col cols="2">MO Max: {{ SpecSummary.spmainel.main_el_max_value_mo }}</v-col>
            <v-col cols="2">NI Min: {{ SpecSummary.spmainel.main_el_min_value_ni }}</v-col>
            <v-col cols="2">NI Max: {{ SpecSummary.spmainel.main_el_max_value_ni }}</v-col>
            <v-col cols="2">AL Min: {{ SpecSummary.spmainel.main_el_min_value_al }}</v-col>
            <v-col cols="2">AL Max: {{ SpecSummary.spmainel.main_el_max_value_al }}</v-col>
            <v-col cols="2">CU Min: {{ SpecSummary.spmainel.main_el_min_value_cu }}</v-col>
            <v-col cols="2">CU Max: {{ SpecSummary.spmainel.main_el_max_value_cu }}</v-col>
            <v-col cols="2">N Min: {{ SpecSummary.spmainel.main_el_min_value_n }}</v-col>
            <v-col cols="2">N Max: {{ SpecSummary.spmainel.main_el_max_value_n }}</v-col>
            <v-col cols="2">NB Min: {{ SpecSummary.spmainel.main_el_min_value_nb }}</v-col>
            <v-col cols="2">NB Max: {{ SpecSummary.spmainel.main_el_max_value_nb }}</v-col>
            <v-col cols="2">V Min: {{ SpecSummary.spmainel.main_el_min_value_v }}</v-col>
            <v-col cols="2">V Max: {{ SpecSummary.spmainel.main_el_max_value_v }}</v-col>
            <v-col cols="2">B Min: {{ SpecSummary.spmainel.main_el_min_value_b }}</v-col>
            <v-col cols="2">B Max: {{ SpecSummary.spmainel.main_el_max_value_b }}</v-col>
            
            <v-col cols="2">CEFF Min: {{ SpecSummary.spmainel.main_el_min_value_ce_ffel }}</v-col>
            <v-col cols="2">CEFF Max: {{ SpecSummary.spmainel.main_el_max_value_ce_ffel }}</v-col>

            <v-col cols="10">Formula: {{ SpecSummary.formula_list.join(', ') }}</v-col>
            <v-col cols="2">CERT: {{ SpecSummary.spec.manual_cert }}  </v-col>
          </v-row>

          <v-divider class="mb-4"></v-divider>

          <v-row>
            <v-col cols="12" class="font-weight-medium mb-1">Impact:</v-col>
            <v-col cols="2">TYPE: {{ SpecSummary.spimpact.freq}}</v-col>
            <v-col cols="2">NOTCH: {{ SpecSummary.spimpact.notch }}</v-col>
            <v-col cols="2">TEMP: {{ SpecSummary.spimpact.temp_value_1 }}</v-col>
            <v-col cols="2">AVE3: {{ SpecSummary.spimpact.ave_value_3 }}</v-col>
            <v-col cols="2">SNGL: {{ SpecSummary.spimpact.min_value_3 }}</v-col>
            <v-col cols="2">UNITS: {{ SpecSummary.spimpact.impact_units }}</v-col>
      
          </v-row>

          <v-divider class="mb-4"></v-divider>
          <v-row >
             <v-col cols="12" class="font-weight-medium mb-1">Tensile:</v-col>
              <v-col cols="2">YIELD: {{ SpecSummary.spyield.yield_min }}</v-col>
              <v-col cols="2">TENSILE Unit: N/MM2</v-col>
              <v-col cols="2">MIN: {{ SpecSummary.sptensile.tensile_min }}</v-col>
              <v-col cols="2">MAX: {{ SpecSummary.sptensile.tensile_max }}</v-col>
        
              <v-col cols="2">ELONGATION: {{ SpecSummary.spelong.elong_min_value }}%</v-col>
              <v-col cols="2">On Code:{{ SpecSummary.spelong.elong_guage_code }}</v-col>
              <v-col cols="2">BENDS: {{ SpecSummary.spmainel.bends }}</v-col>
              <v-col cols="6">TENSILE REMARK: {{ SpecSummary.sptensile.remark }}</v-col>
              <v-col cols="2">T-CAT: {{ SpecSummary.spec.stock_test_flag }}</v-col>
              <v-col cols="1">T-REQ: {{ SpecSummary.spec.test_freq }}</v-col>
          </v-row>




       
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel value="1" color="grey-lighten-2" expand :rounded="24" readonly>
        <v-expansion-panel-title>
          <v-col cols="2">
            Finished Product List
          </v-col>
          <v-col cols="10" class="text-end">
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                @click="handleAutoCarryOut"
            >
              Auto Carry Out
            </v-btn>
          </v-col>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table-server
              min-height="300"
              :items-per-page="queryParams.itemsPerPage"
              :page="queryParams.page"
              :headers="tableHeaders"
              :items="tableList"
              :items-length="total"
              :loading="loading"
              fixed-header
              show-current-page
              return-object
              @update:page="handleTableChangePage"
              @update:itemsPerPage="handleTableChangeItemsPerChange"
              @update:sortBy="handleTableChangeSortBy"
          >
            <template v-slot:item.status="{ item }">
              <div class="d-flex justify-center ga-2">
                <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                  {{ tag.name }}
                </v-chip>
              </div>
            </template>
            <template v-slot:item.rework_status="{ item }">
              <div class="d-flex justify-center ga-2">
                <v-chip v-if="item.rework_status !== null" size="small">
                  {{ item.rework_status }}
                </v-chip>
              </div>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
            </template>
          </v-data-table-server>

        </v-expansion-panel-text>
      </v-expansion-panel>


      <v-expansion-panel title="Order Item Remark" value="2" color="grey-lighten-2" expand :rounded="24">
        <v-expansion-panel-text>
          <v-data-table-virtual
          :headers="OrderItemRemarkHeaders"
          :items="OrderItemRemarkTable"
          :loading="loading"
          class="custom-table"
          >
            
          </v-data-table-virtual>

        </v-expansion-panel-text>
      </v-expansion-panel>

    </v-expansion-panels>
    <AutoPlan ref="AutoPlanRef" @refresh="handleAutoLoadPlanRefresh" />
  </v-container>
</template>
<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, getCurrentInstance, reactive, ref, toRaw, toRefs, watch, computed} from "vue";
import {toast} from "vue3-toastify";
import XEUtils from "xe-utils";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import MillCode from "@/components/picker/MillCode.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import API from "./api";
import {formatDate} from "@/util/util";
import AutoPlan from "./components/AutoPlan.vue";
import printJS from "print-js";
import {useStore} from "vuex";
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();
const loading = ref(false);
const saving = ref(false);
const save = ref(false);
const tabs = ref(['0', '1']);
const OrderItemRemarkHeaders = ref([
  { title: 'Identifier', value: 'identifier', minWidth: 60, sortable: false},
  { title: 'Type', value: 'type', minWidth: 60, sortable: false},
  { title: 'Text', value: 'text', minWidth: 60, sortable: false},
])
const OrderItemRemarkTable = ref([])
const store = useStore();

const tableHeaders = ref([
  {title: "Code", key: "code", sortable: true},
  {title: "Cut Code", key: "cut_code", sortable: true},
  {title: "Length(mm)", key: "length_mm", sortable: true},
  {title: "Mults", key: "mult_code", sortable: true},
  {title: "Runout No.", key: "runout.runout_code", sortable: true},
  {
    title: "Order Number",
    key: "order_item.order.order_code",
    value: (item) => item.order_item?.order?.order_code,
    sortable: true
  },
  {
    title: "Line Item Number",
    key: "order_item.line_item_code",
    value: (item) => item.order_item?.line_item_code,
    minWidth: 100,
    sortable: true
  },
  {title: "Spec Code", key: "spec.spec_code", value: (item) => item.spec?.spec_code, sortable: true},
  {title: "Compliance", key: "test_result", sortable: false},
  {title: "Location", key: "location", sortable: true},
  {title: "Is real", key: "exist_flag", sortable: true},
  {title: "Defect", key: "defect_reason.name", value: (item) => item.defect_reason?.name, sortable: true},
  {title: "Allocation Status", key: "allocation_status", sortable: true},
  {title: "Scarfed Status", key: "scarfed_status", sortable: true},
  // {title: "Rework Type", key: "rework_type", sortable: false},
  {title: "Rework Status", key: "rework_status", sortable: true},
  {title: "Status", key: "status", sortable: false},
  {title: "Action", key: "action", minWidth: 150, sortable: false},
]);
const tableList = ref([]);
const total = ref(0);
const loadTableHeaders = ref([
  {title: "Load No", key: "code"},
  {title: "Cut Sequence", key: "cut_seq"},
  {title: "Max Weight(tonnes)", key: "max_weight_tonnage"},
  {title: "Load Weight(tonnes)", key: "load_weight"},
  {title: "Bundle Size", key: "bundle_size"},
  {title: "Action", key: "action"},
]);
const loadTableItems = ref([])
const loadTableLoading = ref(false)
const rollingCodeShow = ref('');
const specCodeShow = ref('');
const data = reactive({
  queryParams: {
    q: null,
    line_item_code: undefined,
    fields: [],
    ops: [],
    values: [],
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  form: {
    id: undefined,
    "order_id": undefined,
    "order_group_id": undefined,
    "arrival_status": undefined,
    "line_item_code": undefined,
    "mill_comment": undefined,
    "amended_quantity": undefined,
    "line_item_seq": undefined,
    "line_item_desc": undefined,
    "product_code": undefined,
    "spec_code": undefined,
    "customer_spec_code": undefined,
    "quantity": undefined,
    "quality_code": undefined,
    "stocked_quantity": 0.0,
    "tonnage": 0.0,
    "tonnage_tolerance_min_percent": 0.0,
    "tonnage_tolerance_max_percent": 0.0,
    "length_mm": 0.0,
    "product_dim1": undefined,
    "product_dim2": undefined,
    "product_dim3": undefined,
    "product_dim4": undefined,
    "product_dim_unit": undefined,
    "product_form": undefined,
    "product_form_type": undefined,
    "request_bar": undefined,
    "cutted_bar": undefined,
    "outside_inspection_required": undefined,
    "transport_type": undefined,
    "destination_port": undefined,
    "loading_port": undefined,
    "clear_remark_type": undefined,
    "clear_remark_sequence": 0,
    "clear_remark": undefined,
    "remark_code_1": undefined,
    "remark_code_2": undefined,
    "remark_code_3": undefined,
    "remark_code_4": undefined,
    "remark_code_5": undefined,
    "general_remark_1": undefined,
    "general_remark_2": undefined,
    "general_remark_3": undefined,
    "general_remark_4": undefined,
    "general_remark_5": undefined,
    "processing_remark_1": undefined,
    "processing_remark_2": undefined,
    "processing_remark_3": undefined,
    "processing_remark_4": undefined,
    "processing_remark_5": undefined,
    "delivery_date": undefined,
    "caster": undefined,
    "surface_grade": undefined,
    "coating_type": undefined,
    "cut_margin_min": 0.0,
    "cut_margin_max": 0.0,
    "color_code": 0.0,
    "carbon_min": 0.0,
    "carbon_max": 0.0,
    "manganese_range_min": 0.0,
    "manganese_range_max": 0.0,
    "secondary_length_1_min": 0.0,
    "secondary_length_1_max": 0.0,
    "section_width_min": 0.0,
    "section_thickness_min": 0.0,
    "section_width_max": 0.0,
    "section_thickness_max": 0.0,
    "inspector_code_1": undefined,
    "inspector_code_2": undefined,
    "inspector_code_3": undefined,
    "label_template_id": undefined,
    "label_data": undefined,
    "rolling_code": undefined,
    "rolling_id": undefined,
    "spec_id": undefined,
    "product_type_id": undefined
  },
  rules: {
    mill_code: [
      value => {
        if (value) return true
        return 'Mill is required.'
      }
    ],
    product_class_code: [
      value => {
        if (value) return true
        return 'Product Class is required.'
      }
    ],
    product_category_code: [
      value => {
        if (value) return true
        return 'Section Type is required.'
      }
    ],
    rolling_code: [
      value => {
        if (value) return true
        return 'Rolling Code is required.'
      },
    ],
    short_code: [
      value => {
        if (value) return true
        return 'Short Code is required.'
      },
    ],
    rolling_dim1: [
      value => {
        if (value) return true
        return 'Rolling Dim1 is required.'
      },
    ],
    rolling_dim2: [
      value => {
        if (value) return true
        return 'Rolling Dim2 is required.'
      },
    ],
    rolling_dim3: [
      value => {
        if (value) return true
        return 'Rolling Dim3 is required.'
      },
    ],
    rolling_dim4: [
      value => {
        if (value) return true
        return 'Rolling Dim4 is required.'
      },
    ],
    semi_size: [
      value => {
        if (value) return true
        return 'Semi Size is required.'
      },
    ],
    rolling_status: [
      value => {
        if (value) return true
        return 'Status is required.'
      },
    ],
    programmed_start_date: [
      value => {
        if (value) return true
        return 'Programmed Date is required.'
      },
    ],
    duration_minutes: [
      value => {
        if (value) return true
        return 'Duration in minutes is required.'
      },
    ],
    programmed_tonnage: [
      value => {
        if (value) return true
        return 'Programmed Total Tons is required.'
      },
    ],
  }
});

const {
  queryParams,
  form,
  rules,
} = toRefs(data);


const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const calculateLoadWeight = (finishedProducts) => {
  if (!finishedProducts) {
    return 0;
  }
  let calculatedLoadWeight = 0.0;
  finishedProducts.forEach((element) => {
    let elementWeight = parseFloat(element.estimated_weight_kg)
    if (!isNaN(elementWeight)) {
      calculatedLoadWeight += elementWeight;
    }
  });
  return (calculatedLoadWeight/1000).toFixed(2);
}

const getFinishedData = () => {
  const params = {
    ...toRaw(queryParams.value)
  };
  params.fields = [];
  params.ops = [];
  params.values = [];
  if (params.order_item_id) {
    params.fields.push("order_item_id");
    params.ops.push("eq");
    params.values.push(params.order_item_id);
    delete params.order_item_id;
  }
  loading.value = true;
  API.getFinishedProductList(params).then(res => {
    if (res.status === 200) {
      total.value = res.data.total || 0;
      tableList.value = res.data.items || [];
    } else {
      total.value = 0;
      tableList.value = []
    }
  }).finally(() => {
    loading.value = false;
  });
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
  getFinishedData();
}

const handleTableChangePage = (page) => {
  queryParams.value.page = page;
  getFinishedData();
}

const handleTableChangeItemsPerChange = (itemsPerPage) => {
  queryParams.value.itemsPerPage = itemsPerPage;
  getFinishedData();
}

const handleTableChangeSortBy = (sortBy) => {
  queryParams.value.sortBy = sortBy;
  getFinishedData();
}

const handlePickRollingCode = (rolling_item) => {
  // formData.value.rolling_id = rolling_item?.id
  rollingCodeShow.value = rolling_item?.rolling_code;
  form.value.rolling_id = rolling_item?.id;
}

const handlePickSpec = (spec_item) => {
  // specCodeShow.value = (spec_item)?.spec_code;
  form.value.spec_id = spec_item?.id;
}

// 保存数据
const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  saving.value = true;
  const params = toRaw(form.value);
  try {
    await API.update(params);
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      onClose: () => router.back()
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    saving.value = false;
  }
}

const getDetailById = (id) => {
  API.get(id).then(res => {
    form.value = res.data;
    queryParams.value.order_item_id = id;
    rollingCodeShow.value = res.data?.rolling?.rolling_code;
    if (res.data?.spec?.spec_code && res.data?.spec?.version && res.data?.spec?.version_status) {
      specCodeShow.value = res.data?.spec?.spec_code + '-' + res.data?.spec?.version + '-' + res.data?.spec?.version_status;
    }
    getFinishedData();
  });
}

const handleBack = () => {
  router.go(-1);
}

const handleError = (error) => {
  if (error.response) {
    toast.error(error.response.data?.detail || error.response.data?.tip, { autoClose: 60000 })
  }
  return false
}

const handleAutoLoadPlan = () => {
  if (!form.value.id || !form.value.tonnage) {
    toast.error("Failed by no id or no tonnage", { autoClose: 60000 })
    return false;
  }
  proxy.$refs["AutoPlanRef"].handleShow(form.value);
  // doAutoLoadPlan();
}

const handleAutoLoadPlanRefresh = () => {
  getLoadListById(form.value.id);
}

// const doAutoLoadPlan = () => {
//   API.auto_plan({"work_order_item_id": form.value.id}).then(res => {
//     const respData = res.data;
//     loadTableItems.value = respData || [];
//     toast.success("Auto load plan successfully", {
//       position: "bottom-center"
//     })
//     return true;
//   }).catch((error) => {
//     handleError(error)
//   })
// }

const handleDeleteLoad = (isActive, item) => {
  API.delete_load(item.id).then(res => {
    let deleteIndex = loadTableItems.value.findIndex(elem => elem.id === item.id)
    if (deleteIndex !== -1) {
      loadTableItems.value.splice(deleteIndex, 1);
    }
    toast.success("delete load successfully", {
      position: "bottom-center"
    })
    return true;
  }).catch((error) => {
    handleError(error)
  })
}

const handleCreateLoad = () => {
  API.create_load({order_item_id: form.value.id}).then(res => {
    loadTableItems.value.push(res.data);
    toast.success("create load successfully", {
      position: "bottom-center"
    })
    return true;
  }).catch((error) => {
    handleError(error)
  })
}

const handleAutoCarryOut = () => {
  console.log(loadTableItems.value);
  console.log(tableList.value);
  if (!loadTableItems.value || loadTableItems.value.length === 0) {
    toast.error("There aren't load yet", { autoClose: 60000 })
    return false;
  }
  if (!tableList.value || tableList.value.length === 0) {
    toast.error("There aren't finished product yet", { autoClose: 60000 })
    return false;
  }
  API.carry_out({work_order_item_id: form.value.id}).then(res => {
    getLoadListById(form.value.id);
    const successful_bundle_ids = res.data?.successful_bundle_ids;
    const failed_bundle_ids = res.data?.failed_bundle_ids;
    toast.success(successful_bundle_ids.join(',') + "Auto Carry Out successfully", {
      position: "bottom-center"
    })
    return true;
  }).catch((error) => {
    handleError(error)
  })
}

const getLoadListById = (id) => {
  const params = {
    fields: ["order_item_id"],
    ops: ["=="],
    values: [id],
  }
  API.getPlanedLoadList(id).then(res => {
    loadTableItems.value = res.data;
    return true;
  }).catch((error) => {
    handleError(error)
  })
};

const SpecSummary = ref({
  insp_list: [],
  spec:{},
  sptensile:{},
  spmainel:{},
  spimpact:{},
  spelong:{},
  spyield:{},
  formula_list:[],
  cast_list:[]
})

const getSpecSummary = () => {
  return API.getInfoSpecByOrder({order_item_id: route.query.id}).then(result => {
    const {status, data} = result
    if (status !== 200) {
      toast.error(error.response.data?.detail, { autoClose: 60000 })
      return
    }
    SpecSummary.value = result.data
    if (SpecSummary.value.insp_list.length == 0) {
      SpecSummary.value.insp_list = ['WORKS INSPECTION']
    }
    SpecSummary.value.spimpact.freq = SpecSummary.value.spimpact.freq ? SpecSummary.value.spimpact.freq[0] : ''
    SpecSummary.value.spimpact.notch = SpecSummary.value.spimpact.notch ? SpecSummary.value.spimpact.notch[0] : ''
    SpecSummary.value.spimpact.remark = ''
    SpecSummary.value.sptensile.remark = SpecSummary.value.sptensile.yield_min && SpecSummary.value.sptensile.tensile_min ? `Y.S= ${SpecSummary.value.sptensile.yield_min}-${SpecSummary.value.sptensile.tensile_min} N/MM2` : ''
    SpecSummary.value.sptensile.std = SpecSummary.value.sptensile.std ? SpecSummary.value.sptensile.std[0] : ''
    SpecSummary.value.formula_list = (result.data.spmainel?.flex_form_data?.Formula || []).map(item=>{return item.Formula}) 
    console.log(SpecSummary.value.formula_list,  result.data.spmainel.flex_form_data?.Formula)


  }).catch((error) => {
    handleError(error)
  })
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  getDetailById(route.query.id)
  getLoadListById(route.query.id)
  getSpecSummary()
}

const getAllOrderItemRemarkData = () => {
  API.getOrderItemRemark(route.query.id).then(result => {
    OrderItemRemarkTable.value = result.data
  })
}


const handlePrintMillSheet = () => {
  // 获取当前日期时间
  const currentDate = formatDate(new Date(), 'YY/MM/DD (HH.mm)');
  
  // 
  const printFields = [
    { displayName: "SUB", field: "work_sub" },
    { displayName: "WEIGHT", field: "weight" },
    { displayName: "LENGTH", field: "length" },
    { displayName: "BARS", field: "bars" },
    { displayName: "CAST", field: "cast" },
    { displayName: "CONS", field: "cons" },
    { displayName: "YLD.", field: "yld" },
    { displayName: "UTS", field: "uts" },
    { displayName: "EL%", field: "el" },
    { displayName: "PLANNED TET REFERENCES", field: "planned_tet_references" },
  ];


  const printData = [{
      work_sub: form.value.line_item_code || '',
      weight:form.value.tonnage || '',
      length: form.value.length_mm || '',
      bars: form.value.quantity || '',
      cast:  SpecSummary.value.cast_list.join(',') || '',
      cons: '',
      yld:  SpecSummary.value.sptensile.yield_min || '',
      uts: SpecSummary.value.sptensile.tensile_min || '',
      el: SpecSummary.value.spelong.elong_min_value || '',
      planned_tet_references: '',

  }];

  //work info
  const workinfo = `
      <div class="work-info" style="margin-top: 15px; font-size: 12px;">
      <table style="width: 100%; border-collapse: collapse; border-top: 1px dashed #000; border-bottom: 1px dashed #000;">
        <tr style="text-align: center;">
          <td style="padding: 3px; width: 14%;">WKSORD</td>
          <td style="padding: 3px; width: 14%;">CUSTOMER'S ORDER NO.</td>
          <td style="padding: 3px; width: 14%;">BSC ORDER</td>
          <td style="padding: 3px; width: 14%;">PRODUCT</td>
          <td style="padding: 3px; width: 14%;">LBS/FT</td>
          <td style="padding: 3px; width: 14%;">QCD</td>
          <td style="padding: 3px; width: 14%;">QUALITY</td>
          <td style="padding: 3px; width: 16%;">SPEC</td>
          <td style="padding: 3px; width: 16%;">Port</td>
        </tr>
        <tr style="text-align: center;">
          <td>${form.value.order?.order_code || ''}</td>
          <td>${form.value.order?.customer_code || ''}</td>
          <td>${form.value.order?.business_order_code || ''}</td>
          <td>${form.value.product_type?.dim1}X${form.value.product_type?.dim2} ${form.value.product_form_type || ''}</td>
          <td>${form.value.product_type?.dim3 || ''} </td>
          <td>${form.value.quality_code || ''}</td>
          <td>${form.value.quantity || ''}</td>
          <td>${form.value.spec?.spec_code || ''}  ${form.value.spec?.srsm_spec_code || ''}</td>
        </tr>
      </table>
    </div>
  `  

  // work inspection
  const workInsp = `
    <div style="margin-top: 20px; font-size: 12px; display: flex; justify-content: space-between; padding-bottom: 8px;">
      <span>Insp:</span>
      <span>${SpecSummary.value.insp_list.join(', ')}</span>
    </div>
  `;

  // cast
  const chemicalComposition = `
    <div class="chemical-composition" style="margin-top: 15px; font-size: 12px;">
      <table style="width: 100%; border-collapse: collapse; border-top: 1px dashed #000; border-bottom: 1px dashed #000;">
        <tr style="text-align: center;">
          <th style="padding: 3px;"></th>
          <th style="padding: 3px;">C</th>
          <th style="padding: 3px;">SI</th>
          <th style="padding: 3px;">MN</th>
          <th style="padding: 3px;">P</th>
          <th style="padding: 3px;">S</th>
          <th style="padding: 3px;">CR</th>
          <th style="padding: 3px;">MO</th>
          <th style="padding: 3px;">NI</th>
          <th style="padding: 3px;">AL</th>
          <th style="padding: 3px;">CU</th>
          <th style="padding: 3px;">N</th>
          <th style="padding: 3px;">NB</th>
          <th style="padding: 3px;">V</th>
          <th style="padding: 3px;">B</th>
          <th style="padding: 3px;">CE-FF</th>
        </tr>
        <tr style="text-align: center;">
          <td>MIN</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_c || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_si || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_mn || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_p || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_s || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_ce || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_mo || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_ni || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_al || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_cu || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_n || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_nb || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_v || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_b || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_min_value_ce_ffel || ''}</td>
        </tr>
        <tr style="text-align: center;">
          <td>MAX</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_c || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_si || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_mn || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_p || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_s || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_ce || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_mo || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_ni || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_al || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_cu || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_n || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_nb || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_v || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_b || ''}</td>
          <td>${SpecSummary.value.spmainel?.main_el_max_value_ce_ffel || ''}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; font-size: 12px; display: flex; justify-content: space-between; padding-bottom: 8px;">
        <span>Formula:</span>
        <span>${SpecSummary.value.formula_list.join(', ')}</span>
      </div>
      <div style="margin-top: 5px; display: flex; justify-content: space-between;">
        <span>Cert Cast Std Elems, +(FIO)SN</span>
        <span>ANALYSIS QUOTED IS LADLE ANALYSIS</span>
      </div>
    </div>
  `;

  // impact
  const impactTest = `
    <div class="impact-test" style="margin-top: 15px; font-size: 12px;">
      <table style="width: 100%; border-collapse: collapse; border-top: 1px dashed #000; border-bottom: 1px dashed #000;">
        <tr style="text-align: center;">
          <td style="padding: 3px; width: 14%;">TYPE</td>
          <td style="padding: 3px; width: 14%;">NOTCH</td>
          <td style="padding: 3px; width: 14%;">TEMP</td>
          <td style="padding: 3px; width: 14%;">AVE3</td>
          <td style="padding: 3px; width: 14%;">SNGL</td>
          <td style="padding: 3px; width: 14%;">UNITS</td>
          <td style="padding: 3px; width: 16%;">IMPACT REMARKS</td>
        </tr>
        <tr style="text-align: center;">
          <td>${SpecSummary.value.spimpact?.freq || ''}</td>
          <td>${SpecSummary.value.spimpact?.notch || ''}</td>
          <td>${SpecSummary.value.spimpact?.temp_value_1 || ''}</td>
          <td>${SpecSummary.value.spimpact?.ave_value_3 || ''}</td>
          <td>${SpecSummary.value.spimpact?.min_value_3 || ''}</td>
          <td>${SpecSummary.value.spimpact?.impact_units || ''}</td>
          <td>${SpecSummary.value.spimpact?.remark || ''}</td>
        </tr>
      </table>
    </div>
  `;
  
  // tensile
  const tensileTest = `
    <div class="mechanical-properties" style="margin-top: 15px; font-size: 12px;">
      <table style="width: 100%; border-collapse: collapse; border-top: 1px dashed #000; border-bottom: 1px dashed #000;">
        <tr style="text-align: center;">
          <td style="padding: 3px; width: 10%;">YIELD</td>
          <td style="padding: 3px; width: 20%;">TENSILE MIN MAX</td>
          <td style="padding: 3px; width: 20%;">MIN ELONGATION</td>
          <td style="padding: 3px; width: 10%;">BENDS</td>
          <td style="padding: 3px; width: 20%;">TENSILE REMARK</td>
          <td style="padding: 3px; width: 10%;">T-CAT</td>
          <td style="padding: 3px; width: 10%;">T-REQ</td>
        </tr>
        <tr style="text-align: center;">
          <td>${SpecSummary.value.spyield?.yield_min || ''} N/MM2</td>
          <td>${SpecSummary.value.sptensile?.tensile_min || ' '} ${SpecSummary.value.sptensile?.tensile_max || ''}</td>
          <td>${SpecSummary.value.spelong?.elong_min_value || ' '}% on Code ${SpecSummary.value.spelong?.elong_guage_code || ''}</td>
          <td>${SpecSummary.value.spmainel?.bends || ''}</td>
          <td>${SpecSummary.value.sptensile?.remark || ''}</td>
          <td>${SpecSummary.value.spec?.stock_test_flag || ''}</td>
          <td>${SpecSummary.value.spec?.test_freq || ''}</td>
        </tr>
      </table>
    </div>
  `;

  // remarks
  const remarks = `
    <div class="remarks" style="margin-top: 15px; font-size: 12px;">
      <div style="padding: 3px;">TESTING REMARK:- 2 TENSILE/CAST/SECTION</div>
      <div style="padding: 3px;">CUSTOMER'S MARK:- ( INFRA METALS NE-694962 PORT OF DISCHARGE NEW HAVEN           )</div>
      <div style="padding: 3px;">MELTED, POURED & MANUFACTURED  IN THE UK</div>
    </div>
  `;

  printJS({
    printable: printData,
    properties: printFields,
    type: "json",
    header: `
      <div style="text-align: center; font-size: 14px; margin-bottom: 10px;">
        <div style="border-bottom: 2px dashed black; padding: 10px;">
          MSM MILL SHEET                    ${currentDate} 1/1|INFRA METALS CO.(CT)
        </div>
        <div style="text-align: right; font-size: 12px; display: flex; justify-content: space-between;">
          <span>STD ${SpecSummary.value.sptensile?.std || ''}</span>
          <span>${SpecSummary.value.sptensile?.pt || ''}</span>
        </div>
      </div>
    ` + workinfo + workInsp + chemicalComposition + tensileTest + impactTest + remarks,
    gridHeaderStyle: 'font-size: 12px; border-bottom: 1px dashed #000; text-align: left; padding: 5px; font-weight: bold;',
    gridStyle: 'font-size: 12px; border-bottom: 1px dashed #000; text-align: left; padding: 5px;',
    style: '@page { size: portrait; margin: 1cm; } body { font-family: monospace; }',
    documentTitle: 'MSM MILL SHEET',
    targetStyle: ['*'],
  });
};



getAllOrderItemRemarkData();
</script>
<style scoped>
:deep(.no-border .v-input__control) {
  border: none !important;
  box-shadow: none !important;
}

.custom-table {
  max-height: 500px; /* 限制最大高度 */
  overflow-y: auto; /* 超过时滚动 */
  display: flex;
  flex-direction: column;
}

.custom-table .v-data-table__wrapper {
  flex: 1; /* 让表格内容自适应高度 */
}
</style>
