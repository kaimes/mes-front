import API from '@/api';

const resource = '/mill';

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
    save: (params) => params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params),
    saveMill(payload) {
        return payload.id ? API.put(`${resource}/${payload.id}`, payload) : API.post(`${resource}/`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/${locationId}`);
    },
    getMillSelect() {
        return API.get(`${resource}/data/millSelect`);
    },
};
