import API from '@/api';

const resource = '/semi_size';

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

    delete(semi_size_id) {
        return API.delete(`${resource}/${semi_size_id}`);
    }
};
