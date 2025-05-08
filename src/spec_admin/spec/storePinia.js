
import { defineStore } from 'pinia';
import {toast} from "vue3-toastify";
import { useAppStore } from '@/app/storePinia'
import specApi from "@/spec_admin/spec/api";
import { getI18nText } from '@/util/i18nHelper';

import router from "../../router";
import { data } from 'jquery';
import moment from "moment/moment";
import {formatDate} from "@/util/util";

// import {convertDateTimeFormat} from '@/util/dateFormat'
const getDefaultSelectedState = () => {
  return {
    mill_code: null,
    spec_code: null,
    // section_code: null,
    // spec_units: null,
    version: null,
    version_status: null,
    full_name: null,
    summary_name: null,
    short_name: null,
    

    updated_at: null,
    updated_by: null,
    created_at: null,
    created_by: null,
    is_deleted: null,
    flex_form_data: null
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
  spec_page_model: getDefaultSelectedState(),
  table: {
    rows: {
      items: [],
      total: null,
    },
    options: {
      q: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: ["updated_at"],
      descending: [true],
    },
    loading: false,
    version_status:'R',
  },
  table_title: {
    mill_code: 'Mill Code',
    spec_code: 'Spec Code',
    version: 'Version',
    version_status: 'Version Status',
    full_name: 'Full Name',
    summary_name: 'Summary Name',
    short_name: 'Short Name',

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
    if (this.table.options.q != ""){


      this.table.options["version_status"] = this.table.version_status

      return specApi.getAll(this.table.options)
      .then((response) => {
        this.SET_TABLE_LOADING(false);

        if (response.data?.items?.length > 0) {

          const itemsWithCodes = response.data.items.map(item => ({
            ...item,
            mill_code: item.mill?.code,
          }));
          that.SET_TABLE_ROWS({ ...response.data, items: itemsWithCodes });
        }
        else {
          that.SET_TABLE_ROWS({ ...response.data });
        }
      })
    }else{
      this.getAll()
    }

  },
  getAll() {
    const that = this;
    that.SET_TABLE_LOADING(true);

    this.table.options["version_status"] = this.table.version_status
    return specApi.getAll(this.table.options)
      .then((response) => {
        console.log(response.data)
        that.SET_TABLE_LOADING(false);
        if (response.data?.items?.length > 0) {

          const itemsWithCodes = response.data.items.map(item => ({
            ...item,
            mill_code: item.mill?.code,
          }));
          that.SET_TABLE_ROWS({ ...response.data, items: itemsWithCodes });
        }
        else {
          that.SET_TABLE_ROWS({ ...response.data });
        }
      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      });
  },
  editShow(spec) {
    const that = this;
    that.SET_DIALOG_CREATE_EDIT(true);
    if (spec) {
      that.SET_SELECTED(spec);
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
    this.spec_page_model = item;
    router.push({ path: "/spec_detail", query: { id: item.id} });
  },
  removeShow(spec) {
    this.SET_DIALOG_DELETE(true);

    this.SET_SELECTED(spec);
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
      return specApi.create(that.selected)
        .then(() => {
          toast.success("Spec created Success", {
            position: "bottom-center"
          });
          that.closeCreateEdit();
          router.push({ path: "/spec", params: {} });
          that.getAll();
        })
        .catch((err) => {
          toast.error(err.response.data.detail || "Spec created Error", { autoClose: 60000 });
        });
    } else {
      return specApi.update(that.selected)
        .then(() => {
          toast.success("Spec updated Success", {
            position: "bottom-center"
          });
          that.closeCreateEdit();
          router.push({ path: "/spec", params: {} });
          that.getAll();
        })
        .catch((err) => {
          toast.error(err.response.data.detail || "Spec updated Error", { autoClose: 60000 });
        });
    }
  },
  remove() {
    const that = this;
    return specApi.delete(that.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        that.messageAlert("spec deleted successfully.")
      })
      .catch((err) => {
        that.messageAlert("spec not deleted. Reason: Related data cannot be deleted", 'red')

      });
  },

  toSaveDetail(){

    this.spec_page_model = getDefaultSelectedState
  
    router.push({ path: "/spec_detail"});
  },


  ...mutations,
  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
};

const namespace = 'spec';
const headername = 'table';

const getters = {
  headers(state) {
    const that = this;
    let column = Object.keys(getDefaultSelectedState()).reduce((pre, cur, index) => {
      if (that.hideColumns.indexOf(cur) >= 0) {
        return pre
      }
      return [...pre, { title: getI18nText(`${this.table_title[cur]}`), value: cur, sortable: true }]
    }, [])
    return [{ title: 'Action', value: 'action',width: 180, sortable: false, align: 'center', fixed: true }, ...column, {
      title: 'Release Date',
      key: 'release_date',
      minWidth: 180,
      value: (item) => formatDate(item.release_date),
      sortable: true
    }];
  },
};

export const useSpecStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  getters,
  actions,
});
