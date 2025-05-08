import API from '@/api';

const resource = '/test_prodan';
export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params);
    },
    remove(id) {
        return API.delete(`${resource}/${id}`);
    }
};
