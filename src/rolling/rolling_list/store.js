import RollingApi from "@/rolling/rolling_list/api";

import { getField, updateField } from "vuex-map-fields";
import { debounce } from "lodash";
import moment from "moment";
import { toast } from "vue3-toastify";
import API from "@/rolling/rolling_list/api";
import OrderItemApi from "@/rolling/order_items/api";
import { has } from "xe-utils";
const getDefaultSelectedState = () => {
  return {
    id: null,
    mill_code: null,
    rolling_code: null,
    rolling_dim1: null,
    rolling_dim2: null,
    rolling_dim3: null,
    rolling_dim4: null,
    programmed_start_date: null,
    duration_minutes: null,
    programmed_tonnage: null,
    product_category_code: null,
    flex_form_data: {},
    created_at: null,
    updated_at: null,
    updated_by: null,
    short_code: null,
    product_class_code: null,
    product_type: null,
    semi_size: null,
    rolling_status: null,
    rolling_seq: null,
    week_number: moment().week(),
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
      sortBy: ["rolling_seq"],
      descending: [false],
      
      
      start_date: null,
      end_date: null,
      
    },
    loading: false,
    week_number: moment().week(),
    product_class: null,
    product_type: null,
    product_size: null,
    rolling_status:["Open", "Closed", "Blocked", "Trial"],
    
  },
  tableSelected:[]
};

const getters = {
  getField,
};

const actions = {
  getAll: debounce(({ commit, state }) => {
    commit("SET_TABLE_LOADING", true);

    let fields= []
    let ops= []
    let values= []
        

    if (state.table.rolling_status && state.table.rolling_status.length > 0) {
      fields.push("rolling_status");
      ops.push("in");
      values.push(JSON.stringify(state.table.rolling_status));
    }

    if (state.table.week_number!= null) {
      fields.push("week_number");
      ops.push("eq");
      values.push(state.table.week_number);
    } 

    if (state.table.product_size!= null) {
      fields.push("product_size_id");
      ops.push("eq");
      values.push(state.table.product_size);
    }


    // if (state.table.product_class!= null) {      

    //   fields.push("product_type");
    //   ops.push("eq");
    //   values.push(state.table.product_class);
    // }

    // if (state.table.product_type!= null) {
    //   fields.push("product_category_id");
    //   ops.push("eq");
    //   values.push(state.table.product_type);
    // }

    if (fields.length > 0) {
      state.table.options.fields = fields;
      state.table.options.ops = ops;
      state.table.options.values = values;
    }else{
      delete state.table.options.fields;
      delete state.table.options.ops;
      delete state.table.options.values;
    }


    
    return RollingApi.getAll(state.table.options)
      .then((response) => {
        commit("SET_TABLE_LOADING", false);
        commit("SET_TABLE_ROWS", response.data);
        console.log(response.data);
        
      })
      .catch(() => {
        commit("SET_TABLE_LOADING", false);
      });
  }, 200),
  exportRolling({ commit, dispatch }, export_type){
    // 指定导出方式，默认就是导出到本地
    let export_tp = export_type || 'local';

    let fields= []
    let ops= []
    let values= []

    if (state.table.rolling_status && state.table.rolling_status.length > 0) {
      fields.push("rolling_status");
      ops.push("in");
      values.push(JSON.stringify(state.table.rolling_status));
    }

    if (state.table.week_number!= null) {
      fields.push("week_number");
      ops.push("eq");
      values.push(state.table.week_number);
    }


    if (state.table.product_class!= null) {

      fields.push("product_class.code");
      ops.push("eq");
      values.push(state.table.product_class);
    }

    if (state.table.product_type!= null) {
      fields.push("product_category_id");
      ops.push("eq");
      values.push(state.table.product_type);
    }

    if (fields.length > 0) {
      state.table.options.fields = fields;
      state.table.options.ops = ops;
      state.table.options.values = values;
    }else{
      delete state.table.options.fields;
      delete state.table.options.ops;
      delete state.table.options.values;
    }
    if (export_tp == 'ftp') {
      return API.exportToFTP(state.table.options).then(() => {
        toast.success("Rolling exported to ftp successfully!", { position: "bottom-center" })
      }).catch((err) => {
        toast.error(err?.response?.data?.detail || "Rolling exported failed", { autoClose: 60000 }
    )
      });
    } else {
      return API.export(state.table.options);
    }
  },

  createEditShow({ commit }, Rolling) {
    commit("SET_DIALOG_CREATE_EDIT", true);
    if (Rolling) {
      commit("SET_SELECTED", Rolling);
      commit("SET_IS_EDIT_FLAG", true);
    } else {
      commit("SET_IS_EDIT_FLAG", false);
    }
  },
  removeShow({ commit, dispatch }, Rolling) {
    return dispatch('hasOrderItem', Rolling).then((hasItem) => {
      if (hasItem) {
        toast.error("Rolling deleted failed, this Rolling has OrderItem", { autoClose: 60000 }
    )
      } else {
        commit("SET_DIALOG_DELETE", true);
        commit("SET_SELECTED", Rolling);
      }
    });
  },
  hasOrderItem({ commit, dispatch }, Rolling) {
    return OrderItemApi.hasOrderItem(Rolling.id).then((response) => {
      return response.data;
    });
  },
  closeCreateEdit({ commit }) {
    commit("SET_DIALOG_CREATE_EDIT", false);
    commit("RESET_SELECTED");
  },
  closeRemove({ commit }) {
    commit("SET_DIALOG_DELETE", false);
    commit("RESET_SELECTED");
  },
  setSelected({ commit }, item) {
    commit("SET_SELECTED", item);
  },
  setSelectedFormDataAndSave({ dispatch }, value) {
    if (value) {
      return dispatch("setSelected", value).then(() => {
        dispatch("save");
      });
    } else {
      return dispatch("save");
    }
  },
  save({ commit, state, dispatch }) {
    if (!state.isEditFlag) {
      return RollingApi.create(state.selected)
        .then(() => {
          dispatch("closeCreateEdit");
          dispatch("getAll");
          toast.success("Rolling created successfully!", { position: "bottom-center" })
        })
        .catch((err) => {
          toast.error(err?.response?.data?.detail || "Rolling created failed", { autoClose: 60000 }
    )
        });
    } else {
      return RollingApi.update(state.selected.id, state.selected)
        .then(() => {
          dispatch("closeCreateEdit");
          dispatch("getAll");
          toast.success("Rolling updated successfully!", { position: "bottom-center" })
        })
        .catch((err) => {
          toast.error(err?.response?.data?.detail || "Rolling updated failed", { autoClose: 60000 }
    )
        });
    }
  },
  remove({ commit, dispatch }) {
    return RollingApi.delete(state.selected.id)
      .then(function () {
        dispatch("closeRemove");
        dispatch("getAll");
        toast.success("Rolling deleted successfully!", { position: "bottom-center" })
      })
      .catch((err) => {
        toast.error(err?.response?.data?.detail || "Rolling deleted failed", { autoClose: 60000 }
    )
      });
  },
  import_file({ commit, dispatch }, e){
    if (e && e.target.files[0]){
      const file = e.target.files[0]
      const maxSize = 50 * 1024 * 1024;
      if (file && file.size > maxSize) {
        toast.info("The file size cannot exceed 50MB！", { position: "bottom-center" })
        return false
      }

      const formData = new FormData();
      formData.append('file', file);
      return RollingApi.import(formData).then(
        function (res) {
          dispatch("getAll");
          const import_text = "Import Success Sum: " + res.data.success_sum + "; Repeat Sum:" + res.data.repeat_sum
          toast.success(import_text, {
            position: "bottom-center"
          });
        }
      ).catch(res => {
        toast.error(res?.response?.data?.data?.tip || "Import Fail", { autoClose: 60000 });
      }).finally(

      )
    }

  },
};

const mutations = {
  updateField,
  SET_SELECTED(state, value) {
    state.selected = Object.assign(state.selected, value);
  },
  SET_IS_EDIT_FLAG(state, value) {
    state.isEditFlag = value;
  },
  SET_TABLE_LOADING(state, value) {
    state.table.loading = value;
  },
  SET_TABLE_ROWS(state, value) {
    state.table.rows = value;
  },
  SET_DIALOG_CREATE_EDIT(state, value) {
    state.dialogs.showCreateEdit = value;
  },
  SET_DIALOG_DELETE(state, value) {
    state.dialogs.showRemove = value;
  },
  RESET_SELECTED(state) {
    state.selected = Object.assign(state.selected, getDefaultSelectedState());
    state.isEditFlag = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
