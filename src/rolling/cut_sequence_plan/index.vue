<template>
  <v-container fluid class="content">
    <v-row>
      <v-col cols="3" class="d-flex align-center">
        <div class="text-body-3 text-grey-darken-4 mr-2 font-weight-bold" style="width: 100px">Rolling Code:</div>
        <div class="text-body-1 text-grey-darken-3">
          {{ rolling_code || '--' }}
        </div>
      </v-col>
      <v-col cols="3" class="d-flex align-center">
        <div class="text-body-3 text-grey-darken-4 mr-3 font-weight-bold" style="width: 30px">KGM:</div>
        <div class="text-body-1 text-grey-darken-3">
          {{ route.query.kgm || '--' }}
        </div>
      </v-col>

      <v-spacer></v-spacer>
      <v-col cols="4" class="d-flex align-center justify-end mt-2">
        <v-btn
            v-show="false"
            class="text-none mr-6 "
            color="#e3e3e3"
            variant="flat"
            @click="handleReset"
        >
          Reset
        </v-btn>
        <v-btn
            v-show="false"
            color="primary"
            class="text-none mr-4 "
            @click="handleSearch"
            variant="flat"

        >
          Search
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex align-center mt-4 mb-4 ga-4">
      <v-btn
          color="primary"
          variant="flat"
          @click="handleAutoPlan"
          :disabled="totalLength > 0"
      >
        Auto Create
      </v-btn>
      <v-btn
          color="primary"
          variant="flat"
          @click="handleAutoLoadPlan"
      >
        Auto Load Plan
      </v-btn>
      <v-btn
          color="primary"
          variant="flat"
          @click="handleSplit"
          :disabled="!itemsSel.length"
      >
        Split
      </v-btn>
      <v-btn
          color="primary"
          variant="flat"
          @click="handleMove"
          :disabled="!itemsSel.length"
      >
        Move
      </v-btn>
      <v-btn
          color="primary"
          variant="flat"
          @click="handlePrint"
      >
        Print
      </v-btn>
      <v-btn
          color="primary"
          variant="flat"
          @click="handlePrintLoadInstruction"
      >
        Print Load Inst
      </v-btn>
      <v-btn
          color="primary"
          variant="flat"
          @click="handlePrintCutSeqSum"
      >
        Print Cut Seq Sum
      </v-btn>
      <v-btn
          color="primary"
          variant="flat"
          @click="handleAdd"
      >
        Create
      </v-btn>
    </div>
    <v-card elevation="0" variant="outlined">
      <div class="saw-line-summary pa-4">
        <div class="d-flex flex-nowrap align-center" style="gap: 8px">  
          <div class="text-subtitle-1 font-weight-bold">Saw line weights:</div>
          <template v-for="(item, index) in tableDataSaw" :key="item.saw_route">
            <div class="d-flex align-center" style="gap: 4px">  
              <span 
                class="text-decoration-none primary--text"
                :class="{ 'font-weight-bold': ['East','West','Secondary'].includes(item.saw_line) }"
              >
                {{ item.saw_line }}
              </span>
              <span class="ml-2">  
                {{ `${item.requested_group_tonnes?.toFixed(1) || 0} (${calculatePercentage(item)})` }}
              </span>
              <span v-if="index < tableDataSaw.length -1" class="ml-1 mr-2">,</span>
            </div>
          </template>
        </div>
      </div>
      <v-expansion-panels v-model="tabs" multiple :rounded="24" variant="accordion" bg-color="white">
        <v-expansion-panel v-for="it in sawRouter" :key="it.value" :title="`Route: ${it.title}`">
          <v-expansion-panel-text>
            <v-data-table
                height="250"
                :headers="headers"
                :items="tableData[it.value]"
                :loading="loading"
                show-select
                return-object
                fixed-header
                :items-per-page="5"
                :page.sync="1"
                v-model="tableSelections[it.value]"
            >
              <!-- <template #bottom>
              </template> -->

              <template v-slot:item.order_item.order.order_code="{ item }">
                <router-link 
                  class="d-flex align-center text-decoration-none grey-darken-4"
                  :to="{ path: '/order_item', query: { id: item.order_item?.order.id } }"
                >
                  <span class="w-100 d-inline-block">{{ item.order_item?.order?.order_code || '111111' }}</span>
                </router-link>
              </template>
              <template v-slot:item.order_item.line_item_code="{ item }">
                <router-link 
                  class="d-flex align-center text-decoration-none grey-darken-4"
                  :to="{ name: 'OrderItemDetail', query: { id: item.order_item?.id } }"
                >
                  <span class="w-100 d-inline-block">{{ item.order_item?.line_item_code || '10' }}</span>
                </router-link>
              </template>

              <template v-slot:[`item.action`]="{ item }">
                <span class="d-flex align-center ga-2">
                  <v-icon size="small" @click="handleEdit(item, it.title)">mdi-pencil</v-icon>
                  <v-icon size="small" @click="handleDelete(item)">mdi-delete</v-icon>
                </span>
              </template>
            </v-data-table>
            <div class="d-flex justify-end pa-2">
              <div class="mr-4">Requested Group Tonnes: {{ formatTon(weights[it.value], 3) }}</div>
              <div>Percentage (%): {{ formatTon(weights[it.value] / weights.total * 100, 2) }}</div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

    </v-card>

  </v-container>

  <Move ref="moveRef" @refresh="handleSearch"></Move>
  <Split ref="SplitRef" @refresh="handleSearch"></Split>
  <CreateLoad ref="CreateLoadRef" @refresh="handleSearch"></CreateLoad>
  <CreateDialog ref="createDialogRef" @refresh="handleSearch"/>
  <DeleteDialog ref="deleteDialogRef" @refresh="handleSearch"/>
</template>

<script setup>
import {computed, getCurrentInstance, onMounted, reactive, ref, toRaw, watch } from 'vue';
import {toast} from "vue3-toastify";
import API from './api';
import RollingCode from "@/components/picker/RollingCode.vue";
import OrderCode from "@/components/picker/OrderCode.vue";
import useCommonStore from "@/app/common";
import Move from "./components/Move.vue";
import Split from "./components/Split.vue";
import CreateDialog from './components/CreateDialog.vue';
import DeleteDialog from './components/DeleteDialog.vue';
import CreateLoad from "./components/createLoad.vue";
import {useRoute} from "vue-router";
import printJS from "print-js";
import RollingApi from "../rolling_list/api"
import {formatDate} from "@/util/util";



const commonStore = useCommonStore();
const {proxy} = getCurrentInstance();
const route = useRoute();

const sawRouter = ref([]);


const loading = ref(false);
const itemsSel = ref([]);
const tabs = ref([0, 1, 2]);


const tableData = reactive({});
const tableSelections = reactive({});
const weights = reactive({});
const totalLength = ref(0);

const initSawRoute = () => {
  sawRouter.value = commonStore.dict?.cut_sequence_plan_saw_route
  for (const route of sawRouter.value) {
    tableData[route.value] = [];
    tableSelections[route.value] = [];
    weights[route.value] = 0;
  }
  weights.total = 0;
  for (const key in tableData) {
    if (tableData.hasOwnProperty(key)) {
        // 获取当前属性对应值的长度，并累加到 totalLength 中
        totalLength.value += tableData[key].length;
    }
  }
  
};
const rolling_id = ref(null)
const rolling_code = ref('')
const order_group_id = ref(null)
const kgm = ref(null)
const thickness = ref(null)
const roll_ref = ref('')

const order_id = ref(null)
const order_code = ref('')
const printDate = ref([])
const printLoadInstructionData = ref([])
const printCutSeqSumData = ref([])

const queryParams = reactive({
  page: 1,
  itemsPerPage: -1,
  sortBy: ['saw_route', 'new_seq'],
  descending: [true],
});

const tableDataSaw = ref([]);
const tableDataSawLoading = ref(false);
const tableDataSawHeaders = ref([
  { title: 'Saw Line', key: 'saw_line' , sortable: true},
  { title: 'Requested Group (Ton)', key: 'requested_group_tonnes' ,value:(item)=>formatTon(item.requested_group_tonnes,3),  sortable: true},
  { title: 'Percentage (%)', key: 'percentage', sortable: true ,
    value:(item)=> ((item.requested_group_tonnes / tableDataSawTotalTon.value * 100.0)|| 0 ).toFixed(2) },
]);
const tableDataSawSel = ref([]);
const tableDataSawTotalTon = ref(0)


const calculatePercentage = (item) => {
  const total = tableDataSawTotalTon.value || 1 
  const percentage = ((item.requested_group_tonnes / total) * 100).toFixed(2)
  return `${percentage}%`
}

const isCreateDisabled = computed(() => {
  return (!rolling_id.value);
});

const headers = [
  {title: 'Action', key: 'action', minWidth: 60, fixed: true, sortable: false, align: "center"},
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
    sortable: true,
    // value: (item) => item?.order_item?.order?.order_code,
    sortable: true
  },
  {
    title: 'Line Item Number',
    key: 'order_item.line_item_code',
    sortable: true,
    // value: (item) => item?.order_item?.line_item_code || '10',
    sortable: true
  },
  {
    title: 'Weight (Ton)',
    key: 'weight',
    sortable: true
  },
  {
    title: 'Length (mm)',
    key: 'length',
    sortable: true
  },
  {title: 'New Bars', key: 'new_bars', sortable: true},
  {title: 'Original Bars', key: 'original_bars', sortable: true},
  {title: 'No.of Load', key: 'load_no', sortable: true},
  {title: 'PTA Code', key: 'pta_code', sortable: true},
];
const printFields = [
  {displayName: "New Seq", field: "new_seq"},
  {displayName: "Original Seq", field: "original_seq"},
  {displayName: "Order Number", field: "order"},
  {displayName: "Line Item Number", field: "order_item"},
  {displayName: "Weight (Ton)", field: "weight"},
  {displayName: "PTA Code", field: "pta_code"},
  {displayName: "New Bars", field: "new_bars"},
  {displayName: "Original Bars", field: "original_bars"},
  {displayName: "No.of Load", field: "no_of_load"},
  {displayName: "PTA Code", field: "pta_code"},
];

const printLoadInstructionFields = [
  {displayName: "Wt Metre", field: "kgm"},
  {displayName: "Thick", field: "thick"},
  {displayName: "Seq No", field: "seq_no"},
  {displayName: "Num Bars", field: "num_bars"},
  {displayName: "Length", field: "length"},
  {displayName: "O.G.Qual", field: "quality_code"},
  {displayName: "NUM TIES", field: "num_ties"},
  {displayName: "Bund Size", field: "bundle_size"},
  {displayName: "Ord Type", field: "type_of_order"},
  {displayName: "Max Bars/Bundle", field: "max_bundle"},
  {displayName: "Remarks", field: "remarks"},
];

const printCutSeqSumFields = [
  {displayName: "ORD GRP QUALITY", field: "quality_code"},
  {displayName: "FIRST SEQUENCE NUMBER", field: "original_seq"},
  {displayName: "LAST SEQUENCE NUMBER", field: "new_seq"},
  {displayName: "SUM NUMBER OF BARS", field: "new_bars"},
  {displayName: "LENGTH", field: "length"},
  {displayName: "SUM WEIGHT", field: "weight"},
  {displayName: "REMARKS", field: "remarks"}
];

const getAll = () => {
  loading.value = true;
  try {
    const params = toRaw(queryParams);

    params.fields = [];
    params.ops = [];
    params.values = [];

    if (rolling_id.value) {
      params.fields.push('rolling_id');
      params.ops.push('eq');
      params.values.push(rolling_id.value);
    }
    if (order_group_id.value) {
      params.fields.push('order_group_id');
      params.ops.push('eq');
      params.values.push(order_group_id.value);
    }
    // 按照 saw_route 和 new_seq 进行升序排序
    params.sortBy = ['saw_route', 'new_seq'];
    params.descending = [false, false];

    API.getAll(params).then((res) => {
      weights.total = 0;
      //提分类前的数据 用于print
      printDate.value = res.data.items
      if (res.data.items.length > 0) {
        roll_ref.value = res.data.items[0].order_item?.product_type?.product_size?.roll_ref_code || "";
        thickness.value = res.data.items[0].rolling?.thick || "0.0";
      }
      sawRouter.value.forEach(route => {
        const filteredItems = res.data.items.filter(item => item.saw_route === route.value);
        tableData[route.value] = filteredItems;
        tableSelections[route.value] = [];
        weights[route.value] = filteredItems.reduce((acc, item) => acc + (item?.weight || 0), 0);
        weights.total += weights[route.value];
      });
      console.log(weights.total);

      tableDataSaw.value = sawRouter.value.map(route => {
        const itemsInRoute = res.data.items.filter(item => item.saw_route === route.value);
          return {
            saw_line: route.title,
            saw_route: route.value,
            requested_group_tonnes: itemsInRoute.reduce((acc, item) => acc + (item?.weight || 0), 0)
          };
      });

      tableDataSawTotalTon.value = tableDataSaw.value.reduce(
        (acc, item) => acc + item.requested_group_tonnes, 
      0
      );
      for (const key in tableData) {
        if (tableData.hasOwnProperty(key)) {
            totalLength.value += tableData[key].length;
        }
      }

    });
  } catch (error) {
    toast.error(error?.response?.data?.detail || 'Failed to Get Data', { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};


const handleSearch = () => {
  getAll();
};

const handleAdd = () => {
  proxy.$refs["createDialogRef"].handleShow();

}
const handleReset = () => {
  rolling_id.value = null;
  rolling_code.value = null;
  order_id.value = null;
  order_code.value = null;
  getAll();
};
const handleSplit = () => {
  if (itemsSel.value.length > 1) {
    toast.error('Only one item can be selected for split', { autoClose: 60000 });
    return;
  }
  proxy.$refs["SplitRef"].handleShow(toRaw(itemsSel.value));
};

const handleMove = () => {
  proxy.$refs["moveRef"].handleShow(toRaw(itemsSel.value), tableData);
};

const handlePrint = () => {
  
    try {
      
        RollingApi.get(route.query?.rolling_id).then(result => {
          let quality_code = result.data.quality_code
          API.print({
            "rolling_code": route.query?.rolling_code,
            "quality_code": quality_code
          }).then(res => {
            if (res.status === 200) {
              toast.success("Send Message M107 execute in background!", {position: "bottom-center"});
            } else {
              toast.success("Send Message M107 Failed!", {position: "bottom-center"});
            }
          }).catch(error => {
            toast.error(error?.response?.data?.detail || `Failed to Send Message. Caused: ${error}`, { autoClose: 60000 });
          });
        })
      } catch (error) {
        toast.error("Failed to Send Message."+ error,{ autoClose: 60000 });
      }
    const printTable = printDate.value.map(it => {
    return {
      new_seq: it.new_seq || "",
      original_seq: it.original_seq || "",
      order: it.order_item.order.order_code || "",
      order_item: it.order_item.line_item_code || "",
      weight: it.weight || "",
      pta_code: it.pta_code || "",
      new_bars: it.new_bars || "",
      original_bars:it.original_bars || "",
      rd_ri:it.rd_ri || "",
      no_of_load: it.no_of_load || "",
      load_pen: it.load_pen || "",
    };
  });
  // 处理筛选出来的字段
  const $titles = headers.map(item => item.title);
  const properties = printFields.filter((item) => $titles.includes(item.displayName));
  printJS({
    printable: printTable,
    properties,
    type: "json",
    header: "Cut Sequence",
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}


const handlePrintLoadInstruction = async () => {
  const resp = await API.printLoadInstruction({rolling_id: rolling_id.value, order_group_id:order_group_id.value});
  printLoadInstructionData.value = resp.data;
  const currentDate = formatDate(new Date(), 'YY/MM/DD');
  const rollNo = rolling_code.value.split("-").at(-1);
  const printTable = printLoadInstructionData.value.map(it => {
    return {
      kgm: it.wt_metre || "",
      thick: it.thick || "0.0",
      seq_no: it.seq_no || "",
      num_bars: it.num_bars || "",
      length: parseFloat(it.length).toFixed(3) || "",
      quality_code: it.quality_code || "",
      num_ties: it.num_ties || "",
      bundle_size: it.bundle_size || "",
      type_of_order: it.order_type || "",
      max_bundle: it.max_bars || "",
      remarks: it.remarks || "",
    };
  });
  const properties = printLoadInstructionFields
  printJS({
    printable: printTable,
    properties,
    type: "json",
    header: `<div style="text-align: center;">Summary of Loading Instructions for Piler Driver<br>Date  :  ${currentDate || ""}&nbsp;&nbsp;&nbsp;Roll No  :  ${rollNo}&nbsp;&nbsp;&nbsp;Roll Ref  :  ${roll_ref.value}</div>`,
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 0px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 0px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}


const handlePrintCutSeqSum = async () => {
  // const resp = await API.printLoadInstruction({rolling_id: rolling_id.value, order_group_id:order_group_id.value});
  // printLoadInstructionData.value = resp.data;
  const currentDate = formatDate(new Date(), 'MM/DD/YY');
  const currentTime = formatDate(new Date(), 'HH:mm:ss');
  const rollingSubCode = rolling_code.value.split("-")
  const rollNo = rollingSubCode.at(-1);
  const section = `${rollingSubCode[1]}X${rollingSubCode[2]} ${rollingSubCode[0]}`
  let eastTotalWeight = 0;
  let westTotalWeight = 0;
  let secondaryTotalWeight = 0;
  for (let i = 0; i < tableDataSaw.value.length; i++) {
    const element = tableDataSaw.value[i];
    if (element.saw_line == 'East') {
      eastTotalWeight = parseFloat(element.requested_group_tonnes).toFixed(3);
    } else if (element.saw_line == 'West') {
      westTotalWeight = parseFloat(element.requested_group_tonnes).toFixed(3);
    } else {
      secondaryTotalWeight = parseFloat(element.requested_group_tonnes).toFixed(3);
    }
  }
  const printTable = printDate.value.map(it => {
    return {
      quality_code: it.order_item?.quality_code || "",
      original_seq: `${it.original_saw_route}${it.original_seq.toString().padStart(3, '0')}` || "",
      new_seq: `${it.saw_route}${it.new_seq.toString().padStart(3, '0')}` || "",
      new_bars: it.new_bars || "",
      length: (parseFloat(it.order_item.length_mm) / 1000).toFixed(3) || "",
      weight: it.weight || "",
      remarks: it.remarks || "",
    };
  });

  // 处理筛选出来的字段
  // const $titles = headers.map(item => item.title);
  const properties = printCutSeqSumFields;
  printJS({
    printable: printTable,
    properties,
    type: "json",
    header: `
      <div style="text-align: right">Produced on ${currentDate} at ${currentTime}</div>
      <div style="text-align: center;">FEC - SUMMARY OF SEQUENCE PRINT<br>ROLL NUMBER  :  ${rollNo}&nbsp;&nbsp;&nbsp;ROLL REFERENCE  :  ${roll_ref.value}&nbsp;&nbsp;&nbsp;SECTION  :  ${section}</div>
      <div style="text-align: center;">KGM  :  ${kgm.value}&nbsp;&nbsp;&nbsp;THICKNESS  :  ${thickness.value}</div>
      <div style="text-align: center;"><br></div>
      <div style="text-align: right">E A S T &nbsp;&nbsp; T O N N A G E : ${eastTotalWeight}</div>
      <div style="text-align: right">W E S T &nbsp;&nbsp; T O N N A G E : ${westTotalWeight}</div>
      <div style="text-align: right">S E C O N D A R Y &nbsp;&nbsp;&nbsp; T O N N A G E : ${secondaryTotalWeight}</div>
    `,
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 0px solid #909399;text-align:center;padding: 2px', // 表格头样式
    gridStyle: 'border: 0px solid #909399; text-align:center;padding: 2px', // 表哥体样式
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}' // 表格样式
  });
}


const handleCreate = () => {
  API.create({rolling_id: rolling_id.value, order_id:order_id.value}).then((res) => {
    toast.success('Created successfully', {
      position: "bottom-center"
    });
    getAll();
  }).catch((error) => {
    toast.error(error?.response?.data?.detail || 'Failed to create', { autoClose: 60000 });
  });
};

const handleAutoLoadPlan = () => {
  API.autoLoadPlan({rolling_id: rolling_id.value, order_group_id:order_group_id.value}).then((res) => {
    toast.success('Auto load plan successfully', {
      position: "bottom-center"
    });
    getAll();
  }).catch((error) => {
    toast.error(error?.response?.data?.detail || 'Failed to load plan', { autoClose: 60000 });
  });
}

const handleCreateLoad = () => {
  proxy.$refs["CreateLoadRef"].handleShow(undefined);
};

const handleEdit = (item, saw_route) => {
  proxy.$refs["CreateLoadRef"].handleShow(item, saw_route, weights.total.toFixed(3));
}

const handleDelete = (item) => {
  proxy.$refs["deleteDialogRef"].handleShow(item);
}

const handleAutoPlan = () => {
  console.log("rollling code===", rolling_code.value)
  API.autoplan({ rolling_id: rolling_id.value, order_group_id: order_group_id.value }).then((res) => {
    toast.success('Created successfully', {
      position: "bottom-center"
    });
    getAll();
  }).catch((error) => {
    toast.error(error?.response?.data?.detail || 'Failed to create', { autoClose: 60000 });
  });
};

const handlePickRolling = (rolling) => {
  rolling_id.value = rolling?.id || null;
  rolling_code.value = rolling?.rolling_code || null;
};

const handlePickOrder = (order) => {
  order_id.value = order?.id || null;
  order_code.value = order?.order_code || null;
};

const formatSawSeq = (saw, seq) => {
  return saw + seq.toString().padStart(3, '0');
};

const formatTon = (value, dig) => {
  return value ? value.toFixed(dig) : '0';
}

onMounted(async () => {
  if (route.query?.rolling_code) {
    rolling_code.value = route.query.rolling_code;
  }
  if (route.query?.rolling_id){
    rolling_id.value = route.query.rolling_id;
  }
  if (route.query?.order_group_id){
    order_group_id.value = route.query.order_group_id;
  }
  if (route.query?.kgm) {
    kgm.value = route.query.kgm;
  }
  await commonStore.initDictData();
  initSawRoute();
  if (route.query?.saw_route){
    const idx = sawRouter.value.findIndex(sR => sR.value === route.query.saw_route);
    tabs.value = [ idx];
  }

  getAll();
});

watch(() => rolling_code.value, (val) => {
  console.log('=========',rolling_code)
  handleSearch()
});

watch(() => tableSelections, (val) => {
  itemsSel.value = [];
  for (const key in val) {
    itemsSel.value = itemsSel.value.concat(val[key]);
  }
}, {deep: true})

</script>

<style scoped>
.text-grey-darken-3 {
  color: #616161;
}
</style>
