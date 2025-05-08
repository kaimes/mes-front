import API from '@/api';

const resource = '/order_item';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    
    getByOrderId(orderId)  {
        return API.get(`${resource}/order_id/${orderId}`);
    },

    getRolling(options) {
        return API.get(`rolling/`, { params: { ...options } });
    },
    
    get(locationId) {
        return API.get(`${resource}/${locationId}`);
    },

    create(payload) {
        return API.post(`${resource}/`, payload);
    },

    update(payload) {
        return API.put(`${resource}/${payload.id}`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/${locationId}`);
    },
    move(params) {
        return API.post(`${resource}/move`, params);
    },
    hasOrderItem(rollingId){
        return API.get(`${resource}/has_order_item/${rollingId}`);
    }
};
