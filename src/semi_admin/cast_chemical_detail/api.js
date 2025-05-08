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

    getCastDetail(castId, q, page, itemsPerPage) {
      return API.get(`cast_spec/cast_spec_list/${castId}`, {
        params: {
          q,
          page,
          itemsPerPage,
        },
      });
    },
    getSemi(castId, page, itemsPerPage) {
      return API.get(`semi/get_semi_spec/${castId}`, {
        params: {
          page,
          itemsPerPage,
        },
      });
    },
    getMainElement(params){
      return API.get(`spmainel/union_other`, {
        params: params
      });
    },

    getQualityMainel(qualityId){
      return API.get(`cast/cast_quality/item/${qualityId}`);
    },
    run_end_use(id){
      return API.post(`/cast_spec/run_end_use_sct/${id}`);
     },
     authorize(id){
      return API.put(`/cast/authorize_date/${id}`);
     }
};
