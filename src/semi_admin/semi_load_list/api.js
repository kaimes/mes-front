import API from '@/api';

export default {
    getAll(options) {
        return API.get("/semi_load/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/semi_load/${params.id}`, params) : API.post("/semi_load/", params);
    },
    remove(id) {
        return API.delete(`/semi_load/${id}`);
    },
    confirmReceiving:(params) => API.post(`/semi_load/update_status`, params),

    castQualityCompare: (ids) => API.post(`/cast/cast_quality/compare`, { semi_load_ids: ids }),

    dispatch:(params) => API.post(`/semi_load/dispatch`, params),

};
