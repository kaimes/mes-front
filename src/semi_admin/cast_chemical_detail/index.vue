<template>
  <v-container class="detail-content" fluid>
    <v-form ref="searchForm">
      <div class="panel mb-8">
        <div class="panel-action">
          <template v-if="!!form.authorize_date">
          <v-col cols="5">
            <div class="d-flex align-center ga-2">
              <v-chip size="small" color="green">
                Authorize Date: {{ formatDate(form.authorize_date) }}
              </v-chip>
            </div>
          </v-col>
        </template>
        <template v-else>
          <v-spacer />
        </template>
        <v-btn
            v-if="form.id"
            color="primary"
            variant="flat"
            @click="authorizeDate()"
            class="text-none mr-8"
            :loading="loading"
            v-permission="`Authorize`"
          >
            {{$t('cast_chemical_detail.authorize')}}
          </v-btn>
          <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? $t('cast_chemical_detail.save') : $t('cast_chemical_detail.view') }}</span>
          <v-switch v-model="save" density="compact" hide-details inset></v-switch>
          <div class="ml-14">
            <v-btn v-if="!form.authorize_date" :disabled="!save" :loading="loading" variant="flat" color="primary" @click="handleSave">
              {{ form.id ? $t('cast_chemical_detail.update') : $t('cast_chemical_detail.save') }}
            </v-btn>
            <v-btn v-else :disabled="form.authorize_date" :loading="loading" variant="flat" color="primary" @click="handleSave">
              {{ form.id ? $t('cast_chemical_detail.update') : $t('cast_chemical_detail.save') }}
            </v-btn>
          </div>
          <div class="ml-14">

          </div>
        </div>
      </div>
      <div class="panel border rounded mb-4">
        <v-row align="center">
          <v-col cols="3">
            <v-text-field v-model="form.cast_code" color="#333" :label="$t('cast_chemical_detail.cast_code')" :disabled="!save" density="default"
              variant="underlined" placeholder="Cast Code" bg-color="white" clearable class="mt-4">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.bos_cast_code" color="#333" :label="$t('cast_chemical_detail.bos_cast_code')" :disabled="!save" density="default"
              variant="underlined" placeholder="Bos Cast Code" bg-color="white" clearable class="mt-4">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="form.long_cast_code" color="#333" :label="$t('cast_chemical_detail.long_cast_code')" :disabled="!save" density="default"
              variant="underlined" placeholder="Long Cast Code" bg-color="white" clearable class="mt-4">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <QualityCode v-model="form.quality_id" :label="$t('cast_chemical_detail.quality_code')" :disabled="!save" :quality="form.quality"/>
          </v-col>

        </v-row>
      </div>

      <v-card :title="$t('cast_chemical_detail.table.chemical_element')" class="pl-4 pr-4" elevation="0" variant="outlined">
        <template v-slot:append>
          <div class="d-flex align-center justify-end">
            <div class="color-desc">{{ $t('cast_chemical_detail.table.color_legend') }} </div>
            <div class="color-groups">
              <div class="color-groups-item">
                <div class="color-content green"></div>
                <span>{{$t('cast_chemical_detail.table.in_range')}}</span>
              </div>
              <div class="color-groups-item">
                <div class="color-content red"></div>
                <span>{{$t('cast_chemical_detail.table.out_of_range')}}</span>
              </div>
              <div class="color-groups-item">
                <div class="color-content black"></div>
                <span>{{$t('cast_chemical_detail.table.not_required')}}</span>
              </div>
            </div>
          </div>
        </template>
        <v-row align="center">
          <v-col cols="2">
            <v-radio-group :label="$t('cast_chemical_detail.table.compare_by')" v-model="quality_or_spec" density="comfortable" inline>
              <v-radio :label="$t('cast_chemical_detail.table.quality')" value="quality"></v-radio>
              <v-radio :label="$t('cast_chemical_detail.table.spec')" value="spec"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="3" v-show="quality_or_spec === 'quality'">
            <CastQualityCode v-model="spec_choose.quality_id" :cast="form.quality"  :hide-details="false"></CastQualityCode>
          </v-col>
  
          <v-col cols="3" v-show="quality_or_spec === 'spec'">
            <DictCode
              v-model="spec_choose.spec_type"
              code="main_element_type"
              :label="$t('cast_chemical_detail.table.type')"
              variant="underlined"
              
              :hide-details="false"
              :clearable="true">
            </DictCode>
          </v-col>
          <v-col cols="2" v-show="quality_or_spec === 'spec'">
            <OrderCode
                v-model="order_id"
                variant="underlined"
                :label="$t('cast_chemical_detail.table.order_number')"
                :hide-details="false"
            ></OrderCode>
          </v-col>
          <v-col cols="2" v-show="quality_or_spec === 'spec'">
            <OrderItemCode
                v-model="order_item_id"
                variant="underlined"
                :label="$t('cast_chemical_detail.table.order_item_number')"
                :hide-details="false"
                :disabled="!order_id"
                :order_id="order_id"
                @change="handleOrderItemChange($event)"
            ></OrderItemCode>
          </v-col>
          <v-col cols="2" v-show="quality_or_spec === 'spec'">
            <SpecCode v-model="spec_choose.spec_code"  @change="handleChooseSpec" :hide-details="false" :spec="spec_choose.spec"></SpecCode>
          </v-col>
          <!-- <v-col cols="2" v-show="quality_or_spec === 'spec'">
            <RollingCode
                v-model="rolling_id"
                variant="underlined"
                label="Rolling Code"
                :hide-details="false"
            ></RollingCode>
          </v-col>
          <v-col cols="2" v-show="quality_or_spec === 'spec'">
            <OrderGroupRolling
                v-model="order_group_id"
                variant="underlined"
                label="Order Group Code"
                :hide-details="false"
                :disabled="!rolling_id"
                :rolling_id="rolling_id"
                @change="handleOrderGroupChange($event)"
            ></OrderGroupRolling>
          </v-col> -->
          <v-col cols="3" v-show="quality_or_spec === 'spec'">
            <ProductTypeCode
              v-model="product_type_id" 
              variant="underlined" 
              :hide-details="false" 
              @change="handleProductTypeChange($event)"
            />
          </v-col>
          <!-- <v-col cols="2" v-show="quality_or_spec === 'spec'">
            <v-text-field v-model="dim3" label="Kg/m"
                          density="default" variant="underlined" placeholder="Kg/m"
                          :hide-details="false"
                          bg-color="white" clearable
                          persistent-hint
            ></v-text-field>
          </v-col> -->
          <v-col cols="2" v-show="quality_or_spec === 'spec'">
            <v-text-field v-model="spec_choose.spec_thickness" :label="$t('cast_chemical_detail.table.thickness')"
                          density="default" variant="underlined" placeholder="Thickness"
                          :rules="rules.thickness"
                          :hide-details="false"
                          bg-color="white" clearable
                          :hint="getThicknessHint()"
                          persistent-hint
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-btn color="#e3e3e3" class="text-none mr-4" variant="flat" @click="resetCompSpec" >{{$t('global.reset')}}</v-btn>
            <v-btn color="primary" variant="flat" @click="compSpec"  class="text-none my-1" :loading="loading" v-permission="`Compare`">{{$t('cast_chemical_detail.table.compare')}}</v-btn>
          </v-col>
        </v-row>

        <v-divider class="mt-2 mb-2"></v-divider>

        <v-row align="center" class="pl-2 pr-2">
          <v-col cols="1">
            <v-text-field v-model="form.ch_c" :class="getTextColor(form.ch_c, 'c')" :label="$t('cast_chemical_detail.table.c')" :disabled="!save"
                          density="default" variant="underlined" :hint="getTextHint(form.ch_c, 'c')" persistent-hint placeholder="C" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_c" color="#333" :label="$t('cast_chemical_detail.table.c_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_si" :label="$t('cast_chemical_detail.table.si')" :class="getTextColor(form.ch_si, 'si')"
                          :disabled="!save" density="default" :hint="getTextHint(form.ch_si, 'si')" persistent-hint variant="underlined" placeholder="Si"
                          bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_si" color="#333" :label="$t('cast_chemical_detail.table.si_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_mn" :class="getTextColor(form.ch_mn, 'mn')" :label="$t('cast_chemical_detail.table.mn')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_mn, 'mn')" persistent-hint
                          variant="underlined" placeholder="Mn" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_mn" color="#333" :label="$t('cast_chemical_detail.table.mn_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_p" :class="getTextColor(form.ch_p, 'p')" :label="$t('cast_chemical_detail.table.p')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_p, 'p')" persistent-hint
                          variant="underlined" placeholder="P" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_p" color="#333" :label="$t('cast_chemical_detail.table.p_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_s" :class="getTextColor(form.ch_s,'s')" :label="$t('cast_chemical_detail.table.s')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_s, 's')" persistent-hint
                          variant="underlined" placeholder="S" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_s" color="#333" :label="$t('cast_chemical_detail.table.s_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.ch_cr" :class="getTextColor(form.ch_cr,'cr')" :label="$t('cast_chemical_detail.table.cr')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_cr, 'cr')" persistent-hint
                          variant="underlined" placeholder="Cr" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_cr" color="#333" :label="$t('cast_chemical_detail.table.cr_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_mo" :class="getTextColor(form.ch_mo,'mo')" :label="$t('cast_chemical_detail.table.mo')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_mo, 'mo')" persistent-hint
                          variant="underlined" placeholder="Mo" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_mo" color="#333" :label="$t('cast_chemical_detail.table.mo_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_ni" :class="getTextColor(form.ch_ni, 'ni')" :label="$t('cast_chemical_detail.table.ni')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_ni, 'ni')" persistent-hint
                          variant="underlined" placeholder="Ni" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_ni" color="#333" :label="$t('cast_chemical_detail.table.ni_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_al" :class="getTextColor(form.ch_al, 'al')" :label="$t('cast_chemical_detail.table.al')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_al, 'al')" persistent-hint
                          variant="underlined" placeholder="Al" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_al" color="#333" :label="$t('cast_chemical_detail.table.al_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_b" :class="getTextColor(form.ch_b, 'b')" :label="$t('cast_chemical_detail.table.b')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_b, 'b')" persistent-hint
                          variant="underlined" placeholder="B" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_b" color="#333" :label="$t('cast_chemical_detail.table.b_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_co" :class="getTextColor(form.ch_co, 'co')" :label="$t('cast_chemical_detail.table.co')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_co, 'co')" persistent-hint
                          variant="underlined" placeholder="Co" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_co" color="#333" :label="$t('cast_chemical_detail.table.co_prec_n')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_cu" :class="getTextColor(form.ch_cu, 'cu')" :label="$t('cast_chemical_detail.table.cu')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_cu, 'cu')" persistent-hint
                          variant="underlined" placeholder="Cu" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_cu" color="#333" :label="$t('cast_chemical_detail.table.cu_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_nb" :class="getTextColor(form.ch_nb, 'nb')" :label="$t('cast_chemical_detail.table.nb')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_nb, 'nb')" persistent-hint
                          variant="underlined" placeholder="Nb" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_nb" color="#333" :label="$t('cast_chemical_detail.table.nb_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_sn" :class="getTextColor(form.ch_sn, 'sn')" :label="$t('cast_chemical_detail.table.sn')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_sn, 'sn')" persistent-hint
                          variant="underlined" placeholder="Sn" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_sn" color="#333" :label="$t('cast_chemical_detail.table.sn_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_ti" :class="getTextColor(form.ch_ti, 'ti')" :label="$t('cast_chemical_detail.table.ti')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_ti, 'ti')" persistent-hint
                          variant="underlined" placeholder="Ti" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_ti" color="#333" :label="$t('cast_chemical_detail.table.ti_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_v" :class="getTextColor(form.ch_v, 'v')" :label="$t('cast_chemical_detail.table.v')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_v, 'v')" persistent-hint
                          variant="underlined" placeholder="V" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_v" color="#333" :label="$t('cast_chemical_detail.table.v_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_n" :class="getTextColor(form.ch_n, 'n')" :label="$t('cast_chemical_detail.table.n')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_n, 'n')" persistent-hint
                          variant="underlined" placeholder="N" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_n" color="#333" :label="$t('cast_chemical_detail.table.n_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_ca" :class="getTextColor(form.ch_ca, 'ca')" :label="$t('cast_chemical_detail.table.ca')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_ca, 'ca')" persistent-hint
                          variant="underlined" placeholder="Ca" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_ca" color="#333" :label="$t('cast_chemical_detail.table.ca_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_solal" :class="getTextColor(form.ch_sal, 'solal')" :label="$t('cast_chemical_detail.table.solal')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_sal, 'solal')" persistent-hint
                          variant="underlined" placeholder="Solal" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_sal" color="#333" :label="$t('cast_chemical_detail.table.solal_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_h" :class="getTextColor(form.ch_h !== null ? form.ch_h / 10000: form.ch_h, 'h')" :label="$t('cast_chemical_detail.table.h')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_h !== null ? form.ch_h / 10000: form.ch_h, 'h')" persistent-hint
                          variant="underlined" placeholder="H" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_h" color="#333" :label="$t('cast_chemical_detail.table.h_ppm_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_as" :class="getTextColor(form.ch_as, 'as')" :label="$t('cast_chemical_detail.table.as')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_as, 'as')" persistent-hint
                          variant="underlined" placeholder="As" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_as" color="#333" :label="$t('cast_chemical_detail.table.as_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_bi" :class="getTextColor(form.ch_bi, 'bi')" :label="$t('cast_chemical_detail.table.bi')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_bi, 'bi')" persistent-hint
                          variant="underlined" placeholder="Bi" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_bi" color="#333" :label="$t('cast_chemical_detail.table.bi_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_ce" :class="getTextColor(form.ch_ce, 'ce')" :label="$t('cast_chemical_detail.table.ce')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_ce, 'ce')" persistent-hint
                          variant="underlined" placeholder="Ce" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_ce" color="#333" :label="$t('cast_chemical_detail.table.ce_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_o" :class="getTextColor(form.ch_o !== null ? form.ch_o / 10000: form.ch_o, 'o')" :label="$t('cast_chemical_detail.table.o')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_o !== null ? form.ch_o / 10000: form.ch_o, 'o')" persistent-hint
                          variant="underlined" placeholder="O" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_o" color="#333" :label="$t('cast_chemical_detail.table.o_ppm_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_pb" :class="getTextColor(form.ch_pb, 'pb')" :label="$t('cast_chemical_detail.table.pb')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_pb, 'pb')" persistent-hint
                          variant="underlined" placeholder="Pb" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_pb" color="#333" :label="$t('cast_chemical_detail.table.pb_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_sb" :class="getTextColor(form.ch_sb, 'sb')" :label="$t('cast_chemical_detail.table.sb')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_sb, 'sb')" persistent-hint
                          variant="underlined" placeholder="Sb" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_sb" color="#333" :label="$t('cast_chemical_detail.table.sb_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_w" :class="getTextColor(form.ch_w, 'w')" :label="$t('cast_chemical_detail.table.w')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_w, 'w')" persistent-hint
                          variant="underlined" placeholder="W" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_w" color="#333" :label="$t('cast_chemical_detail.table.w_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_zn" :class="getTextColor(form.ch_zn, 'zn')" :label="$t('cast_chemical_detail.table.zn')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_zn, 'zn')" persistent-hint
                          variant="underlined" placeholder="Zn" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_zn" color="#333" :label="$t('cast_chemical_detail.table.zn_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_zr" :class="getTextColor(form.ch_zr, 'zr')" :label="$t('cast_chemical_detail.table.zr')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_zr, 'zr')" persistent-hint
                          variant="underlined" placeholder="Zr" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_zr" color="#333" :label="$t('cast_chemical_detail.table.zr_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_te" :class="getTextColor(form.ch_te, 'te')" :label="$t('cast_chemical_detail.table.te')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_te, 'te')" persistent-hint
                          variant="underlined" placeholder="Te" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_te" color="#333" :label="$t('cast_chemical_detail.table.te_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_rad" :class="getTextColor(form.ch_rad, 'rad')" :label="$t('cast_chemical_detail.table.rad')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_rad, 'rad')" persistent-hint
                          variant="underlined" placeholder="Rad" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_rad" color="#333" :label="$t('cast_chemical_detail.table.rad_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_insal" :class="getTextColor(form.ch_insal, 'insal')" :label="$t('cast_chemical_detail.table.insal')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_insal, 'insal')" persistent-hint
                          variant="underlined" placeholder="Insal" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_insal" color="#333" :label="$t('cast_chemical_detail.table.insal_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field v-model="form.ch_n2" :class="getTextColor(form.ch_n2, 'n2')" :label="$t('cast_chemical_detail.table.n2')" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_n2, 'n2')" persistent-hint
                          variant="underlined" placeholder="N2" bg-color="white" :clearable="save" >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_n2" color="#333" :label="$t('cast_chemical_detail.table.n2_prec')" disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col>

          <!-- <v-col cols="1">
            <v-text-field v-model="form.ch_solal" :class="getTextColor(form.ch_solal, 'sal')" label="Sal" :disabled="!save" density="default"
                          :hint="getTextHint(form.ch_solal, 'sal')" persistent-hint
                          variant="underlined" placeholder="Sal" bg-color="white" clearable >
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="form.precision_solal" color="#333" label="Sal Prec." disabled :rules="rules.isIntNumber"
                          density="default" variant="underlined" bg-color="white" clearable >
            </v-text-field>
          </v-col> -->
        </v-row>

      </v-card>



      <v-card :title="$t('cast_chemical_detail.table.cast_chemical_list')" class="panel-card pl-4 pr-4" elevation="0" variant="outlined">
        <v-data-table-server
            fixed-header
            show-current-page
            min-height="300"
            items-per-page="10"
            :page="queryParams.page"
            :headers="tableHeaders"
            :items="tableList"
            :items-length="total"
            :loading="loading"
            item-value="id"
            @update:options="handleCastTableChange"
        >

          <template v-slot:item.action="{ item }">
            <!--          <v-btn-->
            <!--              variant="text"-->
            <!--              icon="mdi-pencil"-->
            <!--              @click="handleEdit(item)"-->
            <!--          />-->
            <!--          <v-dialog-->
            <!--              max-width="400"-->
            <!--              persistent-->
            <!--          >-->
            <!--            <template v-slot:activator="{ props: activatorProps }">-->
            <!--              <v-btn-->
            <!--                  variant="text"-->
            <!--                  icon="mdi-delete"-->
            <!--                  v-bind="activatorProps"-->
            <!--              />-->
            <!--            </template>-->
            <!--            <template v-slot:default="{ isActive }">-->
            <!--              <v-card-->
            <!--                  prepend-icon="mdi-help-circle-outline"-->
            <!--                  text="Deletion is irreversible"-->
            <!--                  title="Confirm to delete data?"-->
            <!--              >-->
            <!--                <template v-slot:actions>-->
            <!--                  <v-spacer></v-spacer>-->
            <!--                  <v-btn-->
            <!--                      class="text-none"-->
            <!--                      color="#e3e3e3"-->
            <!--                      variant="flat"-->
            <!--                      @click="isActive.value = false"-->
            <!--                  >-->
            <!--                    Cancel-->
            <!--                  </v-btn>-->
            <!--                  <v-btn-->
            <!--                      class="text-none"-->
            <!--                      color="primary"-->
            <!--                      variant="flat"-->
            <!--                      @click="handleDelete(isActive, item)"-->
            <!--                  >-->
            <!--                    Confirm-->
            <!--                  </v-btn>-->
            <!--                </template>-->
            <!--              </v-card>-->
            <!--            </template>-->
            <!--          </v-dialog>-->
          </template>
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
          </template>
        </v-data-table-server>

      </v-card>

      <v-card :title="$t('cast_chemical_detail.table.cast_spec')+'aa'" class="panel-card pl-4 pr-4" elevation="0" variant="outlined">
        <v-row align="center">
         <v-col cols="3">
          <v-text-field
              v-model="spec_data.searchOptions.q"
              :label="$t('cast_chemical_detail.table.cast_code_bos_cast_code_quality_code')"
              clearable
              @keyup.enter="getAllData()"
              hide-details
          ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              {{$t('global.reset')}}
            </v-btn>
          <v-btn
              @click="getAllData()"
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
          >
            {{$t('global.search')}}
          </v-btn>
          <v-btn
              @click="runEndUse"
              class="text-none my-1"
              color="primary"
              variant="flat"
              :loading="endUseLoading"
          >
            {{$t('cast_chemical_detail.table.run_end_use')}}
          </v-btn>
         </v-col>
        </v-row>
        <v-data-table-server
            fixed-header
            min-height="500"
            :headers="spec_data.tableHeaders"
            :items="spec_data.serverItems"
            :loading="spec_data.loading"
            :items-length="spec_data.total"
            item-value="id"
            @update:options="handleTableChange"
        >
          <template v-slot:item.spec_detail="{ item }">
            {{ item.spec.spec_code }}
          </template>

          <template v-slot:item.cast_code="{ item }">
            {{ item.cast.cast_code }}
          </template>

          <template v-slot:item.product_type_code="{ item }">
            {{ item.product_type.code }}
          </template>

          <template v-slot:loading>
            <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
          </template>
        </v-data-table-server>
      </v-card>
      
      <v-card :title="$t('cast_chemical_detail.table.semi')" class="panel-card pl-4 pr-4" elevation="0" variant="outlined">
        <v-data-table-server
            fixed-header
            min-height="500"
            :headers="semi_data.tableHeaders"
            :items="semi_data.serverItems"
            :loading="semi_data.loading"
            :items-length="semi_data.total"
            item-value="id"
            @update:options="handleSemiTableChange"
        >
          <template v-slot:item.skelp_code="{ item }">
            {{ item.skelp_code }}
          </template>

          <template v-slot:item.cast_code="{ item }">
            {{ item.cast.cast_code }}
          </template>

          <template v-slot:item.semi_type="{ item }">
            {{ item.semi_type }}
          </template>

          <template v-slot:item.quantity="{ item }">
            {{ item.quantity}}
          </template> 

          
           <template v-slot:loading>
            <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
          </template>
        </v-data-table-server>
      </v-card>
    </v-form>
  </v-container>
</template>
<script setup>

import { getCurrentInstance, reactive, ref, toRaw, toRefs, watch, inject, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import API from "./api";
import SpecCode from "@/components/picker/SpecCode.vue";
import specApi from "@/spec_admin/spec/api";
import { formatDate, isValueEmpty, floatToFixed } from '@/util/util';
import DictCode from "@/components/picker/DictCode.vue";
import CastQualityCode from "@/components/picker/CastQualityCode.vue";
import QualityCode from "@/components/picker/QualityCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import OrderGroupRolling from "@/components/picker/OrderGroupRolling.vue";
import RollingCode from "@/components/picker/RollingCode.vue";
import ProductTypeCode from "@/components/picker/ProductTypeCode.vue";
import { useStore } from "vuex";
import { toLower } from "lodash";
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const { proxy } = getCurrentInstance();
const store = useStore();
const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const endUseLoading = ref(false);
const save = ref(true);
const quality_or_spec = ref('quality');

const spec_choose = reactive({
  spec_id: undefined,
  spec_type: undefined,
  spec_thickness: undefined,
  thick_from: undefined,
  thick_to: undefined,
  spec_code: undefined,
  spec: undefined,
  is_spec: false,
  loading: false,
  spec_mainel:{},
  quality_id: undefined,
});

const qualityElement = ref({
});

const handleChooseSpec = (item) => {
  spec_choose.spec_id = item?.id;

  if (item?.thick_from){
    spec_choose.spec_thickness = parseInt( ((item?.thick_to || 0) + (item?.thick_from || 0)) / 2);
    spec_choose.thick_from = item?.thick_from;
    spec_choose.thick_to = item?.thick_to;
  }
  else{
    spec_choose.spec_thickness = undefined;
    spec_choose.thick_from = undefined;
    spec_choose.thick_to = undefined;
  }
}

const tableHeadersDefinition = ref([
  // {title: "Action", key: "action", align: 'center', lastFixed: true, fixed: true, width: 140, minWidth: 140},
  {title: "cast_chemical_detail.table.test_sample_id", key: "test_sample_id", fixed: true, width: 150, minWidth: 150},
  {title: "cast_chemical_detail.table.authorize_date", key: "authorize_date", fixed: true, value: (item) => formatDate(item['authorize_date']), minWidth: 180},
  {title: "cast_chemical_detail.table.measure_match_id", key: "test_type", fixed: true, width: 150, minWidth: 150},
  {title: "cast_chemical_detail.table.c", key: "ch_c"},
  {title: "cast_chemical_detail.table.si", key: "ch_si"},
  {title: "cast_chemical_detail.table.mn", key: "ch_mn"},
  {title: "cast_chemical_detail.table.p", key: "ch_p"},
  {title: "cast_chemical_detail.table.s", key: "ch_s"},

  {title: "cast_chemical_detail.table.cr", key: "ch_cr"},
  {title: "cast_chemical_detail.table.mo", key: "ch_mo"},
  {title: "cast_chemical_detail.table.ni", key: "ch_ni"},
  {title: "cast_chemical_detail.table.al", key: "ch_al"},
  {title: "cast_chemical_detail.table.b", key: "ch_b"},
  {title: "cast_chemical_detail.table.co", key: "ch_co"},
  {title: "cast_chemical_detail.table.cu", key: "ch_cu"},
  {title: "cast_chemical_detail.table.nb", key: "ch_nb"},
  {title: "cast_chemical_detail.table.sn", key: "ch_sn"},
  {title: "cast_chemical_detail.table.ti", key: "ch_ti"},
  {title: "cast_chemical_detail.table.v", key: "ch_v"},
  {title: "cast_chemical_detail.table.n", key: "ch_n"},
  {title: "cast_chemical_detail.table.ca", key: "ch_ca"},
  // {title: "Solal", key: "ch_solal"},
  {title: "cast_chemical_detail.table.h", key: "ch_h"},
  {title: "cast_chemical_detail.table.as", key: "ch_as"},
  {title: "cast_chemical_detail.table.bi", key: "ch_bi"},
  {title: "cast_chemical_detail.table.ce", key: "ch_ce"},
  {title: "cast_chemical_detail.table.o", key: "ch_o"},
  {title: "cast_chemical_detail.table.pb", key: "ch_pb"},
  {title: "cast_chemical_detail.table.sb", key: "ch_sb"},
  {title: "cast_chemical_detail.table.w", key: "ch_w"},
  {title: "cast_chemical_detail.table.zn", key: "ch_zn"},
  {title: "cast_chemical_detail.table.zr", key: "ch_zr"},
  {title: "cast_chemical_detail.table.te", key: "ch_te"},
  {title: "cast_chemical_detail.table.rad", key: "ch_rad"},
  {title: "cast_chemical_detail.table.insal", key: "ch_insal"},
  {title: "cast_chemical_detail.table.n2", key: "ch_n2"},
  {title: "cast_chemical_detail.table.solal", key: "ch_sal"},

  {title: "cast_chemical_detail.table.created_at", key: "created_at", value: (item) => formatDate(item['created_at']), minWidth: 180},
  {title: "cast_chemical_detail.table.updated_at", key: "updated_at", value: (item) => formatDate(item['updated_at']), minWidth: 180},

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
  selected: [],
  rolling_id: undefined,
  rolling: undefined,
  dim3: undefined,
  product_type_id: undefined,
  product_type: undefined,
  order_id: undefined,
  order: undefined,
  order_item_id: undefined,
  order_item: undefined,
  order_group_id: undefined,
  order_group: undefined,
  
  queryParams: {
    q: undefined,
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },

  form: {
    id: undefined,
    cast_code: undefined,
    generate_code: undefined,
    bos_cast_code: undefined,
    long_cast_code: undefined,
    quality_code: undefined,
    ch_c: undefined,
    ch_si: undefined,
    ch_mn: undefined,
    ch_p: undefined,
    ch_s: undefined,
    ch_s_p: undefined,
    ch_cr: undefined,
    ch_mo: undefined,
    ch_ni: undefined,
    ch_al: undefined,
    ch_b: undefined,
    ch_co: undefined,
    ch_cu: undefined,
    ch_nb: undefined,
    ch_sn: undefined,
    ch_ti: undefined,
    ch_v: undefined,
    ch_n: undefined,
    ch_ca: undefined,
    ch_solal: undefined,
    ch_h: undefined,
    ch_as: undefined,
    ch_bi: undefined,
    ch_ce: undefined,
    ch_o: undefined,
    ch_pb: undefined,
    ch_sb: undefined,
    ch_w: undefined,
    ch_zn: undefined,
    ch_zr: undefined,
    ch_te: undefined,
    ch_rad: undefined,
    ch_insal: undefined,
    ch_n2:undefined,
    ch_sal: undefined,

    test_sample_id: undefined,

    precision_c: undefined,
    precision_si: undefined,
    precision_mn: undefined,
    precision_p: undefined,
    precision_s: undefined,
    precision_s_p: undefined,
    precision_cr: undefined,
    precision_mo: undefined,
    precision_ni: undefined,
    precision_al: undefined,
    precision_b: undefined,
    precision_co: undefined,
    precision_cu: undefined,
    precision_nb: undefined,
    precision_sn: undefined,
    precision_ti: undefined,
    precision_v: undefined,
    precision_ca: undefined,
    precision_n: undefined,
    precision_o: undefined,
    precision_h: undefined,
    precision_solal: undefined,
    precision_as: undefined,
    precision_bi: undefined,
    precision_ce: undefined,
    precision_pb: undefined,
    precision_sb: undefined,
    precision_w: undefined,
    precision_zn: undefined,
    precision_zr: undefined,
    precision_te: undefined,
    precision_rad: undefined,
    precision_insal: undefined,
    precision_n2: undefined,
    precision_sal: undefined,
    quality_id:undefined,
    authorize_date: undefined,
  },
  
  rules: {
    isIntNumber: [(value) => {
      if (!value) {
        return true;
      }
      return /^[0-9]+$/.test(value) || 'The value must be a number ';
    }],
    thickness: [
      value => {
        if (quality_or_spec === 'spec'){
          if (value) return true
          return 'Thickness is required.'
        }
        
      },
    ],
  },
  zero_decimal_cast: ["o"],
  one_decimal_cast: ["h","zr"],
  two_decimal_cast: ["al","as","bi","c","ce","co","cr","cs","cu","insal","mn","mo","n","nb","ni","p","pb","s","sb","si","sn","solal","te","v","w","zn"],
  three_decimal_cast: ["rad","ti"],
  four_decimal_cast: ["b","ca"],
});

const srsm_spec = {
  five_decimal_cast: new Set(["o","h"]),
  four_decimal_cast: new Set(["b"]),
  three_decimal_cast: new Set([ 'p', 'ni', 'nb', 'ti', 'pb', 'ca', 's', 'nv', 'cr', 'al', 
    'n', 'v', 'w', 'sb', 'so', 'zn', 'mo', 'cu', 'sn', 'as', 
    'bi', 'te', 'zr']),
  two_decimal_cast: new Set(["c","si", "co", "mn", "ce"]),
}

const { 
  selected, form, rules, query, queryParams, zero_decimal_cast, one_decimal_cast, 
  two_decimal_cast, three_decimal_cast, four_decimal_cast, order_id, order_item_id, 
  order_item, order_group_id, order_group, rolling_id, product_type_id, dim3, product_type
} = toRefs(data);

const handleSave = async () => {
  const {valid} = await proxy.$refs["searchForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  if (params.ch_h !== null) {
    console.log('params.ch_h:', params.ch_h);
    
    params.ch_h  = params.ch_h / 10000;
  }
  if (params.ch_o !== null) {
    console.log('params.ch_o:', params.ch_o);
    
    params.ch_o  = params.ch_o / 10000;
  }
  try {
    await API.add(params);
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  } catch (res) {
    toast.error(params.id ? "Update Fail: " + res?.response?.data?.detail : "Create Fail: " + res?.response?.data?.detail, { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}


const getDetailById = (id) => {
  loading.value = true;
  return API.getDetailById(id).then(res => {
    const { status, data } = res
    if (status === 200) {
      save.value = false;
      if (data.ch_h !== null) {
        data.ch_h  = data.ch_h * 10000;
      }
      if (data.ch_o !== null) {
        data.ch_o  = data.ch_o * 10000;
      }
      if (quality_or_spec.value === 'spec' && toLower(defaultMillCode.value) === 'srsm') {
        // srsm spec 特殊处理 
        Object.keys(data).forEach(key => {
          const suffix = key.substring(3);
          let precision = 2; // 默认精度为2
          if (key.startsWith('ch_') && data[key] !== null) {

            if (srsm_spec.three_decimal_cast.has(suffix)) {
              precision = 3;
            } else if (srsm_spec.two_decimal_cast.has(suffix)) {
              precision = 2;
            } else if (srsm_spec.four_decimal_cast.has(suffix)) {
              precision = 4;
            } else if (srsm_spec.five_decimal_cast.has(suffix)) {
              precision = 5;
            }
            if (form.value[ `precision_${suffix}`]) {
              precision = form.value[ `precision_${suffix}`];
            }
            data[key] = floatToFixed(data[key], precision);
            data[ `precision_${suffix}`] = precision;
          }
        });
      }else {        
        Object.keys(data).forEach(key => {
          if (key.startsWith('ch_') && data[key] !== null) {
            const suffix = key.substring(3);
            let precision = 2; // 默认精度为2

            if (zero_decimal_cast.value.includes(suffix)) {
              precision = 0;
            } else if (one_decimal_cast.value.includes(suffix)) {
              if (suffix === "zr" && data[key] < 0.1) {
                precision = 3;
              } else {
                precision = 1;
              }
            } else if (two_decimal_cast.value.includes(suffix)) {
              if (suffix === "n" && data[key] < 0.1) {
                precision = 4;
              } else if (suffix !== "mn" && data[key] < 0.1) {
                precision = 3;
              }
            } else if (three_decimal_cast.value.includes(suffix)) {
              if (suffix === "ti" && data[key] < 0.01) {
                precision = 4;
              } else {
                precision = 3;
              }
            } else if (four_decimal_cast.value.includes(suffix)) {
              precision = 4;
            }
            data[key] = floatToFixed(data[key], precision);
            data['precision_' + suffix] = precision;
          }
        });
    }
    form.value = data;
  }  else {
    toast.error('Error loading data.', { autoClose: 60000 });
  }
  }).finally(() => {
    loading.value = false;
  });
}



const getTestList = () => {
    if (!route.query.id) {
        tableList.value = [];
        total.value = 0;
        return;
    }
    const params = {
    ...toRaw(queryParams.value),
    fields: ["cast_id"],
    ops: ["eq"],
    values: [route.query.id]
  };
  API.getlist(params).then(res => {
    const { status, data } = res;
    if (status === 200) {      
      total.value = res.data.total || 0;
      tableList.value = res.data.items.map(item => ({
        ...item,
        authorize_date: form.value.authorize_date
      })) || [];
    } else {
      total.value = 0;
      tableList.value = [];
    }
  });
}

if (route.query.id) {
  // console.log('route.query.id:', route.query.id);
  getDetailById(route.query.id);
  getTestList();
}

const spec_data = reactive({
  tableHeaders: [
      { title: 'Cast Code', key: 'cast_code', minWidth: 130, fixed: true, sortable: false, align: 'center' },
      { title: 'Spec Code', key: 'spec_detail', sortable: false },
      { title: 'Product Type Code', key: 'product_type_code', sortable: false },
      ],
    serverItems: [],
    loading: false,
    total: 0, 
    searchOptions: {
      q:undefined,
      page: 1,
      itemsPerPage: 10,
      sortBy: ['spec_detail'],
      descending: [true],
    }
  });

  const specTableHeaders = computed(() => {
    return spec_data.tableHeaders.value.map(header => ({
      ...header,
      title: header.title.includes('.') ? t(header.title) : header.title
    }));
  });

  const semi_data = reactive({
    tableHeaders: [
      { title: 'cast_chemical_detail.table.Cast Code', key: 'cast_code', minWidth: 130, fixed: true, sortable: false, align: 'center' },
      { title: 'Skelp Code', key: 'skelp_code', sortable: false },
      { title: 'Type', key: 'semi_type', sortable: false },
      { title: 'Quantity', key: 'quantity', sortable: false },
      ],
    serverItems: [],
    loading: false,
    total: 0, 
    searchOptions: {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['skelp_code'],
      descending: [true],
    }
  });

  const defect_data = reactive({
    tableHeaders: [
      { title: 'Cast Code', key: 'cast_code', minWidth: 130, fixed: true, sortable: false, align: 'center' },  
      { title: 'Skelp Code', key: 'skelp_code', sortable: false },
      { title: 'Defect ID', key: 'defect_reason_id', sortable: false },
      { title: 'Defect', key: 'defect_reason_name', sortable: false },
      { title: 'No. Blooms', key: 'quantity', sortable: false },
      { title: 'Remark', key: 'comment', sortable: false },
      ],
    serverItems: [],
    loading: false,
    total: 0, 
    searchOptions: {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['skelp_code'],
      descending: [true],
    }
  });

    
  // 获取castId
  const getCastIdFromHeader = () => {
    const castId = route.query.id;
    return castId ? String(castId) : '';
  };
  
  const castId = getCastIdFromHeader();
  // 获取Spec的详细数据
  const getAllData = () => {
    if (!castId) {  
      return;  
    }
    loading.value = true;
  //   const params = {
  //   ...toRaw(spec_date.searchOptions)
  // };
    API.getCastDetail(castId, spec_data.searchOptions.q, spec_data.searchOptions.page, spec_data.searchOptions.itemsPerPage)
      .then(res => {
        const { status, data } = res;
        const { items, total } = data;
  
        if (status === 200 && Array.isArray(items)) {
          // 数据处理：将返回的每项数据映射成需要的结构
          spec_data.serverItems = items.map(item => ({
            id: item.cast_id, // 每一项的唯一ID
            spec: item.spec,  
            cast: item.cast,
            product_type: item.product_type,

            mill: item.product_type.mill,
          }));
          spec_data.total = total || 0;
        }
      })
      .catch(error => {
        toast.error("Error loading data.", { autoClose: 60000 }
    );
        console.error("Error:", error);
      })
      .finally(() => {
        spec_data.loading = false;
      });
  };

  // 获取Spec的详细数据
  const getSemiData = () => {
    if (!castId) {  
      return;  
    }
    loading.value = true;
    API.getSemi(castId, semi_data.searchOptions.page, semi_data.searchOptions.itemsPerPage)
      .then(res => {
        const { status, data } = res;
        const { items, total } = data;
  
        if (status === 200 && Array.isArray(items)) {
          // 数据处理：将返回的每项数据映射成需要的结构
          semi_data.serverItems = items.map(item => ({
            id: item.cast_id, // 每一项的唯一ID
            cast: item.cast,
            skelp_code: item.skelp_code,
            semi_type: item.semi_type,
            quantity: item.quantity,
         
          }));
          semi_data.total = total || 0;
        }
      })
      .catch(error => {
        toast.error("Error loading data.", { autoClose: 60000 }
    );
        console.error("Error:", error);
      })
      .finally(() => {
        semi_data.loading = false;
      });
  };

  const getDefectData = () => {
    if (!castId) {
      return;
    }
    loading.value = true;
    
    API.getSemi(castId, 1, 1000) 
      .then((res) => {
        const { status, data } = res;
        const { items } = data;

        if (status === 200 && Array.isArray(items)) {
          // Filter for defect-related items
          const relevantDefectItems = items.filter((item) => item.defect_reason?.id != null);

          // Apply client-side pagination on the filtered data
          const startIndex = (defect_data.searchOptions.page - 1) * defect_data.searchOptions.itemsPerPage;
          const paginatedItems = relevantDefectItems.slice(startIndex, startIndex + defect_data.searchOptions.itemsPerPage);

          // Update serverItems and total count
          defect_data.serverItems = paginatedItems.map((item) => ({
            id: item.cast_id,
            cast: item.cast,
            defect_reason: item.defect_reason,
            quantity: item.quantity,
            comment: item.comment,
            skelp_code: item.skelp_code,
          }));
          defect_data.total = relevantDefectItems.length;
        } else {
          defect_data.serverItems = [];
          defect_data.total = 0;
        }
      })
      .catch((error) => {
        toast.error('Error loading data.', { autoClose: 60000 });
        console.error('Error:', error);
      })
      .finally(() => {
        defect_data.loading = false;
      });
  };
  
  // 处理分页变化
  function handleTableChange({ page, itemsPerPage, sortBy })
  {
    spec_data.searchOptions.page = page;
    spec_data.searchOptions.itemsPerPage = itemsPerPage;
    if (sortBy.length > 0) {
      spec_data.searchOptions.sortBy = sortBy;
    }
    getAllData();
  };

  function handleSemiTableChange({ page, itemsPerPage, sortBy }){
    semi_data.searchOptions.page = page;
    semi_data.searchOptions.itemsPerPage = itemsPerPage;
    if (sortBy.length > 0) {
      semi_data.searchOptions.sortBy = sortBy;
    }
    getSemiData();
  };

  function handleDefectTableChange({ page, itemsPerPage, sortBy }){
    defect_data.searchOptions.page = page;
    defect_data.searchOptions.itemsPerPage = itemsPerPage;
    if (sortBy.length > 0) {
      defect_data.searchOptions.sortBy = sortBy;
    }
    getDefectData();

  };

  function handleCastTableChange({ page, itemsPerPage, sortBy }){
    queryParams.value.page = page;
    queryParams.value.itemsPerPage = itemsPerPage;
    if (sortBy.length > 0) {
      queryParams.value.sortBy = sortBy;
    }
    getTestList();

  };

if (route.query.id) {
  getDetailById(route.query.id)
  getTestList()
}


const authorizeDate = () => {
  loading.value = true;
  API.authorize(route.query.id).then((res) => {
    const {status, data} = res
    if (status === 200) {
      save.value = false;
      loading.value = false;
      form.value = data;
      getDetailById(route.query.id)
    }
  })
}
const isInQualityRange = (value, element) => {
  // 判断是否在quality的范围内
  let min_element = parseFloat(qualityElement.value['main_el_min_value_' + element] || "0");
  let max_element = parseFloat(qualityElement.value['main_el_max_value_' + element] || "0");
  const numValue = parseFloat(value || "0");
  // 如果为0 则不判断
  // if (min_element == 0){
  //   min_element = Number.MIN_VALUE;
  // }
  if (max_element == 0){
    max_element = Number.MAX_VALUE;
  }
  return numValue >= min_element && numValue <= max_element 
}

const isInSpecRange = (value, element) => {
  // 判断是否在spec的范围内
  let min_element = parseFloat(spec_choose.spec_mainel['main_el_min_value_' + element] || "0");
  let max_element = parseFloat(spec_choose.spec_mainel['main_el_max_value_' + element] || "0");
  const numValue = parseFloat(value || "0");
  
  // 如果为0 则不判断
  // if (min_element == 0){
  //   min_element = Number.MIN_VALUE;
  // }
  if (max_element == 0){
    max_element = Number.MAX_VALUE;
  }
  return numValue >= min_element && numValue <= max_element 
}


const runEndUse = () => {
  endUseLoading.value = true
  API.run_end_use(route.query.id)
    .then(() => {
      toast.success("Run Success", {
      position: "bottom-center"
    }
  );
    getAllData();
  })
  .catch(error => {
        toast.error(error?.response?.data?.detail || "Run Fail", { autoClose: 60000 });
      })
  .finally(() => {
    endUseLoading.value = false;
  });
};


const updateElement = (reactiveData) => {
  //遍历qualityElement precision_ 开头的 赋值给form
  Object.keys(reactiveData).forEach(key => { 
    if (key.startsWith('precision_') && reactiveData[key] !== undefined && reactiveData[key] !== null && reactiveData[key] != 0) {
      form.value[key] = reactiveData[key];
    }
  })
  refreshTrigger.value++;
}

const compSpec = ()=>{
  if (quality_or_spec.value === 'quality'){
    if (!spec_choose.quality_id){
      toast.error('Please select a quality first.', { autoClose: 60000 });
      return;
    }
    loading.value = true;
    return API.getQualityMainel(spec_choose.quality_id).then(res => {
          const { status, data } = res;
          if (status === 200) {
            updateElement(data)
            qualityElement.value = data;
            getDetailById(route.query.id)        
            refreshTrigger.value++;
          }
    }).catch(error => {
      toast.error('Error loading data.', { autoClose: 60000 });
    }).finally(() => {
      loading.value = false;
    });

  }else{

    if (!spec_choose.spec_id){
      toast.error('Please select a spec first.', { autoClose: 60000 });
      return;
    }
    const params = {
      page:1,
      itemsPerPage:-1,
      fields:['spec_id'],
      ops:['eq'],
      values:[spec_choose.spec_id]
    }
    if (spec_choose.spec_type){
      params.fields.push('type');
      params.ops.push('eq');
      params.values.push(spec_choose.spec_type);
    }
    if (spec_choose.spec_thickness){
      params.spec_thickness = spec_choose.spec_thickness;
    }
    loading.value = true;
    return API.getMainElement(params).then(res => {
      const { status, data } = res;
      if (data.items.length === 0){
        toast.error('No spec mainel found.', { autoClose: 60000 });
        return;
      }
      if (data.items.length > 1){
        toast.error('More than one spec found.', { autoClose: 60000 });
        return;
      }
      spec_choose.spec_mainel = data.items[0]
      updateElement(data.items[0])
      getDetailById(route.query.id)
      refreshTrigger.value++;
    }).catch(error => {
      toast.error('Error loading data.', { autoClose: 60000 });
    }).finally(() => {
      loading.value = false;
    });
  }
}

const refreshTrigger = ref(0);

const resetCompSpec = () => {
  Object.assign(spec_choose, {
    spec_id: null,
    spec_type: null,
    spec_thickness: null,
    is_spec: false,
    spec_mainel: {},
    spec_code: null,
    quality_id: null
  });
  Object.assign(data,{
    product_type_id: null,
    product_type: null,
    dim3: null,
    rolling_id: null,
    rolling: null,
    order_id: undefined,
    order: undefined,
    order_item_id: undefined,
    order_item: undefined,
    order_group_id: undefined,
    order_group: undefined,
  })
  // 清理qualityElement
  qualityElement.value = {};
  

  // 重新绘制
  refreshTrigger.value++;
}


const getTextColor = (value, element) => {
  console.log("getTextColor", value, element);
  
  refreshTrigger.value;
  if (quality_or_spec.value === 'quality'){
    // quality 对比
    // console.log("get quality >>>>>>>>>>>>>>>", element, "curr:",value, "min:",qualityElement['main_el_min_value_' + element], "max:",qualityElement['main_el_max_value_' + element])
    if (isValueEmpty(value) || (isValueEmpty(qualityElement.value['main_el_max_value_' + element]) && isValueEmpty(qualityElement.value['main_el_min_value_' + element]))){
      return 'text-normal';    
    }
    return isInQualityRange(value, element) ? 'text-success' : 'text-error';
  }else{
    // spec 对比
    // console.log("get spec >>>>>>>>>>>>>>>", element, "curr:",value, "min:",spec_choose.spec_mainel['main_el_min_value_' + element], "max:",spec_choose.spec_mainel['main_el_max_value_' + element])
    if (isValueEmpty(value) || (isValueEmpty(spec_choose.spec_mainel['main_el_max_value_' + element]) && isValueEmpty(spec_choose.spec_mainel['main_el_min_value_' + element]))){
      return 'text-normal';
    }
    // console.log("get spec",value, element,isInSpecRange(value, element) ? 'text-success' : 'text-error')
    return isInSpecRange(value, element) ? 'text-success' : 'text-error';
  }
};

const getTextHint = (value, element) => {
  console.log("getTextHint", value, element);
  
  refreshTrigger.value;

  if (quality_or_spec.value === 'quality'){
    const qMin = qualityElement.value[`main_el_min_value_${element}`];
    const qMax = qualityElement.value[`main_el_max_value_${element}`];
    // console.log("get quality hint >>>>>>>>>>>>>>>", element, "curr:",value, "min:",qMin, "max:",qMax)
    // quality 对比
    if (isValueEmpty(value) || (isValueEmpty(qMin) && isValueEmpty(qMax))){
      return '';
    }
    return isInQualityRange(value, element) ? '' : `Range: ${(element == 'h' && value !== null) || (element == 'o' && value !== null) ? qMin * 10000: qMin}~${(element == 'h' && value !== null) || (element == 'o' && value !== null) ? qMax * 10000: qMax}`;
  }else{
    const sMin = spec_choose.spec_mainel[`main_el_min_value_${element}`];
    const sMax = spec_choose.spec_mainel[`main_el_max_value_${element}`];
    // console.log("get spec hint >>>>>>>>>>>>>>>", element, "curr:",value, "min:",sMin, "max:",sMax)
    // spec 对比
    if (isValueEmpty(value) || (isValueEmpty(sMin) && isValueEmpty(sMax))){
      return '';
    }
    return isInSpecRange(value, element) ? '' : `Range: ${(element == 'h' && value !== null) || (element == 'o' && value !== null) ? sMin * 10000: sMin}~${(element == 'h' && value !== null) || (element == 'o' && value !== null) ? sMax * 10000: sMax}`;
  }
};

const handleReset = () => {
  spec_data.searchOptions.q = null;
}

const getThicknessHint = ()=>{
  if (spec_choose.thick_from && spec_choose.thick_to){
    return `${spec_choose.thick_from} - ${spec_choose.thick_to}`;
  }
  return '';
}

onMounted(() => {
  const castCodeFromRoute = route.query.cast_code;
  const generateCodeFromRoute = route.query.generate_code;
  if (castCodeFromRoute) {
    form.value.cast_code = castCodeFromRoute;
    form.value.generate_code = generateCodeFromRoute;
  }
});

const handleOrderItemChange = (item) => {
  order_item_id.value = item.id;
  order_item.value = item;
  spec_choose.spec_code = item?.spec_id;
  spec_choose.spec_id = item?.spec_id;
  spec_choose.spec = item?.spec;
}

const handleOrderGroupChange = (item) => {
  order_group_id.value = item.id;
  order_group.value = item;
  spec_choose.spec_thickness = item?.product_type?.flange_thickness;
}

const handleProductTypeChange = (item) => {
  if (item){
    product_type_id.value = item.id;
    product_type.value = item;
    dim3.value = item.dim3;
    spec_choose.spec_thickness = item?.flange_thickness;
  }else{
    product_type_id.value = null;
    product_type.value = null;
    dim3.value = null;
    spec_choose.spec_thickness = null;
  }
  
}


</script>
<style lang="scss" scoped>


.detail-content {

  .panel {
    position: relative;
    background-color: #ffffff;
    padding: 16px;

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

  .panel-card{
    margin-top: 16px;
  }
}

.color-groups {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 12px;
  &-item {
    display: flex;
    align-items: center;
    .color-content {
      width: 32px;
      height: 16px;
      border-radius: 4px;
      margin-right: 10px;
      &.green {
        background-color: green;
      }
      &.red {
        background-color: red;
      }
      &.black {
        background-color: #333;
      }
    }
    span {
      color: #333;
      font-size: 13px;
    }
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
  }
}

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
