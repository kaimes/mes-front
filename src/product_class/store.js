
import { defineStore } from 'pinia';
import { useAppStore } from '../app/storePinia'
import productClassApi from "@/product_class/api";
import { getI18nText } from '@/util/i18nHelper';
import { toast } from "vue3-toastify";
import {formatDate} from "@/util/util";

// import {convertDateTimeFormat} from '@/util/dateFormat'
const getDefaultSelectedState = () => {
  return {
    id: null,
    code: null,
    mill: null,
    mill_code: null,
    type: null,
    desc: null,
    updated_at: null,
    updated_by: null,
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
    mill_code: 'Mill Code',
    type: 'Type',
    desc: 'Desc',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
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
    // const aaa = getI18nText('product_class.table.type')
    // console.log(aaa);


    const that = this;
    that.SET_TABLE_LOADING(true);
    return productClassApi.getAll(this.table.options)
      .then((response) => {
        // commit("SET_TABLE_LOADING", false);
        // commit("SET_TABLE_ROWS", response.data);
        // 
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
      return productClassApi.create(that.selected)
        .then(() => {
          // dispatch("closeCreateEdit");
          // dispatch("getAll");
          that.closeCreateEdit();
          that.getAll();
          // commit(
          //   "app/SET_SNACKBAR",
          //   { text: "Location created successfully." },
          //   { root: true }
          // );
          toast.success("Product Code created successfully.", { position: "bottom-center" })
        })
        .catch((err) => {
          // commit(
          //   "app/SET_SNACKBAR",
          //   {
          //     text: "Location not created. Reason: " + err.response.data.detail,
          //     color: "red",
          //   },
          //   { root: true }
          // );
          toast.error("Product Code not created. Reason: " + err.response.data.detail, { autoClose: 60000 }
    )
        });
    } else {
      return productClassApi.update(that.selected)
        .then(() => {
          console.log(that.selected);

          // dispatch("closeCreateEdit");
          // dispatch("getAll");
          that.closeCreateEdit();
          that.getAll();
          // commit(
          //   "app/SET_SNACKBAR",
          //   { text: "Location updated successfully." },
          //   { root: true }
          // );
          toast.success("Product Code updated successfully.", { position: "bottom-center" })
        })
        .catch((err) => {
          // commit(
          //   "app/SET_SNACKBAR",
          //   {
          //     text: "Location not updated. Reason: " + err.response.data.detail,
          //     color: "red",
          //   },
          //   { root: true }
          // );
          toast.error("Product Code not updated. Reason: " + err.response.data.detail, { autoClose: 60000 }
    )

        });
    }
  },
  remove() {
    const that = this;
    return productClassApi.delete(that.selected.id)
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
        toast.success("Product Code deleted successfully.", { position: "bottom-center" })
      })
      .catch((err) => {
        // commit(
        //   "app/SET_SNACKBAR",
        //   {
        //     text:
        //       "Location not deleted. Reason: Related data cannot be deleted",
        //     color: "red",
        //   },
        //   { root: true }
        // );
        toast.error("Product Code not deleted. Reason: " + err.response.data.detail, { autoClose: 60000 }
    )

      });
  },
  ...mutations,
  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
};

const namespace = 'product_class';
const headername = 'table';

const getters = {
  headers(state) {
    return Object.keys(getDefaultSelectedState()).map(item => {
      const header = { title: getI18nText(`${this.table_title[item]}`), key: item, sortable: true };
      if (header.key === "update_at") {
        header.value = (row) => formatDate(row.update_at)
      }
      return header
    })

  },
};

export const useProductClassStore = defineStore(namespace, {
  id: namespace,
  state: () => {
    return state;
  },
  getters,
  actions,
});
