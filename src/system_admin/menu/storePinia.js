import { defineStore } from 'pinia';
import { useAppStore } from '../../app/storePinia'
import MenuApi from "./api";
import router from "../../router";
import { getI18nText } from '@/util/i18nHelper';
import { formatString } from '@/util/util';
import { debounce } from "lodash";
import { useMenuButtonStore } from "../menu_button/storePinia";
import { toast } from "vue3-toastify";

const getDefaultSelectedState = () => {
  return {
    name: null,
    title: null,
    parent: null,
    sort: 1,
    icon: null,
    is_link: null,
    is_catalog: null,
    web_path: null,
    component: null,
    component_name: null,
    status: null,
    visible: null,
    role: [],
    parent_id: null,
    children: null,
    desc: null,
  };
};

const state = {
  menuOptions: [],
  menuTopOptions: [],
  hideColumns: ["is_link", "component", "desc", "icon", "is_catalog", "role", "children", "parent_id", "flex_form_data", "is_deleted", "created_by", "updated_by", "created_at", "updated_at"],
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
      sortBy: ["sort"],
      descending: [false],
    },
    loading: false,
  },
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
  showMenuBotton(item) {
    const menuButtonStore = useMenuButtonStore();
    menuButtonStore.setSearch(item);
    router.push({ path: "/menus_button", params: { id: item.id } });
  },
  getTreeData() {
    const that = this;
    return MenuApi.getTreeData({})
      .then((response) => {
        that.menuOptions = [response.data]
      })
      .catch(() => {
        that.menuOptions = []
      });
  },
  getTreeTopSelect() {
    const that = this;
    return MenuApi.getTreeTopSelect({})
      .then((response) => {
        that.menuTopOptions = response.data.options
      })
      .catch(() => {
        that.menuTopOptions = []
      });
  },
  getAll() {
    const that = this;
    that.SET_TABLE_LOADING(true);
    return MenuApi.getAll(this.table.options)
      .then((response) => {
        that.SET_TABLE_LOADING(false);
        that.SET_TABLE_ROWS(response.data);
      })
      .catch(() => {
        that.SET_TABLE_LOADING(false);
      });
  },
  editShow(location) {
    this.getTreeTopSelect()
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
    if (!that.isEditFlag) {
      that.selected.flex_form_data = {}
      return MenuApi.create(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          toast.success("Location created successfully.", { autoClose: 3000 });
        })
        .catch((err) => {
          toast.error("Location not created. Reason: " + err.response.data.detail, { autoClose: 3000 });
        });
    } else {
      return MenuApi.update(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          toast.success("Location updated successfully.", { autoClose: 3000 });
        })
        .catch((err) => {
          toast.error("Location not updated. Reason: " + err.response.data.detail, { autoClose: 3000 });
        });
    }
  },
  remove() {
    const that = this;
    return MenuApi.delete(that.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        that.messageAlert("Location deleted successfully.")
      })
      .catch((err) => {
        that.messageAlert("Location not deleted. Reason: Related data cannot be deleted", 'red')

      });
  },
  showPermission(item) {
    this.SET_SELECTED(item);
    this.dialogs.PermissionShow = true;
    this.SET_DIALOG_DELETE(false);
    this.SET_DIALOG_CREATE_EDIT(false);
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
      { title: 'Action', value: 'action', sortable: false, align: 'center', fixed: true },
      ...column,
    ];
  },
};

const namespace = 'menu'
export const useMenuStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  actions,
  getters
});