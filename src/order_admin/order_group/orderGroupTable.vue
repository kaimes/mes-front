<template>
  <v-expansion-panel elevation="0" class="border rounded order-group-panel-header" bg-color="white" :value="modelValue.id" expand :rounded="24">
    <v-expansion-panel-title>
      <v-row align="center" no-gutters>

        <v-col cols="12" sm="2" md="1">
          <div class="text-subtitle-1 font-weight-bold">KG: {{ product.dim3 }}</div>
        </v-col>

        <v-col cols="12" sm="10" md="7">
          <div class="d-flex align-center ga-2 flex-wrap" >
            <div style="min-width: 200px">
              <AltSemiSizeCode
                  v-model="modelValue.alternative_semi_size_id"
                  :order_group_id="modelValue.id"
                  :disabled="!disabled"
                  @keyup.prevent
                  @click.stop
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon=""
                  :clearable="false"
                  :disabled-search="true"
              />
            </div>

            <v-text-field
                v-model="modelValue.group_code"
                density="compact"
                variant="outlined"
                label="No:"
                persistent-placeholder
                placeholder="Please enter group code"
                bg-color="white"
                class="flex-grow-1 flex-md-grow-0"
                style="min-width: 120px"
                hide-details
                :disabled="!disabled"
                @keyup.prevent
                @click.stop
                clearable
            ></v-text-field>
            <v-text-field
                v-model="modelValue.group_charge_seq"
                density="compact"
                variant="outlined"
                label="Seq No:"
                persistent-placeholder
                placeholder="Please enter Seq No"
                bg-color="white"
                class="flex-grow-1 flex-md-grow-0"
                style="min-width: 120px"
                hide-details
                :disabled="!disabled"
                @keyup.prevent
                @click.stop
            ></v-text-field>
            <v-text-field
                v-model="modelValue.plan_tonnes"
                label="Plan Tonnes:"
                persistent-placeholder
                density="compact"
                variant="outlined"
                placeholder="Plan Tonnes"
                bg-color="white"
                hide-details
                class="flex-grow-1 flex-md-grow-0"
                style="min-width: 120px"
                :disabled="!disabled"
                @keyup.prevent
                @click.stop
                :rules="[(value) => {
                  if (!value) {
                    return true;
                  }
                  return /^[0-9]+$/.test(value) || 'The value must be a number ';
                }]"
            ></v-text-field>
            <v-select
                v-model="modelValue.galvanisation"
                :items="['Y', 'N']"
                label="Gal:"
                persistent-placeholder
                density="compact"
                variant="outlined"
                placeholder="Y or N"
                bg-color="white"
                hide-details
                class="flex-grow-1 flex-md-grow-0 w-20"
                style="min-width: 120px"
                :disabled="!disabled"
                @click.stop
                :rules="[(v) => v === 'Y' || v === 'N' || v === '']"
            ></v-select>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <div class="d-flex flex-wrap py-2 justify-end ga-2">
            <v-btn type="text" class="my-1 text-none" variant="flat" color="primary"
                   @click="handleCutSequence(order_group_obj)">
              Cut Sequence
            </v-btn>
            <v-btn type="text" class="my-1 text-none" variant="flat" color="primary"
                   @click="handleMove">
              Move
            </v-btn>
            <v-btn
                type="text"
                class="my-1 text-none"
                color="primary"
                variant="flat"
                @click.stop="handleViewDetail"
            >
              Details
            </v-btn>
            <v-dialog
                max-width="400"
                persistent
            >
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    class="my-1 mr-20 text-none"
                    color="primary"
                    variant="flat"
                    :disabled="selected.length === 0 || tableData.length <= 1"
                    v-bind="activatorProps"
                    @click.stop
                >
                  Split
                </v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card
                    prepend-icon="mdi-help-circle-outline"
                    title="Split Order Group or Merge?"
                    text="Would you like to split this Order Group into new one or merge it with an existing one?"
                >
                  <v-spacer></v-spacer>
                  <template v-slot:actions>
                    <v-btn
                        class="text-none"
                        color="#e3e3e3"
                        variant="flat"
                        @click="isActive.value = false"
                    >
                      Merge to Existing
                    </v-btn>
                    <v-btn
                        class="text-none"
                        color="primary"
                        variant="flat"
                        @click="handleSplit(isActive)"
                    >
                      New
                    </v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-data-table
          v-model="selected"
          :headers="tableHeaders"
          :items="tableData"
          density="default"
          item-value="id"
          show-select
      >
      <template #item.project_tonnes="{ item }">
          <v-col class="d-flex align-center justify-start">
            <v-text-field
                v-if="item.isEditing"
                v-model="item.editingProjectTonnes"
                density="compact"
                variant="outlined"
                placeholder="Project Tonnes"
                bg-color="white"
                hide-details
                clearable
                @keyup.enter="saveProjectTonnes(item)"
                @blur="saveProjectTonnes(item)"
            ></v-text-field>
            <div v-else class="text-subtitle" @click="editProjectTonnes(item)">
              {{ item.project_tonnes || 0 }}
            </div>
          </v-col>
       </template>
        <template #bottom>
          <!-- Leave this slot empty to hide pagination controls -->
        </template>
      </v-data-table>
    </v-expansion-panel-text>

        <div class="order-group-panel-footer text-subtitle-2 font-weight-bold mr-12" v-for="item in total.requestedNew" :key="item.quality_code">
         ({{ item.quality_code }}): Requested Tonnes: {{ item.totalWeightInKgs }} &nbsp;&nbsp;&nbsp;&nbsp; Blocked Semi tonnes: {{ item.kg.toFixed(2) }} &nbsp;&nbsp;&nbsp;&nbsp; Balance:<span :style="getBalanceStyle(item.kg, item.totalWeightInKgs)">{{ (item.kg - item.totalWeightInKgs || 0).toFixed(2) }}</span> 
        </div>

      <div class="order-group-panel-footer">
        <div class="text-subtitle-2 font-weight-bold mr-12">Semi Length: {{ alternative_semi_size?.semi_size?.semi_size_detail?.length_mm || 0 }}</div>

        <div class="text-subtitle-2 font-weight-bold mr-12">Charged tonnes: {{ total.charged_tonnes  || 0 }}</div>
      </div>
      
  </v-expansion-panel>
  <v-divider color="white"  :thickness="12"></v-divider>
  <MoveAction ref="moveFormRef" @refresh="handleSearch" />
</template>
<script setup>
import {getCurrentInstance, computed, ref, toRaw, reactive, onMounted, onUpdated} from "vue";
import { toast } from "vue3-toastify";
import {reduce} from "lodash";
import {useRoute, useRouter} from "vue-router";
import XEUtils from "xe-utils";
import API from "./api";
import MoveAction from "./moveToRolling.vue"
import AltSemiSizeCode from "@/components/picker/AltSemiSizeCode.vue";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(['refresh']);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  rollingOptions: {
    type: Array,
    default: []
  },
  /**当前双向数据绑定的值 */
  modelValue: {
    type: Object,
    default: () => ({
      order_spec_group: [],
      plan_tonnes: 0,  // 添加 plan_tonnes 字段
      galvanisation: null,
      blocked_semi_tonnes: 0,
      charged_tonnes: 0,
      quality_kg: []
    })
  }
})

const tableHeaders = ref([
  {title: "Spec Code",key: "spec_code", value: (item) => item.spec?.spec_code || "--", sortable: false},
  {title: "Short Name", key: "short_name", value: (item) => item.spec?.short_name || "--", sortable: false},
  {title: "FECC Group", key: "fecc_group", value: (item) => item.spec?.fecc_qual_category || "--", sortable: false},
  {title: "Quality Code", key: "quality_code", sortable: false},
  // {title: "FECC Group", key: "fecc_group", value: (item) => item.spec?.fecc_qual_category || "--", sortable: false},
  // {title: "Max Finished Length(mm) ", minWidth: 50, key: "length", value: (item) => item.length, sortable: false},
  //{title: "Weight(kg)", minWidth: 50, key: "weight",value: (item) => item.weight, sortable: false},

  {title: "Requested Tonnes", key: "requested_tonnes", sortable: false},
  {title: "Project Tonnes", key: "project_tonnes", sortable: false},
  // {title: "Allocation Tonnes", key: "allocation_tonnes", sortable: false},
]);

let requestedNew = ref();
const selected = ref([]);
const loading = ref(false);
const balance = ref(0)
const tableData = computed(() => {
  const { order_spec_group } = props.modelValue;
  // tolerance_no      spec表
  // spec_code         spec表
  // source_type       spec表
  // quality_code      spec表
  // fecc_group        spec表
  // seme_order        semi_order_code
  // seq               spec_charge_seq
  // length            order_spec_group 直接加  每次block更新
  // weight            order_spec_group直接加   每次block更新
  // fit               order_spec_group直接加   length 真实与输出的差值的百分比，每次block更新
  // requested_tonnes  加到表里
  // allocation_tonnes 加到表里
  return (order_spec_group || []).map(item => {
    const spec = item.spec || {};
    return {
      ...item,
      isEditing: false,
      tolerance_no: spec.tolerance_no,
      spec_code: spec.spec_code,
      source_type: spec.source_type,
      quality_code: item.quality_code,
      fecc_group: spec.fecc_group,
      seme_order: item.semi_order_code,
      seq: item.spec_charge_seq,
      semi_size: item?.rolling?.semi_size,
      requested_tonnes: (item.weight / 1000).toFixed(2),
      project_tonnes: item.project_tonnes,
      editingProjectTonnes: item.project_tonnes
    }
  });
})

const editProjectTonnes = (item) => {
    item.isEditing = true; 
};

const handleSearch = () => {
  emit('refresh');
}

const saveProjectTonnes = async (item) => {
    item.isEditing = false; 
    if (item.editingProjectTonnes !== item.project_tonnes) {
      item.project_tonnes = item.editingProjectTonnes; 
      const updatedProjectTonnes = parseFloat(item.editingProjectTonnes).toFixed(2);
      try {
        await API.updateProjectTonnes({
          id: item.id,
          project_tonnes: updatedProjectTonnes
        });
        toast.success("Project Tonnes updated successfully!");
      } catch (error) {
        toast.error("Failed to update Project Tonnes.", { autoClose: 60000 });
      }
    }
};

const product = computed(() => {
  const { product_type } = props.modelValue;
  return product_type || {};
})

const order_group_obj = computed(() => {
  return props.modelValue || {};
})

const alternative_semi_size = computed(() => {
  const { alternative_semi_size } = props.modelValue;
  return alternative_semi_size || {};
})

const total = computed(() => {
  
  const { order_spec_group } = toRaw(props.modelValue);
  const requested = reduce(order_spec_group, (prev, next) => {
    return prev + next.weight/1000;
  }, 0);

  const result = order_spec_group.reduce((acc, curr) => {
    // 判断是否已经有该 quality_code 的记录
    const existing = acc.find(item => item.quality_code === curr.quality_code);
    
    if (existing) {
      // 如果存在相同的 quality_code，累加 weight
      existing.totalWeight += curr.weight;
    } else {
      // 否则创建新的对象
      acc.push({
        quality_code: curr.quality_code,
        totalWeight: curr.weight
      });
    }
    
    return acc;
}, []);

// 结果中每个 quality_code 的 weight 加总后除以 1000
 requestedNew = result.map(item => ({
  quality_code: item.quality_code,
  totalWeightInKgs: (item.totalWeight / 1000).toFixed(2)
}));


let quality_kg = props.modelValue.quality_kg;

// 创建 quality_code -> kg 的映射表，加快查找
const qualityMap = Object.fromEntries(quality_kg.map(q => [q.quality_code, q.kg]));

// 遍历 requestedNew，匹配 quality_kg 并添加 kg 字段
const updatedRequestedNew = requestedNew.map(item => ({
    ...item,
    kg: qualityMap[item.quality_code] ?? 0 // 如果没有匹配的 quality_code，则默认 kg = 0
}));

console.log(updatedRequestedNew);



  const allocation = reduce(order_spec_group, (prev, next) => {
    return prev + next.allocation_tonnes;
  }, 0);
  const plan = props.modelValue.plan_tonnes || 0;  // 取 plan_tonnes 字段值
  const blocked_semi_tonnes = props.modelValue.blocked_semi_tonnes || 0;
  const charged_tonnes = props.modelValue.charged_tonnes || 0;
  return { requested: requested.toFixed(2), allocation: allocation.toFixed(2), plan: plan.toFixed(2), blocked_semi_tonnes:blocked_semi_tonnes.toFixed(2), charged_tonnes: charged_tonnes.toFixed(2), requestedNew: updatedRequestedNew } // 返回 plan_tonnes 计算结果 };
})

onMounted(
  () => {
    console.log(requestedNew);
  }
);
  
  


const handleSplit = (isActive) => {
  isActive.value = false;
  const { rolling_id, product_id, charge_seq, group_code, semi_order_code, group_charge_seq, requested_tonnes, galvanisation } = props.modelValue;
  console.log('props.modelValue=======',props.modelValue)
  loading.value = true;
  API.orderGroupSplit({
    rolling_id,
    product_id,
    charge_seq,
    group_code,
    semi_order_code,
    group_charge_seq,
    requested_tonnes,
    galvanisation,
    order_spec_group_ids: selected.value
  }).then(res => {
    toast.success("Split Success!")
    selected.value = [];
    emit("refresh");
  }).catch(res => {
    toast.error("Split Error!", { autoClose: 60000 })
  }).finally(() => {
    loading.value = false;
  })
}

const handleViewDetail = () => {
  router.push({ name: "OrderGroupBlock", query: { id: props.modelValue.id,alternative_semi_size_id:props.modelValue.alternative_semi_size_id } });
}

const handleMove = () => {
  let formData = {
    formLabel: {'orderGroupLabel': undefined},
    formValue: {'orderGroupId': undefined}
  }
  formData.formLabel.orderGroupLabel = `${props.modelValue.group_code}-${props.modelValue.group_charge_seq}`;
  formData.formValue.orderGroupId = props.modelValue.id
  proxy.$refs["moveFormRef"].handleShow(formData, props.rollingOptions);
}

const handleCutSequence = (order_group) => {
  let rolling_id = order_group?.rolling?.id;
  let order_group_id = order_group?.id
  router.push({ 
    path: "/cut_seq_plan_detail", query: { 
      rolling_code: route.query.code,
      rolling_id: rolling_id,
      order_group_id: order_group_id,
      kgm: order_group?.product_type?.dim3
    } 
  })
}

const getBalanceStyle =(blocked_semi_tonnes, requested) => {
      const balance = blocked_semi_tonnes - requested;
      let color = 'black'; // 默认颜色

      if (balance < 0) {
        color = 'red';
      } else if (balance <= requested * 0.2) {
        color = 'green';
      } else {
        color = 'orange';
      }

      return { color };
    };



</script>
<style lang="scss" scoped>
.order-group {
  &-panel-header {
    overflow: hidden;
    .v-expansion-panel-title {
      background-color: #ebebeb;
    }
    &:after {
      opacity: 0;
    }
  }
  &-panel-footer {
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 12px 24px;
  }
}
@media (max-width: 960px) {
  .text-subtitle-1 {
    font-size: 0.875rem;
  }
  
  .v-btn {
    min-width: 80px;
    font-size: 0.75rem;
    padding: 0 8px;
  }

  .v-text-field {
    font-size: 0.875rem;
  }
}
.v-btn {
  min-width: 64px;
  min-height: 36px;
}
</style>
