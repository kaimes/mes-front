import API from '@/api';

const resource = '/product_class';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    get(locationId) {
        return API.get(`${resource}/${locationId}`);
    },

    create(payload) { 
        return API.post(`${resource}/create`, payload);
    },

    update(payload) {
        return API.put(`${resource}/update/${payload.id}`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/${locationId}`);
    },

    getSectionType(path) {
        return API.get(path)
    },

    commonRequestGet(path) {
        return API.get(path)
    }
};
