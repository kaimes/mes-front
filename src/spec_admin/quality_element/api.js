import API from '@/api';

export default {
  getAll(options) {
    return API.get("/quality_element/", {params: {...options}});
  },
  add(params) {
    return params.id ? API.put(`/quality_element/${params.id}`, params) : API.post("/quality_element/", params);
  },
  getDetail(id) {
    return API.get(`/quality_element/${id}`);
  },
  copyTo(before_code, after_code) {
    return API.post("/quality/copy_to", {
      before_code,
      after_code,
    });
  },
  remove(id) {
    return API.delete(`/quality/${id}`);
  },
};
