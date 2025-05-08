import API from '@/api';

const resource = '/sp_other_test';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
};
