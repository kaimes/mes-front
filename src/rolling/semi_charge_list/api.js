import API from '@/api';

export default {
    getAll(options) {
        return API.get(`/rolling/print_charge_list/${options.rolling_id}`, { params: { ...options } });
    },
};
