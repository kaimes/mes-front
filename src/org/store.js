import OrgApi from '@/org/api';

import { getField, updateField } from 'vuex-map-fields';
import { debounce } from 'lodash';
import {toast} from "vue3-toastify";

const getDefaultSelectedState = () => {
    return {
        id: null,
        code: null,
        org_type: '',
        org_setting: {},

        callback_url: null,

        team_flex_form_schema: {},
        worker_flex_form_schema: {},
        job_flex_form_schema: {},
        order_flex_form_schema: {},
        default_team_flex_form_data: {},
        default_worker_flex_form_data: {},
        default_job_flex_form_data: {},
        default_order_flex_form_data: {},
  
        msg_template: {},
        work_calendar: {},
        max_nbr_workers: 0,
        max_nbr_teams: 0,
        max_nbr_jobs: 0,
        worker_count: 0,
        team_count: 0,
        job_count: 0,
        zulip_is_active: false,
        callback_is_active: false,
        zulip_site: '',
        zulip_user_name: '',
        zulip_password: '',
        created_at: null,
        updated_at: null,
        loading: false,

        status_list: [
            { text: 'Avaiable', value: 'Avaiable' },
            { text: 'Stopped', value: 'Stopped' },
            { text: 'Expired', value: 'Expired' }
        ]
    };
};
const state = {
    selected: {
        ...getDefaultSelectedState()
    },
    register_code: '',
    dialogs: {
        showRemove: false,
        showCreateEdit: false
    }
};

const getters = {
    getField
};

const actions = {
    showCreateEditDialog({ commit }) {
        commit('SET_DIALOG_CREATE_EDIT', true);
    },
    closeCreateEditDialog({ commit }) {
        commit('SET_DIALOG_CREATE_EDIT', false);
        commit('SET_REGISTER_CODE', '');
    },
    getOrg: ({ commit, state }) => {
        return OrgApi.getAll().then(response => {
            commit('SET_SELECTED', response.data);
        });
    },
    removeShow({ commit, state }) {
        commit('SET_DIALOG_DELETE', true);
    },
    closeRemove({ commit }) {
        commit('SET_DIALOG_DELETE', false);
    },
    addUserOrg({ commit }, param) {
        if (param) {
            return OrgApi.add_user_org(param)
                .then(response => {
                    commit('SET_REGISTER_CODE', response.data['register_code']);
                    commit(
                        'app/SET_SNACKBAR',
                        { text: 'register code created successfully.' },
                        { root: true }
                    );
                })
                .catch(err => {
                    commit(
                        'app/SET_SNACKBAR',
                        {
                            text:
                                'addUserOrg error. Reason: ' +
                                JSON.stringify(err.response.data.detail),
                            color: 'red'
                        },
                        { root: true }
                    );
                });
        }
    },
    save({ commit, dispatch }, params = {}) {
        if (!state.selected.id) {
            return OrgApi.create(state.selected)
                .then(() => {
                    dispatch('getOrg');
                    toast.success("Setting created successfully.", {
                        position: "bottom-center",
                    });
                })
                .catch(res => {
                    toast.error(res?.response?.data?.detail || "Create Fail", { autoClose: 60000 });
                });
        } else {
            return OrgApi.update(state.selected.id, {
              ...state.selected,
              ...params,
            })
                .then(() => {
                    dispatch('getOrg');
                    toast.success("Setting is updated successfully.", {
                        position: "bottom-center",
                    });
                })
                .catch(res => {
                    toast.error(res?.response?.data?.detail || "Update Fail", { autoClose: 60000 });
                });
        }
    },
    copy_back({ commit }, flag) {
        if (flag) {
            toast.info("Copied", {
                position: "bottom-center",
            });
        } else {
            toast.info("Can not copy", {
                position: "bottom-center",
            });
        }
    },
    remove({ commit, dispatch }) {
        return OrgApi.delete(state.selected.id)
            .then(function () {
                dispatch('closeRemove');
                commit('RESET_SELECTED');
                toast.success("Deleted successfully.", {
                    position: "bottom-center",
                });
            })
            .catch(res => {
                toast.error(res?.response?.data?.detail || "Delete Fail", { autoClose: 60000 });
            });
    }
};

const mutations = {
    updateField,
    SET_SELECTED(state, value) {
        state.selected = Object.assign(state.selected, value);
    },
    SET_DIALOG_DELETE(state, value) {
        state.dialogs.showRemove = value;
    },
    RESET_SELECTED(state) {
        state.selected = getDefaultSelectedState();
    },
    SET_DIALOG_CREATE_EDIT(state, value) {
        state.dialogs.showCreateEdit = value;
    },
    SET_REGISTER_CODE(state, value) {
        state.register_code = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
