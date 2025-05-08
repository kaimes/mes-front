import API from '@/api';

export default {
  getAll(options) {
    return API.get("/spprodan/", {params: {...options}});
  },
  add(params) {
    return params.id ? API.put(`/spprodan/${params.id}`, params) : API.post("/spprodan/", params);
  },
  remove(id) {
    return API.delete(`/spprodan/${id}`);
  },
  getDetail(id) {
    return API.get(`/spprodan/${id}`);
  },
  copyTo(before_code, after_code) {
    return API.post("/spprodan/copy_to", {
      before_code,
      after_code,
    });
  },
};
