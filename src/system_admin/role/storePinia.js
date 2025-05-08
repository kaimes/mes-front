
import { defineStore } from 'pinia';
import { useAppStore } from '../../app/storePinia'
import { formatString } from '@/util/util';

import RoleApi from "./api";
import UserApi from "../../auth/api";

import { getI18nText } from '@/util/i18nHelper';
import { debounce } from "lodash";

import MillApi from "../../mill/api";
import {toast} from "vue3-toastify";


const getDefaultSelectedState = () => {
  return {
    id: null,
    name: null,
    key: null,
    sort: null,
    status: null,
    admin: null,
    remark: null,
    homepage_id:null,
    menu: [],
    permission: [],
    menuPermissions: [],
    mill: []
  };
};
const getDefaultMenuPermissions = () => {
  return {
    checked: [],
    unchecked: [],
    undetermined: [],
  };
};
const state = {
  menuPermissions: {
    ...getDefaultMenuPermissions(),
  },
  menuOptions: [],
  millOptions: [],
  hideColumns: ["homepage_id","menuPermissions", "permission", "menu", "flex_form_data", "is_deleted", "created_by", "updated_by", "created_at", "updated_at"],
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
  SET_MILL_DATA(payload) {
    this.millOptions = payload;
  }
};
const actions = {
  getMillSelect() {
    return MillApi.getMillSelect()
      .then((response) => {
        this.SET_MILL_DATA(response.data.options);
      })
      .catch(() => {
        this.SET_MILL_DATA([]);
      });
  },


  getMenuTreeSelect(id) {
    const that = this;
    this.menuOptions = []
    return RoleApi.getMenuTreeSelect(id)
      .then((response) => {
        that.menuOptions = response.data.options
      })
      .catch(() => {
        that.menuOptions = []
      });
  },
  getAll() {
    const that = this;
    that.SET_TABLE_LOADING(true);
    return RoleApi.getAll(this.table.options)
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
    this.getMillSelect()
    that.SET_DIALOG_CREATE_EDIT(true);
    this.dialogs.PermissionShow = false;
    if (location) {
      console.log('-----------',this.selected)
      that.SET_SELECTED(location);
      that.SET_IS_EDIT_FLAG(true);
    } else {
      console.log('===========')
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
  getUserPermission() {
    UserApi.getPermission()
      .then(function (res) {
        const menuButtonPermission = res.data.permission || [];
        localStorage.setItem(
          "menuButtonPermission",
          JSON.stringify(menuButtonPermission)
        );
      })
      .catch(err => {

      });
  },
  save() {

    const that = this;
    let menuPermissions = Object.values([...this.menuPermissions.checked, ...this.menuPermissions.undetermined]).reduce(function (pre, cur, index) {
      return [...pre, {
        id: cur.id,
        title: cur.title,
        type: cur.type,
      }]
    }, [])
    this.selected.menuPermissions = menuPermissions
    if (!that.selected.id) {
      that.selected.flex_form_data = {}
      return RoleApi.create(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          that.getUserPermission();
          toast.success("Create Success", {
            position: "bottom-center"
          });
          // that.messageAlert("Location created successfully.")
        })
        .catch((err) => {
          toast.error(err.response.data.detail, { autoClose: 60000 });
          // that.messageAlert("Location not created. Reason: " + err.response.data.detail, 'red')
        });
    } else {
      let select_mill = Object.values(this.selected.mill).reduce(function (pre, cur, index) {
        if (Number.isFinite(cur) && !isNaN(cur)) {
          return [...pre, cur]
        }
        return [...pre, cur.id]
      }, [])
      that.selected.mill = select_mill
      return RoleApi.update(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          that.getUserPermission();
          toast.success("Update Success", {
            position: "bottom-center"
          });
          // that.messageAlert("Location updated successfully.")
        })
        .catch((err) => {
          toast.error(err.response.data.detail, { autoClose: 60000 });
          // that.messageAlert("Location not updated. Reason: " + err.response.data.detail, 'red')

        });
    }
  },
  remove() {
    const that = this;
    return RoleApi.delete(that.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        that.messageAlert("Location deleted successfully.")
        toast.success("Delete Success", {
          position: "bottom-center"
        });
      })
      .catch((err) => {
        that.messageAlert("Location not deleted. Reason: Related data cannot be deleted", 'red')
        toast.error("Deletion not allowed: related users are associated with this item.", { autoClose: 60000 });
      });
  },
  showPermission(item) {
    this.getMenuTreeSelect(item.id);
    this.SET_SELECTED(item);
    this.dialogs.PermissionShow = true;
    this.SET_DIALOG_DELETE(false);
    this.SET_DIALOG_CREATE_EDIT(false);
  },
  closePermission() {
    this.menuOptions = []
    this.dialogs.PermissionShow = false;
    this.SET_DIALOG_DELETE(false);
    this.SET_DIALOG_CREATE_EDIT(false);
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
    let column = Object.keys(getDefaultSelectedState()).reduce((pre, cur, index) => {
      if (that.hideColumns.indexOf(cur) >= 0) {
        return pre
      }
      return [...pre, { title: getI18nText(`${formatString(cur)}`), value: cur, sortable: true }]
    }, [])
    return [
      { title: 'Action', value: 'action', sortable: false, align: 'center', fixed: true },
        ...column,
      { title: 'Homepage', value: 'homepage_path', sortable: false },
  
    ]
  },
};

const namespace = 'role'
export const useRoleStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  actions,
  getters
});
