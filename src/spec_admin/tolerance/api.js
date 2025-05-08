import API from '@/api';

const resource = '/tolerance';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },

    create(payload) {
        return API.post(`${resource}/`, payload);
    },

    update(payload) {
        return API.put(`${resource}/${payload.id}`, payload);
    },

    delete(tolerance_id) {
        return API.delete(`${resource}/${tolerance_id}`);
    }
};
