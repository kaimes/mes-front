import API from '@/api';

export default {
  getAll(options) {
    return API.get("/test_job/", {params: {...options}});
  },
  getTest(options) {
    return API.get("/test/", {params: {...options}});
  },
  save(params) {
    return params.id ? API.put(`/test_job/${params.id}`, params) : API.post("/test_job/", params);
  },
  getDetail(id) {
    return API.get(`/test_job/${id}`);
  },
  remove(id) {
    return API.delete(`/test_job/${id}`);
  },
};
