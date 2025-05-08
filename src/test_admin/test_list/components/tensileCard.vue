<template>
    <v-form ref="tensileForm">
      <div class="panel border mt-4">
        <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.spec_requirements') }}</div>
        <v-row align="center">
          <v-col cols="3">
            <v-text-field type="number" v-model="form.check_digit_1_1" :readonly="!form.id" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_0')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.tested_thickness"
            :label="$t('test_list.detail.measured_thickness')" persistent-placeholder bg-color="white" clearable :disabled="true"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.tested_width"
            :label="$t('test_list.detail.measured_width')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.tested_diameter"
            :label="$t('test_list.detail.measured_diameter')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>


          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.yield_tt0_5"
            :label="$t('test_list.detail.yield_rt')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.yield_high"
            :label="$t('test_list.detail.yield_high')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.yield_rp0_2"
            :label="$t('test_list.detail.yield_rp')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.yield_low"
            :label="$t('test_list.detail.yield_low')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.yield_"
            :label="$t('test_list.detail.yield')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.yield_, 'yield')"
                          :hint="getValueRangeHint('yield_', 'yield')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.value_mpa"
            :label="$t('test_list.detail.uts_mpa')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.value_mpa, 'uts')"
                          :hint="getValueRangeHint('value_mpa', 'uts')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.elongation_code"
            :label="$t('test_list.detail.elongation_code')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :rules="rules.elongationCode"
                          :class="getValueEqualClass(form.elongation_code, 'elongation_code')"
                          :hint="getValueEqualHint('elongation_code', 'elongation_code')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="number" v-model="form.elongation" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.elongation, 'elongation')"
                          :hint="getValueRangeHint('elongation', 'elongation')"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.elongation_a565" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a565')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.elongation_a565, 'elongation')"
                          :hint="getValueRangeHint('elongation_a565', 'elongation')"
                          persistent-hint
                          ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.elongation_a200" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a200')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.elongation_a50" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a50')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.elongation_8" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_8_in')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.elongation_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_2_in')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.elongation_a80" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a80')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          
          <v-col cols="3">
            <v-text-field v-model="form.testing_machine" density="comfortable" variant="underlined" :label="$t('test_list.detail.testing_machine')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>

<!--          <v-col cols="3">-->
<!--            <v-text-field v-model="form.susp" density="comfortable" variant="underlined" label="Test Susp" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>-->
<!--          </v-col>-->

          <v-col cols="3">
            <v-text-field v-model="form.reduction_of_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.reduction_of_area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.cross_sectional_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.cross_seational_area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.area" density="comfortable" variant="underlined" :label="$t('test_list.detail.area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.test_standard" density="comfortable" variant="underlined" :label="$t('test_list.detail.test_standard')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueEqualClass(form.test_standard, 'test_standard')"
                          :hint="getValueEqualHint('test_standard', 'test_standard')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.tester_initials" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
         </v-col>
         
        </v-row>
      </div>
      <div class="panel border mt-4">
        <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.retest_1') }}</div>
        <v-row align="center">

          <v-col cols="3">
            <v-text-field type="number" v-model="form.check_digit_2_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_1')" persistent-placeholder bg-color="white" clearable :readonly="!form.id" :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_tested_thickness" density="comfortable" variant="underlined" :label="$t('test_list.detail.measured_thickness')" persistent-placeholder bg-color="white" clearable :disabled="true"
                          :class="getValueRangeClass(form.r1_tested_thickness, 'thickness')"
                          :hint="getValueRangeHint('r1_tested_thickness', 'thickness')"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_tested_width" density="comfortable" variant="underlined" :label="$t('test_list.detail.measured_width')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_tested_diameter" density="comfortable" variant="underlined" :label="$t('test_list.detail.measured_diameter')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_yield_tt0_5" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_rt')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_yield_high" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_high')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_yield_rp0_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_rp')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_yield_low" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_low')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.r1_yield_"
            :label="$t('test_list.detail.yield')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r1_yield_, 'yield')"
                          :hint="getValueRangeHint('r1_yield_', 'yield')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_value_mpa" density="comfortable" variant="underlined" :label="$t('test_list.detail.uts_mpa')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r1_value_mpa, 'uts')"
                          :hint="getValueRangeHint('r1_value_mpa', 'uts')"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.r1_elongation_code" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_code')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueEqualClass(form.r1_elongation_code, 'elongation_code')"
                          :hint="getValueEqualHint('r1_elongation_code', 'elongation_code')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_elongation" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r1_elongation, 'elongation')"
                          :hint="getValueRangeHint('r1_elongation', 'elongation')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_elongation_a565" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a565')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r1_elongation_a565, 'elongation')"
                          :hint="getValueRangeHint('r1_elongation_a565', 'elongation')"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_elongation_a200" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a200')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_elongation_a50" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a50')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_elongation_8" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_8_in')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_elongation_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_2_in')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r1_elongation_a80" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a80')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.r1_testing_machine" density="comfortable" variant="underlined" :label="$t('test_list.detail.testing_machine')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>

<!--          <v-col cols="3">-->
<!--            <v-text-field v-model="form.r1_susp" density="comfortable" variant="underlined" label="Test Susp" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>-->
<!--          </v-col>-->

          <v-col cols="3">
            <v-text-field v-model="form.r1_reduction_of_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.reduction_of_area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.r1_cross_sectional_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.cross_seational_area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.r1_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>  

          <v-col cols="3">
          <v-text-field v-model="form.r1_tester" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
        </v-col>

        </v-row>
      </div>
      <div class="panel border mt-4">
        <div class="text-subtitle-2 font-weight-regular	pt-4 pb-4">{{ $t('test_list.detail.retest_2') }}</div>
        <v-row align="center">

                    
          <v-col cols="3">
            <v-text-field type="number" v-model="form.check_digit_3_3" density="comfortable" variant="underlined" :label="$t('test_list.detail.check_digit_2')" persistent-placeholder bg-color="white" clearable :readonly="!form.id" :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_tested_thickness" density="comfortable" variant="underlined" :label="$t('test_list.detail.measured_thickness')" persistent-placeholder bg-color="white" clearable :disabled="true"
                          :class="getValueRangeClass(form.r2_tested_thickness, 'thickness')"
                          :hint="getValueRangeHint('r2_tested_thickness', 'thickness')"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_tested_width" density="comfortable" variant="underlined" :label="$t('test_list.detail.measured_width')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_tested_diameter" density="comfortable" variant="underlined" :label="$t('test_list.detail.measured_diameter')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_yield_tt0_5" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_rt')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_yield_high" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_high')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_yield_rp0_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_rp')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_yield_low" density="comfortable" variant="underlined" :label="$t('test_list.detail.yield_low')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">  
            <v-text-field density="comfortable" variant="underlined" v-model="form.r2_yield_"
            :label="$t('test_list.detail.yield')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r2_yield_, 'yield')"
                          :hint="getValueRangeHint('r2_yield_', 'yield')"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_value_mpa" density="comfortable" variant="underlined" :label="$t('test_list.detail.uts_mpa')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r2_value_mpa, 'uts')"
                          :hint="getValueRangeHint('r2_value_mpa', 'uts')"
                          persistent-hint></v-text-field>
          </v-col>
          
          <v-col cols="3">
            <v-text-field v-model="form.r2_elongation_code" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_code')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueEqualClass(form.r2_elongation_code, 'elongation_code')"
                          :hint="getValueEqualHint('r2_elongation_code', 'elongation_code')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field density="comfortable" variant="underlined" v-model="form.r2_elongation"
            :label="$t('test_list.detail.elongation')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r2_elongation, 'elongation')"
                          :hint="getValueRangeHint('r2_elongation', 'elongation')"
                          persistent-hint></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_elongation_a565" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a565')" persistent-placeholder bg-color="white" clearable :disabled="disabled"
                          :class="getValueRangeClass(form.r2_elongation_a565, 'elongation')"
                          :hint="getValueRangeHint('r2_elongation_a565', 'elongation')"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_elongation_a200" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a200')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_elongation_a50" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a50')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_elongation_8" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_8_in')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_elongation_2" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_2_in')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field type="number" v-model="form.r2_elongation_a80" density="comfortable" variant="underlined" :label="$t('test_list.detail.elongation_a80')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.r2_testing_machine" density="comfortable" variant="underlined" :label="$t('test_list.detail.testing_machine')" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field  v-model="form.r2_test_ref" density="comfortable" variant="underlined" :label="$t('test_list.detail.test_ref_rt2')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

<!--          <v-col cols="3">-->
<!--            <v-text-field v-model="form.r2_susp" density="comfortable" variant="underlined" label="Test Susp" persistent-placeholder bg-color="white" clearable :disabled="true"></v-text-field>-->
<!--          </v-col>-->

          <v-col cols="3">
            <v-text-field v-model="form.r2_reduction_of_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.reduction_of_area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.r2_cross_sectional_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.cross_seational_area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.r2_area" density="comfortable" variant="underlined" :label="$t('test_list.detail.area')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="form.r2_tester" density="comfortable" variant="underlined" :label="$t('test_list.detail.tested_by')" persistent-placeholder bg-color="white" clearable :disabled="disabled"></v-text-field>
          </v-col>

        </v-row>
      </div>
    </v-form>
</template>
<script setup>
import {computed, getCurrentInstance, nextTick, reactive, toRaw, toRefs, watch, ref} from "vue";
import { toast } from "vue3-toastify";
import API from "@/test_admin/test_list/api";
const {proxy} = getCurrentInstance();
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  spec_id: {
    type: Number,
    required: true
  },
  test_sample_id: {
    type: Number,
    required: true
  }
})

// 创建本地数据副本
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const emit = defineEmits(['update:modelValue', 'update:validationStatus'])

const data = reactive({
  rules: {
    check_digit_1_1: [
      value => {
        if (!form.value.id) return true;
        if (form.value.check_digit_1 !== value) return "Check Digit 0 is incorrect"
        return true;
      }
    ],
    check_digit_2_2: [
      value => {
        if (!form.value.id) return true;
        if (form.value.check_digit_2 !== value) return "Check Digit 1 is incorrect"
        return true;
      }
    ],
    check_digit_3_3: [
      value => {
        if (!form.value.id) return true;
        if (form.value.check_digit_3 !== value) return "Check Digit 2 is incorrect"
        return true;
      }
    ],
    elongationCode: [
      value => {
        if (!value) return "Elongation Code is required";
      },
      value => {
        if (!value) return true;
        return ['1', '2', '3', '4'].includes(value) || 'only 1-4';
      }
    ]
  }
});

const testRequire = ref({})

const { rules } = toRefs(data);

const handleClose = () => {
  nextTick(() => {
    proxy.$refs["tensileForm"].resetValidation();
  })
}

const getData = async () => {
  const {valid} = await proxy.$refs["tensileForm"].validate();
  if (!valid) {
    return;
  }
  return toRaw(form.value);
}



defineExpose({
  getData,
});

const loadTestSpecRequire = async () => {
  if (!props.spec_id || !props.test_sample_id) {
    return;
  }

  try {
    // 调用API加载数据
    const response = await API.getSpTensileSpecRequire({
      spec_id: props.spec_id,
      test_sample_id: props.test_sample_id
    });
    testRequire.value = response.data;
  } catch (error) {
    testRequire.value = {}
    toast.error(error.response.data?.detail || "load tensile spec require failed" , {
          autoClose: 60000
    });
  }
};

watch(
  [() => props.spec_id, () => props.test_sample_id],
  ([newSpecId, newTestSampleId], [oldSpecId, oldTestSampleId]) => {
    console.log("watch",newSpecId, newTestSampleId, oldSpecId, oldTestSampleId)
    if (newSpecId !== oldSpecId || newTestSampleId !== oldTestSampleId) {
      loadTestSpecRequire();
    }
  },
  { immediate: true } // 组件创建时立即执行一次
);

const isValueInRange = (value, type) => {
  if (!value || !testRequire.value) return true;
  const numValue = parseFloat(value);
  const minValue = testRequire.value[`${type}_min`] || 0;
  const maxValue = testRequire.value[`${type}_max`];
  
  // 如果max为null，则只判断最小值
  if (maxValue === null || maxValue === 0 || maxValue === undefined) {
    return Number(numValue) >= Number(minValue);
  }
  
  return Number(numValue) >= Number(minValue) && Number(numValue) <= Number(maxValue);
}

const getValueRangeClass = (testVal, specAttr) => {
  if (!testVal || !testRequire.value || !testRequire.value[`${specAttr}_min`] ) return 'text-normal';
  return isValueInRange(testVal, specAttr) ? 'text-success' : 'text-error';
}

const getValueRangeHint = (testAttr, specAttr) => {
  if (!testRequire.value || testRequire.value[`${specAttr}_min`] === null || testRequire.value[`${specAttr}_min`] === undefined) return '';
  const value = form.value[testAttr];
  if (!value) return '';
  if (isValueInRange(value, specAttr)) return '';
  
  const minValue = testRequire.value[`${specAttr}_min`];
  const maxValue = testRequire.value[`${specAttr}_max`];
  
  if (maxValue === null || maxValue === 0 || maxValue === undefined) {
    return `range: ≥${minValue}`;
  }
  
  return `range: ${minValue}-${maxValue}`;
}

const getValueEqualClass = (testVal, specAttr) => {
  if (!testVal || testRequire.value[`${specAttr}`] === null || testRequire.value[`${specAttr}`] === undefined) return 'text-normal';
  return String(testVal) === String(testRequire.value[`${specAttr}`]) ? 'text-success' : 'text-error';
}


const getValueEqualHint = (testAttr, specAttr) => {
  if (!testRequire.value || testRequire.value[`${specAttr}`] === null || testRequire.value[`${specAttr}`] === undefined) return '';

  const value = form.value[testAttr];
  if (!value) return '';
  if ( String(value) === String(testRequire.value[`${specAttr}`])) {
    return '';
  }
  return `= ${testRequire.value[`${specAttr}`]}`;
}

const fieldValidationStatus = computed(() => ({
  tested_thickness_valid: getValueRangeClass(form.value.tested_thickness, 'thickness') != 'text-error',
  yield_valid: getValueRangeClass(form.value.yield_, 'yield') != 'text-error',
  uts_valid: getValueRangeClass(form.value.value_mpa, 'uts') != 'text-error',
  elongation_code_valid: getValueEqualClass(form.value.elongation_code, 'elongation_code') != 'text-error',
  elongation_valid: getValueRangeClass(form.value.elongation, 'elongation') != 'text-error',
  elongation_a565_valid: getValueRangeClass(form.value.elongation_a565, 'elongation') != 'text-error',
  test_standard_valid: getValueEqualClass(form.value.test_standard, 'test_standard') != 'text-error',
  
  r1_elongation_valid: getValueRangeClass(form.value.r1_elongation, 'elongation') != 'text-error',
  r1_elongation_a565_valid: getValueRangeClass(form.value.r1_elongation_a565, 'elongation') != 'text-error',
  r1_yield_valid: getValueRangeClass(form.value.r1_yield_, 'yield') != 'text-error',
  r1_uts_valid: getValueRangeClass(form.value.r1_value_mpa, 'uts') != 'text-error',
  r2_elongation_code_valid: getValueEqualClass(form.value.r2_elongation_code, 'elongation_code') != 'text-error',
  r2_elongation_valid: getValueRangeClass(form.value.r2_elongation, 'elongation') != 'text-error',
  r2_elongation_a565_valid: getValueRangeClass(form.value.r2_elongation_a565, 'elongation') != 'text-error',
  r2_yield_valid: getValueRangeClass(form.value.r2_yield_, 'yield') != 'text-error',
  r2_uts_valid: getValueRangeClass(form.value.r2_value_mpa, 'uts') != 'text-error',
}));

watch(fieldValidationStatus, (newVal) => {
  const allPass = Object.values(newVal).every(val => val === true);
  const pass_status = allPass ? 'P' : 'F';
  emit('update:validationStatus', pass_status);
})

</script>
<style scoped>
.text-success :deep(.v-field__input){
  color: green !important;
}
.text-error :deep(.v-field__input){
  color: red !important;
  font-weight: bold;
}

.text-normal :deep(.v-field__input){
  color: #333 !important;
}
</style>
