<template>
  <v-container class="page" fluid>
    <v-row align="center">
      <v-col cols="3">
        <v-text-field
            v-model="table.options.q"
            :counter="10"
            :label="$t('semi_detail.table.semi_code')"
            density="default"
            variant="underlined"
            :placeholder="$t('semi_detail.table.please_enter_semi_code')"
            bg-color="white"
            :hide-details="false"
            @keydown.enter="searchData"
            persistent-placeholder
            clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-btn
            type="submit"
            class="text-none ml-4 mr-4"
            color="primary"
            variant="flat"
            :loading="loading"
            @click="searchData"
        >
          {{ $t('global.search') }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-end">
        <div class="panel">
          <div class="panel-action">
            <span class="text-subtitle-2 font-weight-regular mr-2">{{ config.saveFlag ? "Save" : "View" }}</span>
            <v-switch
                v-model="config.saveFlag"
                density="default"
                hide-details
                inset
            ></v-switch>
            <v-btn
                text="Search"
                type="submit"
                class="text-none ml-12"
                color="primary"
                variant="flat"
                @click="handleSave"
                :disabled="!config.saveFlag"
            >Update/Create
            </v-btn
            >
          </div>
        </div>
      </v-col>
    </v-row>
    <div class="pa-6 border rounded mt-4 mb-4">
      <v-form ref="editForm">
        <v-row align="center">
          <v-col cols="4">
            <v-combobox
                v-model="selected.cast_code"
                :items="castCodes"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.cast_code')"
                :hide-details="false"
                persistent-placeholder
                :disabled="!config.saveFlag"
                required
                :search-input.sync="search"
                @update:search-input="filterItems"
            ></v-combobox>
          </v-col>
          <v-col cols="4" v-if="config.millId === 410">
            <v-text-field
                v-model="selected.skelp_code"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.skelp_code')"
                :hide-details="false"
                persistent-placeholder
                required
                :disabled="!config.saveFlag"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="selected.semi_code"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.semi_code')"
                persistent-placeholder
                :disabled="!config.saveFlag"
                required
            ></v-text-field>
          </v-col>
          <v-col>
            <dict-code
                v-model="selected.semi_status"
                :label="$t('semi_detail.table.semi_status')"
                placeholder="Select Semi Status"
                code="semi_status"
                persistent-placeholder
                :disabled="!config.saveFlag"
                :hide-details="false"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
                type="number"
                v-model="selected.dim1"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.width')"
                :hide-details="false"
                persistent-placeholder
                :disabled="!config.saveFlag"
                required
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
                type="number"
                v-model="selected.dim2"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.thickness')"
                :disabled="!config.saveFlag"
                :hide-details="false"
                persistent-placeholder
                required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                type="number"
                v-model="selected.length_mm"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.length')"
                :disabled="!config.saveFlag"
                :hide-details="false"
                persistent-placeholder
                required
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field
                type="number"
                v-model="selected.estimated_weight_kg"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.weight')"
                :disabled="!config.saveFlag"
                :hide-details="false"
                persistent-placeholder
                required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <SemiLoadSelect
                v-model="selected.semi_load"
              
                :hide-details="false"
                persistent-placeholder
                :disabled="!config.saveFlag"
            />
          </v-col>
          <v-col cols="4">
            <RollingSelect
                v-model="selected.rolling"
                
                :hide-details="false"
                persistent-placeholder
                :disabled="!config.saveFlag"
            />
          </v-col>
          <v-col cols="4">
            <OrderGroupSelect
                v-model="selected.order_group"
                
                :hide-details="false"
                persistent-placeholder
                :disabled="!config.saveFlag"
            />
          </v-col>
          <v-col cols="4">
            <AreaCode
                v-model="selected.area_"
                type="semi"
                :disabled="!save"
                :hide-details="false"
                :label="$t('semi_detail.table.location')"
                @change="handleItemChange($event, 'area_id')"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
                type="number"
                v-model="selected.semi_charge_seq"
                
                :label="$t('semi_detail.table.semi_charge_seq')"
                :hide-details="false"
                persistent-placeholder
            
                :disabled="!config.saveFlag"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <DatePickerMenuComponent
                v-model="selected.stock_in_date"
                :dateLabel="$t('semi_detail.table.stock_in_date')"
                :disabled="!config.saveFlag"
            >stock_in_data
            </DatePickerMenuComponent
            >
          </v-col>
          <v-col cols="4">
            <TimePickerMenuComponent
                v-model="selected.time"
                :disabled="!config.saveFlag"
            ></TimePickerMenuComponent>
          </v-col>
          <v-col cols="4">
            <v-text-field
                type="number"
                v-model="selected.semi_cut_seq"
                
                :label="$t('semi_detail.table.semi_cut_seq')"
                ::hide-details="false"
                persistent-placeholder
                
                :disabled="!config.saveFlag"
            ></v-text-field>
          </v-col>

          <v-col cols="4">
            <!-- <v-text-field
                v-model="selected.quality_code"
                :rules="[rules.required]"
                label="Quality Code"
                :hide-details="false"
                persistent-placeholder
                required
                :disabled="!config.saveFlag"
            ></v-text-field> -->
            <QualityCode
                v-model="selected.quality_id"
                :label="$t('semi_detail.table.quality_code')"
                :hide-details="false"
                persistent-placeholder
                required
                :rules="[rules.required]"
                :disabled="!config.saveFlag"
                :display-text="selected.quality_code"
              />
          </v-col>

          <v-col cols="4">
            <v-text-field
                v-model="selected.scarfed_status"
                
                :label="$t('semi_detail.table.scarfed_status')"
                :hide-details="false"
                persistent-placeholder
              
                :disabled="!config.saveFlag"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="selected.scrap_quantity"
                :label="$t('semi_detail.table.scarfed_qty')"
                :hide-details="false"
                persistent-placeholder
                disabled
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <dict-code
                v-model="selected.semi_type"
                :rules="[rules.required]"
                :label="$t('semi_detail.table.semi_type')"
                code="semi_type"
                :hide-details="false"
                persistent-placeholder
                :disabled="!config.saveFlag"
            />
          </v-col>   
          <v-col cols="4">
            <v-text-field
              v-if="selected.defect_reason"
              v-model="selected.defect_reason.name"
              :label="$t('semi_detail.table.defect')"
              :hide-details="false"
              persistent-placeholder
              disabled
            ></v-text-field>
            <v-text-field
              v-else
              :label="$t('semi_detail.table.defect')"
              :hide-details="false"
              persistent-placeholder
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="selected.defect_quantity"
                :label="$t('semi_detail.table.defect_qty')"
                :hide-details="false"
                persistent-placeholder
                disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
                v-model="selected.comment"
                density="default"
                variant="underlined"
                :label="$t('semi_detail.table.comment')"
                bg-color="white"
                :hide-details="false"
                persistent-placeholder
                rows="3"
                :disabled="!config.saveFlag"
                clearable
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <div class="panelhold border mt-4">
        <div class="text-subtitle-1 ml-4 mr-4 mb-2">{{$t('semi_detail.table.current_holds')}}</div>
        <v-divider></v-divider>
        <v-data-table
            :headers="unHoldTableHeaders"
            :items="selected.semi_hold_reason"
            density="default"
            item-value="id"
        >
          <template #bottom>
            <!-- Leave this slot empty to hide pagination controls -->
          </template>
        </v-data-table>
      </div>
  </v-container>
</template>
<script>
import {mapState, mapWritableState} from "pinia";
import {mapActions} from "pinia";
import {useSemiStore} from "../semi/storePinia";
import SemiLoadSelect from "@/semi_admin/semi/components/SemiLoadSelect.vue";
import RollingSelect from "@/semi_admin/semi/components/RollingSelect.vue";
import OrderGroupSelect from "@/semi_admin/semi/components/OrderGroupSelect.vue";
import SiteSelect from "@/semi_admin/semi/components/SiteSelect.vue";
import CastCode from "@/components/picker/CastCode.vue";
import {reactive, ref} from "vue";
import {required} from "@/util/form";
import semiApi from "../semi/api"
import DatePickerMenuComponent from "@/components/DatePickerMenuComponent.vue";
import TimePickerMenuComponent from "@/components/TimePickerMenuComponent.vue";
import HoldReasonCode from "@/components/picker/HoldReasonCode.vue";
import AreaCode from "@/components/picker/AreaCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import QualityCode from "@/components/picker/QualityCode.vue";
import store from '@/store';

export default {
  setup() {
    const menu = ref(false);
    const selectedDate = ref(null);
    return {
      selectedDate,
      menu,
      rules: {required},
    };
  },
  name: "SemiDetailTable",

  components: {
    DictCode,
    AreaCode,
    SemiLoadSelect,
    RollingSelect,
    OrderGroupSelect,
    SiteSelect,
    HoldReasonCode,
    TimePickerMenuComponent,
    DatePickerMenuComponent,
    CastCode,
    QualityCode
  },

  data() {
    return {
      config: {
        saveFlag: true,
        editFlag: false,
        millId: store.state.auth?.userInfo.current_mill_id,
      },
      rules: { required },
      castCodes: [],
      holdReasonCodes: [],
      form: {
        cast: null
      },
      filterItems: [],
      search: null,
      loading: false,
      tableHeadersDefinition: [
      { title: 'semi_detail.table.hold_code', key: 'code' },
      { title: 'semi_detail.table.hold_type', key: 'type' },
      { title: 'semi_detail.table.hold_name', key: 'name' },
      { title: 'semi_detail.table.comment', key: 'comment' },
    ],

    };
  },
  
  computed: {
    ...mapState(useSemiStore, ["isEditFlag", "dialogs", "selected", "table"]),
    // 动态生成headers
    unHoldTableHeaders() {
      return this.tableHeadersDefinition.map(header => ({
        ...header,
        title: this.$t(header.title)
      }));
    },

    combineDateTime() {
      const date = this.selected.stock_in_date; // 从 DatePicker 获取的日期
      const time = this.selected.time; // 从 TimePicker 获取的时间

      if (date && time) {
        // 组合成完整的日期时间格式
        this.selected.stock_in_date = `${date} ${time}`;
      } else {
        // 如果日期或时间为空，抛出错误或做默认处理
        this.$emit('error', 'Invalid date or time');
      }
    },
  },
  mounted() {

    this.$watch(
        (vm) => [vm.showCreateEdit],
        () => {
          this.$refs.vform.validate(); // 手动触发表单校验
        }
    );
        
    this.getCastCodes();
  },


  watch: {
  // 监听 cast_code 和 skelp_code 的变化
  'selected.cast_code'(newCastCode) {
    this.updateSemiCode();
  },
  'selected.skelp_code'(newSkelpCode) {
    this.updateSemiCode();
  },
},

  methods: {
    ...mapActions(useSemiStore, ["save", "closeCreateEdit", "searchData"]),
    async handleSave() {
      const {valid} = await this.$refs["editForm"].validate();
      if (!valid) {
        return;
      }
      this.save();
    },

    getCastCodes(){
        semiApi.commenRequestGet("/cast/item/codes").then(response => {
             this.castCodes = response.data;
        })
    },
    handleItemChange(item, key){
        this.selected.area_id = item?.id;
        this.selected.area_code = item?.code;
      },    

    // 拼接 cast_code 和 skelp_code，更新 semi_code
  updateSemiCode() {
    if (this.selected.cast_code && this.selected.skelp_code) {
      this.selected.semi_code = `${this.selected.cast_code}-${this.selected.skelp_code}`;
    } else {
      this.selected.semi_code = ''; // 如果任一字段为空，则清空 semi_code
    }
  },

  },
};
</script>
<style lang="scss" scoped>
.panel {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &-action {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.panelhold {
    position: relative;
    background-color: #ffffff;
    padding: 16px;
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
</style>
