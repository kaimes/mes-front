
import { defineStore } from 'pinia';
import { useAppStore } from '@/app/storePinia'

import { useOrderStore } from '../order/storePinia'

import OrderItem from "@/order_admin/order_line_item/api";
import { getI18nText } from '@/util/i18nHelper';
import { formatDate } from "@/util/util";
import {toast} from "vue3-toastify";


const namespace = 'order_item';
const getDefaultSelectedState = () => {
  return {
    rolling_code: null,
    spec_code: null,
    product_dim1: null,
    product_dim2: null,
    product_dim3: null,
    product_form: null,
    product_form_type: null,
    quality_code: null,
    request_bar: 0,
    cutted_bar: 0,
    length_mm: null,
    quantity: null,
    un: "PC",
    line_item_desc: null,
    tonnage: null,
    // order_id: null,
    // order_group_id: null,
    line_item_seq: null,
    product_code: null,
    customer_spec_code: null,
    customer_material: null,
    stocked_quantity: null,
    tonnage_tolerance_min_percent: null,
    tonnage_tolerance_max_percent: null,
    product_dim4: null,
    product_dim_unit: null,
    outside_inspection_required: null,
    transport_type: null,
    destination_port: null,
    loading_port: null,
    order_item_remarks: null,
    clear_remark_type: null,
    clear_remark_sequence: null,
    clear_remark: null,
    general_remark_1: null,
    general_remark_2: null,
    general_remark_3: null,
    general_remark_4: null,
    general_remark_5: null,
    marking_requirements: null,
    processing_remark_1: null,
    processing_remark_2: null,
    processing_remark_3: null,
    processing_remark_4: null,
    processing_remark_5: null,
    delivery_date: null,
    delivery_address_id: null,
    caster: null,
    surface_grade: null,
    coating_type: null,
    cut_margin_min: null,
    cut_margin_max: null,
    color_code: null,
    carbon_min: null,
    carbon_max: null,
    manganese_range_min: null,
    manganese_range_max: null,
    secondary_length_1_min: null,
    secondary_length_1_max: null,
    section_width_min: null,
    section_thickness_min: null,
    section_width_max: null,
    section_thickness_max: null,
    inspector_code_1: null,
    inspector_code_2: null,
    inspector_code_3: null,
    label_template_id: null,
    label_data: null,
    quantity_pc: null,
    quantity_tonnage: null,
    length_1_mm: null,
    length_2_mm: null,
    length_feet: null,
    length_inch: null,
    astm_dim1: null,
    astm_dim2: null,
    astm_dim3: null,
    sales_order_unit: null,
    semi_width: null,
    semi_thickness: null,
    prime_type: null,
    im_type: null,
    weight_per_pc: null,
    secondary_length_2_min: null,
    secondary_length_2_max: null,
    secondary_length_volume: null,
    rejection: null,
    rejection_desc: null,
    sub_item_no: null,
    condition_record_per_unit: null,

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
      fields: ["order_id"],
      ops: ["eq"],
      values: [],
      page: 1,
      itemsPerPage: 10,
      sortBy: ["updated_by"],
      descending: [false],
    },
    loading: false,
  },
  table_titles: {
    action: "Action",
    rolling_code: "Rolling Code Short",
    spec_code: "Spec Code",
    request_bar: "Request Bar",
    cutted_bar: "Cutted Bar",
    product_dim1: "Product Dim1",
    product_dim2: "Product Dim2",
    product_dim3: "Product Dim3",
    product_form: "Product Form",
    product_form_type: "Product Form Type",
    quality_code: "Quality Code",
    length_mm: "Length (mm)",
    quantity: "Quantity (PC)",
    un: "Unit",
    line_item_desc: "Line Item Desc",
    tonnage: "Tonnage",
    line_item_seq: "Line Item Seq",
    product_code: "Product Code",
    customer_spec_code: "Customer Spec Code",
    customer_material: "Customer Material",
    stocked_quantity: "Stocked Quantity",
    tonnage_tolerance_min_percent: "Tonnage Tolerance Min Percent",
    tonnage_tolerance_max_percent: "Tonnage Tolerance Max Percent",
    product_dim4: "Product DIM 4",
    product_dim_unit: "Product DIM Unit",
    outside_inspection_required: "Outside Inspection Required",
    transport_type: "Transport Type",
    destination_port: "Destination Port",
    loading_port: "Loading Port",
    order_item_remarks: "Remarks",
    clear_remark_type: "Clear Remark Type",
    clear_remark_sequence: "Clear Remark Seq",
    clear_remark: "Clear Remark",
    general_remark_1: "General Remark 1",
    general_remark_2: "General Remark 2",
    general_remark_3: "General Remark 3",
    general_remark_4: "General Remark 4",
    general_remark_5: "General Remark 5",
    marking_requirements: "Marking Requirements",
    processing_remark_1: "Processing Remark 1",
    processing_remark_2: "Processing Remark 2",
    processing_remark_3: "Processing Remark 3",
    processing_remark_4: "Processing Remark 4",
    processing_remark_5: "Processing Remark 5",
    delivery_date: "Delivery Date",
    delivery_address_id: "Delivery Address ID",
    caster: "Caster",
    surface_grade: "Surface Grade",
    coating_type: "Coating Type",
    cut_margin_min: "Cut Margin Min",
    cut_margin_max: "Cut Margin Max",
    color_code: "Color Code",
    carbon_min: "Carbon Min",
    carbon_max: "Carbon Max",
    manganese_range_min: "Manganese Range Min",
    manganese_range_max: "Manganese Range Max",
    secondary_length_1_min: "Secondary Length 1 Min",
    secondary_length_1_max: "Secondary Length 1 Max",
    section_width_min: "Section Width Min",
    section_thickness_min: "Section Thickness Min",
    section_width_max: "Section Width Max",
    section_thickness_max: "Section Thickness Max",
    inspector_code_1: "Inspector Code 1",
    inspector_code_2: "Inspector Code 2",
    inspector_code_3: "Inspector Code 3",
    label_template_id: "Label Template ID",
    label_data: "Label Data",
    quantity_pc: "Quantity (PC)",
    quantity_tonnage: "Quantity (Tonnage)",
    length_1_mm: "Length 1 (MM)",
    length_2_mm: "Length 2 (MM)",
    length_feet: "Length Feet",
    length_inch: "Length Inch",
    astm_dim1: "ASTM DIM1",
    astm_dim2: "ASTM DIM2",
    astm_dim3: "ASTM DIM3",
    sales_order_unit: "Sales Order Unit",
    semi_width: "Semi Width",
    semi_thickness: "Semi Thickness",
    prime_type: "Prime Type",
    im_type: "Imperial IND",
    weight_per_pc: "Weight Per PC",
    secondary_length_2_min: "Secondary Length 2 Min",
    secondary_length_2_max: "Secondary Length 2 Max",
    secondary_length_volume: "Secondary Length Volume",
    rejection: "Rejection",
    rejection_desc: "Rejection Desc",
    sub_item_no: "Sub Item No",
    condition_record_per_unit: "Condition Record Per Unit",
  }
};



const mutations = {
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

    const order = useOrderStore();
    let q = order.order_page_model.id;

    return OrderItem.getAll({ ...this.table.options, ...{ q: order.order_page_model.id } })
      .then((response) => {
        that.table.loading = false;
        that.table.rows = response.data;

      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      });
  },
  getByOrderId() {
    const that = this;
    that.table.loading = true;

    const order = useOrderStore();
    let orderId = order.order_page_model.id;
    if (!orderId) {
      that.table.loading = false;
      return false;
    }
    this.table.options.values = [orderId];

    return OrderItem.getAll({ ...this.table.options })
      .then((response) => {
        that.table.loading = false;
        let responseData = response.data;
        if (responseData && responseData.items && responseData.items.length > 0) {
          for (let i in responseData.items) {
            if (responseData.items[i] && responseData.items[i].length_mm) {
              responseData.items[i].length_mm = parseInt(responseData.items[i].length_mm)
            }
          }
        }
        that.table.rows = responseData;
      })
      .catch((err) => {
        console.log(err);
        that.SET_TABLE_LOADING(false);
      });
  },
  handleError(error)  {
    if (error.response) {
      toast.error(error.response.data?.detail, { autoClose: 60000 })
    } else {
      console.log(error)
    }
    return false
  },
  handleSendToPcc(item) {
    if (item?.order?.type_of_order !== 87) {
      toast.error("failed, not 087 order", { autoClose: 60000 });
      return false;
    }
    return OrderItem.send_to_pcc(item.id, {}).then((res) => {
      toast.success("send is queued", {
        position: "bottom-center"
      });
    }).catch((error) => {
      this.handleError(error)
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
    const exclude_keys = ["order_group_id", "order_id"]
    let result_columns = colums.filter(item => !exclude_keys.includes(item));
    const pre_colomns = [
      { title: 'Action', value: 'action', minWidth: 60, sortable: false, fixed: 'left' },
      { title: 'Line Item Number ', value: 'line_item_code', minWidth: 120, sortable: true },
      { title: 'Ordered Tonnes', value: 'weight_per_pc', sortable: true, minWidth: 120 },
      { title: 'Ordered Bars', value: 'quantity', sortable: true, minWidth: 120 },
      { title: 'Rolled Bars', value: 'cutted_bar', sortable: true, minWidth: 120 },
      { title: 'Adviced Bars', value: 'request_bar', sortable: true, minWidth: 120 },
      { title: 'Mill Code ', value: 'mill.code', sortable: false, align: 'end' },
    ];
    let column = result_columns.reduce((pre, cur, index) => {
      if (that.hideColumns.indexOf(cur) >= 0) {
        return pre
      }
      const column = { title: getI18nText(`${that.table_titles[cur]}`), minWidth: 120, key: cur, value: cur, sortable: true };
      if (cur === "delivery_date") {
        column.value = (item) => formatDate(item.delivery_date)
      }
      return [...pre, column]
    }, [])
    console.log("[...pre_colomns, ...column]", JSON.stringify([...pre_colomns, ...column]))
    return [...pre_colomns, ...column]
  },
};

export const useOrderLineItemStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  getters,
  actions,
});
