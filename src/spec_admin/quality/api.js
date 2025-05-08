import API from '@/api';

export default {
    getAll(options) {
        return API.get("/quality/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/quality/${params.id}`, params) : API.post("/quality/", params);
    },
    remove(id) {
        return API.delete(`/quality/${id}`);
    }
};
