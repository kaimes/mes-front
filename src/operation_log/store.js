import OpreationLogApi from "@/operation_log/api";

import { getField, updateField } from "vuex-map-fields";
import { debounce } from "lodash";

const getDefaultSelectedState = () => {
  return {
    id: null,
    request_modular: null,
    request_path: null,
    request_body: null,
    request_method: null,
    request_msg: null,
    request_ip: null,
    response_code: null,
    response_json_result: null,
    response_status: null,
    created_at: null,
    updated_at: null,
    updated_by: null,
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
      sortBy: ["request_modular"],
      descending: [false],
    },
    loading: false,
  },
};

const getters = {
  getField,
};

const actions = {
  getAll: debounce(({ commit, state }) => {
    commit("SET_TABLE_LOADING", true);
    return OpreationLogApi.getAll(state.table.options)
      .then((response) => {
        commit("SET_TABLE_LOADING", false);
        commit("SET_TABLE_ROWS", response.data);
      })
      .catch(() => {
        commit("SET_TABLE_LOADING", false);
      });
  }, 200),
  createEditShow({ commit }, opreationLog) {
    commit("SET_DIALOG_CREATE_EDIT", true);
    if (opreationLog) {
      commit("SET_SELECTED", opreationLog);
      commit("SET_IS_EDIT_FLAG", true);
    } else {
      commit("SET_IS_EDIT_FLAG", false);
    }
  },
  removeShow({ commit }, opreationLog) {
    commit("SET_DIALOG_DELETE", true);
    commit("SET_SELECTED", opreationLog);
  },
  closeCreateEdit({ commit }) {
    commit("SET_DIALOG_CREATE_EDIT", false);
    commit("RESET_SELECTED");
  },
  closeRemove({ commit }) {
    commit("SET_DIALOG_DELETE", false);
    commit("RESET_SELECTED");
  },
  save({ commit, state, dispatch }) {
    if (!state.isEditFlag) {
      return OpreationLogApi.create(state.selected)
        .then(() => {
          dispatch("closeCreateEdit");
          dispatch("getAll");
          commit(
            "app/SET_SNACKBAR",
            { text: "opreationLog created successfully." },
            { root: true }
          );
        })
        .catch((err) => {
          commit(
            "app/SET_SNACKBAR",
            {
              text: "opreationLog not created. Reason: " + err.response.data.detail,
              color: "red",
            },
            { root: true }
          );
        });
    } else {
      return OpreationLogApi.update(state.selected.code, state.selected)
        .then(() => {
          dispatch("closeCreateEdit");
          dispatch("getAll");
          commit(
            "app/SET_SNACKBAR",
            { text: "opreation log updated successfully." },
            { root: true }
          );
        })
        .catch((err) => {
          commit(
            "app/SET_SNACKBAR",
            {
              text: "opreation log not updated. Reason: " + err.response.data.detail,
              color: "red",
            },
            { root: true }
          );
        });
    }
  },
  remove({ commit, dispatch }) {
    return OpreationLogApi.delete(state.selected.code)
      .then(function () {
        dispatch("closeRemove");
        dispatch("getAll");
        commit(
          "app/SET_SNACKBAR",
          { text: "opreation log deleted successfully." },
          { root: true }
        );
      })
      .catch((err) => {
        commit(
          "app/SET_SNACKBAR",
          {
            text:
              "opreation log not deleted. Reason: Related data cannot be deleted",
            color: "red",
          },
          { root: true }
        );
      });
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
