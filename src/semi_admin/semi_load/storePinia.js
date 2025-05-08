
import { defineStore } from 'pinia';
import { useAppStore } from '../../app/storePinia'
import SemiLoadApi from "@/semi_admin/semi_load/api";
import { getI18nText } from '@/util/i18nHelper';

import { useSemiStore } from "../semi/storePinia";
import router from "../../router";

// import {convertDateTimeFormat} from '@/util/dateFormat'
const getDefaultSelectedState = () => {
  return {
    rolling: null,
    order_group: null,
    site: null,
    semi_load: null,
    semi_code: null,
    cast_code: null,
    semi_charge_seq: null,
    stock_in_date: "",
    skelp_code: null,
    semi_cut_seq: null,
    semi_code_1: null,
    product_type: null,
    quality_code: null,
    length_mm: null,
    width_mm: null,
    thickness_mm: null,
    estimated_weight_kg: null,
    scarfed_status: null,

    updated_at: null,
    updated_by: null,
    created_at: null,
    created_by: null,
    is_deleted: null,
    flex_form_data: null
  };
};

const state = {
  search: {
    semi_load: null
  },
  isEditFlag: false,
  selected: {
    ...getDefaultSelectedState(),
  },
  hideColumns: ["semi_charge_seq", "scarfed_status", "quality_code", "product_type", "stock_in_date", "semi_code_1", "rolling", "order_group", "site", "semi_load", "flex_form_data", "is_deleted", "created_by", "updated_by", "created_at", "updated_at"],
  dialogs: {
    showCreateEdit: false,
    showRemove: false,
  },
  table: {
    rows: {
      items: [],
      total: null,
    },
    options: {
      q: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: ["created_at"],
      descending: [true],
      fields: ["semi_load_id"],
      ops: ["=="],
      values: [-1],
    },
    loading: false,
  },
  table_title: {
    semi_code: 'Semi Code',
    cast_code: 'Cast Code',
    skelp_code: 'Skelp Code',
    semi_cut_seq: 'Semi Cut Seq',
    length_mm: 'Length Mm',
    width_mm: 'Width Mm',
    thickness_mm: 'Thickness Mm',
    estimated_weight_kg: 'Estimated Weight Kg',


  }
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
  RESET_SELECTED() {
    this.selected = Object.assign(this.selected, getDefaultSelectedState());
    this.isEditFlag = false;
  },
};
const actions = {
  searchData() {

    const that = this;
    that.SET_TABLE_LOADING(true);
    that.SET_IS_EDIT_FLAG(true);
    if (!this.table.options.sortBy) {
      this.table.options.sortBy = ["created_at"];
    }
    return SemiLoadApi.getAll(this.table.options)
      .then((response) => {
        that.SET_TABLE_LOADING(false);
        if (response.data?.items?.length > 0) {
          that.SET_SELECTED(response.data.items[0]);
        } else {
          that.messageAlert("not find any semi", "red");
        }
      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      });
  },
  getAll() {

    const that = this;
    that.SET_TABLE_LOADING(true);
    this.table.options.values = [this.search.semi_load?.id];
    if (!this.table.options.sortBy) {
      this.table.options.sortBy = ["created_at"];
    }
    return SemiLoadApi.getAll(this.table.options)
      .then((response) => {
        if (response.data?.items?.length > 0) {
          that.SET_SELECTED(response.data.items[0]);
        }
        that.SET_TABLE_LOADING(false);
        that.SET_TABLE_ROWS(response.data);
      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
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
    const semiStore = useSemiStore();
    semiStore.editShow(item);
    router.push({ path: "/semi_detail", params: { id: item.id } });
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
    if (!that.isEditFlag) {

      that.selected.flex_form_data = {}
      return SemiLoadApi.create(that.selected)
        .then(() => {
          that.messageAlert("Semi created successfully.")
          that.closeCreateEdit();
          // router.push({ path: "/semi", params: {} });
          that.getAll();
        })
        .catch((err) => {
          that.messageAlert("Semi not created. Reason: " + err.response.data.detail, 'red')
        });
    } else {
      return SemiLoadApi.update(that.selected)
        .then(() => {
          that.messageAlert("Semi updated successfully.")
          that.closeCreateEdit();
          // router.push({ path: "/semi", params: {} });
          that.getAll();
        })
        .catch((err) => {
          that.messageAlert("Semi not updated. Reason: " + err.response.data.detail, 'red')

        });
    }
  },
  remove() {
    const that = this;
    return SemiLoadApi.delete(that.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        that.messageAlert("Semi deleted successfully.")
      })
      .catch((err) => {
        that.messageAlert("Semi not deleted. Reason: Related data cannot be deleted", 'red')

      });
  },
  ...mutations,
  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
};

const namespace = 'semiLoad';
const headername = 'table';

const getters = {
  headers(state) {
    const that = this;
    const action = { title: '', value: 'action', sortable: false, align: 'end' }
    let column = Object.keys(getDefaultSelectedState()).reduce((pre, cur, index) => {
      if (that.hideColumns.indexOf(cur) >= 0) {
        return pre
      }
      return [...pre, { title: getI18nText(`${this.table_title[cur]}`), value: cur, sortable: true }]
    }, [])
    column.push(action)
    return column
  },
};

export const useSemiLoadStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  getters,
  actions,
});
