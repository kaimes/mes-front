import API from '@/api';

export default {
    getAll(options) {
        return API.get("/semi_size_detail/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/semi_size_detail/${params.id}`, params) : API.post("/semi_size_detail/", params);
    },
    remove(id) {
        return API.delete(`/semi_size_detail/${id}`);
    },
    save: (params) => params.id ? API.put(`/semi_size/${params.id}`, params) : API.post('/semi_size/', params),
    getSemiSizeById(id) {
        return API.get(`/semi_size/${id}`);
    },
};
