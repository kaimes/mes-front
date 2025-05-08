import API from '@/api';

export default {
  getAll(options) {
    return API.get("/spmainel/", {params: {...options}});
  },
  add(params) {
    return params.id ? API.put(`/spmainel/${params.id}`, params) : API.post("/spmainel/", params);
  },
  getDetail(id) {
    return API.get(`/spmainel/${id}`);
  },
  copyTo(before_code, after_code) {
    return API.post("/spmainel/copy_to", {
      before_code,
      after_code,
    });
  },
  remove(id) {
    return API.delete(`/spmainel/${id}`);
  },
};
