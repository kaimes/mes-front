import API from '@/api';

export default {
    getAll(options) {
        return API.get("/transport/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/transport/${params.id}`, params) : API.post("/transport/", params);
    },
    remove(id) {
        return API.delete(`/transport/${id}`);
    },
    getMills(options) {
        return API.get("/semi/", { params: { ...options } });
    },
    onLoad(params) {
        return API.put("/transport/on_load", params);
    },
    deLoad(params) {
        return API.put("/transport/de_load", params);
    }
};
