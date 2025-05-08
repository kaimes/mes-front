<template>
    <FormDialog
        v-model="visible"
        :width="1000"
        :title="'Add'"
        :desc="'Create Load'"
        :loading="loading"
        @close="handleClose"
        @save="handleSave"
        v-if="visible"
    >
  
  
      <v-form ref="editForm">
        <v-row>
          <v-col cols="2">
            <v-text-field
                v-model="form.seq_no"
                variant="underlined"
                label="Sequence No"
                bg-color="white"
                disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                  v-model="form.order_code"
                  variant="underlined"
                  label="Order Code"
                  bg-color="white"
                  disabled
              ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                  v-model="form.item_code"
                  variant="underlined"
                  label="Item Code"
                  bg-color="white"
                  disabled
              ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                  v-model="form.customer_name"
                  variant="underlined"
                  label="Customer Name"
                  bg-color="white"
                  disabled
              ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                v-model="length"
                variant="underlined"
                label="Length(mm)"
                bg-color="white"
                @change="handleLength"
                :disabled="lengthEdit"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                  v-model="kgm"
                  variant="underlined"
                  label="KGM"
                  bg-color="white"
                  disabled
              ></v-text-field>
          </v-col>
         </v-row>
         <v-row>
          <v-col cols="2">
            <v-text-field
                v-model="form.quality_code"
                variant="underlined"
                label="Quality Code"
                bg-color="white"
                disabled
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                  v-model="form.no_bars"
                  variant="underlined"
                  label="No Bars"
                  bg-color="white"
                  @change="handleNoBars"
              ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                  v-model="form.total_tonnes"
                  variant="underlined"
                  label="Total Tonnes"
                  bg-color="white"
                  disabled
              ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                  v-model="form.planned_tonnes"
                  variant="underlined"
                  label="Planned Tonnes"
                  bg-color="white"
                  disabled
              ></v-text-field>
          </v-col>
          <v-col cols="2">
            <DictCode
              v-model="form.pta_code"
              code="cut_sequence_destination"
              label="Destination"
              variant="underlined"
              :hide-details="false"
              :clearable="true"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                v-model="form.strps"
                variant="underlined"
                label="Strps"
                bg-color="white"
            ></v-text-field>
          </v-col>
         </v-row>
         <v-row>
          <v-col cols="12">
            <v-text-field
                v-model="form.remarks"
                variant="underlined"
                label="Planner Remarks"
                bg-color="white"
            ></v-text-field>
          </v-col>
         </v-row>

         <!-- <v-divider></v-divider> -->
         <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Order Item Remarks">
            <v-expansion-panel-text>
              <v-data-table
                  height="250"
                  :headers="headers"
                  :items="orderItemRemarks"
                  :loading="loading"
                  return-object
                  fixed-header
                  :items-per-page="100"
                  :page.sync="1"
              >
                <template #bottom>
                </template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
         </v-expansion-panels>
      
      <template v-if="form.id">
  
          <div class="d-flex flex-column">
          <v-btn
            variant="outlined"
            prepend-icon="mdi-plus"
            @click="handleAddItem"
            class="mb-3 mt-5 align-self-end"
            :disabled="false"
          >
            Add
          </v-btn>
        </div>
       
        <div v-for="(item, index) in form.items" class="mult" :key="item.key" >
          <div class="mult-content pa-4 border rounded flex-grow-1">
            <v-row>
            <v-col cols="1" v-if="item.id">
                <span class="d-flex align-center ga-2 mt-5 ml-4">
                  <v-icon size="small" @click="handleViewDetail(item)">mdi-pencil</v-icon>
                </span>
            </v-col>
            <v-col cols="2">
                <v-text-field
                  v-model="item.cut_seq_load_no"
                  class="no-input-control "
                  density="default"
                  variant="underlined"
                  label="Load No"
                  bg-color="white"
              />
            </v-col>
  
            <v-col cols="2">
                <v-text-field
                  v-model="item.bundle_size"
                  class="no-input-control "
                  density="default"
                  variant="underlined"
                  label="Bundle Size"
                  bg-color="white"
                  @change="handleBundleSize(index)"
              />
            </v-col>
  
            <v-col cols="3">
              <v-text-field
                  v-model="item.total_weight_ton"
                  :class="`bundle-size-${getTextColor(item.total_weight_ton)}`"
                  density="default"
                  variant="underlined"
                  label="Load Weight"
                  bg-color="white"
                  disabled
              />
            </v-col>
  
            <v-col cols="4">
              <v-text-field
                  v-model="item.transport_restrict"
                  variant="underlined"
                  label="Transport Restrictions"
                  bg-color="white"
              ></v-text-field>
            </v-col>
  
            </v-row>
          </div>
          <div class="mult-action d-flex ga-2 align-center ml-2">
            <template v-if="form.items.length > 1">
              <v-btn density="comfortable" variant="outlined" icon="mdi-minus" @click="handleRemoveItem(item)"></v-btn>
            </template>
            
            <v-btn density="comfortable" variant="outlined" icon="mdi-dock-window" @click="handleCopyItem(item)"></v-btn>
          </div> 
       </div>
      </template>
  
    </v-form>
    </FormDialog>
  </template>
  <script setup>
  import {v4 as uuidv4} from 'uuid';
  import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
  import {reject} from "lodash";
  import { useRouter } from "vue-router";
  import { VNumberInput } from 'vuetify/labs/VNumberInput'
  import FormDialog from "@/components/FormDialog.vue";
  import DictCode from "@/components/picker/DictCode.vue";
  import {toast} from "vue3-toastify";
  import SpecCode from "@/components/picker/SpecCode.vue";
  import CastCode from "@/components/picker/CastCode.vue";
  import ProductCategoryCode from "@/components/picker/ProductCategoryCode.vue";
  import useCommonStore from "@/app/common";
  import {greaterThan, isThanZero} from "@/util/util";
  import MillCode from "@/components/picker/MillCode.vue";
  import API from "../api.js"
  import { max } from 'date-fns';
  
  
  const commonStore = useCommonStore();
  const router = useRouter();
  const visible = ref(false);
  const loading = ref(false);
  const panel = ref([0, 1]);
  
  const product_type_min = reactive({dim3: undefined});
  const product_type_max = reactive({dim3: undefined});
  const latest_load_no = ref('E001');
  const exist_load = ref({});
  const sawRouteMap = {
    "East": "E",
    "West": "W"
  }
  const saw_type = ref('');
  // 记录当前cut seq已经装车的根数
  const current_bars = ref(0);
  const lengthEdit = ref(true);
  
  const data = reactive({
    form: {
      id: undefined,
      seq_no: undefined,
      order_code: undefined,
      item_code: undefined,
      customer_name: undefined,
      quality_code: undefined,
      no_bars: undefined,
  
      total_tonnes: undefined,
      planned_tonnes: undefined,
      pta_code: undefined,
      strps: undefined,
      remarks: undefined,
      
      items: [{
        cut_seq_load_no: undefined,
        bundle_size: undefined,
        total_weight_ton: undefined,
        transport_restrict: undefined,
        key: uuidv4(),
      }]
    },
    rules: {
        cut_seq_load_no: [
        value => {
          if (value) {
            let result = getLoadNo(value);
            if (result) return true;
            return 'Load No is invalid.'
          }
          return 'Load No is required.'
        }
      ],
      bundle_size: [
        value => {
            if (value) {
                if (validateInput(value)) return true;
                return 'Bundle size is like 5*12'
            }
            return 'Bundle size is required.'
        }
      ]
    },
    kgm: undefined,
    length: undefined,
    originLength: undefined,
    load_no_options: [],
    // order item remarks
    orderItemRemarks: [],
    ptaCode: undefined,
  });
  
const { form, rules, kgm, length,originLength, load_no_options, orderItemRemarks, ptaCode } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const headers = [
  // {title: 'Action', key: 'action', minWidth: 60, fixed: true, sortable: false, align: "center"},
  {title: 'Type', key: 'type', sortable: true},
  {title: 'Identifier', key: 'identifier', sortable: true},
  {title: 'Text', key: 'text', sortable: true, sortable: true}
];
  
  const handleSpecCodeChange = (data, item) => {
    item.short_name = data?.short_name;
    item.spec = data;
  }

  const getTextColor = (load_weight) => {
    const loadWeight = parseFloat(load_weight);
    if (isNaN(loadWeight)) {
        return 'black';
    }
    if (loadWeight < 20) {
        return 'orange';
    } else if (loadWeight >= 20 && loadWeight < 26) {
        return 'green';
    } else {
        return 'red';
    }
  };

  const validateInput = (input) => {
    // 定义正则表达式
    // 输入内容是 5*12 或者 5 * 12 这种就是合法的，而且可以允许用逗号分隔写多组这样的算式
    const pattern = /^\s*\d+\s*\*\s*\d+(\s*,\s*\d+\s*\*\s*\d+)*\s*$/;
    return pattern.test(input);
  }

  const calculateLoadWeight = (bundle_size) => {
    // bundle_size 根据 * 切割，返回两个数字
    let parts = bundle_size.trim().split(/\s*\*\s*/);
    let [left, right] = parts.map(part => parseInt(part));
    let load_weight = (length.value / 1000) * kgm.value * left * right;
    console.log(`${length.value / 1000}*${kgm.value}*${left}*${right}`)
    return load_weight;
  }

  const calculatePlannedTonnes = (items) => {
    let planned_tonnes = 0;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.bundle_size) {
        let bundle_sizes = item.bundle_size.split(',')
        for (let j = 0; j < bundle_sizes.length; j++) {
          let load_weight = calculateLoadWeight(bundle_sizes[j]);
          planned_tonnes += load_weight / 1000;
        }
      }
    };
    return planned_tonnes.toFixed(3);
  }


  const handleLength = () => {
    form.value.planned_tonnes = calculatePlannedTonnes(form.value.items);
    // 更新当前cut sequence load 的 weight
    form.value.items.map(item => {
      if (item.bundle_size) {
        // 差值
        const diff = (originLength.value - length.value) / 1000;
        if(diff === 0){
          item.total_weight_ton = item.origin_weight_ton;
        } else {
          const bundle_sizes = item.bundle_size.split(',')
          let total_parts = 0
          bundle_sizes.map(bs => {
            const parts = bs.trim().split(/\s*\*\s*/);
            const [left, right] = parts.map(part => parseInt(part));
            total_parts += left * right
          })
          const new_weight_diff = ((total_parts* diff * kgm.value) / 1000)
          const new_weight = (item.origin_weight_ton - new_weight_diff).toFixed(3)
          item.total_weight_ton = new_weight
        }
      }
    })
  }

  const handleNoBars = () => {
    if (form.value.no_bars) {
      const curTotalTones = parseInt(form.value.no_bars) * kgm.value * (length.value / 1000) / 1000;
      form.value.total_tonnes = parseFloat(curTotalTones).toFixed(2);
    }
  }

  const calculateBundleSize = (bundle_size) => {
    if (validateInput(bundle_size)) {
        const bundle_sizes = bundle_size.split(',')
        if (length.value && kgm.value) {
          let total_weight = 0;
          for (let i = 0; i < bundle_sizes.length; i++) {
            let load_weight = calculateLoadWeight(bundle_sizes[i]);
            total_weight += parseFloat((load_weight / 1000).toFixed(3));
          }
          return total_weight
        }
    }
  }

  const handleBundleSize = (index) => {
    let current_item = form.value.items[index];
    let current_weight_ton = current_item.total_weight_ton;
    let current_bundle_size = current_item.bundle_size;
    if (validateInput(current_bundle_size)) {
      const new_bundle_size = calculateBundleSize(current_item.bundle_size)
      console.log("new bundle size===", new_bundle_size)
      console.log("origin bundle size===", current_item.origin_bundle_size)
      let diff_bundle_size = 0;
      let total = 0;
      if (current_item.origin_bundle_size == undefined) {
        diff_bundle_size = parseFloat(new_bundle_size)
        total = diff_bundle_size
      } else {
        diff_bundle_size = parseFloat(new_bundle_size) - parseFloat(current_item.origin_bundle_size)
        total = diff_bundle_size + parseFloat(current_item.origin_weight_ton)
      }
      current_item.total_weight_ton = total.toFixed(3);
      // 更新 plan 中的 total_weight_ton
      form.value.planned_tonnes = new_bundle_size.toFixed(3)
    } else {
        current_item.total_weight_ton = undefined;
    }
  }


  const handleViewDetail = (item) => {
    router.push({
        path: "/finished_product_load_detail", query: { load_id: item.id }
    })
  }

  
  const handleShow = async (data, saw_route, planned_tonnes) => {
    // 记录create load 页面的saw route
    saw_type.value = sawRouteMap[saw_route];
    if (data) {
      const loadItems = [];
      let new_load_no = undefined;
      let weight_ton = 0

      if (!data.order_item) {
        lengthEdit.value = false;
      } else {
        lengthEdit.value = true;
      }

      // 获取kgm, length, 计算 load weight
      length.value = data.length;
      originLength.value = data.length;
      kgm.value = data.order_group?.product_type?.dim3;
      ptaCode.value = data.pta_code;

      const queryParams = {
          rolling_id: data.rolling_id,
          order_group_id: data.order_group_id,
          saw_route: sawRouteMap[saw_route]
      }
      try {
        // 获取当前cut seq 已经创建过的load
        let resp = await API.getLoads(data.id);
        // 获取最新的 load no
        new_load_no = await API.getLoadOptions(queryParams)
        // 如果没有创建的load，默认从 E001 或者 W001 开始
        if (!new_load_no.data) {
            latest_load_no.value = formatLoadNo(sawRouteMap[saw_route], 1)
        } else {
            // 如果获取到最新的 load no
            weight_ton = new_load_no?.data?.total_weight_ton;
            let load_no = new_load_no?.data?.cut_seq_load_no;
            latest_load_no.value = load_no;
            // 如果获取到的最新 load no 没有装满
            if (weight_ton < 26.0) {
              exist_load.value[load_no] = new_load_no?.data
            } else {
              // 最新load no 装满了
              exist_load.value = {};
              // latest_load_no.value = formatLoadNo(saw_type.value, getLoadNo(load_no))
            }
        }
 
        loadItems.length = 0; 
        // 将新数据添加到原数组
        resp.data.forEach(item => {
            // 解析 bundle_size
            item.bundle_size = JSON.parse(item.bundle_size)[data.id] || ''
            // 计算原始的bundle_size重量
            item.origin_bundle_size = calculateBundleSize(item.bundle_size);
            item.key = uuidv4();
            item.origin_weight_ton = item.total_weight_ton;
            loadItems.push(item);
        });
      } catch (err) {
        toast.error(err?.response?.data?.detail || err?.response?.data?.data?.tip || "Get loads by cut sequence failed!", {
          autoClose: 60000,
          style: {
            width: 'max-content'
          }
        });
      }
      
      console.log("loadItems===", loadItems)
      let items = undefined;
      if (loadItems.length > 0) {
        items = loadItems;
      } else {
        // 没有cut seq plan 没有创建过load，则需要后端返回当前Route的最新load
        if (!new_load_no.data) {
          latest_load_no.value = formatLoadNo(saw_type.value, 1)
        }
        if(weight_ton >= 26.0){
          latest_load_no.value = formatLoadNo(saw_type.value, getLoadNo(latest_load_no.value) + 1)
        }
        items = [{
            cut_seq_load_no: latest_load_no.value,
            bundle_size: undefined,
            total_weight_ton: undefined,
            origin_weight_ton: 0,
            origin_bundle_size: 0,
            transport_restrict: undefined,
            key: uuidv4(),
        }]
        let load_obj = exist_load.value[latest_load_no.value];
        if (load_obj) {
            items[0].id = load_obj.id;
            items[0].total_weight_ton = load_obj.total_weight_ton;
            items[0].origin_weight_ton = load_obj.total_weight_ton;
            items[0].transport_restrict = load_obj.transport_restrict;
        }
        
      }
      form.value = {
        id: data.id,
        seq_no: data.new_seq,
        order_code: data.order_item?.order?.order_code,
        item_code: data.order_item?.line_item_code,
        customer_name: data.order_item?.order?.customer_full_name,
        quality_code: data.order_item?.quality_code,
        no_bars: data.new_bars,
        pta_code: data.pta_code,
        total_tonnes: data.weight,
        planned_tonnes: calculatePlannedTonnes(items),
        pta_code: data.pta_code,
        strps: data.strps,
        remarks: data.remarks,
        items: items,
      };
      
      orderItemRemarks.value = data.order_item?.order_item_remarks;
      // orderItemRemarks.value = [];
    }
    form.force = false
    visible.value = true;
  }
  
  const handleClose = () => {
    visible.value = false;
    latest_load_no.value = undefined;
    exist_load.value = {};
    saw_type.value = '';
    length.value = undefined;
    kgm.value = undefined;
    orderItemRemarks.value = [];
    lengthEdit.value = false;
    form.value = {
        id: undefined,
        seq_no: undefined,
        order_code: undefined,
        item_code: undefined,
        customer_name: undefined,
        quality_code: undefined,
        no_bars: undefined,
        pta_code: undefined,
        total_tonnes: undefined,
        planned_tonnes: undefined,
        pta_code: undefined,
        strps: undefined,
        remarks: undefined,
      items:[
        {
            cut_seq_load_no: undefined,
            bundle_size: undefined,
            total_weight_ton: undefined,
            transport_restrict: undefined,
            key: uuidv4(),
        }
      ],
    };
    // nextTick(() => {
    //   proxy.$refs["editForm"].resetValidation();
    // })
  }
  
  const handleSave = async () => {
    const {valid} = await proxy.$refs["editForm"].validate();
    if (!valid) {
      return;
    }
    loading.value = true;
    const update_loads = [];
    const loads = [];
    const bundleInfo = {};
    form.value.items.forEach(item => {
        let newItem = {};
        newItem.cut_seq_load_no = item.cut_seq_load_no;
        newItem.bundle_size = item.bundle_size;
        newItem.total_weight_ton = parseFloat(item.total_weight_ton);
        newItem.transport_restrict = item.transport_restrict;
        if (item.id) {
            newItem.id = item.id;
            update_loads.push(newItem)
        } else {
          if (newItem.bundle_size) {
            loads.push(newItem);
          }
        };
    })
    const params = {
        cut_seq_id: form.value.id,
        pta_code: form.value.pta_code,
        new_bars: form.value.no_bars,
        length_mm: length.value,
        strps: form.value.strps,
        remarks: form.value.remarks,
        weight: form.value.total_tonnes,
        loads: loads,
        update_loads: update_loads
    };
    // delete params.spec;
    if (!params.id) {
      delete params.spec;
    }
    try {
      await API.createLoad(params);
      handleClose();
      emit("refresh");
      toast.success(params.id ? "Update Success" : "Create Success", {
        position: "bottom-center",
      });
    } catch (res) {
      window.res = res.response
      toast.error(res?.response?.data?.detail || res?.response?.data?.data?.tip|| params.id ? "Update Fail" : "Create Fail", {
        autoClose: 60000,
        style: {
          width: 'max-content'
        }
      });
    } finally {
      loading.value = false;
    }
  }

  const formatLoadNo = (type, load_no) => {
    let load_no_format = String(load_no).padStart(3, '0');
    return `${type}${load_no_format}`;
  }
  
  const handleAddItem = () => {
    let new_load_no = undefined;
    if (ptaCode.value === 'ADC') {
      new_load_no = null;
    } else {
      let load_obj = exist_load.value[latest_load_no.value];
      new_load_no = formatLoadNo(saw_type.value, getLoadNo(latest_load_no.value) + 1);
      latest_load_no.value = new_load_no;
    }
    form.value.items.push({
        cut_seq_load_no: new_load_no,
        bundle_size: undefined,
        total_weight_ton: undefined,
        origin_weight_ton: 0,
        transport_restrict: undefined,
        key: uuidv4(),
    });

  }
  
  const handleRemoveItem = (item) => {
    const { items } = toRaw(form.value);
    form.value.items = reject(items, {key: item.key});
    // let remaining_items = form.value.items
    // // 重新给剩余load no 赋值
    // for (let i = 0; i < remaining_items.length; i++) {
    //   remaining_items[i].cut_seq_load_no = formatLoadNo("E", i + 1);
    // }

    // // 找到剩余元素的最大load no
    // let max_load_no_id = 0;
    // for (let i = 0; i < remaining_items.length; i++) {
    //     let load_no_id = getLoadNo(remaining_items[i].cut_seq_load_no);
    //     if (load_no_id > max_load_no_id) {
    //         max_load_no_id = load_no_id;
    //     }
    // }
    // latest_load_no.value = formatLoadNo(saw_type.value, getLoadNo(latest_load_no.value) - 1);
    // form.value.items = remaining_items;
  }

  const getLoadNo = (fullLoadNo) => {
    const matched = fullLoadNo.match(/\d+$/);
    if (matched) {
        // 将提取出的数字字符串转换为数字类型
        const extractedNumber = parseInt(matched[0], 10);
        return extractedNumber;
    }
  }
  
  const handleCopyItem = (item) => {
    let new_load_no = undefined;
    if (ptaCode.value === 'ADC') {
      new_load_no = null;
    } else {
      new_load_no = formatLoadNo(saw_type.value, getLoadNo(latest_load_no.value) + 1);
      latest_load_no.value = new_load_no;
    }
    form.value.items.push({
        cut_seq_load_no: new_load_no,
        bundle_size: item.bundle_size,
        total_weight_ton: item.total_weight_ton,
        origin_weight_ton: 0,
        transport_restrict: item.transport_restrict,
        key: uuidv4(),
    })
  }
  
  defineExpose({
    handleShow,
  });
  
  </script>
  <style lang="scss" scoped>
  
  .mult {
    display: flex;
    margin-bottom: 12px;
    width: 100%;
    &-content {
      padding: 6px;
      min-width: 0;
    }
    &-action {
      padding-left: 6px;
      flex-shrink: 0; 
    }
  }

.bundle-size-red {
  ::v-deep(.v-field__field) {
      color: red;
  }
}

.bundle-size-orange {
  ::v-deep(.v-field__field) {
    color: orange;
  }
}

.bundle-size-green {
  ::v-deep(.v-field__field) {
    color: green;
  }
}

  
  
  </style>
