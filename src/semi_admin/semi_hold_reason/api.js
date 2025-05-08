import API from '@/api';

export default {
    getAll(options) {
        return API.get("/semi_hold_reason/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/semi_hold_reason/${params.id}`, params) : API.post("/semi_hold_reason/", params);
    },
    remove(id) {
        return API.delete(`/semi_hold_reason/${id}`);
    },
    getMills(options) {
        return API.get("/semi/", { params: { ...options } });
    },
};
