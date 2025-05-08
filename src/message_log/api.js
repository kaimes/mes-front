import API from '@/api';

const resource = '/message_log';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    get(locationId) {
        return API.get(`${resource}/${locationId}`);
    },

    create(payload) {
        return API.post(`${resource}/`, payload);
    },
    repeat(payload) {
           return API.get(`${resource}/${payload}`);
    }
};
