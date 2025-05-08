<template>
  <FormDialog
      v-model="showCreateEdit"
      :width="700"
      :title="id ? 'Edit' : 'New'"
      desc="Section Weight"
      :loading="loading"
      @close="closeCreateEdit"
      @save="submitSaveLocal"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row align="center">
        <v-col cols="4" md="4" xs6>
          <v-text-field v-model="code" label="Code" hint="The unique key for the item." required name="Code"
                      :rules="[rules.required]" />
        </v-col>
        <v-col md="4" cols="4">
          <v-combobox v-model="mill_code" :items="millCodes" label="Mill Code"
                      hint="A name for your Mill Code" clearable name="mill_code" :search-input.sync="search"
                      @update:search-input="filterItems" :rules="[rules.required]" />
        </v-col>

        <v-col md="4" cols="4">
          <v-combobox v-model="tolerance_code" :items="toleranceCode" label="Tolerance Code"
                      hint="A name for your Tolerance Code" clearable name="tolerance_code" :search-input.sync="search"
                      @update:search-input="filterItems" :rules="[rules.required]" />
        </v-col>


        <v-col md="4" cols="4">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-combobox v-model="product_class_code" :items="productClassCodes" label="Product Code"
                      :rules="[rules.required]" hint="A name for your Product Code" clearable name="product_class_code"
                      :search-input.sync="search" @update:search-input="filterItems" />
        </v-col>

        <v-col md="4" cols="4">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-combobox v-model="product_category_code" :items="productCategoryCodes" label="Section Type"
                      hint="A name for your Section Type" clearable required name="product_category_code"
                      :rules="[rules.required]" :search-input.sync="search" @update:search-input="filterItems"
                      @update:modelValue="updateProductTypeDim" />
        </v-col>


        <v-col cols="4" md="4">
          <v-text-field v-model="dim1" label="Dim1" hint="A Dim1 for your item." clearable required
                        name="dim1" :rules="[rules.required]" />
        </v-col>

        <v-col cols="4" md="4">
          <v-text-field v-model="dim2" label="Dim2" hint="A Dim2 for your item." clearable required
                        name="dim2" :rules="[rules.required]" />
        </v-col>

        <v-col cols="4" md="4">
          <v-text-field v-model="dim3" label="Dim3" hint="A Dim3 No for your item." clearable required
                        name="dim3" :rules="[rules.required]" />
        </v-col>

        <v-col cols="4" md="4">
          <v-text-field v-model="dim4" label="Dim4" hint="A Dim4 for your item." clearable name="dim4" />
        </v-col>

        <v-col cols="4" md="4">
          <!-- <ValidationProvider name="Name" rules="required" immediate> -->
          <v-text-field v-model="type" label="Type" hint="A Type for your item." clearable name="Type" />
          <!-- </ValidationProvider> -->
        </v-col>

        <v-col cols="4" md="4">
          <v-text-field v-model="product_type_yield" label="Yield" hint="A yield for your item." clearable
                        required name="Yield" immediate />
        </v-col>

        <v-col cols="4" md="4">
          <v-text-field v-model="desc" label="Desc" hint="A desc for your item." clearable name="Desc"
                        immediate />
        </v-col>


        <v-col cols="4" md="4">
          <v-text-field v-model="flange_thickness" label="Flange Thick (mm)" hint="" clearable name="Flange Thick (mm)"
                        immediate :rules="[rules.required]" />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_thickness_1" label="Flange Thick 1 (mm)" hint="" clearable name="Flange Thick (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_thickness_2" label="Flange Thick 2 (mm)" hint="" clearable name="Flange Thick (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_thickness_3" label="Flange Thick 3 (mm)" hint="" clearable name="Flange Thick (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_thickness_4" label="Flange Thick 4 (mm)" hint="" clearable name="Flange Thick (mm)"
                        immediate />
        </v-col>
       
        <v-col cols="4" md="4">
          <v-text-field v-model="web_thickness" label="Web Thick (mm)" hint="" clearable name="Web Thick (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_height" label="Flange Height (mm)" hint="" clearable name="Flange Height (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_height_1" label="Flange Height 1 (mm)" hint="" clearable name="Flange Height (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_height_2" label="Flange Height 2 (mm)" hint="" clearable name="Flange Height (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_height_3" label="Flange Height 3 (mm)" hint="" clearable name="Flange Height (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="flange_height_4" label="Flange Height 4 (mm)" hint="" clearable name="Flange Height (mm)"
                        immediate />
        </v-col>
        
        <v-col cols="4" md="4">
          <v-text-field v-model="depth_d" label="Depth (mm)" hint="" clearable name="Depth (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="width_b" label="Width (mm)" hint="" clearable name="Width (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="width_b_1" label="Width 1 (mm)" hint="" clearable name="Width (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="width_b_2" label="Width 2 (mm)" hint="" clearable name="Width (mm)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="mass" label="Mass (kg/m)" hint="" clearable name="Mass (kg/m)"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="root_radius" label="Root Radius (mm)" hint="" clearable name="Root Radius (mm)"
                        immediate />
        </v-col>


        <v-col cols="4" md="4">
          <v-text-field v-model="roughing_xsect" label="Roughing Xsect" hint="" clearable name="Roughing Xsect"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="cogging_xsect" label="Cogging Xsect" hint="" clearable name="Cogging Xsect"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="cogging_web" label="Cogging Web" hint="" clearable name="Cogging Web"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="saw_crops_front" label="Saw Crops Front" hint="" clearable name="Saw Crops Front"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="shear_loss" label="Shear Loss" hint="" clearable name="Shear Loss"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="max_shear_length" label="Max Shear Length" hint="" clearable name="Max Shear Length"
                        immediate />
        </v-col>
        <v-col cols="4" md="4">
          <v-text-field v-model="control_roll" label="Control Roll" hint="" clearable name="Control Roll"
                        immediate />
        </v-col>

        <v-col cols="4" md="4"></v-col>



        <!-- <v-col cols="6" md="6">
          <v-text-field v-model="duration_minutes" label="Duration in Minutes" type="number"
            hint="A Duration in Minutes Date No for your item." clearable required name="Duration in Minutes"
            :rules="[rules.required]" />
        </v-col>
        <v-col cols="6" md="6">
          <v-text-field v-model="programmed_total_tons" label="Programmed Total Tons" type="number"
            hint="A Programmed Total TonsNo for your item." clearable required name="Programmed Total Tons"
            :rules="[rules.required]" />
        </v-col> -->

        <v-col cols="12">
          <v-img cover src="/static/images/finished-product-detial.png" style="border-radius:20px"></v-img>

        </v-col>
       
      </v-row>

    </v-form>

  </FormDialog>
</template>

<script>
import { required } from '@/util/form';
import productTypeApi from '@/product_type/api'
import { mapFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';
import { cloneDeep } from 'lodash';
import FormDialog from "@/components/FormDialog.vue";
// extend("required", {
//   ...required,
//   message: "This field is required",
// });

export default {
  setup() {
    return {
      rules: { required }
    };
  },
  name: 'ProductTypeNewEditSheet',

  components: {
    FormDialog
  },
  data() {
    return {
      tab: null,
      flexFormSchema: null,
      productCategoryCodes: [],
      productClassCodes: [],
      millCodes: [],
      toleranceCode: []
    };
  },
  watch: {
    dim1: function () {
      this.handleDimChange();
    },
    dim2: function () {
      this.handleDimChange();
    },
    dim3: function () {
      this.handleDimChange();
    },
    product_class_code: function () {
      this.handleDimChange();
    }
  },
  computed: {
    ...mapFields('product_type', [
      'selected.id',
      'selected.mill_id',
      'selected.mill_code',
      'selected.code',
      'selected.type',
      'selected.desc',
      'selected.dim1',
      'selected.dim2',
      'selected.dim3',
      'selected.dim4',
      'selected.tolerance',
      'selected.tolerance_code',
      'selected.product_category_code',
      'selected.product_class_code',
      'selected.flex_form_data',
      'selected.product_type_yield',

      'selected.flange_thickness',
      'selected.flange_thickness_1',
      'selected.flange_thickness_2',
      'selected.flange_thickness_3',
      'selected.flange_thickness_4',
      'selected.web_thickness',
      'selected.flange_height',
      'selected.flange_height_1',
      'selected.flange_height_2',
      'selected.flange_height_3',
      'selected.flange_height_4',
      'selected.depth_d',
      'selected.width_b',
      'selected.width_b_1',
      'selected.width_b_2',
      'selected.mass',
      'selected.root_radius',
      'selected.roughing_xsect',
      'selected.cogging_xsect',
      'selected.cogging_web',
      'selected.saw_crops_front',
      'selected.shear_loss',
      'selected.max_shear_length',
      'selected.control_roll',
      'loading',
      'dialogs.showCreateEdit'
    ]),
    localFlexFormData: {
      get() {
        return cloneDeep(JSON.parse(JSON.stringify(this.flex_form_data)));
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  // 弹出层应该这样判断
  mounted() {
    this.$watch(
      (vm) => [vm.showCreateEdit],
      () => {
        this.$refs.vform.validate(); // 手动触发表单校验
      }
    );

    this.getSectionType();
    this.getProductCode();
    this.getMillCodes();
    this.getToleranceCodes();
  },

  methods: {
    ...mapActions('product_type', [
      'save',
      'closeCreateEdit',
      'setSelectedFormDataAndSave'
    ]),
    handleDimChange() {


      if (this.product_class_code && this.dim1 && this.dim2 && this.dim3) {
        const formattedDim1 = this.dim1;
        const formattedDim2 = this.dim2;
        const formattedDim3 = this.dim3;

        const $code = `${this.product_class_code}-${formattedDim1}-${formattedDim2}-${formattedDim3}`;

        if ($code !== this.code) {
          this.code = $code;
        }
      }
    },

    async submitSaveLocal() {
      const {valid} = await this.$refs["vform"].validate();
      if (!valid) {
        return;
      }
      const flexFormDataClone = this.flex_form_data ? cloneDeep(JSON.parse(JSON.stringify(this.flex_form_data))) : {};
      const localFlexFormDataClone = this.localFlexFormData || {}; // 确保 localFlexFormData 不为 null 或 undefined

      this.setSelectedFormDataAndSave({
        flex_form_data: Object.assign(flexFormDataClone, localFlexFormDataClone)
      });
    }
    ,

    updateProductTypeDim() {
      if (this.product_category_code != null) {
        this.dim1 = String(Number(this.product_category_code.split("-")[0]));
        this.dim2 = String(Number(this.product_category_code.split("-")[1]));
      }
    },


    getSectionType() {
      productTypeApi.getSectionType('/product_category/codes')
        .then(response => {
          if (response.data && response.data.length) {
            this.productCategoryCodes = response.data;
          }
        });
    },

    getProductCode() {
      productTypeApi.getProductCode('/product_class/item/codes')
        .then(response => {
          if (response.data && response.data.length) {
            this.productClassCodes = response.data;
          }
        });
    },

    getMillCodes() {
      productTypeApi.commonRequestGet("/mill/item/codes")
        .then(response => {
          this.millCodes = response.data
        })
    },

    getToleranceCodes() {
      productTypeApi.commonRequestGet("/tolerance/item/codes")
        .then(response => {
          this.toleranceCode = response.data
        })
    }


  }
};
</script>
