import API from '@/api';

const resource = '/transport_history';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
};
