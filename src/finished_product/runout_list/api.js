import API from '@/api';

const resource = '/runout';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    remove(id) {
        return API.delete(`${resource}/${id}`);
    },
};
