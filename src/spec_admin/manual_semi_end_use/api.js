import API from '@/api';

export default {
    getAll(options) {
        return API.get("/semi_end_use_manual/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/semi_end_use_manual/${params.id}`, params) : API.post("/semi_end_use_manual/bulk_create", params);
    },
    remove(id) {
        return API.delete(`/semi_end_use_manual/${id}`);
    },
};
