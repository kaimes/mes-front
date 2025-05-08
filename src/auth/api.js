import API from "@/api";

const resource = "/user";

export default {
  getAll(options) {
    return API.get(`${resource}/`, { params: { ...options } });
  },
  get(userId) {
    return API.get(`${resource}/${userId}`);
  },
  update(userId, payload) {
    return API.put(`${resource}/${userId}`, payload);
  },
  create(payload) {
    return API.post(`${resource}/`, payload);
  },
  getUserInfo() {
    return API.get(`/auth/me`);
  },
  getPermission() {
    return API.get(`${resource}/data/get_permission`);
  },
  login(email, password) {
    return API.post(`/auth/login`, { email: email, password: password });
  },
  updatePassword(params) {
    return API.post("/user/update_user_password", params);
  },
  register(userDict) { //email, password, en_code, org_code
    return API.post(`/auth/register`, userDict
      // {
      // email: email,
      // password: password,
      // en_code,
      // org_code,
      // }
    );
  },
  create_org(payload) {
    return API.post(`/auth/register_user_org`, payload);
  },
  delete(id) {
    return API.delete(`${resource}/${id}`);
  },

  // 获取Organization状态
  getOrganization(options) {
    return API.get(`/orgs/organization_status`, {
      params: { ...options },
    });
  },

  // 云市场登录
  getCloudMarketLogin(options) {
    return API.get(`/instance/cloud_market_login`, {
      params: { ...options },
    });
  },
  // organization 首次登录
  getOrganizationLogin(options) {
    return API.get(`/instance/bind_exist_organization`, {
      params: { ...options },
    });
  },
  // organization 创建
  getOrganizationCreate(options) {
    return API.get(`/instance/create_user_organization`, {
      params: { ...options },
    });
  },
  // 计量提醒 
  getMeteringRemind(options) {
    console.log('getMeteringRemind options...', options)
    return API.get(`/instance/metering_remind`, {
      params: { ...options },
    });
  },
  // 取消计量提醒 
  postMeteringRemind(options) {
    console.log('postMeteringRemind options...', options)
    return API.get(`/instance/not_remind`, {
      params: { ...options },
    });
  },

  logout() {
    return API.post(`/auth/logout`);
  },
  mes_login(token){
    return API.post(`/auth/login/${token}`);
   },
};
