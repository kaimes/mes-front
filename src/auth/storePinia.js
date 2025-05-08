import {defineStore} from 'pinia';

import jwt_decode from "jwt-decode";
import router from "@/router/index";
import {differenceInMilliseconds, fromUnixTime, subMinutes} from "date-fns";
import {toast} from "vue3-toastify";
import Util from "@/util";
import {setToken} from "@/util/util";
import {useAppStore} from '@/app/storePinia'
import UserApi from "./api";
import RoleApi from "../system_admin/role/api";
import MillApi from "../mill/api";
import permissionUtil from "@/directives/permission/util.permission.js";


const DEFAULT_LOGIN_PATH = "/rolling_list";


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
    is_active: false,
    mill: [],
    show_bottom_note: true
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
  UserPermission: {
    permission: [],
    menu: [],
  },
  roleOptions: [],
  millOptions: [],
  status: {loggedIn: false},
  userInfo: null,
  defaultTeam: null,
  accessToken: null,
  selected: {
    ...getDefaultSelectedState()
  },
  org: {...getDefaultorg()},
  dialogs: {
    isAddFalg: false,
    showEdit: false,
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
      sortBy: ["email"],
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


const mutations = {
  // 登录时的Jobs任务量弹窗
  SET_JOBS_STATUS_WARING_DIALOG(val) {
    this.jobsWaringDialogFlag = val;
  },

  // 同步Jobs 当前license剩余时间及用量
  SET_JOBS_LICENCE_REST_DATA(val) {
    this.jobsRestData = val;
  },
  // 同步修改Organization
  SET_ORGANIZATION_STATUS(val) {
    this.organizationStatus = val;
    localStorage.setItem("organizationStatus", val);
  },
  // 是否需要展示关联实例TAB
  SET_IS_SHOW_ORGANAZATION_TAB(val) {
    this.isShowOrganizationTAB = val;
  },
  // instance_id 更新
  SET_INSTANCE_ID(val) {
    this.instance_id = val;
    localStorage.setItem("instance_id", val);
  },
  // 失效弹窗Tips 计数器
  SET_TIPS_COUNT(val) {
    this.count = val;
  },

  SET_ALERT_JOB(val) {
    this.alertJob = val;
  },
  // 登录按钮的加载状态
  SET_LOGIN_BTN_LOADING(val) {
    this.loginLoadingBtn = val;
  },
  SET_DIALOG_SHOW_BATCH(value) {
    this.dialogs.dialogRunBatchDialog = value;
  },

  SET_DIALOG_DELETE(value) {
    this.dialogs.showRemove = value;
  },
  SET_SELECTED(value) {
    this.selected = Object.assign(this.selected, value);
  },
  SET_TABLE_LOADING(value) {
    this.table.loading = value;
  },
  SET_TABLE_ROWS(value) {
    this.table.rows = value;
  },
  SET_DIALOG_EDIT(value) {
    this.dialogs.showEdit = value;
  },
  RESET_SELECTED() {
    this.selected = Object.assign(this.selected, getDefaultSelectedState());
  },
  SET_USER_INFO(info) {
    console.log("SET_USER_INFO", info)
    this.userInfo = info;
    localStorage.setItem("user_id", info.id);
  },
  SET_DEFAULT_TEAM(info) {
    this.defaultTeam = info;
  },

  SET_USER_LOGIN(accessToken) {
    this.accessToken = accessToken;
    this.status = {loggedIn: true};
    this.userInfo = jwt_decode(accessToken);
    // this.userInfo = {
    //     "default_team_id": 12334,
    //     "alg": "HS256",
    //     "role": "sys",
    //     "exp": 123345324,
    //     "email": "691209942@qq.com",
    // };
    setToken(accessToken);
  },

  SET_USER_LOGOUT() {
    this.status = {loggedIn: false};
    this.userInfo = null;
    this.accessToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("organizationStatus"); // 清除organizationStatus
    localStorage.removeItem("menuButtonPermission");
    permissionUtil.clearCachedMenuData();  // 清除缓存
  },
  SET_DIALOG_CREATE_EDIT(value) {
    this.dialogs.showCreateEdit = value;
  },
  SET_ORG_EN_CODE(info) {
    this.org.en_code = info;
  },
}


const actions = {

  getMillSelect() {
    const that = this;
    this.millOptions = []
    return MillApi.getMillSelect()
      .then((response) => {
        that.millOptions = response.data.options

      })
      .catch(() => {
        that.millOptions = []
      });
  },

  getRoleSelect() {
    const that = this;
    this.roleOptions = []
    return RoleApi.getRoleSelect()
      .then((response) => {
        that.roleOptions = response.data.options
      })
      .catch(() => {
        that.roleOptions = []
      });
  },
  // 获取Jobs的剩余时间及用量

  // 用量提醒不再提示
  postMeteringRemindStatus(payload) {
    UserApi.postMeteringRemind({
      instance_id: this.instance_id,
      ...payload
    });
  },

  // 登陆时获取instance_id
  getInstanceId(payload) {
    // commit("SET_INSTANCE_ID", payload);
    this.SET_INSTANCE_ID(payload);
  },

  // 获取当前用户Organization状态
  getOrganizationStatus() {
    const that = this;
    UserApi.getOrganization({user_id: this.userInfo.default_team_id})
      .then(res => {
        const {organization_status} = res.data.data;
        if (organization_status == "2" || organization_status == "3") {
          that.SET_DIALOG_SHOW_BATCH(true);
        }
        // commit("SET_ORGANIZATION_STATUS", orgStatusFormat(organization_status));
        that.SET_ORGANIZATION_STATUS(orgStatusFormat(organization_status))
      })
      .catch(err => {
        console.log("err....", err);
      });
  },
  getUserInfo() {
    UserApi.getUserInfo()
      .then((res) => {
        this.SET_USER_INFO(res.data);
        router.push({path: res.data.role[0].homepage_path || "/roles"});           // 跳转到首页
      })
      .catch(err => {
        toast.error(err?.response?.data?.detail || "Failed to get user information.", {autoClose: 60000});
      });
  },
  getUserPermission() {
    const that = this;
    UserApi.getPermission()
      .then(function (res) {
        that.UserPermission = res.data
      })
      .catch(err => {
        that.UserPermission = {
          permission: [],
          menu: [],
        }
      });
  },

  showCreateEditDialog(value) {
    // commit("SET_DIALOG_CREATE_EDIT", value);

    this.SET_DIALOG_CREATE_EDIT(value);
  },
  getAll() {
    const that = this;
    that.table.loading = true;
    return UserApi.getAll(state.table.options).then(response => {
      that.table.loading = false;
      console.log(response.data);

      that.SET_TABLE_ROWS(response.data);
    });
  },
  addShow() {

    this.getRoleSelect()
    this.getMillSelect()
    this.dialogs.isAddFalg = true;
    this.SET_DIALOG_EDIT(true);
    this.RESET_SELECTED();
  },
  editShow(plugin) {
    this.getRoleSelect()
    this.getMillSelect()
    this.dialogs.isAddFalg = false;
    this.SET_DIALOG_EDIT(true);
    if (plugin) {
      this.SET_SELECTED(plugin);
    } else {
      this.RESET_SELECTED();
    }
  },
  closeEdit() {
    this.SET_DIALOG_EDIT(false);
    this.RESET_SELECTED();
  },
  saveOrg() {
    const that = this;
    if (that.org.code) {
      return UserApi.create_org(that.org)
        .then(response => {
          // commit("SET_ORG_EN_CODE", response.data);
          // commit("SET_DIALOG_CREATE_EDIT", false);
          that.SET_ORG_EN_CODE(response.data);
          that.SET_DIALOG_CREATE_EDIT(false);
          // commit(
          //     "app/SET_SNACKBAR",
          //     { text: "org created successfully." },
          //     { root: true }
          // );
          that.messageAlert("org created successfully.")

        })
        .catch(err => {
          // commit(
          //     "app/SET_SNACKBAR",
          //     {
          //         text: "org not created. Reason: " + err.response.data.detail,
          //         color: "red"
          //     },
          //     { root: true }
          // );
          that.messageAlert("org not created. Reason: " + err.response.data.detail, 'red')

        });
    }
  },
  save(param) {
    const that = this;
    if (!that.selected.id) {
      return UserApi.create(Object.assign(that.selected, param))
        .then(() => {

          that.closeEdit();
          that.getAll();
          toast.success("User created successfully.", {
            position: "bottom-center"
          });
          if (param.password && param.is_me) {

            that.basicLogin(Object.assign(this.selected, param));
          }
        })
        .catch(err => {
          toast.error(err?.response?.data?.detail || "User created failed.", {autoClose: 60000});
        });
    } else {
      let select_role = Object.values(this.selected.role).reduce(function (pre, cur, index) {
        if (Number.isFinite(cur) && !isNaN(cur)) {
          return [...pre, cur]
        }
        return [...pre, cur.id]
      }, [])
      that.selected.role = select_role

      let select_mill = Object.values(this.selected.mill).reduce(function (pre, cur, index) {
        if (Number.isFinite(cur) && !isNaN(cur)) {
          return [...pre, cur]
        }
        return [...pre, cur.id]
      }, [])
      that.selected.mill = select_mill
      return UserApi.update(that.selected.id, Object.assign(that.selected, param))
        .then(() => {
          if (param.password && param.is_me) {
            that.basicLogin(Object.assign(this.selected, param));
          }

          that.closeEdit();
          that.getAll();
          toast.success("User updated successfully.", {
            position: "bottom-center"
          });

        })
        .catch(err => {
          toast.error(err?.response?.data?.detail || "User updated fail.", {autoClose: 60000});
        });
    }
  },
  remove() {
    //

    const that = this;
    return UserApi.delete(this.selected.id)
      .then(function () {
        that.closeRemove();
        that.getAll();
        toast.success("User deleted successfully.", {
          position: "bottom-center"
        });
      })
      .catch(err => {
        that.closeRemove();
        toast.error(err.response?.data?.detail || "Delete Fail!", {autoClose: 60000});
      });
  },
  // 基础登录
  basicLogin(payload) {

    const that = this;

    UserApi.login(payload.email, payload.password)
      .then(function (res) {
        that.SET_USER_LOGIN(res.data.data.token);
        that.SET_INSTANCE_ID(res.data.data.instance_id);
        that.getUserInfo();
        that.getOrganizationStatus();

        router.push({path: DEFAULT_LOGIN_PATH});
      })
      .catch(err => {
        toast.error(err.response?.data?.detail || "Delete Fail!", {autoClose: 60000});

      });
  },
  clearToken() {
    // commit("SET_USER_LOGOUT");
    this.SET_USER_LOGOUT();

  },
  // 用户注册
  register(payload) {
    return UserApi.register(payload)
      .then(() => {
        toast.success("Register Success", {
          position: "bottom-center"
        });
        this.basicLogin(payload)
      })
      .catch(err => {
        toast.error(err?.response?.data?.detail || "Register Error", {
          position: "bottom-center",
          autoClose: 60000
        });
      });
  },
  // 用户弹窗LOGIN时的basic登陆
  tabBasicLogin(payload) {
    this.clearToken();
    this.SET_LOGIN_BTN_LOADING(true);
    return UserApi.login(payload.email, payload.password)
      .then((res) => {
        const {status, message, data} = res.data
        if (status === 0) {
          toast.error(message || "Login Fail!", {autoClose: 60000});
          return
        }
        if (status === 1) {
          this.SET_USER_LOGIN(data.token);
          this.getUserInfo();
          this.getUserPermission()
          this.SET_INSTANCE_ID(data.instance_id);
        } else {
          toast.error(message || "Login Fail!", {autoClose: 60000});
        }
      })
      .finally(() => {
        this.SET_LOGIN_BTN_LOADING(false);
      })
      .catch(err => {
        toast.error(err.response?.data || "Login Fail!", {autoClose: 60000});
        console.log("err....", err);
        // commit(
        //     "app/SET_SNACKBAR",
        //     { text: err.response.data, color: "red" },
        //     { root: true }
        // );
      });
  },
  login(payload) {
    // commit("SET_USER_LOGIN", payload.token);
    // dispatch("getUserInfo"); // 获取当前用户信息


    this.SET_USER_LOGIN(payload.token);

    this.getUserInfo();
  },
  //清除所有cookie函数
  clearAllCookie(payload) {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;)
        document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
    }
  },

  logout() {
    // commit("SET_USER_LOGOUT");
    this.SET_USER_LOGOUT();

    // TODO npb
    // commit("gantt/RESET_SELECTED", null, { root: true });
    // commit("org/RESET_SELECTED", null, { root: true });

    // dispatch("clearAllCookie");
    this.clearAllCookie();
    router.replace({path: "/login"});
  },
  removeShow(data) {
    // commit("SET_DIALOG_DELETE", true);
    // commit("SET_SELECTED", data);

    this.SET_DIALOG_DELETE(true);
    this.SET_SELECTED(data);

  },
  closeRemove() {
    // commit("SET_DIALOG_DELETE", false);
    // commit("RESET_SELECTED");

    this.SET_DIALOG_DELETE(false);
    this.RESET_SELECTED();

  },

  mesLogin(token){
    console.log("等了");
    

    UserApi.mes_login(token).then((res) => {
      const {status, message, data} = res.data
        if (status === 0) {
          toast.error(message || "Login Fail!", {autoClose: 60000});
          return
        }
        if (status === 1) {
          this.SET_USER_LOGIN(data.token);
          this.getUserInfo();
          this.getUserPermission()
          this.SET_INSTANCE_ID(data.instance_id);
        } else {
          toast.error(message || "Login Fail!", {autoClose: 60000});
        }
      })
      .finally(() => {
        this.SET_LOGIN_BTN_LOADING(false);
      })
      .catch(err => {
        toast.error(err.response?.data || "Login Fail!", {autoClose: 60000});
        console.log("err....", err);
        // commit(
        //     "app/SET_SNACKBAR",
        //     { text: err.response.data, color: "red" },
        //     { root: true }
        // );
      });

  },

  async messageAlert(message, color) {
    const app = useAppStore()
    app.message(message, color)
  },
  ...mutations,
};


const getters = {
  // accessToken: (state) => state.accessToken,
  email: (state) => state.userInfo.email,
  exp: (state) => state.userInfo.exp,
  getPermission: (state) => p => {
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


export const useAuthStore = defineStore('auth', {
  id: 'auth',
  state: () => {
    return state;
  },
  getters,
  actions,
});
