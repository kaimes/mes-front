import API from '@/api';

export default {
    getAll(options) {
        return API.get("/finished_product_stock_level/", { params: { ...options } });
    },

};
