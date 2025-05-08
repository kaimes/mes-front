<template>
  <v-row align="center">
    <v-col :cols="defaultMillCode === 'SRSM' ? 12 : 6">
      <v-radio-group v-model="modelValue.allocation_status" @update:model-value="handleTypeChange" inline hide-details>
        <v-radio label="Order" value="allocate">
          <template v-slot:label>
            <span class="text-subtitle-1 text-black font-weight-medium">Order</span>
          </template>
        </v-radio>
        <v-radio label="Scrap" value="scrap">
          <template v-slot:label>
            <span class="text-subtitle-1 text-black font-weight-medium">Scrap</span>
          </template>
        </v-radio>
        <v-radio label="Free Stock" value="free_stock">
          <template v-slot:label>
            <span class="text-subtitle-1 text-black font-weight-medium">Free Stock</span>
          </template>
        </v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="6" v-if="defaultMillCode !== 'SRSM'">
      <div v-show="modelValue.allocation_status === 'allocate'">
        <div class="d-flex align-center justify-end">
          <div class="text-grey-darken-1 mr-4">Cover</div>
          <v-chip :color="complianceColor" variant="flat" class="text-white">
            {{ compliance }}
          </v-chip>
        </div>
      </div>
    </v-col>
    <template v-if="modelValue.allocation_status === 'allocate'">
      <v-col cols="2">
        <OrderCode v-model="modelValue.order_id" variant="underlined" density="comfortable" label="Order Number" :rules="rules.order_id" :hide-details="false"></OrderCode>
      </v-col>
      <v-col cols="2">
        <OrderItemCode
            v-model="modelValue.order_item_id"
            :order_id="modelValue.order_id"
            density="comfortable"
            variant="underlined"
            label="Item No"
            :hide-details="false"
            :rules="rules.order_item_id"
            @change="handleItemNoChange"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
            v-model="modelValue.spec_code"
            density="comfortable"
            class="no-input-control"
            variant="underlined"
            label="Spec Code"
            :hide-details="false"
            readonly
        ></v-text-field>
      </v-col>
      <v-col cols="2" >
        <v-text-field
            v-model="modelValue.product_type_code"
            density="comfortable"
            class="no-input-control"
            variant="underlined"
            label="Product Type Code"
            :hide-details="false"
            readonly
        ></v-text-field>
      </v-col>
    </template>
    <template v-if="modelValue.allocation_status === 'scrap'">
      <v-col cols="2">
        <DefectReason
            label="Defect Reason"
            v-model="modelValue.defect_reason_id"
            :rules="rules.defect_reason_id"
            variant="underlined"
            density="comfortable"
            :hide-details="false"
        />
      </v-col>
    </template>
    <template v-if="modelValue.allocation_status === 'free_stock'">
      <v-col cols="2">
        <dict-code
            v-model="modelValue.status_change_reason"
            :rules="rules.status_change_reason"
            placeholder="Please select select change reason"
            :hide-details="false"
            density="comfortable"
            variant="underlined"
            label="Change Reason"
            bg-color="white"
            code="free_stock_status"
            clearable
        />
      </v-col>
    </template>
    <v-col cols="2">
      <v-text-field
          type="number"
          v-model="modelValue.length_mm"
          @update:modelValue="handleLengthChange"
          :rules="rules.length_mm"
          :min="0"
          density="comfortable"
          class="no-input-control"
          variant="underlined"
          label="Length(mm)"
          :hide-details="false"
          clearable
      ></v-text-field>
    </v-col>
    <template v-if="modelValue.allocation_status === 'free_stock'">
      <v-col cols="2">
        <v-text-field
            type="number"
            v-model="modelValue.defective_length"
            :min="0"
            density="comfortable"
            class="no-input-control"
            variant="underlined"
            label="Defective Length(mm)"
            :hide-details="false"
            clearable
            :rules="rules.defective_length"
        ></v-text-field>
      </v-col>
    </template>
    <template v-if="modelValue.allocation_status === 'scrap'">
      <v-col v-if="defaultMillCode == 'SRSM'" cols="2">
        <v-text-field
            type="number"
            v-model="modelValue.quantity"
            :rules="rules.quantity"
            :min="0"
            density="comfortable"
            class="no-input-control"
            variant="underlined"
            label="Quantity"
            :hide-details="false"
            clearable
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
            v-model="modelValue.defect_comment"
            :min="0"
            density="comfortable"
            variant="underlined"
            label="Defect Comment"
            :hide-details="false"
            clearable
        ></v-text-field>
      </v-col>
    </template>

    <template v-if="modelValue.allocation_status === 'allocate'">
      <v-col v-if="defaultMillCode !== 'SRSM'" cols="2">
        <v-text-field
            type="number"
            v-model="modelValue.quantity"
            :rules="rules.quantity"
            :min="0"
            density="comfortable"
            class="no-input-control"
            variant="underlined"
            label="Quantity"
            :hide-details="false"
            clearable
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <dict-code
            v-model="modelValue.allocate_reason"
            :hide-details="false"
            bg-color="white"
            density="comfortable"
            variant="underlined"
            color="#333"
            label="Allocate Reason"
            code="allocate_reason"
        />
      </v-col>
    </template>
  </v-row>
</template>
<script setup>
import {computed, ref, watch} from "vue";
import {toast} from "vue3-toastify";
import {useStore} from "vuex";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import DefectReason from "@/components/picker/DefectReason.vue";
import DictCode from "@/components/picker/DictCode.vue";
import API from "../api";

const store = useStore();
const defaultMillCode = computed(() => store.state.auth.defaultMillCode);


const compliance = ref("0");

const complianceColor = computed(() => {
  // green red orange
  if (compliance.value.includes("6")) {
    return "red";
  }
  if (compliance.value.length === 2 && (compliance.value.startsWith("8") || compliance.value.startsWith("9")) && compliance.value.endsWith("8") || compliance.value.endsWith("9")) {
    return "green";
  }
  return "orange";
});

const props = defineProps({
  /**当前双向数据绑定的值 */
  modelValue: {
    type: Object,
    default: () => {}
  },
  max: {
    type: Number,
    default: 9999999
  },
  product: {
    type: Object,
    default: () => {}
  },
  rules: {
    type: Object,
    default: () => {}
  },
})

const handleItemNoChange = (e) => {  
  if (e.product_type && e.product_type?.code) {
    // 判断是否有和外层的一直
    if (props.product.product_type?.code !== e.product_type?.code) {
      toast.warning("Product Type Code Inconsistency", {
        position: "bottom-center",
        duration: 3000
      });
      props.modelValue.order_item_id = undefined;
      return;
    }
  }
  let lengthMM = parseFloat(`${e.length_mm || 0}`);
  props.modelValue.length_mm = lengthMM;
  props.modelValue.product_type_code = e.product_type?.code;
  props.modelValue.spec_code = e.spec?.spec_code;
  props.modelValue.spec_id = e.spec_id;

  if (lengthMM) {
    props.modelValue.quantity = Math.floor(props.max / (e.length_mm || 0));
  }
  const { runout_id } = props.product;
  if (!e.spec?.spec_code) {
    return;
  }

  if (defaultMillCode.value === 'SRSM') {
    props.modelValue.cut_sample_length_mm = 0;
    compliance.value = "0";
    props.modelValue.compliance = "0";
    return;
  }

  API.getCompliance({
    "spec_code": e.spec?.spec_code,
    runout_id
  }).then(res => {
    if (!res.data) {
      props.modelValue.cut_sample_length_mm = 500;
      compliance.value = "0";
      props.modelValue.compliance = 0;
      return;
    }
    if (res.data === 98 || res.data === 99) {
      props.modelValue.cut_sample_length_mm = 0;
    } else if (res.data === 97) {
      props.modelValue.cut_sample_length_mm = 200;
    } else if (res.data === 87 || res.data === 77 || res.data === 78) {
      props.modelValue.cut_sample_length_mm = 500;
    } else {
      // 如果是6 或者不满足情况就 500
      props.modelValue.cut_sample_length_mm = 500;
    }
    compliance.value = `${res.data || 0}`;
    props.modelValue.compliance = `${res.data || 0}`;
  })
}

const handleLengthChange = (e) => {
  if (e) {
    if (e < props.max) {
      props.modelValue.quantity = Math.floor(props.max / (e || 0));
    } else {
      props.modelValue.quantity = 1;
    }
  } else {
    props.modelValue.quantity = 1;
  }
}

const handleTypeChange = (e) => {
  if (props.modelValue.allocation_status !== "allocate") {
    props.modelValue.length_mm = props.max;
  } else {
    props.modelValue.length_mm = 0;
  }
}

watch(() => props.max, (val) => {
  if (val < 6000) {
    props.modelValue.allocation_status = "scrap"
  }
}, {
  once: true,
  immediate: true,
})

</script>
<style scoped>

</style>
