import jwt_decode from "jwt-decode";
import router from "@/router/index";
import {differenceInMilliseconds, fromUnixTime, subMinutes} from "date-fns";
import {getField, updateField} from "vuex-map-fields";
import {debounce} from "lodash";
import { toast } from "vue3-toastify";
import {setToken} from "@/util/util";
import {deleteUserCache} from "@/hooks/useCache";
import Util from "@/util";

import UserApi from "./api";

const DEFAULT_LOGIN_PATH = "/teams";

const orgStatusFormat = status => {
  let val = null;
  switch (status) {
    case "1":
      val = "Avaiable";
      break;
    case "2":
      val = "Stopped";
      break;
    case "3":
      val = "Expired";
      break;
    default:
      break;
  }
  return val;
};

const getDefaultSelectedState = () => {
  return {
    id: null,
    email: null,
    role: null,
    loading: false,
    default_team_id: null,
    team: null,
    managed_teams: null,
    is_active: false
  };
};

const getDefaultorg = () => {
  return {
    code: null,
    id: null,
    en_code: null
  };
};

const state = {
  status: {loggedIn: false},
  userInfo: {
    show_bottom_note: true
  },
  defaultTeam: null,
  defaultMillCode: null,
  accessToken: null,
  selected: {
    ...getDefaultSelectedState()
  },
  menuData: [],
  org: {...getDefaultorg()},
  dialogs: {
    showEdit: false,
    showAdd: false,
    showCreateEdit: false,
    showRemove: false,
    dialogRunBatchDialog: false // Run Batch btn dialog
  },
  table: {
    rows: {
      items: [],
      total: null
    },
    options: {
      q: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: ["updated_at"],
      descending: [true]
    },
    loading: false
  },
  defaultPermission: ["Owner", "Planner"],
  permissionDict: {
    "job.button.start": ["Owner", "Planner", "Worker"],
    "job.button.finish": ["Owner", "Planner", "Worker"],
    "job.button.customer_approve": ["Owner", "Planner", "Customer"],
    "job.button.planner_approve": ["Owner", "Planner"],
    "job.button.save": ["Owner", "Planner"],
    "location.button.customer_create_job": ["Customer"]
  },
  organizationStatus: "", // Organization状态
  isShowOrganizationTAB: false, // 是否是云市场单点进来的或者从系统进来没有关联实例
  instance_id: "", // instance_id
  marketUrlParams: {}, // 从云市场跳过来的时候的路径参数
  count: 0, // 点击tips弹窗的次数，默认只弹窗一次
  loginLoadingBtn: false, // 登录按钮的加载
  jobsRestData: {}, // 点击头像获取的jobsRestData的数据
  jobsWaringDialogFlag: false, // 登录默认Jobs提醒弹窗
  alertJob: false // 这个用于 控制展示  计量弹出框的
  // jobsTimer: null
};

const actions = {


  // 获取当前用户Organization状态
  getOrganizationStatus({commit, state, dispatch}) {
    UserApi.getOrganization({user_id: state.userInfo.default_team_id})
      .then(res => {
        const {organization_status} = res.data.data;
        if (organization_status == "2" || organization_status == "3") {
          commit("SET_DIALOG_SHOW_BATCH", true);
        }
        commit("SET_ORGANIZATION_STATUS", orgStatusFormat(organization_status));
      })
      .catch(err => {
        console.log("err....", err);
      });
  },

  // login的时候获取当前用户Organization状态,如果状态失效需要tips提示
  getLoginOrganizationStatus({commit, dispatch, state}, payload) {
    commit("SET_LOGIN_BTN_LOADING", true);
  },

  getUserInfo({commit, state, dispatch}) {
    commit("org/SET_SELECTED", null, {root: true});
    UserApi.getUserInfo()
      .then(function (res) {
        commit("SET_USER_INFO", res.data);
        commit("SET_DEFAULT_MILL_CODE", res.data.current_mill_code || '');
        localStorage.setItem("defaultMillId", res.data.current_mill_id || '');
      })
      .catch(err => {
        console.error("Failed to get user information, please Retry.", err);
      });
  },
  getAll: debounce(({commit, state}) => {
    commit("SET_TABLE_LOADING", true);

    return UserApi.getAll(state.table.options).then(response => {
      commit("SET_TABLE_LOADING", false);
      commit("SET_TABLE_ROWS", response.data);
    });
  }, 200),
  editShow({commit}, plugin) {
    commit("SET_DIALOG_EDIT", true);
    if (plugin) {
      commit("SET_SELECTED", plugin);
    }
  },
  closeEdit({commit}) {
    commit("SET_DIALOG_EDIT", false);
    commit("RESET_SELECTED");
  },
  addShow({commit}, plugin) {
    commit("SET_DIALOG_ADD", true);
  },
  closeAdd({commit}) {
    commit("SET_DIALOG_ADD", false);
    commit("RESET_SELECTED");
  },
  saveOrg({commit}) {
    if (state.org.code) {
      return UserApi.create_org(state.org)
        .then(response => {
          commit("SET_ORG_EN_CODE", response.data);
          commit("SET_DIALOG_CREATE_EDIT", false);
          commit(
            "app/SET_SNACKBAR",
            {text: "org created successfully."},
            {root: true}
          );
        })
        .catch(err => {
          commit(
            "app/SET_SNACKBAR",
            {
              text: "org not created. Reason: " + err.response.data.detail,
              color: "red"
            },
            {root: true}
          );
        });
    }
  },
  save: debounce(({commit, dispatch}, param) => {
    console.log("time: ", new Date().getTime());
    if (!state.selected.id) {
      return UserApi.create(Object.assign(state.selected, param))
        .then(() => {
          dispatch("closeAdd");
          dispatch("getAll");
          commit(
            "app/SET_SNACKBAR",
            {text: "User created successfully."},
            {root: true}
          );

        })
        .catch(err => {
          commit(
            "app/SET_SNACKBAR",
            {
              text: "User not created. Reason: " + err.response?.data?.detail,
              color: "red"
            },
            {root: true}
          );
        });
    } else {
      return UserApi.update(state.selected.id, Object.assign(state.selected, param))
        .then(() => {
          if (param.password && param.is_me) {
            dispatch("basicLogin", Object.assign(state.selected, param));
          }
          dispatch("closeEdit");
          dispatch("getAll");
          commit(
            "app/SET_SNACKBAR",
            {text: "User updated successfully."},
            {root: true}
          );
        })
        .catch(err => {
          commit(
            "app/SET_SNACKBAR",
            {
              text: "User not updated. Reason: " + err.response.data.detail,
              color: "red"
            },
            {root: true}
          );
        });
    }
  }, 500),
  remove({commit, dispatch}) {
    return UserApi.delete(state.selected.id)
      .then(function () {
        dispatch("closeRemove");
        dispatch("getAll");
        commit("app/SET_SNACKBAR", {text: "User deleted successfully."}, {root: true});
      })
      .catch(err => {
        commit(
          "app/SET_SNACKBAR",
          {
            text: "User not deleted. Reason: " + err.response.data.detail,
            color: "red"
          },
          {root: true}
        );
      });
  },
  loginRedirect({state}, redirectUri) {
    let redirectUrl = new URL(redirectUri);
    void state;
    router.push({path: redirectUrl.pathname});
  },
  // 基础登录
  basicLogin({commit, dispatch}, payload) {
    UserApi.login(payload.email, payload.password)
      .then(function (res) {
        commit("SET_USER_LOGIN", res.data.data.token);
        commit("SET_INSTANCE_ID", res.data.data.instance_id);
        dispatch("getUserInfo"); // 获取当前用户信息
        dispatch("getOrganizationStatus");
        router.push({path: DEFAULT_LOGIN_PATH});
      })
      .catch(err => {
        commit(
          "app/SET_SNACKBAR",
          {text: err.response.data.data.detail, color: "red"},
          {root: true}
        );
      });
  },
  clearToken({commit}) {
    commit("SET_USER_LOGOUT");
  },
  // 用户弹窗LOGIN时的basic登陆
  tabBasicLogin({commit, dispatch}, payload) {
    if (!payload.email.length) {
      toast.error("Email cannot be empty!", {
        position: "bottom-center",
        autoClose: 60000
      });
      return;
    }

    if (!payload.password.length) {
      toast.error("Password cannot be empty!", {
        position: "bottom-center",
        autoClose: 60000
      });
      return;
    }

    dispatch("clearToken").then(() => {
      UserApi.login(payload.email, payload.password)
        .then(function (res) {
          if (res.data.status === 1) {
            dispatch("getLoginOrganizationStatus", {
              instance_id: res.data.data.instance_id
            });

            commit("SET_USER_LOGIN", res.data.data.token);
            dispatch("getUserInfo"); // 获取当前用户信息
            commit("SET_INSTANCE_ID", res.data.data.instance_id);

            /**
             * 用户通过ED登录页登录，ED需识别到当前用户信息为通过云市场申请的实例
             * 且判断当前用户是否完成了初始化配置，如果没有，弹下框进行初始化配置
             //  *  */
            //
            if (res.data.data.is_first_login == 1) {
              commit("SET_IS_SHOW_ORGANAZATION_TAB", true);
            } else {
              dispatch("getLoginOrganizationStatus", {
                instance_id: res.data.data.instance_id
              });
            }
          } else {
            toast.error(res?.data?.message || "Login Fail", {
              position: "bottom-center",
              autoClose: 60000
            });
          }
        })
        .catch(err => {
          toast.error(res?.response?.data || "Login Fail", {
            position: "bottom-center",
            autoClose: 60000
          });
          console.error("Login Error....", err);
        });
    });
  },

  // 用户注册
  register({dispatch, commit}, payload) {
    return UserApi.register(payload)
      .then(function () {
        toast.success("Register Success", {
          position: "bottom-center"
        });
        dispatch("basicLogin", payload);
        commit("SET_ORG_EN_CODE", "");
      })
      .catch(err => {
        toast.error(err?.response?.data?.detail || "Register Error", {
          position: "bottom-center",
          autoClose: 60000
        });
      });
  },
  login({dispatch, commit}, payload) {
    commit("SET_USER_LOGIN", payload.token);
    dispatch("getUserInfo"); // 获取当前用户信息
    // dispatch("loginRedirect", payload.redirectUri).then(() => {
    //   dispatch("createExpirationCheck");
    // });
  },
  //清除所有cookie函数
  clearAllCookie({dispatch, commit}, payload) {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;)
        document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
    }
  },

  logout({commit, dispatch}) {
    UserApi.logout().then(() => {
      commit("SET_USER_LOGOUT");
      dispatch("clearAllCookie");
      router.replace({path: "/login"});
    }).catch((err) => {
      commit("SET_USER_LOGOUT");
      dispatch("clearAllCookie");
      router.replace({path: "/login"});
    });
  },
  createExpirationCheck({state, commit}) {
    // expiration time minus 10 min
    let expire_at = subMinutes(fromUnixTime(state.userInfo.exp), 10);
    let now = new Date();

    setTimeout(function () {
      commit(
        "app/SET_REFRESH",
        {
          show: true,
          message: "Your credentials have expired. Please refresh the page."
        },
        {root: true}
      );
    }, differenceInMilliseconds(expire_at, now));
  },
  removeShow({commit}, data) {
    commit("SET_DIALOG_DELETE", true);
    commit("SET_SELECTED", data);
  },
  closeRemove({commit}) {
    commit("SET_DIALOG_DELETE", false);
    commit("RESET_SELECTED");
  },

  // 用户organization 初始化登陆
  organizationLogin({commit, dispatch}, payload) {
    const {organization_code, username, password} = payload;
    const instance_id = state.instance_id;
    if (!organization_code.length) {
      commit(
        "app/SET_SNACKBAR",
        {text: "Organization Code cannot be empty!", color: "red"},
        {root: true}
      );
      return;
    }
    if (!username.length) {
      commit(
        "app/SET_SNACKBAR",
        {text: "Organization Owner Name cannot be empty!", color: "red"},
        {root: true}
      );
      return;
    }
    if (!password.length) {
      commit(
        "app/SET_SNACKBAR",
        {text: "Password cannot be empty!", color: "red"},
        {root: true}
      );
      return;
    }

    UserApi.getOrganizationLogin({
      organization_code,
      username,
      password,
      instance_id
    })
      .then(function (res) {
        console.log("object....", res);
        if (res.data.code == 200) {
          commit("SET_USER_LOGIN", res.data.data.token);
          dispatch("getUserInfo"); // 获取当前用户信息
          dispatch("getOrganizationStatus");
          router.push({path: DEFAULT_LOGIN_PATH});
        } else {
          commit(
            "app/SET_SNACKBAR",
            {text: res.data.msg, color: "red"},
            {root: true}
          );
        }
      })
      .catch(err => {
        commit(
          "app/SET_SNACKBAR",
          {text: err.response.data.msg, color: "red"},
          {root: true}
        );
      });
  },

  // user organization Create  init
  organizationCreate({commit, dispatch, state}, payload) {
    const {organization_code, username, password, confirmPassword} = payload;
    const instance_id = state.instance_id;
    if (!organization_code.length) {
      commit(
        "app/SET_SNACKBAR",
        {text: "Organization Code cannot be empty!", color: "red"},
        {root: true}
      );
      return;
    }
    if (!username.length) {
      commit(
        "app/SET_SNACKBAR",
        {text: "Username cannot be empty!", color: "red"},
        {root: true}
      );
      return;
    }

    if (!password.length) {
      commit(
        "app/SET_SNACKBAR",
        {text: "Password cannot be empty!", color: "red"},
        {root: true}
      );
      return;
    }

    if (password !== confirmPassword) {
      // 需确认两次密码一致
      commit(
        "app/SET_SNACKBAR",
        {text: "The two passwords must be the same!", color: "red"},
        {root: true}
      );
      return;
    }

    UserApi.getOrganizationCreate({
      organization_code,
      username,
      password,
      instance_id
    })
      .then(function (res) {
        if (res.data.code == 200) {
          commit("SET_USER_LOGIN", res.data.data.token);
          dispatch("getUserInfo"); // 获取当前用户信息
          dispatch("getOrganizationStatus");
          if (window.location.pathname == "/login_billing") {
            router.push({path: "/my_order"});
          } else {
            router.push({path: DEFAULT_LOGIN_PATH});
          }
        } else {
          commit(
            "app/SET_SNACKBAR",
            {text: res.data.detail || res.data.msg, color: "red"},
            {root: true}
          );
        }
      })
      .catch(err => {
        console.log("err.....", err);
        commit(
          "app/SET_SNACKBAR",
          {text: err.response.data.detail || err.response.data.msg, color: "red"},
          {root: true}
        );
      });
  }
};

const mutations = {
  updateField,

  // 登录时的Jobs任务量弹窗
  SET_JOBS_STATUS_WARING_DIALOG(state, val) {
    state.jobsWaringDialogFlag = val;
  },

  // 同步Jobs 当前license剩余时间及用量
  SET_JOBS_LICENCE_REST_DATA(state, val) {
    state.jobsRestData = val;
  },
  // 同步修改Organization
  SET_ORGANIZATION_STATUS(state, val) {
    state.organizationStatus = val;
    localStorage.setItem("organizationStatus", val);
  },
  // 是否需要展示关联实例TAB
  SET_IS_SHOW_ORGANAZATION_TAB(state, val) {
    state.isShowOrganizationTAB = val;
  },
  // instance_id 更新
  SET_INSTANCE_ID(state, val) {
    state.instance_id = val;
    localStorage.setItem("instance_id", val);
  },
  // 设置menu数据
  SET_MENU_DATA(state, value) {
    state.menuData = value;
  },
  // 失效弹窗Tips 计数器
  SET_TIPS_COUNT(state, val) {
    state.count = val;
  },

  SET_ALERT_JOB(state, val) {
    state.alertJob = val;
  },
  // 登录按钮的加载状态
  SET_LOGIN_BTN_LOADING(state, val) {
    state.loginLoadingBtn = val;
  },
  SET_DIALOG_SHOW_BATCH(state, value) {
    state.dialogs.dialogRunBatchDialog = value;
  },

  SET_DIALOG_DELETE(state, value) {
    state.dialogs.showRemove = value;
  },
  SET_SELECTED(state, value) {
    state.selected = Object.assign(state.selected, value);
  },
  SET_TABLE_LOADING(state, value) {
    state.table.loading = value;
  },
  SET_TABLE_ROWS(state, value) {
    state.table.rows = value;
  },
  SET_DIALOG_EDIT(state, value) {
    state.dialogs.showEdit = value;
  },
  SET_DIALOG_ADD(state, value) {
    state.dialogs.showAdd = value;
  },
  RESET_SELECTED(state) {
    state.selected = Object.assign(state.selected, getDefaultSelectedState());
  },
  SET_USER_INFO(state, info) {
    state.userInfo = info;
  },
  SET_DEFAULT_MILL_CODE(state, code) {
    state.defaultMillCode = code;
    localStorage.setItem("defaultMillCode", code)
  },
  SET_DEFAULT_TEAM(state, info) {
    state.defaultTeam = info;
  },

  SET_USER_LOGIN(state, accessToken) {
    state.accessToken = accessToken;
    state.status = {loggedIn: true};
    state.userInfo = jwt_decode(accessToken);
    setToken(accessToken);
  },

  SET_USER_LOGOUT(state) {
    state.status = {loggedIn: false};
    state.userInfo = {};
    state.accessToken = null;
    deleteUserCache();
  },
  SET_DIALOG_CREATE_EDIT(state, value) {
    state.dialogs.showCreateEdit = value;
  },
  SET_ORG_EN_CODE(state, info) {
    state.org.en_code = info;
  }
};

const getters = {
  getField,
  accessToken: () => state.accessToken,
  email: () => state.userInfo.email,
  exp: () => state.userInfo.exp,
  getPermission: state => p => {
    let localPermission = state.defaultPermission;
    if (p in state.permissionDict) {
      localPermission = state.permissionDict[p];
    }
    // console.log(p, localPermission)
    if (state.userInfo) {
      return localPermission.includes(state.userInfo.role);
    } else {
      return false;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
