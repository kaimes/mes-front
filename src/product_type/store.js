import ProductTypeApi from "@/product_type/api";
import { toast } from "vue3-toastify";
import { getField, updateField } from "vuex-map-fields";
import { debounce } from "lodash";
import { log } from "@openid/appauth";

const getDefaultSelectedState = () => {
  return {
    id: null,
    mill: null,
    mill_id: null,
    mill_code: null,
    tolerance: null,
    tolerance_code: null,
    code: null,
    type: null,
    desc: null,
    longitude: null,
    latitude: null,
    dim1: null,
    dim2: null,
    dim3: null,
    dim4: null,
    product_type_yield: null,
    product_category_code: null,
    product_category: null,
    product_class: null,
    product_class_code: null,
    flex_form_data: {},
    flange_thickness: null,
    flange_thickness_1:null,
    flange_thickness_2:null,
    flange_thickness_3:null,
    flange_thickness_4:null,
    flange_thickness_5:null,
    web_thickness: null,
    flange_height: null,
    flange_height_1:null,
    flange_height_2:null,
    flange_height_3:null,
    flange_height_4:null,
    flange_height_5:null,
    depth_d: null,
    width_b: null,
    width_b_1: null,
    width_b_2: null,
    mass: null,
    root_radius: null,
    updated_at: null,
    updated_by: null,
    roughing_xsect: null,
    cogging_xsect: null,
    cogging_web: null,
    saw_crops_front: null,
    shear_loss: null,
    max_shear_length: null,
    control_roll: null,
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
      sortBy: ["dim3"],
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
    return ProductTypeApi.getAll(state.table.options)
      .then((response) => {
        commit("SET_TABLE_LOADING", false);
        console.log(response.data);
        
        if (response.data?.items?.length > 0) {
          const itemsWithCodes = response.data.items.map(item => ({
            ...item,
            mill_code: item.mill?.code,
            product_category_code: item.product_category?.code,
            product_class_code: item.product_class?.code,
            tolerance_code: item.tolerance?.code
          }));
          commit("SET_TABLE_ROWS", { ...response.data, items: itemsWithCodes });
          // commit("SET_TABLE_ROWS", { ...response.data, items: itemsWithCodes });
          // that.SET_TABLE_ROWS({ ...response.data, items: itemsWithCodes });
        }
        else {
          commit("SET_TABLE_ROWS", { ...response.data});
        }
        
      })
      .catch(() => {
        commit("SET_TABLE_LOADING", false); 
      });
  }, 200),
  createEditShow({ commit }, ProductType) {
    commit("SET_DIALOG_CREATE_EDIT", true);
    if (ProductType) {
      commit("SET_SELECTED", ProductType);
      commit("SET_IS_EDIT_FLAG", true);
    } else {
      commit("SET_IS_EDIT_FLAG", false);
    }
  },
  removeShow({ commit }, ProductType) {
    commit("SET_DIALOG_DELETE", true);
    commit("SET_SELECTED", ProductType);
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
      return ProductTypeApi.create(state.selected)
        .then(() => {
          dispatch("closeCreateEdit");
          dispatch("getAll");
          commit(
            "app/SET_SNACKBAR",
            { text: "ProductType created successfully." },
            { root: true }
          );

          toast.success("Section Weight created successfully.", {position: "bottom-center"})
        })
        .catch((err) => {
          commit(
            "app/SET_SNACKBAR",
            {
              text: "Section Weight not created. Reason: " + err.response.data.detail,
              color: "red",
            },
            { root: true }

            
          );
          toast.error("Section Weight not created. Reason: " + err.response.data.detail, { autoClose: 60000 })
        });
    } else {
      return ProductTypeApi.update(state.selected.id, state.selected)
        .then(() => {
          // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
          // console.log(state.selected);
          
          
          dispatch("closeCreateEdit");
          dispatch("getAll");
          // console.log(state.selected);
          
          commit(
            "app/SET_SNACKBAR",
            { text: "product_type updated successfully." },
            { root: true }
          );

          toast.success("Section Weight updated successfully.", {position: "bottom-center"})
        })
        .catch((err) => {
          commit(
            "app/SET_SNACKBAR",
            {
              text: "product_type not updated. Reason: " + err.response.data.detail,
              color: "red",
            },
            { root: true }
          );

          toast.error("Section Weight not updated. Reason: " + err.response.data.detail, { autoClose: 60000 })
        });
    }
  },
  remove({ commit, dispatch }) {
    return ProductTypeApi.delete(state.selected.id)
      .then(function () {
        dispatch("closeRemove");
        dispatch("getAll");
        commit(
          "app/SET_SNACKBAR",
          { text: "product_type deleted successfully." },
          { root: true }
        );

        toast.success("Section Weight deleted successfully.", {position: "bottom-center"})
      })
      .catch((err) => {
        commit(
          "app/SET_SNACKBAR",
          {
            text:
              "product_type not deleted. Reason: Related data cannot be deleted",
            color: "red",
          },
          { root: true }
        );
        toast.error("Section Weight not deleted. Reason: Related data cannot be deleted", { autoClose: 60000 })
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
