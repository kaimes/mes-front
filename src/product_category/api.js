import API from '@/api';

const resource = '/product_category';

export default {
    getAll(options) {
        return API.get(`${resource}/cate/get`, { params: { ...options } });
    },
    get(locationId) {
        return API.get(`${resource}/cate/${locationId}`);
    },

    create(payload) { 
        return API.post(`${resource}/create`, payload);
    },

    update(payload) {
        return API.put(`${resource}/${payload.id}`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/${locationId}`);
    },
  
    commonRequestGet(path) {
        return API.get(path)
    },
    
};
