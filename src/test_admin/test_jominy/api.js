import API from '@/api';

export default {
  getAll(options) {
    return API.get("/test_jominy/", {params: {...options}});
  },
  getCastID(options) {
    return API.get("/cast/", { params: { ...options } });
},
  add(params) {
    return params.id ? API.put(`/test_jominy/${params.id}`, params) : API.post("/test_jominy/", params);
  },
  getDetail(id) {
    return API.get(`/test_jominy/${id}`);
  },
  remove(id) {
    return API.delete(`/test_jominy/${id}`);
  },
};
