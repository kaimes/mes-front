import API from '@/api';

export default {
    getAll(options) {
        return API.get("/customer/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/customer/${params.id}`, params) : API.post("/customer/", params);
    },
    remove(id) {
        return API.delete(`/customer/${id}`);
    },

};
