import API from '@/api';

export default {
    getAll(options) {
        return API.get("/inspector/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/inspector/${params.id}`, params) : API.post("/inspector/", params);
    },
    remove(id) {
        return API.delete(`/inspector/${id}`);
    }
};
