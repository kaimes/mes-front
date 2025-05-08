<template>
  <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
    <v-navigation-drawer v-model="showCreateEdit" location="right" width="500">
      <template v-slot:prepend>
        <v-list-item lines="two">
          <v-list-item-title v-if="id" class="text-h6">Edit</v-list-item-title>
          <v-list-item-title v-else class="text-h6">New</v-list-item-title>
          <v-list-item-subtitle>Rolling</v-list-item-subtitle>

          <template #append>
            <v-btn icon :loading="loading" :disabled="!isValid.value" @click="submitSaveLocal()" variant="text">
              <v-icon color="primary" icon="mdi-content-save" />
            </v-btn>
            <v-btn variant="text" icon color="secondary" @click="closeCreateEdit()">
              <v-icon icon="mdi-close" />
            </v-btn>
          </template>
        </v-list-item>
      </template>
      <v-tabs fixed-tabs v-model="tab">
        <v-tab value="item">Rolling Plan</v-tab>
        <v-tab value="flex_form" v-if="flexFormSchema != null">Flex Form</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="item">
          <v-card flat>
            <v-card-text>
              <v-container grid-list-md>
                <v-row>
                  <v-col cols="6" md="6" xs6>
                    <v-text-field v-model="mill_code" label="Mill" hint="The unique key for the item." clearable
                      required name="Mill Code" :rules="[rules.required]" />
                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-text-field v-model="product_class_code" label="Product Class" hint=" " clearable required
                      name="product_class_code" :rules="[rules.required]" />

                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-combobox v-model="product_category_code" :items="productCategoryCodes" label="Section Type"
                      hint="The unique key for the item." clearable required name="product_category_code"
                      :rules="[rules.required]" :search-input.sync="search" @update:search-input="filterItems"
                      @update:modelValue="updateRollingDim" />
                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-combobox v-model="rolling_code" :items="rollingCodes" label="Rolling Code" hint=" " clearable
                      required name="rolling_code" :rules="[rules.required]" @update:modelValue="updateRollingPlanCode"
                      :search-input.sync="search" @update:search-input="filterItems" />
                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-text-field v-model="rolling_plan_code" label="Rolling Plan Code" hint=" " clearable required
                      name="short_code" :rules="[rules.required]" />
                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-text-field v-model="rolling_dim1" label="Rolling Dim1" hint=" " clearable required
                      name="rolling_dim1" :rules="[rules.required]" />
                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-text-field v-model="rolling_dim2" label="Rolling Dim2" hint=" " clearable required
                      name="rolling_dim2" :rules="[rules.required]" />
                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-combobox v-model="rolling_dim3" :items="dim3List" label="Rolling Dim3" hint=" " clearable
                      required name="rolling_dim3" :rules="[rules.required]" 
                      :search-input.sync="search" @update:search-input="filterItems" />
                  </v-col>

                  <v-col cols="6" md="6" xs6>
                    <v-text-field v-model="rolling_dim4" label="Rolling Dim4" hint="" clearable required
                      name="rolling_dim4" :rules="[rules.required]" />
                  </v-col>

                  <v-col cols="6" md="6">
                    <VueDatePicker v-model="programmed_start_date" @update:model-value="formatDate">
                      <template #trigger>
                        <v-text-field v-model="formattedDate" label="Programmed Date" readonly required
                          :rules="[rules.required]" @mouseenter="dateMenu = true" bg-color="white" hide-details
                          clearable></v-text-field>
                      </template>
                    </VueDatePicker>
                  </v-col>

                  <v-col cols="6" md="6">
                    <v-text-field v-model="duration_minutes" label="Duration in Minutes" type="number"
                      hint="A Duration in Minutes Date No for your item." clearable required name="Duration in Minutes"
                      :rules="[rules.required]" />
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-text-field v-model="programmed_tonnage" label="Programmed Total Tons" type="number"
                      hint="A Programmed Total TonsNo for your item." clearable required name="Programmed Total Tons"
                      :rules="[rules.required]" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item value="flex_form">
          <!-- <ItemFlexForm
            :formData="localFlexFormData"
            :formSchema="flexFormSchema"
          /> -->
        </v-window-item>
      </v-window>
    </v-navigation-drawer>
  </v-form>
</template>

<script>
import { required } from "@/util/form";
import rollingApi from "@/rolling/rolling_list/api";
import { mapFields } from "vuex-map-fields";
import { mapActions } from "vuex";
import { cloneDeep } from "lodash";
import { th } from "date-fns/locale";

export default {
  setup() {
    return {
      rules: { required },
      dim3List: [],
      productCategoryCodes: [],
      rollingCodes: [],
      search: '',
      dateMenu: false,
    };
  },
  name: "RollingNewEditSheet",

  components: {},
  data() {
    return {
      tab: null,
      flexFormSchema: null,
    };
  },
  computed: {
    ...mapFields("rolling_list", [
      "selected.id",
      "selected.mill_code",
      "selected.rolling_code",
      "selected.rolling_dim1",
      "selected.rolling_dim2",
      "selected.rolling_dim3",
      "selected.rolling_dim4",
      "selected.short_code",
      "selected.product_class_code",
      "selected.product_category_code",
      "selected.programmed_tonnage",
      "selected.programmed_start_date",
      "selected.duration_minutes",
      "selected.flex_form_data",
      "selected.loading",
      "dialogs.showCreateEdit",
    ]),
    localFlexFormData: {
      get() {
        return cloneDeep(JSON.parse(JSON.stringify(this.flex_form_data)));
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  mounted() {
    this.$watch(
      (vm) => [vm.showCreateEdit],
      () => {
        this.$refs.vform.validate(); // 手动触发表单校验
      }
    );
    this.getSectionType();
    this.getRollingCodes(); // 确保获取 Rolling Codes
    this.getDim3List()
  },

  methods: {
    ...mapActions("rolling_list", [
      "save",
      "closeCreateEdit",
      "setSelectedFormDataAndSave",
    ]),

    formatDate() {
      // 将 timestamp 转换为日期对象
      const date = new Date(this.programmed_start_date);

      // 检查日期对象是否有效
      if (!isNaN(date.getTime())) {
        // 格式化为本地日期和时间字符串
        this.formattedDate = date.toLocaleString(); // 可以根据需求调整参数
      } else {
        this.formattedDate = ""; // 如果无效则设置为空
      }

      this.dateMenu = false; // 选择后关闭菜单
    },



    submitSaveLocal() {
      this.setSelectedFormDataAndSave({
        flex_form_data: Object.assign(
          cloneDeep(JSON.parse(JSON.stringify(this.flex_form_data))),
          this.localFlexFormData
        ),
      });
    },

    filterItems() {
      // 可以在此处添加过滤逻辑
    },

    getSectionType() {
      rollingApi.getSectionType('/product_category/codes')
        .then(response => {
          if (response.data && response.data.length) {
            this.productCategoryCodes = response.data;
          }
        });
    },

    getRollingCodes() {
      rollingApi.getRollingCode('/rolling/item/codes')
        .then(response => {
          if (response.data && response.data.length) {
            this.rollingCodes = response.data;
          }
        });
    },

    getDim3List() {
      rollingApi.getRollingCode('/product_type/get/dim3')
        .then(response => {
          if (response.data && response.data.length) {
            this.dim3List = response.data;
          }
        });
    },

    updateRollingDim() {
      if (this.product_category_code != null) {
        this.rolling_dim1 = String(Number(this.product_category_code.split("-")[0]));
        this.rolling_dim2 = String(Number(this.product_category_code.split("-")[1]));
      }
    },

    updateRollingPlanCode() {
      if (this.rolling_code != null) {
        this.rolling_plan_code = this.rolling_code.split("-")[3];
      }
    },
  },
};
</script>
