import API from '@/api';

const resource = '/product_size';
export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`${resource}/update/${params.id}`, params) : API.post(`${resource}/create`, params);
    },
    remove(id) {
        return API.delete(`${resource}/${id}`);
    }
};
