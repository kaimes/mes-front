import API from '@/api';

export default {
    getAll(options) {
        return API.get("/customer/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/customer/detail/${params.id}`, params) : API.post("/customer/create", params);
    },
    remove(id) {
        return API.delete(`/customer/${id}`);
    },
    get(id){
        return API.get(`/customer/detail/${id}`);
    }
};
