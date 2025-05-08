import API from "@/api";

const resource = "/sp_various";

export default {
  getAll(options) {
    return API.get(`${resource}/`, { params: { ...options } });
  },
};
