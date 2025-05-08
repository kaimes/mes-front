
import { defineStore } from 'pinia';
import { useAppStore } from '../../app/storePinia'

import { formatString } from '@/util/util';
import MenubuttonApi from "./api";

import router from "../../router";
import { getI18nText } from '@/util/i18nHelper';
import { debounce } from "lodash";

const getDefaultSelectedState = () => {
  return {
    name: null,
    value: null,
    api: null,
    method: null,
    menu: null,
    role: [],
    flex_form_data: null,
    remark: null,
  };
};

const state = {
  search: {
    menu: {
      id: -1,
      name: "",
    }
  },
  hideColumns: ["role", "menu", "flex_form_data", "is_deleted", "created_by", "updated_by", "created_at", "updated_at"],
  isEditFlag: false,
  selected: {
    ...getDefaultSelectedState(),
  },
  dialogs: {
    showCreateEdit: false,
    showRemove: false,
    PermissionShow: false,
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
      sortBy: ["name"],
      descending: [false],
      fields: ["menu_id"],
      ops: ["=="],
      values: [-1],
    },
    loading: false,
  },
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
  goMenu() {
    router.push({ path: "/menus" });

  },
  setSearch(row) {
    this.search.menu = row
  },
  getAll() {
    const that = this;
    that.SET_TABLE_LOADING(true);
    this.table.options.values = [this.search.menu?.id];
    return MenubuttonApi.getAll(this.table.options)
      .then((response) => {
        that.SET_TABLE_LOADING(false);
        that.SET_TABLE_ROWS(response.data);
      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      });
  },
  editShow(location) {
    const that = this;
    that.SET_DIALOG_CREATE_EDIT(true);
    this.dialogs.PermissionShow = false;
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
    this.dialogs.PermissionShow = false;
    this.RESET_SELECTED();
  },
  closeRemove() {

    this.SET_DIALOG_DELETE(false);
    this.RESET_SELECTED();
  },
  save() {

    const that = this;
    that.selected.menu = that.search.menu
    if (!that.isEditFlag) {
      that.selected.flex_form_data = {}
      return MenubuttonApi.create(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          that.messageAlert("Location created successfully.")
        })
        .catch((err) => {
          that.messageAlert("Location not created. Reason: " + err.response.data.detail, 'red')
        });
    } else {
      return MenubuttonApi.update(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          that.messageAlert("Location updated successfully.")
        })
        .catch((err) => {
          that.messageAlert("Location not updated. Reason: " + err.response.data.detail, 'red')

        });
    }
  },
  remove() {
    const that = this;
    return MenubuttonApi.delete(that.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        that.messageAlert("Location deleted successfully.")
      })
      .catch((err) => {
        that.messageAlert("Location not deleted. Reason: Related data cannot be deleted", 'red')

      });
  },

  closePermission() {
    this.dialogs.PermissionShow = false;
    this.SET_DIALOG_DELETE(false);
    this.SET_DIALOG_CREATE_EDIT(false);
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
    let column = Object.keys(getDefaultSelectedState()).reduce((pre, cur, index) => {
      if (that.hideColumns.indexOf(cur) >= 0) {
        return pre
      }
      return [...pre, { title: getI18nText(`${formatString(cur)}`), value: cur, sortable: true }]
    }, [])
    return [
      { title: 'Action', value: 'action', sortable: false, align: 'center', width: 100, fixed: true },
        ...column,
    ]
  },
};

const namespace = 'menu_button'
export const useMenuButtonStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  actions,
  getters
});
