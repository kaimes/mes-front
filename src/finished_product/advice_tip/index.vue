<template>
    <v-container class="detail-content" fluid>

        <v-row class="mb-2" align="center">
        </v-row>


        <v-form ref="adviceTipForm" @submit.prevent="handleSave">
            <div class="panel border">
                <div class="panel-action">
                    <!-- <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
                    <v-switch v-model="save" density="default" hide-details inset></v-switch> -->
                    <div class="ml-14">
                        <v-btn type="submit"  :loading="loading" variant="flat" color="primary" rounded @click="handleTip(route.query.id)" :disabled="isAdviceTipDisabled">
                            <!-- {{ form.id ? "Update" : "Save" }} -->
                            {{"Tip"}}
                        </v-btn>
                    </div>
                </div>
                <v-row align="center" class="pt-4">
                    <!-- <v-col cols="5" class="d-flex align-center">
                        <div class="text-subtitle-2 font-weight-regular mb-2">Tipped Date</div>
                        <v-text-field v-model="form.tipped_date" type="date" density="default" variant="outlined"
                            placeholder="Tipped Date" bg-color="white" clearable></v-text-field>
                    </v-col> -->
                     

                    <v-col cols="4">
                        <SiteType v-model="form.site_type_code"  variant="underlined" label="Location 1" :rules="rules.site_type_code"  />
                    </v-col>
                    
                    <v-col cols="4">
                        <Site v-model="form.site_code" variant="underlined"  label="Location 2" :code="form.site_type_code" :rules="rules.site_code"  />
                    </v-col>
                    
                    <v-col cols="4">
                        <Area v-model="form.area_code" variant="underlined"  label="Location 3" :code="form.site_code" :rules="rules.area_code"  />
                    </v-col>

                    

                    <v-col cols="4">
                        <v-text-field v-model="form.reason" density="default" variant="underlined"
                            placeholder="Reason" bg-color="white" clearable  label="Reason"></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <!-- <div class="text-subtitle-2 font-weight-regular mb-2">Tipped Date</div> -->
                        <VueDatePicker position="left"  disabled>
                            <template #trigger>
                                <v-text-field
                                    v-model="form.tipped_date"
                                    :rules="rules.tipped_date"
                                    label="Tipped date"
                                    density="default"
                                    variant="underlined"
                                    placeholder="Please enter the date"
                                    clearable
                                    readonly
                                    disabled
                                ></v-text-field>
                            </template>
                        </VueDatePicker>
                    </v-col>

                    <v-col cols="4">
                        <v-text-field v-model="form.status" density="default" variant="underlined"
                            placeholder="Status" bg-color="white" clearable  label="Status" disabled></v-text-field>
                    </v-col>

                    <v-col cols="5">
                        <v-text-field v-model="form.total_no_bars" density="default" variant="underlined" placeholder="Total No Bars"
                            bg-color="white" clearable disabled label="Total No Bars"></v-text-field>
                    </v-col>
                    
                    <v-col cols="5">
                        <v-text-field v-model="form.total_weight" density="default" variant="underlined" placeholder="Total Weight"
                            bg-color="white" clearable disabled label="Total Weight"></v-text-field>
                    </v-col> 
                </v-row>

                <v-row class="mb-2" align="center">
                    <v-col cols="8">
                        <div class="text-subtitle-2 font-weight-regular	mb-2">comments</div>
                        <v-textarea v-model="form.comment" color="#333" 
                            density="default" variant="outlined" placeholder="comments"
                            bg-color="white" clearable ></v-textarea>
                    </v-col>
                 </v-row>

            </div>

            <div class="panel border">
                <v-data-table-server 
                    v-model="selected" 
                    min-height="300" 
                    items-per-page="10" 
                    :page="queryParams.page"
                    :headers="tableHeaders" 
                    :items="tableList" 
                    :items-length="total" 
                    :loading="loading" 
                    fixed-header
                    show-current-page 
                    return-object 
                    @update:options="handleTableChange"
                >
                    <template v-slot:item.status="{ item }">
                        <div class="d-flex justify-center ga-2">
                            <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                                {{ tag.code }}
                            </v-chip>
                        </div>
                    </template>
     
                </v-data-table-server>
            </div>






        </v-form>
    </v-container>
</template>
<script setup>

import SiteType from "./picker/SiteType.vue";
import Site from "./picker/Site.vue";
import Area from "./picker/Area.vue";
import { getCurrentInstance, reactive, ref, toRaw, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import OrderCode from "@/components/picker/OrderCode.vue";
import OrderItemCode from "@/components/picker/OrderItemCode.vue";
import { toast } from "vue3-toastify";
import API from "./api";
import XEUtils from "xe-utils";
import moment from "moment/moment";

const { proxy } = getCurrentInstance();

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);
const isAdviceTipDisabled = ref(true)

const tableHeaders = ref([
//   {title: "Action", key: "action", sortable: false, fixed: true},
//   {title: "Bar No", key: "code", sortable: false},
//   {title: "Cut Code", key: "cut_code", sortable: false},
//   {title: "Sales", key: "sales", sortable: false},
// //   {title: "Line Item Number", key: "order_itme.line_item_code", sortable: false},
//   {title: "Item", key: "item", sortable: false},
//   {title: "C", key: "c", sortable: false},
//   {title: "M", key: "m", sortable: false},
//   {title: "I", key: "i", sortable: false},
//   {title: "Length(mm)", key: "length", sortable: false},
//   {title: "16", key: "16", sortable: false},
//   {title: "PC", key: "pc", sortable: false},
//   {title: "Section", key: "section", sortable: false},
//   {title: "GGE", key: "gge", sortable: false},
//   {title: "Quality", key: "quality", sortable: false},

  {title: "Code", key: "code", sortable: true},
  {title: "Cut Code", key: "cut_code", sortable: true},
  {title: "Length(mm)", key: "length_mm", sortable: true},
  {title: "Mults", key: "mult_code", sortable: true},
  {title: "Runout Code", key: "runout.runout_code", sortable: true},
  {title: "Area Code", key: "area.code", sortable: true},
  {title: "Order Number", key: "order_item.order.order_code", value: (item) => item.order_item?.order?.order_code, sortable: true},
  {title: "Line Item Number", key: "order_item.line_item_code", value: (item) => item.order_item?.line_item_code, minWidth: 100, sortable: true},
  {title: "ProductType Code", key: "product_type.code", value: (item) => item.product_type?.code, sortable: true, minWidth: 160},
  {title: "Dim1", key: "product_type.dim1", value: (item) => item.product_type?.dim1, sortable: true},
  {title: "Dim2", key: "product_type.dim2", value: (item) => item.product_type?.dim2, sortable: true},
  {title: "Spec Code", key: "spec.spec_code", value: (item) => item.spec?.spec_code, sortable: true},
  {title: "Cast Code", key: "cast.cast_code", value: (item) => item.cast?.cast_code, sortable: true},
  {title: "Compliance", key: "test_result", sortable: false},
  {title: "Location", key: "location", sortable: true},
  {title: "Is real", key: "exist_flag", sortable: true},
  {title: "Defect", key: "defect_reason.name", value: (item) => item.defect_reason?.name, sortable: true},
  {title: "Allocation Status", key: "allocation_status", sortable: true},
  {title: "Load No.", key: "load.code", value: (item) => item.load?.code, sortable: true},
  // {title: "Scarfed Status", key: "scarfed_status", sortable: true},
  // {title: "Rework Type", key: "rework_type", sortable: false},
  {title: "Rework Status", key: "rework_type", sortable: true},
  {title: "Reserve Status", key: "reserve_status", sortable: true},
  {title: "Status", key: "status", sortable: false},
  {title: "Created At", key: "created_at", sortable: false, value: (item) => formatDate(item['created_at']), minWidth: 180},
  {title: "Comment", key: "comment", value: (item) => item.comment, sortable: true},    
]);
const tableList = ref([]);
const total = ref(0);

const data = reactive({
    queryParams: {
        page: 1,
        itemsPerPage: 10,
        advice_code: undefined
        // sortBy: ["updated_at"],
        // descending: [true],
    },
    form: {
        id: undefined,
        tipped_date: undefined,
        site_type_code: undefined,
        site_code: undefined,
        area_code: undefined,
        reason: undefined,
        comment: undefined,
        status: undefined,
        total_no_bars: undefined,
        total_weight: undefined


    },
    rules: {
        // tipped_date: [
        //     value => {
        //         if (value) return true
        //         return 'Tipped Date is required.'
        //     }
        // ],
        site_type_code: [
            value => {
                if (value) return true
                return 'Location 1 is required.'
            }
        ],
        site_code: [
            value => {
                if (value) return true
                return 'Location 2 is required.'
            }
        ],
        area_code: [
            value => {
                if (value) return true
                return 'Location 3 is required.'
            }
        ],
    }
});

const { form, rules , queryParams} = toRefs(data);

// const formatDate = (res, key) => {
//   if (res) {
//     form.value[key] = moment(res).format("YYYY-MM-DD");
//   }
// }
const formatDate = (date, field) => {
    form[field] = date;
}

const setCurrentDate = () => {
    const currentDate = new Date();
    form.value.tipped_date = currentDate.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
}

const handleSave = async () => {
    
    const { valid } = await proxy.$refs["adviceTipForm"].validate();
    if (!valid) {
        return;
    }
    const params = toRaw(form.value);
    loading.value = true;
    API.save(params).then(res => {
        toast.success(params.id ? "Tip Success" : "Create Success", {
            position: "bottom-center",
            delay: 2000,
            onClose: () => router.back()
        });
    }).catch(() => {
        toast.error(params.id ? "Tip Fail" : "Create Fail", { autoClose: 60000 });
    }).finally(() => {
        loading.value = false;
    });
}

const handleTip= async (id) => {
    try {
        const res = await API.sendtip(id);
        toast.success("Send Success", {
            position: "bottom-center",
            delay: 2000,
        });
    } catch (error) {
        toast.error("Send Fail", { autoClose: 60000 });
    } finally {
        loading.value = false; // 如果你需要在操作完成后关闭加载状态
    }
}


const handleReset = () => {
    proxy.$refs["searchForm"].reset();
}

const getDetailById = () => {
    API.getDetailById(route.query.id).then(res => {
        
        const { status, data } = res
        
        if (status === 200) {
            save.value = false;

            queryParams.value.advice_code = data.advice_code
            // form.value.id = data.id
            form.value = data;

            setCurrentDate()

            getfinished()


        } else {
            // TODO: 添加错误异常提示
        }
    });
}

const getfinished = () => {
    API.getFinishedProduct(queryParams.value).then(res => {
        if (res.status === 200) {
            total.value = res.data.total || 0;
            tableList.value = res.data.items || [];
            // 判断是否禁用新增advice复选框
            isAdviceTipDisabled.value = res.data.items.some(item => 
                !(item.exist_flag === null || item.exist_flag === 'N') || 
                !(item.rework_status === null || item.rework_status === 'Complete')
            );
            form.value.total_no_bars = res.data.total_no_bars || 0;
            // form.value.total_weight = res.data.totalWeight || 0;
            tableList.value = res.data.items.map((item, index) => ({
                ...item,

                calulated_weight: Number(item.length_mm || 0) * Number(item.quantity || 0) * Number(item.product_type?.dim3 || 0)
            }));
            form.value.total_weight = tableList.value.reduce((accumulator, item) => {
            const CalulatedWeight = item.calulated_weight;
            return typeof CalulatedWeight === 'number' && !isNaN(CalulatedWeight) ? accumulator + CalulatedWeight : accumulator;
            
    }, 0);
        } else {
            total.value = 0;
            tableList.value = []
        }
        
    }).finally(() => {
        loading.value = false;
    });
}


const handleTableChange = ({page, itemsPerPage}) => {
  queryParams.value.page = page;
  queryParams.value.itemsPerPage = itemsPerPage;
  if(queryParams.value.advice_code){
    getfinished()
  }
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
    getDetailById()
}

watch(
    () => form,
    (value) => { },
    {
        deep: true
    }
)


</script>
<style lang="scss" scoped>
.detail-content {
    .panel {
        position: relative;
        background-color: #ffffff;
        padding: 42px 16px 16px 16px;
        min-height: 400px;
        border-radius: 12px;

        &-action {
            position: absolute;
            top: 10px;
            right: 12px;
            display: flex;
            flex-direction: row;
            align-items: center;
            z-index: 1;
        }
    }
}
</style>
