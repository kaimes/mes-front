import API from '@/api';

const resource = '/rolling/statistics';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
};
