<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialogs.MoveToShowBloom" max-width="1500" @click:outside="dialogClose">
      <v-card prepend-icon="mdi-information" title="Bloom Move to">
        <v-card-text>
          <v-row dense>
            <v-card title="Selected List" :text="dialogs.selectedCode" variant="flat"></v-card>
          </v-row>

          <v-row dense justify="center" align="center">

            <v-col>
              <v-text-field label="Semi Code" persistent-placeholder hide-details v-model="dialogs.selectedCode" :variant="textVariant" readonly density="compact"/>
            </v-col>
            <!-- <v-col>
                SiteType No.
                <v-combobox v-model="siteTypeNo" :items="siteTypeOptions" :variant="textVariant" clearable
                    required :menu-props="{ maxHeight: '250px' }" :search-input.sync="search"
                    @update:search-input="filterItems" @update:modelValue="getsiteBySiteType" />
            </v-col> -->
            <v-col>
              <SiteType
                  v-model="siteTypeNo"
                  :code="siteTypeOptions"
                  type="semi"
                  :variant="textVariant"
                  clearable
                  required
                  :search-input.sync="search"
                  label="SiteType No."
                  :hide-details="true"
              />
            </v-col>

            <v-col>
              <Site
                  v-model="siteNo"
                  :code="siteOptions"
                  type="semi"
                  :variant="textVariant"
                  clearable
                  required
                  :search-input.sync="search"
                  label="Site No."
                  :hide-details="true"
              />
            </v-col>
            <v-col>
              <AreaCode
                  v-model="areaNo"
                  :code="areaOptions"
                  type="semi"
                  :variant="textVariant"
                  clearable
                  required
                  :search-input.sync="search"
                  density="compact"
                  label="Area No."
                  :hide-details="true"
              />
            </v-col>

            <v-col>
              <v-text-field label="Quantity" persistent-placeholder hide-details placeholder="Quantity" :variant="textVariant" density="compact"
                            v-model="dialogs.selectedQuantity" readonly type="number"></v-text-field>
            </v-col>

            <v-col>
              <v-text-field label="More Info..." persistent-placeholder hide-details placeholder="More Info..." :variant="textVariant" density="compact"
                            v-model="location"></v-text-field>
            </v-col>

            <v-col class="d-flex justify-center">
              <v-btn @click="addInfo" icon :disabled="dialogs.selectedQuantity <= 1"
                     @update:modelValue="dialogs.selectedQuantity">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>


          <v-row v-for="(row, index) in rows" :key="index" dense justify="center" align="center">
            <v-col>
              <SiteType
                  v-model="row.siteTypeNo"
                  :code="siteTypeOptions"
                  type="semi"
                  :variant="textVariant"
                  clearable
                  required
                  :menu-props="{ maxHeight: '250px' }"
                  :search-input.sync="search"
                  label="SiteType No."
                  :hide-details="true"
                  class="same-height"
              />
            </v-col>

            <v-col>
              <Site
                  v-model="row.siteNo"
                  :code="siteOptions"
                  type="semi"
                  :variant="textVariant"
                  clearable
                  required
                  :menu-props="{ maxHeight: '3000px' }"
                  :search-input.sync="search"
                  label="Site No."
                  :hide-details="true"
                  class="same-height"
              />
            </v-col>
            <v-col>
              <AreaCode
                  v-model="row.areaNo"
                  :code="areaOptions"
                  type="semi"
                  :variant="textVariant"
                  clearable
                  required
                  :search-input.sync="search"
                  density="compact"
                  label="Area No."
                  :hide-details="true"

              />
            </v-col>

            <v-col>
              <v-text-field label="Quantity" persistent-placeholder placeholder="Quantity" :variant="textVariant" v-model="row.selectedQuantity"
                            density="compact"
                            hide-details
                            @update:modelValue="handleSelectedQuantityChange(row)" type="number"
                            hide-spin-buttons
                            :rules="[
                                    value => !!value || 'Quantity cannot be empty',
                                    value => value > 0 || 'Quantity must be greater than zero'
                                ]"></v-text-field>
            </v-col>

            <v-col>
              <v-text-field placeholder="More Info..." label="More Info..." hide-details persistent-placeholder :variant="textVariant" density="compact"
                            v-model="row.location"></v-text-field>
            </v-col>

            <v-col class="d-flex justify-center">
              <v-btn @click="removeRow(index, row)" icon>
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-col>

          </v-row>

          <div class="font-weight-medium">Are you sure to move this semi?</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn class="text-none" color="#e3e3e3" variant="flat" :loading="loading"
                 @click="colseDialogBloomByButton" style="margin-right: 16px;">Close
          </v-btn>

          <v-btn class="text-none mr-4" color="primary" variant="flat" @click="inputText" :disabled="isQuantityInvalid">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapState, mapActions} from "pinia";
import {useSemiStore} from "@/semi_admin/semi/storePinia";
import Api from "@/semi_admin/semi/api";
import {toast} from "vue3-toastify";
import {reactive, ref} from 'vue';
import SiteType from "@/components/picker/SiteType.vue";
import Site from "@/components/picker/Site.vue";
import AreaCode from "@/components/picker/AreaCode.vue";

export default {
  components: {AreaCode, Site, SiteType},
  data() {
    return {
      textVariant: "outlined",
      siteNo: "",
      areaNo: "",
      siteTypeNo: "",
      location: "",
      siteOptions: [],
      areaOptions: [],
      siteTypeOptions: [],
      alert: false,
      rows: [],
      listened: false, // 监听标识位
      initQuantity: "", // 用于恢复
      isAddingRow: false, // 用于标记是否在添加新行
    }
  },

  computed: {
    ...mapState(useSemiStore, ["table", "dialogs", "shouldExecuteGetAll"]),
    isQuantityInvalid() {
      return this.rows.some(row => row.selectedQuantity <= 0 || row.selectedQuantity === '');
    }
  },

  methods: {
    ...mapActions(useSemiStore, [
      // 'colseDialogBloomByButton',
      'getAll',
      'getAllNew'
    ]),

    colseDialogBloomByButton(alter) {
      alert = false
      this.dialogs.MoveToShowBloom = !this.dialogs.MoveToShowBloom
      this.resetForm();
    },
    resetForm() {
      this.rows = [];

      this.siteNo = "";
      this.areaNo = "";
      this.location = "";
      this.siteTypeNo = "";

      this.isAddingRow = false;
      this.listened = false;
      this.initQuantity = "";
    },

    dialogClose() {
      this.alert = false;
    },

    addInfo() {
      // 标记当前正在添加新行
      this.isAddingRow = true;

      // 先弄一个列表存预创建的semi code
      let preCreatedSemiCode = [];
      if (this.rows.length > 0) {
        this.rows.forEach(element => {
          preCreatedSemiCode.push(element.newSemiCode)
        });
      }
      const state = reactive(this.table.rows.selectedItems);

      if (preCreatedSemiCode.length == 0) {
        // 发送请求获取主semi里cast中的semi code最大值  先造一个假数据模拟一把

        // let firstSemiCode = this.getMaxSemiCode(this.dialogs.selectedCode)


        // preCreatedSemiCode = [firstSemiCode]

        // preCreatedSemiCode = ["77270-06E1"]
      }
      if (preCreatedSemiCode.length > 0) {
        let maxSemiCode = preCreatedSemiCode[preCreatedSemiCode.length - 1];
        let generateSemiCode = '';
        if (/\d$/.test(maxSemiCode)) { // 检查最后一个字符是否是数字
          // 获取最后一个字符，并加 1
          let lastChar = maxSemiCode[maxSemiCode.length - 1];
          let newLastChar = (parseInt(lastChar) + 1).toString(); // 将字符转为数字，加 1 后转回字符串
          generateSemiCode = maxSemiCode.slice(0, -1) + newLastChar; // 将原字符串的最后一位替换成新的数字
        } else {
          // 如果最后一个字符不是数字，直接在最后添加数字 "1"
          generateSemiCode = maxSemiCode + '1';
        }
        preCreatedSemiCode.push(generateSemiCode);
      }

      console.log(preCreatedSemiCode);

      // 只创建数组中最后一个code的行
      let lastCode = preCreatedSemiCode[preCreatedSemiCode.length - 1]; // 获取数组中的最后一个semi code
      let prevMainQuantity = this.dialogs.selectedQuantity;
      let p = {
        newSemiCode: lastCode,
        siteTypeNo: '',
        siteNo: '',
        areaNo: '',
        selectedQuantity: 1,
        location: '',
        isNewRow: true, // 标记为新行
        estimated_weight_kg: this.dialogs.selectedEstimatedWeight,
        unitWeight: this.dialogs.unitWeight,
      }
      this.rows.push(p);
      this.handleSelectedQuantityChange(p)
      this.dialogs.selectedQuantity = prevMainQuantity - 1;
    },

    removeRow(index, row) {
      this.dialogs.selectedQuantity = Number(row.selectedQuantity) + Number(this.dialogs.selectedQuantity)
      this.rows.splice(index, 1);
    },


    handleSelectedQuantityChange(row) {
      let addedRowsCount = this.rows.filter(r => r.selectedQuantity > 0).length;
      if (Number(row.selectedQuantity) < 0) {
        row.selectedQuantity = 0;
      }
      const state = reactive(this.table.rows.selectedItems);

      if (row.selectedQuantity) {
        if (!this.listened) {
          this.initQuantity = this.dialogs.selectedQuantity;
          this.listened = true;
        }
      }

      if (row) {
        let sumRowsQuantity = 0
        this.rows.forEach(e => {
          if (e.selectedQuantity === 0 || e.selectedQuantity === '') {
            sumRowsQuantity = this.dialogs.selectedQuantity;
          } else {
            sumRowsQuantity = Number(sumRowsQuantity) + Number(e.selectedQuantity);
          }
        })

        let result = this.initQuantity - sumRowsQuantity;

        if (result < 0) {
          if (row.selectedQuantity > 0) {
            this.dialogs.selectedQuantity = this.initQuantity - (sumRowsQuantity - row.selectedQuantity) - 1;
            row.selectedQuantity = 1;
          } else {
            let totalSelectedQuantity = 0;
            this.rows.forEach(e => {
              if (e.selectedQuantity > 0) {
                totalSelectedQuantity += Number(e.selectedQuantity);
              }
            });
            if (totalSelectedQuantity > 1) {
              this.dialogs.selectedQuantity = sumRowsQuantity - totalSelectedQuantity + 1;
            } else {
              this.dialogs.selectedQuantity = sumRowsQuantity;
            }

          }
        } else {
          if (row.selectedQuantity > this.initQuantity) {
            this.dialogs.selectedQuantity = result - 1;
            row.selectedQuantity = 1;
          } else {
            if (row.selectedQuantity === '') {
              let totalSelectedQuantity = 0;
              this.rows.forEach(e => {
                if (e.selectedQuantity > 0) {
                  totalSelectedQuantity += Number(e.selectedQuantity);
                }
              });
              this.dialogs.selectedQuantity = this.initQuantity - totalSelectedQuantity;
            } else {
              this.dialogs.selectedQuantity = result;
            }

          }
        }
      }

      const estimatedWeight = row.selectedQuantity * row.unitWeight;
      this.dialogs.selectedEstimatedWeight = this.dialogs.selectedQuantity * row.unitWeight;
      row.estimated_weight_kg = estimatedWeight;
    },

    async inputText() {
      const requestData = [];
      const oneState = reactive(this.table.rows.selectedItems)
      const state = reactive(this.rows);
      if (!oneState || oneState.length === 0) {
        this.alert = true;
        toast.error("Please select at least one Semi!", {autoClose: 60000}
        )
        return; // 退出方法
      }

      if (this.siteNo === "" || this.areaNo === "") {
        toast.error("Please select at Site or Area!", {autoClose: 60000}
        )
        return;
      }

      if (oneState && oneState.length > 0) {
        for (let item of oneState) {
          requestData.push({
            site_id: this.siteNo,
            area_id: this.areaNo,
            location: this.location,
            site_type_id: this.siteTypeNo,
            quantity: this.dialogs.selectedQuantity,
            estimated_weight_kg: this.dialogs.selectedEstimatedWeight,
            id: item.id,
          });
        }
      }

      if (state && state.length > 0) {
        for (let [index, item] of state.entries()) {
          const oneStateItem = oneState[index];
          if (oneStateItem) {
            const data = {
              site_id: this.siteNo,
              area_id: this.areaNo,
              location: this.location,
              site_type_id: this.siteTypeNo,
              quantity: item.selectedQuantity,
              estimated_weight_kg: item.estimated_weight_kg,
              cast_id: oneStateItem.cast_id,
              quality_code: oneStateItem.quality_code,
              quality_id: oneStateItem.quality_id,
              mill_id: oneStateItem.mill_id,
              semi_type: oneStateItem.semi_type,
              semi_status: oneStateItem.semi_status,
              supplier_code: oneStateItem.supplier_code,
              length_mm: oneStateItem.length_mm,
              width_mm: oneStateItem.width_mm,
              thickness_mm: oneStateItem.thickness_mm,
            };

            requestData.push(data);
          } else {
            console.error(`No corresponding item found in oneState, index: ${index}`);
          }
        }
      }

      const reqData = {requestData};

      if (requestData.length === 0) {
        this.alert = true;
        return;
      }

      await Api.updateSemi('/semi/bloom/move', reqData).then(res => {
        if (this.shouldExecuteGetAll) {
          this.getAllNew();
        }

        toast.success("Semi move successfully!", {position: "bottom-center"})
        this.dialogs.MoveToShowBloom = false; // 关闭对话框
        this.$emit("refresh");
        // this.colseDialogBloomByButton();
      }).catch(error => {
        console.error(error);
        this.alert = true; // 显示错误
      })

      // 清空输入
      this.siteNo = "";
      this.areaNo = "";
      this.location = "";
      this.siteTypeNo = "";
      this.selectedQuantity = "";
      this.quantity = "";
      this.rows = [];
    },

    getMaxSemiCode(semiCode) {
      Api.commenRequestGet(`/semi/find/max_code/${semiCode}`).then(response => {
        return response.data
      }).catch(error => {
        console.error(error);
        return;
      });
    },

    getArea() {
      Api.getSemi('/area/item/codes').then(response => {
        if (response.data && response.data.length) {
          this.areaOptions = response.data;
        }
      })
    },
    getSite() {
      Api.getSemi('/site/item/codes')
          .then(response => {
            if (response.data && response.data.length) {
              this.siteOptions = response.data;
            }
          });
    },


    getSiteType() {
      Api.getSemi('/site_type/item/codes')
          .then(response => {
            if (response.data && response.data.length) {
              this.siteTypeOptions = response.data;
            }
          });
    },

    getAreaBySite() {
      if (!this.siteNo) {
        // 如果 siteNo 为空，直接返回，避免发送无用请求
        this.areaOptions = [];
        return;
      }

      // 使用模板字符串将 siteNo 插入到 URL 中
      const url = `/area/item/get_area_by_site/${this.siteNo}`;

      Api.getSemi(url).then(response => {
        if (response.data && response.data.length) {
          // 更新 areaOptions 为接口返回的数据
          this.areaOptions = response.data;
        } else {
          // 如果没有数据，清空 areaOptions
          this.areaOptions = [];
        }
      }).catch(error => {
        console.error(error);
        // 如果请求失败，也清空 areaOptions
        this.areaOptions = [];
      });
    },

    getsiteBySiteType() {
      if (!this.siteTypeNo) {
        // 如果 siteTypeNo 为空，直接返回，避免发送无用请求
        this.siteOptions = [];
        return;
      }

      // 使用模板字符串将 siteNo 插入到 URL 中
      const url = `/site/item/get_site_by_site_type/${this.siteTypeNo}`;

      Api.getSemi(url).then(response => {
        if (response.data && response.data.length) {
          // 更新 areaOptions 为接口返回的数据
          this.siteOptions = response.data;
        } else {
          // 如果没有数据，清空 areaOptions
          this.siteOptions = [];
        }
      }).catch(error => {
        console.error(error);
        // 如果请求失败，也清空 areaOptions
        this.siteOptions = [];
      });
    },


    findSiteByArea(row) {

      if (row) {
        const url = `/area/item/get_site_by_area/${row.areaNo}`;
        Api.getSemi(url).then(response => {
          row.siteNo = response.data.site_code,
              row.siteTypeNo = response.data.site_type_code
        }).catch(error => {
          console.error(error);
          row.siteNo = "",
              row.siteTypeNo = ""
        })
      } else {
        if (!this.areaNo) {
          return
        }
        const url = `/area/item/get_site_by_area/${this.areaNo}`;
        Api.getSemi(url).then(response => {
          this.siteNo = response.data.site_code,
              this.siteTypeNo = response.data.site_type_code
        }).catch(error => {
          console.error(error);
          this.siteNo = "",
              this.siteTypeNo
        })
      }

    },

  },

  mounted() {
    this.getSite();
    this.getArea();
    this.getSiteType();
  },
  watch: {
    // 监听 siteNo 变化，如果 siteNo 为空，清空 areaNo
    siteNo(newValue) {
      if (!newValue) {
        this.getArea();
        this.areaNo = ""
      }
    },

    siteTypeNo(newValue) {
      if (!newValue) {
        this.getSite();
        this.siteNo = ""
      }
    },
    "row.siteTypeNo"(newValue) {
      if (!newValue) {
        this.getSite();
        this.row.siteNo = "";  // 重置 siteNo
      }
    },
    // 监听 row.siteNo 的变化
    "row.siteNo"(newValue) {
      if (!newValue) {
        this.getArea();
        this.areaNo = "";  // 重置 areaNo
      }
    }


  }
}
</script>
