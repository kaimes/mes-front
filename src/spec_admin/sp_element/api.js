import API from '@/api';

const resource = '/sp_element';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
};
