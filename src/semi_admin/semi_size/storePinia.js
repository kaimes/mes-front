
import { defineStore } from 'pinia';
import { useAppStore } from '../../app/storePinia'

import SemiSizeApi from "@/semi_admin/semi_size/api";

import { toast } from "vue3-toastify";

// import { getField, updateField } from "vuex-map-fields";
import { debounce } from "lodash";

const getDefaultSelectedState = () => {
  return {
    mill_id: null,
    mill_code: null,
    code: null,
    type: null,
    name: null,
    desc: null,
  };
};

const state = {
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
};

const mutations = {
  // updateField,
  SET_SELECTED(value) {
    this.selected = Object.assign(this.selected, value);
    if (value.mill?.code) this.selected.mill_code = value.mill.code;
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
    that.SET_TABLE_LOADING(true);
    return SemiSizeApi.getAll(this.table.options)
      .then((response) => {
        that.SET_TABLE_LOADING(false);
        that.SET_TABLE_ROWS(response.data);
      })
      .catch((e) => {
        console.error(e)
        that.SET_TABLE_LOADING(false);
      });
  },
  editShow(semi_size) {
    const that = this;
    that.SET_DIALOG_CREATE_EDIT(true);
    if (semi_size) {
      that.SET_SELECTED(semi_size);
      that.SET_IS_EDIT_FLAG(true);
    } else {
      that.RESET_SELECTED();
      that.SET_IS_EDIT_FLAG(false);
    }
  },
  handlePickMillCode: function (mill) {
    this.selected.mill_id = mill.id;
  },
  removeShow(semi_size) {
    this.SET_DIALOG_DELETE(true);

    this.SET_SELECTED(semi_size);
  },
  closeCreateEdit() {
    this.SET_DIALOG_CREATE_EDIT(false);
    this.RESET_SELECTED();
  },
  closeRemove() {
    this.SET_DIALOG_DELETE(false);
    this.RESET_SELECTED();
  },
  handleError(error) {
    if (error.response) {
      toast.error(error.response.data?.detail, { autoClose: 60000 })
    } else {
      console.log(error)
    }
    return false
  },
  save() {
    const that = this;
    if (!that.isEditFlag) {
      that.selected.flex_form_data = {}
      return SemiSizeApi.create(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          toast.success('created successfully.', {
            position: "bottom-center"
          })
        })
        .catch(error => {
          that.handleError(error)
        });
    } else {
      return SemiSizeApi.update(that.selected)
        .then(() => {
          that.closeCreateEdit();
          that.getAll();
          toast.success('updated successfully.', {
            position: "bottom-center"
          })
        })
        .catch(error => {
          that.handleError(error)
        });
    }
  },
  remove() {
    const that = this;
    return SemiSizeApi.delete(that.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        toast.success('deleted successfully.', {
          position: "bottom-center"
        })
      })
      .catch(error => {
        that.handleError(error)
      });
  },
  ...mutations,
  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
};

const namespace = 'semi_size'
export const useSemiSizeStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  actions,
});
