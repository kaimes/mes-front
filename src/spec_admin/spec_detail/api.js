import API from '@/api';

const resource = '/spec';

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
    // 保存/修改
    save: (params) => params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params),

    getChildrenSpec(payload) {
        return API.post(`${resource}/data/childrenspec`, payload);
    },
    getSrsmSpecCode(payload) {
        return API.post(`${resource}/data/srsmspeccode`, payload);
    },
    commonGetRequest(path){
        return API.get(path)
    },
    commonDeleteRequest(path, payload){
        return API.post(path, payload)
    },
    commonAddRequest(path, payload){
        return API.post(path, payload)
    },

    commonUpdateRequest(path, payload){
        return API.put(path, payload)
    },

    deleteRequest(path){
        return API.delete(path)
    },
    updateSuspended(locationId) {
        return API.get(`${resource}/update_suspended/${locationId}`);
    },

};
