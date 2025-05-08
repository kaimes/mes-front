// import { getField, updateField } from "vuex-map-fields";
import { defineStore } from 'pinia';

import router from "@/router";

const getDefaultSnackbarState = () => {
    return {
        text: null,
        color: "primary",
        show: false,
        timeout: 2000
    };
};

const getDefaulRefreshState = () => {
    return {
        show: false,
        message: "blah"
    };
};

const state = {
    toggleDrawer: true,
    snackbar: {
        ...getDefaultSnackbarState()
    },
    refresh: {
        ...getDefaulRefreshState()
    },
    loading: false
};


const mutations = {
    TOGGLE_DRAWER() {
        this.toggleDrawer = !this.toggleDrawer;
    },
    SET_REFRESH(value) {
        this.refresh = value;
        this.refresh.show = true;
    },
    SET_SNACKBAR(value) {
        value.show = true;
        this.snackbar = Object.assign(getDefaulRefreshState(), value);
    },
    message(text, color = "gray") {
        this.snackbar = Object.assign(getDefaulRefreshState(), { show: true, text, color });
    },
    SET_LOADING(value) {
        this.loading = value;
    },
    RESET_SNACKBAR(state) {
        this.snackbar = Object.assign(this.refresh, getDefaulRefreshState());
    },
    RESET_REFRESH(state) {
        this.refresh = Object.assign(this.refresh, getDefaulRefreshState());
    }
};
const actions = {
    toggleDrawerAction(value) {
        // commit("TOGGLE_DRAWER", value);
        this.TOGGLE_DRAWER(value);
    },
    closeSnackBar(value) {
        // commit("RESET_SNACKBAR", value);
        this.RESET_SNACKBAR(value);
    },
    performRefresh() {
        router.go();
        // commit("RESET_REFRESH");
        this.RESET_REFRESH();
    },
    setLoading(value) {
        // commit("SET_LOADING", value);
        this.SET_LOADING(value);
    },
    ...mutations
};

export const useAppStore = defineStore('app', {
    state: () => {
        return state;
    },
    actions,
});
