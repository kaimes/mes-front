import API from '@/api';

export default {
    getAll(options) {
        return API.get("/holdreason/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/holdreason/${params.id}`, params) : API.post("/holdreason/", params);
    },
    remove(id) {
        return API.delete(`/holdreason/${id}`);
    },
    getMills(options) {
        return API.get("/semi/", { params: { ...options } });
    },
};
