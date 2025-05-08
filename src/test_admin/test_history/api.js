import API from '@/api';

const resource = '/test_history';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    confirm(id) {
        return API.put(`${resource}/confirm/${id}`);
    },
};
