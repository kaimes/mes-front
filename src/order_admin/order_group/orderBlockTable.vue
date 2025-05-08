<template>
  <v-expansion-panel color="#ffffff" value="0" expand :rounded="24">
    <v-expansion-panel-title color="#ffffff">
      <v-row align="center" no-gutters>
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">Section: {{ product.dim1 }}-{{ product.dim2 }}</div>
        </v-col>
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">KG: {{ product.dim3 }}</div>
        </v-col>
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">No: {{ modelValue.group_code }}</div>
        </v-col>
        <v-col class="d-flex align-center">
          <div class="text-subtitle-1 font-weight-bold mr-2">Seq No: {{ modelValue.group_charge_seq }}</div>
        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text bg-color="#ffffff">
      <v-data-table
          v-model="selected"
          @update:modelValue="handleSelectChange"
          show-select
          :headers="tableHeaders"
          :items="tableData"
          density="default"
          item-value="spec_id"
      >
        <template #bottom>
          <!-- Leave this slot empty to hide pagination controls -->
        </template>
      </v-data-table>
    </v-expansion-panel-text>
    <div class="order-group-panel-footer">
      <div class="text-subtitle-2 font-weight-bold mr-12">Requested Group Tonnes: {{ total.requested || 0 }}</div>
      <div class="text-subtitle-2 font-weight-bold">Allocation Group tonnes: {{ total.allocation || 0 }}</div>
    </div>
  </v-expansion-panel>
</template>
<script setup>
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import {reduce} from "lodash";
import XEUtils from "xe-utils";

const emit = defineEmits(['change']);

const selected = ref([]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      order_spec_group: []
    })
  }
})

const tableHeaders = ref([
  {title: "Tolerance No.", key: "tolerance_no", value: (item) => item.spec?.tolerance_no || "--", sortable: false},
  {title: "Spec Code",key: "spec_code", value: (item) => item.spec?.spec_code || "--", sortable: false},
  {title: "Source Type", key: "source_type", value: (item) => item.spec?.source_type || "--", sortable: false},
  {title: "Quality Code", key: "quality_code" || "--", sortable: false},
  {title: "FECC Group", key: "fecc_group", value: (item) => item.spec?.fecc_qual_category || "--", sortable: false},
  {title: "Semi Order", key: "semi_order_code", sortable: false},
  {title: "Seq", minWidth: 20, key: "spec_charge_seq", sortable: false},
  {title: "Length(mm)", minWidth: 50, key: "length", sortable: false},
  {title: "Weight(kg)", minWidth: 50, key: "weight", sortable: false},

  {title: "Requested Tonnes", key: "requested_tonnes", sortable: false},
  {title: "Allocation Tonnes", key: "allocation_tonnes", sortable: false},
]);

const tableData = computed(() => {
  const { order_spec_group } = props.modelValue;
  return order_spec_group || [];
})

const product = computed(() => {
  const { product_type } = props.modelValue;
  return product_type || {};
})

const total = computed(() => {
  const { order_spec_group } = toRaw(props.modelValue);
  const requested = reduce(order_spec_group, (prev, next) => {
    return prev + next.requested_tonnes;
  }, 0);

  const allocation = reduce(order_spec_group, (prev, next) => {
    return prev + next.allocation_tonnes;
  }, 0);
  return { requested: requested.toFixed(2), allocation: allocation.toFixed(2) };
})

const handleSelectChange = (value) => emit("change", value)

watch(
    () => props.modelValue.order_spec_group,
    (value) => {
      if (value) {
        selected.value = value.map(item => item.spec_id);
      }
    },
    {
      immediate: true,
      deep: true
    }
)

</script>
<style lang="scss" scoped>
.order-group-panel-footer {
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 12px 24px;
}
</style>
