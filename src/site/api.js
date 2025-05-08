import API from '@/api';

const resource = '/site';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
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
    commonRequestGet(path){
        return API.get(path);
    },
    commonRequestPost(path, payload){
        return API.post(path, payload);
    }
};
