import API from '@/api';

export default {
    getAll(options) {
        return API.get("/cast/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/cast/${params.id}`, params) : API.post("/cast/", params);
    },
    remove(id) {
        return API.delete(`/cast/${id}`);
    },
    import(payload) {
        return API.post(`/cast/import_cast`, payload);
    },
    getlist(options) {
        return API.get("/test_chemial/", { params: { ...options } });
    },
    // 根据ID获取详情
    getDetailById: (id) => API.get(`/cast/${id}`),

    getCastDetail(options) {
      return API.get("/cast_spec/cast_spec_all", { params: { ...options } });
    },
    getSemi(castId, page, itemsPerPage) {
      return API.get(`semi/get_semi_spec/${castId}`, {
        params: {
          page,
          itemsPerPage,
        },
      });
    },
};
