
import { defineStore } from 'pinia';
import { useAppStore } from '../../app/storePinia'
import SemiApi from "@/semi_admin/semi/api";
import { getI18nText } from '@/util/i18nHelper';
import { toast } from "vue3-toastify";
import router from "../../router";
import { th } from 'date-fns/locale';
import { getI18nTextNew } from '../../util/i18nHelper';
import { log } from '@openid/appauth';
import { reactive, toRaw, computed } from 'vue';
import { forEach } from 'lodash';
import {formatDate} from "@/util/util";
import printJS from "print-js";
import defect_reason from '@/locals/zh/defect_reason';
import store from '@/store';

const millCode = computed(() => store.state.auth.defaultMillCode);

// import {convertDateTimeFormat} from '@/util/dateFormat'
const getDefaultSelectedState = () => {
  return {
    rolling: null,
    order_group: null,
    site: null,
    site_id: null,
    area_id: null,
    semi_load_code: null,
    semi_charge_seq: null,
    cast_code: null,
    semi_code: null,
    location: null,
    stock_in_date: null,
    skelp_code: null,
    semi_cut_seq: null,
    semi_code_1: null,
    product_type: null,
    quantity: null,
    quality_code: null,
    length_mm: null,
    width_mm: null,
    thickness_mm: null,
    estimated_weight_kg: null,
    scarfed_status: null,
    curren_allocated_rolling: null,
    curren_allocated_block: null,
    area_code: null,
    updated_at: null,
    updated_by: null,
    created_at: null,
    created_by: null,
    is_deleted: null,
    flex_form_data: null,
    semi_type: null,
    hold_reason: null,
    comment: null,
    cast_id: null,
    defect_reason: null,
    quality_id: null,
    quality:null,
    long_semi_code: null,
    generate_code: null,
    semi_status: null
  };
};

const selectDefaultSemiType = (state) => {
  let defaultMillCode = millCode.value;
  
  let menuTree = localStorage.getItem("menuButtonPermission");
  menuTree = JSON.parse(menuTree);
  let filteredArrayCode = Object.values(menuTree).reduce(function (
    pre,
    cur,
    index
  ) {
    if (cur.name === "semiSemiList") {
      
      return [...pre, cur.permission];
    } else {
      return pre;
    }
  },
  []);

  if (filteredArrayCode.indexOf("bloom_only") >= 0) {
    state.table.semi_type_disabled=true
    return ["Bloom"];
  } else if (filteredArrayCode.indexOf("slab_only") >= 0){
    state.table.semi_type_disabled=true

    return ["Slab"]
  }else{

    state.table.semi_type_disabled=false
    
    if (defaultMillCode === 'TBM') {
      return ["Slab", "Bloom"];
    } else if (defaultMillCode === 'SRSM') {
      return ["BLM"];
    }
    
  }
};

const state = {
  // t: useI18n(),
  isEditFlag: false,
  selected: {
    ...getDefaultSelectedState(),
  },
  hideColumns: ["flex_form_data", "is_deleted", "created_by", "updated_by", "created_at", "updated_at"],
  dialogs: {
    showCreateEdit: false,
    showRemove: false,
    MoveToShow: false,
    MoveToShowBloom: false,
    selectedCode: "",
    selectedQuantity: "",
    showMergeBloom: false,
    selectedEstimatedWeight: "",
    unitWeight: "",
  },
  table: {
    rows: {
      items: [],
      total: null,
      selectedItems: [],
    },
    options: {
      q: "",
      fields: [],
      ops: [],
      values: [],
      filter_type: undefined,
      page: 1,
      itemsPerPage: 10,
      sortBy: ["created_at"],
      descending: [true],
      site_code: null,
    },
    filterOptions: {
      rework_status: null,
      scrap: "Not Scrapped",
      filter_semi_type: [],
      quality_id: null,
      width_thick:null,             //width_thick存组件传回的id;
      width:null,                   //width和thick分别存组件item返回的width，thick值用于后面push
      thick:null,
      cast_id:null,
      status: null,
      semi_status: null,
    },
    request_first: true,
    semiCodes: [],
    loading: false,
    semi_type_disabled: false,
  },
  shouldExecuteGetAll:true,
};


const mutations = {
  // updateField,
  SET_SELECTED(value) {
    this.selected = Object.assign(this.selected, value);
  },
  SET_IS_EDIT_FLAG(value) {
    this.isEditFlag = value;
  },
  SET_TABLE_LOADING(value) {
    this.table.loading = value;
  },
  SET_TABLE_ROWS(value) {
    this.table.rows = value;
  },
  SET_DIALOG_CREATE_EDIT(value) {
    this.dialogs.showCreateEdit = value;
  },
  SET_DIALOG_DELETE(value) {
    this.dialogs.showRemove = value;
  },
  SET_SEMI_TYPE() {
    this.table.filterOptions.filter_semi_type = selectDefaultSemiType(this);
  },
  RESET_SELECTED() {
    this.selected = Object.assign(this.selected, getDefaultSelectedState());
    this.isEditFlag = false;
    // 重置 table.options
    this.table.options = {
      q: "",
      fields: [],
      ops: [],
      values: [],
      filter_type: undefined,
      page: 1,
      itemsPerPage: 10,
      sortBy: ["created_at"],
      descending: [true],
      site_code: null,
    };
    // 重置 filterOptions
    this.table.filterOptions = {
      rework_status: null,
      scrap: "Not Scrapped",
      site_code: null, // 明确重置 site_code
      area_code: null,
    };
  },
};
const actions = {

  initializeFilterSemiType() {
    this.table.filterOptions.filter_semi_type = selectDefaultSemiType(this);
  },
  colseDialogByButton(alter){
    alert = false
    this.dialogs.showMergeBloom = false
    this.dialogs.MoveToShow = !this.dialogs.MoveToShow;
  },

  colseDialogBloomByButton(alter){
    alert = false
    this.dialogs.showMergeBloom = false
    this.dialogs.MoveToShowBloom = !this.dialogs.MoveToShowBloom
  },

  getSemiColCodeById(id) {
    const foundRow = this.table.rows.items.find(item => item.id === id);
    if (foundRow) {
      return foundRow.semi_code; // 返回找到的 semi_code
    } else {
      // this.messageAlert("Row not found", "red");
      return null; // 如果未找到，返回 null
    }
  },

  takeDialogByButton() {
    const firstItem = this.table.rows.selectedItems[0];
    if (this.table.rows.selectedItems.length >= 2 && firstItem.semi_type === 'BLM') {
    
      const allSame = this.table.rows.selectedItems.every(obj => 
        obj.semi_type === firstItem.semi_type &&
        obj.cast_id === firstItem.cast_id &&
        obj.dim2 === firstItem.dim2 &&
        obj.width_mm === firstItem.width_mm
      );
      if (allSame) {
        this.dialogs.showMergeBloom = true;
      }
    }
    
    if (this.table.rows.selectedItems.length < 2 && this.table.rows.selectedItems[0].semi_type === "BLM"){
      this.dialogs.MoveToShowBloom = !this.dialogs.MoveToShowBloom
    }else{
      this.dialogs.MoveToShow = !this.dialogs.MoveToShow
    }
    
    let reqBody = this.getSemiCodeById()
    let code_list = []
    reqBody.forEach(element => {
      let code = this.getSemiColCodeById(element)
      if (code != null)
        code_list.push(code)
    });

    this.dialogs.selectedCode = code_list.join(",  ")
    console.log(this.dialogs.selectedCode)    
  },

  getSemiCodeById() {
    let requestIds = []
    // console.log("------------------------------");
    // console.log(this.table.rows.selectedItems[0].estimated_weight_kg);
    // console.log("------------------------------");
    if (this.table.rows.selectedItems[0].quantity){
      this.dialogs.selectedQuantity = this.table.rows.selectedItems[0].quantity;
    }

    if (this.table.rows.selectedItems[0].estimated_weight_kg) {
      this.dialogs.selectedEstimatedWeight = this.table.rows.selectedItems[0].estimated_weight_kg;
      this.dialogs.unitWeight = this.table.rows.selectedItems[0].estimated_weight_kg / this.table.rows.selectedItems[0].quantity
    }
    
    if (this.table.rows.selectedItems != undefined) {
      this.table.rows.selectedItems.forEach(element => {
        requestIds.push(element.id)
      });
    }
    // Api.getSemiData('/semi/', )

    return requestIds
  },

  searchData() {
    const that = this;
    that.SET_TABLE_LOADING(true);
    that.SET_IS_EDIT_FLAG(true);
    return SemiApi.getAll(this.table.options)
      .then((response) => {
        that.SET_TABLE_LOADING(false);
        if (response.data?.items?.length > 0) {
          const item = response.data.items[0]
          if (!item.cast_code){
            item.cast_code = item?.cast?.cast_code
          }
          that.SET_SELECTED(item);
        } else {
          that.messageAlert("not find any semi", "red");
        }
      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      });
  },

  getAllNew() {
    // const testList = toRaw(this.table.filterOptions.filter_area_code)
    let elementList = []
    const that = this;
    that.SET_TABLE_LOADING(true);
    this.table.options.fields = [];
    this.table.options.ops = [];
    this.table.options.values = [];
    this.table.options.filter_type = undefined;
    if (this.table.filterOptions.scrap === 'Not Scrapped') {
      this.table.options.fields.push("semi_status");
      this.table.options.ops.push("!=");
      this.table.options.values.push('Scrapped');

      this.table.options.fields.push("semi_status");
      this.table.options.ops.push("is_null");
      this.table.options.values.push(true);

      this.table.options.filter_type = "custom";

    }else if (this.table.filterOptions.scrap === 'Scrapped') {
      this.table.options.fields.push("semi_status");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.scrap);
    }
    
    if (this.table.filterOptions.rework_status) {
      this.table.options.fields.push("rework_type");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.rework_status);
    }
    if (this.table.filterOptions.cast_id) {
      this.table.options.fields.push("cast_id");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.cast_id);
    }
    if (this.table.filterOptions.site_code){
      this.table.options.site = this.table.filterOptions.site_code
    }else{
      this.table.options.site = null
    }
    if (this.table.filterOptions.area_code){
      this.table.options.area_code = this.table.filterOptions.area_code
    }else{
      this.table.options.area_code = null
    }
    if (
      this.table.filterOptions.filter_semi_type && this.table.filterOptions.filter_semi_type.length > 0) {
      this.table.options.fields.push("semi_type");
      this.table.options.ops.push("in");
      this.table.options.values.push(this.table.filterOptions.filter_semi_type);
    }

    if (this.table.filterOptions.quality_id) {
      this.table.options.fields.push("quality_id");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.quality_id);
    }
    if (this.table.filterOptions.width_thick) {
      this.table.options.fields.push("width_mm");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.width);
      this.table.options.fields.push("thickness_mm");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.thick);
    }
    if (this.table.filterOptions.status) {
      this.table.options.fields.push("semi_status");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.status);
    }



    return SemiApi.getAllNew(`/semi/get_all/${this.table.request_first}` ,this.table.options)
      .then((response) => {
        if (this.table.request_first)
          this.table.request_first = false
        that.SET_TABLE_LOADING(false);
        console.log(response.data);
        
        if (response.data?.items?.length > 0) {
          const itemsWithCodes = response.data.items.map(item => ({
            ...item,
            area_code: item.area?.code, 
            site_code: item.site?.code,
            curren_allocated_block: item.order_group?.group_code,
            curren_allocated_rolling: item.rolling?.rolling_code,
            cast_code: item.cast?.cast_code
            
          }));
          that.SET_TABLE_ROWS({ ...response.data, items: itemsWithCodes });
        }
        else {
          that.SET_TABLE_ROWS({ ...response.data });
        }

      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      }).finally(()=>{
        // this.table.q = ""
      });
  },
  Print() {
    this.table.options.fields = [];
    this.table.options.ops = [];
    this.table.options.values = [];
    this.table.options.filter_type = undefined;
    if (this.table.filterOptions.scrap === 'Not Scrapped') {
      this.table.options.fields.push("semi_status");
      this.table.options.ops.push("!=");
      this.table.options.values.push('Scrapped');

      this.table.options.fields.push("semi_status");
      this.table.options.ops.push("is_null");
      this.table.options.values.push(true);

      this.table.options.filter_type = "custom";

    }else if (this.table.filterOptions.scrap === 'Scrapped') {
      this.table.options.fields.push("semi_status");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.scrap);
    }

    if (this.table.filterOptions.rework_status) {
      this.table.options.fields.push("rework_type");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.rework_status);
    }
    if (this.table.filterOptions.site_code){
      this.table.options.site = this.table.filterOptions.site_code
    }else{
      this.table.options.site = null
    }
    if (this.table.filterOptions.area_code){
      this.table.options.area_code = this.table.filterOptions.area_code
    }else{
      this.table.options.area_code = null
    }
    if (this.table.filterOptions.filter_semi_type) {
      this.table.options.fields.push("semi_type");
      this.table.options.ops.push("in");
      this.table.options.values.push(this.table.filterOptions.filter_semi_type);
    }
    const params = toRaw(this.table.options)
    params.itemsPerPage = -1

    const printFields = [
      { displayName: "Cast Code", field: "cast_code" },
      { displayName: "Skelp Code", field: "skelp_code" },
      { displayName: "Type", field: "semi_type" },
      { displayName: "Quality", field: "quality_code" },
      { displayName: "Quantity", field: "quantity" },
      { displayName: "Length(mm)", field: "length_mm" },
      { displayName: "Width(mm)", field: "width_mm" },
      { displayName: "Weight(kg)", field: "estimated_weight_kg" },
      { displayName: "Current Allocated Rolling", field: "curren_allocated_rolling" },
      { displayName: "Current Allocated Block", field: "curren_allocated_block" },
      { displayName: "Semi Load", field: "semi_load_code" },
      { displayName: "Area", field: "area_code" },
      { displayName: "Status", field: "semi_status" },
      { displayName: "Position", field: "location" },
      { displayName: "Rework", field: "rework_type" },
      { displayName: "Defect", field: "defect_code" },
      { displayName: "Comment", field: "comment" },
      { displayName: "Create At", field: "created_at" },
    ]

    return SemiApi.getAllNew(`/semi/get_all/${this.table.request_first}` ,params)
      .then((response) => {
        if (this.table.request_first)
          this.table.request_first = false
        const itemsWithCodes = response.data.items.map(item => ({
          ...item,
          area_code: item.area?.code || '',
          curren_allocated_block: item.order_group?.group_code ||'',
          curren_allocated_rolling: item.rolling?.rolling_code || '',
          cast_code: item.cast?.cast_code || '',
          semi_load_code: item.semi_load?.semi_load_code || '',
          defect_code: item.defect_reason?.name || '',
          rework_type: item.rework_type || '',
          comment: item.comment || '',
          created_at: formatDate(item.created_at, 'YYYY-MM-DD') ,
        }));

        printJS({
          printable:  itemsWithCodes,
          properties: printFields,
          type: "json",
          header: "Semi List",
          repeatTableHeader: false, // 打印json表头只显示在第一页
          gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px', // 表格头样式
          gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px', // 表哥体样式
          headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
          scanStyles: false,
          style: '@page{size:landscape;margin: 0cm;}' // 表格样式
        });
        console.log('printJS')

      })
      .catch(() => {

      }).finally(()=>{

      });
  },

  resetQuery() {
    this.table.options = {
      q: "",
      fields: [],
      ops: [],
      values: [],
      filter_type: undefined,
      page: 1,
      itemsPerPage: 10,
      sortBy: ["created_at"],
      descending: [true],
      site_code: null,
    };
    // 重置 filterOptions
    this.table.filterOptions = {
      rework_status: null,
      scrap: "Not Scrapped",
      site_code: null, // 明确重置 site_code
      area_code: null,
    };
  },
  getAll() {
    // const testList = toRaw(this.table.filterOptions.filter_area_code)
    let elementList = []
    const that = this;
    that.SET_TABLE_LOADING(true);
    this.table.options.fields = [];
    this.table.options.ops = [];
    this.table.options.values = [];
    if (this.table.filterOptions.rework_status) {
      this.table.options.fields.push("rework_type");
      this.table.options.ops.push("eq");
      this.table.options.values.push(this.table.filterOptions.rework_status);
    }

    if (this.table.filterOptions.filter_semi_type) {
      this.table.options.fields.push("semi_type");
      this.table.options.ops.push("in");
      this.table.options.values.push(this.table.filterOptions.filter_semi_type);
    }

    return SemiApi.getAll(this.table.options)
      .then((response) => {
        that.SET_TABLE_LOADING(false);
        console.log(response.data);
        
        if (response.data?.items?.length > 0) {
          const itemsWithCodes = response.data.items.map(item => ({
            ...item,
            area_code: item.area?.code, 
            site_code: item.site?.code,
            curren_allocated_block: item.order_group?.group_code,
            curren_allocated_rolling: item.rolling?.rolling_code,
            cast_code: item.cast?.cast_code,
            semi_load_code: item.semi_load?.semi_load_code
            
          }));
          that.SET_TABLE_ROWS({ ...response.data, items: itemsWithCodes });
        }
        else {
          that.SET_TABLE_ROWS({ ...response.data });
        }

      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      }).finally(()=>{
        // this.table.q = ""
      });
  },
  editShow(Semi) {
    const that = this;
    that.SET_DIALOG_CREATE_EDIT(true);
    if (Semi) {
      that.SET_SELECTED(Semi);
      that.SET_IS_EDIT_FLAG(true);
    } else {
      that.RESET_SELECTED();
      that.SET_IS_EDIT_FLAG(false);
    }
  },



  goDetail(item) {
    const that = this;
    if (item == null){
      that.RESET_SELECTED();
      that.SET_IS_EDIT_FLAG(false);
      router.push({ path: "/semi_detail"});
    }
    else{
      that.SET_SELECTED(item);
      that.SET_IS_EDIT_FLAG(true);
      router.push({ path: "/semi_detail", params: { id: item.id } });
    }
    
  },
  removeShow(Semi) {
    this.SET_DIALOG_DELETE(true);

    this.SET_SELECTED(Semi);
  },
  closeCreateEdit() {
    this.SET_DIALOG_CREATE_EDIT(false);
    this.RESET_SELECTED();
  },
  closeRemove() {
    this.SET_DIALOG_DELETE(false);
    this.RESET_SELECTED();
  },
  save() {

    const that = this;
    if (!that.selected?.id) {
      that.selected.flex_form_data = {}
      return SemiApi.create(that.selected)
        .then(() => {
          toast.success("Semi created successfully.", { position: "bottom-center" })
          that.closeCreateEdit();
          router.push({ path: "/semi_list", params: {} });
          that.getAll();
        })
        .catch((err) => {
          toast.error("Semi not created. Reason: " + err.response.data.detail, { autoClose: 60000 })
        });
    } else {
      return SemiApi.update(that.selected)
        .then(() => {
          toast.success("Semi updated successfully.", { position: "bottom-center" })
          that.closeCreateEdit();
          router.push({ path: "/semi_list", params: {} });
          that.getAll();
        })
        .catch((err) => {
          toast.error("Semi not updated. Reason: " + err.response.data.detail, { autoClose: 60000 })

        });
    }
  },
  remove() {
    const that = this;
    return SemiApi.delete(that.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        toast.success("Semi deleted successfully.", { position: "bottom-center" })
      })
      .catch((err) => {
        toast.error("Semi not deleted. Reason: " + err.response.data.detail, { autoClose: 60000 })

      });
  },
  ...mutations,
  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
};



const namespace = 'semi';
const headername = 'table';

const getters = {
  headers(state) {
    const that = this;
    const action = { title: '', value: 'action', sortable: false, align: 'end' }
    let column = Object.keys(getDefaultSelectedState()).reduce((pre, cur, index) => {
      if (that.hideColumns.indexOf(cur) >= 0) {
        return pre
      }
      return [...pre, { title: getI18nTextNew(`${cur}`), value: cur, sortable: true }]
    }, [])
    column.push(action)
    return column
  },
};

export const useSemiStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  getters,
  actions,
});
