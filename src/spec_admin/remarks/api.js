import API from '@/api';

const resource = '/sp_obs';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
};
