<template>
  <v-container class="detail-content" fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
      <v-row class="mb-2" align="center">
        <v-col cols="5">
          <div class="d-flex ga-4 align-center">
            <SpecCode v-model="queryParams.id" :spec="spec"/>
            <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
              Reset
            </v-btn>
            <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading">
              Search
            </v-btn>
            
          </div>
        </v-col>
        <template v-if="!!form.release_date || !!form.archive_date">
          <v-col cols="4">
            <div class="d-flex align-center ga-2">
              <v-chip size="small" color="green" v-if="!!form.release_date">
                Release Date: {{ formatDate(form.release_date) }}
              </v-chip>
              <v-chip size="small" color="red" v-if="!!form.archive_date">
                Archive Date: {{ formatDate(form.archive_date) }}
              </v-chip>
            </div>
          </v-col>
        </template>
        <template v-else>
          <v-spacer/>
        </template>

        <v-col cols="3">
          <div class="specsave">
            <div class="specsave-action d-flex ga-4">
              <v-btn v-if="form.version_status === 'R'" :loading="loading" variant="flat" class="text-none"
                    color="primary" @click="archiveVersionData">
                Archive
              </v-btn>
              <v-btn v-if="form.version_status === 'D'" :loading="loading" variant="flat" class="text-none"
                     color="primary" style="margin-right: 20px" @click="updateVersionData">
                Release
              </v-btn>

              <v-btn
                :loading="loading"
                variant="flat"
                class="text-none"
                color="primary"
                style="margin-right: 20px"
                @click="showDialog"
              >
                Supensed
              </v-btn>

              <v-dialog v-model="isDialogVisible" max-width="500">
                <v-card>
                  <v-card-title class="text-h6">Confirm Action</v-card-title>
                  <v-card-text>
                    Do you want to change the current {{ form.suspended }} to {{ form.suspended === "Y" ? "N" : "Y" }}?
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="isDialogVisible = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="updateSupensedData">Confirm</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
              <v-switch v-model="save" density="default" hide-details inset></v-switch>
              <div class="ml-14">
                <v-btn :disabled="!save" :loading="loading" variant="flat" color="primary" @click="handleSave">
                  {{ form.id ? "Update" : "Save" }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <div v-if="currentMill !== 'SRSM'" class="rounded border mt-4 mb-4 pt-3 pb-3">
        <v-row align="center">
          <v-col cols="3" v-for="(item, index) in menus" :key="index">
            <v-btn :prepend-icon="item.icon" variant="flat" type="text" @click="handleView(item.href)">
              {{ item.title }}
            </v-btn>
          </v-col>
          <v-col cols="3" v-for="(item, index) in SrsmMenus" :key="index">
            <v-btn :prepend-icon="item.icon" variant="flat" type="text" @click="handleSpecDetail(item.name)">
              {{ item.title }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-expansion-panels class="spec-panels" v-model="panel" bg-color="white" multiple>
        <v-expansion-panel>
          <v-expansion-panel-title>
            General
          </v-expansion-panel-title>
          <v-expansion-panel-text clss="spec-panels-text">
            <v-row align="center">
              <v-col cols="4">
                <v-text-field
                    v-model="form.spec_code"
                    :rules="rules.spec_code"
                    density="default"
                    variant="underlined"
                    placeholder="Spec Code"
                    bg-color="white"
                    maxlength="5"
                    :disabled="!save"
                    label="Spec Code"
                    clearable
                >
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <MillCode v-model="form.mill_code" @change="handleItemChange($event, 'mill_id')" :hide-details="false"
                          :disabled="!save" :rules="rules.mill_code"/>
              </v-col>
              <!-- <v-col cols="4">
                <div class="text-subtitle-2 font-weight-regular	mb-2">Version</div>
                <v-text-field v-model="form.version" density="default" variant="underlined"
                              placeholder="Version" bg-color="white" clearable></v-text-field>
              </v-col> -->
              <v-col cols="4">
                <DictCode v-model="form.version_status" :disabled="!save" code="spec_version_status"
                          label="Release Status" :hide-details="false"/>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.full_name" density="default" variant="underlined"
                              placeholder="Full Name" bg-color="white" clearable :maxlength="30" :disabled="!save"
                              label="Full Name" :rules="rules.full_name"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="form.short_name" density="default" variant="underlined"
                              placeholder="Short Name" bg-color="white" clearable :maxlength="4" :disabled="!save"
                              label="Short Name" :rules="rules.short_name"></v-text-field>
              </v-col>
              
              <v-col cols="4">
                <v-text-field v-model="form.summary_name" density="default" variant="underlined"
                              placeholder="Summary Name" bg-color="white" clearable :maxlength="8" :disabled="!save"
                              label="Summary Name" :rules="rules.summary_name"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="form.cost_code" density="default" variant="underlined"
                              placeholder="Cost Code" bg-color="white" clearable :maxlength="4" :disabled="!save"
                              label="Cost Code"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                    v-model="form.inspector"
                    :items="inspectorOptions"
                    item-title="desc"
                    item-value="id"
                    multiple
                    chips
                    density="default"
                    :hide-details="false"
                    :disabled="!save"
                    label="Inspectors"
                    placeholder="Please select"
                />
              </v-col>


              <v-col cols="4">
                <ChildrenSpec v-model="form.children_specs" :id="form.id" :hide-details="false" :disabled="!save"/>
              </v-col>

              <!-- <v-col cols="4">
                <DictCode v-model="form.stock_test_flag" :disabled="!save" code="stock_test_flag"
                          label="Stock Test Flag" :hide-details="false"/>
              </v-col> -->
              

              <!-- <v-col cols="4">
                <ToleranceCode v-model="form.tolerance_code" @change="handleItemChange($event, 'tolerance_id')"
                               :hide-details="false" :disabled="!save"/>
              </v-col> -->

              <!-- <v-col cols="4">
                <v-autocomplete
                    v-model="form.srsm_spec_code"
                    :items="srsmSpecOptions"
                    item-title="desc"
                    item-value="code"
                    chips
                    density="default"
                    :hide-details="false"
                    :disabled="!save"
                    label="Srsm Spec Code"
                    placeholder="Please select"
                >
                </v-autocomplete>
              </v-col> -->

              <v-col cols="4">
                <DictCode v-model="form.type" :disabled="!save" code="spec_type_new" label="Type"
                          :hide-details="false"/>
              </v-col>
              <v-col cols="4">
                <DictCode v-model="form.standard" :disabled="!save" code="spec_standard" label="Standard"
                          :hide-details="false"/>
              </v-col>

              <v-col cols="4" v-if="currentMill !== 'SRSM'">
                <dict-code
                    v-model="form.spec_units"
                    label="Unit"
                    code="spec_unit"
                    density="default"
                    variant="underlined"
                    :hide-details="false"
                    :disabled="!save"
                />
              </v-col>

              <v-col cols="4">
                <DictCode
                    v-model="form.suspended"
                    label="Suspended"
                    code="spec_suspended"
                    :hide-details="true"
                    :disabled="!save"
                />
              </v-col>


            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        
        <template v-if="currentMill === 'TBM'">
          <v-expansion-panel>
          <v-expansion-panel-title>
            Sections Only
          </v-expansion-panel-title>
          <v-expansion-panel-text clss="spec-panels-text">
            <v-row align="center">
              <v-col cols="4">
                <v-text-field v-model="form.bmqc_name" density="default" variant="underlined"
                              placeholder="BMQC Name" bg-color="white" clearable :maxlength="12" :disabled="!save"
                              label="BMQC Name"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="form.premise_name" density="default" variant="underlined"
                              placeholder="Premis Name" bg-color="white" clearable :maxlength="6" :disabled="!save"
                              label="Premis Name"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="form.man_chk_remark" density="default" variant="underlined"
                              placeholder="Man Check Remark" bg-color="white" clearable :maxlength="30"
                              :disabled="!save"
                              label="Man Check Remark"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="form.bend_test_dia" density="default" variant="underlined"
                              placeholder="Bend Test Dia" bg-color="white" clearable :maxlength="5" :disabled="!save"
                              label="Bend Test Dia"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="form.equiv_spec_1" density="default" variant="underlined"
                              placeholder="Equivalent Specs" bg-color="white" clearable :maxlength="5" :disabled="!save"
                              label="Equivalent Specs"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="form.msm_qual_code" density="default" variant="underlined"
                              placeholder="MSM Spec Code" bg-color="white" clearable :maxlength="4" :disabled="!save"
                              label="MSM Spec Code"></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field v-model="form.fecc_qual_category" density="default"
                              variant="underlined" placeholder="FECC Quality Category" bg-color="white"
                              clearable :maxlength="4" :disabled="!save" label="FECC Quality Category"></v-text-field>
              </v-col>
              <v-col cols="4">
                <DictCode v-model="form.test_type" :disabled="!save" code="test_type" label="Test Type"
                          :hide-details="false"/>

              </v-col>
              <v-col cols="4">
                <DictCode v-model="form.test_subtype" :disabled="!save" code="test_subtype" label="Test Subtype"
                          :hide-details="false"/>

              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-row align="center">
                <v-col cols="6">
                  Editors Notes
                </v-col>
                <v-col cols="6" class="text-end pr-6">
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click.stop="handleEditorNotesEdit(undefined)"
                      v-permission="`New Editor Note`"
                  >
                    New Editor Note
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text clss="spec-panels-text">
              <v-data-table-virtual
                  fixed-header
                  min-height="500"
                  :headers="editorNotesTableHeaders"
                  :items="editorNotesTableList"
                  :loading="loading"
                  item-value="id"
              >
                <template v-slot:item.dim="row">
                  {{ row.item.dim1 }} - {{ row.item.dim2 }}
                </template>
                <template v-slot:item.action="{ item }">
                  <v-dialog
                      max-width="400"
                      persistent
                  >
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                          variant="text"
                          icon="mdi-pencil"
                          @click="handleEditorNotesEdit(item)"
                      />
                      <v-btn
                          variant="text"
                          icon="mdi-delete"
                          v-bind="activatorProps"
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
                              @click="handleDeleteEditorNotes(isActive, item)"
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
              </v-data-table-virtual>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-row align="center">
                <v-col cols="6">
                  Specification Text
                </v-col>
                <v-col cols="6" class="text-end pr-6">
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click.stop="handleSpecTextEdit(undefined)"
                      v-permission="`New Specification Text`"
                  >
                    New Specification Text
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text clss="spec-panels-text">
              <v-data-table-virtual
                  fixed-header
                  min-height="500"
                  :headers="specTextTableHeaders"
                  :items="specTextTableList"
                  :loading="loading"
                  item-value="id"
              >
                <template v-slot:item.dim="row">
                  {{ row.item.dim1 }} - {{ row.item.dim2 }}
                </template>
                <template v-slot:item.action="{ item }">
                  <v-dialog
                      max-width="400"
                      persistent
                  >
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                          variant="text"
                          icon="mdi-pencil"
                          @click="handleSpecTextEdit(item)"
                      />
                      <v-btn
                          variant="text"
                          icon="mdi-delete"
                          v-bind="activatorProps"
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
                              @click="handleDeleteSpecText(isActive, item)"
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
              </v-data-table-virtual>
            </v-expansion-panel-text>
          </v-expansion-panel>
         
        </template>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-row align="center">
              <v-col cols="6">
                
                {{ currentMill == 'SRSM' ? "Testing And Certification" : "Remark" }}
              </v-col>
              <v-col cols="6" class="text-end pr-6">
                <v-btn
                    class="text-none"
                    color="primary"
                    variant="flat"
                    @click.stop="handleEdit(undefined)"
                    v-permission="`New Remark`"
                >
                  New 
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text clss="spec-panels-text">
            <v-data-table-virtual
                fixed-header
                min-height="500"
                :headers="tableHeaders"
                :items="tableList"
                :loading="loading"
                item-value="id"
            >
              <template v-slot:item.dim="row">
                {{ row.item.dim1 }} - {{ row.item.dim2 }}
              </template>
              <template v-slot:item.action="{ item }">
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
            </v-data-table-virtual>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <template v-if="currentMill == 'SRSM'">
          
          <v-expansion-panel>
            <v-expansion-panel-title>
              Product Planner Specific
            </v-expansion-panel-title>
            <v-expansion-panel-text clss="spec-panels-text">
              <v-row align="center">
                <v-col cols="4">
                  <v-text-field v-model="form.thick_from" density="default" variant="underlined"
                                placeholder="Thickness From" bg-color="white" clearable :disabled="!save"
                                label="Thickness From"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.thick_to" density="default" variant="underlined"
                                placeholder="Thickness To" bg-color="white" clearable :disabled="!save"
                                label="Thickness To"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.supply" density="default" variant="underlined"
                                placeholder="Supply Condit" bg-color="white" clearable :disabled="!save"
                                label="Supply Condit"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.srsm_spec_code" density="default" variant="underlined"
                                placeholder="S Code" bg-color="white" clearable :disabled="!save"
                                label="S Code"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.alt_spec_code" density="default" variant="underlined"
                                placeholder="PP No." bg-color="white" clearable :disabled="!save"
                                label="PP No."></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.quality_code" density="default" variant="underlined"
                                placeholder="BOS Quanlity Code" bg-color="white" clearable :disabled="!save"
                                label="BOS Quanlity Code"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.deox" density="default" variant="underlined"
                                placeholder="Deoxidation" bg-color="white" clearable :disabled="!save"
                                label="Deoxidation"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.stock_test_flag" density="default" variant="underlined"
                                placeholder="Test Cat" bg-color="white" clearable :disabled="!save"
                                label="Test Cat"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.test_freq" density="default" variant="underlined"
                                placeholder="Test Req" bg-color="white" clearable :disabled="!save"
                                label="Test Req"></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-text-field v-model="form.prod_ladle" density="default" variant="underlined"
                                placeholder="Prod / Ladle" bg-color="white" clearable :disabled="!save"
                                label="Prod/Ladle"></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-text-field v-model="form.rail_status" density="default" variant="underlined"
                                placeholder="Rail Spec" bg-color="white" clearable :disabled="!save"
                                label="Rail Spec"></v-text-field>
                </v-col>

                <!-- <v-col cols="4">
                  <v-text-field v-model="form.cd_cust" density="default" variant="underlined"
                                placeholder="CD Cust" bg-color="white" clearable :maxlength="20" :disabled="!save"
                                label="CD Cust"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.cd_cust_type" density="default" variant="underlined"
                                placeholder="CD Cust type" bg-color="white" clearable :maxlength="24" :disabled="!save"
                                label="CD Cust Type"></v-text-field>
                </v-col> -->
                <!-- <v-col cols="4">
                  <v-text-field v-model="form.tx_cust" density="default" variant="underlined"
                                placeholder="Tx Cust" bg-color="white" clearable :maxlength="8" :disabled="!save"
                                label="Tx Cust"></v-text-field>
                </v-col> -->
                <!-- <v-col cols="4">
                  <v-text-field v-model="form.cd_cust_site" density="default" variant="underlined"
                                placeholder="CD Cust Site" bg-color="white" clearable :maxlength="16" :disabled="!save"
                                label="CD Cust Site"></v-text-field>
                </v-col> -->
                <!-- <v-col cols="4">
                  <v-text-field v-model="form.cd_code01" density="default" variant="underlined"
                                placeholder="CD Code 01" bg-color="white" clearable :maxlength="3" :disabled="!save"
                                label="CD Code 01"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.cd_code02" density="default" variant="underlined"
                                placeholder="CD Code 02" bg-color="white" clearable :maxlength="3" :disabled="!save"
                                label="CD Code 02"></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="form.cd_code03" density="default" variant="underlined"
                                placeholder="CD Code 03" bg-color="white" clearable :maxlength="3" :disabled="!save"
                                label="CD Code 03"></v-text-field>
                </v-col> -->
                <!-- <v-col cols="4">
                  <v-text-field v-model="form.ext_grade_obs" density="default" variant="underlined"
                                placeholder="Ext Grade Obs" bg-color="white" clearable :maxlength="64" :disabled="!save"
                                label="Ext Grade Obs"></v-text-field>
                </v-col> -->
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </template>




        <template v-for="(value, key) in test_table_list" :key="key">
          <v-expansion-panel >
          <v-expansion-panel-title>
            <v-row align="center">
              <v-col cols="6">
                {{key.replace(/_/g, ' ')}}
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text clss="spec-panels-text">
            <v-data-table-virtual
                fixed-header
                min-height="500"
                :headers="table_dict.key"
                :items="value"
                :loading="loading"
                item-value="id"
            >
             
            </v-data-table-virtual>
          </v-expansion-panel-text>
        </v-expansion-panel>
        </template>
        


      </v-expansion-panels>
    </v-form>
  </v-container>
  <EditorNotesEditForm ref="editorNotesEditFormRef" @refresh="getEditorNotes"/>
  <SpecTextEditForm ref="specTextEditFormRef" @refresh="getSpecText"/>
  <EditForm ref="editFormRef" @refresh="getAllDate"/>

</template>
<script setup>

import {computed, getCurrentInstance, reactive, ref, toRaw, toRefs, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {toast} from "vue3-toastify";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import specApi from "@/spec_admin/spec/api";
import {formatDate, validateSpecCode} from '@/util/util';
import MillCode from "@/components/picker/MillCode.vue";
import ToleranceCode from "@/components/picker/ToleranceCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import API from "./api";
import EditForm from "./components/editForm.vue";
import EditorNotesEditForm from "./components/editorNotesEditForm.vue"
import SpecTextEditForm from "./components/specTextEditForm.vue";
import ChildrenSpec from "@/components/picker/multiple/childrenSpec.vue";
import { is } from "date-fns/locale";

const commonStore = useCommonStore();
const isDialogVisible = ref(false);

const {proxy} = getCurrentInstance();
const store = useStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);
const menus = ref([
  {
    title: "Manual Semi End Use",
    name: "ManualSemiEndUse",
    desc: "Manual Semi End Use",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/manual_semi_end_use",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Impact",
    name: "SpecImpact",
    desc: "Impact",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/spec_impact",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Tensile",
    name: "SpecTensile",
    desc: "Tensile",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/spec_tensile",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Yield Stress",
    name: "SpecYieldStress",
    desc: "Yield Stress",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/spec_yield_stress",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Elongation Details",
    name: "SpecElongationDetails",
    desc: "Elongation Details",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/spec_elongation_details",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Main Element Analysis",
    name: "MainElementAnalysis",
    desc: "Main Element Analysis",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/main_element_analysis",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Combined Element Analysis",
    name: "CombinedElementAnalysis",
    desc: "Combined Element Analysis",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/combined_element_analysis",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Product Analysis",
    name: "ProductAnalysis",
    desc: "Product Analysis",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/product_analysis",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "CEV For Spec",
    name: "CEVListForSpec",
    desc: "CEV For Spec",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/cev_list_for_spec",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "CEV Analysis",
    name: "CEVAnalysis",
    desc: "CEV Analysis",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/cev_analysis",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Routing Requirement",
    name: "RoutingRequirement",
    desc: "Routing Requirement",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/routing_requirement",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Jominy Details",
    name: "JominyDetails",
    desc: "Jominy Details",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/jominy_details",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Bend Test",
    name: "BendTestDetails",
    desc: "Bend Test",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/bend_test_details",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Deoxidation Details",
    name: "DeoxidationDetails",
    desc: "Deoxidation Details",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/deoxidation_details",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Test Cert Extra Details",
    name: "TestCertExtraDetails",
    desc: "Test Cert Extra Details",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/test_cert_extra_details",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Supply Conditions",
    name: "SupplyConditions",
    desc: "Supply Conditions",
    group: "Semi",
    icon: "mdi-account-group",
    href: "/supply_conditions",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Through Thickness",
    name: "Through Thickness",
    desc: "Through Thickness",
    group: "Product Spec",
    icon: "mdi-account-group",
    href: "/through_thickness",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
  {
    title: "Spec Remark Code",
    name: "specRemark",
    desc: "Remark",
    group: "Product Spec",
    icon: "mdi-account-group",
    href: "/spec_remark",
    visibleRoles: ["sys", "Owner", "Planner"]
  },
])

const currentMill = computed(() => store.state.auth.defaultMillCode);

const SrsmMenus = [
  {
    title: "Spec Various",
    name: "SpecVarious",
    icon: "mdi-account-group",
    href: "/spec_various",
  },
  {
    title: "Spec Remarks",
    name: "SpecRemarks",
    icon: "mdi-account-group",
    href: "/spec_remarks",
  },
  {
    title: "Spec Other Test",
    name: "SpecOtherTest",
    icon: "mdi-account-group",
    href: "/spec_other_test",
  },
]

const Hardness_tableHeaders = ref([
  {title: "Test Group", key: "test_group"},
  {title: "Type", key: "type"},
  {title: "Ball Size", key: "bass_size"},
  {title: "Min", key: "min"},
  {title: "Max", key: "max"},
  {title: "Freq", key: "freq"},
  {title: "Hardness FIO", key: "hardness_fio"},
]);
const Decarburisation_tableHeaders = ref([
  {title: "Test Group", key: "test_group"},
  {title: "Min", key: "min"},
  {title: "Max", key: "max"},
  {title: "Freq", key: "freq"},
  {title: "Decarb FIO", key: "decarb_fio"},
]);
const Sulphur_Print_tableHeaders = ref([
  {title: "Test Group", key: "test_group"},
  {title: "Max Grade", key: "max_grade"},
  {title: "Freq", key: "freq"},
  {title: "Sprint FIO", key: "sprint_fio"},
]);
const Cleanness_tableHeaders = ref([
  {title: "Test Group", key: "test_group"},
  {title: "Type", key: "type"},
  {title: "K Code", key: "k_code"},
  {title: "Min", key: "min"},
  {title: "Max", key: "max"},
  {title: "Freq", key: "freq"},
  {title: "Cleanness FIO", key: "cleanness_fio"},
]);
const Resistivity_tableHeaders = ref([
  {title: "Test Group", key: "test_group"},
  {title: "Temp Range Min", key: "temp_range_min"},
  {title: "Temp Range Max", key: "temp_range_max"},
  {title: "Humidity Range Min", key: "humidity_range_min"},
  {title: "Humidity range Max", key: "humidity_range_max"},
  {title: "Resist Min", key: "resist_value_min"},
  {title: "Resist Max", key: "resist_value_max"},
  {title: "Freq", key: "freq"},
  {title: "Resist FIO", key: "resist_fio"},
]);
const Microstructure_tableHeaders = ref([
  {title: "Test Group", key: "test_group"},
  {title: "Freq", key: "freq"},
]);
const table_dict = ref({
  "Hardness": "Hardness_tableHeaders",
  "Decarburisation": "Decarburisation_tableHeaders",
  "Sulphur_Print":"Sulphur_Print_tableHeaders",
  "Cleanness":"Cleanness_tableHeaders",
  "Resistivity":"Resistivity_tableHeaders",
  "Microstructure":"Microstructure_tableHeaders",
});

const data = reactive({
  tableHeaders: [
    {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align: "center"},
    {
      title: "Remark Code", key: "code", sortable: true
    },
    {
      title: "Remark Text", key: "desc", sortable: true
    },
    {
      title: "Created At", key: "created_at", sortable: true, value: (row) => formatDate(row.created_at)
    }
  ],

  editorNotesTableHeaders: [
    {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align: "center"},
    {
      title: "Text", key: "text", sortable: false
    },
    {
      title: "Created At", key: "created_at", sortable: true, value: (row) => formatDate(row.created_at)
    }
  ],

  specTextTableHeaders: [
    {title: "Action", key: "action", minWidth: 130, fixed: true, sortable: false, align: "center"},
    {
      title: "Type", key: "spec_text_type", sortable: false
    },
    {
      title: "Text", key: "text", sortable: false
    },
    {
      title: "Created At", key: "created_at", sortable: true, value: (row) => formatDate(row.created_at)
    }
  ],

  panel: [0, 1, 2, 3, 4, 5],
  inspectorOptions: [],
  childrenSpecOptions: [],
  srsmSpecOptions: [],
  queryParams: {
    id: commonStore.spec.id,
  },
  spec: commonStore.spec,
  form: {
    id: undefined,
    mill_code: undefined,
    mill_id: undefined,
    spec_code: undefined,
    short_name: undefined,
    full_name: undefined,
    summary_name: undefined,
    cost_code: undefined,
    inspector: undefined,
    end_use: undefined,
    test_freq: undefined,
    spec_units: undefined,
    eid_req: undefined,
    bmqc_name: undefined,
    premise_name: undefined,
    shelton_code: undefined,
    quality_group: undefined,
    quality_ind: undefined,
    alt_spec_code: undefined,
    man_chk_remark: undefined,
    cert_units: undefined,
    bend_test_dia: undefined,
    equiv_spec_1: undefined,
    hsm_qual_code: undefined,

    msm_qual_code: undefined,
    special_qty_cls: undefined,
    fecc_qual_category: undefined,
    // version: undefined,
    version_status: undefined,
    release_date: undefined,
    archive_date: undefined,
    children_specs: undefined,
    stock_test_flag: undefined,
    test_type: undefined,
    test_subtype: undefined,
    tolerance_id: undefined,
    tolerance_code: undefined,
    // srsm_spec_code: undefined,
    specification_text: undefined,
    editors_notes: undefined,
    type: undefined,
    standard: undefined,

    thick_from: undefined,
    thick_to: undefined,
    alt_spec_code: undefined,
    srsm_spec_code: undefined,
    test_freq: undefined,
    quality_code: undefined,
    supply: undefined,
    stock_test_flag: undefined,
    rail_status: undefined,
    deox: undefined,
    suspended: undefined,

  },
  rules: {
    spec_code: [
      value => {
        if (currentMill.value !== "TBM") {
          if (!value) {
            return "Spec Code is required";
          }
          return true;
        }
        if (validateSpecCode(value)) return true
        return 'Spec Code must start with one of F, S, C, or D and must not exceed 5 characters.'
      }
    ],
    mill_code: [
      value => {
        if (value) return true
        return 'Short Name is required.'
      }
    ],
    short_name: [
      value => {
        if (value) return true
        return 'Short Name is required.'
      }
    ],
    full_name: [
      value => {
        if (value) return true
        return 'Full Name is required.'
      }
    ],
    summary_name: [
      value => {
        if (value) return true
        return 'Summary Name is required.'
      }
    ],
  },
  test_table_list:{},
  
});

const {
  queryParams,
  spec,
  form,
  rules,
  panel,
  inspectorOptions,
  childrenSpecOptions,
  srsmSpecOptions,
  tableHeaders,
  editorNotesTableHeaders,
  specTextTableHeaders,
  test_table_list
  
} = toRefs(data);
const tableList = ref([])
const editorNotesTableList = ref([])
const specTextTableList = ref([])

const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleEditorNotesEdit = (data) => {
  proxy.$refs["editorNotesEditFormRef"].handleShow(data);
}

const handleSpecTextEdit = (data) => {
  proxy.$refs["specTextEditFormRef"].handleShow(data);
}

const handleSave = async () => {

  const {valid} = await proxy.$refs["searchForm"].validate();
  if (!valid) {
    return;
  }
  const params = toRaw(form.value);
  if (params.id) {
    
    if (params.inspector && params.inspector.length > 0){
      let inspector = Object.values(params.inspector).reduce(function (pre, cur, index) {
        if (Number.isFinite(cur) && !isNaN(cur)) {
          return [...pre, cur]
        }
        return [...pre, cur.id]
      }, [])
      params.inspector = inspector
    }
    
    if (params.children_specs && params.children_specs.length > 0){
      let children_spec = Object.values(params.children_specs).reduce(function (pre, cur, index) {
        if (Number.isFinite(cur) && !isNaN(cur)) {
          return [...pre, cur]
        }
        return [...pre, cur.id]
      }, [])

      params.children_specs = children_spec
    }
   
  }
  loading.value = true;
  API.save(params).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  }).catch((err) => {
    console.log(err.response.data.detail);
    if (err.response && err.response.status === 400) {
      toast.error(err.response.data.detail, { autoClose: 60000 })
    } else {
      toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 })
    }
  }).finally(() => {
    loading.value = false;
  });

}

const handleView = (path) => {
  router.push({path});
}

const handleReset = () => {
  proxy.$refs["searchForm"].reset();
}

const handleSearch = () => {

  loading.value = true;
  getDetailById(queryParams.value.id)
  getinspectorSelect()
  getSrsmSpecSelect(queryParams.value.id)
  getAllDate(queryParams.value.id)
  getEditorNotes(queryParams.value.id)
  getSpecText(queryParams.value.id)

}

const handleSpecChange = (spec, key) => {
  form.value[`${key}`] = spec.id;
}

const getDetailById = (id) => {
  form.value.id = id;
  API.get(id).then(res => {
    const {status, data} = res
    if (status === 200) {
      save.value = false;
      loading.value = false;
      let specTitle = data.spec_code;
      if (data?.version) {
        specTitle = `${data.spec_code}-${data?.version || ''}-${data?.version_status || ''}`;
      }
      if (data?.mill) {
        data.mill_code = data.mill.code
      }
      if (data?.tolerance) {
        data.tolerance_code = data.tolerance.code
      }
      if (data?.children_specs) {
        data.children_specs = data.children_specs.map(item => ({
          ...item,
          desc: `${item.spec_code}-${item.full_name}`
        }))
      }
      if (data?.inspector) {
        data.inspector = data.inspector.map(item => ({
          ...item,
          desc: `${item.code}-${item.name}`
        }))
      }

      if (data?.flex_form_data) {

        test_table_list.value = data.flex_form_data

        const lastValue = panel.value[panel.value.length - 1];
        let index= 1
        Object.keys(data?.flex_form_data).forEach(key => {
          panel.value.push(lastValue + index);
          index ++;
        });
      }

      data.suspended = data.suspended === true ? "Y" : "N"
      
      form.value = {...data};
      spec.value = {...data, specTitle};
      commonStore.setSpec({...data, specTitle});
      queryParams.value.id = data.id;

    } else {
      toast.error("Spec Detail Info Error!", { autoClose: 60000 })
    }
  });

}

const getinspectorSelect = () => {
  return specApi.getInspectorSelect()
      .then((res) => {
        const {status, data} = res
        if (status === 200) {
          inspectorOptions.value = (data.options || []).map(item => ({
            ...item,
            desc: `${item.code}-${item.name}`
          }))
        } else {
          inspectorOptions.value = [];
        }
      })
}

// const getChildrenSpecSelect = () => {

//   let params = {}
//   if (route.query.id) {
//     params["id"] = route.query.id
//   }
//   return API.getChildrenSpec(params)
//       .then((res) => {

//         const {status, data} = res
//         console.log(data);
//         if (status === 200) {
//           childrenSpecOptions.value = (data.options || []).map(item => ({
//             ...item,
//             desc: item.name ? `${item.code}(${item.name})` : item.code
//           }))
//         } else {
//           childrenSpecOptions.value = [];
//         }
//       })
// }

const getSrsmSpecSelect = (id) => {

  let params = {}

  params["id"] = id
  return API.getSrsmSpecCode(params)
      .then((res) => {

        const {status, data} = res
        console.log(data);
        if (status === 200) {
          srsmSpecOptions.value = (data.options || []).map(item => ({
            ...item,
            desc: `${item.code}-${item.name}`
          }))
        } else {
          srsmSpecOptions.value = [];
        }
      })
}

const updateVersionData = () => {
  loading.value = true;
  specApi.updateVersion(route.query.id).then((res) => {
    const {status, data} = res
    if (status === 200) {
      save.value = false;
      loading.value = false;
      form.value = data;
    }
  })
}

const archiveVersionData = () => {
  loading.value = true;
  specApi.archive_spec_version(route.query.id).then((res) => {
    const {status, data} = res
    if (status === 200) {
      save.value = false;
      loading.value = false;
      getDetailById(route.query.id)
    }
  })

}
// 显示弹窗
const showDialog = () => {
  isDialogVisible.value = true;
};const updateSupensedData = () => {
  loading.value = true;
  API.updateSuspended(route.query.id).then((res) => {
    const {status, data} = res
    if (status === 200){
      save.value = false;
      loading.value = false;
      isDialogVisible.value = false;
      getDetailById(route.query.id)
    }
  })
}

const handleItemChange = (item, key) => {

  form.value[`${key}`] = item.id;
  console.log(form.value[`${key}`])
}

const getAllDate = (id) => {
  let current_id = id ? id : route.query.id
  if (current_id) {
    API.commonGetRequest(`/remark/spec_remark/get_remark/${current_id}`).then(reponse => {

      tableList.value = reponse.data
      // console.log(reponse.data);
    })
  }

}

const getEditorNotes = (id) => {
  let current_id = id ? id : route.query.id
  if (current_id) {
    API.commonGetRequest(`/remark/spec_remark/get_editor_notes/${current_id}`).then(reponse => {

      editorNotesTableList.value = reponse.data
      // console.log(reponse.data);
    })
  }

}

const getSpecText = (id) => {
  let current_id = id ? id : route.query.id
  if (current_id) {
    API.commonGetRequest(`/remark/spec_remark/get_spec_text/${current_id}`).then(reponse => {

      specTextTableList.value = reponse.data
      // console.log(reponse.data);
    })
  }

}


const handleDelete = (isActive, row) => {
  isActive.value = false;
  if (!route.query.id || !row.id) {
    toast.error("Delete Fail: spec or remark is empty!", { autoClose: 60000 })
    return;
  }

  let pyloads = {"spec_id": Number(route.query.id), "remark_id": row.id}
  API.commonDeleteRequest("/remark/spec_remark/delete", pyloads).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getAllDate();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
  });
}


const handleDeleteEditorNotes = (isActive, row) => {
  isActive.value = false;
  if (!route.query.id || !row.id) {
    toast.error("Delete Fail: editor notes is empty!", { autoClose: 60000 })
    return;
  }

  API.deleteRequest(`/remark/spec_remark/delete_editor_notes/${row.id}`).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getEditorNotes();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
  });
}


const handleDeleteSpecText = (isActive, row) => {
  isActive.value = false;
  if (!route.query.id || !row.id) {
    toast.error("Delete Fail: Specification Text is empty!", { autoClose: 60000 })
    return;
  }

  API.deleteRequest(`/remark/spec_remark/delete_spec_text/${row.id}`).then(() => {
    toast.success("Delete Success", {
      position: "bottom-center"
    });
    getSpecText();
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
  });
}

const handleSpecDetail = (name) => {
  router.push({
    name: name,
    query: {
      spec_id: form.value.id,
      spec_code: `${form.value.spec_code}-${form.value.version}-${form.value.version_status}`
    }
  });
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  save.value = false;
  getDetailById(route.query.id)
  getSrsmSpecSelect(route.query.id)
  getAllDate(route.query.id)
  getEditorNotes(route.query.id)
  getSpecText(route.query.id)
}

getinspectorSelect()
// getChildrenSpecSelect()

</script>
<style lang="scss" scoped>
.detail-content {
  .specsave {
    position: relative;
    background-color: #ffffff;
    border-radius: 12px;

    &-action {
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 1;
    }
  }
}
</style>
