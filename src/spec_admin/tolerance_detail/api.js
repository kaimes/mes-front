import API from '@/api';

export default {
    getAll(options) {
        return API.get("/tolerance_detail/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/tolerance_detail/${params.id}`, params) : API.post("/tolerance_detail/", params);
    },
    remove(id) {
        return API.delete(`/tolerance_detail/${id}`);
    },
    save: (params) => params.id ? API.put(`/tolerance/${params.id}`, params) : API.post('/tolerance/', params),
    getToleranceById(id) {
        return API.get(`/tolerance/${id}`);
    },
};
