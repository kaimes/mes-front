import MessageLogApi from "@/message_log/api";
import { getField, updateField } from "vuex-map-fields";
import { debounce } from "lodash";

const getDefaultSelectedState = () => ({
  type: null,
  message_id: null,
  message: null,
  interact: null,
  message_json: null,
  message_status: null,
  created_at: null,
});

const state = {
  isEditFlag: false,
  hideColumns: ["is_deleted", "updated_by"],
  selected: getDefaultSelectedState(),
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
      message_id: null,
    },
    loading: false,
  },
  table_title: {
    type: 'Message Type',
    message_id: 'Message ID',
    message: 'Message',
    message_json: 'Message Json',
    message_status: 'Status',
    interact: 'Message Interact',
    created_at: 'Created At',
  }
};

const getters = {
  getField,
};

const actions = {
  getAll: debounce(({ commit, state }) => {
    commit("SET_TABLE_LOADING", true);
    return MessageLogApi.getAll(state.table.options)
      .then((response) => {
        commit("SET_TABLE_LOADING", false);
        commit("SET_TABLE_ROWS", response.data);
      })
      .catch(() => {
        commit("SET_TABLE_LOADING", false);
      });
  }, 200),
repeatItem: ({ commit, state }, payload) => {
    console.log('Dispatching repeatItem action', payload); // 添加这行
    return MessageLogApi.repeat(payload)
        .then((response) => {
            if (response.data.success) {
                commit("SET_TABLE_LOADING", true);
                commit("SET_TABLE_ROWS", response.data);
            }
        })
        .catch((error) => {
            commit("SET_TABLE_LOADING", false);
            throw error;
        });
    }

};

const mutations = {
  updateField,
  SET_SELECTED(state, value) {
    state.selected = { ...state.selected, ...value };
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
    state.selected = getDefaultSelectedState();
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



          // return MessageLogApi.getAll(state.table.options)
          //   .then((response) => {
          //     commit("SET_TABLE_LOADING", false);
          //     commit("SET_TABLE_ROWS", response.data);
          //   })
          //   .catch(() => {
          //     commit("SET_TABLE_LOADING", false);
          //   });
