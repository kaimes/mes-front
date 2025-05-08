
import { defineStore } from 'pinia';
import { toast } from "vue3-toastify";
import { useAppStore } from '../app/storePinia'
import AreaApi from "@/area/api";
import { getI18nText } from '@/util/i18nHelper';
import {formatDate} from "@/util/util";

// import {convertDateTimeFormat} from '@/util/dateFormat'
const getDefaultSelectedState = () => {
  return {
    code: null,
    type: null,
    desc: null,
    site_code: null,
    charge_status: null,
    mill_id: null,
    latitude: null,
    longitude: null,
    updated_at: null,
    updated_by: null,
    actions: "Action",
  };
};

const state = {
  // t: useI18n(),
  isEditFlag: false,
  selected: {
    ...getDefaultSelectedState(),
  },
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
      sortBy: ["code"],
      descending: [false],
    },
    loading: false,
  },
  table_title: {
    code: 'Code',
    type: 'Type',
    desc: 'Desc',
    site_code: 'Site Code',
    charge_status: 'Charge Status',
    mill_id: 'Mill Code',
    latitude: 'Latitude',
    longitude: 'Longitude',
    flex_form_data: 'Flex Form Data',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    is_deleted: 'Is Deleted',
    actions: 'Action',
  },
};

// const getters = {
//   getField,
// };

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
  getAll() {
    // const aaa = getI18nText('area.table.type')
    // console.log(aaa);


    const that = this;
    that.SET_TABLE_LOADING(true);
    return AreaApi.getAll(this.table.options)
      .then((response) => {
        // commit("SET_TABLE_LOADING", false);
        // commit("SET_TABLE_ROWS", response.data);
        // 
        that.SET_TABLE_LOADING(false);
        if (response.data?.items?.length > 0) {
          const itemsWithCodes = response.data.items.map(item => ({
            ...item,
            site_code: item.site?.code,
          }));
          that.SET_TABLE_ROWS({ ...response.data, items: itemsWithCodes });
        }
        else {
          that.SET_TABLE_ROWS({ ...response.data });
        }
      })
      .catch(() => {
        // commit("SET_TABLE_LOADING", false);
        that.SET_TABLE_LOADING(false);
      });
  },
  editShow(location) {
    const that = this;
    // commit("SET_DIALOG_CREATE_EDIT", true);
    that.SET_DIALOG_CREATE_EDIT(true);
    if (location) {
      // commit("SET_SELECTED", location);
      // commit("SET_IS_EDIT_FLAG", true);
      that.SET_SELECTED(location);
      that.SET_IS_EDIT_FLAG(true);
    } else {
      // commit("SET_IS_EDIT_FLAG", false);
      that.RESET_SELECTED();
      that.SET_IS_EDIT_FLAG(false);
    }
  },
  removeShow(location) {
    // commit("SET_DIALOG_DELETE", true);
    // commit("SET_SELECTED", location);
    this.SET_DIALOG_DELETE(true);

    this.SET_SELECTED(location);
  },
  closeCreateEdit() {
    // 
    // commit("SET_DIALOG_CREATE_EDIT", false);
    // commit("RESET_SELECTED");
    this.SET_DIALOG_CREATE_EDIT(false);
    this.RESET_SELECTED();
  },
  closeRemove() {
    // commit("SET_DIALOG_DELETE", false);
    // commit("RESET_SELECTED");

    this.SET_DIALOG_DELETE(false);
    this.RESET_SELECTED();
  },
  save() {

    const that = this;
    if (!that.isEditFlag) {

      that.selected.flex_form_data = {}
      return AreaApi.create(that.selected)
        .then(() => {
          // dispatch("closeCreateEdit");
          // dispatch("getAll");
          that.closeCreateEdit();
          that.getAll();
          toast.success("Area created successfully.", {
            position: "bottom-center"
          });
        })
        .catch((err) => {
          toast.error(err?.response?.data?.detail || "Area created Error.", { autoClose: 60000 });
        });
    } else {
      return AreaApi.update(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          toast.success("Area updated successfully.", {
            position: "bottom-center"
          });
        })
        .catch((err) => {
          toast.error(err?.response?.data?.detail || "Area updated Error.", { autoClose: 60000 });
        });
    }
  },
  remove() {
    const that = this;
    return AreaApi.delete(that.selected.id)
      .then(function () {
        // dispatch("closeRemove");
        // dispatch("getAll");
        that.closeRemove();
        that.getAll();
        // commit(
        //   "app/SET_SNACKBAR",
        //   { text: "Location deleted successfully." },
        //   { root: true }
        // );
        toast.success("Area deleted successfully.", {
          position: "bottom-center"
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.detail || "Area deleted Error.", { autoClose: 60000 });
      });
  },
  ...mutations,
  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
};

const namespace = 'area';
const headername = 'table';

const getters = {
  headers(state) {
    return Object.keys(getDefaultSelectedState()).map(item => {
      const header = { title: getI18nText(`${this.table_title[item]}`), key: item, sortable: true };
      if (header.key === "updated_at") {
        header.value = (row) => formatDate(row.updated_at)
      } else if (header.key === "mill_id") {
        header.value = (row) => row.mill ? row.mill.code : ''
      }
      return header
    })

  },
};

export const useAreaStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  getters,
  actions,
});
