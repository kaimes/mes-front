import API from '@/api';

const resource = '/product_type';

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

    update(locationId, payload) {
        return API.put(`${resource}/update/${locationId}`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/delete/${locationId}`);
    },

    getSectionType(path) {
        return API.get(path)
    },

    getProductCode(path) {
        return API.get(path)
    },
    commonRequestGet(path){
        return API.get(path)
    },
    getProductTypeDim3(id){
        return API.get(`${resource}/get_product_type_dim3/${id}`)
    }
};
