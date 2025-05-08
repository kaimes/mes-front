<template>
  <v-dialog v-model="visible" max-width="80%" :close-on-back="false" persistent>
    <v-card title="Split">
      <div class="text-subtitle-2 ml-4 mr-4 mb-2">List of selected</div>
      <div class="pa-4 border rounded ml-4 mr-4">
        <v-data-table fixed-header :headers="tableHeaders" :items="tableList" density="default" height="120"
                      item-value="id">
          <template #bottom>
          </template>
        </v-data-table>
      </div>
      <v-form ref="Form">
        <div class="d-flex align-center pr-9 pb-4 pt-4">
          <span class="ml-4">New</span>
          <v-spacer></v-spacer>
          <v-btn density="default" variant="outlined" icon="mdi-plus" @click="handleAddItem"></v-btn>
        </div>
        <div v-for="row in form.items" class="mult" :key="row.key">
          <v-card width="100%">
            <v-row class="mt-2 ml-2 mr-2 mb-2">
              <v-col cols="2">
                <DictCode code="cut_sequence_plan_saw_route" v-model="row.saw_route" label="Saw Route"
                          density="default"
                          :rules="rules.saw_route"></DictCode>
              </v-col>

              <v-col cols="2">
                <v-text-field
                    v-model="row.new_seq"
                    label="New Seq"
                    type="number"
                    density="default"
                    :rules=rules.new_seq
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                    v-model="row.new_bars"
                    label="New Bars"
                    type="number"
                    density="default"
                    :rules=rules.new_bars
                ></v-text-field>
              </v-col>

              <v-col cols="1">
                <v-text-field
                    v-model="row.rd_ri"
                    label="Rd/Rl"
                    density="default"
                    :rules=rules.rd_ri
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                    v-model="row.load_pen"
                    label="Load/Pen"
                    density="default"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-text-field
                    v-model="row.load_no"
                    label="No. of Load"
                    density="default"
                ></v-text-field>
              </v-col>

              <v-col cols="1">
                <v-text-field
                    v-model="row.pta_code"
                    label="PTA Code"
                    density="default"
                    :rules=rules.pta_code
                ></v-text-field>
              </v-col>

            </v-row>
          </v-card>
          <div class="mult-action">
            <v-btn
                density="default"
                variant="outlined"
                icon="mdi-minus"
                class="mr-4"
                @click="removeRow(row)"
            ></v-btn>
          </div>
        </div>
      </v-form>

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
import {getCurrentInstance, reactive, ref, toRaw} from "vue";
import API from "@/rolling/cut_sequence_plan/api";
import {toast} from "vue3-toastify";
import {v4 as uuidv4} from "uuid";
import {reject} from "lodash";
import DictCode from "@/components/picker/DictCode.vue";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const loading = ref(false);
const visible = ref(false);
const tableHeaders = [
  {title: 'New Seq', key: 'new_seq', value: (item) => formatSawSeq(item.saw_route, item.new_seq), sortable: true},
  {
    title: 'Original Seq',
    key: 'original_seq',
    value: (item) => formatSawSeq(item.original_saw_route, item.original_seq),
    sortable: true
  },
  {
    title: 'Order Number',
    key: 'order_item.order.order_code',
    value: (item) => item?.order_item?.order?.order_code,
    sortable: true
  },
  {
    title: 'Line Item Number',
    key: 'order_item.line_item_code',
    value: (item) => item?.order_item?.line_item_code,
    sortable: true
  },
  {
    title: 'Weight (Ton)',
    key: 'weight',
    sortable: true
  },
  {title: 'New Bars', key: 'new_bars', sortable: true},
  {title: 'Original Bars', key: 'original_bars', sortable: true},
  {title: 'RD/RL', key: 'rd_ri', sortable: true},
  {title: 'Load/Pen', key: 'load_pen', sortable: true},
  {title: 'No. of Load', key: 'no_of_load', sortable: true},
  {title: 'PTA Code', key: 'pta_code', sortable: true},
];

const rules = {
  saw_route: [
    v => !!v || 'Saw Route is required'
  ],
  new_seq: [
    v => !!v || 'New Seq is required'
  ],
  new_bars: [
    v => {
      return !!v || 'New Bars is required'
    },
    v => {
      if (v && v < 0) {
        return 'New Bars must be greater than 0'
      }
      return true
    },
    v => {
      if (v && v > tableList.value[0].new_bars) {
        return `New Bars must be less than or equal ${tableList.value[0].new_bars}`
      }
      return true
    }

  ],
  rd_ri: [
    v => !!v || 'Rd/Rl is required'
  ],
  load_pen: [
    v => !!v || 'Load/Pen is required'
  ],
  load_no: [
    v => !!v || 'No. Load is required'
  ],
  pta_code: [
    v => !!v || 'PTA Code is required'
  ],
};


const tableList = ref([]);

const handleShow = (data) => {
  console.log('====show', data)
  visible.value = true;
  tableList.value = data;
}

const form = reactive({
  items: [{
    key: uuidv4(),
    saw_route: undefined,
    new_seq: undefined,
    new_bars: undefined,
    rd_ri: 'Load',
    load_pen: undefined,
    load_no: undefined,
    pta_code: 'ADC',
  }],
});


const handleClose = () => {
  visible.value = false;
  form.items = [{
    key: uuidv4(),
    saw_route: undefined,
    new_seq: undefined,
    new_bars: undefined,
    rd_ri: 'Load',
    load_pen: undefined,
    load_no: undefined,
    pta_code: 'ADC',
  }];

}

const formatSawSeq = (saw, seq) => {
  return saw + seq.toString().padStart(3, '0');
};


const handleSave = async () => {
  const {valid} = await proxy.$refs["Form"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form);
  params.id = tableList.value[0].id;
  try {
    await API.split(params);
    handleClose();
    emit("refresh");
    toast.success("Split Success", {
      position: "bottom-center"
    });
  } catch (error) {
    toast.error(error?.response?.data?.detail || "Split Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}


const handleAddItem = () => {

  console.log('handleAddItem', form.items.length)
  const {items} = toRaw(form);
  form.items = [
    ...items,
    {
      key: uuidv4(),
      saw_route: undefined,
      new_seq: undefined,
      new_bars: undefined,
      rd_ri: 'Load',
      load_pen: undefined,
      no_of_load: undefined,
      pta_code: 'ADC',
    }
  ];
  console.log('handleAddItem', form.items.length, form.items)

}

const removeRow = (item) => {
  const {items} = toRaw(form);
  form.items = reject(items, {key: item.key});

}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>

.mult {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  margin-bottom: 18px;

  &-content {
    flex: 1;
  }

  &-action {
    padding-left: 12px;
  }
}
</style>
