<template>
    <v-dialog v-model="visible" max-width="80%" :close-on-back="false" persistent>
      <v-card title="Rebundle Bar">
        <div class="text-subtitle-2 ml-6 mr-4 mb-2 d-flex justify-space-between align-center">
        <span>List of selected</span> 
        <div>
          <span class="mr-12">Total Length: {{ totalLengths }}</span>
          New Length: <span :style="{ color: newLengthColor }" class="mr-12">{{ newLength }}</span>
        </div>
      </div>
      <div class="pa-4 border rounded ml-4 mr-4">
        <v-data-table
           fixed-header
          :headers="tableHeaders"
          :items="tableList"
          density="default"
          height="300"
          item-value="id"
        >
        <template v-slot:item.runout.runout_code="{ item }">
            <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'RunoutDetail', query: { runout_id: item.runout?.id } }">
              <span class="w-100 d-inline-block">{{ item.runout?.runout_code }}</span>
            </router-link>
          </template>
          <template v-slot:item.cast.cast_code="{ item }">
            <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'CastChemicalDetail', query: { id: item.cast?.id } }">
              <span class="w-100 d-inline-block">{{ item.cast?.cast_code }}</span>
            </router-link>
          </template>

          <template v-slot:item.order_item.order.order_code="{ item }">
        <span class="allocated-order-item">
          <router-link v-if="item.order_item" class=" align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'OrderItemTable', query : {order_code:item.order_item.order?.order_code}  }">
            <span class="d-inline-block">{{ item.order_item?.order?.order_code }}</span>
          </router-link>
          <span class="separator">-</span>
          <router-link v-if="item.order_item" class=" align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'OrderItemDetail',query : {id:item.order_item.id}  }">
            <span class="d-inline-block">{{ item.order_item?.line_item_code }}</span>
          </router-link>
        </span>
          </template>
          <template v-slot:item.reserved_order_item.line_item_code="{ item }">
          <span class="reserved-order-item">
            <router-link v-if="item.reserved_order_item" class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemTable', query: { order_code: item.reserved_order_item.order?.order_code } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.order?.order_code }}</span>
            </router-link>
            <span class="separator">-</span>
            <router-link v-if="item.reserved_order_item" class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemDetail', query: { id: item.reserved_order_item.id } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.line_item_code }}</span>
            </router-link>
          </span>
          </template>

          <template v-slot:item.status="{ item }">
            <div class="d-flex justify-center ga-2">

              <v-chip size="small" v-if="item.status">
                {{ item.status }}
              </v-chip>
              <span v-else>
            </span>
            </div>
          </template>
          <template v-slot:item.area.code="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip size="small" v-if="false">
                En-Route
              </v-chip>
              <span v-else="item.advice.true">
              {{ item.area?.code }}
            </span>
            </div>
          </template>
          <template v-slot:item.hold_reason="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                {{ tag.name }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.hold_comment="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                {{ tag.comment }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.advice="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.advice" :key="tag.id" size="small">
                {{ tag.advice_code }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.loads="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.loads" :key="tag.id" size="small">
                {{ tag.code }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.rework_type="{ item }">
            <div class="justify-center c-clickable">
              <TreeDictCode variant="underlined" :hide-details="false" code="rework_type" placeholder="" v-model="item.rework_type" :disabled="true"/>
            </div>
          </template>
          <template #bottom>
          </template>
        </v-data-table>
      </div>
        <v-card-title class="d-flex justify-between align-center">
        </v-card-title>
        <div class="pa-4 border rounded ml-4 mr-4 mb-4">
          <v-form ref="editForm">
            <v-row
              v-for="(item, index) in form.split"
              align="center"
              :key="item.key"
            >
              <v-col cols="2" v-if="index < allocatedOrderItems.length">
                <v-text-field
                  v-model="item.code"
                  :value="allocatedOrderItems[index]?.code" 
                  density="default"
                  variant="underlined"
                  label="Bundle"
                  readonly
                ></v-text-field>
              </v-col>
                <v-col cols="2" v-else>
                  <v-text-field
                    :model-value="'New '"  
                    density="default"
                    variant="underlined"
                    label="New Bundle"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="2" v-if="index < allocatedOrderItems.length">
                  <v-text-field
                    v-model="item.order_items"  
                    :value="`${allocatedOrderItems[index]?.order_item_code}-${allocatedOrderItems[index]?.line_item_code}`" 
                    density="default"
                    variant="underlined"
                    label="Allocated Order Item"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="2" v-else>
                  <v-text-field
                    :model-value="''"  
                    density="default"
                    variant="underlined"
                    label="New Allocated Order Item"
                    readonly
                  ></v-text-field>
                </v-col>
              <!-- <v-col cols="2">
                <v-select
                  v-model="item.order_item_data"
                  :items="item.order_items"
                  item-title="order_code"
                  item-value="value"
                  density="default"
                  variant="underlined"
                  label="Allocated Order Item"
                ></v-select>
              </v-col> -->
              <v-col cols="1.5">
                <v-text-field
                  v-model="item.quantity"
                  density="default"
                  variant="underlined"
                  label="Bar No."
                  bg-color="white"
                  clearable
                  type="number"
                  :min="0"
                  :max="selectedQuantity"

                ></v-text-field>
              </v-col>
              <v-col cols="1.5">
                <v-text-field
                  v-model="item.length"
                  density="default"
                  variant="underlined"
                  label="Length(mm)"
                  bg-color="white"
                  clearable
                  :rules="rules.length"
                ></v-text-field>
              </v-col>
              <v-col cols="1.5" v-if="index < allocatedOrderItems.length">
                <v-text-field
                  :model-value="allocatedOrderItems[index]?.comments" 
                  density="default"
                  variant="underlined"
                  label="Comments"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="1.5" v-if="index >= allocatedOrderItems.length">
                <v-text-field
                  v-model="item.comments"
                  density="default"
                  variant="underlined"
                  label="Comments"
                  bg-color="white"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <template v-if="index + 1 === form.split.length">
                  <v-btn v-if="index >= 1"
                    density="comfortable" variant="outlined" flat
                    icon="mdi-minus"
                    @click="handleRemoveItem(item)"
                    class="mr-2"
                  ></v-btn>
                  <v-btn 
                    density="comfortable" variant="outlined" flat
                    icon="mdi-plus"
                    @click="handleAddItem"
                  ></v-btn>
                </template>
                <template v-else>
                  <v-btn
                    density="comfortable" variant="outlined" flat
                    icon="mdi-minus"
                    @click="handleRemoveItem(item)"
                  ></v-btn>
                </template>
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
            Rebundle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import {
    getCurrentInstance,
    nextTick,
    reactive,
    ref,
    toRaw,
    toRefs,
    computed,
  } from "vue";
  import { toast } from "vue3-toastify";
  import { v4 as uuidv4 } from "uuid";
  import { reject } from "lodash";
  import API from "../api";
import { error } from "jquery";

  const items = [{"order_code":23232,"value":11}]
  const it = ref(1)
  
  const { proxy } = getCurrentInstance();
  const emit = defineEmits(["refresh"]);
  const visible = ref(false);
  const tableHeaders = ref([
  {title: "Code", key: "code", sortable: true, minWidth: 160},
  {
    title: "Allocated Order Item", key: "order_item.line_item_code",
    value: (item) => {
      return `${item.order_item?.order?.order_code || ''}-${item.order_item?.line_item_code || ''}`;
    }, minWidth: 180, sortable: true
  },
  {title: "Length(mm)", key: "length_mm", sortable: true},
  {title: "Quantity", key: "quantity", sortable: true},
  {title: "Defective Pieces", key: "defect_quantity", sortable: true},
  {title: "Area Code", key: "area.code", sortable: true},

  {
    title: "Reserved Order Item", key: "reserved_order_item.line_item_code",
    value: (item) => {
      return `${item.reserved_order_item?.order?.order_code || ''}-${item.reserved_order_item?.line_item_code || ''}`;
    }, minWidth: 180, sortable: true
  },
  {title: "Rolling Code", key: "rolling.rolling_code", value: (item) => item.rolling?.rolling_code, sortable: true},
  {title: "Comment", key: "comment", value: (item) => item.comment, sortable: true},
]);

  const tableList = ref([]);
  const loading = ref(false);
  const upQuantity = ref(0);
  let menuTree = localStorage.getItem("menuButtonPermission");
  menuTree = JSON.parse(menuTree);
  
  const data = reactive({
    form: {
      id: '',
      runout_id: 0,
      cast_id: 0,
      status: '',
      exist_flag: '',
      allocation_status: '',
      update_quantity: 0,
      type: '',
      length_mm: '',
      width_mm: '',
      estimated_weight_kg: '',
      mill_id: 0,
      product_type_id: 0,
      rolling_id: 0,
      split: [
        {
          id: '',
          code: '',
          fake_code: '',
          order_item_data: '',
          order_item: {},
          order_items: [],
          key: uuidv4(),
          length: '',
          comments: '',
          quantity: '',
        },
      ],
    },
    rules: {
      bars: [
        (value) => {
          if (!value) return 'Bars No. is required.';
          if (!Number.isInteger(Number(value))) return 'Bars No. must be an integer.';
          if (Number(value) > selectedQuantity.value) return `Bars No. cannot exceed ${selectedQuantity.value}.`;
          if (Number(value) <= 0) return 'Bars No. must be greater than 0.';
  
          return true;
        },
      ],
      length: [
      (value) => {
        if (!value) return 'Length is required.';
        if (!Number.isInteger(Number(value))) return 'Length must be an integer.';
        if (Number(value) > selectedMaxLength.value) return `Bars No. cannot exceed ${selectedMaxLength.value}.`;
        // const selectedSteel = form.value.split.map(item => ({
        //   quantity: Number(item.quantity),
        //   length: Number(item.length),
        // }));
        // const isValidCutting = checkValidCutting(selectedSteel, Number(value));
        // if (!isValidCutting) return 'This combination of quantity and length is not allowed.';

        // const isValidCutting = checkValidCutting(selectedSteel, Number(value));
        // if (!isValidCutting) return 'This combination of quantity and length
        // return true;
        },
      ],
      code: [
        (value) => {
          if (!value) return 'Bundle No. is required.';
          return true;
        },
      ],
    },
    selectedCode: '',
    selectedQuantity: '',
    selectOrderItemData: [],
    selectedData: '',
    selectedQualifiedQuantity: '',
    selectedLength: '',
    selectedMaxLength: '',
    selectedComments: '',
    selectedRolling: [],
    allocatedOrderItems: [],
    selectedFinished: [],
  });
  
  const { form, rules, selectedCode, selectedQuantity, selectedQualifiedQuantity, selectedLength, selectedRolling, allocatedOrderItems, selectedData, selectOrderItemData, selectedFinished, selectedComments, selectedMaxLength } = toRefs(data);
  
  const totalLengths = computed(() => {
    return tableList.value.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.length_mm));
    }, 0);
  });

  const newLength = computed(() => {
    return form.value.split.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.length));
    }, 0);
  });

  const newLengthColor = computed(() => {
    if (newLength.value < totalLengths.value * 0.8) {
      return '#FFA500';
    } else if (newLength.value <= totalLengths.value) {
      return 'green';
    } else {
      return 'red';
    }
  });

  const calculatedWeight = ref(0);
  const calculatedLength = ref(0);

  const handleShow = (data) => {
    visible.value = true;
    tableList.value = data;
    form.value.id = data[0].id;
    form.value.runout_id = data[0].runout_id;
    form.value.cast_id = data[0].cast_id;
    form.value.mill_id = data[0].mill_id;
    form.value.type = data[0].type;
    form.value.status = data[0].status;
    form.value.exist_flag = data[0].exist_flag;
    form.value.allocation_status = data[0].allocation_status;
    form.value.estimated_weight_kg = data[0].estimated_weight_kg;
    form.value.length_mm = data[0].length_mm;
    form.value.width_mm = data[0].width_mm;
    form.value.product_type_id = data[0].product_type_id;
    form.value.rolling_id = data[0].rolling_id;
    form.value.split = data.length > 0 ? [{
      code: data[0].code || '', 
      order_item: `${data[0].order_item?.order?.order_code || ''}-${data[0].order_item?.line_item_code || ''}`, 
      order_items: Array.from(new Set(
          data
            .map(item => `${item.order_item?.order?.order_code || ''}-${item.order_item?.line_item_code || ''}`)
            .filter(value => value.split('-')[0] !== '') 
        ))
          .map(value => ({
            order_code: value,
            value: data.find(item => `${item.order_item?.order?.order_code || ''}-${item.order_item?.line_item_code || ''}` === value)?.order_item?.id
          })),
      key: uuidv4(),
      length: '',
      comments: '',
      quantity: '',
    }] : [];
    selectOrderItemData.value = Array.from(new Set(form.value.split[0].order_items.map(item => item.value)))
    .map(value => form.value.split[0].order_items.find(item => item.value === value));
    selectedCode.value = data[0].code;
    selectedComments.value = data[0].comment;
    selectedData.value = data;
    selectedQuantity.value = data.reduce((total, item) => total + Number(item.quantity), 0)
    selectedLength.value = Math.min(...data.map(item => Number(item.length_mm) || Infinity));
    form.value.split.forEach(item => {
      item.length = selectedLength.value;
    });
    selectedMaxLength.value = Math.max(...data.map(item => Number(item.length_mm) || Infinity));
    form.value.split.forEach(item => {
      item.length = selectedLength.value;
    });
    selectedRolling.value = data.map(item => item.rolling_id);
    selectedFinished.value = data.map(item => item.id);
    selectedQualifiedQuantity.value = data[0].qualified_quantity;
    const totalCalculatedWeight = data.reduce((total, item) => {
      const quantity = data[0].quantity;
      const estimatedWeight = data[0].estimated_weight_kg;
      if (quantity > 0) {
        return estimatedWeight / quantity; // 累加每个项的计算结果
      }
      return total;
    }, 0);

    calculatedWeight.value = totalCalculatedWeight;
    calculatedLength.value = calculatedWeight.value / form.value.length_mm;
    allocatedOrderItems.value = data.map(item => ({
        id: item.order_item?.order?.order_code,
        order_code: item.order_item?.order?.order_code,
        order_item_code: item.order_item_code,
        code: item.code || "New",
        line_item_code: item.line_item_code,
        comments: item.comment,
    }));
  };
  const allocatedOrderItemsLength = computed(() => allocatedOrderItems.value.length);
  const isAllocatedItem = (index) => index < allocatedOrderItemsLength.value;
  
  const handleAddItem = () => {
  const { split } = toRaw(form.value);
  const existingCount = form.value.split.length;
  const currentItem = selectedData.value[existingCount];
  if (currentItem) {
    form.value.split = [  
      ...split,
      {
        id: currentItem.id,
        code: currentItem.code || '', 
        order_item: `${currentItem.order_item?.order?.order_code || ''}-${currentItem.order_item?.line_item_code || ''}`,
        key: uuidv4(),
        order_items: selectOrderItemData.value || [],
        length: selectedLength.value,
        comments: '',
        quantity: '',
      },
    ];
  } else {
    form.value.split = [  
      ...split,   
      {
        order_items: selectOrderItemData.value || [],
        key: uuidv4(),
        length: selectedLength.value,
        comments: '',
        quantity: '',
      },
    ];
  }
};
  
  const handleRemoveItem = (item) => {
    const index = form.value.split.findIndex(i => i.key === item.key);
    if (index !== -1) {
      form.value.split.splice(index, 1);
      if (index < allocatedOrderItemsLength.value) {
        allocatedOrderItems.value.splice(index, 1);
      }
    }
  };
  
  const handleClose = () => {
    visible.value = false;
    form.value = {
      id: '',
      split: [
        {
        code: '',
        order_item: '',
        order_items: [],
        key: uuidv4(),
        length: '',
        comments: '',
        quantity: '',
        },
      ],
    };
    nextTick(() => {
      proxy.$refs["editForm"].resetValidation();
    });
  };

  const handleSave = async () => {
    const { valid } = await proxy.$refs["editForm"].validate();
    if (!valid) {
      return;
    }
  
    const totalBars = form.value.split.reduce((sum, item) => sum + parseInt(item.quantity, 10), 0);
    const totalLength = form.value.split.reduce((sum, item) => sum + parseInt(item.length, 10), 0);
    let otherCode = [];
    const lengthData = tableList.value.map(item => ({
      length: Number(item.length_mm),
      quantity: Number(item.quantity),
    }));

    lengthData.sort((a, b) => b.length - a.length);

    const maxLengthItem = lengthData[0]; 
    const secondMaxLengthItem = lengthData.length > 1 ? lengthData[1] : maxLengthItem; 

    const minLength = secondMaxLengthItem.length;
    const minQuantity = secondMaxLengthItem.quantity;
    const maxLength = maxLengthItem.length;
    const maxQuantity = maxLengthItem.quantity;

    for (const item of form.value.split) {
      const splitLength = Number(item.length);
      const splitQuantity = Number(item.quantity);

      if (splitLength > minLength && splitLength < maxLength) {
        if (splitQuantity > maxQuantity) {
          toast.error(`Split length ${splitLength}mm exceeds the allowed quantity ${maxQuantity}.`, { autoClose: 60000 });
          return;
        }
      }
    }

    const listTotalLengths = lengthData.reduce((sum, item) => sum + item.quantity * item.length, 0);

    if (newLength.value > listTotalLengths) {
      toast.error("The added total length cannot exceed the overall total length.", { autoClose: 60000 });
      return;
    }
    otherCode = tableList.value.filter(item => item.code !== null).map(item => item.code);

    loading.value = true;
    const params = toRaw(form.value);
    if (params.split.length === 1) {
      const firstCode = params.split[0].code;

      const firstItem = tableList.value.find(item => item.code == params.split[0].code);
      if (firstItem) {
        const maxAllowedLength = firstItem.quantity * firstItem.length_mm;
        if (newLength.value > maxAllowedLength) {
          upQuantity.value = 1;
        }
      }
    }
    try {
      await API.updateRebundel({
        rolling_ids: selectedRolling.value,
        finished_ids: selectedFinished.value,
        runout_id: params.runout_id,
        cast_id: params.cast_id,
        type: params.type,
        mill_id: params.mill_id,
        status: params.status,
        length_mm: params.length_mm,
        width_mm: params.width_mm,
        estimated_weight_kg: calculatedWeight.value,
        estimated_length_mm: calculatedLength.value,
        exist_flag: params.exist_flag,
        other_code: otherCode,
        new_length: newLength.value ?? 0,
        update_quantity: upQuantity.value,
        allocation_status: params.allocation_status,
        product_type_id: params.product_type_id,
        rolling_id: params.rolling_id,
        rebundel: params.split.map(item => ({
          order_items: item.order_item_data,
          quantity: item.quantity,
          bars: parseInt(item.quantity, 10),
          comment: item.comments,
          length: item.length,
          code: item.code, 
          order_item: item.order_item,
          finished_id: item.id,
        })),
      });
      handleClose();
      emit("refresh");
      toast.success("Rebundle Success", {
        position: "bottom-center",
      });
    } catch (res) {
      const detail = res.response?.data?.detail || 'An error occurred';
      toast.error(`Rebundle Fail:
      ${detail}`, { autoClose: 60000 });
    } finally {
      loading.value = false;
    }
  };
  
  defineExpose({
    handleShow,
  });
  </script>
  
  <style lang="scss" scoped>
  </style>
