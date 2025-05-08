import API from '@/api';

export default {
    getAll(options) {
        return API.get("/order_item/order_items/statistics", { params: { ...options } });
    },
};
