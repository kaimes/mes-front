import moment from "moment";
import { defineStore } from 'pinia';
import OrderApi from "@/order_admin/order/api";
import { formatDivision, formatOrderType } from "@/util/util";
import { getI18nText } from '@/util/i18nHelper';

import { useAppStore } from '../../app/storePinia'
import router from "../../router";
import { iteratee } from "lodash";
import { value } from "jsonpath";

const namespace = 'order';
const getDefaultSelectedState = () => {
  return {
    // rolling: {},
    id: null,
    plant_id: null,
    // rolling_id: null,
    order_code: null,
    type_of_order: null,
    customer_short_name: null,
    customer_po_number: null,
    address_line_1: null,
    address_line_2: null,
    address_line_3: null,
    address_line_4: null,
    address_line_5: null,
    order_export_type: null,
    contract: null,
    carriage_terms: null,
    payment_terms: null,
    mode_of_delivery: null,
    delivery_address_id: null,
    order_category: null,
    business_order_code: null,
    customer_code: null,
    customer_full_name: null,
    customer_group: null,
    section_order_category: null,
    customer_credit_worthiness: null,
    label_data: null,
    delivery_note: null,
    destination_country: null,
    job_scheme_name: null,
    transport_mode: null,
    ship_to_customer_number: null,
    test_certificate_customer_number: null,
    sales_division: null,
    distribution_channel: null,
    sales_organization: null,
    order_reason: null,
    order_note: null,
    incoterms_location: null,
    general_remark_1: null,
    general_remark_2: null,
    general_remark_3: null,
    general_remark_4: null,
    copies_of_test_certificate: null,
    outside_inspection_required_flag: null,
    customer_code_zt: null,
    customer_short_name_zt: null,
    customer_full_name_zt: null,
    address_line_1_zt: null,
    address_line_2_zt: null,
    address_line_3_zt: null,
    address_line_4_zt: null,
    address_line_5_zt: null,
  };
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
  },

  order_page_model: getDefaultSelectedState(),
  table: {
    rows: {
      // items: [],
      // total: null,
      items: [],
      total: null,
      itemsPerPage: 10,
      page: 1,
    },
    options: {
      q: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: ["created_at"],
      descending: [true],
      fields:[],
      ops:[],
      values:[],

    },
    plant_id:null,
    type_of_order:[],
    loading: false,
  },
  table_titles: {
    order_code: "Order Number",
    type_of_order: "Order Type",
    customer_short_name: "Customer Short Name",
    customer_po_number: "Customer Po Number",
    address_line_1: "Address Line 1",
    address_line_2: "Address Line 2",
    address_line_3: "Address Line 3",
    address_line_4: "Address Line 4",
    address_line_5: "Address Line 5",
    created_at: "Created At",
    order_export_type: "Order Export Type",
    contract: "Contract",
    carriage_terms: "Carriage Terms",
    payment_terms: "Payment Terms",
    mode_of_delivery: "Mode Of Delivery",
    delivery_address_id: "Delivery Address ID",
    order_category: "Order Category",
    business_order_code: "Business Order Number",
    customer_code: "Customer Code",
    customer_full_name: "Customer Full Name",
    customer_group: "Customer Group",
    section_order_category: "Section Order Category",
    customer_credit_worthiness: "Customer Credit Worthiness",
    label_data: "Label Data",
    delivery_note: "Delivery Note",
    destination_country: "Destination Country",
    job_scheme_name: "Job Scheme Name",
    transport_mode: "Transport Mode",
    ship_to_customer_number: "Ship To Customer Number",
    test_certificate_customer_number: "Test Certificate Customer Number",
    sales_division: "Sales Division",
    distribution_channel: "Distribution Channel",
    sales_organization: "Sales Organization",
    order_reason: "Order Reason",
    order_note: "Order Numberte",
    incoterms_location: "Incoterms Location",
    general_remark_1: "General Remark 1",
    general_remark_2: "General Remark 2",
    general_remark_3: "General Remark 3",
    general_remark_4: "General Remark 4",
    copies_of_test_certificate: "Copies Of Test Certificate",
    outside_inspection_required_flag: "Outside Inspection Required Flag",
    customer_code_zt: "Customer Code ZT",
    customer_short_name_zt: "Customer Short Name ZT",
    customer_full_name_zt: "Customer Full Name ZT",
    address_line_1_zt: "Address Line 1 ZT",
    address_line_2_zt: "Address Line 2 ZT",
    address_line_3_zt: "Address Line 3 ZT",
    address_line_4_zt: "Address Line 4 ZT",
    address_line_5_zt: "Address Line 5 ZT",
  }
};



const mutations = {

  SET_order_page_model(value) {

    this.order_page_model = Object.assign(this.order_page_model, value);


  },
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
  RESET_SELECTED() {
    this.selected = Object.assign(this.selected, getDefaultSelectedState());
    this.isEditFlag = false;
  },
};
const actions = {
  getAll() {
    const that = this;
    that.table.loading = true;

    // if (that.table.type_of_order.length > 0) {
    // //   that.table.options['fields'] = ['type_of_order']
    // //   that.table.options['ops'] = ['in']
    // //   that.table.options['values'] = [JSON.stringify(that.table.type_of_order)]
    // //   console.log('>>>>>>>>>>',that.table.plant_id)
    // //   console.log('>>>>>>>>>>',that.table.type_of_order)

    // // }else{
    // //   delete that.table.options['fields']
    // //   delete that.table.options['ops']
    // //   delete that.table.options['values']
    // }
    // if (that.table.plant_id){
    //   that.table.options['fields']=['plant_id']; 
    //   that.table.options['ops']=['eq']; 
    //   that.table.options['values']=[that.table.plant_id];
    //   }else {
    //   delete that.table.options['fields']
    //   delete that.table.options['ops']
    //   delete that.table.options['values']
    //   }
    if (that.table.type_of_order.length > 0) {
      that.table.options['fields'].push('type_of_order');
      that.table.options['ops'].push ('in');
      that.table.options['values'].push(JSON.stringify(that.table.type_of_order));
    }

    if (that.table.plant_id){
    that.table.options["fields"].push("plant_id"); 
    that.table.options['ops'].push("eq"); 
    that.table.options['values'].push(that.table.plant_id);
    }

    return OrderApi.getAll(this.table.options)
      .then((response) => {
        that.table.loading = false;
        that.table.rows = response.data;
        that.table.options.fields=[];
        that.table.options.ops=[];
        that.table.options.values=[];
      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      });
  },
  editShow(location) {
    const that = this;
    that.SET_DIALOG_CREATE_EDIT(true);
    if (location) {
      that.SET_SELECTED(location);
      that.SET_IS_EDIT_FLAG(true);
    } else {
      that.RESET_SELECTED();
      that.SET_IS_EDIT_FLAG(false);
    }
  },
  goDetail(item) {
    const that = this;
    that.SET_SELECTED(item);
    that.SET_IS_EDIT_FLAG(true);
    // console.log({ item })
    // 

    this.order_page_model = item;
    // router.push({ path: "/order_item?id=" + item.id });
    router.push({ path: "/order_item" });
  },
  removeShow(location) {
    this.SET_DIALOG_DELETE(true);

    this.SET_SELECTED(location);
  },
  closeCreateEdit() {

    this.SET_DIALOG_CREATE_EDIT(false);
    this.RESET_SELECTED();
  },
  closeRemove() {

    this.SET_DIALOG_DELETE(false);
    this.RESET_SELECTED();
  },


  ...mutations,
  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
};


const getters = {
  headers(state) {
    const that = this;

    const colums = Object.keys(getDefaultSelectedState());

    const exclude_keys = ["mill_id", "rolling_id", 'id', 'payment_terms']

    let result_columns = colums.filter(item => !exclude_keys.includes(item));

    // const pre_colomns = [
    //   // { title: 'Rolling Code ', value: 'rolling.rolling_code', sortable: false, align: 'end' },

    //   // { title: 'Mill Code ', value: 'mill.code', sortable: false, align: 'end' },
    // ];
    let column = result_columns.reduce((pre, cur, index) => {
      if (that.hideColumns.indexOf(cur) >= 0) {
        return pre
      }
      const column = { title: getI18nText(`${that.table_titles[cur]}`), minWidth: 150, key: cur, value: cur, sortable: true };
      if (cur === "sales_division") {
        column.value = (item) => formatDivision(item.sales_division)
      }
      if (cur === "type_of_order") {
        column.value = (item) => formatOrderType(item.type_of_order)
      }
      
      return [...pre, column]
    }, [])


    let headers =  [{ title: 'Action', value: 'action', fixed: true, sortable: false, align:"center" }, ...column,]
    // 查找 title='Address Line 5'的数据然后把 create 插入到后面
    const index = headers.findIndex(it=> it.title=='Address Line 5')
    headers.splice(index +1, 0, {
      title: 'Create At',
      key: 'created_at',
      minWidth: 180,
      value: (item) => moment(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true
    } )
    return headers
  },
};

export const useOrderStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  getters,
  actions,
});
