<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Add Bar"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
    >
      <div class="border ma-4 pa-4">
        <FinishedProductCode
            v-model="finished_product_code"
            label="Finished Product Code"
            :hide-details="false"
            :type="business_type === 'bws' || business_type === 'roster' ? order_id : ''"
            :business_type="business_type === 'bws' || business_type === 'roster' ? business_type : ''"
            @change="handleChange"
            :skip="true"
        />
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            class="text-none mr-4"
            color="#e3e3e3"
            variant="flat"
            @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :disabled="selections.length === 0"
            :loading="loading"
            @click="handleAddBar"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import {map, findIndex} from "lodash";
import FinishedProductCode from "./picker/multiple/FinishedProductCode.vue";
import {toast} from "vue3-toastify";
import API from "../api";


const {proxy} = getCurrentInstance();
const emit = defineEmits(['change']);
const visible = ref(false);
const loading = ref(false);
const selections = ref([]);

const data = reactive({
  finished_product_code: [],
  order_id: undefined,
  business_type: undefined
});

const {
  finished_product_code,
  order_id,
  business_type,
} = toRefs(data);

const handleShow = (data, arr = []) => {
  order_id.value = data.order_id;
  business_type.value = data.business_type;
  selections.value = [...toRaw(arr)];
  // 处理数组
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    finished_product_code.value = [];
    selections.value = [];
  })
}

const handleClear = (index) => {
  selections.value.splice(index, 1)
}



const handleAddBar = async () => {
  const items = toRaw(selections.value)
  const ids = items.map(item => item.id);
  API.inspectFinishedProduct({"item_ids": ids}).then(res => {
    emit('change', items);
    handleClose();
  }).catch(error => {
    toast.error(`${error.response.data.detail}`, {
      autoClose: 60000
    });
  })
}
const handleChange = (arr) => {
  selections.value = arr;
}

const handlePickFinishedProductCode = (item) => {
  const $itemArray = toRaw(item); 
  const $selections = toRaw(selections.value);

  // console.log(" $selections: " + JSON.stringify($selections));

  $itemArray.forEach($item => {
    // 如果 selections 为空，直接添加 item
    if ($selections.length === 0) {
      $selections.push($item);
      selections.value = $selections;
    } else {
      // 如果 selections 不为空，检查每个 item 是否已存在
      const $index = findIndex($selections, { id: $item.id });
      if ($index < 0) {
        // 如果是 BWS 或 Roster 类型，检查 order_id 是否匹配
        // if (business_type.value === 'BWS' || business_type.value === 'Roster') {
        //   const $exist = findIndex($selections, { order_id: $item.order_id });
        //   if ($exist < 0) {
        //     toast.warning("Please select a finished product with the same order.", {
        //       position: "bottom-center"
        //     });
        //     return;
        //   }
        //   if (($item.exist_flag !== 'Y' && $item.exist_flag !== null) || ($item.rework_type !== 'Complete' && $item.rework_type !== null)) {
        //     toast.warning("The selected finished product mult or rework is being done.", {
        //       position: "bottom-center"
        //     });
        //     return;
        //   }
        // }
        // // 检查 exist_flag 是否为 null 或 'Y'
        // if ($item.exist_flag !== null && $item.exist_flag !== 'Y') {
        //   toast.warning("The selected finished product must have an exist_flag of null or 'Y'.", {
        //     position: "bottom-center"
        //   });
        //   return;
        // }
        $selections.push($item);
        selections.value = $selections;
      }
    }
  });
};


// watch(
//   () => data.finished_product_code, // 监听 finished_product_code
//   (newVal) => {
//     console.log("finished product values:", toRaw(newVal));
//   },
//   { deep: true } // 深度监听，确保数组内容变化时触发
// );


defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
.re-work-card {
  overflow-y: visible !important;
}
</style>
