import {getField, updateField} from "vuex-map-fields";
import {filter} from "lodash";
import AuthApi from "@/auth/api";
import {useCache, CACHE_KEY} from "@/hooks/useCache";

const { wsCache } = useCache()

const state = {
  toggleDrawer: true,
  menuData: [],
  loading: false
};

const getters = {
  getField
};

const actions = {
  toggleDrawerAction({commit}, value) {
    commit("TOGGLE_DRAWER", value);
  },
  getPermission({commit}) {
    return AuthApi.getPermission().then(res => {
      const { menu, permission } = res.data;
      // 处理visible是true 的数据
      const $menu = filter(menu, ['visible', true]);
      commit("SET_MENU_DATA", $menu);
      // 部分地方还是用storage 先暂时保留该用法
      wsCache.set(CACHE_KEY.PERMISSION, permission);
      localStorage.setItem(
        "menuButtonPermission",
        JSON.stringify(permission)
      );
    });
  },
};

const mutations = {
  updateField,
  TOGGLE_DRAWER(state) {
    state.toggleDrawer = !state.toggleDrawer;
  },
  SET_MENU_DATA(state, menuData) {
    state.menuData = menuData;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
