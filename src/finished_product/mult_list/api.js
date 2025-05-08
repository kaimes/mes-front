import API from '@/api';

export default {
    getAll(options) {
        return API.get("/finished_product/", { params: { ...options } });
    },
    confirmMult(params) {
        return API.put(`/finished_product/mult/confirm`, params);
    },
    getMultById(id) {
        return API.get(`/finished_product/mult/${id}`);
    },
};
