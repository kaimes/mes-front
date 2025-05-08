import API from '@/api';

const resource = '/finished_product_history';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
};
