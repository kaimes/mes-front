<template>
    <v-dialog v-model="visible" persistent max-width="700">
        <v-card
            title="Create Cut Sequence"
            class="re-work-card"
            style="overflow: visible"
        >
        <v-divider></v-divider>
        <div class="pa-4 border ma-4">
            <v-form ref="createForm">
                <v-row>
                    <v-col cols="4">
                      <v-autocomplete
                        v-model="form.order_id"
                        :items="orderOptions"
                        item-title="order_code"
                        item-value="id"
                        label="Order Code"
                        density="default"
                        clearable
                        search
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        v-model="form.select"
                        label="Order Item"
                        :items="orderItemOptions"
                        item-title="line_item_code"
                        item-value="id"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                <v-col cols="4">
                    <DictCode
                        v-model="form.saw_route"
                        code="cut_sequence_plan_saw_route"
                        label="Saw Route"
                        variant="underlined"
                        :rules="rules.saw_route"
                        :hide-details="false"
                        :clearable="false"
                    />
                    </v-col>
                    
                </v-row>
                <v-divider></v-divider>
                  <v-row>
                    <v-col cols="4">
                      <v-text-field
                          v-model="form.position"
                          label="Position"
                          density="default"
                          :rules="rules.position"
                      ></v-text-field>
                    </v-col>
                  <v-col cols="4">
                      <v-text-field
                          v-model="form.bars"
                          label="No Bars"
                          density="default"
                          :rules="rules.bars"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                          v-model="form.length"
                          label="Length"
                          density="default"
                          :rules="rules.length"
                      ></v-text-field>
                    </v-col>
                </v-row>
                
            </v-form>
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
                :loading="loading"
                @click="handleSave"
            >
            Confirm
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { mapState } from "pinia";
  import { mapActions } from "pinia";
  import {toast} from "vue3-toastify";
  import API from '../api';
  import {getCurrentInstance, nextTick, onMounted, reactive, ref, toRaw, toRefs, watch} from "vue";
  import DictCode from "@/components/picker/DictCode.vue";
  import { useRoute, useRouter } from "vue-router";
  const {proxy} = getCurrentInstance();
  const emit = defineEmits(['refresh']);

  const route = useRoute();
  const visible = ref(false)

  const data = reactive({
    form: {
        order_id: undefined,
        saw_route: undefined,
        select: undefined,
        position: undefined,
        bars: undefined,
        length: undefined,
    },
    rules: {
      saw_route: [
        value => {
          if (value) return true
          return 'Saw Line is required.'
        }
      ],
      position: [
        value => {
          if (value) return true
          return 'Position is required.'
        }
      ],
      bars: [
        value => {
          if (value) return true
          return 'No Bars is required.'
        }
      ],
      length: [
        value => {
          if (value) return true
          return 'Length is required.'
        }
      ]
    },
    orderItemOptions: [],
    orderItemMap: {},
    orderOptions: [],
    orderIdOrderItemMap: {}
});

 const { form, rules, orderItemOptions, orderItemMap, orderOptions, orderIdOrderItemMap } = toRefs(data);


const handleOrderNumberChange = (newValue) => {
  orderItemOptions.value = orderIdOrderItemMap.value[newValue];
}

// 监听 order item下拉框，如果选中了则显示 order item bars 和 length
watch(() => form.value.select, (newValue) => {
  if (newValue) {
    form.value.bars = orderItemMap.value[newValue].bars;
    form.value.length = orderItemMap.value[newValue].length;
  } else {
    form.value.bars = undefined;
    form.value.length = undefined;
  }
});


watch(() => form.value.order_id, (newValue) => {
  if (newValue) {
    handleOrderNumberChange(newValue);
  } else {
    form.value.select = undefined;
  }
})


onMounted(async () => {
  const queryParams = {
    // order_code: form.value.order_code,
    rolling_id: route.query?.rolling_id,
    order_group_id: route.query?.order_group_id
  }
  const resp = await API.getOrderItemOptions(queryParams);
  // orderItemOptions.value = resp.data;
  resp.data.forEach(element => {
    orderItemMap.value[element.id] = {
      bars: element.bars,
      length: element.length_mm
    };
    // 如果element.order_info 不在 orderOptions.value中，则添加
    if (!orderOptions.value.includes(element.order_info)) {
      orderOptions.value.push(element.order_info);
    }
    
    if (orderIdOrderItemMap.value[element.order_info.id] !== undefined) {
      orderIdOrderItemMap.value[element.order_info.id].push(element);
    } else {
      orderIdOrderItemMap.value[element.order_info.id] = [element];
    }
  });
  console.log("orderIdOrderItemMap", orderIdOrderItemMap.value);
})

  const handleShow = () => {
    nextTick(() => {
        visible.value = true;
    })
  }

  const handleClose = () => {
    form.value = {
      order_id: undefined,
      saw_route: undefined,
      select: undefined,
      position: undefined,
      bars: undefined,
      length: undefined,
    };
    visible.value = false;
    nextTick(() => {
      proxy.$refs["createForm"].resetValidation();
  })
  }

  const handleSave = async() => {
    const {valid} = await proxy.$refs["createForm"].validate();
    if (!valid) {
      return;
    }
    const { rolling_id, order_group_id } = route.query
    try {
      await API.createCutSequence({
        rolling_id: parseInt(rolling_id),
        order_group_id: parseInt(order_group_id),
        saw_route: form.value.saw_route,
        order_item_id: form.value.select,
        new_bars: form.value.bars,
        pta_code: form.value.position,
        length: form.value.length
      });
      handleClose();
      emit("refresh");
      toast.success("Create Success", {
        position: "bottom-center"
      });
    } catch (error) {
      toast.error(error?.response?.data?.detail  || "Create Fail", { autoClose: 60000 });
    }
  }

  defineExpose({
    handleShow,
  });

  </script>
  