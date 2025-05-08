import API from '@/api';

const resource = '/semi_move_history';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    }
};
